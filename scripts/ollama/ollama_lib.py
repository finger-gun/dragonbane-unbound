#!/usr/bin/env python3

from __future__ import annotations

import json
import os
import platform
import re
import shutil
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple


ROOT_DIR = Path(__file__).resolve().parents[2]


def slugify(name: str) -> str:
    s = name.strip().lower()
    s = re.sub(r"\s+", "_", s)
    s = re.sub(r"[^a-z0-9_]+", "", s)
    s = re.sub(r"_+", "_", s).strip("_")
    return s or "image"


@dataclass(frozen=True)
class PromptItem:
    name: str
    prompt: str


def read_kin_prompts_md(md_path: Path) -> List[PromptItem]:
    text = md_path.read_text(encoding="utf-8")
    lines = text.splitlines()

    prompts: List[PromptItem] = []
    current_name: str | None = None
    in_code = False
    buf: List[str] = []

    def flush() -> None:
        nonlocal current_name, buf
        if current_name and buf:
            prompt_text = "\n".join(buf).strip()
            if prompt_text:
                prompts.append(PromptItem(name=current_name, prompt=prompt_text))
        buf = []

    for line in lines:
        m = re.match(r"^##\s+(.+?)\s*$", line)
        if m and not in_code:
            flush()
            current_name = m.group(1).strip()
            continue

        if line.strip().startswith("```"):
            in_code = not in_code
            if in_code:
                buf = []
            continue

        if in_code:
            buf.append(line)

    flush()
    return prompts


def _fail_unknown_keys(where: str, unknown: List[str]) -> None:
    raise SystemExit(
        f"Unknown/disallowed keys at {where}: " + ", ".join(sorted(unknown))
    )


def validate_job_config(cfg: Dict[str, Any]) -> None:
    allowed_top = {
        "version",
        "backend",
        "model",
        "generate",
        "source",
        "items",
        "output",
    }
    unknown = [k for k in cfg.keys() if k not in allowed_top]
    if unknown:
        _fail_unknown_keys("root", unknown)

    def validate_obj(obj: Any, allowed: set[str], where: str) -> None:
        if obj is None:
            return
        if not isinstance(obj, dict):
            raise SystemExit(f"Expected object at {where}")
        unknown2 = [k for k in obj.keys() if k not in allowed]
        if unknown2:
            _fail_unknown_keys(where, unknown2)

    validate_obj(
        cfg.get("generate"),
        {"width", "height", "steps", "seed", "negative", "timeout_s", "prompt_prefix"},
        "generate",
    )
    validate_obj(cfg.get("source"), {"type", "path"}, "source")
    validate_obj(cfg.get("output"), {"dir", "overwrite", "ext"}, "output")

    items = cfg.get("items")
    if items is not None:
        if not isinstance(items, list):
            raise SystemExit("items must be an array")
        for i, it in enumerate(items):
            if not isinstance(it, dict):
                raise SystemExit(f"items[{i}] must be an object")
            unknown3 = [k for k in it.keys() if k not in {"name", "prompt"}]
            if unknown3:
                _fail_unknown_keys(f"items[{i}]", unknown3)


def load_data_file(path: Path) -> Dict[str, Any]:
    suffix = path.suffix.lower()
    if suffix == ".json":
        return json.loads(path.read_text(encoding="utf-8"))
    if suffix in {".yaml", ".yml"}:
        # Avoid requiring PyYAML in system python; try to parse via python if present.
        try:
            import yaml  # type: ignore

            data = yaml.safe_load(path.read_text(encoding="utf-8"))
            if data is None:
                return {}
            if not isinstance(data, dict):
                raise SystemExit(f"Config must be an object at top-level: {path}")
            return data
        except Exception:
            raise SystemExit(
                "YAML config requires PyYAML. Use JSON, or install PyYAML in your python."
            )
    raise SystemExit(f"Unsupported config type: {path} (use .json/.yaml)")


def ensure_ollama_present(*, auto_install: bool) -> None:
    if shutil.which("ollama"):
        return

    system = platform.system().lower()
    if not auto_install:
        raise SystemExit(
            "Ollama is not installed (missing `ollama`).\n"
            "Install from: https://ollama.com/download"
        )

    if system != "darwin":
        raise SystemExit(
            "Automatic Ollama install is only implemented for macOS right now.\n"
            "Install from: https://ollama.com/download"
        )

    # Prefer Homebrew if present.
    if shutil.which("brew"):
        subprocess.check_call(["brew", "install", "ollama"])  # idempotent
        return

    raise SystemExit(
        "Ollama is not installed and Homebrew was not found.\n"
        "Install Ollama from: https://ollama.com/download\n"
        "(or install Homebrew and rerun setup)"
    )


def ollama_pull(model: str) -> None:
    subprocess.check_call(["ollama", "pull", model])


def _list_image_files(dir_path: Path) -> List[Path]:
    exts = {".png", ".jpg", ".jpeg", ".webp"}
    out: List[Path] = []
    for p in dir_path.iterdir():
        if p.is_file() and p.suffix.lower() in exts:
            out.append(p)
    out.sort(key=lambda p: p.stat().st_mtime)
    return out


def ollama_generate_image(
    *,
    model: str,
    prompt: str,
    width: int | None,
    height: int | None,
    steps: int | None,
    seed: int | None,
    negative: str | None,
    timeout_s: int | None,
) -> bytes:
    # Ollama saves generated images to the current directory.
    # Run inside a temp dir and return the produced image bytes.
    with tempfile.TemporaryDirectory(prefix="dbu-ollama-img-") as td:
        d = Path(td)
        before = set(_list_image_files(d))

        cmd = ["ollama", "run", model, prompt]
        if width is not None:
            cmd += ["--width", str(width)]
        if height is not None:
            cmd += ["--height", str(height)]
        if steps is not None:
            cmd += ["--steps", str(steps)]
        if seed is not None:
            cmd += ["--seed", str(seed)]
        if negative:
            cmd += ["--negative", negative]

        subprocess.check_call(cmd, cwd=str(d), timeout=timeout_s)

        after = _list_image_files(d)
        produced = [p for p in after if p not in before]
        if not produced:
            raise SystemExit(
                "Ollama did not produce an image file in the output directory"
            )
        # Return the newest file bytes.
        return produced[-1].read_bytes()

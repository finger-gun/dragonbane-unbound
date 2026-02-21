#!/usr/bin/env python3

from __future__ import annotations

import json
import os
import random
import re
import subprocess
import time
import urllib.parse
import urllib.request
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


def http_json(url: str, payload: dict | None = None, timeout_s: int = 60) -> dict:
    data = None
    headers = {"Content-Type": "application/json"}
    method = "GET"
    if payload is not None:
        method = "POST"
        data = json.dumps(payload).encode("utf-8")

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=timeout_s) as resp:
        body = resp.read().decode("utf-8")
        return json.loads(body)


def http_get_bytes(url: str, timeout_s: int = 120) -> bytes:
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req, timeout=timeout_s) as resp:
        return resp.read()


def comfy_txt2img_workflow(
    *,
    ckpt_name: str,
    positive: str,
    negative: str,
    seed: int,
    steps: int,
    cfg: float,
    sampler_name: str,
    scheduler: str,
    width: int,
    height: int,
    filename_prefix: str,
) -> dict:
    # Minimal text-to-image workflow.
    # Node IDs are strings because ComfyUI expects them as object keys.
    return {
        "1": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {"ckpt_name": ckpt_name},
        },
        "2": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": positive, "clip": ["1", 1]},
        },
        "3": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": negative, "clip": ["1", 1]},
        },
        "4": {
            "class_type": "EmptyLatentImage",
            "inputs": {"width": width, "height": height, "batch_size": 1},
        },
        "5": {
            "class_type": "KSampler",
            "inputs": {
                "model": ["1", 0],
                "positive": ["2", 0],
                "negative": ["3", 0],
                "latent_image": ["4", 0],
                "seed": seed,
                "steps": steps,
                "cfg": cfg,
                "sampler_name": sampler_name,
                "scheduler": scheduler,
                "denoise": 1,
            },
        },
        "6": {
            "class_type": "VAEDecode",
            "inputs": {"samples": ["5", 0], "vae": ["1", 2]},
        },
        "7": {
            "class_type": "SaveImage",
            "inputs": {"filename_prefix": filename_prefix, "images": ["6", 0]},
        },
    }


def wait_for_history(server: str, prompt_id: str, timeout_s: int = 1800) -> dict:
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        hist = http_json(f"{server}/history/{prompt_id}")
        if prompt_id in hist:
            return hist[prompt_id]
        time.sleep(0.75)
    raise TimeoutError(f"Timed out waiting for prompt_id={prompt_id}")


def extract_first_image_from_history(
    history_item: dict, save_node_id: str = "7"
) -> Tuple[str, str, str]:
    outputs = history_item.get("outputs", {})
    node_out = outputs.get(save_node_id, {})
    images = node_out.get("images", [])
    if not images:
        raise RuntimeError(
            f"No images found in history outputs for node {save_node_id}"
        )
    img0 = images[0]
    filename = img0.get("filename")
    subfolder = img0.get("subfolder", "")
    img_type = img0.get("type", "output")
    if not filename:
        raise RuntimeError("History image entry missing filename")
    return filename, subfolder, img_type


def list_checkpoint_files(checkpoints_dir: Path) -> List[str]:
    if not checkpoints_dir.exists():
        return []
    exts = {".safetensors", ".ckpt", ".pt"}
    files = [
        p.name
        for p in checkpoints_dir.iterdir()
        if p.is_file() and p.suffix.lower() in exts
    ]
    files.sort(key=str.lower)
    return files


def resolve_checkpoint_name(
    ckpt_arg: str | None,
    checkpoint_dirs: Iterable[Path],
    *,
    env_var: str = "COMFYUI_CKPT",
) -> Tuple[str, Path]:
    # Priority:
    # 1) explicit ckpt
    # 2) COMFYUI_CKPT env var
    # 3) auto if exactly one checkpoint across all dirs
    env_ckpt = os.environ.get(env_var)
    requested = (ckpt_arg or env_ckpt or "").strip() or None

    available: List[Tuple[str, Path]] = []
    for d in checkpoint_dirs:
        for name in list_checkpoint_files(d):
            available.append((name, d))

    def find_match(name: str) -> Tuple[str, Path] | None:
        base = Path(name).name
        for n, d in available:
            if n == name or n == base:
                return (n, d)
        return None

    if requested:
        match = find_match(requested)
        if match:
            return match

        pretty = "\n  - ".join([n for n, _ in available] or ["(none found)"])
        raise SystemExit(
            "Checkpoint not found: "
            + requested
            + "\nAvailable checkpoints:\n  - "
            + pretty
        )

    if len(available) == 1:
        return available[0]

    pretty = "\n  - ".join([n for n, _ in available] or ["(none found)"])
    raise SystemExit(
        "No checkpoint selected. Either:\n"
        + '  - pass --ckpt "<filename>"\n'
        + f'  - or set {env_var}="<filename>"\n\n'
        + "Available checkpoints:\n  - "
        + pretty
    )


def poll_server_ready(server: str, *, timeout_s: int = 30) -> None:
    deadline = time.time() + timeout_s
    last_err: Exception | None = None
    while time.time() < deadline:
        try:
            http_json(f"{server.rstrip('/')}/system_stats", timeout_s=5)
            return
        except Exception as e:
            last_err = e
            time.sleep(0.5)
    raise SystemExit(f"ComfyUI not reachable at {server}: {last_err}")


def start_comfyui_server(
    *,
    comfy_dir: Path,
    host: str,
    port: int,
    extra_model_paths_yaml: Path | None,
) -> subprocess.Popen[bytes]:
    venv_dir = comfy_dir / ".venv"
    py = venv_dir / "bin/python"
    if not py.exists():
        py = venv_dir / "Scripts/python.exe"
    if not py.exists():
        raise SystemExit(
            f"ComfyUI venv python not found under: {venv_dir}\n"
            "Run setup first (e.g., python3 scripts/comfyui/comfyui.py setup)."
        )

    args: List[str] = [
        str(py),
        str(comfy_dir / "main.py"),
        "--listen",
        host,
        "--port",
        str(port),
    ]
    if extra_model_paths_yaml and extra_model_paths_yaml.exists():
        args += ["--extra-model-paths-config", str(extra_model_paths_yaml)]

    # Inherit stdio so the user can see ComfyUI logs.
    return subprocess.Popen(args)


def load_data_file(path: Path) -> Dict[str, Any]:
    suffix = path.suffix.lower()
    if suffix == ".json":
        return json.loads(path.read_text(encoding="utf-8"))
    if suffix in {".yaml", ".yml"}:
        try:
            import yaml  # type: ignore
        except Exception as e:
            # Prefer not to require PyYAML in the system python. If available,
            # parse using the ComfyUI venv python (setup installs PyYAML there).
            venv_py = ROOT_DIR / "tools/ComfyUI/.venv/bin/python"
            if not venv_py.exists():
                venv_py = ROOT_DIR / "tools/ComfyUI/.venv/Scripts/python.exe"
            if venv_py.exists():
                code = (
                    "import sys, json; from pathlib import Path; "
                    "import yaml; "
                    "data=yaml.safe_load(Path(sys.argv[1]).read_text(encoding='utf-8')); "
                    "print(json.dumps(data or {}))"
                )
                try:
                    out = subprocess.check_output(
                        [str(venv_py), "-c", code, str(path)], text=True
                    )
                    data2 = json.loads(out)
                    if not isinstance(data2, dict):
                        raise SystemExit(
                            f"Config must be an object at top-level: {path}"
                        )
                    return data2
                except Exception as e2:
                    raise SystemExit(
                        "Failed to parse YAML via ComfyUI venv. Try rerunning setup:\n"
                        "  python3 scripts/comfyui/comfyui.py setup\n"
                        f"Error: {e2}"
                    )

            raise SystemExit(
                "YAML config requires PyYAML (either in your python or the ComfyUI venv).\n"
                "Fix (recommended): python3 scripts/comfyui/comfyui.py setup\n"
                f"Import error: {e}"
            )

        data = yaml.safe_load(path.read_text(encoding="utf-8"))
        if data is None:
            return {}
        if not isinstance(data, dict):
            raise SystemExit(f"Config must be an object at top-level: {path}")
        return data
    raise SystemExit(f"Unsupported config type: {path} (use .json/.yaml)")


def _fail_unknown_keys(where: str, unknown: List[str]) -> None:
    unknown_sorted = ", ".join(sorted(unknown))
    raise SystemExit(f"Unknown/disallowed keys at {where}: {unknown_sorted}")


def validate_job_config(cfg: Dict[str, Any]) -> None:
    allowed_top = {
        "version",
        "server",
        "comfyui",
        "checkpoint",
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
        cfg.get("server"),
        {"url", "start", "host", "port", "ready_timeout_s"},
        "server",
    )
    validate_obj(
        cfg.get("comfyui"),
        {"dir", "python", "extra_model_paths"},
        "comfyui",
    )
    validate_obj(
        cfg.get("checkpoint"),
        {"name", "search_dirs"},
        "checkpoint",
    )
    validate_obj(
        cfg.get("generate"),
        {
            "width",
            "height",
            "steps",
            "cfg",
            "sampler",
            "scheduler",
            "negative",
            "seed",
            "timeout_s",
        },
        "generate",
    )
    gen = cfg.get("generate")
    if isinstance(gen, dict):
        validate_obj(gen.get("seed"), {"mode", "value"}, "generate.seed")
    validate_obj(
        cfg.get("source"),
        {"type", "path"},
        "source",
    )
    validate_obj(
        cfg.get("output"),
        {"dir", "overwrite", "ext"},
        "output",
    )

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


def choose_seed(*, mode: str, base_seed: int | None, idx: int) -> int:
    if mode == "random":
        return random.randint(1, 2**31 - 1)
    # fixed
    if base_seed is None:
        raise SystemExit("seed.mode=fixed requires seed.value")
    return base_seed + idx

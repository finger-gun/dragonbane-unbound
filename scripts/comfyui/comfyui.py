#!/usr/bin/env python3

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import urllib.parse
from pathlib import Path
from typing import List

from comfyui_lib import (
    ROOT_DIR,
    choose_seed,
    comfy_txt2img_workflow,
    extract_first_image_from_history,
    http_get_bytes,
    http_json,
    load_data_file,
    list_checkpoint_files,
    poll_server_ready,
    read_kin_prompts_md,
    resolve_checkpoint_name,
    slugify,
    start_comfyui_server,
    validate_job_config,
    wait_for_history,
)


def _default_comfy_dir() -> Path:
    return ROOT_DIR / "tools/ComfyUI"


def _default_extra_model_paths() -> Path:
    return ROOT_DIR / "scripts/comfyui/extra_model_paths.yaml"


def _default_checkpoints_dir(comfy_dir: Path) -> Path:
    return comfy_dir / "models/checkpoints"


def _which_or_exit(bin_name: str, *, hint: str) -> str:
    p = shutil.which(bin_name)
    if p:
        return p
    raise SystemExit(f"Missing {bin_name}.\n{hint}")


def cmd_setup(args: argparse.Namespace) -> int:
    py_bin = args.python
    if not shutil.which(py_bin):
        raise SystemExit(
            f"Missing {py_bin}. Install Python 3.11 and try again, or pass --python python3.\n"
            "Tip (macOS): brew install python@3.11"
        )

    git = _which_or_exit(
        "git",
        hint="Install git (Xcode Command Line Tools) and try again.",
    )

    comfy_dir = Path(args.comfy_dir).resolve()
    (ROOT_DIR / "tools").mkdir(parents=True, exist_ok=True)

    if not comfy_dir.exists():
        print(f"Cloning ComfyUI into {comfy_dir} ...")
        subprocess.check_call(
            [
                git,
                "clone",
                "https://github.com/comfyanonymous/ComfyUI.git",
                str(comfy_dir),
            ]
        )
    else:
        print(f"Found existing: {comfy_dir}")
        if args.update:
            print("Updating ComfyUI (git pull --ff-only) ...")
            subprocess.check_call([git, "-C", str(comfy_dir), "pull", "--ff-only"])

    venv_dir = comfy_dir / ".venv"
    if not venv_dir.exists():
        print("Creating venv ...")
        subprocess.check_call([py_bin, "-m", "venv", str(venv_dir)])

    pip = venv_dir / "bin/pip"
    if not pip.exists():
        pip = venv_dir / "Scripts/pip.exe"
    if not pip.exists():
        raise SystemExit(f"pip not found under {venv_dir}. Your venv may be corrupted.")

    req_path = comfy_dir / "requirements.txt"
    req_bytes = req_path.read_bytes() if req_path.exists() else b""
    req_hash = hashlib.sha256(req_bytes).hexdigest()
    marker = venv_dir / ".dragonbane_comfyui_setup.json"
    runner_deps = ["pyyaml", "huggingface-hub"]

    needs_install = True
    if marker.exists() and not args.reinstall:
        try:
            prev = json.loads(marker.read_text(encoding="utf-8"))
            if (
                isinstance(prev, dict)
                and prev.get("requirements_sha256") == req_hash
                and prev.get("runner_deps") == runner_deps
            ):
                needs_install = False
        except Exception:
            needs_install = True

    if needs_install:
        print("Installing Python dependencies (this can take a while) ...")
        subprocess.check_call([str(pip), "install", "-U", "pip"])
        if req_path.exists():
            subprocess.check_call([str(pip), "install", "-r", str(req_path)])
        subprocess.check_call([str(pip), "install", *runner_deps])
        marker.write_text(
            json.dumps(
                {"requirements_sha256": req_hash, "runner_deps": runner_deps},
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
    else:
        print(
            "Environment looks healthy; skipping dependency install (use --reinstall to force)."
        )

    print()
    print("Done.")
    print("- Start server: python3 scripts/comfyui/comfyui.py run-server")
    print("- Doctor:      python3 scripts/comfyui/comfyui.py doctor")
    print(
        "- Generate:    python3 scripts/comfyui/comfyui.py generate --job scripts/comfyui/jobs/kins.example.yaml"
    )
    return 0


def cmd_run_server(args: argparse.Namespace) -> int:
    comfy_dir = Path(args.comfy_dir).resolve()
    extra = (
        Path(args.extra_model_paths).resolve()
        if args.extra_model_paths
        else _default_extra_model_paths()
    )

    proc = start_comfyui_server(
        comfy_dir=comfy_dir,
        host=args.host,
        port=args.port,
        extra_model_paths_yaml=extra,
    )
    return proc.wait()


def cmd_doctor(args: argparse.Namespace) -> int:
    comfy_dir = Path(args.comfy_dir).resolve()
    venv_py = comfy_dir / ".venv/bin/python"
    if not venv_py.exists():
        venv_py = comfy_dir / ".venv/Scripts/python.exe"
    checkpoints_dir = _default_checkpoints_dir(comfy_dir)
    server = args.server.rstrip("/")

    problems: List[str] = []
    if args.python and not shutil.which(args.python):
        problems.append(
            f"Missing python runtime: {args.python} (install it or set PYTHON_BIN / pass --python)"
        )
    if not comfy_dir.exists():
        problems.append(f"Missing ComfyUI dir: {comfy_dir} (run setup)")
    if comfy_dir.exists() and not venv_py.exists():
        problems.append(f"Missing ComfyUI venv python: {venv_py} (run setup)")
    if not checkpoints_dir.exists():
        problems.append(
            f"Missing checkpoints dir: {checkpoints_dir} (add a checkpoint)"
        )

    if problems:
        print("Doctor found issues:")
        for p in problems:
            print(f"- {p}")
        return 2

    ckpts = list_checkpoint_files(checkpoints_dir)
    if not ckpts:
        print(
            "No checkpoints found. Put a model in tools/ComfyUI/models/checkpoints and rerun."
        )
        return 2

    # Server reachability.
    try:
        poll_server_ready(server, timeout_s=args.ready_timeout_s)
    except SystemExit as e:
        print(str(e))
        print("Tip: start ComfyUI with: python3 scripts/comfyui/comfyui.py run-server")
        return 2

    print("Doctor OK:")
    print(f"- ComfyUI dir: {comfy_dir}")
    print(f"- Venv python: {venv_py}")
    print(f"- Server:      {server}")
    print(f"- Checkpoints: {checkpoints_dir} ({len(ckpts)} found)")
    return 0


def _job_items_from_cfg(cfg: dict) -> List[tuple[str, str]]:
    items = cfg.get("items")
    if isinstance(items, list):
        out: List[tuple[str, str]] = []
        for it in items:
            if not isinstance(it, dict):
                raise SystemExit("items must contain objects")
            name = str(it.get("name") or "").strip()
            prompt = str(it.get("prompt") or "").strip()
            if not name or not prompt:
                raise SystemExit("each item requires name and prompt")
            out.append((name, prompt))
        return out

    source = cfg.get("source")
    if isinstance(source, dict):
        stype = str(source.get("type") or "").strip()
        if stype == "kin_prompts_markdown":
            md_path = source.get("path") or str(
                ROOT_DIR / "docs/character_creation/kin-profile-portrait-prompts.md"
            )
            prompts = read_kin_prompts_md(Path(md_path))
            return [(p.name, p.prompt) for p in prompts]
        raise SystemExit(f"Unknown source.type: {stype}")

    raise SystemExit("Config must include either items[] or source{type=...}")


def cmd_generate(args: argparse.Namespace) -> int:
    comfy_dir = Path(args.comfy_dir).resolve()
    server = args.server.rstrip("/")
    extra = (
        Path(args.extra_model_paths).resolve()
        if args.extra_model_paths
        else _default_extra_model_paths()
    )

    cfg: dict | None = None
    if args.job:
        cfg = load_data_file(Path(args.job))
        if not isinstance(cfg, dict):
            raise SystemExit("Job config must be an object at top-level")
        validate_job_config(cfg)

        server_raw = cfg.get("server")
        server_cfg = server_raw if isinstance(server_raw, dict) else {}
        server = str(server_cfg.get("url") or server).rstrip("/")

        comfy_raw = cfg.get("comfyui")
        comfy_cfg = comfy_raw if isinstance(comfy_raw, dict) else {}
        comfy_dir = Path(comfy_cfg.get("dir") or str(comfy_dir)).resolve()
        extra = Path(comfy_cfg.get("extra_model_paths") or str(extra)).resolve()

        if bool(server_cfg.get("start")):
            host = str(server_cfg.get("host") or "127.0.0.1")
            port = int(server_cfg.get("port") or 8188)
            print(f"Starting ComfyUI server on {host}:{port} ...")
            proc = start_comfyui_server(
                comfy_dir=comfy_dir,
                host=host,
                port=port,
                extra_model_paths_yaml=extra,
            )
            try:
                poll_server_ready(
                    server, timeout_s=int(server_cfg.get("ready_timeout_s") or 30)
                )
            except Exception:
                proc.terminate()
                raise
        else:
            poll_server_ready(server, timeout_s=args.ready_timeout_s)

        checkpoint_raw = cfg.get("checkpoint")
        checkpoint_cfg = checkpoint_raw if isinstance(checkpoint_raw, dict) else {}
        ckpt_name_cfg = checkpoint_cfg.get("name")

        checkpoint_dirs: List[Path] = [_default_checkpoints_dir(comfy_dir)]
        extra_dirs = (
            checkpoint_cfg.get("search_dirs")
            if isinstance(checkpoint_cfg, dict)
            else None
        )
        if isinstance(extra_dirs, list):
            checkpoint_dirs += [Path(str(p)).expanduser() for p in extra_dirs]

        ckpt_name, ckpt_dir = resolve_checkpoint_name(
            args.ckpt or (str(ckpt_name_cfg) if ckpt_name_cfg else None),
            checkpoint_dirs,
        )
        print(f"Checkpoint: {ckpt_name} (from {ckpt_dir})")

        gen_raw = cfg.get("generate")
        gen = gen_raw if isinstance(gen_raw, dict) else {}
        width = int(gen.get("width") or args.width)
        height = int(gen.get("height") or args.height)
        steps = int(gen.get("steps") or args.steps)
        cfg_scale = float(gen.get("cfg") or args.cfg)
        sampler = str(gen.get("sampler") or args.sampler)
        scheduler = str(gen.get("scheduler") or args.scheduler)
        negative = str(gen.get("negative") or args.negative)
        timeout_s = int(gen.get("timeout_s") or args.timeout)

        seed_raw = gen.get("seed")
        seed_obj = seed_raw if isinstance(seed_raw, dict) else {}
        seed_mode = str(seed_obj.get("mode") or "random")
        base_seed = seed_obj.get("value")
        if base_seed is not None:
            base_seed = int(base_seed)
            if seed_mode == "random":
                seed_mode = "fixed"

        out_raw = cfg.get("output")
        out_cfg = out_raw if isinstance(out_raw, dict) else {}
        out_dir = Path(out_cfg.get("dir") or str(args.out)).resolve()
        out_ext = str(out_cfg.get("ext") or "png").lstrip(".")
        overwrite = bool(out_cfg.get("overwrite") or False)

        items = _job_items_from_cfg(cfg)
    else:
        # CLI ad-hoc mode (single image).
        if not args.prompt:
            raise SystemExit("generate requires either --job <file> or --prompt <text>")
        poll_server_ready(server, timeout_s=args.ready_timeout_s)

        checkpoints_dir = _default_checkpoints_dir(comfy_dir)
        ckpt_name, ckpt_dir = resolve_checkpoint_name(args.ckpt, [checkpoints_dir])
        print(f"Checkpoint: {ckpt_name} (from {ckpt_dir})")

        width = args.width
        height = args.height
        steps = args.steps
        cfg_scale = args.cfg
        sampler = args.sampler
        scheduler = args.scheduler
        negative = args.negative
        timeout_s = args.timeout
        overwrite = args.overwrite
        out_dir = Path(args.out).resolve()
        out_ext = "png"
        seed_mode = "random" if args.seed == 0 else "fixed"
        base_seed = None if args.seed == 0 else int(args.seed)

        name = args.name or "image"
        items = [(name, args.prompt)]

    out_dir.mkdir(parents=True, exist_ok=True)

    client_id = f"dragonbane-unbound-{os.getpid()}"
    job_prefix = "dragonbane_unbound/generated"

    for idx, (name, prompt) in enumerate(items, start=1):
        slug = slugify(name)
        out_path = out_dir / f"{slug}.{out_ext}"
        if out_path.exists() and not overwrite:
            print(f"[{idx}/{len(items)}] skip (exists): {name} -> {out_path}")
            continue

        seed = choose_seed(mode=seed_mode, base_seed=base_seed, idx=idx - 1)
        prefix = f"{job_prefix}/{slug}"

        workflow = comfy_txt2img_workflow(
            ckpt_name=ckpt_name,
            positive=prompt,
            negative=negative,
            seed=seed,
            steps=steps,
            cfg=cfg_scale,
            sampler_name=sampler,
            scheduler=scheduler,
            width=width,
            height=height,
            filename_prefix=prefix,
        )

        print(f"[{idx}/{len(items)}] queue: {name} -> {out_path.name} (seed={seed})")
        try:
            resp = http_json(
                f"{server}/prompt",
                payload={"prompt": workflow, "client_id": client_id},
                timeout_s=60,
            )
        except Exception as e:
            raise SystemExit(f"Failed queue stage for '{name}': {e}")

        prompt_id = resp.get("prompt_id")
        if not prompt_id:
            raise SystemExit(
                f"ComfyUI /prompt response missing prompt_id for '{name}': {resp}"
            )

        try:
            history_item = wait_for_history(server, prompt_id, timeout_s=timeout_s)
        except Exception as e:
            raise SystemExit(f"Failed wait stage for '{name}': {e}")

        try:
            filename, subfolder, img_type = extract_first_image_from_history(
                history_item
            )
            q = urllib.parse.urlencode(
                {"filename": filename, "subfolder": subfolder, "type": img_type}
            )
            img_url = f"{server}/view?{q}"
            img_bytes = http_get_bytes(img_url, timeout_s=300)
            out_path.write_bytes(img_bytes)
        except Exception as e:
            raise SystemExit(f"Failed download stage for '{name}': {e}")

    print(f"Done. Wrote outputs to: {out_dir}")
    return 0


def main(argv: List[str]) -> int:
    ap = argparse.ArgumentParser(description="Dragonbane Unbound ComfyUI helper")
    sub = ap.add_subparsers(dest="cmd", required=True)

    p_setup = sub.add_parser("setup", help="Clone ComfyUI and install deps")
    p_setup.add_argument(
        "--python",
        default=os.environ.get("PYTHON_BIN") or "python3.11",
        help="Python binary for creating the ComfyUI venv (default: PYTHON_BIN or python3.11)",
    )
    p_setup.add_argument(
        "--comfy-dir",
        default=str(_default_comfy_dir()),
        help="Path to local ComfyUI checkout (default: tools/ComfyUI)",
    )
    p_setup.add_argument(
        "--update",
        action="store_true",
        help="If ComfyUI exists, run git pull --ff-only",
    )
    p_setup.add_argument(
        "--reinstall",
        action="store_true",
        help="Force reinstall dependencies even if setup is already complete",
    )
    p_setup.set_defaults(func=cmd_setup)

    p_run = sub.add_parser("run-server", help="Run the local ComfyUI server")
    p_run.add_argument("--comfy-dir", default=str(_default_comfy_dir()))
    p_run.add_argument("--host", default="127.0.0.1")
    p_run.add_argument("--port", type=int, default=8188)
    p_run.add_argument(
        "--extra-model-paths",
        default=None,
        help="Path to extra model paths yaml (default: scripts/comfyui/extra_model_paths.yaml if present)",
    )
    p_run.set_defaults(func=cmd_run_server)

    p_doc = sub.add_parser("doctor", help="Verify local setup and server")
    p_doc.add_argument("--comfy-dir", default=str(_default_comfy_dir()))
    p_doc.add_argument("--server", default="http://127.0.0.1:8188")
    p_doc.add_argument(
        "--python",
        default=os.environ.get("PYTHON_BIN") or "python3.11",
        help="Python runtime expected for setup (default: PYTHON_BIN or python3.11)",
    )
    p_doc.add_argument("--ready-timeout-s", type=int, default=3)
    p_doc.set_defaults(func=cmd_doctor)

    p_gen = sub.add_parser("generate", help="Generate images via ComfyUI API")
    p_gen.add_argument("--comfy-dir", default=str(_default_comfy_dir()))
    p_gen.add_argument("--server", default="http://127.0.0.1:8188")
    p_gen.add_argument("--ready-timeout-s", type=int, default=30)
    p_gen.add_argument(
        "--extra-model-paths",
        default=None,
        help="Path to extra model paths yaml (default: scripts/comfyui/extra_model_paths.yaml if present)",
    )
    p_gen.add_argument("--job", default=None, help="Job config (.json/.yaml)")
    p_gen.add_argument("--ckpt", default=None, help="Checkpoint filename")
    p_gen.add_argument("--prompt", default=None, help="Single prompt (ad-hoc mode)")
    p_gen.add_argument(
        "--name", default=None, help="Name for single output (ad-hoc mode)"
    )
    p_gen.add_argument("--out", default=str(ROOT_DIR / "assets/portraits/kins"))
    p_gen.add_argument("--overwrite", action="store_true")
    p_gen.add_argument("--width", type=int, default=1024)
    p_gen.add_argument("--height", type=int, default=1024)
    p_gen.add_argument("--steps", type=int, default=28)
    p_gen.add_argument("--cfg", type=float, default=6.0)
    p_gen.add_argument("--sampler", default="dpmpp_2m")
    p_gen.add_argument("--scheduler", default="karras")
    p_gen.add_argument(
        "--negative",
        default=(
            "low quality, worst quality, blurry, noisy, jpeg artifacts, oversaturated, "
            "text, watermark, logo, signature, frame, border, extra limbs, deformed"
        ),
    )
    p_gen.add_argument(
        "--seed",
        type=int,
        default=0,
        help="0 = random per image; otherwise fixed base seed",
    )
    p_gen.add_argument("--timeout", type=int, default=1800)
    p_gen.set_defaults(func=cmd_generate)

    args = ap.parse_args(argv)
    return int(args.func(args))


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))

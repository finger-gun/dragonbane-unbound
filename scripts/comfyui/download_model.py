#!/usr/bin/env python3

from __future__ import annotations

import argparse
import importlib
import os
import sys
from pathlib import Path


def main() -> int:
    ap = argparse.ArgumentParser(
        description="Download a checkpoint into ComfyUI models/checkpoints"
    )
    ap.add_argument(
        "--repo",
        default="stabilityai/stable-diffusion-xl-base-1.0",
        help="Hugging Face repo id (default: SDXL base)",
    )
    ap.add_argument(
        "--file",
        default="sd_xl_base_1.0.safetensors",
        help="Filename in the repo (default: SDXL base checkpoint)",
    )
    ap.add_argument(
        "--dest",
        default=None,
        help=(
            "Destination directory. Defaults to tools/ComfyUI/models/checkpoints. "
            "Directory is created if missing."
        ),
    )
    args = ap.parse_args()

    root_dir = Path(__file__).resolve().parents[2]
    default_dest = root_dir / "tools/ComfyUI/models/checkpoints"
    dest_dir = Path(args.dest) if args.dest else default_dest
    dest_dir.mkdir(parents=True, exist_ok=True)

    try:
        hf = importlib.import_module("huggingface_hub")
        hf_hub_download = getattr(hf, "hf_hub_download")
    except Exception as e:  # pragma: no cover
        # Most common cause: user ran this with system python instead
        # of the ComfyUI venv python. Re-exec with the venv if present.
        venv_py = root_dir / "tools/ComfyUI/.venv/bin/python"
        if venv_py.exists() and Path(sys.executable).resolve() != venv_py.resolve():
            os.execv(
                str(venv_py),
                [str(venv_py), str(Path(__file__).resolve()), *sys.argv[1:]],
            )
        raise SystemExit(
            "Missing dependency huggingface_hub.\n\n"
            "Fix (recommended):\n"
            "- Run with the ComfyUI venv python:\n"
            "  tools/ComfyUI/.venv/bin/python scripts/comfyui/download_model.py\n\n"
            "Or install into your current python:\n"
            "- python3 -m pip install huggingface-hub\n\n"
            f"Import error: {e}"
        )

    token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_TOKEN")

    print("Downloading...")
    print(f"  repo: {args.repo}")
    print(f"  file: {args.file}")
    print(f"  dest: {dest_dir}")
    print("  auth: " + ("HF_TOKEN set" if token else "no token"))
    print()

    try:
        cached_path = hf_hub_download(
            repo_id=args.repo,
            filename=args.file,
            token=token,
            local_dir=str(dest_dir),
            local_dir_use_symlinks=False,
            resume_download=True,
        )
    except Exception as e:
        raise SystemExit(
            "Download failed. Common causes:\n"
            "- You haven't accepted the model license on Hugging Face for this repo\n"
            "- You need an access token (set HF_TOKEN=...)\n\n"
            "Fix:\n"
            f"1) Visit: https://huggingface.co/{args.repo} and accept the license (if prompted)\n"
            "2) Create a token: https://huggingface.co/settings/tokens\n"
            "3) Export it, then rerun:\n"
            '   export HF_TOKEN="..."\n'
            "   python3 scripts/comfyui/download_model.py\n\n"
            f"Error: {e}"
        )

    print(f"Saved: {cached_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

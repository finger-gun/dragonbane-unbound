#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import os
import random
import re
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple


ROOT_DIR = Path(__file__).resolve().parents[2]
DEFAULT_PROMPTS_MD = (
    ROOT_DIR / "docs/character_creation/kin-profile-portrait-prompts.md"
)
DEFAULT_OUT_DIR = ROOT_DIR / "assets/portraits/kins"
DEFAULT_CHECKPOINTS_DIR = ROOT_DIR / "tools/ComfyUI/models/checkpoints"


@dataclass(frozen=True)
class KinPrompt:
    name: str
    prompt: str


def slugify(name: str) -> str:
    s = name.strip().lower()
    s = re.sub(r"\s+", "_", s)
    s = re.sub(r"[^a-z0-9_]+", "", s)
    s = re.sub(r"_+", "_", s).strip("_")
    return s or "kin"


def read_kin_prompts(md_path: Path) -> List[KinPrompt]:
    text = md_path.read_text(encoding="utf-8")
    lines = text.splitlines()

    prompts: List[KinPrompt] = []
    current_name: str | None = None
    in_code = False
    buf: List[str] = []

    def flush() -> None:
        nonlocal current_name, buf
        if current_name and buf:
            prompt_text = "\n".join(buf).strip()
            if prompt_text:
                prompts.append(KinPrompt(name=current_name, prompt=prompt_text))
        buf = []

    for line in lines:
        m = re.match(r"^##\s+(.+?)\s*$", line)
        if m and not in_code:
            flush()
            current_name = m.group(1).strip()
            continue

        if line.strip().startswith("```"):
            if in_code:
                in_code = False
                # close; keep collecting until next heading
            else:
                in_code = True
                buf = []
            continue

        if in_code:
            buf.append(line)

    flush()
    return prompts


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


def resolve_checkpoint_name(ckpt_arg: str | None, checkpoints_dir: Path) -> str:
    # Priority:
    # 1) explicit --ckpt
    # 2) COMFYUI_CKPT env var
    # 3) auto if exactly one checkpoint in directory
    env_ckpt = os.environ.get("COMFYUI_CKPT")
    ckpt_name = (ckpt_arg or env_ckpt or "").strip() or None

    available = list_checkpoint_files(checkpoints_dir)
    if ckpt_name:
        if ckpt_name in available:
            return ckpt_name
        ckpt_basename = Path(ckpt_name).name
        if ckpt_basename in available:
            return ckpt_basename
        raise SystemExit(
            "Checkpoint not found: "
            + ckpt_name
            + "\nAvailable checkpoints in "
            + str(checkpoints_dir)
            + ":\n  - "
            + "\n  - ".join(available or ["(none found)"])
        )

    if len(available) == 1:
        return available[0]

    raise SystemExit(
        "No checkpoint selected. Put a model in "
        + str(checkpoints_dir)
        + " and either:\n"
        + '  - pass --ckpt "<filename>"\n'
        + '  - or set COMFYUI_CKPT="<filename>"\n\n'
        + "Available checkpoints:\n  - "
        + "\n  - ".join(available or ["(none found)"])
    )


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


def comfy_workflow(
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


def main() -> int:
    ap = argparse.ArgumentParser(
        description="Batch-generate kin profile portraits via ComfyUI API"
    )
    ap.add_argument(
        "--server", default="http://127.0.0.1:8188", help="ComfyUI server base URL"
    )
    ap.add_argument(
        "--prompts", default=str(DEFAULT_PROMPTS_MD), help="Markdown file with prompts"
    )
    ap.add_argument(
        "--out", default=str(DEFAULT_OUT_DIR), help="Output directory in this repo"
    )
    ap.add_argument(
        "--ckpt",
        default=None,
        help=(
            "Checkpoint filename in tools/ComfyUI/models/checkpoints. "
            "If omitted, uses COMFYUI_CKPT or auto-selects when only one is present."
        ),
    )
    ap.add_argument("--width", type=int, default=1024)
    ap.add_argument("--height", type=int, default=1024)
    ap.add_argument("--steps", type=int, default=28)
    ap.add_argument("--cfg", type=float, default=6.0)
    ap.add_argument("--sampler", default="dpmpp_2m")
    ap.add_argument("--scheduler", default="karras")
    ap.add_argument(
        "--negative",
        default=(
            "low quality, worst quality, blurry, noisy, jpeg artifacts, oversaturated, "
            "text, watermark, logo, signature, frame, border, extra limbs, deformed"
        ),
    )
    ap.add_argument("--seed", type=int, default=0, help="0 = random per image")
    ap.add_argument(
        "--timeout", type=int, default=1800, help="Per-image timeout in seconds"
    )
    args = ap.parse_args()

    server = args.server.rstrip("/")
    prompts_path = Path(args.prompts)
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    ckpt_name = resolve_checkpoint_name(args.ckpt, DEFAULT_CHECKPOINTS_DIR)

    kin_prompts = read_kin_prompts(prompts_path)
    if not kin_prompts:
        raise SystemExit(f"No prompts found in {prompts_path}")

    # Basic reachability check.
    try:
        http_json(f"{server}/system_stats")
    except Exception as e:
        raise SystemExit(
            f"Cannot reach ComfyUI at {server}. Start it with scripts/comfyui/run_server.sh\n{e}"
        )

    client_id = f"dragonbane-unbound-{os.getpid()}"

    for idx, kp in enumerate(kin_prompts, start=1):
        slug = slugify(kp.name)
        prefix = f"dragonbane_unbound/kins/{slug}"
        out_path = out_dir / f"{slug}.png"

        seed = args.seed
        if seed == 0:
            seed = random.randint(1, 2**31 - 1)
        else:
            seed = seed + idx - 1

        workflow = comfy_workflow(
            ckpt_name=ckpt_name,
            positive=kp.prompt,
            negative=args.negative,
            seed=seed,
            steps=args.steps,
            cfg=args.cfg,
            sampler_name=args.sampler,
            scheduler=args.scheduler,
            width=args.width,
            height=args.height,
            filename_prefix=prefix,
        )

        print(f"[{idx}/{len(kin_prompts)}] queue: {kp.name} -> {out_path.name}")
        resp = http_json(
            f"{server}/prompt",
            payload={"prompt": workflow, "client_id": client_id},
            timeout_s=60,
        )
        prompt_id = resp.get("prompt_id")
        if not prompt_id:
            raise SystemExit(f"ComfyUI /prompt response missing prompt_id: {resp}")

        history_item = wait_for_history(server, prompt_id, timeout_s=args.timeout)
        filename, subfolder, img_type = extract_first_image_from_history(
            history_item, save_node_id="7"
        )

        q = urllib.parse.urlencode(
            {
                "filename": filename,
                "subfolder": subfolder,
                "type": img_type,
            }
        )
        img_url = f"{server}/view?{q}"
        img_bytes = http_get_bytes(img_url, timeout_s=300)
        out_path.write_bytes(img_bytes)

    print(f"Done. Wrote {len(kin_prompts)} image(s) to: {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

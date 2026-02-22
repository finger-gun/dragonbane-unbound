#!/usr/bin/env python3

from __future__ import annotations

import argparse
import subprocess
import shutil
import sys
from pathlib import Path
from typing import List

from ollama_lib import (
    ROOT_DIR,
    ensure_ollama_present,
    load_data_file,
    ollama_generate_image,
    ollama_pull,
    read_kin_prompts_md,
    slugify,
    validate_job_config,
)


DEFAULT_MODEL = "x/z-image-turbo"


def cmd_setup(args: argparse.Namespace) -> int:
    ensure_ollama_present(auto_install=not args.no_install)
    print("Ollama OK.")
    if args.pull:
        model = args.model or DEFAULT_MODEL
        print(f"Pulling model: {model}")
        ollama_pull(model)
    print("Done.")
    return 0


def cmd_doctor(args: argparse.Namespace) -> int:
    try:
        ensure_ollama_present(auto_install=False)
    except SystemExit as e:
        print(str(e))
        return 2

    # Verify image-generation flags exist (best-effort).
    try:
        help_text = subprocess.check_output(
            ["ollama", "run", "--help"], text=True, stderr=subprocess.STDOUT
        )
    except Exception as e:
        print(f"Failed to execute `ollama run --help`: {e}")
        return 2

    if "Image Generation Flags" not in help_text:
        print("Ollama is installed, but image generation flags were not detected.")
        print(
            "This may mean your Ollama version does not support image generation yet."
        )
        print("Update Ollama and try again.")
        return 2

    model = args.model or DEFAULT_MODEL
    if args.pull:
        print(f"Pulling model: {model}")
        ollama_pull(model)

    if args.smoke_generate:
        try:
            _ = ollama_generate_image(
                model=model,
                prompt="a simple red circle on a white background",
                width=256,
                height=256,
                steps=8,
                seed=1,
                negative=None,
                timeout_s=120,
            )
        except Exception as e:
            print(f"Image generation smoke test failed: {e}")
            return 2

    print("Doctor OK:")
    print("- ollama: present")
    print("- image generation: supported")
    print(f"- default model: {DEFAULT_MODEL}")
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
    ensure_ollama_present(auto_install=False)

    # CLI flag should override config.
    model = args.model or DEFAULT_MODEL
    backend = "ollama"

    if args.job:
        cfg = load_data_file(Path(args.job))
        if not isinstance(cfg, dict):
            raise SystemExit("Job config must be an object at top-level")
        validate_job_config(cfg)

        if str(cfg.get("backend") or backend) != "ollama":
            raise SystemExit("This runner only supports backend=ollama")

        cfg_model = cfg.get("model")
        if args.model:
            model = args.model
        elif cfg_model is not None:
            model = str(cfg_model)

        gen_raw = cfg.get("generate")
        gen = gen_raw if isinstance(gen_raw, dict) else {}
        width = (
            int(gen["width"]) if "width" in gen and gen["width"] is not None else None
        )
        height = (
            int(gen["height"])
            if "height" in gen and gen["height"] is not None
            else None
        )
        steps = (
            int(gen["steps"]) if "steps" in gen and gen["steps"] is not None else None
        )
        seed = int(gen["seed"]) if "seed" in gen and gen["seed"] is not None else None
        negative = (
            str(gen["negative"])
            if "negative" in gen and gen["negative"] is not None
            else None
        )
        timeout_s = (
            int(gen["timeout_s"])
            if "timeout_s" in gen and gen["timeout_s"] is not None
            else None
        )
        prompt_prefix = (
            str(gen["prompt_prefix"]).strip()
            if "prompt_prefix" in gen and gen["prompt_prefix"] is not None
            else None
        )

        out_raw = cfg.get("output")
        out_cfg = out_raw if isinstance(out_raw, dict) else {}
        out_dir = Path(out_cfg.get("dir") or str(args.out)).resolve()
        out_ext = str(out_cfg.get("ext") or "png").lstrip(".")
        overwrite = bool(out_cfg.get("overwrite") or False)

        items = _job_items_from_cfg(cfg)
    else:
        if not args.prompt:
            raise SystemExit("generate requires either --job <file> or --prompt <text>")
        width = args.width
        height = args.height
        steps = args.steps
        seed = None if args.seed == 0 else args.seed
        negative = args.negative
        timeout_s = args.timeout
        prompt_prefix = args.prompt_prefix.strip() if args.prompt_prefix else None
        out_dir = Path(args.out).resolve()
        out_ext = "png"
        overwrite = args.overwrite
        name = args.name or "image"
        items = [(name, args.prompt)]

    print(f"Model: {model}")
    ollama_pull(model)

    out_dir.mkdir(parents=True, exist_ok=True)

    for idx, (name, prompt) in enumerate(items, start=1):
        slug = slugify(name)
        out_path = out_dir / f"{slug}.{out_ext}"
        if out_path.exists() and not overwrite:
            print(f"[{idx}/{len(items)}] skip (exists): {name} -> {out_path}")
            continue

        print(f"[{idx}/{len(items)}] generate: {name} -> {out_path.name}")
        effective_prompt = prompt
        if prompt_prefix:
            effective_prompt = f"{prompt_prefix} {prompt}".strip()

        img_bytes = ollama_generate_image(
            model=model,
            prompt=effective_prompt,
            width=width,
            height=height,
            steps=steps,
            seed=seed,
            negative=negative,
            timeout_s=timeout_s,
        )
        out_path.write_bytes(img_bytes)

    print(f"Done. Wrote outputs to: {out_dir}")
    return 0


def main(argv: List[str]) -> int:
    ap = argparse.ArgumentParser(description="Dragonbane Unbound Ollama image helper")
    sub = ap.add_subparsers(dest="cmd", required=True)

    p_setup = sub.add_parser(
        "setup", help="Install/verify Ollama and optionally pull model"
    )
    p_setup.add_argument(
        "--no-install", action="store_true", help="Do not auto-install"
    )
    p_setup.add_argument("--pull", action="store_true", help="Pull model after setup")
    p_setup.add_argument(
        "--model", default=None, help=f"Model id (default: {DEFAULT_MODEL})"
    )
    p_setup.set_defaults(func=cmd_setup)

    p_doc = sub.add_parser("doctor", help="Verify Ollama + image generation support")
    p_doc.add_argument("--pull", action="store_true", help="Pull model during doctor")
    p_doc.add_argument(
        "--model", default=None, help=f"Model id (default: {DEFAULT_MODEL})"
    )
    p_doc.add_argument(
        "--smoke-generate",
        action="store_true",
        help="Attempt a tiny image generation as part of doctor",
    )
    p_doc.set_defaults(func=cmd_doctor)

    p_gen = sub.add_parser("generate", help="Generate images via Ollama")
    p_gen.add_argument("--job", default=None, help="Job config (.json/.yaml)")
    p_gen.add_argument(
        "--model", default=None, help=f"Model id (default: {DEFAULT_MODEL})"
    )
    p_gen.add_argument("--prompt", default=None, help="Single prompt (ad-hoc mode)")
    p_gen.add_argument(
        "--name", default=None, help="Name for single output (ad-hoc mode)"
    )
    p_gen.add_argument("--out", default=str(ROOT_DIR / "assets/portraits/kins"))
    p_gen.add_argument("--overwrite", action="store_true")
    p_gen.add_argument("--width", type=int, default=1024)
    p_gen.add_argument("--height", type=int, default=1024)
    p_gen.add_argument("--steps", type=int, default=None)
    p_gen.add_argument("--seed", type=int, default=0)
    p_gen.add_argument("--negative", default=None)
    p_gen.add_argument(
        "--prompt-prefix",
        default=None,
        help="Prefix applied to every prompt (ad-hoc mode)",
    )
    p_gen.add_argument("--timeout", type=int, default=1800)
    p_gen.set_defaults(func=cmd_generate)

    args = ap.parse_args(argv)
    return int(args.func(args))


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))

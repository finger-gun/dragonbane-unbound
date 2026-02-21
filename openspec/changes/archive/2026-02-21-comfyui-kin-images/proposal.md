## Why

We want automatically generated, locally produced kin portrait images so the system can ship unique visual flair without copyright or licensing risk. Today ComfyUI is partially wired up but still requires manual, per-developer setup and ad-hoc running, which blocks adoption and repeatable generation.

## What Changes

- Add a first-class, automated local ComfyUI workflow that can set up (clone/venv/deps), run, and generate images with minimal manual steps.
- Standardize how image generation jobs are defined (CLI prompt or config file) and where outputs land in-repo.
- Improve developer ergonomics and reproducibility (idempotent scripts, clear errors, documented env vars like `HF_TOKEN` / `COMFYUI_CKPT`).
- Keep large models and local ComfyUI state out of git (continue using `tools/ComfyUI` and gitignore), while making the setup experience mostly hands-off.

## Capabilities

### New Capabilities

- `local-comfyui-automation`: One-command setup/update and server lifecycle for a locally vendored ComfyUI instance in `tools/ComfyUI`.
- `image-generation-jobs`: Config- and CLI-driven image generation jobs (batch + single), with deterministic naming/output conventions and clear failure modes.

### Modified Capabilities

<!-- none -->

## Impact

- Scripts and tooling: `scripts/comfyui/*` (setup/run/job execution), plus potential `pnpm` script aliases.
- Local developer environment: Python 3.11 + venv, optional Hugging Face auth for model downloads.
- Assets/docs: generated outputs under `assets/portraits/kins/` and related prompt/config documentation.

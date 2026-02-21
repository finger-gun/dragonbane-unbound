# ComfyUI (Local) - Automated Image Generation

This repo uses a developer-local ComfyUI install (gitignored) to generate images (e.g., unique kin portraits) without shipping model weights or risking copyright/licensing issues.

Key constraints:

- `tools/ComfyUI/` is intentionally gitignored (each developer installs locally)
- model weights are not committed

## Happy Path

1. Setup ComfyUI (clone + venv + deps)

```bash
python3 scripts/comfyui/comfyui.py setup
```

2. Start the server

```bash
python3 scripts/comfyui/comfyui.py run-server
```

3. Verify your setup

```bash
python3 scripts/comfyui/comfyui.py doctor
```

4. Generate kin portraits from the job config

```bash
python3 scripts/comfyui/comfyui.py generate --job scripts/comfyui/jobs/kins.example.yaml
```

Outputs land in `assets/portraits/kins/` by default.

## Checkpoint Models

Put at least one checkpoint into:

`tools/ComfyUI/models/checkpoints/`

If you want the helper to download SDXL base (recommended starting point):

```bash
tools/ComfyUI/.venv/bin/python scripts/comfyui/download_model.py
```

Notes:

- Some models require you to accept a license on Hugging Face and set `HF_TOKEN`.
- You can avoid passing `--ckpt` repeatedly by setting `COMFYUI_CKPT="..."`.

## Job Configs

Job configs are data-only YAML/JSON. See:

- `scripts/comfyui/jobs/kins.example.yaml`

## Ad-Hoc Generation

Generate a single image from a prompt (still requires a running server):

```bash
python3 scripts/comfyui/comfyui.py generate \
  --name "mallsing" \
  --prompt "<your prompt here>" \
  --ckpt "sd_xl_base_1.0.safetensors"
```

## Optional: External Model Paths

If your models live elsewhere, copy:

`scripts/comfyui/extra_model_paths.example.yaml` -> `scripts/comfyui/extra_model_paths.yaml`

Then edit the absolute paths. The server runner will pick it up automatically.

## Notes

- This uses ComfyUI's HTTP API (`/prompt`, `/history`, `/view`).
- Default behavior avoids overwriting existing outputs (configurable per job).

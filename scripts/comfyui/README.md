# ComfyUI (Local) - Batch Image Generation

This repo includes a small batch runner that talks to a locally running ComfyUI server and generates one portrait per kin prompt.

## 1) Start ComfyUI

ComfyUI is vendored in `tools/ComfyUI`.

Install deps (already done if you ran the setup once):

```bash
python3.11 -m venv tools/ComfyUI/.venv
tools/ComfyUI/.venv/bin/pip install -U pip
tools/ComfyUI/.venv/bin/pip install -r tools/ComfyUI/requirements.txt
```

Run the server:

```bash
scripts/comfyui/run_server.sh
```

Optional: if your models live elsewhere, copy `scripts/comfyui/extra_model_paths.example.yaml` to `scripts/comfyui/extra_model_paths.yaml` and set the paths. `scripts/comfyui/run_server.sh` will pick it up automatically.

By default ComfyUI will listen on `http://127.0.0.1:8188`.

## 2) Put a checkpoint model in ComfyUI

Add at least one checkpoint to:

`tools/ComfyUI/models/checkpoints/`

Example filenames you might have:

- `sd_xl_base_1.0.safetensors`
- `juggernautXL_v9.safetensors`

## 3) Generate kin portraits

Prompts live in:

`docs/character_creation/kin-profile-portrait-prompts.md`

Run the batch generator:

```bash
python3 scripts/comfyui/batch_generate_kin_portraits.py \
  --ckpt "sd_xl_base_1.0.safetensors"
```

Outputs are downloaded into:

`assets/portraits/kins/`

## Notes

- If you want different output size/steps/sampler, see `--help` on the batch script.
- This uses ComfyUI's HTTP API (`/prompt`, `/history`, `/view`).

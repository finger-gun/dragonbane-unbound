# Ollama (Local) - Quick Image Generation

This is a fast, local image generation pipeline using Ollama's experimental text-to-image support.

Notes:

- This does not replace `scripts/comfyui/` (ComfyUI remains the advanced pipeline)
- Ollama image generation is currently macOS-first (per Ollama's docs)

## Happy Path (Kin Portraits)

1. Setup (install/verify Ollama + pull default model)

```bash
python3 scripts/ollama/ollama.py setup --pull
```

2. Generate from job config

```bash
python3 scripts/ollama/ollama.py generate --job scripts/ollama/jobs/kins.example.json
```

If you want results that lean less toward anime and more toward a western watercolor+ink editorial look, use:

```bash
python3 scripts/ollama/ollama.py generate --job scripts/ollama/jobs/kins.western.example.json
```

Outputs go to `assets/portraits/kins/` by default.

## Model Selection

Default model: `x/z-image-turbo`

Use another model:

```bash
python3 scripts/ollama/ollama.py generate \
  --model x/flux2-klein \
  --job scripts/ollama/jobs/kins.example.json
```

## Ad-Hoc Generation

```bash
python3 scripts/ollama/ollama.py generate \
  --name "mallsing" \
  --prompt "<your prompt here>"
```

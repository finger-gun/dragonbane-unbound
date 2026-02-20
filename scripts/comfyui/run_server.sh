#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMFY_DIR="$ROOT_DIR/tools/ComfyUI"
PY="$COMFY_DIR/.venv/bin/python"
EXTRA_MODELS_YAML="$ROOT_DIR/scripts/comfyui/extra_model_paths.yaml"

if [[ ! -x "$PY" ]]; then
  echo "ComfyUI venv not found at: $PY" 1>&2
  echo "Install deps first (see scripts/comfyui/README.md)." 1>&2
  exit 1
fi

ARGS=("$COMFY_DIR/main.py" --listen 127.0.0.1 --port 8188)

if [[ -f "$EXTRA_MODELS_YAML" ]]; then
  ARGS+=(--extra-model-paths-config "$EXTRA_MODELS_YAML")
fi

exec "$PY" "${ARGS[@]}"

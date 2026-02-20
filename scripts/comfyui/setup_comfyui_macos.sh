#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMFY_DIR="$ROOT_DIR/tools/ComfyUI"
PYTHON_BIN="${PYTHON_BIN:-python3.11}"

if ! command -v "$PYTHON_BIN" >/dev/null 2>&1; then
  echo "Missing $PYTHON_BIN. Install Python 3.11 (pyenv/Homebrew) and try again." 1>&2
  exit 1
fi

mkdir -p "$ROOT_DIR/tools"

if [[ ! -d "$COMFY_DIR" ]]; then
  echo "Cloning ComfyUI into tools/ComfyUI ..."
  git clone https://github.com/comfyanonymous/ComfyUI.git "$COMFY_DIR"
else
  echo "Found existing: $COMFY_DIR"
fi

if [[ ! -d "$COMFY_DIR/.venv" ]]; then
  echo "Creating venv ..."
  "$PYTHON_BIN" -m venv "$COMFY_DIR/.venv"
fi

echo "Installing Python dependencies (this can take a while) ..."
"$COMFY_DIR/.venv/bin/pip" install -U pip
"$COMFY_DIR/.venv/bin/pip" install -r "$COMFY_DIR/requirements.txt"

echo
echo "Done. Start ComfyUI with: scripts/comfyui/run_server.sh"

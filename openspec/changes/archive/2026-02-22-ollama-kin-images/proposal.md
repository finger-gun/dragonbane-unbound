## Why

We want a fast, fully local image generation pipeline for kin portraits that requires minimal manual setup and keeps all assets and computation on the developer machine. Ollama now supports experimental text-to-image generation locally (starting on macOS), so we can offer an even simpler path than ComfyUI for common batch generation while still keeping the ComfyUI pipeline for advanced workflows.

## What Changes

- Add an Ollama-based image generation runner that can install/verify Ollama, pull image models, run batch jobs, and write outputs deterministically.
- Reuse the existing kin prompt source (`docs/character_creation/kin-profile-portrait-prompts.md`) and the same batch semantics (one image per item/prompt).
- Support selecting models via flag/config (default `x/z-image-turbo`), with the option to use other Ollama image models (e.g., `x/flux2-klein`).
- Keep the ComfyUI pipeline intact for more advanced workflows and model ecosystems.

## Capabilities

### New Capabilities

- `local-ollama-automation`: Automated local Ollama install/verification plus model pulling for image generation.

### Modified Capabilities

- `image-generation-jobs`: Extend job execution requirements to support multiple backends (ComfyUI and Ollama) while keeping configs data-only and outputs deterministic.

## Impact

- New scripts under `scripts/ollama/` (setup/doctor/generate) and example job config(s) for kin portraits.
- Local developer environment: Ollama CLI/daemon; macOS support first (per Ollama’s current image generation availability).
- Specs: add `local-ollama-automation`; update `image-generation-jobs` to include Ollama backend support.

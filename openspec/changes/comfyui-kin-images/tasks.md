## 1. Baseline And Guardrails

- [x] 1.1 Inventory current `scripts/comfyui/*` behavior and document the intended “happy path” commands in `scripts/comfyui/README.md`
- [x] 1.2 Confirm `tools/ComfyUI` and model directories are gitignored and add any missing ignores (no model weights in git)
- [x] 1.3 Add a lightweight “doctor” check that validates: python runtime, venv presence, ComfyUI repo presence, server reachability, and checkpoint availability

## 2. Unified Orchestrator CLI

- [x] 2.1 Create a single orchestrator CLI entrypoint under `scripts/comfyui/` (Python) with subcommands for setup, run-server, generate, and doctor
- [x] 2.2 Implement idempotent setup in the orchestrator (clone/update ComfyUI, create venv, install deps, install any runner deps)
- [x] 2.3 Implement server start wrapper (host/port flags, optional `extra_model_paths.yaml`, clear error when venv missing)
- [x] 2.4 Implement server readiness polling using the ComfyUI HTTP API before queueing jobs

## 3. Job Config Support

- [x] 3.1 Define a job config format (YAML/JSON) for batch generation: checkpoint, generation params, items/prompts source, output dir, overwrite policy
- [x] 3.2 Implement strict config validation (fail on unknown keys; actionable validation errors)
- [x] 3.3 Support both inline prompt items and a “kin prompts markdown” source (defaulting to `docs/character_creation/kin-profile-portrait-prompts.md`)
- [x] 3.4 Implement deterministic output naming (slugify) and overwrite protection (skip or fail unless explicitly enabled)

## 4. Generation Behavior And Reproducibility

- [x] 4.1 Implement checkpoint selection rules: explicit flag > env var > auto-select when exactly one checkpoint is present
- [x] 4.2 Implement seed modes: fixed seed sequence and per-image random; print/record chosen seed per image
- [x] 4.3 Ensure timeouts and error reporting identify the failing item (prompt name) and stage (queue/wait/download)

## 5. Developer Experience

- [x] 5.1 Add example job config(s) for kin portraits under `scripts/comfyui/` and document usage
- [x] 5.2 Update `scripts/comfyui/README.md` with “minimal manual setup” instructions, including `HF_TOKEN` and checkpoint expectations
- [x] 5.3 Add convenient repo-level script aliases (e.g., `pnpm comfyui:setup`, `pnpm comfyui:doctor`, `pnpm comfyui:kins`) without requiring global installs

## 6. Verification

- [x] 6.1 Add a small test harness (or smoke-test script) that validates config parsing, slugify behavior, and checkpoint resolution without requiring a running ComfyUI server
- [x] 6.2 Manually verify end-to-end: setup -> run server -> generate at least one image -> output saved under `assets/portraits/kins/`

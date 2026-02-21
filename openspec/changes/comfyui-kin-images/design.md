## Context

The repo already has a local ComfyUI integration under `scripts/comfyui/` that can:

- clone ComfyUI into `tools/ComfyUI` (gitignored)
- create a Python venv + install dependencies
- run the ComfyUI server on `127.0.0.1:8188`
- batch-generate kin portraits by calling ComfyUI's HTTP API and downloading outputs into `assets/portraits/kins/`

In practice, the workflow is still fragile and manual (per-developer setup steps, optional model path wiring, checkpoint selection, server lifecycle, and error handling around model downloads/licensing). We want an idempotent, “minimal manual setup” developer experience that remains local-first and keeps large model assets out of git.

## Goals / Non-Goals

**Goals:**

- Provide a single, repeatable entrypoint that can: ensure ComfyUI is present + configured, start/verify the server, and run one or more image generation jobs.
- Support job definitions as either:
  - quick CLI prompts (single image / small batch)
  - a config file describing a batch (e.g., kin portraits, plus future image sets)
- Standardize outputs (paths + filenames) so generated assets are predictable and easy to commit (when desired).
- Keep `tools/ComfyUI` and model files developer-local (continue gitignore) while enabling automation around setup/update and environment checks.

**Non-Goals:**

- Shipping models or ComfyUI itself in the repository.
- Removing all manual steps around model licensing (e.g., Hugging Face license acceptance); automation should guide and fail clearly.
- Building a production image generation service (this change is local tooling).

## Decisions

- Keep ComfyUI as a git-cloned dependency under `tools/ComfyUI`.
  - Rationale: avoids vendoring huge/fast-moving upstream code; aligns with current approach and keeps repo size reasonable.
  - Alternative: submodule or vendored snapshot. Rejected due to friction and frequent upstream changes.

- Introduce a single “orchestrator” CLI script (Python) that wraps the existing shell + API scripts.
  - Rationale: cross-platform logic, structured config parsing, better error messages, and easier composition than Bash alone.
  - Alternative: pure Bash. Rejected due to portability and maintainability concerns.

- Define a small job config schema (YAML/JSON) that describes:
  - server connection/start behavior
  - checkpoint selection and model lookup
  - generation parameters (size/steps/cfg/sampler/scheduler/seed strategy)
  - items to generate (named prompts or references to a prompt source)
  - output directory and naming rules
  - Rationale: enables repeatable, reviewable batches and future expansion beyond kin portraits.

- Preserve the current ComfyUI HTTP API approach (`/prompt`, `/history`, `/view`).
  - Rationale: already implemented; avoids brittle UI automation.
  - Trade-off: API shape can change upstream; mitigate with narrow usage and defensive parsing.

## Risks / Trade-offs

- [Model licensing / auth] → Provide clear setup guidance and actionable errors; support `HF_TOKEN` and skip downloads when not configured.
- [Large downloads / disk usage] → Make downloads opt-in; print expected sizes; avoid re-downloading when files exist.
- [Performance variability (CPU vs GPU)] → Keep defaults reasonable; document typical runtimes; allow per-job overrides.
- [Upstream ComfyUI changes] → Pin to a known-good commit optionally (configurable), or at least print the current git revision for debugging.
- [Local-only tooling drift] → Add a small “doctor”/verification step to detect missing Python, venv, server reachability, and checkpoint availability.

## Context

The repo already has a local image generation pipeline built around ComfyUI (`scripts/comfyui/`), including:

- a unified orchestrator CLI (`scripts/comfyui/comfyui.py`) for setup, server lifecycle, doctor checks, and config-driven batch generation
- a prompt source for kin portraits (`docs/character_creation/kin-profile-portrait-prompts.md`) that yields one image per kin

Ollama now offers experimental local image generation on macOS via `ollama run <model> "<prompt>"` and supports width/height/steps/seed/negative prompt flags. This change adds a parallel, simpler pipeline based on Ollama while keeping the existing ComfyUI pipeline for advanced workflows.

## Goals / Non-Goals

**Goals:**

- Provide an Ollama-based runner that matches the ergonomics of the ComfyUI orchestrator: setup, doctor, and generate.
- Support both ad-hoc prompt generation (CLI flags) and config-driven batches.
- Default to a fast model (`x/z-image-turbo`) with a flag/config option to select other supported image models.
- Deterministic output naming and predictable output directories (e.g., `assets/portraits/kins/<slug>.png`).
- Minimal manual setup: detect if `ollama` exists; install on macOS when missing; pull models automatically.

**Non-Goals:**

- Replacing or removing the ComfyUI pipeline.
- Building a hosted/prod image generation service.
- Supporting embedded scripts in job configs (data-only).
- Guaranteeing full cross-platform support for image generation until Ollama supports it (macOS-first).

## Decisions

- Implement as a separate script family under `scripts/ollama/`.
  - Rationale: avoids conflating two backends and keeps each runner minimal and maintainable.

- Use the Ollama CLI (`ollama run`, `ollama pull`, `ollama --version`) as the integration layer.
  - Rationale: simplest local-first integration; avoids coupling to daemon APIs and matches user expectations.

- Mirror the config semantics from the ComfyUI runner (data-only YAML/JSON; strict validation; batch items or kin markdown source).
  - Rationale: consistent developer experience and predictable output conventions across backends.

- Output handling: run Ollama in a controlled working directory per image (or parse output file naming) and then move/rename the resulting file to deterministic `<slug>.png`.
  - Rationale: Ollama saves images to the current directory; we must ensure deterministic placement/naming.

## Risks / Trade-offs

- [Platform availability] Ollama image generation is macOS-only initially → Implement macOS install path; on other platforms, fail fast with clear messaging and keep ComfyUI as the fallback.
- [Model outputs saved to CWD] → Generate in a temp dir and move the produced image file, or enforce `cwd` per run.
- [CLI/API evolution] → Keep usage narrow, validate versions, and provide actionable errors when flags change.
- [Model license differences] → Surface model IDs and encourage users to select models appropriate for their usage.

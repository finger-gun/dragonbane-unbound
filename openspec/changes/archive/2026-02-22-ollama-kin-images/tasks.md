## 1. Runner Scaffolding

- [x] 1.1 Create `scripts/ollama/` runner structure (shared lib + CLI entrypoint)
- [x] 1.2 Implement slugify + kin markdown prompt parsing (reuse the same `##` + fenced-code convention)
- [x] 1.3 Add strict job config validation (data-only; fail on unknown keys)

## 2. Setup And Doctor

- [x] 2.1 Implement `setup` that checks for `ollama` and installs it on macOS when missing (otherwise print manual install guidance)
- [x] 2.2 Implement `doctor` that validates: `ollama` present, image generation supported, and at least one model can be pulled/run

## 3. Model Pulling And Generation

- [x] 3.1 Implement model selection (`--model`/config) defaulting to `x/z-image-turbo`
- [x] 3.2 Implement model pulling (`ollama pull <model>`) before generation when needed
- [x] 3.3 Implement generation loop that runs `ollama run <model> "<prompt>"` with width/height/steps/seed/negative flags
- [x] 3.4 Implement deterministic output naming + overwrite policy (skip/fail unless configured)

## 4. Configs, Docs, And Aliases

- [x] 4.1 Add example kin job config under `scripts/ollama/jobs/kins.example.yaml`
- [x] 4.2 Document the Ollama pipeline in `scripts/ollama/README.md`, explicitly noting ComfyUI remains supported
- [x] 4.3 Add repo-level `pnpm` aliases (`ollama:setup`, `ollama:doctor`, `ollama:kins`)

## 5. Verification

- [x] 5.1 Add a smoke test that validates config parsing + slugify without requiring image generation
- [x] 5.2 Manually verify end-to-end: setup -> pull model -> generate at least one image -> output saved under `assets/portraits/kins/`

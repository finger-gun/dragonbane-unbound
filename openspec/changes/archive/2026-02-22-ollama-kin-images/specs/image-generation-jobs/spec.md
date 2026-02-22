## ADDED Requirements

### Requirement: Generation backend is selectable

The system MUST allow selecting an image generation backend per job, supporting at least ComfyUI and Ollama.

#### Scenario: Backend is selected in job config

- **WHEN** a developer runs a job config specifying `backend: ollama`
- **THEN** the system uses Ollama to generate images for that job

#### Scenario: Backend defaults are applied

- **WHEN** a developer runs generation without explicitly selecting a backend
- **THEN** the system uses a documented default backend

### Requirement: Ollama backend supports model selection

When using the Ollama backend, the system MUST support selecting an Ollama model ID, and MUST default to a fast model suitable for batch generation.

#### Scenario: Default model is used

- **WHEN** a developer runs an Ollama-backed job without specifying a model
- **THEN** the system uses `x/z-image-turbo` by default

#### Scenario: Alternate model is selected

- **WHEN** a developer runs an Ollama-backed job specifying a different supported model ID
- **THEN** the system uses that model for generation

### Requirement: Ollama backend pulls models automatically

When using the Ollama backend, the system MUST pull the requested model if it is not present locally before attempting generation.

#### Scenario: Pull happens before generation

- **WHEN** the requested model is not available locally
- **THEN** the system runs an Ollama pull step and only then begins generating images

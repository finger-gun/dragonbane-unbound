## Purpose

Define automated, local-first Ollama setup and model management for local image generation.

## Requirements

### Requirement: Ollama installation is verified and guided

The tooling MUST detect whether the `ollama` CLI is available. If it is missing, the tooling MUST provide an automated install path when supported and MUST otherwise provide a clear, actionable message to install Ollama.

#### Scenario: Ollama is installed

- **WHEN** a developer runs the doctor or generate command and `ollama` is available
- **THEN** the system proceeds without prompting to install Ollama

#### Scenario: Ollama is missing on supported platform

- **WHEN** a developer runs setup on a supported platform without `ollama`
- **THEN** the system installs Ollama and reports the next command to run

#### Scenario: Ollama is missing on unsupported platform

- **WHEN** a developer runs setup on a platform where automated installation is not supported
- **THEN** the system exits non-zero and prints instructions to install Ollama manually

### Requirement: Image generation models are pulled automatically

The tooling MUST be able to ensure a requested Ollama image generation model is available locally by pulling it if necessary.

#### Scenario: Model is pulled on demand

- **WHEN** a developer runs generation with a model that is not present locally
- **THEN** the system pulls the model and then proceeds with generation

### Requirement: Ollama image generation uses local CLI flags

The tooling MUST support configuring Ollama image generation parameters including width, height, steps, seed, and negative prompt.

#### Scenario: Seeded generation is reproducible

- **WHEN** a developer runs generation twice with the same prompt, model, and seed
- **THEN** the system produces the same output image

### Requirement: Generated images are written deterministically

The tooling MUST write images to a configured output directory with deterministic filenames derived from the item name (slugified), and MUST avoid overwriting existing outputs unless explicitly configured to do so.

#### Scenario: Deterministic naming

- **WHEN** the tooling generates an image for an item named "Mallsing"
- **THEN** it writes `mallsing.png` (or equivalent deterministic slug) into the output directory

### Requirement: Local-first operation without arbitrary code execution

The runner MUST be local-first and MUST NOT execute arbitrary scripts from job configuration. Job configuration MUST be data-only.

#### Scenario: Disallowed config content is rejected

- **WHEN** a job config contains fields that would enable arbitrary command execution
- **THEN** the system rejects the config and exits non-zero with a validation error

## ADDED Requirements

### Requirement: Job execution supports CLI and config-driven batches

The tooling MUST support running image generation as either:

- a CLI-driven invocation for quick, ad-hoc generation
- a config-driven batch that defines multiple images to generate

#### Scenario: Run a single CLI prompt

- **WHEN** a developer provides a prompt via CLI flags
- **THEN** the system generates a single image and writes it to the configured output location

#### Scenario: Run a batch from a config file

- **WHEN** a developer provides a job config file describing multiple prompts
- **THEN** the system generates all requested images and writes each output deterministically

### Requirement: Job configs are local-first and non-executable

Job configuration MUST be data-only (YAML or JSON) and MUST NOT support embedded scripts or arbitrary command execution.

#### Scenario: Config contains unknown or disallowed fields

- **WHEN** a developer runs a job config containing unknown/disallowed keys
- **THEN** the system fails with a clear validation error listing the unsupported fields

### Requirement: Checkpoint selection is explicit and validated

The job runner MUST support selecting a checkpoint by filename, and MUST validate that the checkpoint exists in the configured checkpoint search paths before starting generation.

#### Scenario: Checkpoint is missing

- **WHEN** a developer runs a job referencing a checkpoint that does not exist
- **THEN** the system fails before queueing any prompts and prints available checkpoint choices

### Requirement: Outputs follow deterministic naming and locations

The job runner MUST write outputs to a configured directory and MUST produce deterministic filenames based on the input item name (slugified) and file type. The system MUST avoid overwriting existing outputs unless explicitly configured to do so.

#### Scenario: Default kin output naming

- **WHEN** the job runner generates a portrait for an item named "Mallsing"
- **THEN** it writes `mallsing.png` (or equivalent deterministic slug) into the configured output directory

### Requirement: Seed behavior is reproducible

The job runner MUST support reproducible seeds. If the user requests per-image random seeds, the system MUST record or print the chosen seed per generated image.

#### Scenario: Deterministic seed sequence

- **WHEN** a developer runs a batch with a fixed base seed
- **THEN** each generated image uses a deterministic derived seed so reruns generate the same results

### Requirement: Server interaction uses ComfyUI HTTP API reliably

The job runner MUST submit jobs via ComfyUI's HTTP API, wait for completion, and download resulting images. The system MUST time out with a clear error when a job does not complete within the configured limit.

#### Scenario: Job times out

- **WHEN** a queued prompt does not complete before the configured timeout
- **THEN** the system reports which item failed and exits non-zero

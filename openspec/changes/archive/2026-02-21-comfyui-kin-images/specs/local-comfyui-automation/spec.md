## ADDED Requirements

### Requirement: ComfyUI install is automated and idempotent

The tooling MUST be able to provision a local ComfyUI checkout under `tools/ComfyUI` without committing it to git. Re-running setup MUST be safe and MUST NOT re-download or re-install work unnecessarily when the environment is already healthy.

#### Scenario: Fresh setup

- **WHEN** a developer runs the setup command on a machine without `tools/ComfyUI`
- **THEN** the system clones ComfyUI, creates a venv, installs dependencies, and reports the next command to run

#### Scenario: Repeat setup

- **WHEN** a developer reruns the setup command with an existing healthy venv
- **THEN** the system performs no destructive actions and exits successfully

### Requirement: Python runtime is validated early

The setup and run tooling MUST validate the configured Python runtime exists and is compatible before starting any long-running work, and MUST emit an actionable error message when the runtime is missing.

#### Scenario: Python missing

- **WHEN** the configured Python binary is not found on PATH
- **THEN** the system exits with a non-zero code and prints how to install or configure the runtime

### Requirement: ComfyUI server can be started with local configuration

The tooling MUST start the ComfyUI server using the ComfyUI venv Python and MUST support configuring listen host and port. If `scripts/comfyui/extra_model_paths.yaml` exists, the server start MUST pass it via ComfyUI's `--extra-model-paths-config` option.

#### Scenario: Start server with extra model paths

- **WHEN** the developer starts the server and `scripts/comfyui/extra_model_paths.yaml` exists
- **THEN** ComfyUI starts with that config applied

### Requirement: Server readiness is verifiable

The tooling MUST be able to verify that the ComfyUI server is reachable and ready to accept jobs using ComfyUI's HTTP API.

#### Scenario: Server reachable

- **WHEN** the developer runs a verification/doctor command with the server running
- **THEN** the system confirms readiness by successfully calling a ComfyUI status endpoint

#### Scenario: Server not reachable

- **WHEN** the developer runs verification while the server is not running
- **THEN** the system exits with a non-zero code and prints a clear remediation path

### Requirement: Local model directories remain developer-managed

The system MUST NOT commit or require committing any model weights into the repository. The tooling MAY provide an opt-in helper to download a checkpoint into `tools/ComfyUI/models/checkpoints`, but MUST clearly communicate any external license/token requirements.

#### Scenario: Download requires auth

- **WHEN** a developer attempts to download a checkpoint that requires license acceptance or a token
- **THEN** the system fails with an actionable message describing the required steps (e.g., license acceptance and `HF_TOKEN`)

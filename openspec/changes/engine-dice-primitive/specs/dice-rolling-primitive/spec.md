## ADDED Requirements

### Requirement: Dice expressions are parsed and validated

The system SHALL parse a dice expression string into a validated roll request.

#### Scenario: Valid polyhedral dice expression

- **WHEN** a caller provides an expression like `d20` or `2d6+1`
- **THEN** the system accepts it and produces a normalized roll request

#### Scenario: Invalid dice expression

- **WHEN** a caller provides an invalid expression
- **THEN** the system rejects it with an error that explains the validation failure

### Requirement: Supported dice match required polyhedrals

The system SHALL support rolling dice with sides 4, 6, 8, 10, 12, and 20.

#### Scenario: Roll each supported die

- **WHEN** a caller requests `d4`, `d6`, `d8`, `d10`, `d12`, or `d20`
- **THEN** the system returns a result within the inclusive range `1..S`

### Requirement: Rolling returns a structured result and receipt

The system SHALL return a structured roll result including per-die outcomes and a computed total.

#### Scenario: Roll returns per-die values

- **WHEN** a caller rolls `3d6+2`
- **THEN** the result includes three individual die outcomes, the modifier, and the final total

### Requirement: Deterministic seeding is supported

The system SHALL support deterministic rolls when provided an explicit seed.

#### Scenario: Seeded roll is repeatable

- **WHEN** a caller rolls the same expression with the same seed using the same RNG algorithm id
- **THEN** the system returns identical per-die outcomes and totals

### Requirement: Safety limits prevent pathological requests

The system SHALL enforce safe limits on roll requests.

#### Scenario: Too many dice

- **WHEN** a caller requests a roll that exceeds the maximum allowed number of dice
- **THEN** the system rejects the roll with a validation error

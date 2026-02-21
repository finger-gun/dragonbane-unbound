## Purpose

Define a deterministic rules DSL for computing derived values and producing auditable receipts.

## Requirements

### Requirement: Rules DSL computes derived values

The system SHALL compute derived values from base attributes using a rules DSL.

#### Scenario: Compute derived stat

- **WHEN** a rule defines a derived stat formula
- **THEN** the system calculates the derived stat deterministically

### Requirement: Rules evaluation is deterministic

The system SHALL produce deterministic outputs for the same inputs.

#### Scenario: Repeat evaluation

- **WHEN** a ruleset is evaluated with identical inputs twice
- **THEN** the outputs are identical

### Requirement: Roll receipts are produced

The system SHALL emit a roll receipt for each rules evaluation.

#### Scenario: Generate roll receipt

- **WHEN** a rule evaluation completes
- **THEN** the system outputs a receipt containing inputs, steps, and outputs

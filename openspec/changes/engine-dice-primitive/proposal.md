## Why

Encounters, character creation, and future automation features all depend on rolling dice, but the codebase does not yet have a single deterministic dice primitive that can be reused across apps and packages. Establishing a small, auditable dice roller in the engine creates a foundation for consistent roll behavior and receipts everywhere.

## What Changes

- Add an engine-level dice rolling primitive that parses and rolls simple dice expressions.
- Produce structured roll results and receipts suitable for audit/logging.
- Support optional deterministic seeding so the same input can reproduce the same result when needed.
- Keep Dragonbane-specific interpretation (boon/bane, roll-under success rules, item/status modifiers) outside the dice primitive.

## Capabilities

### New Capabilities

- `dice-rolling-primitive`: Parse and roll basic dice expressions and return structured results with receipts.

### Modified Capabilities

<!-- None -->

## Impact

- Packages: add new types for dice expressions/results/receipts and implement the roller in `@dbu/engine`.
- Downstream: future work can use the primitive from web/API/system logic without duplicating RNG behavior.

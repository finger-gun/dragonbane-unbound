## Context

The codebase has a rules DSL and character sheet capabilities, but no centralized dice rolling primitive in `@dbu/engine`. Current encounter tracking is mostly manual logging, and future features (rollable character creation steps, encounter actions, item effects) need consistent dice behavior and structured receipts.

This change introduces a small dice module in the engine that is:

- deterministic when provided an explicit seed
- testable and pure (no I/O)
- reusable from both server and web contexts

Dragonbane-specific semantics (e.g., roll-under success, boon/bane keep rules, push rules, modifiers from items/conditions) are intentionally out of scope and will live in the Dragonbane system layer.

## Goals / Non-Goals

**Goals:**

- Provide a stable, engine-level API to roll dice from a simple expression.
- Return both a numeric result and a detailed receipt that records each die.
- Support optional deterministic seeding and identify the RNG algorithm in receipts.
- Fail safely on invalid expressions with clear errors.

**Non-Goals:**

- Full expression language (keep/drop, exploding dice, custom distributions).
- System-specific success evaluation (roll-under, criticals) or boon/bane rules.
- Persistence, logging, or UI for dice rolling.

## Decisions

- Dice expressions: start with a deliberately small grammar.
  - Support: `dS`, `NdS`, optional `+K`/`-K` modifier (e.g. `d20`, `2d6+1`, `4d6-2`).
  - Limit sides to the polyhedrals needed now: 4, 6, 8, 10, 12, 20.
  - Rationale: enough to enable product features without committing to a full dice DSL.

- Determinism: accept an optional seed and record it in the receipt.
  - If a seed is provided, the roller MUST be deterministic across platforms.
  - If no seed is provided, callers can supply their own seed source (e.g., crypto on server) but the engine remains pure.

- Receipt structure: always return per-die results and metadata.
  - Include: normalized expression, RNG algorithm id, seed (if provided), individual die values, modifier, and computed total.
  - Rationale: enables auditing and later “reactive systems” without changing interfaces.

- Validation and limits: enforce safe upper bounds.
  - Cap the number of dice per request to prevent accidental or malicious large rolls.

## Risks / Trade-offs

- [Too limited expression grammar] → Mitigation: keep the API extensible (versioned expression kind) and grow intentionally.
- [Cross-platform determinism bugs] → Mitigation: choose a simple, well-specified RNG and cover with golden tests.
- [Callers roll system semantics in the wrong layer] → Mitigation: document that this module returns raw roll outcomes only.

## Migration Plan

1. Add dice types (expression/result/receipt) in `@dbu/types`.
2. Implement dice parsing + rolling in `@dbu/engine` and add unit tests.
3. Leave existing features unchanged; integrate consumers in follow-up changes.

## Open Questions

- Should the roller accept `d20` as shorthand for `1d20` (recommended) and should it normalize to `1d20` in receipts?
- Do we want to reserve a field for “roll context” (e.g., label, actor id) in the receipt now, or keep receipts strictly mechanical?

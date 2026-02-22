## 1. Types And Public API

- [ ] 1.1 Add dice expression, roll request, roll result, and receipt types to `@dbu/types`
- [ ] 1.2 Define a stable `rng_algorithm` identifier and seed type used in receipts
- [ ] 1.3 Export a public dice API surface from `@dbu/engine` (parse + roll)

## 2. Expression Parsing And Validation

- [ ] 2.1 Implement parser for `dS` / `NdS` with optional `+K`/`-K` modifier
- [ ] 2.2 Validate supported sides (4/6/8/10/12/20) and enforce max dice count
- [ ] 2.3 Normalize expressions (e.g., `d20` -> `1d20`) for receipts

## 3. RNG And Rolling

- [ ] 3.1 Implement deterministic RNG with explicit algorithm id (seeded)
- [ ] 3.2 Implement roll execution that returns per-die outcomes and totals
- [ ] 3.3 Ensure unseeded use remains pure by requiring callers to provide seed or RNG input (no hidden I/O)

## 4. Tests

- [ ] 4.1 Unit tests for parsing/validation (valid and invalid expressions)
- [ ] 4.2 Golden tests for seeded determinism (repeatable receipts)
- [ ] 4.3 Property-style tests for bounds (each die is within `1..S`)

## 5. Documentation

- [ ] 5.1 Document supported expression grammar and limits in `@dbu/engine`
- [ ] 5.2 Add examples for how system logic can implement boon/bane by requesting multi-die rolls and interpreting receipts

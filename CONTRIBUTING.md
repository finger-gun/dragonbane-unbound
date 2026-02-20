# Contributing to Dragonbane Unbound

Thank you for your interest in Dragonbane Unbound. This is a passion project built by players, for players, the goal is to help more people enjoy Dragonbane at the table. Whether you want to write engine code, build UI, create homebrew content packs, improve documentation, or fix bugs, there is room for you here.

## Before You Start

Please read these two documents:

- **[docs/legal.md](docs/legal.md)**, Legal and license guidance. Contributions must not include official rulebook text or copyrighted content from Free League Publishing. Understand the content compliance rules before submitting work.
- **[docs/development.md](docs/development.md)**, Technical setup. How to get the dev environment running locally.

---

## Hard Rules

These are non-negotiable. PRs that violate them will be closed.

### 1. All Features Require Specifications (OpenSpec)

Every feature, change, or addition requires an OpenSpec specification file. No exceptions.

This project uses [OpenSpec](https://openspec.dev/) for spec-driven development. The workflow is:

1. **Propose**: Open an issue or discussion describing the change
2. **Spec**: Create specification artifacts (brief, delta spec, task list) using the OpenSpec workflow
3. **Implement**: Write code that follows the spec
4. **Archive**: After merge, the change is archived for project history

Specifications live in `specs/changes/` during active work and move to `specs/archive/` when complete.

Why? Specs force clarity before code. They catch design problems early, make reviews faster, and give future contributors context for why decisions were made.

### 2. AI Development Mandate

If AI is used in **any** part of development, code generation, spec writing, documentation, data extraction, anything, then spec files are **mandatory**. This is a hard rule.

AI-assisted work without a spec trail is not acceptable. The spec provides the audit trail that ensures AI output was reviewed, intentional, and aligned with project goals.

### 3. No Copyrighted Content

Contributions must not include:

- Official rulebook text, descriptions, or flavor text from any Free League publication
- Reproduced stat blocks, spell descriptions, or ability text
- Any content that would let someone play without owning the official game

Mechanical data (formulas, numeric values, table structures) is allowed. Prose and creative expression is not. When in doubt, check [docs/legal.md](docs/legal.md) or ask.

All data files must include a `content_license` field in their `_meta` block. Valid values:

| Value                 | Meaning                                                           |
|-----------------------|-------------------------------------------------------------------|
| `game-mechanics-only` | Mechanical data extracted from a published source, prose stripped |
| `fair-use-reference`  | Reference material (e.g., translation dictionary)                 |
| `original`            | Original work created for this project                            |

---

## Project Structure

Dragonbane Unbound is a TypeScript monorepo using pnpm workspaces and Turborepo.

```
apps/
  web/            Next.js web client
  api/            Node API (Fastify)

packages/
  engine/         Rules + rolls + effects engine (pure TS)
  systems/        Game system modules
  ui/             Shared design system
  types/          Shared TS types + schemas
  utils/          Shared helpers
  adapters/       Storage adapters (Supabase, local)

docs/             Project documentation
specs/            OpenSpec specification files
scripts/          Build and data processing scripts
```

**Dependency rule:** Apps depend on packages. Packages must not depend on apps.

---

## Code Conventions

- **Language:** TypeScript everywhere. Strict mode.
- **Naming:** kebab-case for files and directories. No exceptions.
- **Formatting:** Follow the shared root configs for linting and formatting.
- **Tests:** Add tests for new engine logic. Run `pnpm test` before submitting.
- **Builds:** Run `pnpm lint` before submitting.

---

## Types of Contributions

### Engine Work (`packages/engine/`)

The rules engine is the core of the project — deterministic, data-driven, pure TypeScript. No side effects, no I/O. This is where dice resolution, formula evaluation, effect processing, and character validation live.

Engine changes always need specs because they affect the correctness of the entire system.

### UI Work (`apps/web/`, `packages/ui/`)

Frontend work in Next.js and the shared component library. Follow the existing component patterns and design system.

### Content Packs

Dragonbane Unbound uses a **user-assembled content model**. The platform ships engine logic and system data (tables, formulas, brackets). Users assemble their own content from their owned rulebooks or create original homebrew.

If you want to contribute content pack templates or homebrew examples, see [docs/package-example.md](docs/package-example.md) for the format. All contributed content must be original work — do not submit packs containing official rulebook content.

### Data Layer (`docs/character_creation/`)

The structured game data files (JSON) that the engine consumes. These files contain mechanical data only, no prose, no descriptions. All data files follow strict naming and structure conventions documented in the existing files.

### Documentation

Documentation improvements are always welcome. If you find something unclear, outdated, or missing, fix it. Treat docs as part of implementation, not a follow-up task.

### Bug Reports and Feature Requests

Open an issue. For feature requests, describe the problem you are trying to solve, not just the solution you want. This helps us evaluate alternatives.

---

## Pull Request Process

1. **Check for an existing issue or spec**: If one exists, reference it in your PR.
2. **Create a spec if needed**: For non-trivial changes, create OpenSpec artifacts before writing code.
3. **Keep PRs focused**: One logical change per PR. Do not bundle unrelated changes.
4. **Write a clear description**: Explain what changed and why. Link to the spec if one exists.
5. **Ensure CI passes**: Run `pnpm lint` and `pnpm test` locally before pushing.
6. **Be responsive to review**: Address feedback promptly. We review with the goal of shipping, not blocking.

---

## Getting Started

```bash
git clone https://github.com/finger-gun/dragonbane-unbound.git
cd dragonbane-unbound
pnpm install
pnpm setup
pnpm dev
```

**Prerequisites:** Node.js 18+, pnpm 9+, Docker (for local Supabase)

See [docs/development.md](docs/development.md) for full setup details and [docs/local-supabase.md](docs/local-supabase.md) for Supabase configuration.

---

## Questions?

Open a discussion or issue. We are happy to help you get oriented.

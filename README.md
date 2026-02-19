<div align="center">

![Dragonbane Unbound](./assets/logo.png)

<h3>Run Dragonbane at the speed of play.</h3>

Dragonbane Unbound is an open-source, local-first platform for fast character creation, smooth encounters, and a community-driven content ecosystem. It is modular, self-hostable, and MIT-licensed, built for players, GMs, publishers, and developers.

</div>

## Why Dragonbane Unbound

- **Players**: Create and track characters with rules-backed automation
- **Game Masters**: Run combat and encounters quickly with audit-friendly rolls
- **Publishers**: Distribute official content as modular packs without locking players in
- **Developers**: Extend a clean, data-driven engine with portable content modules

## Core Capabilities

- **Rules Engine**: Deterministic, data-driven rules evaluation
- **Character Builder**: Fast creation with derived stats and validations
- **Encounter Runner**: Initiative, combat logs, and session state
- **Community Content**: Installable packs for monsters, items, and systems

## Built for Local-First

- Runs fully offline with optional sync
- Self-hostable by default, cloud is convenience
- Content and rules live in packages, not locked in databases

## Tech at a Glance

- TypeScript + React (Next.js web)
- Node API
- Supabase (Postgres/Auth/Storage)
- Turborepo + pnpm monorepo

## Documentation

- **[docs/MANIFEST.md](docs/MANIFEST.md)**: Project overview, architecture principles, and change tracking
- **[docs/PLATFORM_MANIFEST.md](docs/PLATFORM_MANIFEST.md)**: Platform vision and technical manifesto
- **[docs/PACKAGE_EXAMPLE.md](docs/PACKAGE_EXAMPLE.md)**: Example pack layouts and data-driven rules

## Development Workflow

This project uses [OpenSpec](https://openspec.dev/) for spec-driven development. OpenSpec provides a structured workflow for planning and implementing changes with AI assistants.

### Quick Start with OpenSpec

To propose a new change:
```bash
/opsx:new <change-name>
```

For complete workflow documentation, see [openspec/README.md](openspec/README.md).

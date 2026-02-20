<div align="center">

![Dragonbane Unbound](./assets/logo.png)

<h3>Run Dragonbane at the speed of play.</h3>

Dragonbane Unbound is an open-source, local-first platform for fast character creation, smooth encounters, and a community-driven content ecosystem. It is modular, self-hostable, and Apache-2.0-licensed, built for players, GMs, publishers, and developers.

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

- **[docs/manifest.md](docs/manifest.md)**: Project overview, architecture principles, and change tracking
- **[docs/platform-manifest.md](docs/platform-manifest.md)**: Platform vision and technical manifesto
- **[docs/package-example.md](docs/package-example.md)**: Example pack layouts and data-driven rules
- **[docs/development.md](docs/development.md)**: Development guidelines and documentation expectations
- **[docs/local-supabase.md](docs/local-supabase.md)**: Local Supabase setup and usage

## Development Workflow

This project uses [OpenSpec](https://openspec.dev/) for spec-driven development. OpenSpec provides a structured workflow for planning and implementing changes with AI assistants.

### Core Scripts

Run these from the repo root:

- `pnpm dev`: initializes env if missing, starts Supabase (if Docker is running), then runs dev targets
- `pnpm test`: runs all test targets
- `pnpm lint`: runs all lint targets
- `pnpm setup`: installs deps, initializes env, starts Supabase, verifies stack
- `pnpm supabase:init`: creates/updates `.env` with local defaults, keys, and free ports
- `pnpm supabase:up`: starts the local Supabase stack
- `pnpm supabase:down`: stops the local Supabase stack
- `pnpm supabase:verify`: checks local Supabase endpoints
- `pnpm supabase:seed-users`: seeds local admin/player/gm/super users

### Local Supabase

One-time setup:

```bash
pnpm setup
```

Initialize and start the local stack:

```bash
pnpm supabase:init
pnpm supabase:up
```

Verify health:

```bash
pnpm supabase:verify
```

Studio (control panel): `http://localhost:${SUPABASE_STUDIO_PORT}`

### Quick Start with OpenSpec

To propose a new change:
```bash
/opsx:new <change-name>
```

For complete workflow documentation, see [openspec/README.md](openspec/README.md).

---

<div align="center">

<img src="https://freeleaguepublishing.com/wp-content/uploads/2023/11/Dragonbane-license-logo-black.png" alt="Dragonbane Compatibility Logo" width="200">

Dragonbane Unbound is an independent, fan-made tool. It is not affiliated with or endorsed by Free League Publishing.

Dragonbane / Drakar och Demoner is a trademark of Free League Publishing.

</div>

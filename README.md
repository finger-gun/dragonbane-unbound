<div align="center">

![Dragonbane Unbound](./assets/logo.png)

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Local-First](https://img.shields.io/badge/Local--First-Offline_Ready-green.svg)](#built-for-local-first)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres_Auth_Storage-3FCF8E.svg?logo=supabase&logoColor=white)](https://supabase.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](CONTRIBUTING.md)

<h3>Run Dragonbane at the speed of play.</h3>

A companion app for your Dragonbane home games, built by players, for players.

</div>

---

## What Is This?

Dragonbane Unbound is an open-source, local-first companion tool for [Dragonbane](https://freeleaguepublishing.com/games/dragonbane/) (Drakar och Demoner). It handles the bookkeeping so you can focus on the game.

This is **not** a VTT, not a digital rulebook, and not a replacement for the official game. It is the tool we wished existed when running home games; fast character creation, smooth encounter tracking, and a clean way to manage aspects of the mechanical side of play.

**You still need the rulebooks to play.** This tool just makes it faster.

## Who Is This For?

- **Players**: Create and track characters with rules-backed automation
- **Game Masters**: Run combat and encounters quickly with audit-friendly rolls
- **Community Creators**: Build and share original homebrew content as modular packs
- **Developers**: Extend a clean, data-driven engine with portable content modules

## Core Capabilities

- **Rules Engine**: Deterministic, data-driven rules evaluation (formulas, brackets, effects)
- **Character Builder**: Fast creation with derived stats, validations, and age/kin/profession logic
- **Encounter Runner**: Initiative, combat logs, conditions, and session state
- **Content Packs**: Installable modules for homebrew monsters, items, spells, and systems

## Built for Local-First

- Runs fully offline, no account required, no cloud dependency
- Self-hostable by default; hosted cloud is optional convenience
- Content and rules live in packages, not locked in databases
- Your data is yours, always exportable, never captive

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Backend | Node.js, Fastify, TypeScript |
| Database | Supabase (Postgres + Auth + Storage) |
| Build | Turborepo + pnpm workspaces |
| Engine | Pure TypeScript, system-agnostic, data-driven |

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
```

## Quick Start

```bash
# Clone and install
git clone https://github.com/finger-gun/dragonbane-unbound.git
cd dragonbane-unbound
pnpm install

# One-command setup (installs deps, inits env, starts Supabase, verifies)
pnpm setup

# Start development
pnpm dev
```

**Prerequisites:** Node.js 18+, pnpm 9+, Docker (for local Supabase)

See [docs/development.md](docs/development.md) for full setup details and [docs/local-supabase.md](docs/local-supabase.md) for Supabase configuration.

## Contributing

We welcome contributions! Whether it is homebrew content, engine improvements, UI work, or documentation, there is room for everyone.

**Before you start, please read [CONTRIBUTING](CONTRIBUTING.md).** Key points:

- All features require specification files (OpenSpec), no exceptions
- If AI is used in any part of development, spec files are **mandatory**
- Contributions must not include official rulebook text or copyrighted content
- See [docs/legal](docs/legal.md) for content guidelines

This project uses [OpenSpec](https://openspec.dev/) for spec-driven development. Every change goes through a structured proposal, spec, and implementation workflow.

## Documentation

| Document | Description |
|----------|-------------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute, legal requirements, workflow |
| [docs/legal.md](docs/legal.md) | Legal and license guidance, content compliance |
| [docs/manifest.md](docs/manifest.md) | Project overview and change tracking |
| [docs/platform-manifest.md](docs/platform-manifest.md) | Platform vision and technical manifesto |
| [docs/package-example.md](docs/package-example.md) | Content pack format and data-driven rules examples |
| [docs/development.md](docs/development.md) | Development setup and technical guidelines |
| [docs/local-supabase.md](docs/local-supabase.md) | Local Supabase setup and usage |

## Project Status

Dragonbane Unbound is in **early alpha**. The data layer and specification work is underway, no game logic or UI is implemented yet. We are building the foundation right.

## License

This project is licensed under [Apache-2.0](LICENSE). See [docs/legal.md](docs/legal.md) for details on how content licensing works separately from the platform license.

---

<div align="center">

<img src="https://freeleaguepublishing.com/wp-content/uploads/2023/11/Dragonbane-license-logo-black.png" alt="A Supplement For Dragonbane" width="200">

Dragonbane Unbound is not affiliated with, sponsored, or endorsed by Fria Ligan AB. This project was created under Fria Ligan AB's Dragonbane Third Party Supplement License.

Dragonbane is a trademark of Fria Ligan AB. Drakar och Demoner and Ereb Altor are registered trademarks of Fria Ligan AB.

</div>

![Dragonbane Unbound](../assets/logo.png)

# Platform Manifesto

## The Core Belief

Tabletop RPGs thrive when tools remove friction, not freedom.

**Dragonbane Unbound** is not a replacement for the rulebooks.
It is a *play accelerator*:

* faster character creation
* smoother combat
* cleaner campaign continuity
* stronger community creativity

---

## Open by Default

Dragonbane Unbound is:

* **open-source**
* **local-first**
* **community-extensible**
* **licensed-content-friendly**

The platform belongs to the players.

No walled garden.
No DRM-first mindset.
No locked characters behind subscriptions.

---

## The Platform Model

### 1. Engine = Forever Free

The core engine will always be:

* MIT licensed
* fully inspectable
* runnable offline
* independent of any publisher content

This includes:

* rules evaluation
* dice rolling
* character sheet framework
* campaign state system
* encounter runner logic

The engine is a toolkit for *any* RPG system.
Dragonbane is simply the first flagship module.

---

### 2. Rules & Content are Modular Packages

Everything beyond the engine is a package:

```
@dbu/engine
@dbu/system-dragonbane-core
@dbu/system-homebrew
@dbu/content-community-pack
@dbu/content-licensed-freeleague
```

Packages can be:

* enabled
* disabled
* replaced
* forked
* community-maintained

This gives the project a built-in legal escape hatch:

> If official-compatible content ever becomes problematic, the platform survives unchanged.

---

### 3. Local-First is Non-Negotiable

Dragonbane Unbound must run:

* fully offline
* fully self-hosted
* without paid accounts
* without central dependency

Supabase is chosen because:

* Postgres is portable
* Auth is optional
  n- Storage is replaceable
* Local Supabase works cleanly in Docker

The hosted service is convenience, not captivity.

---

## Community First, Publisher Friendly

### Homebrew is the default content layer

Users can create:

* monsters
* items
* spells
* professions
* campaigns
* custom rulesets

The community builds the world.

---

### Licensed content is the “official expansion layer”

We aim for partnerships where publishers can offer:

* official bestiaries
* adventures
* campaign modules
* art assets
* curated rule packs

Dragonbane Unbound becomes a distribution channel that **sells books**, not pirates them.

---

## Business Model: Open Core, Paid Hosting

The project is free forever.

Revenue comes from:

### Hosted convenience

* managed accounts
* multiplayer sync
* campaign cloud storage
* cross-device persistence

### Mobile companion app

* offline-first client
* push notifications
* session mode UX

### Licensed publisher add-ons

* official content packs
* premium adventures
* sanctioned expansions

No subscription required to play locally.

---

## Legal Philosophy

We do not distribute copyrighted rulebook text.

We provide:

* mechanics automation
* user-created data
* publisher-approved packs

The platform is a “VTT-style supplement engine,” not a digital rulebook clone.

---

## Technical Vision

### Monorepo Structure

```
apps/
  web/          Next.js frontend
  api/          Node backend
  mobile/       React Native (later)

packages/
  engine/       Pure rules engine
  ui/           Shared components
  types/        Shared TS types
  systems/      Game system modules
  content/      Content packs (JSON)
```

---

### Rules Engine Design

Rules are data-driven:

```ts
derivedStat("hp", {
  formula: "floor(strength / 2)"
})
```

Effects are composable:

```ts
effect("bane", {
  appliesTo: "agility",
  modifier: -2
})
```

Rolls are auditable:

```json
{
  "input": "agility + bane",
  "dice": "d20",
  "result": 12,
  "success": true
}
```

Everything deterministic, testable, portable.

---

## Content Pack System

Content is shipped as versioned bundles:

```json
{
  "name": "Community Bestiary Vol. 1",
  "requires": ["system-dragonbane-core"],
  "monsters": [...]
}
```

Users can:

* install packs
* fork packs
* export packs
* share packs

Licensed packs are cryptographically signed.

---

## The Long-Term Dream

Dragonbane Unbound becomes:

* the best way to run Dragonbane online
* the best way to manage campaigns offline
* a thriving homebrew ecosystem
* a publisher-friendly digital marketplace
* an open platform that outlives any single ruleset

---

## Closing Line

**Make Dragonbane run at the speed of play — unbound, open, and owned by the community.**

---

# Tech & Architecture Manifesto

## Principles

1. **Local-first, cloud-optional**
   Everything must run 100% locally (Docker + local Supabase). Hosted services are convenience, never a requirement.

2. **Engine-first, content-second**
   The platform core is a generic tabletop engine. Game systems and content are modular packages.

3. **Data-driven rules, auditable outcomes**
   Rules are expressed as declarative data (DSL/JSON) and evaluated deterministically. Every roll and derived value is reproducible from its inputs.

4. **Modularity as a safety valve**
   Any system/content module can be enabled/disabled without breaking the rest of the platform.

5. **Open-source is a feature, not a slogan**
   Easy to run, easy to contribute to, easy to fork. Clean boundaries. Good docs. Stable interfaces.

---

## Monorepo

**Turborepo + pnpm**.

```
apps/
  web/            Next.js web client
  api/            Node API (or Next route handlers)
  mobile/         React Native / Expo (later)
  docs/           Documentation site

packages/
  engine/         Rules + rolls + effects engine (pure TS)
  systems/        Game system modules (Dragonbane core, homebrew, etc.)
  content/        Content packs (JSON bundles)
  ui/             Shared design system/components
  types/          Shared TS types + Zod schemas
  utils/          Shared helpers (date, math, ids)
  adapters/       Storage/adapters (Supabase, local, etc.)
```

**Rule:** apps depend on packages; packages avoid depending on apps.

---

## Runtime Architecture

### Web (MVP)

* **Next.js (TypeScript)**
* Server components where helpful, but keep the rules engine client-safe.
* “Table Mode” UI optimized for rapid use mid-session.

### API

* Node TypeScript service for:

  * campaign sync
  * multiplayer presence
  * pack registry
  * signatures/licensing (future)

### Database/Auth/Storage

* **Supabase (Postgres + Auth + Storage)**
* Must support:

  * Local Supabase for self-hosters
  * Hosted Supabase for the paid offering
* Auth is optional locally (single-user mode supported).

---

## Data Model (Canonical)

* **Users**: accounts, identities, preferences
* **Campaigns**: membership, roles, permissions
* **Characters**: sheet data + derived values + effects
* **Items**: inventory, containers, consumables
* **Encounters**: combatants, initiative, logs
* **Packs**: installed packs, versions, provenance

All stored entities are **versioned** (schema version + migration strategy).

---

## Rules System

### Rules DSL (preferred)

A small, safe DSL to express:

* derived stats (formulas)
* roll construction (dice + modifiers)
* effects (additive, conditional, scoped)
* validations (requirements, ranges)

**No arbitrary code execution** in community packs.

### Determinism

* Given the same inputs, the engine yields the same outputs.
* Randomness is isolated to a roll seed/source.
* Every outcome produces a “receipt” (inputs → steps → output).

---

## Content Packs

### Pack Types

* **System packs**: rules + sheet definitions
* **Content packs**: monsters, items, spells, adventures (data)
* **UI packs (optional)**: icons, skins, themes

### Pack Registry

* Self-hostable registry + optional official registry.
* Packs are:

  * semver versioned
  * dependency declared
  * exportable/importable

### Trust & Safety

* Community packs are unsigned by default.
* Licensed/official packs are cryptographically signed.

---

## Deployment

### Local (first-class)

* `docker compose up` brings up:

  * web
  * api
  * supabase (db/auth/storage)

### Hosted (paid offering)

* Container-based deploy (Fly/Render/K8s/etc.).
* Managed Postgres/Supabase.

---

## Security & Privacy

* Least-privilege DB policies (Row Level Security).
* Clear separation between campaign roles (GM vs player permissions).
* Privacy-first defaults: your data is yours; exporting is always possible.

---

## Quality Bar

* Engine has strong unit tests.
* Golden test vectors for core rules.
* End-to-end “session flows” (create character → join campaign → run encounter).
* Observability in hosted mode (metrics/logging), but never required locally.

---

## Backwards Compatibility

* Versioned schemas for:

  * characters
  * campaigns
  * packs
* Migration tooling included.
* Breaking changes are rare, documented, and scripted.

---

## Closing Line

**Build the engine so it outlives any single ruleset. Build the platform so it never locks players in.**

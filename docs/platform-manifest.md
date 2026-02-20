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
* **licensed-content-ready** (architecture supports it, pending agreements)

The platform belongs to the players.

No walled garden.
No DRM-first mindset.
No locked characters behind subscriptions.

---

## The Platform Model

### 1. Engine = Forever Free

The core engine will always be:

* Apache-2.0 licensed
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
@dbu/content-licensed-freeleague   (future — requires publisher agreement)
```

Packages can be:

* enabled
* disabled
* replaced
* forked
* community-maintained

This modular separation ensures the platform's core value is independent of any specific content. Content modules can be updated, replaced, or removed without affecting the platform itself.

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

### Licensed content could become an official expansion layer

If publisher partnerships are established in the future, publishers could offer:

* official bestiaries
* adventures
* campaign modules
* art assets
* curated rule packs

The architecture supports this, but **no licensed content features will be built until formal agreements exist**. See `docs/legal.md` Section 8 for details on when publisher contact is required.

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

### Creator and publisher content (future, requires agreements)

* community creator packs (free or paid)
* publisher-licensed content packs (pending formal agreements)

No subscription required to play locally. Revenue from licensed publisher content would require explicit partnership agreements — see `docs/legal.md` Section 8.

---

## Legal Philosophy

The platform is designed to avoid distributing copyrighted rulebook text. During development, reference data files may contain content that must be stripped before any public release (see `docs/legal.md` for current compliance status).

What we provide:

* mechanics automation (formulas, dice, derived values)
* user-created and community-created content
* architecture that *could* support publisher-approved packs, pending formal agreements

What we do not provide:

* official rulebook text or descriptions
* content that replaces the need to own the game
* publisher-licensed packs (no agreements exist yet)

The platform is a companion tool — not a digital rulebook clone and not a replacement for any VTT. It exists to help players enjoy Dragonbane at the table, built by players for players.

> For full legal guidance, see `docs/legal.md`.

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

If licensed packs are supported in the future (pending publisher agreements), they could be cryptographically signed to verify authenticity.

---

## The Long-Term Dream

Dragonbane Unbound becomes:

* the best companion app for running Dragonbane at the table
* the best way to manage characters and campaigns offline
* a thriving community homebrew ecosystem
* a place where creators can share content they love — and if publishers want to join, we would welcome them
* an open platform that outlives any single ruleset

---

## Legal Prerequisites

The following planned features **require explicit publisher permission** before implementation. They are documented here as aspirational goals, not current capabilities. See `docs/legal.md` Section 8 for full guidance.

### Requires Free League agreement

| Feature | Why |
|---------|-----|
| Licensed publisher content packs | Distributing official content requires publisher authorization |
| Content marketplace (paid or free) | Positioning as a distribution channel for publisher IP requires a formal relationship |
| Cryptographic signing of official packs | Implies an authentication/trust model that only works with a formal agreement |
| Bilingual (Swedish + English) official content | Supporting both official language lines simultaneously is flagged as requiring contact |

### Can build now (no publisher agreement needed)

| Feature | Why |
|---------|-----|
| Core engine (rules evaluation, dice, effects) | Original engineering work, system-agnostic |
| Character sheet framework | State management and UI — no copyrighted content |
| Community homebrew system | User-created original content |
| Local-first / self-hosted deployment | Infrastructure, no content concerns |
| Hosted convenience services | Our own infrastructure offering |
| Mobile companion app | Our own client application |
| Content pack architecture (empty templates) | The architecture itself is original work |

### The path forward

This project is a work of passion — built by players, for players. The primary goal is to help more people enjoy Dragonbane at the table. We would welcome the opportunity to collaborate with Free League and provide a place where the community and publishers alike can share the content we all love. But until those conversations happen, we build only what we can build responsibly.

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
  * signatures/licensing (future, pending publisher agreements)

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
* Licensed/official packs could be cryptographically signed (pending publisher agreements).

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

# Dragonbane Unbound – Legal & License Guidance

*Version 0.5*
*Last updated: 2026‑02‑20*

> **Disclaimer:** This document is not a legal contract or advice. It is a practical compliance guide for keeping Dragonbane Unbound within the scope of Free League’s third‑party license and general copyright/trademark boundaries.

## 1. Project Intent

Dragonbane Unbound is intended to be a **companion tool**, not a replacement for the Dragonbane / Drakar och Demoner core rulebooks or expansions.

The platform exists to:

* Manage characters and progression
* Track items, conditions, and derived values
* Provide fast in-session support (dice, modifiers, status effects)

It is **not** intended to:

* Provide a full playable standalone rules system
* Replace the need for the official rulebooks
* Replace or act as any VTT modules for the game
* Distribute official Free League content

---

## 2. Guiding Principle

**The rulebook must remain necessary.**

The tool may calculate and track mechanics, but it must not reproduce the rulebook’s written rules or provide enough content to play without owning the official game.

---

## 3. Allowed vs Not Allowed (High-Level)

| Category        | Allowed                                 | Not Allowed                              |
|-----------------|-----------------------------------------|------------------------------------------|
| Companion tools | Character sheets, calculators, trackers | Standalone playable digital Dragonbane   |
| Mechanics       | Internal math, modifiers, dice logic    | Full reproduction of core rules chapters |
| Content         | Community-created original material     | Shipping official spells/abilities text  |
| Encounters      | Tracking initiative/HP/conditions       | Fully automated combat resolution engine |
| Branding        | Compatibility logo + disclaimer         | Using trademarks as if official          |

---

## 4. DO / DON’T Tables

### Character Builder

| DO                                    | DON’T                                    |
|---------------------------------------|------------------------------------------|
| Calculate skill bases from attributes | Copy-paste character creation text       |
| Let players select abilities by name  | Include full heroic ability descriptions |
| Reference rulebook page numbers       | Provide complete rules explanations      |

---

### Status Effects & Conditions

| DO                                               | DON’T                                                 |
|--------------------------------------------------|-------------------------------------------------------|
| Track conditions like Angry, Scared, Poisoned    | Include the full rulebook wording for them            |
| Apply mechanical flags (e.g., Bane on STR rolls) | Explain the entire procedure of when/how they trigger |
| Provide short reminders + page refs              | Replace the rulebook’s condition section              |

---

### Dice & Modifiers

| DO                                                       | DON’T                                        |
|----------------------------------------------------------|----------------------------------------------|
| Implement dice mechanics (Bane = roll twice, keep worst) | Provide full “how to resolve checks” text    |
| Offer a dice roller integrated with sheets               | Turn the app into a complete rules simulator |

---

### Encounter Support

| DO                                    | DON’T                                      |
|---------------------------------------|--------------------------------------------|
| Track initiative order and HP         | Fully automate combat start-to-finish      |
| Allow GM to apply conditions manually | Auto-run encounters without GM involvement |
| Support quick math and state tracking | Replace the need to consult combat rules   |

---

### Community Content

| DO                                                    | DON’T                                   |
|-------------------------------------------------------|-----------------------------------------|
| Allow users to create original kin/professions/spells | Allow uploads of copied official text   |
| Provide structured templates and tools                | Host official content packs             |
| Encourage creative homebrew                           | Market as “official Dragonbane content” |

---

## 5. Content Packaging Strategy (Recommended)

### Safe Architecture

1. **Generic mechanics engine** (system-agnostic)
2. **Dragonbane data packs** created by users/community
3. No bundled official text or descriptions
4. Always include rulebook references

This reduces risk of the tool being seen as a replacement rule system.

### Current Gap

The architecture described in `docs/package-example.md` and `docs/platform-manifest.md` follows this structure in principle. The following items have been addressed:

1. ~~Ensure no packs shipped by the project contain official text~~ — Done. Example packs replaced with original homebrew content (LR‑017).
2. ~~Provide empty templates or original homebrew content as examples instead~~ — Done. `package-example.md` now uses original Ironvale homebrew examples and user-assembled templates.
3. ~~Add a `content_license` field to the pack manifest schema~~ — Done. All data files and example manifests include `content_license` (LR‑017 point 3).
4. ~~Clearly document that the "user-assembled" model is the expected path for official Dragonbane content~~ — Done. `package-example.md` now documents the user-assembled model with workflow explanation.

The reference data files in `docs/character_creation/` still contain structured data from official sourcebooks (numerical tables, brackets, formulas) but all prose/descriptions have been stripped (LR‑001 through LR‑014). These files are development reference data marked `"content_license": "personal-use-only"` and are not intended for distribution.

---

## 6. Required Disclaimers

All distributions should include:

> Dragonbane Unbound is an independent, fan-made tool. It is not affiliated with or endorsed by Free League Publishing.

> Dragonbane / Drakar och Demoner is a trademark of Free League Publishing.

---

## 7. Risk Levels for Features

| Feature                                       | Risk Level | Notes                                                     |
|-----------------------------------------------|------------|-----------------------------------------------------------|
| Character sheet management                    | Low        | Core companion tool behavior                              |
| Derived stat calculation                      | Low        | Internal math                                             |
| Status effect tracking                        | Low        | State management                                          |
| Dice roller with modifiers                    | Low        | Mechanical automation                                     |
| Ability selection by name only                | Medium-Low | Add page references                                       |
| Bundling short original reminders per ability | Medium     | Keep wording original, not copied                         |
| Data-driven rules engine (formulas, brackets) | Medium     | Safe if no rulebook text is embedded                      |
| Content pack system (architecture)            | Medium     | Architecture is fine; what ships in packs determines risk |
| Bilingual Swedish + English data              | Medium     | See Section 8 — triggers "both official lines"            |
| Full automation of combat procedures          | High       | Keep GM decisions manual                                  |
| Distributing packs with official content      | Very High  | Requires publisher permission regardless of format        |
| Bundling official spell/ability text          | Very High  | Full descriptions are protected expression                |
| Official content marketplace/distribution     | Very High  | Requires formal Free League partnership                   |
| Commercializing the platform at scale         | Very High  | Requires Free League contact per Section 8                |

---

## 8. When to Contact Free League

You should strongly consider direct permission if you plan to:

* Distribute official-like content packs
* Automate full encounter resolution
* Commercialize the platform at scale
* Support both Swedish and English official lines simultaneously

### Features in Current Plans That Trigger This Section

Based on `docs/platform-manifest.md` and `docs/package-example.md`, the following planned features require publisher contact before implementation:

| Planned Feature                           | Source Document                       | Trigger                              |
|-------------------------------------------|---------------------------------------|--------------------------------------|
| Licensed publisher add-ons as revenue     | `platform-manifest.md` lines 156–161  | Commercialization + official content |
| Digital marketplace for content           | `platform-manifest.md` line 264       | Official content distribution        |
| Cryptographic signing of licensed packs   | `platform-manifest.md` lines 253, 403 | Implies official partnership         |
| Bilingual (EN + SV) data across all files | All `character_creation/*.json`       | Both official language lines         |
| Core system pack with official content    | `package-example.md` lines 9–41       | Distributing official content        |

None of these should be built or shipped before obtaining explicit permission.

---

## 9. Living Document

This guidance should be updated as:

* The project scope evolves
* Free League updates their licenses
* Community content systems mature

## 10. ORC License Clarification (BRP / Chaosium)

Dragonbane is mechanically inspired by classic roll‑under systems such as Basic Roleplaying (BRP). However:

* Dragonbane is **not** published under the ORC license.
* The ORC license only applies to material explicitly released as “Licensed Content” under ORC.
* Similar mechanics (e.g., roll‑under d20 skill checks) do **not** automatically grant reuse rights.

Therefore:

* ORC does not provide additional permission to reproduce Dragonbane rules, text, or structured rule content.
* Dragonbane support within this project must comply exclusively with Free League’s third‑party license.

### Practical Implications for Dragonbane Unbound

| Scenario                                         | ORC Applies?                                          | Notes                                                          |
|--------------------------------------------------|-------------------------------------------------------|----------------------------------------------------------------|
| Using generic roll‑under mechanics in the engine | Yes (if our own content is released under ORC/Apache) | Mechanics themselves are not owned by Dragonbane               |
| Reproducing Dragonbane rule text                 | No                                                    | Governed by Free League license                                |
| Bundling official Dragonbane content             | No                                                    | Requires Free League permission                                |
| Creating an open system‑agnostic engine          | Yes                                                   | If the engine is original and not derived from Dragonbane text |

### Recommended Structural Separation

To minimize legal risk:

1. Keep the **core mechanics engine system‑agnostic**.
2. Avoid embedding official Dragonbane rule text or structured rule reproductions.
3. Treat Dragonbane compatibility as a configuration/data layer rather than bundled content.
4. Clearly document that ORC does not grant rights over Dragonbane materials.

References:

* [https://www.chaosium.com/orclicense/](https://www.chaosium.com/orclicense/)
* [https://www.chaosium.com/content/orclicense/ORC_License_FINAL.pdf](https://www.chaosium.com/content/orclicense/ORC_License_FINAL.pdf)

---

## Project Licensing

### Platform License: Apache-2.0

All platform code, engine modules, and community contributions in this repository are licensed under **Apache-2.0**. The full license text is in the repository root (`LICENSE`).

The `license` field is declared in the root `package.json` and all workspace sub-packages. All documentation references have been aligned to Apache-2.0.

### Why Apache-2.0 Over MIT

Both are permissive open-source licenses, but Apache-2.0 was chosen for specific reasons:

- **Explicit patent grant** — Apache-2.0 includes a patent license that protects contributors and users from patent claims. MIT does not address patents at all.
- **Attribution requirements** — Apache-2.0 requires derivative works to include a copy of the license and a NOTICE file if one exists. This gives the project more visibility when forked or redistributed.
- **Better fit for publisher interaction** — A project that interfaces with publisher-owned content benefits from the clearer legal framework that Apache-2.0 provides compared to MIT's minimalist terms.

### Content Pack Licensing

The platform license (Apache-2.0) covers the *software and engine*. Individual content packs may carry different licenses depending on their origin:

- **Original/community content** — covered by Apache-2.0 or the author's chosen license
- **Publisher-licensed content** — would carry the publisher's own license terms, pending formal agreements
- **Personal-use reference data** — marked `"content_license": "personal-use-only"` in pack manifests; not for distribution

The `content_license` field in each pack's `_meta` block handles per-pack licensing independently from the platform license. See `docs/package-example.md` for manifest examples.

### Third-Party Tooling Plugins

The `.kilocode/`, `.codex/`, and `.github/skills/` directories contain third-party AI tooling plugins (SKILL.md files) that declare `license: MIT`. These are independent of the project license — they are tooling configuration files authored by their respective tool vendors, not project source code.

---

## 11. Mechanics vs Expression – What Is Likely Protected?

This section provides practical guidance on the difference between **game mechanics** (usually not protected on their own) and **creative expression** (protected text, presentation, and trademarks).

> This is not a legal contract or advice — it is a project design guideline.

### A. Generally Safer: Mechanics / Systems

These are typically abstract mechanics or mathematical relationships. Implementing them in code is usually lower risk, as long as you do not copy explanatory rulebook text.

| Example                                        | Risk Level | Notes                      |
|------------------------------------------------|------------|----------------------------|
| “Roll under your skill on a d20”               | Low        | Generic resolution concept |
| “Bane = roll twice, keep the worst”            | Low        | Dice mechanic              |
| Attribute → skill base formulas                | Low        | Mathematical calculation   |
| Applying numeric modifiers from conditions     | Low        | Mechanical adjustment      |
| Tracking HP, initiative, inventory, conditions | Low        | State management           |

---

### B. Higher Risk: Protected Expression

These elements are usually protected because they are written creative content or distinctive presentation.

| Example                                             | Risk Level | Why                      |
|-----------------------------------------------------|------------|--------------------------|
| Exact phrases copied from the rulebook              | Very High  | Copyrighted text         |
| Full heroic ability or spell descriptions           | Very High  | Creative written content |
| Profession/kin narrative write-ups                  | Very High  | Expression + lore        |
| Copying official tables as presented                | High       | Creative arrangement     |
| Rewriting rules too closely to the original wording | High       | Derivative expression    |

---

### C. Grey Zone: Requires Careful Design

Some features are useful but must be implemented carefully.

| Example                                         | Risk Level | Mitigation                        |
|-------------------------------------------------|------------|-----------------------------------|
| Listing ability names without descriptions      | Medium-Low | Add page references               |
| Short 1-line reminders                          | Medium     | Keep wording original and minimal |
| Structured data representing official abilities | Medium     | Avoid bundling official text      |
| Full procedural automation of combat            | High       | Keep GM decisions manual          |

---

### Practical Rule of Thumb

Ask:

* **Could someone play Dragonbane without owning the book?** → Risk increases.
* **Does this only calculate/track something defined elsewhere?** → Safer companion behavior.

This principle should guide feature scope decisions throughout the project.

---

## 12. Docs Risk Assessment — Full Audit

*Audit performed: 2026‑02‑20*
*Scope: All 28 files in `docs/`*

This section documents every legal risk identified by cross‑referencing the files in `docs/` against the guidance in Sections 1–11 above. Each risk has a unique ID, the affected file(s), a severity level, a description of the misalignment, and a concrete mitigation.

### Severity Definitions

| Level        | Meaning                                                                                                                                                |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Critical** | Directly violates "Not Allowed" items from Section 3 — full reproduction of protected expression. Requires immediate remediation.                      |
| **High**     | Reproduces enough structured content to plausibly replace the rulebook for a given subsystem. Should be remediated before any public distribution.     |
| **Medium**   | Aggregates content in a way that trends toward rulebook replacement, or creates architectural risk. Should be addressed as part of normal development. |
| **Low**      | Minor inconsistency or informational issue. Fix opportunistically.                                                                                     |

---

### Risk Register

#### LR‑001 — Full Spell Descriptions (Critical)

**File:** `docs/character_creation/corebook-magic.json`
**Sections violated:** 3 (Not Allowed: "Shipping official spells/abilities text"), 4 Character Builder DON'T ("Include full heroic ability descriptions"), 7 (Very High: "Bundling official spell/ability text"), 11B (Very High: "Full heroic ability or spell descriptions")

**Description:** Contains complete `description` and `description_sv` fields for every spell across all four magic schools (General, Animism, Elementalism, Mentalism) — including cantrips, rank 1–3 spells, casting times, ranges, durations, components, damage values, and detailed mechanical narratives. Both English and Swedish text are reproduced verbatim. This file alone constitutes a full reproduction of the Magic chapter's spell list.

**Mitigation:**
1. Remove the `description` and `description_sv` fields entirely, or replace them with a 5–8 word functional reminder (e.g., "Heals target — see p.XX").
2. Retain `mechanical_effects` arrays as the structured data layer for the engine.
3. Add `source_page` fields to each spell pointing to the rulebook page.
4. Consider whether `mechanical_effects.note` fields also reproduce too much text and trim accordingly.

---

#### LR‑002 — Full Heroic Ability Descriptions (Critical)

**File:** `docs/character_creation/corebook-heroic-abilities.json`
**Sections violated:** 3, 4 Character Builder DON'T, 7, 11B

**Description:** Contains `description` and `description_sv` for all 44 heroic abilities with complete mechanical narratives — activation conditions, WP costs, restrictions, durations, and precise effect text. This is a near-verbatim reproduction of the Heroic Abilities chapter.

**Mitigation:**
1. Strip `description` and `description_sv` fields. Replace with short functional labels (e.g., "Extra parry without using action") of no more than ~10 words.
2. Retain `mechanical_effects` for engine use.
3. Add `source_page` references.

---

#### LR‑003 — Full Dark Magic Spell Descriptions (Critical)

**File:** `docs/character_creation/brandajorden-magic.json`
**Sections violated:** 3, 4, 7, 11B

**Description:** Reproduces the entire Dark Magic school from "Den brända jorden" — 19 spells plus 3 cantrips with full `description`/`description_sv` text. Also includes summoned creature stat blocks and monster attack tables. As a third‑party adventure module, this content is protected by its own publisher's copyright.

**Mitigation:**
1. Same as LR‑001: strip description fields, keep `mechanical_effects`.
2. Remove embedded monster stat blocks — these are clearly protected expression.
3. Confirm licensing terms with the adventure module's publisher (not just Free League).

---

#### LR‑004 — Full Profession Flavor Text (Critical)

**File:** `docs/character_creation/brandajorden-professions.json`
**Sections violated:** 11B (Very High: "Profession/kin narrative write-ups")

**Description:** Contains multi-paragraph lore descriptions for the Dark Mage and Dark Knight professions — narrative flavor text reproduced from the adventure module. This is creative expression, not mechanical data.

**Mitigation:**
1. Remove the narrative `description`/`description_sv` fields entirely.
2. Replace with a single-sentence original summary if a description is needed for UI purposes.

---

#### LR‑005 — Full Kin Ability Descriptions (High)

**Files:** `docs/character_creation/corebook-kins.json`, `docs/character_creation/monsterboken-kins.json`, `docs/character_creation/drakborgen-kins.json`
**Sections violated:** 4 Character Builder DON'T, 11B

**Description:** All kin files contain full ability descriptions with complete mechanical effects text for every kin ability. The Monsterbook file additionally includes Nightkin/Melancholy modifier rules and an expanded kin table. The Drakborgen file includes the complete Half-Elf kin entry.

**Mitigation:**
1. Strip ability description text, keep mechanical effects arrays.
2. Use name + page reference instead of full descriptions.

---

#### LR‑006 — Complete Equipment Tables (High)

**File:** `docs/character_creation/corebook-equipment.json`
**Sections violated:** 11B (High: "Copying official tables as presented"), 2 (Guiding Principle)

**Description:** Reproduces the complete weapon and armor tables from the core rulebook — every item with damage, durability, price, STR requirements, grip, availability, and properties. Also includes full weapon property descriptions and masterwork rules. A user with this file would not need the Equipment chapter.

**Mitigation:**
1. Retain the numerical stat data (needed for engine calculations).
2. Remove weapon property text descriptions — replace with short mechanical labels (e.g., "Toppling: target must make STR roll" → just the mechanical_effects entry).
3. Remove masterwork rule descriptions — reference page numbers instead.

---

#### LR‑007 — Complete Character Creation Rules (High)

**File:** `docs/character_creation/corebook-rules.json`
**Sections violated:** 3 (Not Allowed: "Full reproduction of core rules chapters"), 2 (Guiding Principle)

**Description:** Contains the complete character creation flow, attribute rolling methods, age categories with modifiers, derived rating formulas and bracket tables, conditions system, encumbrance rules, currency exchange rates, and the full experience/advancement system including session questions. Collectively, this file reproduces enough to run character creation without the rulebook.

**Mitigation:**
1. Keep formulas and numerical tables needed for computation.
2. Remove explanatory rule text — replace with `source_page` references.
3. Remove session questions (these are creative expression, not math).
4. Consider splitting into "engine data" (formulas, brackets) and "reference text" (descriptions) with only the engine data retained.

---

#### LR‑008 — Complete Skills List with Descriptions (High)

**File:** `docs/character_creation/corebook-skills.json`
**Sections violated:** 11B, 2

**Description:** All 33 skills listed with descriptions, linked attributes, and the base chance bracket table.

**Mitigation:**
1. Retain skill names, linked attributes, and base chance brackets (needed for engine).
2. Strip `description` text — use name + page reference only.

---

#### LR‑009 — Complete Profession Data with Gear Tables (High)

**File:** `docs/character_creation/corebook-professions.json`
**Sections violated:** 11B, 2

**Description:** All 10 professions with full skill lists, starting gear tables (with all items and roll ranges), heroic ability links, and mage sub-type details including magic school creation rules. The gear tables reproduce the exact random roll ranges from the rulebook.

**Mitigation:**
1. Keep structural links (profession → skill list, profession → heroic ability names).
2. Remove or abbreviate starting gear roll tables — these are creative arrangements.
3. Add `source_page` references throughout.

---

#### LR‑010 — Comprehensive Character Creation Guide (Medium)

**File:** `docs/character_creation/character-creation-guide.md`
**Sections violated:** 2 (Guiding Principle), 3

**Description:** A ~500-line guide that aggregates kin tables, profession tables, attribute rules, skill tables, magic overview, equipment tables, condition rules, the experience system, and a complete worked example. While it references JSON files, the guide itself contains enough standalone information to create a character without owning the rulebook.

**Mitigation:**
1. Refactor the guide to be a *process reference* rather than a *content reference* — describe steps and link to data files, but do not reproduce tables inline.
2. Remove the worked example's embedded rule reproductions.
3. Use page references throughout instead of restating rules.

---

#### LR‑011 — Character Sheet Guide (Medium)

**File:** `docs/character_creation/character-sheet-guide.md`
**Sections violated:** 2, 11C (Medium: "Short 1-line reminders")

**Description:** A ~322-line guide describing every field on the character sheet with rule references, rest mechanics, and an example character. Individually each entry is a short reminder, but the aggregate effect reproduces a significant amount of the rules.

**Mitigation:**
1. Reduce field descriptions to purely functional labels for UI purposes.
2. Replace rule explanations with page references.
3. Remove the complete rest mechanics section — this is rules reproduction.

---

#### LR‑012 — Effect Primitives Spec with Worked Examples (Medium)

**File:** `docs/character_creation/effect-primitives-spec.md`
**Sections violated:** 11C

**Description:** An ~861-line technical spec that, while primarily an engineering document, includes many worked examples reproducing exact ability and spell mechanics verbatim from the rulebook.

**Mitigation:**
1. Replace verbatim ability/spell text in examples with clearly original pseudo-examples.
2. Keep the technical specification and primitive taxonomy — these are original engineering work.

---

#### LR‑013 — Complete Weakness and Appearance Tables (Medium)

**Files:** `docs/character_creation/corebook-weaknesses.json`, `docs/character_creation/corebook-appearance.json`
**Sections violated:** 11B (High: "Copying official tables as presented")

**Description:** Complete d20 weakness table (20 entries with descriptions) and d20 appearance table plus d20 memento table reproduced from the rulebook. These are creative arrangements of authored content.

**Mitigation:**
1. Remove description text from weaknesses — keep names + page references.
2. For appearance/memento tables, consider whether these are needed for the engine at all. If so, use name-only entries with page references.

---

#### LR‑014 — Drakborgen Heroic Ability (Medium)

**File:** `docs/character_creation/drakborgen-heroic-abilities.json`
**Sections violated:** 11B

**Description:** Contains the "Lucky" heroic ability with full description text from the Drakborgen module.

**Mitigation:**
1. Same as LR‑002: strip description, keep mechanical_effects.

---

#### LR‑015 — License Inconsistency Across Project Documents (Medium)

**Files:** `docs/manifest.md` (line 11 vs line 55), `docs/platform-manifest.md` (line 42)
**Sections violated:** N/A (internal consistency), but has downstream legal implications

**Description:** The project license is stated inconsistently across documentation:
- `docs/manifest.md` line 11: "License: **Apache-2.0**"
- `docs/manifest.md` line 55 (Architecture Principles): "Full **MIT** licensing for maximum flexibility"
- `docs/platform-manifest.md` line 42: "**MIT** licensed"

Apache-2.0 and MIT have meaningful differences — Apache-2.0 includes an explicit patent grant and requires attribution notices in derivative works, while MIT does not. This inconsistency creates ambiguity about what contributors and users are actually agreeing to. If the project ships with conflicting license declarations, a publisher partner (e.g., Free League) evaluating the project would see a red flag before any conversation begins.

**Mitigation:**
1. Decide on a single license and update all references across `manifest.md`, `platform-manifest.md`, and any `LICENSE` file in the repository root.
2. If dual licensing is intentional (e.g., Apache-2.0 for the engine, MIT for content packs), document this explicitly in a "Licensing" section added to `legal.md`.
3. Ensure the chosen license is compatible with the content pack distribution model — MIT is more permissive but Apache-2.0 provides more legal protection for the project.

---

#### LR‑016 — Platform Manifest Plans Requiring Publisher Permission (High)

**File:** `docs/platform-manifest.md`
**Sections violated:** 8 (When to Contact Free League), 3 (Not Allowed: "Official content marketplace/distribution" = Very High risk per Section 7)

**Description:** The platform manifest describes an ambitious commercial and distribution model that directly triggers multiple items from Section 8 ("When to Contact Free League"). Specifically:

1. **Licensed publisher add-ons** (lines 156–161): Plans to sell "official content packs," "premium adventures," and "sanctioned expansions" as a revenue stream. Section 7 rates "Official content marketplace/distribution" as **Very High** risk. Section 8 says you "should strongly consider direct permission" before distributing "official-like content packs."

2. **Publisher-friendly digital marketplace** (line 264): The long-term vision includes becoming "a publisher-friendly digital marketplace." This is not just a technical feature — it's a business model that positions the platform as a *distribution channel for Free League's IP*. This requires explicit licensing/partnership, not just compliance.

3. **Commercialization at scale** (lines 137–162): The business model section describes hosted services, a mobile app, and licensed publisher add-ons as revenue sources. Section 8 explicitly flags "Commercialize the platform at scale" as requiring Free League contact.

4. **"Licensed content is the official expansion layer"** (line 123): This framing implies an expectation of an official relationship that does not yet exist. The word "licensed" here is aspirational, not factual.

5. **Cryptographic signing of licensed packs** (lines 253, 403): Implies a trust/authentication model for official content that would require a formal agreement to implement.

6. **Bilingual support** (present across all data files): Section 8 flags "Support both Swedish and English official lines simultaneously" as requiring contact. The platform already does this across all JSON data files.

**Mitigation:**
1. Add a **"Legal Prerequisites"** section to `platform-manifest.md` that explicitly lists which planned features require Free League permission before implementation.
2. Separate the manifest's vision into "can build now" (engine, homebrew, local-first) vs "requires partnership" (official packs, marketplace, licensed add-ons).
3. Do not build marketplace, content signing, or licensed pack infrastructure until a formal agreement exists.
4. Reword "Licensed content is the official expansion layer" to "Licensed content would become the official expansion layer, pending publisher agreements."
5. Add a cross-reference to `docs/legal.md` Section 8 in the platform manifest.
6. Consider whether the bilingual data (Swedish + English) already crosses the line identified in Section 8 and should be flagged early.

---

#### LR‑017 — Content Pack Architecture as a Distribution Vehicle (High)

**File:** `docs/package-example.md`
**Sections violated:** 4 Community Content DON'T ("Host official content packs"), 5 (Content Packaging Strategy: "No bundled official text"), 3 (Not Allowed: "Distribute official Free League content")

**Description:** The package example document demonstrates a content pack architecture that, as designed, is a ready-made pipeline for distributing official Dragonbane content:

1. **Core system pack bundles official content** (lines 9–29): `@dbu/system-dragonbane-core` is designed to contain `content/kins/`, `content/professions/`, `content/skills/`, `content/spells/`, and `content/equipment/` — all directories that would hold reproductions of official rulebook data. Section 5 explicitly says the architecture should have "No bundled official text or descriptions," but this pack structure is designed to hold exactly that.

2. **Expansion packs reproduce official content** (lines 188–243): The `@dbu/content-monsterbook-kins` example pack bundles orc kin data including an ability description ("At 0 HP, automatically Rally without needing persuasion or WIL roll") — this is the same type of content flagged as Critical in LR-001 through LR-005, but now packaged for distribution.

3. **Third-party packs reproduce third-party content** (lines 246–273): The `@dbu/content-branda-jorden` pack bundles Dark Mage, Dark Knight, and Dark Magic content. This is the same content flagged as Critical in LR-003 and LR-004.

4. **No content license metadata** in manifests: The pack manifests have no field indicating the legal basis for the content. A `"source"` field exists but only identifies the PDF of origin — it doesn't declare whether the content is used with permission, is community-created, or is reproduced without authorization.

5. **The architecture itself is sound** — modular, toggleable, versionable. The risk is not in the architecture but in the *example content* and the *assumption that official content will be bundled in packs distributed by the project*.

**Mitigation:**
1. **Separate system packs from content packs**: The rules engine (formulas, creation flow, derived stats) can safely be a system pack. Official content (kins, spells, abilities, equipment) must not be bundled in any pack distributed by the project.
2. **Add a `content_license` field to the pack manifest schema**: Require pack authors to declare one of: `"original"`, `"community"`, `"fair-use-reference"`, `"publisher-licensed"`, or `"personal-use-only"`. Validate this at install time.
3. **Replace official content examples with original homebrew examples**: The package-example.md should demonstrate the architecture using clearly fictional, original content — not reproductions of official Dragonbane data.
4. **Add prominent legal warnings**: Include a note in `package-example.md` stating that distributing packs containing official content requires publisher permission.
5. **Treat the core Dragonbane system pack as "user-assembled"**: Instead of shipping `@dbu/system-dragonbane-core` pre-populated with official content, provide an empty template that users populate from their own rulebooks. This is the model recommended by Section 5.

---

#### LR‑018 — Project Manifest Scope Exceeds Legal Guidance (Medium)

**File:** `docs/manifest.md`
**Sections violated:** 1 (Project Intent), 3 (Allowed vs Not Allowed)

**Description:** The project manifest describes Dragonbane Unbound as "A modular rules engine, character builder, encounter runner, and community content system" (line 10). While each capability individually is within scope, the combination of all four — especially "rules engine" — trends toward the "standalone playable digital Dragonbane" that Section 3 lists as Not Allowed. The manifest also lists **Publishers** as a target user ("Distribute official and third-party content," line 60), which implies a distribution model that hasn't been authorized.

Additionally, the manifest describes the project vision without any legal caveats, disclaimers, or references to `legal.md`. A new contributor reading only `manifest.md` would have no indication that significant portions of the planned scope require publisher permission.

**Mitigation:**
1. Add a brief "Legal Constraints" section to `manifest.md` that references `legal.md` and notes which planned capabilities have legal prerequisites.
2. Reframe "Publishers: Distribute official and third-party content" to "Publishers: Distribute content with appropriate licensing" or similar.
3. Consider whether "rules engine" in the description should be qualified (e.g., "rules automation engine" or "companion engine") to avoid the implication of a standalone playable system.

---

#### LR‑019 — "Legal Escape Hatch" Framing (Low)

**File:** `docs/platform-manifest.md` (lines 80–83)
**Sections violated:** Tone/posture concern

**Description:** The platform manifest includes this statement about the modular architecture:

> "This gives the project a built-in legal escape hatch: If official-compatible content ever becomes problematic, the platform survives unchanged."

While the architectural principle is sound (modularity is good), framing it as a "legal escape hatch" suggests the project anticipates potential legal problems and is engineering around them rather than proactively complying. If this document were shared with Free League as part of a partnership pitch, this framing would undermine trust.

**Mitigation:**
1. Reword to emphasize the *design benefit* rather than the *legal evasion*: e.g., "This modular separation ensures the platform's core value is independent of any specific content, and that content modules can be updated, replaced, or removed without affecting the platform."
2. Remove the word "escape hatch" — it implies adversarial posture toward IP holders the project wants to partner with.

---

#### LR‑020 — Platform Manifest Legal Philosophy Section Is Aspirational, Not Factual (Medium)

**File:** `docs/platform-manifest.md` (lines 166–177)
**Sections violated:** 2 (Guiding Principle), 3, 5

**Description:** The "Legal Philosophy" section states:

> "We do not distribute copyrighted rulebook text."
> "We provide: mechanics automation, user-created data, publisher-approved packs"

This is written as a statement of current practice, but the actual state of the `docs/` directory contradicts it — the data files (LR-001 through LR-009) contain extensive copyrighted rulebook text, and no publisher-approved packs exist. The "publisher-approved packs" claim is aspirational. If this document is ever cited externally, the contradiction between stated philosophy and actual content is a credibility risk.

**Mitigation:**
1. Reword the section to reflect current reality: "The platform is designed to avoid distributing copyrighted rulebook text. During development, reference data files may contain content that must be stripped before any public release."
2. Add a status note indicating that publisher approval has not yet been obtained.
3. Cross-reference the risk register (Section 12 of `legal.md`) for the current compliance status.

---

### Files with No Identified Legal Risks

| File                                                          | Notes                                                 |
|---------------------------------------------------------------|-------------------------------------------------------|
| `docs/development.md`                                         | Pure technical docs                                   |
| `docs/local-supabase.md`                                      | Pure technical docs                                   |
| `docs/character_creation/character-creation-process.md`       | Process/index file, references other files            |
| `docs/character_creation/character-sheet-schema.json`         | Schema definition, no content                         |
| `docs/character_creation/sample-character-mallard-thief.json` | Example character instance                            |
| `docs/character_creation/dragonbane-dictionary.json`          | Translation dictionary — likely fair use as reference |
| `docs/character_creation/extract-dictionary.py`               | Utility script                                        |

---

### Positive Practices Identified

The following practices are already in use and should be maintained:

1. **Source page references** — Most data files include `source_page` or source metadata pointing back to the rulebook. This is good practice per Section 5.
2. **Translation flags** — `translation_official: true/false` flags correctly distinguish official translations from unofficial ones.
3. **Source separation** — Content is separated by source book (corebook, monsterboken, brandajorden, drakborgen), making it easy to toggle or remove specific content.
4. **Mechanical effects arrays** — The `mechanical_effects` structure provides a machine-readable data layer that is original engineering work, distinct from the description text.

---

### Summary by Severity

| Severity | Count | IDs                                                            |
|----------|-------|----------------------------------------------------------------|
| Critical | 4     | LR‑001, LR‑002, LR‑003, LR‑004                                 |
| High     | 7     | LR‑005, LR‑006, LR‑007, LR‑008, LR‑009, LR‑016, LR‑017         |
| Medium   | 8     | LR‑010, LR‑011, LR‑012, LR‑013, LR‑014, LR‑015, LR‑018, LR‑020 |
| Low      | 1     | LR‑019                                                         |

### Recommended Priority of Action

1. **Immediate (before any public release):** Address all Critical items (LR‑001 through LR‑004). Strip `description`/`description_sv` fields from magic and heroic ability JSON files. Remove monster stat blocks from brandajorden-magic.json. Remove narrative flavor text from brandajorden-professions.json.
2. **Short-term:** Address High items (LR‑005 through LR‑009). Strip descriptions from kins, equipment, skills, professions, and rules files. Retain only engine-necessary data plus page references.
3. **Before partnership outreach:** ~~LR‑016, LR‑017, LR‑019, LR‑020 resolved.~~
4. **Medium-term:** Address Medium items (LR‑010 through LR‑014). Refactor guide documents to reference rather than reproduce content. Replace verbatim examples in technical specs.
5. **Ongoing:** Add legal prerequisites section to project manifest (LR‑018).

---

### Remediation Status (updated 2026‑02‑20)

| LR ID | Status | Action Taken |
|-------|--------|-------------|
| LR‑001 | **Resolved** | Stripped all `description`/`description_sv` from corebook-magic.json. Also stripped `magic_rules` prose (`general_magic`, `spell_book`, `metal_restriction`, `learning_new_spells` and `_sv` variants). Summoned creature `weapon.description` and `spell_ability.description` stripped. `mechanical_effects` and `note` fields preserved. |
| LR‑002 | **Resolved** | Stripped all `description`/`description_sv` from 44 heroic abilities in corebook-heroic-abilities.json. |
| LR‑003 | **Resolved** | Stripped all `description`/`description_sv` from brandajorden-magic.json spells/cantrips. Also stripped `special_rule`/`special_rule_sv` on school, `side_effect_table.entries[].result`/`result_sv`, and summoned creature `monster_attacks[].description`. |
| LR‑004 | **Resolved** | Stripped `description`/`description_sv`, `special_rule`/`special_rule_sv`, `flavor_note`/`flavor_note_sv`, `heroic_ability_note`/`heroic_ability_note_sv`, `skill_count_note`/`skill_count_note_sv` from brandajorden-professions.json. |
| LR‑005 | **Resolved** | Stripped `abilities[].description`/`description_sv` and `playable_note`/`playable_note_sv` from corebook-kins.json, monsterboken-kins.json, and drakborgen-kins.json. Also stripped modifier descriptions in monsterboken-kins.json and the `expanded_kin_table` description/note. |
| LR‑006 | **Resolved** | Stripped armor `effect`/`effect_sv`, weapon property `description`/`description_sv`, and masterwork `description`/`description_sv` from corebook-equipment.json. All numerical stats preserved. |
| LR‑007 | **Resolved** | Stripped all prose from corebook-rules.json: `creation_steps[].description`, `attributes.description`, `roll_method.notes`, `attributes.list[].description`, `derived_ratings` prose, `conditions.description`/`rules.healing`, all `encumbrance` prose, all `experience` prose. Preserved all formulas, numerical tables, brackets, and `modifier_note` computational constraints. |
| LR‑008 | **Resolved** | Stripped all `description`/`description_sv` from skills in corebook-skills.json, plus `skill_base_chance` prose, `trained_skill_value` description, `trained_skill_note`, and `secondary_skills_note`. |
| LR‑009 | **Resolved** | Stripped `heroic_ability_note`/`heroic_ability_note_sv` from corebook-professions.json. |
| LR‑013 | **Resolved** | Stripped `description`/`description_sv` from weaknesses in corebook-weaknesses.json. Stripped `mementos.effect`/`effect_sv` from corebook-appearance.json. |
| LR‑014 | **Resolved** | Stripped `description`/`description_sv` and `special_note`/`special_note_sv` from drakborgen-heroic-abilities.json. |
| LR‑017 (point 3) | **Resolved** | Added `content_license` field to `_meta` in all 16 data files with `_meta` blocks. Added `content_license` to all 3 pack manifest examples in `docs/package-example.md`. Values: `personal-use-only` (game data), `fair-use-reference` (dictionary), `original` (schema, sample character). |
| LR‑015 | **Resolved** | Standardized on Apache-2.0 across all project files. Fixed MIT references in `docs/manifest.md`, `docs/platform-manifest.md`, and `README.md`. Added `"license": "Apache-2.0"` to root `package.json` and all 8 sub-package `package.json` files. Added "Project Licensing" section to `docs/legal.md` documenting the license choice, rationale, content pack licensing model, and third-party tooling plugin status. |
| LR‑016 | **Resolved** | Rewrote `docs/platform-manifest.md` to separate aspirational features from current capabilities. Reframed "Licensed content is the official expansion layer" as conditional/future. Reframed "Licensed publisher add-ons" revenue section with caveats. Rewrote Legal Philosophy to reflect actual current state. Added caveats to cryptographic signing references. Added "Legal Prerequisites" section with explicit tables separating "can build now" from "requires publisher agreement." Updated `docs/manifest.md` Publishers target user line. |
| LR‑019 | **Resolved** | Replaced "legal escape hatch" framing in `docs/platform-manifest.md` with design-benefit language: "This modular separation ensures the platform's core value is independent of any specific content." |
| LR‑020 | **Resolved** | Rewrote `docs/platform-manifest.md` Legal Philosophy section to reflect current reality. Now acknowledges that development reference data exists, states what we provide vs. do not provide, and cross-references `docs/legal.md` for full compliance status. |
| LR‑017 (points 1, 2, 4, 5) | **Resolved** | Rewrote `docs/package-example.md`. Restructured system pack to contain only engine data (tables, rules, creation flow) — removed `content/` subdirectories from the system pack. Replaced official content examples (Monsterbook orc, Den branda jorden) with original homebrew (Ironborn kin, Runesmith profession from fictional "Ironvale" setting). Added prominent legal notice at top. Documented user-assembled content model with explanation, templates, and workflow. Added expansion content template showing the user-assembled pattern. Added `content_license` values reference table. |

Full-text reference copies preserved in `source_data/reference-data/` (gitignored) before stripping.


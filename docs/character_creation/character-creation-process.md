# Character Creation — Data & Documentation

> All files in this directory are **derived material** — structured data and documentation extracted from the original source PDFs in `source_data/`. The source PDFs remain untouched in that directory.

---

## Directory Structure

```
docs/character_creation/
  character-creation-process.md       <- this file
  character-creation-guide.md         <- human-readable guide + worked example

  # Core rulebook data (9 files)
  corebook-rules.json                 <- creation steps, attributes, age, derived ratings, conditions, etc.
  corebook-kins.json                  <- 6 core kins with abilities, modifiers
  corebook-skills.json                <- skill base chance + 20 base + 10 weapon + 3 magic skills
  corebook-professions.json           <- 10 professions with skills, heroic abilities, gear
  corebook-magic.json                 <- magic rules + 4 schools, cantrips, spells, summoned creatures
  corebook-heroic-abilities.json      <- 44 heroic abilities with requirements, WP costs
  corebook-equipment.json             <- armor, weapons, weapon properties, masterwork
  corebook-weaknesses.json            <- d20 weakness table
  corebook-appearance.json            <- d20 appearance + d20 memento tables

  # Expansion data
  monsterboken-kins.json              <- 9 expansion kins (Monsterbook)
  drakborgen-kins.json                <- new kin: Half-Elf (Drakborgen)
  drakborgen-heroic-abilities.json    <- new heroic ability: Lucky (Drakborgen)
  brandajorden-magic.json             <- new magic school: Dark Magic (Den brända jorden)
  brandajorden-professions.json       <- new professions: Dark Mage + Dark Knight (Den brända jorden)

  # Character sheet
  character-sheet-schema.json         <- JSON Schema for character sheets
  character-sheet-guide.md            <- character sheet field descriptions
  sample-character-mallard-thief.json <- fully worked example character

  # Reference
  dragonbane-dictionary.json          <- official SV<->EN terminology (392 entries)
  extract-dictionary.py               <- reproducible dictionary extraction script

source_data/                          <- original PDFs (not in this directory)
  DoD_Regelboken_v2.pdf               <- core rulebook
  DoD_Monsterboken_v1.pdf             <- monster book expansion
  Dragonbane_Dictionary_v1.1.pdf      <- official term dictionary
  DoD23_Startvardenifardigheter...    <- starting skill values reference
  DoD23 - Flodesdiagram...            <- combat flowchart (not yet extracted)
  Drakborgen_-_Ath_Ungols_...pdf      <- Drakborgen adventure module
  Den_brnda_jorden_231003.pdf         <- Den brända jorden adventure module
```

---

## Core Rulebook Data (9 files)

The core rulebook (`DoD_Regelboken_v2.pdf`) is split into 9 separate JSON files by domain:

### corebook-rules.json

Core creation flow and mechanical rules:

| Section           | Key                 | Content                                                    |
|-------------------|---------------------|------------------------------------------------------------|
| Creation flow     | `creation_steps`    | 13-step sequence with IDs                                  |
| Attributes        | `attributes`        | 6 base attributes, 4d6-drop-lowest method                  |
| Age categories    | `age`               | Young/Middle-Aged/Old with modifiers and skill slot counts |
| Derived ratings   | `derived_ratings`   | Movement, damage bonus, HP, WP formulas and bracket tables |
| Skill base chance | `skill_base_chance` | Attribute-to-base-chance bracket table                     |
| Conditions        | `conditions`        | 6 conditions linked to attributes                          |
| Encumbrance       | `encumbrance`       | Carrying capacity rules                                    |
| Currency          | `currency`          | Copper/silver/gold exchange rates                          |
| Experience        | `experience`        | Improvement marks, advancement, heroic ability acquisition |

### corebook-kins.json

6 core kins with `abilities` arrays, movement, modifiers, name tables, `translation_official`, and `source_page`.

### corebook-skills.json

20 base skills, 10 weapon skills, 3 magic school secondary skills. Each with `id`, `name`, `name_sv`, `linked_attribute`.

### corebook-professions.json

10 professions. Skills as `{id, name, name_sv}` object arrays, heroic abilities as objects (or `null` for Mage), gear as `{item, item_sv}` objects.

### corebook-magic.json

Magic rules + 4 schools (General, Animism, Elementalism, Mentalism). 17 cantrips, 49 spells, 4 summoned elementals with full stat blocks.

### corebook-heroic-abilities.json

44 heroic abilities with requirements, WP costs, descriptions, `translation_official`, `requirement_sv`.

### corebook-equipment.json

Armor (6 types), melee weapons (28), ranged weapons (6), weapon properties, masterwork rules.

### corebook-weaknesses.json

d20 weakness table (20 entries).

### corebook-appearance.json

d20 appearance table + d20 memento table.

---

## Character Creation Guide

### character-creation-guide.md

**Source:** Derived from the corebook data files.

A human-readable Markdown walkthrough of the entire character creation process. Organized by the 13 creation steps with reference tables for kins, professions, attributes, skills, armor, weapon properties, conditions, magic overview, heroic abilities, encumbrance, and experience/advancement.

Includes a **full worked example** at the end — step-by-step creation of Kvucksum Halvfinger (Young Mallard Thief) showing all dice rolls, attribute assignment strategy, base chance calculations, trained skill selection, derived rating math, gear roll breakdown, and a final summary card.

---

## Character Sheet

### character-sheet-schema.json (v1.0)

**Source:** Core Rulebook p.127 (Rollformular)

A JSON Schema (draft 2020-12) that models every field on the paper character sheet. Defines the runtime state of a character — all values that change during play. 18 top-level sections.

### character-sheet-guide.md

**Source:** Derived from `character-sheet-schema.json`

Human-readable companion document describing every section of the paper character sheet, with tables for all fields, the skill base chance table, armor disadvantage reference, encumbrance rules, rest mechanics, and the Knight example character in narrative form.

### sample-character-mallard-thief.json

**Source:** Generated against `character-sheet-schema.json`, validated against corebook data files.

A complete, mechanically validated example character (Kvucksum Halvfinger, Young Mallard Thief).

---

## Expansion Packs

Each expansion file is kept separate from core data so it can be packaged and toggled independently in the application.

### monsterboken-kins.json (v1.1)

**Source:** Monster Book (`DoD_Monsterboken_v1.pdf`)

9 additional playable kins from the Monsterbook expansion:

| Roll | Kin           | Swedish    | Ability              | Modifiers       |
|------|---------------|------------|----------------------|-----------------|
| 12   | Orc           | Orch       | Steadfast (3 WP)     | Nightkin        |
| 13   | Ogre          | Rese       | Tackle (3 WP)        | Nightkin, Large |
| 14   | Goblin        | Svartalf   | Resilient (1 WP)     | Nightkin        |
| 15   | Hobgoblin     | Vätte      | Fearless (2 WP)      | Nightkin        |
| 16   | Frog People   | Grodfolk   | Leaper (3 WP)        | —               |
| 17   | Karkion       | Karkion    | Wings (1 WP)         | —               |
| 18   | Cat People    | Kattfolk   | Nine Lives (varies)  | —               |
| 19   | Lizard People | Reptilfolk | Camouflage (2 WP)    | —               |
| 20   | Satyr         | Satyr      | Encouragement (3 WP) | Melancholy      |

Key design features:
- `modifiers` section defines Nightkin, Melancholy, and Large as first-class objects with mechanical effects
- `translation_official` flag on every term — Monsterbook-only ability names flagged `false`
- `expanded_kin_table` — d20 table replacing the core d12 table, entries tagged as `core` or `monsterbook` source

---

### drakborgen-kins.json + drakborgen-heroic-abilities.json (v1.1)

**Source:** Drakborgen adventure module (`Drakborgen_-_Ath_Ungols_Hemlighet_Beta_SE_10.pdf`)

Split into two files for consistency with the per-type file structure:

**drakborgen-kins.json — New kin: Half-Elf (Halvalv)**
- Movement: 10
- Two abilities: Willpower (Viljekraft, 0 WP) — first WP spent becomes two; Focus (Fokus, 3 WP) — +2 skill value on Spot Hidden or Awareness
- Not part of any kin roll table — chosen freely with GM approval

**drakborgen-heroic-abilities.json — New heroic ability: Lucky (Tursam)**
- WP: 4, roll against WIL
- Requirement: Spot Hidden FV 12, Awareness FV 12, or Movement 14
- On success, luck changes the narrative in your favor
- In Drakborgen: auto-find secret doors on failed Spot Hidden, or halve trap damage

---

### brandajorden-magic.json + brandajorden-professions.json (v1.1)

**Source:** Den brända jorden adventure module (`Den_brnda_jorden_231003.pdf`)

Split into two files for consistency with the per-type file structure:

**brandajorden-magic.json — New magic school: Dark Magic (Mörkermagi)**
- Linked attribute: INT
- Special rule: Bane in sunlight, boon in darkness
- 3 cantrips + 19 spells (rank 1-4)
- Themes: shadow manipulation, life drain, mind control, necromancy, shadow forging

**brandajorden-professions.json — Two new professions:**

*Dark Mage (Mörkermagiker)*
- Key attribute: WIL
- 8 skills: Dark Magic, Beast Lore, Healing, Myths & Legends, Staves, Swords, Performance, Bushcraft
- No heroic ability (magic school replaces it, like core Mage)
- Special: Bane for Dark Magic in sunlight, boon in darkness

*Dark Knight (Mörkerriddare)*
- Key attribute: STR
- 7 skills: Beast Lore, Healing, Myths & Legends, Riding, Swords, any second weapon, Bushcraft
- Heroic ability: Monster Hunter (Monsterjägare) — same as core rulebook

---

## Reference Data

### dragonbane-dictionary.json

**Source:** Dragonbane Dictionary v1.1 (`Dragonbane_Dictionary_v1.1.pdf`)

392 clean, bidirectional Swedish-English term entries. This is the authority for all English terminology used across the core data files.

| Category  | Count |
|-----------|-------|
| bestiary  | 86    |
| skills    | 83    |
| magic     | 80    |
| core      | 63    |
| combat    | 58    |
| equipment | 14    |
| general   | 8     |

Three access patterns:
- `entries[]` — full list with category annotations for filtering
- `sv_to_en{}` — Swedish-to-English lookup map
- `en_to_sv{}` — English-to-Swedish lookup map

### extract-dictionary.py

Reproducible Python script that extracts `dragonbane-dictionary.json` from the source PDF using `pdfplumber`'s `within_bbox()` for two-column layout handling. Run from the project root:

```bash
pip3 install pdfplumber
python3 docs/character_creation/extract-dictionary.py
```

---

## Design Principles

**Source separation.** Data from different sourcebooks lives in separate files so they can be packaged and toggled independently in the application. Core rulebook data, Monsterbook data, Drakborgen data, and Den brända jorden data each have their own files.

**Per-type splitting.** Each source is further split by data type (kins, professions, magic, heroic abilities, etc.) for granular packaging and consistent structure across sources.

**Bilingual by default.** Every game term carries both `name` (English) and `name_sv` (Swedish) fields, with translations verified against the official dictionary where available.

**Translation provenance.** Terms with no official English translation (third-party or expansion content) are flagged with `translation_official: false` so the application can distinguish official from unofficial translations.

**Mechanically verifiable.** Sample characters include `_meta` blocks documenting every roll and derivation, so values can be cross-checked against the rules data.

**Schema-driven.** The character sheet schema (`character-sheet-schema.json`) defines the canonical data shape for character state, ensuring all data files and future code agree on structure.

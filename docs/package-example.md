![Dragonbane Unbound](../assets/logo.png)

# Package Example (Data-Driven Rules + Content)

This example shows how packages store rules and content as data files. The rules engine reads these files and computes outcomes. The DB stores only state (inputs, choices, results, receipts).

> **Legal Notice:** Packs distributed by the project must not contain official rulebook text, descriptions, or creative content from any published sourcebook. Distributing packs containing official content requires explicit publisher permission. See `docs/legal.md` for full guidance.

## Content Model: User-Assembled

Dragonbane Unbound follows a **user-assembled content model**. The project provides:

- **System packs** — engine data (formulas, bracket tables, creation flow logic). These are original engineering work.
- **Empty content templates** — directory structures and schemas for content packs. No official content is pre-populated.
- **Homebrew examples** — original, fictional content demonstrating the pack format.

Users populate content packs from their own rulebooks for personal use. The project never ships pre-populated official content.

### Why this model?

The platform is a companion tool, not a replacement for the rulebooks. By separating the engine (how to compute) from the content (what to compute with), we ensure:

1. The engine is freely distributable under Apache-2.0
2. Official content stays with the rulebooks where it belongs
3. Community homebrew can be freely shared
4. If publisher partnerships are established in the future, the architecture is ready

---

## Example: System Pack Layout

The system pack contains **engine data only** — formulas, bracket tables, and creation flow logic. It does not contain kins, professions, spells, equipment, or any other official content.

```
packages/
  systems/
    dragonbane-core/
      manifest.json
      tables/
        skill-base-chance.json
        damage-bonus.json
        movement-modifier.json
      rules/
        derived-stats.json
        creation-flow.json
```

### manifest.json

```json
{
  "name": "@dbu/system-dragonbane-core",
  "type": "system",
  "version": "0.1.0",
  "requires": ["@dbu/engine"],
  "description": "Core Dragonbane engine data — formulas, bracket tables, and creation flow",
  "content_license": "original"
}
```

### tables/skill-base-chance.json

Maps attribute values to base chance for untrained skills. Trained skills double this value.

```json
{
  "id": "skill_base_chance",
  "description": "Attribute value to base chance bracket table",
  "brackets": [
    { "min": 1,  "max": 5,  "base_chance": 3 },
    { "min": 6,  "max": 8,  "base_chance": 4 },
    { "min": 9,  "max": 12, "base_chance": 5 },
    { "min": 13, "max": 15, "base_chance": 6 },
    { "min": 16, "max": 18, "base_chance": 7 }
  ],
  "trained_multiplier": 2
}
```

### tables/damage-bonus.json

Two separate bonuses: one for STR-based weapons, one for AGL-based weapons.

```json
{
  "id": "damage_bonus",
  "description": "Attribute value to damage bonus",
  "brackets": [
    { "min": 1,  "max": 12, "bonus": null },
    { "min": 13, "max": 16, "bonus": "1d4" },
    { "min": 17, "max": 18, "bonus": "1d6" }
  ],
  "applies_to": ["STR", "AGL"]
}
```

### rules/derived-stats.json

```json
{
  "derived": [
    {
      "id": "hp",
      "name": "Hit Points",
      "name_sv": "Kroppspoang",
      "formula": "CON"
    },
    {
      "id": "wp",
      "name": "Willpower Points",
      "name_sv": "Viljepoang",
      "formula": "WIL"
    },
    {
      "id": "movement",
      "name": "Movement",
      "name_sv": "Forflyttning",
      "formula": "kin.base_movement + lookup(tables/movement-modifier.json, AGL)"
    },
    {
      "id": "carrying_capacity",
      "name": "Carrying Capacity",
      "name_sv": "Barformaga",
      "formula": "ceil(STR / 2)"
    },
    {
      "id": "damage_bonus_str",
      "formula": "lookup(tables/damage-bonus.json, STR)"
    },
    {
      "id": "damage_bonus_agl",
      "formula": "lookup(tables/damage-bonus.json, AGL)"
    }
  ]
}
```

### rules/creation-flow.json

The 13-step character creation sequence. Each step defines an action type and its data source.

```json
{
  "steps": [
    {
      "id": "choose_kin",
      "step": 1,
      "action": "choose_or_roll",
      "source": "content/kins/",
      "roll_die": "1d12",
      "output": "header.kin"
    },
    {
      "id": "note_kin_ability",
      "step": 2,
      "action": "auto_derive",
      "input": "header.kin",
      "output": "heroic_abilities_and_spells"
    },
    {
      "id": "choose_profession",
      "step": 3,
      "action": "choose_or_roll",
      "source": "content/professions/",
      "roll_die": "1d10",
      "output": "header.profession"
    },
    {
      "id": "choose_age",
      "step": 4,
      "action": "choose_or_roll",
      "source": "tables/age-categories.json",
      "roll_die": "1d6",
      "output": "header.age"
    },
    {
      "id": "roll_attributes",
      "step": 6,
      "action": "roll_and_assign",
      "dice": "4d6kh3",
      "count": 6,
      "targets": ["STR", "CON", "AGL", "INT", "WIL", "CHA"],
      "post_process": "apply_age_modifiers",
      "output": "attributes"
    },
    {
      "id": "calculate_derived",
      "step": 7,
      "action": "formula_batch",
      "formulaRef": "rules/derived-stats.json",
      "output": "derived_ratings"
    },
    {
      "id": "choose_trained_skills",
      "step": 8,
      "action": "choose_subset",
      "source_profession": 6,
      "source_free": "age.free_choice_slots",
      "table": "tables/skill-base-chance.json",
      "output": "skills"
    }
  ]
}
```

> **Note:** The creation flow references `content/kins/` and `content/professions/` — these are user-assembled content directories, not shipped by the project. See "User-Assembled Content Packs" below.

---

## User-Assembled Content Packs

Users create their own content packs from their owned rulebooks. The project provides empty templates and schemas but does not ship any official content.

### Example: User-assembled core content

```
packages/
  content/
    my-dragonbane-core/
      manifest.json
      kins/
        human.json
        halfling.json
        ...
      professions/
        hunter.json
        mage.json
        ...
      skills/
      spells/
      equipment/
```

### manifest.json

```json
{
  "name": "my-dragonbane-core",
  "type": "content",
  "version": "0.1.0",
  "requires": ["@dbu/system-dragonbane-core"],
  "description": "My personal Dragonbane content assembled from the core rulebook",
  "content_license": "personal-use-only"
}
```

> **Important:** Packs with `"content_license": "personal-use-only"` are for local use only and must not be distributed publicly. They contain data assembled from copyrighted sourcebooks.

---

## Example: Community Homebrew Pack

Community packs contain **original content** created by the community. These can be freely shared.

```
packages/
  content/
    ironvale-homebrew/
      manifest.json
      kins/
        ironborn.json
      professions/
        runesmith.json
```

### manifest.json

```json
{
  "name": "@dbu/content-ironvale",
  "type": "content",
  "version": "0.1.0",
  "requires": ["@dbu/system-dragonbane-core"],
  "description": "Original homebrew kin and profession from the Ironvale community setting",
  "content_license": "original"
}
```

### kins/ironborn.json

```json
{
  "id": "ironborn",
  "name": "Ironborn",
  "name_sv": "Jarnfodd",
  "translation_official": false,
  "movement": 10,
  "ability": {
    "id": "iron_constitution",
    "name": "Iron Constitution",
    "name_sv": "Jarnhalsa",
    "translation_official": false,
    "mechanical_effects": [
      {
        "type": "reduce_damage",
        "value": 1,
        "when": "always",
        "note": "Naturally tough skin reduces all physical damage by 1"
      }
    ]
  },
  "source_page": null
}
```

### professions/runesmith.json

```json
{
  "id": "runesmith",
  "name": "Runesmith",
  "name_sv": "Runsmed",
  "translation_official": false,
  "skills": [
    { "id": "crafting", "name": "Crafting", "name_sv": "Hantverk" },
    { "id": "spot_hidden", "name": "Spot Hidden", "name_sv": "Upptacka" },
    { "id": "languages", "name": "Languages", "name_sv": "Sprak" },
    { "id": "lore", "name": "Myths & Legends", "name_sv": "Myter och legender" },
    { "id": "awareness", "name": "Awareness", "name_sv": "Uppmarksamhet" },
    { "id": "evade", "name": "Evade", "name_sv": "Smyga" }
  ],
  "heroic_ability": {
    "id": "rune_binding",
    "name": "Rune Binding",
    "name_sv": "Runbindning"
  },
  "gear_table": {
    "die": "1d6",
    "options": [
      {
        "roll": [1, 2],
        "items": [
          { "item": "Chisel set", "item_sv": "Mejselset" },
          { "item": "Rune stones (3)", "item_sv": "Runstenar (3)" }
        ]
      },
      {
        "roll": [3, 4],
        "items": [
          { "item": "Hammer", "item_sv": "Hammare" },
          { "item": "Blank iron tablets (5)", "item_sv": "Tomma jarntavlor (5)" }
        ]
      },
      {
        "roll": [5, 6],
        "items": [
          { "item": "Leather apron (light armor)", "item_sv": "Laderforklde (latt rustning)" },
          { "item": "Ancient rune dictionary", "item_sv": "Gammal runordbok" }
        ]
      }
    ]
  },
  "source_page": null
}
```

---

## Example: Expansion Content Template

For content from expansion sourcebooks, users follow the same user-assembled model. Here is the template structure (no content shipped):

```
packages/
  content/
    my-monsterbook-kins/
      manifest.json
      kins/
        (user populates from their own copy of the Monsterbook)
      modifiers/
      tables/
```

### manifest.json

```json
{
  "name": "my-monsterbook-kins",
  "type": "content",
  "version": "0.1.0",
  "requires": ["@dbu/system-dragonbane-core"],
  "description": "Personal content assembled from the Dragonbane Monsterbook",
  "content_license": "personal-use-only"
}
```

---

## What Goes in the DB (State Only)

- **Character state**: Rolled attributes, selected kin/profession/age, trained skills, current HP/WP, conditions, inventory
- **Derived results**: Computed values (movement, damage bonus, skill values) plus a receipt of how they were computed
- **Campaign state**: Encounter order, combat logs, session notes, items owned
- **Installed packs**: List of enabled packages + versions

The DB never stores rules or content definitions — those live in packages. This separation means content can be updated without touching character data, and characters can be validated against any version of the rules.

---

## Content License Values

Every pack manifest must include a `content_license` field:

| Value | Meaning | Can distribute? |
|-------|---------|-----------------|
| `original` | Original content created by the pack author | Yes |
| `community` | Community-created content, may reference game concepts | Yes |
| `fair-use-reference` | Reference/translation data (e.g., term dictionaries) | Limited |
| `personal-use-only` | Assembled from copyrighted sourcebooks for local use | No |
| `publisher-licensed` | Content distributed with explicit publisher permission | Yes (per terms) |

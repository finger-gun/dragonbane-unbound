# Dragonbane Character Creation Guide

> Process reference for the Dragonbane Unbound data layer.
> All structured data lives in the corebook JSON files — this guide describes the creation flow and how the data files connect.
> For full data, see: `corebook-kins.json`, `corebook-professions.json`, `corebook-skills.json`, `corebook-heroic-abilities.json`, `corebook-weaknesses.json`, `corebook-appearance.json`, `corebook-equipment.json`, `corebook-magic.json`, and `corebook-rules.json`.

---

## Overview

Character creation follows 13 steps. Most choices can be made freely or rolled randomly.

1. Choose or roll **kin** (släkte)
2. Note your **kin ability** (släktesförmåga)
3. Choose or roll **profession** (yrke)
4. Choose or roll **age** (ålder)
5. Choose or roll **name** (namn)
6. Roll **base attributes** (grundegenskaper)
7. Calculate **derived ratings** (sekundära egenskaper)
8. Choose **trained skills** (tränade färdigheter)
9. Note your **heroic ability** (hjälteförmåga)
10. Choose or roll **weakness** (svaghet) — optional
11. Choose or roll **starting gear** (ägodelar)
12. Choose or roll **memento** (minnessak) — optional
13. Choose or roll **appearance** (utseende)

---

## Step 1–2: Kin (Släkte)

Roll 1d12 or choose freely. Six kins are available in the core rulebook. Each kin has a unique innate ability and a base movement rate.

**Data:** `corebook-kins.json` — contains all kins with their abilities, movement, WP costs, and `mechanical_effects`.

Example (partial):

| Kin | Swedish | Roll | Movement |
|-----|---------|------|----------|
| Human | Människa | 1–4 | 10m |
| Halfling | Halvling | 5–7 | 8m |
| ... | ... | ... | ... |

Additional playable kins from expansion books are in `monsterboken-kins.json` and `drakborgen-kins.json`.

---

## Step 3: Profession (Yrke)

Roll 1d10 or choose. Each profession provides 8 class skills (you train 6 of them), a heroic ability, starting gear options, and a key attribute.

**Data:** `corebook-professions.json` — contains all 10 professions with skill lists, heroic ability references, key attributes, and gear packages.

Mage is the only profession that receives a magic school instead of a heroic ability. Mage sub-types: Animist, Elementalist, or Mentalist.

Additional professions from expansion books are in `brandajorden-professions.json`.

---

## Step 4: Age (Ålder)

Roll 1d6 or choose. Age determines the total number of trained skills and applies attribute modifiers.

**Data:** `corebook-rules.json` → `age_categories`

| Age | Total Trained Skills | Free Choice Slots | Attribute Modifiers |
|-----|----------------------|-------------------|---------------------|
| Young (Ung) | 8 | 2 | AGL +1, CON +1 |
| Middle-Aged (Medelålders) | 10 | 4 | None |
| Old (Gammal) | 12 | 6 | STR -2, AGL -2, CON -2, INT +1, WIL +1 |

All characters choose 6 trained skills from their profession list. The remaining slots (2/4/6 by age) are free choice from any skill.

---

## Step 6: Attributes (Grundegenskaper)

Six attributes, each rolled with 4d6 drop lowest (range 3–18). Assign in order of your choice, then swap any two, then apply age modifiers. Maximum 18 after modifiers.

**Data:** `corebook-rules.json` → `attributes`

| Attribute | Swedish | Abbr. (SV) |
|-----------|---------|-------------|
| Strength | Styrka | STY |
| Constitution | Fysik | FYS |
| Agility | Smidighet | SMI |
| Intelligence | Intelligens | INT |
| Willpower | Psykisk kraft | PSY |
| Charisma | Karisma | KAR |

---

## Step 7: Derived Ratings

Derived ratings are calculated from attributes and kin. Formulas and bracket tables are in `corebook-rules.json` → `derived_ratings`.

| Rating | Formula |
|--------|---------|
| Hit Points (KP) | = CON |
| Willpower Points (VP) | = WIL |
| Movement (Förflyttning) | Base from kin + AGL bracket modifier |
| Damage Bonus (Skadebonus) | Separate STR and AGL brackets |
| Carrying Capacity (Bärförmåga) | STR / 2, round up |

The AGL movement modifier and damage bonus brackets are lookup tables in `corebook-rules.json`. Example:

| AGL | Movement Modifier |
|-----|-------------------|
| 1–6 | -4m |
| 7–9 | -2m |
| ... | ... |

---

## Step 8: Skills (Färdigheter)

Every skill is linked to an attribute. Base chance is determined by an attribute bracket table. Trained skills start at double base chance.

**Data:** `corebook-skills.json` — all 20 core skills, 10 weapon skills, and 3 magic school skills with attribute links and IDs.

**Data:** `corebook-rules.json` → `skill_base_chance` — the bracket table mapping attribute values to base chances.

Example (partial):

| Attribute Value | Base Chance | Trained Value (2x) |
|-----------------|-------------|---------------------|
| 1–5 | 3 | 6 |
| 6–8 | 4 | 8 |
| ... | ... | ... |

---

## Step 9: Heroic Abilities (Hjälteförmågor)

Each profession grants one heroic ability at creation (except Mage, who gets magic instead). Additional heroic abilities are gained when raising any skill to 18, or as GM rewards.

**Data:** `corebook-heroic-abilities.json` — all 44 heroic abilities with WP costs, requirements, and `mechanical_effects`.

Additional heroic abilities from expansion books are in `drakborgen-heroic-abilities.json`.

---

## Step 10: Weakness (Svaghet)

Optional. Roll 1d20 or choose from 20 weaknesses. Weaknesses are roleplaying guides that also tie into the experience system.

**Data:** `corebook-weaknesses.json` — the full d20 table.

---

## Step 11: Starting Gear (Ägodelar)

Each profession has three gear packages (roll 1d6: 1–2, 3–4, 5–6). Gear includes weapons, armor, tools, provisions, and starting silver.

**Data:** `corebook-professions.json` → each profession's `gear_packages`
**Data:** `corebook-equipment.json` — weapon stats, armor stats, and general equipment with prices

### Encumbrance (Belastning)

Encumbrance rules are in `corebook-rules.json` → `encumbrance`. Key points:

- Carrying capacity = STR / 2 (round up)
- Weapons at hand (max 3, including shield) do not count
- Worn armor and helmet do not count
- Up to 4 rations = 1 item
- Backpack adds +2 capacity

### Currency

10 copper = 1 silver. 10 silver = 1 gold. Silver is the base unit.

---

## Step 12–13: Memento & Appearance

**Memento** (optional): Roll 1d20 for a personal keepsake. Once per session, use it during a short rest to recover one extra condition.

**Appearance**: Roll 1d20 one or more times for distinctive features.

**Data:** `corebook-appearance.json` — memento table and appearance table.

---

## Conditions (Tillstånd)

When you push a failed roll, you gain a condition. Each condition gives disadvantage on rolls linked to its attribute.

**Data:** `corebook-rules.json` → `conditions`

| Condition | Swedish | Attribute |
|-----------|---------|-----------|
| Exhausted | Utmattad | STR |
| Sickly | Krasslig | CON |
| ... | ... | ... |

If you have all 6 conditions, you cannot push rolls. Conditions recover during rest.

---

## Magic (Magi)

Three schools: **Animism**, **Elementalism**, **Mentalism**, plus **General Magic** (available to all casters).

**Data:** `corebook-magic.json` — all spells, cantrips, spell lists, and `mechanical_effects` per spell.
**Data:** `brandajorden-magic.json` — additional magic school from the expansion.

Key rules (see `corebook-rules.json` → `magic_rules` for formulas):

- Prepared spells: max = INT base chance (from bracket table)
- Cantrips are always prepared and always succeed (1 WP each)
- Spells cost 2 WP per power level (1–3)
- Metal restriction applies to casting

---

## Experience (Erfarenhet)

**Data:** `corebook-rules.json` → `experience`

### Improvement Marks (Förbättringskryss)
- Rolling a 1 (dragon) = improvement mark
- Rolling a 20 (demon) = automatic failure, may also earn a mark
- End-of-session questions each grant a mark on any unmarked skill

### Advancement (Förbättringsslag)
At session end, roll 1d20 for each marked skill. If the roll exceeds the current skill value, increase by 1 (max 18).

### Gaining Heroic Abilities
- Raise any skill to 18 = gain a heroic ability of your choice
- GM may award one after a mighty deed (rare)

---

## Worked Example: Kvucksum Halvfinger, Young Mallard Thief

A walkthrough of the 13-step process using data from the corebook JSON files. The finished character sheet lives in `sample-character-mallard-thief.json`.

### Step 1–2: Kin & Kin Ability

**Choice: Mallard** (Anka) — base movement 8m. Two kin abilities (see `corebook-kins.json` → `mallard`).

### Step 3: Profession

**Choice: Thief** (Tjuv) — key attribute AGL, 8 profession skills, heroic ability: Backstabbing (see `corebook-professions.json` → `thief`).

### Step 4: Age

**Choice: Young** (Ung) — 8 total trained skills (6 profession + 2 free), attribute modifiers AGL +1, CON +1.

### Step 5: Name

**Kvucksum Halvfinger** — from the Mallard name tables.

### Step 6: Attributes

**Roll 4d6 drop lowest**, six times. Using array: 15, 13, 12, 10, 9, 7. Assigned for a Thief (maximize AGL):

| Attribute | Assigned | Age Modifier | Final |
|-----------|----------|--------------|-------|
| STR | 7 | — | **7** |
| CON | 10 | +1 | **11** |
| AGL | 15 | +1 | **16** |
| INT | 12 | — | **12** |
| WIL | 9 | — | **9** |
| CHA | 13 | — | **13** |

### Step 7: Derived Ratings

Calculated using bracket tables from `corebook-rules.json`:

| Rating | Calculation | Result |
|--------|-------------|--------|
| HP | = CON | **11** |
| WP | = WIL | **9** |
| Damage Bonus (STR) | STR 7 → bracket 1–12 | **—** |
| Damage Bonus (AGL) | AGL 16 → bracket 13–16 | **+1d4** |
| Movement | Mallard base 8 + AGL 16 bracket (+4m) | **12m** |
| Carrying Capacity | 7 / 2 = 3.5 → round up | **4** |

### Step 8: Trained Skills

Base chances calculated from attribute brackets, then doubled for trained skills.

6 from profession + 2 free choice = 8 trained skills total. See `sample-character-mallard-thief.json` for the complete skill list with values.

### Step 9: Heroic Ability

From Thief: **Backstabbing** (Tjuvhugg) — 3 WP (see `corebook-heroic-abilities.json`).

### Step 10: Weakness

**Roll d20: 10 → Kleptomaniac** (Kleptoman). See `corebook-weaknesses.json`.

### Step 11: Starting Gear

Thief gear package roll 3–4 (see `corebook-professions.json` → thief → `gear_packages`). Sub-rolls: 4 rations, 6 silver. Total encumbrance: 4/4.

### Step 12–13: Memento & Appearance

Memento: bone dice. Appearance: magnificent hairstyle. See `corebook-appearance.json`.

### Final Character Summary

**Kvucksum Halvfinger** — Young Mallard Thief

| | |
|---|---|
| **STR** 7 · **CON** 11 · **AGL** 16 · **INT** 12 · **WIL** 9 · **CHA** 13 | |
| **HP** 11 · **WP** 9 | **Movement** 12m |
| **Damage Bonus** STR: — / AGL: +1d4 | **Carrying Capacity** 4 |

Full structured data: `sample-character-mallard-thief.json`

# Dragonbane Character Sheet — Field Reference

> Mapping guide for the Dragonbane paper character sheet (rollformulär, p.127 of the core rulebook).
> Schema definition: `character-sheet-schema.json`
> Rules data: `corebook-rules.json`, `corebook-kins.json`, `corebook-professions.json`, `corebook-skills.json`, `corebook-equipment.json` (and other corebook split files)

This document describes every section on the Dragonbane paper character sheet and maps each field to its corresponding data source in the JSON files. It serves as both a human-readable reference and a mapping guide for the digital schema.

---

## 1. Header (Överskrifter)

The top of the sheet contains identity and background fields.

| Field | Swedish | Type | Data Source |
|-------|---------|------|-------------|
| Player Name | SPELARE | Text | User input |
| Character Name | NAMN | Text | User input (name tables in `corebook-kins.json`) |
| Kin | SLÄKTE | Text | `corebook-kins.json` (d12 core, d20 with Monsterbook) |
| Age | ÅLDER | Choice | `corebook-rules.json` → `age_categories` |
| Profession | YRKE | Text | `corebook-professions.json` |
| Weakness | SVAGHET | Text | `corebook-weaknesses.json` (d20 table, optional) |
| Appearance | UTSEENDE | Text | `corebook-appearance.json` (d20 table, free-form) |

---

## 2. Attributes (Grundegenskaper)

Six base attributes, scale 3–18. Rolled with 4d6-drop-lowest, modified by age category.

**Data:** `corebook-rules.json` → `attributes`

| Abbr. (EN) | Abbr. (SV) | Full Name | Swedish |
|------------|------------|-----------|---------|
| STR | STY | Strength | Styrka |
| CON | FYS | Constitution | Fysik |
| AGL | SMI | Agility | Smidighet |
| INT | INT | Intelligence | Intelligens |
| WIL | PSY | Willpower | Psykisk kraft |
| CHA | KAR | Charisma | Karisma |

---

## 3. Conditions (Tillstånd)

Six checkboxes beneath the attributes. Each condition is linked to one attribute and gives disadvantage on all rolls for skills based on that attribute.

**Data:** `corebook-rules.json` → `conditions`

Example (partial):

| Condition | Swedish | Linked Attribute |
|-----------|---------|------------------|
| Exhausted | Utmattad | STR |
| Sickly | Krasslig | CON |
| ... | ... | ... |

All 6 active = character cannot push any rolls. Conditions recover during rest (see Section 15).

---

## 4. Derived Ratings (Sekundära egenskaper)

Calculated values below the attributes block.

**Data:** `corebook-rules.json` → `derived_ratings`

| Rating | Swedish | Formula Source |
|--------|---------|---------------|
| Damage Bonus STR | Skadebonus STY | `corebook-rules.json` → `damage_bonus` bracket table |
| Damage Bonus AGL | Skadebonus SMI | `corebook-rules.json` → `damage_bonus` bracket table |
| Movement | Förflyttning | Base from kin (`corebook-kins.json`) + AGL modifier bracket |
| Carrying Capacity | Bärförmåga | `corebook-rules.json` → `encumbrance` formula |

---

## 5. Skills (Färdigheter)

20 base skills in the central area. Each row shows skill name, linked attribute abbreviation, skill value (FV), and improvement mark checkbox.

**Data:** `corebook-skills.json` — all 20 core skills with attribute links and IDs.
**Data:** `corebook-rules.json` → `skill_base_chance` — bracket table for base chance calculation.

Base chance is determined by attribute bracket. Trained skills get 2x base chance at creation. See `corebook-rules.json` for the bracket table.

---

## 6. Weapon Skills (Vapenfärdigheter)

10 weapon skills listed separately below the base skills. Same format (FV + improvement mark).

**Data:** `corebook-skills.json` → `weapon_skills`

Example (partial):

| Skill | Swedish | Attribute |
|-------|---------|-----------|
| Crossbows | Armborst | AGL |
| Hammers | Hammare | STR |
| ... | ... | ... |

---

## 7. Secondary Skills (Sekundära färdigheter)

Blank lines on the sheet for magic school skills. Most characters leave these empty. Mages fill in their chosen school.

**Data:** `corebook-skills.json` → `secondary_skills`

| Skill | Attribute | Notes |
|-------|-----------|-------|
| Animism | INT | Mage (Animist) only |
| Elementalism | INT | Mage (Elementalist) only |
| Mentalism | INT | Mage (Mentalist) only |

No base chance unless trained.

---

## 8. Abilities & Spells (Förmågor & Besvärjelser)

Free-form list area containing:

- **Kin ability** — from `corebook-kins.json` (always available)
- **Heroic abilities** — from `corebook-heroic-abilities.json` (1 at creation from profession, more via advancement)
- **Prepared spells** — from `corebook-magic.json` (max prepared = INT base chance)
- **Cantrips** — always prepared, always succeed, cost 1 WP

Each entry shows name and WP cost.

---

## 9. Weapons Table (Vapen)

A table at the bottom of the sheet with columns for equipped weapons.

**Data:** `corebook-equipment.json` → `weapons`

| Column | Swedish | Description |
|--------|---------|-------------|
| Weapon / Shield | Vapen / Sköld | Item name |
| Grip | Grepp | 1H or 2H |
| Range | Räckvidd | Meters (melee) or special |
| Damage | Skada | Dice notation |
| Durability | Brytvärde | Current / max |
| Properties | Egenskaper | Weapon property tags |

Up to 3 weapons can be "at hand" without counting against carrying capacity.

---

## 10. Armor (Rustning & Hjälm)

Two sub-sections: body armor and helmet. Each shows name, protection value, and disadvantage reminders.

**Data:** `corebook-equipment.json` → `armor` and `helmets`

Example (partial):

| Armor | Protection | Disadvantages |
|-------|------------|---------------|
| Leather | 1 | None |
| Chainmail | 4 | Evade, Sneaking |
| ... | ... | ... |

Worn armor and helmet do not count against carrying capacity.

---

## 11. Packing (Packning)

Numbered slots 1–10 for inventory items. Usable slots = carrying capacity.

**Data:** `corebook-rules.json` → `encumbrance` — rules for slot counting, backpack bonus, overload.

---

## 12. Memento (Minnessak)

Single text field. Once per session during a short rest, the character can use their memento to recover one additional condition.

**Data:** `corebook-appearance.json` → `mementos` (d20 table)

---

## 13. Trinkets (Småsaker)

Free-form text area. Small items that do not count against carrying capacity. Under 100 coins also count as trinkets.

---

## 14. Currency (Mynt)

Three denomination fields. Silver is the base unit.

**Data:** `corebook-rules.json` → `currency`

| Denomination | Swedish | Exchange Rate |
|--------------|---------|---------------|
| Gold | Guldmynt | 1 gold = 10 silver |
| Silver | Silvermynt | Base unit |
| Copper | Kopparmynt | 10 copper = 1 silver |

---

## 15. Rest Tracking (Vila)

**Data:** `corebook-rules.json` → `rest`

| Rest Type | Swedish | Duration | Effect |
|-----------|---------|----------|--------|
| Quick Rest | Snabb vila | 15 min | Recover 1d6 WP |
| Short Rest | Kort vila | 1 stretch | Recover 1d6 HP + 1d6 WP + heal 1 condition |

Long rest (full night's sleep) recovers all HP, all WP, and all conditions.

---

## 16. Hit Points (Kroppspoäng / KP)

Tracking section with current and maximum values.

- **Max HP** = CON (can increase via Robust heroic ability)
- **0 HP** = dying, begin death saves

**Data:** `corebook-rules.json` → `derived_ratings.hit_points`

---

## 17. Willpower Points (Viljepoäng / VP)

Tracking section with current and maximum values.

- **Max WP** = WIL (can increase via Focused heroic ability)
- **Recovery:** rest, or rolling a 1 (dragon) or 20 (demon) on any d20

**Data:** `corebook-rules.json` → `derived_ratings.willpower_points`

---

## 18. Death Saves (Dödsslag)

Two sets of checkboxes:

| Track | Swedish | Threshold |
|-------|---------|-----------|
| Successes | Lyckade | 3 = stabilized |
| Failures | Misslyckade | 3 = dead |

**Data:** `corebook-rules.json` → `death_saves`

---

## Example Character: Joruna Blankenhjelm

A worked example showing how fields are filled for a freshly created character. All values derived using the bracket tables and formulas in `corebook-rules.json`.

**Header:** Human Knight, Middle-Aged, Weakness: Foolhardy

**Attributes:** STR 14, CON 12, AGL 11, INT 10, WIL 13, CHA 9

**Derived:** Damage Bonus STR +1d4, Movement 10, Carrying Capacity 7

**Trained Skills:** 6 from Knight profession + 4 free (see `corebook-professions.json` → `knight` for skill list)

**Heroic Ability:** Guardian (Förkämpe) — see `corebook-heroic-abilities.json`
**Kin Ability:** Adaptive (Anpasslig) — see `corebook-kins.json` → `human`

**Weapons/Armor/Gear:** See `corebook-equipment.json` for item stats. Specific loadout in `character-sheet-schema.json` example.

**HP:** 12/12 | **WP:** 13/13

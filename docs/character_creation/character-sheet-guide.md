# Dragonbane Character Sheet — Field Reference

> Based on the character sheet (rollformulär) printed on p.127 of **DoD_Regelboken_v2.pdf**.
> Schema definition: `character-sheet-schema.json`
> Rules data: `corebook-rules.json`, `corebook-kins.json`, `corebook-professions.json`, `corebook-skills.json`, `corebook-equipment.json` (and other corebook split files)

This document describes every field on the Dragonbane paper character sheet, organized by visual section as they appear on the printed page. It serves as both a human-readable reference and a mapping guide for the digital schema.

---

## 1. Header (Överskrifter)

The top of the sheet contains identity and background fields laid out horizontally.

| Field          | Swedish  | Type   | Notes                                                        |
|----------------|----------|--------|--------------------------------------------------------------|
| Player Name    | SPELARE  | Text   | Real-world player name                                       |
| Character Name | NAMN     | Text   | In-game character name                                       |
| Kin            | SLÄKTE   | Text   | Race/species from kin table (d12 core, d20 with Monsterbook) |
| Age            | ÅLDER    | Choice | Young / Middle-Aged / Old                                    |
| Profession     | YRKE     | Text   | One of 10 professions (Mage has 3 sub-types)                 |
| Weakness       | SVAGHET  | Text   | From d20 weakness table (optional)                           |
| Appearance     | UTSEENDE | Text   | From d20 appearance table, free-form                         |

---

## 2. Attributes (Grundegenskaper)

Six base attributes in a left-side column. Scale 3–18. Rolled with 4d6-drop-lowest, modified by age category.

| Abbreviation (EN) | Abbreviation (SV) | Full Name    | Swedish       | Used For                                         |
|-------------------|-------------------|--------------|---------------|--------------------------------------------------|
| STR               | STY               | Strength     | Styrka        | Melee damage, carrying capacity, crafting        |
| CON               | FYS               | Constitution | Fysik         | Hit points, endurance                            |
| AGL               | SMI               | Agility      | Smidighet     | Movement modifier, AGL-based weapons, dodging    |
| INT               | INT               | Intelligence | Intelligens   | Knowledge skills, magic schools, prepared spells |
| WIL               | PSY               | Willpower    | Psykisk kraft | Willpower points, resisting fear/charm           |
| CHA               | KAR               | Charisma     | Karisma       | Social skills, performance                       |

---

## 3. Conditions (Tillstånd)

Six checkboxes printed directly beneath the attributes. Each condition is linked to one attribute and gives **disadvantage on all rolls** for skills based on that attribute.

| Condition    | Swedish   | Linked Attribute | Triggered By            |
|--------------|-----------|------------------|-------------------------|
| Exhausted    | Utmattad  | STR              | Pushing STR-based rolls |
| Sickly       | Krasslig  | CON              | Pushing CON-based rolls |
| Dazed        | Omtöcknad | AGL              | Pushing AGL-based rolls |
| Angry        | Arg       | INT              | Pushing INT-based rolls |
| Scared       | Rädd      | WIL              | Pushing WIL-based rolls |
| Disheartened | Uppgiven  | CHA              | Pushing CHA-based rolls |

**All 6 active** = character cannot push any rolls. Conditions are recovered during rest (1 per short rest, all on long rest).

---

## 4. Derived Ratings (Sekundära egenskaper)

Calculated values printed below the attributes block.

| Rating            | Swedish        | Formula                                           |
|-------------------|----------------|---------------------------------------------------|
| Damage Bonus STR  | Skadebonus STY | STR 13–16: +1d4, STR 17–18: +1d6                  |
| Damage Bonus AGL  | Skadebonus SMI | AGL 13–16: +1d4, AGL 17–18: +1d6                  |
| Movement          | Förflyttning   | Base from kin (8/10/12) + AGL modifier (-4 to +4) |
| Carrying Capacity | Bärförmåga     | STR / 2 (round up). Backpack adds +2              |

---

## 5. Skills (Färdigheter)

20 base skills listed in the central area of the sheet. Each row shows:
- Skill name (Swedish)
- Linked attribute abbreviation (SV)
- Skill value (FV) — written by player
- Improvement mark checkbox

Base chance is determined by attribute bracket. Trained skills get 2x base chance at creation.

| #  | Skill             | Swedish          | Attribute |
|----|-------------------|------------------|-----------|
| 1  | Beast Lore        | Bestiologi       | INT       |
| 2  | Bluffing          | Bluffa           | CHA       |
| 3  | Sleight of Hand   | Fingerfärdighet  | AGL       |
| 4  | Spot Hidden       | Finna dolda ting | INT       |
| 5  | Languages         | Främmande språk  | INT       |
| 6  | Crafting          | Hantverk         | STR       |
| 7  | Acrobatics        | Hoppa & klättra  | AGL       |
| 8  | Hunting & Fishing | Jakt & fiske     | AGL       |
| 9  | Bartering         | Köpslå           | CHA       |
| 10 | Healing           | Läkekonst        | INT       |
| 11 | Myths & Legends   | Myter & Legender | INT       |
| 12 | Riding            | Rida             | AGL       |
| 13 | Swimming          | Simma            | AGL       |
| 14 | Seamanship        | Sjökunnighet     | INT       |
| 15 | Sneaking          | Smyga            | AGL       |
| 16 | Evade             | Undvika          | AGL       |
| 17 | Performance       | Uppträda         | CHA       |
| 18 | Awareness         | Upptäcka fara    | INT       |
| 19 | Bushcraft         | Vildmarksvana    | INT       |
| 20 | Persuasion        | Övertala         | CHA       |

### Skill Base Chance Table

| Attribute Value | Base Chance | Trained Value (2x) |
|-----------------|-------------|--------------------|
| 1–5             | 3           | 6                  |
| 6–8             | 4           | 8                  |
| 9–12            | 5           | 10                 |
| 13–15           | 6           | 12                 |
| 16–18           | 7           | 14                 |

---

## 6. Weapon Skills (Vapenfärdigheter)

10 weapon skills listed separately below the base skills. Same format (FV + improvement mark).

| #  | Skill     | Swedish  | Attribute | Covers                                           |
|----|-----------|----------|-----------|--------------------------------------------------|
| 1  | Crossbows | Armborst | AGL       | All crossbows                                    |
| 2  | Hammers   | Hammare  | STR       | War hammers, clubs, maces, morning stars, flails |
| 3  | Knives    | Kniv     | AGL       | Knives and daggers                               |
| 4  | Bows      | Pilbåge  | AGL       | All bows                                         |
| 5  | Brawling  | Slagsmål | STR       | Unarmed combat                                   |
| 6  | Slings    | Slunga   | AGL       | Slings                                           |
| 7  | Spears    | Spjut    | STR       | Spears, tridents, halberds, lances               |
| 8  | Staves    | Stav     | AGL       | Staff combat                                     |
| 9  | Swords    | Svärd    | STR       | All swords                                       |
| 10 | Axes      | Yxa      | STR       | All axes                                         |

---

## 7. Secondary Skills (Sekundära färdigheter)

Blank lines on the sheet for magic school skills. Most characters leave these empty. Mages fill in their chosen school.

| Skill        | Swedish      | Attribute | Notes                      |
|--------------|--------------|-----------|----------------------------|
| Animism      | Animism      | INT       | Mage (Animist) school      |
| Elementalism | Elementalism | INT       | Mage (Elementalist) school |
| Mentalism    | Mentalism    | INT       | Mage (Mentalist) school    |

No base chance unless trained. Mages get their school at 2x INT base chance.

---

## 8. Abilities & Spells (Förmågor & Besvärjelser)

Free-form list area on the sheet. Contains:

- **Kin ability** — One ability from the character's kin (always available)
- **Heroic abilities** — From profession (1 at creation), gained later via skill advancement or GM award
- **Prepared spells** — For characters with magic (max prepared = INT base chance)
- **Cantrips** — Always prepared, always succeed, cost 1 WP

Each entry shows name and WP cost.

---

## 9. Weapons Table (Vapen)

A table at the bottom of the sheet with columns:

| Column          | Swedish       | Description                    |
|-----------------|---------------|--------------------------------|
| Weapon / Shield | Vapen / Sköld | Item name                      |
| Grip            | Grepp         | 1H or 2H                       |
| Range           | Räckvidd      | Meters (melee) or special      |
| Damage          | Skada         | Dice notation                  |
| Durability      | Brytvärde     | Current / max durability value |
| Properties      | Egenskaper    | Weapon property tags           |

Up to 3 weapons can be "at hand" (belt/ready) without counting against carrying capacity. Shields count as weapons for this limit.

---

## 10. Armor (Rustning & Hjälm)

Two sub-sections on the sheet:

### Body Armor (Rustning)
- Name and protection value (Skyddsvärde)
- Reminder of disadvantage penalties

### Helmet (Hjälm)
- Name and protection value
- Reminder of disadvantage penalties

**Disadvantage reminder** printed on the sheet: NACKDEL PÅ: SMYGA, UNDVIKA, UPPTÄCKA FARA, HOPPA & KLÄTTRA, AVSTÅNDSATTACKER

| Armor           | Swedish      | Protection | Disadvantages               |
|-----------------|--------------|------------|-----------------------------|
| Leather         | Läder        | 1          | None                        |
| Studded Leather | Nitläder     | 2          | Sneaking                    |
| Chainmail       | Ringbrynja   | 4          | Evade, Sneaking             |
| Plate Armor     | Plåtrustning | 6          | Acrobatics, Evade, Sneaking |
| Open Helmet     | Öppen hjälm  | +1         | Awareness                   |
| Great Helmet    | Tunnhjälm    | +2         | Awareness, Ranged attacks   |

Worn armor and helmet do **not** count against carrying capacity.

---

## 11. Packing (Packning)

Numbered slots 1–10 for inventory items. Usable slots = Carrying Capacity (STR/2 rounded up, +2 with backpack).

**Encumbrance rules:**
- 1 item = 1 slot (default)
- Heavy items = 2+ slots
- Up to 4 rations = 1 slot
- Quiver with arrows = 1 slot
- Backpack = +2 slots (does not count itself, max 1)
- Overloaded = must pass STR roll to move each round

---

## 12. Memento (Minnessak)

Single text field. Once per session during a short rest, the character can use their memento to recover one additional condition.

---

## 13. Trinkets (Småsaker)

Free-form text area. Small items that do **not** count against carrying capacity. Under 100 coins also count as trinkets.

---

## 14. Currency (Mynt)

Three fields:

| Denomination | Swedish    | Exchange Rate                    |
|--------------|------------|----------------------------------|
| Gold         | Guldmynt   | 1 gold = 10 silver               |
| Silver       | Silvermynt | 1 silver = 10 copper (base unit) |
| Copper       | Kopparmynt | Smallest denomination            |

Under 100 total coins = trinket (no encumbrance). 100–199 = 1 packing slot, etc.

---

## 15. Rest Tracking (Vila)

Two checkboxes:

| Rest Type  | Swedish    | Duration           | Effect                                     |
|------------|------------|--------------------|--------------------------------------------|
| Quick Rest | Snabb vila | 15 min             | Recover 1d6 WP                             |
| Short Rest | Kort vila  | 1 stretch (15 min) | Recover 1d6 HP + 1d6 WP + heal 1 condition |

Long rest (full night's sleep) recovers all HP, all WP, and all conditions.

---

## 16. Hit Points (Kroppspoäng / KP)

Tracking section with current and maximum values.

- **Max HP** = CON (can increase +2 per Robust heroic ability)
- **Current HP** tracked during play
- **0 HP** = dying, begin death saves

---

## 17. Willpower Points (Viljepoäng / VP)

Tracking section with current and maximum values.

- **Max WP** = WIL (can increase +2 per Focused heroic ability)
- **Spent on:** spells, kin abilities, heroic abilities
- **Recovery:** rest, or rolling a 1 (dragon) or 20 (demon) on any d20

---

## 18. Death Saves (Dödsslag)

Two sets of checkboxes at the bottom of the sheet:

| Track     | Swedish     | Threshold      |
|-----------|-------------|----------------|
| Successes | Lyckade     | 3 = stabilized |
| Failures  | Misslyckade | 3 = dead       |

When at 0 HP, roll a death save each round. Reset when stabilized or healed above 0 HP.

---

## Example Character: Joruna Blankenhjelm

A worked example showing how the fields would be filled for a freshly created character.

**Header:** Human Knight, Middle-Aged, "Gyllenlans", Weakness: Foolhardy

**Attributes:** STR 14, CON 12, AGL 11, INT 10, WIL 13, CHA 9

**Derived:** Damage Bonus STR +1d4, Movement 10, Carrying Capacity 7

**Trained Skills (6 from Knight + 4 free):**
- Beast Lore (10), Myths & Legends (10), Riding (10), Performance (8), Persuasion (8) — from profession
- Hammers (12), Spears (12), Swords (12) — from profession weapon skills

**Heroic Ability:** Guardian (Förkämpe) — WP 2

**Kin Ability:** Adaptive (Anpasslig) — WP 3

**Weapons at Hand:** Broadsword (2d6, durability 15), Small Shield (1d8, durability 15)

**Armor:** Chainmail (protection 4), Open Helmet (protection 1)

**Packing:** Torch, Firestarter, Rations (x4), Rope

**Currency:** 8 silver

**HP:** 12/12 | **WP:** 13/13

See `character-sheet-schema.json` for the complete example as structured data.

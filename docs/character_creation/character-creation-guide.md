# Dragonbane Character Creation Guide

> Based on *Drakar och Demoner: Regelboken v2* (DoD_Regelboken_v2.pdf).
> All English translations verified against the official *Dragonbane Dictionary v1.1*.
> For full structured data, see the split corebook JSON files: `corebook-kins.json`, `corebook-professions.json`, `corebook-skills.json`, `corebook-heroic-abilities.json`, `corebook-weaknesses.json`, `corebook-appearance.json`, `corebook-equipment.json`, `corebook-magic.json`, and `corebook-rules.json`.

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

Roll 1d12 or choose freely from six kins. Each kin has a unique innate ability (släktesförmåga).

| Kin          | Swedish  | Roll | Movement | Ability                                                                                                                                                                   | WP Cost     |
|--------------|----------|------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| **Human**    | Människa | 1–4  | 10m      | **Adaptive** (Anpasslig) — Substitute one skill for another on a roll (GM approval)                                                                                       | 3 WP        |
| **Halfling** | Halvling | 5–7  | 8m       | **Hard to Catch** (Svårfångad) — Advantage on Dodge rolls                                                                                                                 | 3 WP        |
| **Dwarf**    | Dvärg    | 8–9  | 8m       | **Unforgiving** (Långsint) — Advantage attacking someone who has hurt you                                                                                                 | 3 WP        |
| **Elf**      | Alv      | 10   | 10m      | **Inner Peace** (Inre Frid) — Extra 1d6 HP, 1d6 WP, and one condition healed during short rest (unreachable while meditating)                                             | 0 WP        |
| **Mallard**  | Anka     | 11   | 8m       | **Ill-tempered** (Vresig) — Advantage on any roll, but become Angry (not INT-based rolls). Also: **Webbed Feet** (Simfötter) — Advantage on Swimming, full speed in water | 3 WP / 0 WP |
| **Wolfkin**  | Vargfolk | 12   | 12m      | **Hunting Instincts** (Jaktsinne) — Mark a quarry; follow its scent for a day; spend 1 WP for advantage on attacks against it                                             | 3 WP        |

---

## Step 3: Profession (Yrke)

Roll 1d10 or choose. Each profession provides 8 class skills (you train 6 of them), a heroic ability, starting gear options, and a key attribute.

| #  | Profession   | Swedish     | Key Attr | Heroic Ability                                      |
|----|--------------|-------------|----------|-----------------------------------------------------|
| 1  | **Bard**     | Bard        | CHA      | Musician (Tonkonst)                                 |
| 2  | **Artisan**  | Hantverkare | STR      | Master Tanner / Blacksmith / Carpenter (choose one) |
| 3  | **Hunter**   | Jägare      | AGL      | Companion (Följeslagare)                            |
| 4  | **Fighter**  | Krigare     | STR      | Veteran (Stridsvana)                                |
| 5  | **Scholar**  | Lärd        | INT      | Intuition (Intuition)                               |
| 6  | **Mage**     | Magiker     | WIL      | *None* — gets magic school instead (see Magic)      |
| 7  | **Merchant** | Nasare      | CHA      | Treasure Hunter (Skattletare)                       |
| 8  | **Knight**   | Riddare     | STR      | Guardian (Förkämpe)                                 |
| 9  | **Mariner**  | Sjöfarare   | AGL      | Sea Legs (Sjöben)                                   |
| 10 | **Thief**    | Tjuv        | AGL      | Backstabbing (Tjuvhugg)                             |

**Mage sub-types:** Animist, Elementalist, or Mentalist. The mage chooses a magic school as a trained skill, picks 3 rank-1 spells and 3 cantrips, and receives a spell book.

---

## Step 4: Age (Ålder)

Roll 1d6 or choose. Age determines how many trained skills you get and applies attribute modifiers.

| Age                           | Roll | Total Trained Skills | Free Choice Slots | Attribute Modifiers                    |
|-------------------------------|------|----------------------|-------------------|----------------------------------------|
| **Young** (Ung)               | 1–3  | 8                    | 2                 | AGL +1, CON +1                         |
| **Middle-Aged** (Medelålders) | 4–5  | 10                   | 4                 | None                                   |
| **Old** (Gammal)              | 6    | 12                   | 6                 | STR -2, AGL -2, CON -2, INT +1, WIL +1 |

All characters choose 6 trained skills from their profession list. The remaining trained skill slots (2/4/6 by age) are free choice from any skill.

---

## Step 6: Attributes (Grundegenskaper)

Six attributes, each rolled with 4d6 drop lowest (range 3–18). Assign in order of your choice, then swap any two, then apply age modifiers. Maximum 18 after modifiers.

| Attribute        | Swedish       | Abbr. |
|------------------|---------------|-------|
| **Strength**     | Styrka        | STY   |
| **Constitution** | Fysik         | FYS   |
| **Agility**      | Smidighet     | SMI   |
| **Intelligence** | Intelligens   | INT   |
| **Willpower**    | Psykisk kraft | PSY   |
| **Charisma**     | Karisma       | KAR   |

---

## Step 7: Derived Ratings

### Hit Points (Kroppspoäng / KP)
**HP = CON.** Can be permanently increased by the heroic ability Robust (+2 per take).

### Willpower Points (Viljepoäng / VP)
**WP = WIL.** Used for magic, kin abilities, and heroic abilities. Can be permanently increased by Focused (+2 per take).

### Movement (Förflyttning)
Base movement is set by kin (8/10/12m), then modified by AGL:

| AGL   | Modifier |
|-------|----------|
| 1–6   | -4m      |
| 7–9   | -2m      |
| 10–12 | +0m      |
| 13–15 | +2m      |
| 16–18 | +4m      |

### Damage Bonus (Skadebonus)
Two separate bonuses: one for STR-based weapons, one for AGL-based weapons.

| Attribute Value | Bonus |
|-----------------|-------|
| 1–12            | None  |
| 13–16           | +1d4  |
| 17–18           | +1d6  |

---

## Step 8: Skills (Färdigheter)

### Base Chance (Grundchans)

Every skill is linked to an attribute. You automatically get a base chance value:

| Attribute Value | Base Chance |
|-----------------|-------------|
| 1–5             | 3           |
| 6–8             | 4           |
| 9–12            | 5           |
| 13–15           | 6           |
| 16–18           | 7           |

**Trained skills** start at **double** base chance.

### Core Skills (20)

| Skill             | Swedish          | Attribute |
|-------------------|------------------|-----------|
| Beast Lore        | Bestiologi       | INT       |
| Bluffing          | Bluffa           | CHA       |
| Sleight of Hand   | Fingerfärdighet  | AGL       |
| Spot Hidden       | Finna dolda ting | INT       |
| Languages         | Främmande språk  | INT       |
| Crafting          | Hantverk         | STR       |
| Acrobatics        | Hoppa & klättra  | AGL       |
| Hunting & Fishing | Jakt & fiske     | AGL       |
| Bartering         | Köpslå           | CHA       |
| Healing           | Läkekonst        | INT       |
| Myths & Legends   | Myter & Legender | INT       |
| Riding            | Rida             | AGL       |
| Swimming          | Simma            | AGL       |
| Seamanship        | Sjökunnighet     | INT       |
| Sneaking          | Smyga            | AGL       |
| Evade             | Undvika          | AGL       |
| Performance       | Uppträda         | CHA       |
| Awareness         | Upptäcka fara    | INT       |
| Bushcraft         | Vildmarksvana    | INT       |
| Persuasion        | Övertala         | CHA       |

### Weapon Skills (10)

| Skill     | Swedish  | Attribute |
|-----------|----------|-----------|
| Crossbows | Armborst | AGL       |
| Hammers   | Hammare  | STR       |
| Knives    | Kniv     | AGL       |
| Bows      | Pilbåge  | AGL       |
| Brawling  | Slagsmål | STR       |
| Slings    | Slunga   | AGL       |
| Spears    | Spjut    | STR       |
| Staves    | Stav     | AGL       |
| Swords    | Svärd    | STR       |
| Axes      | Yxa      | STR       |

### Magic School Skills (Secondary)

| Skill        | Attribute | Notes                         |
|--------------|-----------|-------------------------------|
| Animism      | INT       | No base chance unless trained |
| Elementalism | INT       | No base chance unless trained |
| Mentalism    | INT       | No base chance unless trained |

---

## Step 9: Heroic Abilities (Hjälteförmågor)

Each profession grants one heroic ability at creation (except Mage, who gets magic instead). Additional heroic abilities are gained when raising any skill to 18, or as GM rewards.

There are 44 heroic abilities in total. See `corebook-heroic-abilities.json` for the full list with requirements, WP costs, and descriptions. Notable examples:

- **Berserker** (Bärsärk) — 3 WP, advantage on melee but can't defend
- **Defensive** (Defensiv) — 3 WP, parry without using your action
- **Fast Footwork** (Hal som en ål) — 3 WP, dodge without using your action
- **Robust** (Tålig) — 0 WP, permanently +2 HP (stackable)
- **Focused** (Fokuserad) — 0 WP, permanently +2 WP (stackable)
- **Dual Wield** (Två vapen) — 3 WP, extra off-hand attack
- **Massive Blow** (Kraftslag) — 3 WP, +1d8 damage with two-handed melee

---

## Step 10: Weakness (Svaghet)

Optional. Roll 1d20 or choose from 20 weaknesses. Weaknesses are roleplaying guides that also tie into the experience system.

Examples: Gullible, Greedy, Foolhardy, Fearful, Kleptomaniac, Violent, Know-It-All.

See `corebook-weaknesses.json` for the full d20 table.

---

## Step 11: Starting Gear (Ägodelar)

Each profession has three gear packages (roll 1d6: 1–2, 3–4, 5–6). Gear includes weapons, armor, tools, provisions, and starting silver. See `corebook-professions.json` for details per profession.

### Encumbrance (Belastning)

- **Carrying capacity** = STR / 2 (round up)
- Weapons at hand (max 3, including shield) don't count
- Worn armor and helmet don't count
- Up to 4 rations = 1 item
- Backpack adds +2 capacity
- Trinkets (småsaker) and coins under 100 don't count
- **Overloaded**: must pass STR each round to move

### Currency

10 copper = 1 silver. 10 silver = 1 gold. Silver is the base unit.

---

## Step 12–13: Memento & Appearance

**Memento** (optional): Roll 1d20 for a personal keepsake. Once per session, use it to recover one extra condition during a short rest.

**Appearance**: Roll 1d20 one or more times for distinctive features (ugly scar, peculiar headwear, silver tooth, etc.).

---

## Conditions (Tillstånd)

When you push a failed roll, you gain a condition. Each condition gives disadvantage on rolls linked to its attribute.

| Condition    | Swedish   | Attribute |
|--------------|-----------|-----------|
| Exhausted    | Utmattad  | STR       |
| Sickly       | Krasslig  | CON       |
| Dazed        | Omtöcknad | AGL       |
| Angry        | Arg       | INT       |
| Scared       | Rädd      | WIL       |
| Disheartened | Uppgiven  | CHA       |

If you have all 6 conditions, you cannot push rolls. Conditions recover during rest.

---

## Magic (Magi)

### Schools
Three schools: **Animism**, **Elementalism**, **Mentalism**, plus **General Magic** (available to all casters).

### Rules
- **Prepared spells**: Max = INT base chance (from bracket table)
- Cantrips are always prepared and always succeed (1 WP each)
- Spells cost 2 WP per power level (1–3)
- **Metal restriction**: Cannot cast while wearing metal armor or holding metal weapons
- Losing your spell book (Formelbok) means you can only use currently prepared spells

### Spell Summary

**General Magic** — 6 cantrips + 7 spells (ranks 1–5), including Protector, Magic Shield, Dispell, Transfer, Magic Seal, Charge, Permanence.

**Animism** — 5 cantrips + 13 spells (ranks 1–3). Nature/healing/lightning theme. Includes Treat Wound, Lightning Bolt, Heal Wound, Resurrection.

**Elementalism** — 3 cantrips + 16 spells (ranks 1–3). Fire/earth/water/wind theme, plus summoned elementals (Gnome, Salamander, Sylph, Undine).

**Mentalism** — 3 cantrips + 13 spells (ranks 1–3). Telekinesis/divination/mind theme. Includes Levitate, Telepathy, Flight, Teleport, Dominate.

See `corebook-magic.json` for complete spell lists with effects, ranges, and durations.

---

## Equipment Highlights

### Armor

| Armor           | Protection | Price    | Notes                                       |
|-----------------|------------|----------|---------------------------------------------|
| Leather         | 1          | 2 gold   | —                                           |
| Studded Leather | 2          | 10 gold  | Disadvantage on Sneaking                    |
| Chainmail       | 4          | 50 gold  | Disadvantage on Evade, Sneaking             |
| Plate Armor     | 6          | 500 gold | Disadvantage on Acrobatics, Evade, Sneaking |
| Open Helmet     | +1         | 12 gold  | Disadvantage on Awareness                   |
| Great Helmet    | +2         | 100 gold | Disadvantage on Awareness + ranged attacks  |

### Weapon Properties

| Property  | Swedish   | Effect                                    |
|-----------|-----------|-------------------------------------------|
| Subtle    | Smidig    | Advantage + extra damage on sneak attacks |
| Long      | Lång      | Reach up to 4m (two squares)              |
| Toppling  | Fällande  | Advantage on knockdown attempts           |
| Piercing  | Stickande | Piercing damage type                      |
| Slashing  | Huggande  | Slashing damage type                      |
| Crushing  | Krossande | Crushing damage type                      |
| Throwable | —         | Can be thrown                             |

See `corebook-equipment.json` for the full weapon tables (28 melee + 6 ranged weapons).

---

## Experience (Erfarenhet)

### Improvement Marks (Förbättringskryss)
- **Dragon roll** (rolling 1) = improvement mark on that skill
- **Demon roll** (rolling 20) = automatic failure, may also earn a mark
- End-of-session questions (explored? defeated enemies? solved problems peacefully? gave in to weakness?) each grant a mark on any unmarked skill

### Advancement (Förbättringsslag)
At session end, roll 1d20 for each marked skill. If the roll exceeds the current skill value, increase it by 1 (max 18). Erase all marks.

### Gaining Heroic Abilities
- Raise any skill to 18 = gain a heroic ability of your choice
- GM may award one after a mighty deed (rare, max once per adventure)

### Overcoming Weakness
Act against your weakness during a session to gain 2 improvement marks (instead of 1 for giving in). Remove the weakness. After at least one session without a weakness, choose a new one.

---

## Worked Example: Kvucksum Halvfinger, Young Mallard Thief

A complete walkthrough of the 13-step character creation process. All values can be verified against the corebook JSON files (e.g., `corebook-kins.json`, `corebook-professions.json`, `corebook-skills.json`); the finished character sheet lives in `sample-character-mallard-thief.json`.

---

### Step 1–2: Kin & Kin Ability

**Choice: Mallard** (Anka, roll 11 on d12)

- Base movement: **8m**
- Two kin abilities:
  - **Ill-tempered** (Vresig) — 3 WP. Advantage on any roll, but you become Angry. Cannot be used on INT-based rolls.
  - **Webbed Feet** (Simfötter) — 0 WP. Advantage on Swimming rolls; move at full speed in water.

### Step 3: Profession

**Choice: Thief** (Tjuv, #10)

- Key attribute: **AGL**
- 8 profession skills: Bluffing (Bluffa), Knives (Kniv), Sleight of Hand (Fingerfärdighet), Spot Hidden (Finna dolda ting), Acrobatics (Hoppa & klättra), Sneaking (Smyga), Evade (Undvika), Awareness (Upptäcka fara)
- Heroic ability: **Backstabbing** (Tjuvhugg) — 3 WP

### Step 4: Age

**Choice: Young** (Ung, roll 1–3 on d6)

- Total trained skills: **8** (6 from profession + 2 free choice)
- Attribute modifiers: **AGL +1, CON +1**

### Step 5: Name

**Kvucksum Halvfinger** — a Mallard name from the name tables. Nickname: *Halvfinger* ("Half-finger").

### Step 6: Attributes

**Roll 4d6 drop lowest**, six times. We use a plausible array: **15, 13, 12, 10, 9, 7**.

Assign strategically for a Thief (AGL is the key attribute):

| Attribute    | Assigned | Young Modifier | Final |
|--------------|----------|----------------|-------|
| STR (Styrka) | 7        | —              | **7** |
| CON (Fysik)  | 10       | +1             | **11**|
| AGL (Smidighet) | 15   | +1             | **16**|
| INT (Intelligens) | 12  | —              | **12**|
| WIL (Psykisk kraft) | 9 | —              | **9** |
| CHA (Karisma) | 13     | —              | **13**|

Strategy: Maximize AGL for the Thief's weapon/stealth skills. Dump STR (a Thief rarely needs it). Put the 13 in CHA for Bluffing. CON gets a natural boost from Young age.

### Step 7: Derived Ratings

Using the final attribute values:

| Rating | Formula | Calculation | Result |
|--------|---------|-------------|--------|
| HP | = CON | 11 | **11** |
| WP | = WIL | 9 | **9** |
| Damage Bonus (STR) | STR 7 → bracket 1–12 | None | **—** |
| Damage Bonus (AGL) | AGL 16 → bracket 13–16 | +1d4 | **+1d4** |
| Movement | Mallard base 8 + AGL modifier | AGL 16 → +4m | **12m** |
| Carrying Capacity | STR / 2, round up | 7 / 2 = 3.5 → 4 | **4 items** |

### Step 8: Trained Skills

As a Young Thief, Kvucksum trains **8 skills** total: 6 chosen from the Thief profession list + 2 free choice from any skill.

First, calculate **base chances** from attributes:

| Attribute Value | Bracket | Base Chance |
|-----------------|---------|-------------|
| STR 7           | 6–8     | 4           |
| CON 11          | 9–12    | 5           |
| AGL 16          | 16–18   | 7           |
| INT 12          | 9–12    | 5           |
| WIL 9           | 9–12    | 5           |
| CHA 13          | 13–15   | 6           |

Trained skills start at **2 × base chance**. Untrained skills remain at base chance.

**6 from profession (Thief):**

| Skill | Swedish | Attribute | Base | Trained Value |
|-------|---------|-----------|------|---------------|
| Knives | Kniv | AGL | 7 | **14** |
| Sleight of Hand | Fingerfärdighet | AGL | 7 | **14** |
| Spot Hidden | Finna dolda ting | INT | 5 | **10** |
| Acrobatics | Hoppa & klättra | AGL | 7 | **14** |
| Sneaking | Smyga | AGL | 7 | **14** |
| Evade | Undvika | AGL | 7 | **14** |

**2 free choice:**

| Skill | Swedish | Attribute | Base | Trained Value |
|-------|---------|-----------|------|---------------|
| Bluffing | Bluffa | CHA | 6 | **12** |
| Awareness | Upptäcka fara | INT | 5 | **10** |

Note: The Thief profession offers 8 skills but you only train 6 of them. Here we skipped Underhållning (Performance) and chose Bluffing and Awareness as the two free skills — both appear in the Thief's profession list, but they count as free choices since we only picked 6 from the profession.

### Step 9: Heroic Ability

From the Thief profession: **Backstabbing** (Tjuvhugg) — 3 WP. When attacking an enemy who is unaware of you, you deal extra damage.

### Step 10: Weakness

**Roll d20: 10 → Kleptomaniac** (Kleptoman). Can't resist stealing shiny things. This drives roleplay and feeds the experience system — giving in to your weakness earns an improvement mark at session end.

### Step 11: Starting Gear

Thief gear packages (roll 1d6):
- 1–2: Short sword, leather armor, lockpicks, rope, torch, firestarter, 1d6 rations, 1d10 silver
- **3–4: Knife, simple lockpicks, torch, firestarter, 1d6 rations, 1d10 silver** ← our roll
- 5–6: Dagger, grappling hook, rope, lockpicks, torch, firestarter, 1d6 rations, 1d10 silver

Sub-rolls: 1d6 rations → **4 rations**, 1d10 silver → **6 silver**.

**Inventory:**

| Slot | Item | Weight | Notes |
|------|------|--------|-------|
| — | Knife (wielded) | — | Weapons at hand don't count toward capacity |
| 1 | Simple lockpicks | 1 | |
| 2 | Torch | 1 | |
| 3 | Firestarter | 1 | |
| 4 | Rations ×4 | 1 | Up to 4 rations = 1 item |

Total encumbrance: **4 / 4** — exactly at carrying capacity.

Currency: **6 silver** (under 100 coins, doesn't count for encumbrance).

No armor — the Thief starts unarmored in this gear package.

### Step 12: Memento

**Roll d20: 12 → A pair of simple bone dice.** Once per session, Kvucksum can hold the dice during a short rest to recover one extra condition.

### Step 13: Appearance

**Roll d20: 12 → Magnificent hairstyle.** For a Mallard, this is presumably an impressive crest of feathers.

---

### Final Character Summary

**Kvucksum Halvfinger** — Young Mallard Thief

| | |
|---|---|
| **STR** 7 · **CON** 11 · **AGL** 16 · **INT** 12 · **WIL** 9 · **CHA** 13 | |
| **HP** 11 · **WP** 9 | **Movement** 12m |
| **Damage Bonus** STR: — / AGL: +1d4 | **Carrying Capacity** 4 |

**Trained skills:** Knives 14, Sleight of Hand 14, Acrobatics 14, Sneaking 14, Evade 14, Bluffing 12, Spot Hidden 10, Awareness 10

**Abilities:** Backstabbing (3 WP), Ill-tempered (3 WP), Webbed Feet (0 WP)

**Weapon:** Knife — 1H, damage 1d8, durability 6, properties: Subtle, Piercing, Throwable

**Armor:** None

**Gear:** Simple lockpicks, torch, firestarter, 4 rations, 6 silver

**Weakness:** Kleptomaniac · **Memento:** Bone dice · **Appearance:** Magnificent hairstyle

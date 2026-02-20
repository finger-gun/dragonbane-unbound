# Effect Primitives Specification v1.0

Machine-readable mechanical effects for Dragonbane Unbound VTT data files.

## Overview

Every item, ability, spell, kin trait, and modifier in the data files can carry a `mechanical_effects` array. Each element in this array is a **primitive** — a single, atomic mechanical operation the VTT can interpret and enforce.

Free-text `description` / `effect` fields are **preserved as-is**. The `mechanical_effects` array sits alongside them, providing a structured duplicate that a rules engine can consume. The description remains the human-readable source of truth; the primitives are a machine-readable projection.

---

## Schema: Effect Primitive Object

```jsonc
{
  "type": "string",           // REQUIRED — one of the defined primitive types
  "target": { ... },          // contextual — what the effect applies to
  "value": "string | number", // contextual — magnitude (dice expr, integer, etc.)
  "phase": "string",          // Layer 3 only — lifecycle phase
  "when": "string",           // Layer 1 only — context in which the passive applies
  "trigger": "string",        // Layer 2 only — what activates the instant effect
  "condition": { ... },       // optional — prerequisite that must be true
  "duration": "string",       // optional — how long the effect lasts
  "frequency": "string",      // optional — how often the effect can be used
  "stackable": true,          // optional — can this effect stack (e.g., Robust)
  "note": "string"            // optional — clarifying text for edge cases
}
```

Not every field is used on every primitive. The tables below specify which fields are required/optional per type.

---

## Lifecycle Model

Effects fall into three layers based on how they are activated and tracked:

### Layer 1 — Passive / Static

Always active when the source is equipped, possessed, or innate. No activation cost.

- Uses `"when"` to specify context: `"equipped"`, `"always"`, `"short_rest"`, `"long_rest"`
- No `"phase"` or `"trigger"` fields

### Layer 2 — Activated / Instant

Costs WP (or a reaction). Produces a discrete, bounded effect that resolves immediately.

- Uses `"trigger"` to specify when it fires: `"on_dodge"`, `"on_attack"`, `"after_hit"`, `"on_fear_check"`, etc.
- No `"phase"` field (implicitly instant)
- May have `"frequency"` caps (e.g., `"once_per_round"`)

### Layer 3 — Activated / Stateful

Costs WP. Creates a temporary state that persists across multiple rounds or actions.

- Uses `"phase"` to specify lifecycle position:
  - `"on_activate"` — happens when the ability is first activated
  - `"while_active"` — persists for the duration of the state
  - `"on_end"` — happens when the state ends
- Must have at least one effect with `"phase": "on_activate"` or `"phase": "while_active"`

---

## Target Object

The `target` object specifies what the effect applies to. It supports the following shapes:

```jsonc
// Target a specific skill
{ "skill": "sneaking" }         // skill id from corebook-skills.json

// Target a category of skills
{ "skill_attribute": "INT" }    // all skills based on this attribute

// Target a specific action
{ "action": "dodge" }           // dodge, parry, melee_attack, ranged_attack, etc.

// Target a stat
{ "stat": "hp" }                // hp, wp, movement, damage_bonus, initiative

// Target a condition
{ "condition": "angry" }        // condition id from corebook-rules.json

// Target all rolls
{ "all_rolls": true }

// Target self
{ "self": true }

// Target allies
{ "allies": true, "range": "10m" }

// Target enemies
{ "enemies": true, "range": "10m" }

// Target a specific creature type
{ "creature_type": "monster" }
```

---

## Condition Object (Prerequisites)

The optional `condition` field specifies when a primitive applies:

```jsonc
// Target must be a monster
{ "target_is": "monster" }

// Must be a sneak attack
{ "attack_is": "sneak" }

// Must be in sunlight
{ "environment": "sunlight" }

// Target previously damaged you
{ "target_has": "damaged_you" }

// You are at 0 HP
{ "self_hp": 0 }

// Must have a shield equipped
{ "requires_equipped": "shield" }

// Must be using a specific weapon type
{ "weapon_type": "two_handed_melee" }

// Must not already have the condition
{ "not_condition": "angry" }
```

---

## Trigger Values (Layer 2)

Standard trigger values for activated instant effects:

| Trigger | When it fires |
|---------|--------------|
| `on_attack` | When making an attack roll |
| `after_hit` | After an attack hits, before damage is rolled |
| `on_dodge` | When performing a dodge |
| `on_parry` | When performing a parry |
| `on_fear_check` | When a fear resistance roll is called for |
| `on_skill_roll` | When making any skill roll |
| `on_death_roll` | When making a death roll |
| `on_initiative` | At initiative card draw |
| `on_short_rest` | During short rest |
| `on_long_rest` | During long rest |
| `on_incoming_attack` | When you are the target of an attack |
| `on_camp` | When setting up camp |
| `on_navigation` | When navigating in the wilderness |
| `on_fall` | When taking fall damage |
| `free` | Can be activated at any time as a free action |

---

## When Values (Layer 1)

Standard context values for passive effects:

| When | Meaning |
|------|---------|
| `equipped` | While the item is equipped/worn |
| `always` | Always active, no context needed |
| `short_rest` | Triggers automatically during short rest |
| `in_water` | While in or under water |

---

## Phase Values (Layer 3)

| Phase | Meaning |
|-------|---------|
| `on_activate` | Fires once when the ability is activated |
| `while_active` | Persists for the duration of the state |
| `on_end` | Fires once when the state ends |

---

## Primitive Type Catalog

### 1. `boon`

Grant advantage (roll 2D20, pick lowest) on a roll.

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"boon"` |
| `target` | yes | What roll gets advantage |
| `when` / `trigger` / `phase` | yes (one of) | Layer context |
| `condition` | optional | Prerequisite |

**Examples:**

```jsonc
// Halfling "Hard to Catch" — advantage on dodge (Layer 2)
{ "type": "boon", "target": { "action": "dodge" }, "trigger": "on_dodge" }

// Mallard "Webbed Feet" — always advantage on swim (Layer 1)
{ "type": "boon", "target": { "skill": "swimming" }, "when": "always" }

// Berserker — advantage on melee while active (Layer 3)
{ "type": "boon", "target": { "action": "melee_attack" }, "phase": "while_active" }

// Ogre "Tackle" — advantage on the tackle attack roll (Layer 2)
{ "type": "boon", "target": { "action": "melee_attack" }, "trigger": "on_attack" }

// Toppling weapon property — advantage on knockdown (Layer 1)
{ "type": "boon", "target": { "action": "knockdown" }, "when": "equipped" }
```

### 2. `bane`

Impose disadvantage (roll 2D20, pick highest) on a roll.

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"bane"` |
| `target` | yes | What roll gets disadvantage |
| `when` / `trigger` / `phase` | yes (one of) | Layer context |
| `condition` | optional | Prerequisite |

**Examples:**

```jsonc
// Studded Leather — disadvantage on sneaking while worn (Layer 1)
{ "type": "bane", "target": { "skill": "sneaking" }, "when": "equipped" }

// Chainmail — two banes (two separate primitives)
{ "type": "bane", "target": { "skill": "evade" }, "when": "equipped" }
{ "type": "bane", "target": { "skill": "sneaking" }, "when": "equipped" }

// Great Helmet — disadvantage on awareness AND ranged attacks
{ "type": "bane", "target": { "skill": "awareness" }, "when": "equipped" }
{ "type": "bane", "target": { "action": "ranged_attack" }, "when": "equipped" }

// Nightkin modifier — bane on ALL rolls in sunlight
{ "type": "bane", "target": { "all_rolls": true }, "when": "always", "condition": { "environment": "sunlight" } }

// Twin Shot — disadvantage on the attack roll (Layer 2)
{ "type": "bane", "target": { "action": "ranged_attack" }, "trigger": "on_attack" }
```

### 3. `bonus_damage`

Add extra damage dice or a flat bonus to damage.

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"bonus_damage"` |
| `value` | yes | Dice expression (e.g., `"1d8"`, `"1d6"`) or integer |
| `trigger` | yes (Layer 2) | Usually `"after_hit"` |
| `condition` | optional | Prerequisite (e.g., sneak attack, target is monster) |

**Examples:**

```jsonc
// Dragonslayer — +1d8 vs monsters
{ "type": "bonus_damage", "value": "1d8", "trigger": "after_hit", "condition": { "target_is": "monster" } }

// Iron Fist — +1d6 unarmed
{ "type": "bonus_damage", "value": "1d6", "trigger": "after_hit", "condition": { "weapon_type": "unarmed" } }

// Massive Blow — +1d8 with two-handed melee
{ "type": "bonus_damage", "value": "1d8", "trigger": "after_hit", "condition": { "weapon_type": "two_handed_melee" } }

// Assassin — +1d8 on sneak attack
{ "type": "bonus_damage", "value": "1d8", "trigger": "after_hit", "condition": { "attack_is": "sneak" } }

// Subtle weapon property — extra damage on sneak attacks (Layer 1)
{ "type": "bonus_damage", "value": "+1_damage_die", "when": "equipped", "condition": { "attack_is": "sneak" } }
```

### 4. `modify_stat`

Permanently or temporarily change a stat value (HP max, WP max, skill value, etc.).

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"modify_stat"` |
| `target` | yes | `{ "stat": "hp" }` etc. |
| `value` | yes | Integer (positive = increase, negative = decrease) |
| `when` / `phase` | conditional | Layer context |
| `stackable` | optional | Whether the effect can stack |

**Examples:**

```jsonc
// Robust — +2 max HP, stackable (Layer 1)
{ "type": "modify_stat", "target": { "stat": "hp" }, "value": 2, "when": "always", "stackable": true }

// Focused — +2 max WP, stackable (Layer 1)
{ "type": "modify_stat", "target": { "stat": "wp" }, "value": 2, "when": "always", "stackable": true }

// Half-Elf "Focus" — +2 skill value on Awareness for one roll (Layer 2)
{ "type": "modify_stat", "target": { "skill": "awareness" }, "value": 2, "trigger": "on_skill_roll" }

// Masterwork — STR requirement reduced by 3 (Layer 1, on the item)
{ "type": "modify_stat", "target": { "stat": "str_requirement" }, "value": -3, "when": "always" }
```

### 5. `apply_condition`

Apply a named condition from the conditions system (defined in `corebook-rules.json`).

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"apply_condition"` |
| `target` | optional | Who receives the condition (defaults to self) |
| `value` | yes | Condition id (e.g., `"angry"`, `"exhausted"`) |
| `phase` / `trigger` | yes | When the condition is applied |

**Examples:**

```jsonc
// Berserker — become Angry on activation (Layer 3)
{ "type": "apply_condition", "value": "angry", "phase": "on_activate" }

// Berserker — become Exhausted when state ends (Layer 3)
{ "type": "apply_condition", "value": "exhausted", "phase": "on_end" }

// Mallard "Ill-tempered" — become Angry as side effect (Layer 2)
{ "type": "apply_condition", "value": "angry", "trigger": "on_attack" }
```

### 6. `remove_condition`

Remove a condition from a target.

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"remove_condition"` |
| `target` | optional | Who loses the condition |
| `value` | yes | Condition id, or `"any"` for player's choice |
| `trigger` / `phase` / `when` | yes | When the removal happens |

**Examples:**

```jsonc
// Battle Cry — remove one condition from each ally (Layer 2)
{ "type": "remove_condition", "value": "any", "target": { "allies": true, "range": "earshot" }, "trigger": "free" }

// Elf "Inner Peace" — remove one extra condition during rest (Layer 1)
{ "type": "remove_condition", "value": "any", "target": { "self": true }, "when": "short_rest" }

// Satyr "Encouragement" — remove one condition from ally within 10m (Layer 2)
{ "type": "remove_condition", "value": "any", "target": { "allies": true, "range": "10m" }, "trigger": "free", "note": "Cannot target self. Costs an action." }
```

### 7. `auto_succeed`

Automatically succeed on a roll without rolling dice.

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"auto_succeed"` |
| `target` | yes | What roll is auto-succeeded |
| `trigger` / `when` | yes | Layer context |
| `condition` | optional | Prerequisite |

**Examples:**

```jsonc
// Lone Wolf — auto-succeed Bushcraft for camp (Layer 1, no WP cost)
{ "type": "auto_succeed", "target": { "skill": "bushcraft" }, "when": "long_rest", "note": "Self only, wilderness" }

// Quartermaster — auto-succeed Bushcraft for camp (Layer 2, costs 1 WP)
{ "type": "auto_succeed", "target": { "skill": "bushcraft" }, "trigger": "on_camp" }

// Fearless (heroic) — auto-resist fear (Layer 2)
{ "type": "auto_succeed", "target": { "action": "resist_fear" }, "trigger": "on_fear_check" }

// Hobgoblin "Fearless" — auto-succeed WIL vs fear (Layer 2)
{ "type": "auto_succeed", "target": { "action": "resist_fear" }, "trigger": "on_fear_check", "note": "Must activate before dice are rolled" }

// Orc "Steadfast" — auto-Rally at 0 HP (Layer 2)
{ "type": "auto_succeed", "target": { "action": "rally" }, "trigger": "free", "condition": { "self_hp": 0 } }
```

### 8. `restrict`

Prohibit a specific action or behavior.

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"restrict"` |
| `value` | yes | The action/behavior being restricted (e.g., `"parry"`, `"dodge"`, `"move"`) |
| `phase` / `when` | yes | When the restriction is active |

**Examples:**

```jsonc
// Berserker — cannot parry while active (Layer 3)
{ "type": "restrict", "value": "parry", "phase": "while_active" }

// Berserker — cannot dodge while active (Layer 3)
{ "type": "restrict", "value": "dodge", "phase": "while_active" }

// Massive Blow — cannot move in same round (Layer 2)
{ "type": "restrict", "value": "move", "trigger": "after_hit", "duration": "round" }

// Flail "Cannot parry" weapon property (Layer 1)
{ "type": "restrict", "value": "parry", "when": "equipped" }

// Crossbow "No damage bonus" (Layer 1)
{ "type": "restrict", "value": "damage_bonus", "when": "equipped" }
```

### 9. `damage`

Deal direct damage (not via attack roll — e.g., environmental, ability-triggered).

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"damage"` |
| `value` | yes | Dice expression or formula |
| `target` | optional | Who takes the damage |
| `condition` | optional | When the damage applies |
| `duration` | optional | Recurring damage interval |

**Examples:**

```jsonc
// Nightkin — 1d6 damage per stretch in sunlight
{ "type": "damage", "value": "1d6", "target": { "self": true }, "condition": { "environment": "sunlight" }, "duration": "per_stretch" }

// Master Carpenter — 1d12 damage to objects per WP spent (Layer 2)
{ "type": "damage", "value": "1d12_per_wp", "target": { "object": true }, "trigger": "free", "note": "Ignores target protection. Costs an action." }

// Ogre "Tackle" — 2d6 bludgeoning + damage bonus (Layer 2)
{ "type": "damage", "value": "2d6", "trigger": "after_hit", "note": "Bludgeoning. Plus normal damage bonus." }
```

### 10. `reduce_damage`

Reduce incoming damage dice or flat damage.

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"reduce_damage"` |
| `value` | yes | How much to reduce (dice or formula) |
| `trigger` | yes | When the reduction applies |
| `condition` | optional | What type of damage |

**Examples:**

```jsonc
// Catlike — reduce fall damage by 1 die per WP spent (Layer 2)
{ "type": "reduce_damage", "value": "1d6_per_wp", "trigger": "on_fall", "note": "Can roll Acrobatics first, then decide to activate" }

// Cat People "Nine Lives" — reduce fall damage up to 3d6 (Layer 2)
{ "type": "reduce_damage", "value": "1d6_per_wp", "trigger": "on_fall", "note": "Max 3 WP. Applied after Acrobatics roll." }

// Master Blacksmith "Sharpen" — armor counts as one step lower (Layer 3)
{ "type": "reduce_damage", "value": "armor_step_-1", "target": { "enemies": true }, "phase": "while_active", "note": "Applied to the weapon. Target's armor is treated as one step lower." }
```

### 11. `heal`

Restore HP or WP.

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"heal"` |
| `target` | yes | `{ "stat": "hp" }` or `{ "stat": "wp" }` |
| `value` | yes | Dice expression or integer |
| `when` / `trigger` | yes | Layer context |

**Examples:**

```jsonc
// Fast Healer — +1d6 HP during short rest (Layer 2)
{ "type": "heal", "target": { "stat": "hp" }, "value": "1d6", "trigger": "on_short_rest" }

// Elf "Inner Peace" — +1d6 HP and +1d6 WP during short rest (Layer 1)
{ "type": "heal", "target": { "stat": "hp" }, "value": "1d6", "when": "short_rest" }
{ "type": "heal", "target": { "stat": "wp" }, "value": "1d6", "when": "short_rest" }
```

### 12. `movement`

Modify movement mode, speed, or range.

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"movement"` |
| `value` | yes | Movement descriptor or formula |
| `when` / `trigger` / `phase` | yes | Layer context |
| `condition` | optional | Prerequisite |

**Examples:**

```jsonc
// Mallard "Webbed Feet" — full speed in water (Layer 1)
{ "type": "movement", "value": "full_speed", "when": "in_water" }

// Karkion "Wings" — flight at ground speed (Layer 2, sustained)
{ "type": "movement", "value": "flight_at_ground_speed", "trigger": "free", "duration": "per_round", "note": "Costs 1 WP per round" }

// Long weapon property — melee reach extended to 4m (Layer 1)
{ "type": "movement", "value": "melee_reach_4m", "when": "equipped" }

// Frog People "Leaper" — jump horizontal=movement, vertical=half (Layer 2)
{ "type": "movement", "value": "jump_horizontal_eq_movement", "trigger": "free" }
```

### 13. `redirect`

Redirect an incoming attack to a different target.

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"redirect"` |
| `target` | yes | Who the attack is redirected to |
| `trigger` | yes | When the redirect can happen |
| `condition` | optional | Prerequisites |

**Examples:**

```jsonc
// Guardian — redirect enemy attack from ally to self (Layer 2)
{ "type": "redirect", "target": { "self": true }, "trigger": "on_incoming_attack", "condition": { "ally_targeted": true, "range": "2m" }, "note": "Not an action. You and ally must be in melee with the same enemy." }

// Weasel — redirect attack from self to nearby PC (Layer 2)
{ "type": "redirect", "target": { "allies": true, "range": "2m" }, "trigger": "on_incoming_attack", "note": "Must use before dodge/parry. No effect on area attacks." }
```

### 14. `extra_action`

Perform an action without spending your normal turn action, or gain an additional attack/action.

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"extra_action"` |
| `value` | yes | What action is gained (e.g., `"parry"`, `"dodge"`, `"attack"`) |
| `trigger` | yes | When the extra action is available |
| `frequency` | optional | Usage limits |

**Examples:**

```jsonc
// Defensive — parry without using action (Layer 2)
{ "type": "extra_action", "value": "parry", "trigger": "on_incoming_attack", "frequency": "unlimited_per_round", "note": "Costs 3 WP per use" }

// Fast Footwork — dodge without using action (Layer 2)
{ "type": "extra_action", "value": "dodge", "trigger": "on_incoming_attack", "frequency": "unlimited_per_round", "note": "Costs 3 WP per use" }

// Dual Wield — extra off-hand attack (Layer 2)
{ "type": "extra_action", "value": "attack", "trigger": "on_attack", "condition": { "weapon_type": "dual_wield" }, "note": "Off-hand attack has disadvantage. Off-hand STR req +3." }

// Master Spellcaster — cast two spells in one action (Layer 2)
{ "type": "extra_action", "value": "cast_spell", "trigger": "on_attack", "note": "Must be two different spells. Each spell costs its own WP." }
```

### 15. `modify_initiative`

Change how initiative cards are drawn or retained.

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"modify_initiative"` |
| `value` | yes | Description of the modification |
| `trigger` | yes | Usually `"on_initiative"` |

**Examples:**

```jsonc
// Lightning Fast — draw 2 cards, pick best (Layer 2)
{ "type": "modify_initiative", "value": "draw_2_pick_best", "trigger": "on_initiative", "frequency": "once_per_round" }

// Veteran — keep previous round's card (Layer 2)
{ "type": "modify_initiative", "value": "keep_previous", "trigger": "on_initiative" }
```

### 16. `unlock`

Grant access to an action, capability, or mode that is normally unavailable.

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"unlock"` |
| `value` | yes | What is unlocked |
| `when` / `trigger` | yes | Layer context |

**Examples:**

```jsonc
// Deflect Arrow — can parry ranged attacks with melee weapon (Layer 2)
{ "type": "unlock", "value": "parry_ranged_with_melee", "trigger": "on_incoming_attack" }

// Shield Block — can parry normally-unparriable monster attacks (Layer 2)
{ "type": "unlock", "value": "parry_unparriable_monster_attack", "trigger": "on_parry", "condition": { "requires_equipped": "shield" } }

// Magic School (heroic ability) — learn a new magic school (Layer 1)
{ "type": "unlock", "value": "magic_school", "when": "always", "stackable": true, "note": "Requires separate training. Non-mages can learn." }

// Throwable weapon property — enables ranged attack mode (Layer 1)
{ "type": "unlock", "value": "ranged_attack_mode", "when": "equipped", "note": "STR-based range" }
```

### 17. `constraint`

Escape hatch for rules too complex to encode as primitives. Contains a human-readable `rule` string that the VTT can display to the player/GM but cannot automatically enforce.

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | `"constraint"` |
| `value` | yes | Human-readable rule string |
| `phase` / `when` / `trigger` | yes | When the constraint applies |

**Examples:**

```jsonc
// Berserker — must fight until enemies dead or 0 HP (Layer 3)
{ "type": "constraint", "value": "Must fight until all enemies are defeated or you reach 0 HP", "phase": "while_active" }

// Human "Adaptive" — GM must approve skill substitution (Layer 2)
{ "type": "constraint", "value": "GM must approve the skill substitution. Player must justify how the chosen skill applies.", "trigger": "on_skill_roll" }

// Elf "Inner Peace" — unreachable during meditation (Layer 1)
{ "type": "constraint", "value": "Completely unreachable during rest. Cannot be awakened.", "when": "short_rest" }

// Companion — one companion at a time, 15 min bonding ritual (Layer 3)
{ "type": "constraint", "value": "One companion at a time. Bonding takes 15 minutes.", "phase": "on_activate" }

// Lance "Requires war horse" (Layer 1)
{ "type": "constraint", "value": "Can only be used while mounted on a war horse", "when": "equipped" }
```

---

## Conditions System Integration

The 6 conditions are defined in `corebook-rules.json` under `conditions.list`:

| ID | Name | Attribute | Effect |
|----|------|-----------|--------|
| `exhausted` | Exhausted | STR | Bane on all STR-based skill rolls |
| `sickly` | Sickly | CON | Bane on all CON-based skill rolls |
| `dazed` | Dazed | AGL | Bane on all AGL-based skill rolls |
| `angry` | Angry | INT | Bane on all INT-based skill rolls |
| `scared` | Scared | WIL | Bane on all WIL-based skill rolls |
| `disheartened` | Disheartened | CHA | Bane on all CHA-based skill rolls |

**How conditions interact with effect primitives:**

1. **`apply_condition`** references conditions by `id`. The VTT resolves the condition's attribute and applies the implicit bane to all skill rolls based on that attribute.
2. **`remove_condition`** references by `id` or uses `"any"` to let the player choose which condition to remove.
3. Conditions are **not** modeled as `bane` primitives themselves — the bane is implicit in the condition definition. This avoids duplication: the condition system is the single source of truth for what each condition mechanically does.
4. When an ability like Berserker applies `angry`, the VTT should:
   - Mark the character as having the Angry condition
   - Automatically impose bane on all INT-based skill rolls
   - This is separate from any explicit `bane` or `boon` primitives the ability also declares

**Example — Berserker full decomposition:**

```jsonc
"mechanical_effects": [
  { "type": "apply_condition", "value": "angry", "phase": "on_activate" },
  { "type": "boon", "target": { "action": "melee_attack" }, "phase": "while_active" },
  { "type": "restrict", "value": "parry", "phase": "while_active" },
  { "type": "restrict", "value": "dodge", "phase": "while_active" },
  { "type": "constraint", "value": "Must fight until all enemies are defeated or you reach 0 HP", "phase": "while_active" },
  { "type": "apply_condition", "value": "exhausted", "phase": "on_end" }
]
```

---

## Complete Worked Examples

### Layer 1: Plate Armor (corebook-equipment.json)

```jsonc
{
  "id": "plate_armor",
  "name": "Plate Armor",
  "mechanical_effects": [
    { "type": "bane", "target": { "skill": "acrobatics" }, "when": "equipped" },
    { "type": "bane", "target": { "skill": "evade" }, "when": "equipped" },
    { "type": "bane", "target": { "skill": "sneaking" }, "when": "equipped" }
  ]
}
```

### Layer 1: Mallard "Webbed Feet" (corebook-kins.json)

```jsonc
{
  "id": "webbed_feet",
  "name": "Webbed Feet",
  "wp_cost": 0,
  "mechanical_effects": [
    { "type": "boon", "target": { "skill": "swimming" }, "when": "always" },
    { "type": "movement", "value": "full_speed", "when": "in_water" }
  ]
}
```

### Layer 2: Dragonslayer (corebook-heroic-abilities.json)

```jsonc
{
  "id": "drakdrapare",
  "name": "Dragonslayer",
  "wp_cost": 3,
  "mechanical_effects": [
    { "type": "bonus_damage", "value": "1d8", "trigger": "after_hit", "condition": { "target_is": "monster" } }
  ]
}
```

### Layer 2: Dual Wield + Double Slash combo

```jsonc
// Dual Wield
{
  "id": "tva_vapen",
  "name": "Dual Wield",
  "wp_cost": 3,
  "mechanical_effects": [
    { "type": "extra_action", "value": "attack", "trigger": "on_attack", "condition": { "weapon_type": "dual_wield" } },
    { "type": "bane", "target": { "action": "melee_attack" }, "trigger": "on_attack", "note": "Applies to the second (off-hand) attack only" },
    { "type": "constraint", "value": "Off-hand weapon STR requirement is +3 above normal", "trigger": "on_attack" }
  ]
}

// Double Slash
{
  "id": "dubbelhugg",
  "name": "Double Slash",
  "wp_cost": 3,
  "mechanical_effects": [
    { "type": "extra_action", "value": "attack_second_target", "trigger": "on_attack", "condition": { "target_range": "2m" } },
    { "type": "constraint", "value": "Single attack roll applies to both targets. Separate damage rolls.", "trigger": "on_attack" }
  ]
}
```

### Layer 3: Musician (corebook-heroic-abilities.json)

```jsonc
{
  "id": "tonkonst",
  "name": "Musician",
  "wp_cost": 3,
  "mechanical_effects_mode_a": [
    { "type": "boon", "target": { "allies": true, "range": "10m" }, "phase": "while_active", "note": "Advantage on ALL rolls" },
    { "type": "constraint", "value": "Uses your action. Lasts until your next turn.", "phase": "on_activate" }
  ],
  "mechanical_effects_mode_b": [
    { "type": "bane", "target": { "enemies": true, "range": "10m" }, "phase": "while_active", "note": "Disadvantage on ALL rolls" },
    { "type": "constraint", "value": "Uses your action. Lasts until your next turn.", "phase": "on_activate" }
  ]
}
```

**Note on multi-mode abilities:** When an ability has mutually exclusive modes (like Musician's ally-buff vs enemy-debuff), use `mechanical_effects_mode_a` / `mechanical_effects_mode_b` arrays instead of a single `mechanical_effects`. The VTT presents the choice to the player at activation time.

### Layer 3: Nightkin modifier (monsterboken-kins.json)

This replaces the current ad-hoc `mechanical_effects` object:

```jsonc
{
  "id": "nightkin",
  "name": "Nightkin",
  "mechanical_effects": [
    { "type": "bane", "target": { "all_rolls": true }, "when": "always", "condition": { "environment": "sunlight" } },
    { "type": "damage", "value": "1d6", "target": { "self": true }, "when": "always", "condition": { "environment": "sunlight" }, "duration": "per_stretch" },
    { "type": "constraint", "value": "Thick cloud cover or full-body covering clothing negates the effect", "when": "always" }
  ]
}
```

---

## Multi-Mode Abilities

Some abilities have mutually exclusive modes (Musician, Goblin "Resilient", Cat People "Nine Lives"). These use the pattern:

```jsonc
{
  "mechanical_effects_mode_a": [ ... ],
  "mechanical_effects_mode_b": [ ... ]
}
```

If an ability has a mix of always-active passives plus activated modes, the passives go in the base `mechanical_effects` array and the activated modes go in `mechanical_effects_mode_*`:

```jsonc
// Goblin "Resilient" — passive (raw food) + two activated modes
{
  "mechanical_effects": [
    { "type": "constraint", "value": "Can always eat raw food without problems", "when": "always" }
  ],
  "mechanical_effects_mode_a": [
    { "type": "boon", "target": { "skill": "constitution" }, "trigger": "on_skill_roll", "condition": { "roll_is": "resist_poison_or_disease" } }
  ],
  "mechanical_effects_mode_b": [
    { "type": "auto_succeed", "target": { "skill": "bushcraft" }, "trigger": "on_camp" }
  ]
}
```

---

## Backward Compatibility

The existing `mechanical_effects` objects in `monsterboken-kins.json` (on `nightkin` and `melancholy` modifiers) use ad-hoc key-value schemas. These will be **replaced** by the standardized array format defined in this spec. The old format is not forward-compatible.

**Migration plan:** When a data file is updated to this spec, its version should be bumped (e.g., v2.1 → v2.2 for corebook files, v1.2 → v1.3 for expansion files).

---

## Application Order (File-by-File)

Planned order for adding `mechanical_effects` to data files:

1. **`corebook-equipment.json`** — Pure Layer 1. Armor banes, weapon properties.
2. **`corebook-kins.json`** — 7 abilities, mix of Layer 1 and 2.
3. **`corebook-heroic-abilities.json`** — 44 abilities, all three layers. The real test.
4. **`monsterboken-kins.json`** — 9 kins + 3 modifiers. Replace old ad-hoc format.
5. **`drakborgen-kins.json`** + **`drakborgen-heroic-abilities.json`** — Small files.
6. **`brandajorden-professions.json`** — Minor (profession-specific notes only).
7. **`corebook-magic.json`** + **`brandajorden-magic.json`** — Hardest. Spells have complex effects, durations, summoned creatures.

Files with no mechanical effects to encode:
- `corebook-weaknesses.json` — Purely narrative
- `corebook-appearance.json` — Cosmetic only
- `corebook-professions.json` — Skill/gear lists, no mechanical effects
- `corebook-skills.json` — Skill definitions, no effects
- `corebook-rules.json` — Rules framework, conditions already structured

---

## Type Reference (Quick Lookup)

| # | Type | Layer(s) | Description |
|---|------|----------|-------------|
| 1 | `boon` | 1, 2, 3 | Advantage on a roll |
| 2 | `bane` | 1, 2, 3 | Disadvantage on a roll |
| 3 | `bonus_damage` | 1, 2 | Extra damage dice/bonus |
| 4 | `modify_stat` | 1, 2 | Change a stat value |
| 5 | `apply_condition` | 2, 3 | Apply a named condition |
| 6 | `remove_condition` | 1, 2 | Remove a condition |
| 7 | `auto_succeed` | 1, 2 | Skip a roll, auto-success |
| 8 | `restrict` | 1, 2, 3 | Prohibit an action |
| 9 | `damage` | 1, 2 | Deal direct damage |
| 10 | `reduce_damage` | 2, 3 | Reduce incoming damage |
| 11 | `heal` | 1, 2 | Restore HP or WP |
| 12 | `movement` | 1, 2 | Modify movement mode/speed |
| 13 | `redirect` | 2 | Redirect an attack |
| 14 | `extra_action` | 2 | Gain a free action |
| 15 | `modify_initiative` | 2 | Change initiative drawing |
| 16 | `unlock` | 1, 2 | Grant access to new capability |
| 17 | `constraint` | 1, 2, 3 | Escape hatch — human-readable rule |

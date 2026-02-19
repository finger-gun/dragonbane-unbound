![Dragonbane Unbound](../assets/logo.png)

# Package Example (Data-Driven Rules + Content)

This example shows a package that stores rules and content as data files. The rules engine reads these files and computes outcomes. The DB stores only state (inputs, choices, results, receipts).

## Example: System Pack Layout

```
packages/
  systems/
    dragonbane-core/
      manifest.json
      tables/
        skill-brackets.json
      rules/
        derived-stats.json
        creation-flow.json
      content/
        items/
        spells/
```

### manifest.json

```json
{
  "name": "@dbu/system-dragonbane-core",
  "type": "system",
  "version": "0.1.0",
  "requires": ["@dbu/engine"],
  "description": "Core Dragonbane rules and tables"
}
```

### tables/skill-brackets.json

```json
{
  "stat": "strength",
  "brackets": [
    { "min": 1, "max": 9, "baseSkill": 5 },
    { "min": 10, "max": 15, "baseSkill": 7 },
    { "min": 16, "max": 20, "baseSkill": 9 }
  ]
}
```

### rules/derived-stats.json

```json
{
  "derived": [
    {
      "id": "hp",
      "formula": "floor(strength / 2)"
    }
  ]
}
```

### rules/creation-flow.json

```json
{
  "steps": [
    {
      "id": "roll-stats",
      "action": "roll",
      "dice": "3d6",
      "targets": ["strength", "agility", "charisma", "intelligence"]
    },
    {
      "id": "base-skill",
      "action": "lookup",
      "table": "tables/skill-brackets.json",
      "input": "strength",
      "output": "baseSkill.strengthWeapons"
    },
    {
      "id": "derive-hp",
      "action": "formula",
      "formulaRef": "rules/derived-stats.json#hp",
      "output": "hp"
    }
  ]
}
```

## Example: Content Pack Layout

```
packages/
  content/
    community-bestiary/
      manifest.json
      monsters/
        forest-troll.json
```

### content/manifest.json

```json
{
  "name": "@dbu/content-community-bestiary",
  "type": "content",
  "version": "0.1.0",
  "requires": ["@dbu/system-dragonbane-core"],
  "description": "Community bestiary pack"
}
```

### monsters/forest-troll.json

```json
{
  "id": "monster.forest-troll",
  "name": "Forest Troll",
  "stats": {
    "strength": 15,
    "agility": 8,
    "charisma": 6,
    "hp": 7
  },
  "attacks": [
    {
      "name": "Club",
      "toHit": "strength",
      "damage": "1d8 + 2"
    }
  ],
  "tags": ["troll", "forest"]
}
```

## What Goes in the DB (State Only)

- Character inputs: rolled stats, selected options
- Derived results: hp, base skills (plus a receipt of how they were computed)
- Campaign state: encounter order, logs, items owned
- Installed packs list + versions

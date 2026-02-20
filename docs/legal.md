# Dragonbane Unbound – Legal & License Guidance

*Version 0.1*
*Last updated: 2026‑02‑20*

> **Disclaimer:** This document is not legal advice. It is a practical compliance guide for keeping Dragonbane Unbound within the scope of Free League’s third‑party license and general copyright/trademark boundaries.

## 1. Project Intent

Dragonbane Unbound is intended to be a **companion tool**, not a replacement for the Dragonbane / Drakar och Demoner core rulebooks.

The platform exists to:

* Manage characters and progression
* Track items, conditions, and derived values
* Provide fast in-session support (dice, modifiers, status effects)

It is **not** intended to:

* Provide a full playable standalone rules system
* Replace the need for the official rulebooks
* Distribute official Free League content

---

## 2. Guiding Principle

**The rulebook must remain necessary.**

The tool may calculate and track mechanics, but it must not reproduce the rulebook’s written rules or provide enough content to play without owning the official game.

---

## 3. Allowed vs Not Allowed (High-Level)

| Category        | Allowed                                 | Not Allowed                              |
| --------------- | --------------------------------------- | ---------------------------------------- |
| Companion tools | Character sheets, calculators, trackers | Standalone playable digital Dragonbane   |
| Mechanics       | Internal math, modifiers, dice logic    | Full reproduction of core rules chapters |
| Content         | Community-created original material     | Shipping official spells/abilities text  |
| Encounters      | Tracking initiative/HP/conditions       | Fully automated combat resolution engine |
| Branding        | Compatibility logo + disclaimer         | Using trademarks as if official          |

---

## 4. DO / DON’T Tables

### Character Builder

| DO                                    | DON’T                                    |
| ------------------------------------- | ---------------------------------------- |
| Calculate skill bases from attributes | Copy-paste character creation text       |
| Let players select abilities by name  | Include full heroic ability descriptions |
| Reference rulebook page numbers       | Provide complete rules explanations      |

---

### Status Effects & Conditions

| DO                                               | DON’T                                                 |
| ------------------------------------------------ | ----------------------------------------------------- |
| Track conditions like Angry, Scared, Poisoned    | Include the full rulebook wording for them            |
| Apply mechanical flags (e.g., Bane on STR rolls) | Explain the entire procedure of when/how they trigger |
| Provide short reminders + page refs              | Replace the rulebook’s condition section              |

---

### Dice & Modifiers

| DO                                                       | DON’T                                        |
| -------------------------------------------------------- | -------------------------------------------- |
| Implement dice mechanics (Bane = roll twice, keep worst) | Provide full “how to resolve checks” text    |
| Offer a dice roller integrated with sheets               | Turn the app into a complete rules simulator |

---

### Encounter Support

| DO                                    | DON’T                                      |
| ------------------------------------- | ------------------------------------------ |
| Track initiative order and HP         | Fully automate combat start-to-finish      |
| Allow GM to apply conditions manually | Auto-run encounters without GM involvement |
| Support quick math and state tracking | Replace the need to consult combat rules   |

---

### Community Content

| DO                                                    | DON’T                                   |
| ----------------------------------------------------- | --------------------------------------- |
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

---

## 6. Required Disclaimers

All distributions should include:

> Dragonbane Unbound is an independent, fan-made tool. It is not affiliated with or endorsed by Free League Publishing.

> Dragonbane / Drakar och Demoner is a trademark of Free League Publishing.

---

## 7. Risk Levels for Features

| Feature                                   | Risk Level |
| ----------------------------------------- | ---------- |
| Character sheet management                | Low        |
| Derived stat calculation                  | Low        |
| Status effect tracking                    | Low        |
| Ability selection by name only            | Medium-Low |
| Full automation of combat procedures      | High       |
| Bundling official spell/ability text      | Very High  |
| Official content marketplace/distribution | Very High  |

---

## 8. When to Contact Free League

You should strongly consider direct permission if you plan to:

* Distribute official-like content packs
* Automate full encounter resolution
* Commercialize the platform at scale
* Support both Swedish and English official lines simultaneously

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
| ------------------------------------------------ | ----------------------------------------------------- | -------------------------------------------------------------- |
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

## 11. Mechanics vs Expression – What Is Likely Protected?

This section provides practical guidance on the difference between **game mechanics** (usually not protected on their own) and **creative expression** (protected text, presentation, and trademarks).

> This is not legal advice — it is a project design guideline.

### A. Generally Safer: Mechanics / Systems

These are typically abstract mechanics or mathematical relationships. Implementing them in code is usually lower risk, as long as you do not copy explanatory rulebook text.

| Example                                        | Risk Level | Notes                      |
| ---------------------------------------------- | ---------- | -------------------------- |
| “Roll under your skill on a d20”               | Low        | Generic resolution concept |
| “Bane = roll twice, keep the worst”            | Low        | Dice mechanic              |
| Attribute → skill base formulas                | Low        | Mathematical calculation   |
| Applying numeric modifiers from conditions     | Low        | Mechanical adjustment      |
| Tracking HP, initiative, inventory, conditions | Low        | State management           |

---

### B. Higher Risk: Protected Expression

These elements are usually protected because they are written creative content or distinctive presentation.

| Example                                             | Risk Level | Why                      |
| --------------------------------------------------- | ---------- | ------------------------ |
| Exact phrases copied from the rulebook              | Very High  | Copyrighted text         |
| Full heroic ability or spell descriptions           | Very High  | Creative written content |
| Profession/kin narrative write-ups                  | Very High  | Expression + lore        |
| Copying official tables as presented                | High       | Creative arrangement     |
| Rewriting rules too closely to the original wording | High       | Derivative expression    |

---

### C. Grey Zone: Requires Careful Design

Some features are useful but must be implemented carefully.

| Example                                         | Risk Level | Mitigation                        |
| ----------------------------------------------- | ---------- | --------------------------------- |
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

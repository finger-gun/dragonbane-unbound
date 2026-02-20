#!/usr/bin/env python3
"""
Strip prose/description text from all character creation data files.

Removes description/description_sv and other prose fields that could
constitute reproduced rulebook text. Preserves all mechanical data,
names, IDs, formulas, numerical stats, and mechanical_effects.

Reference copies of the full-text versions are in source_data/reference-data/.
"""

import json
import os
import sys

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "character_creation")

# ─── Helpers ───────────────────────────────────────────────────────────


def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(filename, data):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"  ✓ Saved {filename}")


def bump_version(meta):
    """Bump minor version: 2.2 -> 2.3, 1.3 -> 1.4"""
    parts = meta["version"].split(".")
    parts[-1] = str(int(parts[-1]) + 1)
    meta["version"] = ".".join(parts)


def remove_keys(obj, keys):
    """Remove specified keys from a dict (in-place)."""
    for k in keys:
        obj.pop(k, None)


def strip_desc(obj):
    """Remove description/description_sv from an object."""
    remove_keys(obj, ["description", "description_sv"])


# ─── File-specific strippers ──────────────────────────────────────────


def strip_corebook_magic():
    """LR-001: corebook-magic.json"""
    print("Processing corebook-magic.json (LR-001)...")
    data = load_json("corebook-magic.json")

    # magic_rules top-level prose
    mr = data["magic_rules"]
    remove_keys(
        mr,
        [
            "general_magic",
            "general_magic_sv",
            "cantrip_cost",
            "cantrip_cost_sv",
            "spell_cost",
            "spell_cost_sv",
            "metal_restriction",
            "metal_restriction_sv",
            "spell_book",
            "spell_book_sv",
        ],
    )
    # linked_attribute_note is also prose per school
    # learning_new_spells sub-object
    if "learning_new_spells" in mr:
        lns = mr["learning_new_spells"]
        remove_keys(
            lns,
            [
                "from_teacher",
                "from_teacher_sv",
                "from_spell_book",
                "from_spell_book_sv",
                "cantrips",
                "cantrips_sv",
                "new_school",
                "new_school_sv",
            ],
        )
        # If learning_new_spells is now empty, remove it
        if not lns:
            del mr["learning_new_spells"]

    # Each magic school
    for school in data["magic_schools"]:
        remove_keys(
            school,
            [
                "linked_attribute_note",
                "linked_attribute_note_sv",
            ],
        )
        # Cantrips
        for cantrip in school.get("cantrips", []):
            strip_desc(cantrip)
        # Spells
        for spell in school.get("spells", []):
            strip_desc(spell)
            # Summoned creatures inside spells
            if "summoned_creature" in spell:
                sc = spell["summoned_creature"]
                # weapon descriptions
                if "weapon" in sc:
                    strip_desc(sc["weapon"])
                # spell_ability descriptions
                if "spell_ability" in sc:
                    strip_desc(sc["spell_ability"])
                # monster_attacks entries
                for ma in sc.get("monster_attacks", []):
                    strip_desc(ma)

    bump_version(data["_meta"])
    save_json("corebook-magic.json", data)


def strip_corebook_heroic_abilities():
    """LR-002: corebook-heroic-abilities.json"""
    print("Processing corebook-heroic-abilities.json (LR-002)...")
    data = load_json("corebook-heroic-abilities.json")

    for ha in data["heroic_abilities"]:
        strip_desc(ha)

    bump_version(data["_meta"])
    save_json("corebook-heroic-abilities.json", data)


def strip_brandajorden_magic():
    """LR-003: brandajorden-magic.json"""
    print("Processing brandajorden-magic.json (LR-003)...")
    data = load_json("brandajorden-magic.json")

    for school in data["magic_schools"]:
        remove_keys(school, ["special_rule", "special_rule_sv"])
        # Cantrips
        for cantrip in school.get("cantrips", []):
            strip_desc(cantrip)
        # Spells
        for spell in school.get("spells", []):
            strip_desc(spell)
            # Summoned creatures
            if "summoned_creature" in spell:
                sc = spell["summoned_creature"]
                for ma in sc.get("monster_attacks", []):
                    strip_desc(ma)
        # Side effect table
        if "side_effect_table" in school:
            for entry in school["side_effect_table"].get("entries", []):
                remove_keys(entry, ["result", "result_sv"])

    bump_version(data["_meta"])
    save_json("brandajorden-magic.json", data)


def strip_brandajorden_professions():
    """LR-004: brandajorden-professions.json"""
    print("Processing brandajorden-professions.json (LR-004)...")
    data = load_json("brandajorden-professions.json")

    for prof in data["professions"]:
        strip_desc(prof)
        remove_keys(
            prof,
            [
                "special_rule",
                "special_rule_sv",
                "flavor_note",
                "flavor_note_sv",
                "heroic_ability_note",
                "heroic_ability_note_sv",
                "skill_count_note",
                "skill_count_note_sv",
            ],
        )
        # Also strip note_sv from gear_options entries if present
        for go in prof.get("gear_options", []):
            remove_keys(go, ["note_sv", "note"])
        # Strip heroic_ability.note / note_sv if present
        ha = prof.get("heroic_ability")
        if ha and isinstance(ha, dict):
            remove_keys(ha, ["note", "note_sv"])

    bump_version(data["_meta"])
    save_json("brandajorden-professions.json", data)


def strip_corebook_kins():
    """LR-005 (corebook part): corebook-kins.json"""
    print("Processing corebook-kins.json (LR-005)...")
    data = load_json("corebook-kins.json")

    for kin in data["kins"]:
        remove_keys(kin, ["playable_note", "playable_note_sv"])
        for ability in kin.get("abilities", []):
            strip_desc(ability)
        # modifiers descriptions (if any modifier objects exist)
        for mod in kin.get("modifiers", []):
            if isinstance(mod, dict):
                strip_desc(mod)

    bump_version(data["_meta"])
    save_json("corebook-kins.json", data)


def strip_monsterboken_kins():
    """LR-005 (monsterboken part): monsterboken-kins.json"""
    print("Processing monsterboken-kins.json (LR-005)...")
    data = load_json("monsterboken-kins.json")

    # Top-level modifiers section
    if "modifiers" in data:
        for mod_id, mod in data["modifiers"].items():
            strip_desc(mod)

    for kin in data["kins"]:
        remove_keys(kin, ["playable_note", "playable_note_sv"])
        for ability in kin.get("abilities", []):
            strip_desc(ability)

    bump_version(data["_meta"])
    save_json("monsterboken-kins.json", data)


def strip_drakborgen_kins():
    """LR-005 (drakborgen part): drakborgen-kins.json"""
    print("Processing drakborgen-kins.json (LR-005)...")
    data = load_json("drakborgen-kins.json")

    for kin in data["kins"]:
        remove_keys(kin, ["playable_note", "playable_note_sv"])
        for ability in kin.get("abilities", []):
            strip_desc(ability)

    bump_version(data["_meta"])
    save_json("drakborgen-kins.json", data)


def strip_corebook_equipment():
    """LR-006: corebook-equipment.json"""
    print("Processing corebook-equipment.json (LR-006)...")
    data = load_json("corebook-equipment.json")

    eq = data["equipment"]

    # Armor: strip effect/effect_sv (prose descriptions of armor penalties)
    for armor in eq.get("armor", []):
        remove_keys(armor, ["effect", "effect_sv"])

    # Weapon properties: strip description/description_sv
    for prop_name, prop in eq.get("weapon_properties", {}).items():
        strip_desc(prop)

    # Masterwork: strip description/description_sv
    if "masterwork" in eq:
        strip_desc(eq["masterwork"])

    bump_version(data["_meta"])
    save_json("corebook-equipment.json", data)


def strip_corebook_rules():
    """LR-007: corebook-rules.json"""
    print("Processing corebook-rules.json (LR-007)...")
    data = load_json("corebook-rules.json")

    # creation_steps: strip description/description_sv
    # These are short process labels but we strip for consistency
    for step in data.get("creation_steps", []):
        strip_desc(step)

    # attributes section
    attrs = data.get("attributes", {})
    strip_desc(attrs)  # top-level description
    # roll_method notes
    rm = attrs.get("roll_method", {})
    remove_keys(rm, ["notes", "notes_sv"])
    # attribute list descriptions
    for attr in attrs.get("list", []):
        strip_desc(attr)

    # derived_ratings
    dr = data.get("derived_ratings", {})
    # movement
    if "movement" in dr:
        strip_desc(dr["movement"])
    # damage_bonus
    if "damage_bonus" in dr:
        strip_desc(dr["damage_bonus"])
    # hit_points formula description
    if "hit_points" in dr:
        hp_formula = dr["hit_points"].get("formula", {})
        strip_desc(hp_formula)
    # willpower_points formula description
    if "willpower_points" in dr:
        wp_formula = dr["willpower_points"].get("formula", {})
        strip_desc(wp_formula)

    # conditions
    cond = data.get("conditions", {})
    strip_desc(cond)  # top-level description
    rules = cond.get("rules", {})
    remove_keys(rules, ["healing", "healing_sv"])

    # encumbrance
    enc = data.get("encumbrance", {})
    # carrying_capacity description
    if "carrying_capacity" in enc:
        strip_desc(enc["carrying_capacity"])
    remove_keys(
        enc,
        [
            "carrying_capacity_note",
            "carrying_capacity_note_sv",
            "worn_armor_and_helmet",
            "worn_armor_and_helmet_sv",
            "provisions",
            "provisions_sv",
            "torches_lamps",
            "torches_lamps_sv",
            "heavy_items",
            "heavy_items_sv",
            "trinkets",
            "trinkets_sv",
            "coins",
            "coins_sv",
            "overloaded",
            "overloaded_sv",
        ],
    )
    # quiver
    remove_keys(enc, ["quiver", "quiver_sv"])
    # weapons_at_hand note
    if "weapons_at_hand" in enc:
        remove_keys(enc["weapons_at_hand"], ["note", "note_sv"])
    # backpack description
    if "backpack" in enc:
        strip_desc(enc["backpack"])

    # experience
    exp = data.get("experience", {})
    if "improvement_marks" in exp:
        im = exp["improvement_marks"]
        remove_keys(
            im,
            [
                "dragon_roll",
                "dragon_roll_sv",
                "demon_roll",
                "demon_roll_sv",
                "session_questions",
                "session_questions_sv",
                "session_marks_note",
                "session_marks_note_sv",
                "improvement_roll",
                "improvement_roll_sv",
            ],
        )
    remove_keys(
        exp,
        [
            "gaining_heroic_abilities",
            "gaining_heroic_abilities_sv",
            "overcoming_weakness",
            "overcoming_weakness_sv",
        ],
    )

    bump_version(data["_meta"])
    save_json("corebook-rules.json", data)


def strip_corebook_skills():
    """LR-008: corebook-skills.json"""
    print("Processing corebook-skills.json (LR-008)...")
    data = load_json("corebook-skills.json")

    # skill_base_chance section prose
    sbc = data.get("skill_base_chance", {})
    strip_desc(sbc)  # top-level description
    # trained_skill_value description
    if "trained_skill_value" in sbc:
        strip_desc(sbc["trained_skill_value"])
    remove_keys(sbc, ["trained_skill_note", "trained_skill_note_sv"])

    # All skills
    skills = data.get("skills", {})
    for category in ["base_skills", "weapon_skills"]:
        for skill in skills.get(category, []):
            strip_desc(skill)
    # secondary_skills
    for skill in skills.get("secondary_skills", []):
        strip_desc(skill)
    remove_keys(skills, ["secondary_skills_note", "secondary_skills_note_sv"])

    bump_version(data["_meta"])
    save_json("corebook-skills.json", data)


def strip_corebook_professions():
    """LR-009: corebook-professions.json"""
    print("Processing corebook-professions.json (LR-009)...")
    data = load_json("corebook-professions.json")

    for prof in data["professions"]:
        remove_keys(
            prof,
            [
                "heroic_ability_note",
                "heroic_ability_note_sv",
            ],
        )

    bump_version(data["_meta"])
    save_json("corebook-professions.json", data)


def strip_corebook_weaknesses():
    """LR-013 (weaknesses part): corebook-weaknesses.json"""
    print("Processing corebook-weaknesses.json (LR-013)...")
    data = load_json("corebook-weaknesses.json")

    for weakness in data["weaknesses"]["list"]:
        strip_desc(weakness)

    bump_version(data["_meta"])
    save_json("corebook-weaknesses.json", data)


def strip_corebook_appearance():
    """LR-013 (appearance part): corebook-appearance.json"""
    print("Processing corebook-appearance.json (LR-013)...")
    data = load_json("corebook-appearance.json")

    # mementos top-level effect prose
    if "mementos" in data:
        remove_keys(data["mementos"], ["effect", "effect_sv"])

    bump_version(data["_meta"])
    save_json("corebook-appearance.json", data)


def strip_drakborgen_heroic_abilities():
    """LR-014: drakborgen-heroic-abilities.json"""
    print("Processing drakborgen-heroic-abilities.json (LR-014)...")
    data = load_json("drakborgen-heroic-abilities.json")

    for ha in data["heroic_abilities"]:
        strip_desc(ha)
        remove_keys(ha, ["special_note", "special_note_sv"])

    bump_version(data["_meta"])
    save_json("drakborgen-heroic-abilities.json", data)


# ─── Main ──────────────────────────────────────────────────────────────


def main():
    print("=== Prose Stripping Script ===")
    print(f"Data directory: {os.path.abspath(DATA_DIR)}")
    print()

    # Critical priority
    strip_corebook_magic()  # LR-001
    strip_corebook_heroic_abilities()  # LR-002
    strip_brandajorden_magic()  # LR-003
    strip_brandajorden_professions()  # LR-004

    # High priority
    strip_corebook_kins()  # LR-005
    strip_monsterboken_kins()  # LR-005
    strip_drakborgen_kins()  # LR-005
    strip_corebook_equipment()  # LR-006
    strip_corebook_rules()  # LR-007
    strip_corebook_skills()  # LR-008
    strip_corebook_professions()  # LR-009

    # Medium priority
    strip_corebook_weaknesses()  # LR-013
    strip_corebook_appearance()  # LR-013
    strip_drakborgen_heroic_abilities()  # LR-014

    print()
    print("=== Done! All 14 files processed. ===")
    print(
        "Validate JSON with: python3 -c \"import json; [json.load(open(f)) for f in glob.glob('docs/character_creation/*.json')]\""
    )


if __name__ == "__main__":
    main()

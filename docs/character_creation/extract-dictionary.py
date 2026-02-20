#!/usr/bin/env python3
"""
Extract the Dragonbane Dictionary v1.1 PDF into a structured JSON file.
Uses pdfplumber's within_bbox() to correctly handle two-column layouts.

Pages 0-5: Themed/categorized entries (used for category assignment)
Pages 6-11: Swedish→English alphabetical listing (two columns)
Pages 12-17: English→Swedish alphabetical listing (two columns)
"""

import json
import pdfplumber

PDF_PATH = "source_data/Dragonbane_Dictionary_v1.1.pdf"
OUTPUT_PATH = "docs/character_creation/dragonbane-dictionary.json"

# Category assignments for themed pages
PAGE_CATEGORIES = {
    0: "core",
    1: "skills",
    2: "combat",
    3: "magic",
    4: "equipment",  # left column; right column is bestiary
    5: "bestiary",
}

# Page 4 right column is bestiary, not equipment
PAGE4_RIGHT_CATEGORY = "bestiary"


def extract_columns(page):
    """Extract left and right columns from a page using bbox splitting."""
    mid = page.width / 2
    left_crop = page.within_bbox((0, 0, mid, page.height))
    right_crop = page.within_bbox((mid, 0, page.width, page.height))

    left_text = left_crop.extract_text() if left_crop else ""
    right_text = right_crop.extract_text() if right_crop else ""

    left_lines = (
        left_text.strip().split("\n") if left_text and left_text.strip() else []
    )
    right_lines = (
        right_text.strip().split("\n") if right_text and right_text.strip() else []
    )

    return left_lines, right_lines


def parse_entry(line):
    """Parse a 'Swedish : English' line. Returns (sv, en) or None if not a valid entry."""
    if " : " not in line:
        return None

    parts = line.split(" : ", 1)
    sv = parts[0].strip()
    en = parts[1].strip()

    if not sv or not en:
        return None

    return (sv, en)


def extract_themed_entries(pdf):
    """Extract entries from themed pages 0-5 with category assignments."""
    categorized = {}  # sv_lower -> category

    for page_idx in range(6):
        page = pdf.pages[page_idx]
        left_lines, right_lines = extract_columns(page)

        # Determine categories
        if page_idx == 4:
            left_cat = "equipment"
            right_cat = "bestiary"
        else:
            left_cat = PAGE_CATEGORIES[page_idx]
            right_cat = PAGE_CATEGORIES[page_idx]

        for line in left_lines:
            entry = parse_entry(line)
            if entry:
                sv, en = entry
                categorized[sv.lower()] = left_cat

        for line in right_lines:
            entry = parse_entry(line)
            if entry:
                sv, en = entry
                categorized[sv.lower()] = right_cat

    return categorized


def extract_alphabetical_sv_en(pdf):
    """Extract SV→EN entries from pages 6-11."""
    entries = []

    for page_idx in range(6, 12):
        page = pdf.pages[page_idx]
        left_lines, right_lines = extract_columns(page)

        for line in left_lines + right_lines:
            # Skip section headers
            if line.strip() in ("Svensk – Engelsk", "English – Swedish"):
                continue
            # Skip single-letter alphabet markers
            if len(line.strip()) <= 2 and line.strip().isalpha():
                continue

            entry = parse_entry(line)
            if entry:
                entries.append(entry)

    return entries


def extract_alphabetical_en_sv(pdf):
    """Extract EN→SV entries from pages 12-17."""
    entries = []

    for page_idx in range(12, 18):
        page = pdf.pages[page_idx]
        left_lines, right_lines = extract_columns(page)

        for line in left_lines + right_lines:
            # Skip section headers
            if line.strip() in ("Svensk – Engelsk", "English – Swedish"):
                continue
            # Skip single-letter alphabet markers
            if len(line.strip()) <= 2 and line.strip().isalpha():
                continue

            entry = parse_entry(line)
            if entry:
                entries.append(entry)  # (en, sv) — reversed order

    return entries


def main():
    pdf = pdfplumber.open(PDF_PATH)

    # Step 1: Get category assignments from themed pages
    print("Extracting themed pages for category assignments...")
    categorized = extract_themed_entries(pdf)
    print(f"  Found {len(categorized)} categorized terms")

    # Step 2: Extract SV→EN alphabetical entries (authoritative)
    print("Extracting SV→EN alphabetical entries (pages 7-12)...")
    sv_en_entries = extract_alphabetical_sv_en(pdf)
    print(f"  Found {len(sv_en_entries)} SV→EN entries")

    # Step 3: Extract EN→SV alphabetical entries (for cross-validation)
    print("Extracting EN→SV alphabetical entries (pages 13-18)...")
    en_sv_entries = extract_alphabetical_en_sv(pdf)
    print(f"  Found {len(en_sv_entries)} EN→SV entries")

    # Step 4: Build unified entry list from SV→EN (primary source)
    # Use a dict to deduplicate by sv term
    sv_en_map = {}
    for sv, en in sv_en_entries:
        key = sv.lower()
        if key not in sv_en_map:
            sv_en_map[key] = (sv, en)
        # If duplicate, keep first occurrence (they should be identical)

    # Step 5: Build EN→SV map for cross-validation
    en_sv_map = {}
    for en, sv in en_sv_entries:
        key = en.lower()
        if key not in en_sv_map:
            en_sv_map[key] = (en, sv)

    # Step 6: Cross-validate
    print("\nCross-validation:")
    sv_en_set = set(sv_en_map.keys())
    # Build a set of sv terms from the EN→SV section
    en_sv_sv_terms = set()
    for en, sv in en_sv_entries:
        en_sv_sv_terms.add(sv.lower())

    only_in_sv_en = sv_en_set - en_sv_sv_terms
    only_in_en_sv = en_sv_sv_terms - sv_en_set

    if only_in_sv_en:
        print(f"  {len(only_in_sv_en)} terms only in SV→EN section:")
        for t in sorted(only_in_sv_en)[:10]:
            print(f"    {t}")
        if len(only_in_sv_en) > 10:
            print(f"    ... and {len(only_in_sv_en) - 10} more")

    if only_in_en_sv:
        print(f"  {len(only_in_en_sv)} terms only in EN→SV section:")
        for t in sorted(only_in_en_sv)[:10]:
            print(f"    {t}")
        if len(only_in_en_sv) > 10:
            print(f"    ... and {len(only_in_en_sv) - 10} more")

    # Merge: add any EN→SV entries not in SV→EN
    for en, sv in en_sv_entries:
        key = sv.lower()
        if key not in sv_en_map:
            sv_en_map[key] = (sv, en)

    # Step 7: Build final entries with categories
    entries = []
    category_counts = {}

    for key in sorted(sv_en_map.keys()):
        sv, en = sv_en_map[key]
        category = categorized.get(key, "general")
        entries.append({"sv": sv, "en": en, "category": category})
        category_counts[category] = category_counts.get(category, 0) + 1

    # Step 8: Build lookup maps
    sv_to_en = {}
    en_to_sv = {}
    for entry in entries:
        sv_to_en[entry["sv"]] = entry["en"]
        en_to_sv[entry["en"]] = entry["sv"]

    # Step 9: Build final JSON
    result = {
        "_meta": {
            "source": "Dragonbane_Dictionary_v1.1.pdf",
            "purpose": "Official Swedish-English dictionary for Dragonbane (Drakar och Demoner). Provides bidirectional term lookups and categorized entries for programmatic use.",
            "version": "1.1",
            "extracted": "2026-02-20",
            "total_entries": len(entries),
            "categories": dict(sorted(category_counts.items())),
            "usage": {
                "sv_to_en": "Look up Swedish term to get official English translation",
                "en_to_sv": "Look up English term to get official Swedish original",
                "entries": "Full list with category annotations for filtering",
            },
        },
        "entries": entries,
        "sv_to_en": dict(sorted(sv_to_en.items())),
        "en_to_sv": dict(sorted(en_to_sv.items())),
    }

    # Step 10: Write output
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"\nOutput written to {OUTPUT_PATH}")
    print(f"Total entries: {len(entries)}")
    print(f"Categories: {json.dumps(category_counts, indent=2)}")
    print(f"sv_to_en lookups: {len(sv_to_en)}")
    print(f"en_to_sv lookups: {len(en_to_sv)}")

    # Quick validation: spot-check some known terms
    print("\n=== Spot checks ===")
    checks = [
        ("Anka", "Mallard"),
        ("Hantverkare", "Artisan"),
        ("Krigare", "Fighter"),
        ("Svärd (STY)", "Swords (STR)"),
        ("Tålig", "Robust"),
        ("Ynkrygg", "Weasel"),
        ("Skingra", "Magic Shield"),
        ("Kraftstöt", "Mental Strike"),
        ("Flyga", "Flight"),
    ]
    for sv, expected_en in checks:
        actual = sv_to_en.get(sv, "NOT FOUND")
        status = "OK" if actual == expected_en else f"MISMATCH (got: {actual})"
        print(f"  {sv} -> {actual} [{status}]")

    pdf.close()


if __name__ == "__main__":
    main()

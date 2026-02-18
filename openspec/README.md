# OpenSpec for Dragonbane Unbound

This directory contains the OpenSpec structure for spec-driven development of the Dragonbane Unbound platform.

## Project Overview

For comprehensive project information, architecture principles, and capability index, see:
**[docs/MANIFEST.md](../docs/MANIFEST.md)**

## Directory Structure

- **`changes/`**: Active and proposed changes
  - Each change includes: proposal.md, specs/, design.md, tasks.md
  - **`changes/archive/`**: Completed changes (preserved for historical reference)

- **`specs/`**: Source of truth for system requirements
  - Updated after archiving each change
  - Organized by capability area

## Getting Started

To propose a new change:
```bash
/opsx:new <change-name>
```

For a guided introduction to the workflow:
```bash
/opsx:onboard
```

For quick planning and implementation:
```bash
/opsx:ff <change-name>
```

## Documentation

- **MANIFEST.md**: High-level project capabilities and change index
- **OpenSpec Docs**: https://openspec.dev/
- **GitHub**: https://github.com/Fission-AI/OpenSpec

## Workflow

1. **Explore** (`/opsx:explore`) - Investigate and think through problems
2. **New** (`/opsx:new`) - Create a change container
3. **Plan** (`/opsx:ff` or step-by-step) - Define proposal, specs, design, tasks
4. **Apply** (`/opsx:apply`) - Implement the tasks
5. **Verify** (`/opsx:verify`) - Ensure implementation matches specs
6. **Archive** (`/opsx:archive`) - Preserve the completed work

## Commands Reference

| Command | Purpose |
|---------|---------|
| `/opsx:new <name>` | Start a new change |
| `/opsx:ff <name>` | Fast-forward through all planning artifacts |
| `/opsx:continue <name>` | Continue working on an existing change |
| `/opsx:apply <name>` | Implement tasks from a change |
| `/opsx:verify <name>` | Verify implementation matches specs |
| `/opsx:archive <name>` | Archive a completed change |
| `/opsx:explore` | Think through problems without creating changes |

---

For more information about the Dragonbane Unbound project, see [../README.md](../README.md) and [../docs/MANIFEST.md](../docs/MANIFEST.md).

# Dragonbane Unbound - Project Manifest

## Overview
This file provides a high-level index and descriptions for all specification artifacts tracked in the Dragonbane Unbound repository. Dragonbane Unbound is an open-source, local-first platform for running Dragonbane at the speed of play.

## Project Information
- **Project Name:** Dragonbane Unbound
- **Description:** A modular rules engine, character builder, encounter runner, and community content system for Dragonbane RPG
- **License:** MIT
- **Repository:** https://github.com/finger-gun/dragonbane-unbound

## Main Capabilities

### Core Systems (Planned)
- **Rules Engine**: Modular system for implementing Dragonbane game rules
- **Character Builder**: Tool for creating and managing player characters
- **Encounter Runner**: System for managing combat and encounters
- **Community Content**: Platform for sharing and managing community-created content

## Main Artifacts

### `/openspec/changes/`
Stores proposed and active changes. Each change includes:
- `proposal.md`: Rationale, summary, and impact
- `tasks.md`: Implementation checklist
- `specs/`: New or modified requirements/scenarios
- `design.md`: (Optional) Technical deep-dive and decisions

### `/openspec/specs/`
Source of truth for system requirements and capabilities. Updated after each archive.

### `/openspec/archive/`
Completed and historical changes, for long-term reference.

## Changes Index

| Change ID | Description | Owner | Status |
|-----------|-------------|-------|--------|
| (none yet) | Project initialization | - | Complete |

## Specs Index

| Capability | Spec File | Last Updated | Linked Change |
|------------|-----------|--------------|---------------|
| (To be defined as project develops) | - | - | - |

## Architecture Principles

1. **Local-First**: Data and functionality work offline with optional sync
2. **Modular**: Components can be used independently or together
3. **Extensible**: Plugin architecture for community extensions
4. **Self-Hostable**: Can be deployed on personal infrastructure
5. **Open Source**: Full MIT licensing for maximum flexibility

## Target Users
- **Players**: Create and manage characters, track progression
- **Game Masters**: Run sessions, manage encounters, create content
- **Publishers**: Distribute official and third-party content
- **Developers**: Extend and customize the platform

## How to Use This Manifest

- Reference this file to quickly orient yourself in the project's spec history and current work
- Update the index when proposing, merging, or archiving changes
- For details on workflow and file structure, see `README.md` and the OpenSpec documentation

---

_Last updated: 2026-02-18_

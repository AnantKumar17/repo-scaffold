---
description: Analyze repository and generate CLAUDE.md, AGENTS.md, and project-specific skills
---

Analyze this repository and generate optimized Claude Code context files.

Follow the complete instructions in the scaffold skill located at `skills/scaffold/SKILL.md` within this plugin.

Quick summary of what this command does:
1. Analyzes the repository structure, tech stack, and conventions
2. Generates `CLAUDE.md` with project documentation
3. Generates `AGENTS.md` with specialized subagent definitions
4. Generates project-specific skills in `.claude/skills/`

Arguments (optional):
- `--dry-run` - Preview what would be generated without writing files
- `--force` - Regenerate everything with confirmation
- `--skills-only` - Only generate skills
- `--claude-md-only` - Only generate CLAUDE.md
- `--agents-md-only` - Only generate AGENTS.md

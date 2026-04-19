#!/usr/bin/env node

/**
 * SessionStart hook for RepoScaffold
 *
 * Called by Claude Code on session start.
 * Checks if CLAUDE.md is missing and outputs a context injection message.
 */

import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const cwd = process.cwd();
const hasClaudeMd = existsSync(join(cwd, 'CLAUDE.md'));
const skillsPath = join(cwd, '.claude', 'skills');
const hasSkillsDir = existsSync(skillsPath);

// Only output a message if CLAUDE.md is missing
if (!hasClaudeMd) {
  let msg;

  if (hasSkillsDir) {
    // Skills exist but no CLAUDE.md
    try {
      const skillCount = readdirSync(skillsPath).filter(f => {
        try {
          return existsSync(join(skillsPath, f, 'SKILL.md'));
        } catch {
          return false;
        }
      }).length;

      msg = `Note: CLAUDE.md is missing from this project. Run /scaffold to generate project context and documentation. Skills directory exists with ${skillCount} skill(s).`;
    } catch {
      msg = 'Note: CLAUDE.md is missing from this project. Run /scaffold to generate project context and documentation. Skills directory exists.';
    }
  } else {
    // Neither CLAUDE.md nor skills exist
    msg = 'Note: CLAUDE.md and .claude/skills/ are both missing. Run /scaffold to analyze this repository and generate optimized Claude Code context files.';
  }

  // Output structured message for Claude Code to inject into context
  process.stdout.write(JSON.stringify({ type: 'context', content: msg }));
}

// If CLAUDE.md exists, output nothing — don't add noise to every session

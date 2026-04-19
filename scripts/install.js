#!/usr/bin/env node

/**
 * RepoScaffold Installer
 *
 * Installs the RepoScaffold plugin to ~/.claude/plugins/cache/local/repo-scaffold/1.0.0/
 * and configures the SessionStart hook in ~/.claude/settings.json
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync, rmSync, symlinkSync, unlinkSync, lstatSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PLUGIN_NAME = 'repo-scaffold';
const PLUGIN_VERSION = '1.0.0';
const PLUGIN_ID = 'repo-scaffold@local';
const CLAUDE_DIR = join(homedir(), '.claude');
const PLUGINS_DIR = join(CLAUDE_DIR, 'plugins');
// Local plugins must live under cache/local/<name>/<version>/ to match Claude Code's expected layout
const PLUGIN_TARGET = join(PLUGINS_DIR, 'cache', 'local', PLUGIN_NAME, PLUGIN_VERSION);
const SETTINGS_FILE = join(CLAUDE_DIR, 'settings.json');
const INSTALLED_PLUGINS_FILE = join(PLUGINS_DIR, 'installed_plugins.json');
// The command symlink: ~/.claude/commands/scaffold.md -> SKILL.md (full implementation)
const COMMANDS_DIR = join(CLAUDE_DIR, 'commands');
const SKILL_LINK_SRC = join(COMMANDS_DIR, 'scaffold.md');
const SKILL_LINK_TARGET = join(PLUGIN_TARGET, 'skills', 'scaffold', 'SKILL.md');
// The agent symlink: ~/.claude/agents/repo-analyzer.md -> agents/repo-analyzer.md
const AGENTS_DIR = join(CLAUDE_DIR, 'agents');
const AGENT_LINK_SRC = join(AGENTS_DIR, 'repo-analyzer.md');
const AGENT_LINK_TARGET = join(PLUGIN_TARGET, 'agents', 'repo-analyzer.md');
const SOURCE_DIR = join(__dirname, '..');

// Check for --uninstall flag
const isUninstall = process.argv.includes('--uninstall');

/**
 * Uninstall the plugin
 */
function uninstall() {
  console.log('  Uninstalling RepoScaffold...\n');

  // Remove plugin directory
  if (existsSync(PLUGIN_TARGET)) {
    rmSync(PLUGIN_TARGET, { recursive: true, force: true });
    console.log(`OK Removed ${PLUGIN_TARGET}`);
  } else {
    console.log(`[WARN]  Plugin directory not found: ${PLUGIN_TARGET}`);
  }

  // Remove from enabledPlugins in settings.json
  if (existsSync(SETTINGS_FILE)) {
    try {
      const settings = JSON.parse(readFileSync(SETTINGS_FILE, 'utf-8'));

      // Remove from enabledPlugins
      if (settings.enabledPlugins && settings.enabledPlugins[PLUGIN_ID]) {
        delete settings.enabledPlugins[PLUGIN_ID];
        console.log(`OK Removed from enabledPlugins in ${SETTINGS_FILE}`);
      }

      // Remove hook from SessionStart
      if (settings.hooks && settings.hooks.SessionStart) {
        settings.hooks.SessionStart = settings.hooks.SessionStart.filter(hookGroup => {
          if (!hookGroup.hooks) return true;
          return !hookGroup.hooks.some(h =>
            h.command && h.command.includes('repo-scaffold')
          );
        });

        // Clean up empty SessionStart array
        if (settings.hooks.SessionStart.length === 0) {
          delete settings.hooks.SessionStart;
        }

        // Clean up empty hooks object
        if (Object.keys(settings.hooks).length === 0) {
          delete settings.hooks;
        }
      }

      writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      console.log(`OK Updated ${SETTINGS_FILE}`);
    } catch (err) {
      console.error(`[WARN]  Error updating settings.json: ${err.message}`);
    }
  }

  // Remove from installed_plugins.json
  if (existsSync(INSTALLED_PLUGINS_FILE)) {
    try {
      const installedPlugins = JSON.parse(readFileSync(INSTALLED_PLUGINS_FILE, 'utf-8'));

      if (installedPlugins.plugins && installedPlugins.plugins[PLUGIN_ID]) {
        delete installedPlugins.plugins[PLUGIN_ID];
        writeFileSync(INSTALLED_PLUGINS_FILE, JSON.stringify(installedPlugins, null, 2));
        console.log(`OK Removed from ${INSTALLED_PLUGINS_FILE}`);
      }
    } catch (err) {
      console.error(`[WARN]  Error updating installed_plugins.json: ${err.message}`);
    }
  }

  // Remove command symlink
  try { lstatSync(SKILL_LINK_SRC); unlinkSync(SKILL_LINK_SRC); console.log(`OK Removed command symlink ${SKILL_LINK_SRC}`); } catch {}

  // Remove agent symlink
  try { lstatSync(AGENT_LINK_SRC); unlinkSync(AGENT_LINK_SRC); console.log(`OK Removed agent symlink ${AGENT_LINK_SRC}`); } catch {}

  console.log('\n[OK] RepoScaffold uninstalled successfully!');
  process.exit(0);
}

/**
 * Install the plugin
 */
function install() {
  console.log(' Installing RepoScaffold plugin for Claude Code...\n');

  // Verify Claude Code is installed
  if (!existsSync(CLAUDE_DIR)) {
    console.error('[FAIL] Error: ~/.claude directory not found.');
    console.error('   Make sure Claude Code is installed and has been run at least once.');
    process.exit(1);
  }

  // Create plugins directory if it doesn't exist
  if (!existsSync(PLUGINS_DIR)) {
    mkdirSync(PLUGINS_DIR, { recursive: true });
    console.log(`OK Created ${PLUGINS_DIR}`);
  }

  // Copy plugin files
  try {
    if (existsSync(PLUGIN_TARGET)) {
      console.log(`[WARN]  Plugin already exists at ${PLUGIN_TARGET}`);
      console.log('   Overwriting with new version...');
    }

    cpSync(SOURCE_DIR, PLUGIN_TARGET, {
      recursive: true,
      filter: (src) => {
        // Exclude node_modules, .git, test files
        const exclude = ['node_modules', '.git', 'test', '.DS_Store'];
        return !exclude.some(ex => src.includes(ex));
      }
    });

    console.log(`OK Copied plugin files to ${PLUGIN_TARGET}`);
  } catch (err) {
    console.error(`[FAIL] Error copying files: ${err.message}`);
    process.exit(1);
  }

  // Create command symlink: ~/.claude/commands/scaffold.md -> skills/scaffold/SKILL.md
  // Claude Code auto-discovers commands from ~/.claude/commands/ for local plugins.
  // We symlink to SKILL.md (not commands/scaffold.md) because SKILL.md contains the
  // full implementation; the commands/scaffold.md file is only a pointer.
  try {
    if (!existsSync(COMMANDS_DIR)) {
      mkdirSync(COMMANDS_DIR, { recursive: true });
    }
    if (existsSync(SKILL_LINK_SRC)) {
      unlinkSync(SKILL_LINK_SRC);
    }
    symlinkSync(SKILL_LINK_TARGET, SKILL_LINK_SRC);
    console.log(`OK Created command symlink: ${SKILL_LINK_SRC}`);
  } catch (err) {
    console.error(`[WARN]  Could not create command symlink: ${err.message}`);
  }

  // Create agent symlink: ~/.claude/agents/repo-analyzer.md -> agents/repo-analyzer.md
  // Claude Code discovers subagents from ~/.claude/agents/ — local plugins need this symlink.
  try {
    if (!existsSync(AGENTS_DIR)) {
      mkdirSync(AGENTS_DIR, { recursive: true });
    }
    if (existsSync(AGENT_LINK_SRC)) {
      unlinkSync(AGENT_LINK_SRC);
    }
    symlinkSync(AGENT_LINK_TARGET, AGENT_LINK_SRC);
    console.log(`OK Created agent symlink: ${AGENT_LINK_SRC}`);
  } catch (err) {
    console.error(`[WARN]  Could not create agent symlink: ${err.message}`);
  }

  // Configure settings.json
  try {
    let settings = {};

    if (existsSync(SETTINGS_FILE)) {
      const content = readFileSync(SETTINGS_FILE, 'utf-8');
      settings = JSON.parse(content);
      console.log(`OK Read existing ${SETTINGS_FILE}`);
    } else {
      console.log(`OK Creating new ${SETTINGS_FILE}`);
    }

    // Initialize enabledPlugins
    if (!settings.enabledPlugins) {
      settings.enabledPlugins = {};
    }

    // Add to enabledPlugins
    settings.enabledPlugins[PLUGIN_ID] = true;
    console.log(`OK Added to enabledPlugins: ${PLUGIN_ID}`);

    // Initialize hooks structure if needed
    if (!settings.hooks) {
      settings.hooks = {};
    }

    if (!settings.hooks.SessionStart) {
      settings.hooks.SessionStart = [];
    }

    // Check if hook already exists
    const hookExists = settings.hooks.SessionStart.some(hookGroup =>
      hookGroup.hooks && hookGroup.hooks.some(h =>
        h.command && h.command.includes('repo-scaffold')
      )
    );

    if (!hookExists) {
      // Add the SessionStart hook
      settings.hooks.SessionStart.push({
        matcher: '',
        hooks: [
          {
            type: 'command',
            command: `node ${PLUGIN_TARGET}/scripts/check-scaffold.js`
          }
        ]
      });
      console.log(`OK Added SessionStart hook`);
    } else {
      console.log(`OK SessionStart hook already configured`);
    }

    writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    console.log(`OK Updated ${SETTINGS_FILE}`);
  } catch (err) {
    console.error(`[FAIL] Error updating settings.json: ${err.message}`);
    console.error('   You may need to manually add the plugin configuration.');
    process.exit(1);
  }

  // Register in installed_plugins.json
  try {
    let installedPlugins = { version: 2, plugins: {} };

    if (existsSync(INSTALLED_PLUGINS_FILE)) {
      const content = readFileSync(INSTALLED_PLUGINS_FILE, 'utf-8');
      installedPlugins = JSON.parse(content);
    }

    if (!installedPlugins.plugins) {
      installedPlugins.plugins = {};
    }

    // Add plugin entry
    const now = new Date().toISOString();
    installedPlugins.plugins[PLUGIN_ID] = [{
      scope: 'user',
      installPath: PLUGIN_TARGET,
      version: '1.0.0',
      installedAt: now,
      lastUpdated: now
    }];

    writeFileSync(INSTALLED_PLUGINS_FILE, JSON.stringify(installedPlugins, null, 2));
    console.log(`OK Registered in ${INSTALLED_PLUGINS_FILE}`);
  } catch (err) {
    console.error(`[WARN]  Error updating installed_plugins.json: ${err.message}`);
    console.error('   Plugin may still work, but might not appear in plugin list.');
  }

  // Success message
  console.log('\n[OK] Installation complete!\n');
  console.log('Usage:');
  console.log('  Open any repository in Claude Code and run: /scaffold');
  console.log('  Or it will prompt automatically when CLAUDE.md is missing.\n');
  console.log('Uninstall:');
  console.log(`  node ${PLUGIN_TARGET}/scripts/install.js --uninstall\n`);
}

// Main
if (isUninstall) {
  uninstall();
} else {
  install();
}

# RepoScaffold: Intelligent CLAUDE.md & Skills Generator

**RepoScaffold** is a Claude Code plugin that analyzes your repository and automatically generates:

1. **`CLAUDE.md`** — Tailored documentation for Claude Code with your project's structure, conventions, and tech stack
2. **`AGENTS.md`** — Specialized subagent definitions for complex tasks
3. **Project-specific skills** — Custom slash commands that make Claude smarter for your codebase

## Why Use RepoScaffold?

Without RepoScaffold, Claude Code has to re-learn your project every session. This plugin does one deep analysis and creates persistent context files that dramatically improve every future session.

---

## Quick Start

### 1. Installation

```bash
cd /path/to/repo-scaffold
./install.sh
```

Or manually:

```bash
node scripts/install.js
```

**What this does:**
- Copies plugin to `~/.claude/plugins/cache/local/repo-scaffold/1.0.0/`
- Creates `~/.claude/commands/scaffold.md` symlink (makes `/scaffold` discoverable)
- Creates `~/.claude/agents/repo-analyzer.md` symlink (makes `repo-analyzer` subagent discoverable)
- Registers plugin in `~/.claude/settings.json` (enabledPlugins)
- Registers plugin in `~/.claude/plugins/installed_plugins.json`
- Configures SessionStart hook to auto-prompt when CLAUDE.md is missing

### 2. Verify Installation

Check that the plugin is enabled:

```bash
cat ~/.claude/settings.json | grep -A 2 "enabledPlugins"
```

You should see:
```json
"enabledPlugins": {
  "repo-scaffold@local": true
}
```

### 3. Use in Your Project

Open any repository in Claude Code and run:

```bash
/scaffold
```

The plugin will:
1. Analyze your codebase structure
2. Detect tech stack, frameworks, and tools
3. Generate `CLAUDE.md` with project documentation
4. Generate `AGENTS.md` with specialized subagents
5. Generate project-specific skills in `.claude/skills/`

### 4. Available Commands

- `/scaffold` — Full analysis and generation (CLAUDE.md + AGENTS.md + skills)
- `/scaffold --dry-run` — Preview what would be generated
- `/scaffold --force` — Regenerate everything (with confirmation)
- `/scaffold --skills-only` — Only generate skills
- `/scaffold --claude-md-only` — Only generate CLAUDE.md
- `/scaffold --agents-md-only` — Only generate AGENTS.md

---

## What Gets Generated

### CLAUDE.md
Complete project documentation for Claude Code including:
- Project overview and architecture
- Tech stack and dependencies  
- Development commands (build, test, run)
- Code conventions (naming, imports, error handling)
- Environment variables
- CI/CD pipeline information
- **Claude-specific instructions** (always/never/caution rules)

**Purpose**: Provides persistent context that Claude Code loads automatically, so it understands your project from the first message.

### AGENTS.md
Specialized subagent definitions for complex tasks:
- **@api-designer** — Design new API endpoints
- **@code-reviewer** — Review code against project standards
- **@troubleshooter** — Debug production issues
- **@db-optimizer** — Optimize database queries
- **@test-architect** — Design comprehensive test strategies
- **@security-auditor** — Audit code for vulnerabilities
- **@doc-writer** — Write technical documentation
- **@refactoring-specialist** — Plan and execute refactoring
- **@deployment-engineer** — Manage CI/CD and deployments

**Purpose**: Invoke specialized agents with `@agent-name` for domain-specific expertise.

### Skills (Generated in `.claude/skills/`)

Skills are **conditionally generated** based on what's detected in your repository:

**Always Generated:**
- **code-reviewer** — Review code against project conventions (every project benefits)

**Conditionally Generated** (when the relevant tool/pattern is detected):
- **test-writer** — Write tests matching your project's patterns (if test files/framework detected)
- **ci-workflow-helper** — Work with CI/CD pipelines (if CI config detected)
- **db-migration-helper** — Guide database schema changes (if ORM detected)
- **observability** — Add metrics, logging, tracing (if Prometheus/APM detected)
- **security-scanner** — Run security scans and fix vulnerabilities (if gosec/snyk detected)
- **component-generator** — Scaffold React/Vue/Svelte components (if frontend detected)
- **api-route-generator** — Create API routes with validation (if backend API detected)
- **api-doc-generator** — Generate OpenAPI/Swagger docs (if API docs present)
- **perf-tester** — Create load tests and benchmarks (if k6/vegeta detected)
- **dockerfile-optimizer** — Optimize Docker images (if Dockerfile present)
- **changelog-updater** — Update CHANGELOG.md (if changelog present)
- **doc-writer** — Write docs in your project's style (if docs/ exists)

**Example**: A Go API project with GORM, Prometheus, Jenkins, and Dockerfile would generate ~8-9 skills covering development, testing, observability, CI/CD, and deployment.

---

---

## Testing the Installation

After installation, test with a sample project:

```bash
# 1. Navigate to any git repository
cd /path/to/your/project

# 2. Start Claude Code CLI
claude

# 3. Run the scaffold command
/scaffold

# 4. Verify files were created
ls -la CLAUDE.md AGENTS.md .claude/skills/
```

**Expected output:**
- `CLAUDE.md` created with project documentation
- `AGENTS.md` created with subagent definitions  
- `.claude/skills/` directory with 3-10 skills (depending on your project)

---

## Troubleshooting

### Plugin not recognized (`/scaffold` command not found)

**Check 1**: Verify plugin is enabled
```bash
cat ~/.claude/settings.json | grep -A 2 "enabledPlugins"
```

Should show:
```json
"enabledPlugins": {
  "repo-scaffold@local": true
}
```

**Check 2**: Verify plugin is installed
```bash
ls -la ~/.claude/plugins/cache/local/repo-scaffold/1.0.0/
```

**Check 3**: Verify plugin is registered
```bash
cat ~/.claude/plugins/installed_plugins.json | grep repo-scaffold
```

**Check 4**: Verify command and agent symlinks exist
```bash
ls -la ~/.claude/commands/scaffold.md ~/.claude/agents/repo-analyzer.md
```

**Fix**: Re-run installation
```bash
cd /path/to/repo-scaffold
node scripts/install.js --uninstall
node scripts/install.js
```

### SessionStart hook not triggering

Check hook configuration:
```bash
cat ~/.claude/settings.json | grep -A 10 "SessionStart"
```

Should include:
```json
"SessionStart": [{
  "matcher": "",
  "hooks": [{
    "type": "command",
    "command": "node /path/to/plugins/repo-scaffold/scripts/check-scaffold.js"
  }]
}]
```

---

---

## Advanced Configuration

### Global Config: `~/.claude/repo-scaffold-config.json`
```json
{
  "auto_prompt_on_missing": true,
  "default_mode": "full",
  "skills_always_generate": ["code-reviewer"],
  "max_files_to_sample": 20
}
```

### Per-Project Config: `.repo-scaffold.json`
```json
{
  "skip_skills": ["dockerfile-optimizer"],
  "extra_context": "Custom instructions for the analyzer",
  "protected_files": ["CLAUDE.md"]
}
```

---

## Re-running on an Existing Project

Running `/scaffold` on a project that already has `CLAUDE.md`, `AGENTS.md`, or skills is safe — it never blindly overwrites anything. The behavior depends on what exists:

| Existing State | What `/scaffold` Does |
|---|---|
| Nothing exists | Full generation — CLAUDE.md + AGENTS.md + skills |
| Skills exist, no CLAUDE.md | Generates CLAUDE.md, adds any new skills (skips duplicates) |
| CLAUDE.md exists, no skills | Offers merge or regenerate for CLAUDE.md, generates skills |
| Everything exists | Drift detection — checks for new deps/frameworks since last run |

### Drift Detection

When everything exists, `/scaffold` runs a drift analysis and prompts you with options:

```
Your project already has CLAUDE.md, AGENTS.md, and 5 skills generated today.
I detected GORM (ORM) and Prometheus metrics that could benefit from additional skills.

What would you like to do?
  → Show drift report only
  → Add missing skills only
  → Full regeneration (CLAUDE.md + AGENTS.md + all skills)
  → Cancel
```

Choosing **"Show drift report only"** prints a detailed report:
- Which files exist and their current state
- Detected technologies and frameworks
- Skills that could be added based on new detections
- Whether any git drift has occurred since last scaffold

### Key Safety Rules

- **Never overwrites without asking** — if files already exist with scaffold markers, you're always prompted
- **Respects user-edited files** — if CLAUDE.md has no scaffold marker (you wrote it yourself), scaffold offers merge rather than replace
- **Idempotent skill generation** — re-running won't create duplicate skills
- **`--force` bypasses prompts** — use it when you want a full refresh with confirmation but no interactive menu

---

## Uninstallation

```bash
node ~/.claude/plugins/cache/local/repo-scaffold/1.0.0/scripts/install.js --uninstall
```

Or from the source directory:
```bash
cd /path/to/repo-scaffold && node scripts/install.js --uninstall
```

This will:
- Remove plugin from `~/.claude/plugins/cache/local/repo-scaffold/1.0.0/`
- Remove `~/.claude/commands/scaffold.md` symlink
- Remove `~/.claude/agents/repo-analyzer.md` symlink
- Remove from `enabledPlugins` in settings.json
- Remove SessionStart hook
- Remove from installed_plugins.json

---

## Requirements

- Claude Code (CLI or VS Code extension)
- Node.js 18+
- Git repository (recommended)

## License

MIT

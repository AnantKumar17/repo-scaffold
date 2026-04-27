# Contributing to RepoScaffold

👋 Want to contribute to RepoScaffold?

This Claude Code plugin generates intelligent CLAUDE.md files and project-specific skills. We welcome contributions that improve analysis accuracy, skill generation, or developer experience.

## How to Contribute

### 1. Bug Reports & Feature Requests
- Check existing [issues](https://github.com/AnantKumar17/repo-scaffold/issues) first
- For bugs: include your project structure, generated files, and error logs
- For features: explain what detection/generation is missing and why it's useful

### 2. Code Contributions

**We accept:**
- Small, focused patches that are easy to review manually
- Prompts you used to generate LLM-based changes (with evidence of manual testing)
- New skill templates for detected tools/frameworks
- New detection patterns for tech stacks
- Documentation improvements

**Please avoid:**
- Large, unreviewed LLM-generated patches
- Changes without testing on real repositories
- Breaking changes to existing generated files format

### 3. Testing Requirements

All contributions must include evidence of testing:
- Test on at least 3 real repositories (different tech stacks)
- Show generated CLAUDE.md output
- Verify skills work in Claude Code
- Test drift detection if applicable

## Development Setup

### Prerequisites
- Node.js 18+
- Claude Code CLI or desktop app
- Git repository for testing

### Installation for Development

```bash
git clone https://github.com/AnantKumar17/repo-scaffold.git
cd repo-scaffold

# Install the plugin
./install.sh

# Or manually
node scripts/install.js

# Your changes in the repo will be used when you run /scaffold
```

### Testing Your Changes

```bash
# 1. Make changes to plugin code

# 2. Reinstall to pick up changes
node scripts/install.js --uninstall
node scripts/install.js

# 3. Test on a sample repository
cd /path/to/test-repo
# Open Claude Code
/scaffold

# 4. Verify generated files
cat CLAUDE.md AGENTS.md
ls .claude/skills/

# 5. Test drift detection (run /scaffold again)
/scaffold
```

### Test Repositories

Good test cases:
- **Go API**: Go + Gin/Echo + GORM + Prometheus
- **React frontend**: React + TypeScript + Vite + Tailwind
- **Python backend**: Python + FastAPI + SQLAlchemy + Redis
- **Fullstack**: Next.js + tRPC + Prisma
- **Infrastructure**: Terraform + Kubernetes YAML

## Contribution Guidelines

### Code Style
- **JavaScript/Node.js**: Use ES6+, async/await
- Keep functions focused and well-named
- Add JSDoc comments for exported functions
- No unnecessary dependencies

### Commit Messages
- Use present tense ("Add GORM detection" not "Added GORM detection")
- Keep first line under 70 characters
- Reference issue numbers when applicable

### Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/detection-name`
3. Make your changes with clear commits
4. Test on real repositories (see Testing Requirements)
5. Update documentation if needed
6. Submit PR with:
   - Clear description of what's detected/generated now
   - Before/after examples of generated files
   - Evidence of testing (screenshots, file contents)
   - If LLM-generated: include the prompts used

### What to Include in Your PR

- **Description**: What tool/framework is now detected? What skill is generated?
- **Detection logic**: Show the file patterns or dependency names used
- **Generated output**: Include sample CLAUDE.md or skill file
- **Testing evidence**: Show output from 2-3 test repositories
- **Edge cases**: When should this NOT be generated?

## Areas We Need Help With

Check the [issues page](https://github.com/AnantKumar17/repo-scaffold/issues) for backlog. High-priority areas:

### Detection Improvements
- Better monorepo support (detect multiple tech stacks)
- Mobile frameworks (React Native, Flutter, SwiftUI)
- Cloud platforms (AWS CDK, Pulumi, Serverless Framework)
- Testing frameworks (Playwright, Cypress, Selenium)
- Database tools (migrations, seeders, query builders)

### Skill Templates
- **api-versioning** — Manage API versions and deprecation
- **schema-validator** — Validate API schemas (JSON Schema, Zod)
- **error-handler** — Add structured error handling
- **feature-flag** — Add feature flags (LaunchDarkly, Split)
- **rate-limiter** — Add rate limiting to APIs
- **cache-optimizer** — Add caching strategies

### CLAUDE.md Quality
- Better convention detection (naming, imports, error handling)
- More specific "always/never/caution" rules
- Better environment variable detection
- Improved architecture descriptions

### Drift Detection
- Detect when dependencies added (package.json, go.mod, requirements.txt changes)
- Suggest skill removals when tools removed
- Better date-based staleness checking

## Adding New Skill Templates

When adding a new skill template:

1. **Detection**: What files/dependencies trigger this skill?
   ```javascript
   // Example: Detect Prisma ORM
   const hasPrisma = hasFile('prisma/schema.prisma') || 
                     hasDependency('prisma') ||
                     hasDependency('@prisma/client');
   ```

2. **Skill file**: Create template in `templates/skills/`
   ```markdown
   ---
   name: prisma-migration-helper
   description: Guide database schema changes using Prisma
   trigger: When user mentions migrations, schema changes, or Prisma
   ---
   # Task
   Guide the user through Prisma database migrations...
   ```

3. **Test**: Verify skill works in Claude Code
   - Run `/scaffold` on a Prisma project
   - Verify skill generated in `.claude/skills/`
   - Test the skill with relevant prompts

4. **Document**: Update README.md skills table

## Questions?

- Open an issue for discussion before starting major work
- For quick questions, comment on related issues
- Be respectful and constructive

## License

By contributing, you agree that your contributions will be licensed under the MIT License that covers this project.

---

**Note for AI-assisted development**: If you use LLM tools to generate code:
1. Review and understand all generated code before submitting
2. Test on real repositories — AI can generate plausible but incorrect detection logic
3. Mention AI assistance in your PR description
4. Include the prompts you used for transparency
5. Manually verify generated CLAUDE.md and skills are accurate

**Remember**: This tool generates context for Claude Code. Make sure your contributions maintain high-quality, accurate generation.

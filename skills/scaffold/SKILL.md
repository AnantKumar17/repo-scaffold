---
name: scaffold
description: >
  Analyzes this repository and generates an optimized CLAUDE.md and project-specific
  Claude Code skills. Auto-invoke when CLAUDE.md is missing, when asked to "scaffold",
  "initialize claude context", "set up claude", or "generate claude files".
user-invocable: true
argument-hint: "[--skills-only | --claude-md-only | --agents-md-only | --dry-run | --force]"
---

# Scaffold Skill

## Overview

When invoked, perform a complete repository analysis and generate CLAUDE.md and skills.
Follow these steps exactly and in order.

## Step 1: Parse Arguments and Check Current State

### Parse Mode Flags

Check the arguments for flags:
- `--dry-run`: Preview mode, don't write files
- `--force`: Regenerate everything, skip confirmations
- `--skills-only`: Only generate skills (skip CLAUDE.md and AGENTS.md)
- `--claude-md-only`: Only generate CLAUDE.md (skip skills and AGENTS.md)
- `--agents-md-only`: Only generate AGENTS.md (skip CLAUDE.md and skills)
- `--package <name>`: Monorepo mode, target specific package

If no flag is specified, perform a full generation (CLAUDE.md + AGENTS.md + skills).

Store the mode for later steps.

### Check Current State

Run these checks:

1. Check if `CLAUDE.md` exists:
   ```bash
   test -f CLAUDE.md && echo "EXISTS" || echo "MISSING"
   ```

2. Check if `.claude/skills/` directory exists:
   ```bash
   test -d .claude/skills && echo "EXISTS" || echo "MISSING"
   ```

3. If `CLAUDE.md` exists, read its first line to check for the scaffold marker:
   ```bash
   head -1 CLAUDE.md
   ```

4. If `.claude/skills/` exists, list all skill directories:
   ```bash
   ls -1 .claude/skills/ 2>/dev/null || echo "NONE"
   ```

5. Check for monorepo structure:
   ```bash
   ls -1 {turbo.json,nx.json,lerna.json,pnpm-workspace.yaml} 2>/dev/null | head -1
   ```

Store these results as your "current state".

## Step 2: Reconnaissance

Gather comprehensive repository data. Use Read, Glob, and Bash tools.

### A. Configuration Files

Read full content if found (use Read tool):

- `package.json` / `pyproject.toml` / `Cargo.toml` / `go.mod` / `pom.xml` / `build.gradle`
- `tsconfig.json` / `jsconfig.json`
- `.eslintrc*` / `.prettierrc*` / `ruff.toml` / `.rubocop.yml` / `golangci.yml`
- `next.config.*` / `vite.config.*` / `webpack.config.*` / `nuxt.config.*`
- `docker-compose.yml` / `Dockerfile`
- `.env.example` / `.env.template`
- `turbo.json` / `nx.json` / `lerna.json` / `pnpm-workspace.yaml` (for monorepos)

### B. Documentation

Read up to 5000 chars each:

- `README.md` (first 5000 chars)
- `CONTRIBUTING.md` (full if exists)
- `ARCHITECTURE.md` (full if exists)
- Existing `CLAUDE.md` (FULL content if exists — critical for merge)

List structure only:
- `docs/` directory listing

### C. Source Structure

1. Top-level directory listing:
   ```bash
   ls -la
   ```

2. Source directories (read structure):
   ```bash
   find src lib app packages -type f -name "*.{js,ts,py,go,rs,java}" 2>/dev/null | head -50
   ```

3. Sample source files (read first 80 lines of 3-5 files):
   - Pick representative files from main source directory
   - Use Read tool with limit parameter

4. Sample test files (read first 60 lines of 2-3 files):
   - Find test files in `__tests__/`, `tests/`, `test/`, `spec/`
   - Read to understand test patterns

### D. CI/CD Configuration

- `.github/workflows/*.yml` (list files, read 1-2 main workflows)
- `.gitlab-ci.yml`
- `Jenkinsfile`
- `.circleci/config.yml`
- `azure-pipelines.yml`

### E. Observability Detection

Check for metrics/monitoring setup:
```bash
# Check for Prometheus metrics endpoint
grep -r "/metrics" --include="*.{js,ts,go,py,java}" -n | head -10

# Check for observability libraries
grep -E "prometheus|datadog|newrelic|opentelemetry|elastic-apm" package.json requirements.txt go.mod build.gradle Cargo.toml 2>/dev/null

# Check logging libraries
grep -E "winston|pino|zap|logrus|log4j" package.json requirements.txt go.mod 2>/dev/null

# Check for tracing
grep -E "jaeger|zipkin|opentelemetry" package.json requirements.txt go.mod 2>/dev/null
```

### F. Security Tools Detection

Check for security scanning tools:
```bash
# SAST tools
grep -E "gosec|bandit|semgrep|sonarqube|eslint-plugin-security" package.json requirements.txt Makefile .github/workflows/*.yml 2>/dev/null

# Dependency scanning
grep -E "snyk|dependabot|trivy|safety" package.json requirements.txt .github/workflows/*.yml 2>/dev/null

# Secret scanning
grep -E "gitleaks|trufflehog|detect-secrets" .pre-commit-config.yaml .github/workflows/*.yml Makefile 2>/dev/null

# Container scanning
grep -E "trivy|clair|anchore" Dockerfile .github/workflows/*.yml 2>/dev/null
```

### G. API Documentation Detection

Check for API documentation setup:
```bash
# OpenAPI/Swagger files
find . -name "openapi.yaml" -o -name "swagger.json" -o -name "api-spec.yaml" 2>/dev/null

# API documentation directories
ls -la docs/api/ api/ 2>/dev/null

# Swagger annotations
grep -r "@swagger" --include="*.{js,ts,go,py,java}" | head -5

# OpenAPI annotations
grep -r "@openapi\|openapi\." --include="*.{js,ts,py}" | head -5
```

### H. Performance Testing Detection

Check for performance/load testing tools:
```bash
# Load testing tools
grep -E "k6|vegeta|locust|jmeter|artillery" package.json requirements.txt go.mod 2>/dev/null

# Performance test files
find . -name "*.perf.ts" -o -name "*.perf.js" -o -name "*_bench_test.go" -o -name "*.bench.js" 2>/dev/null

# Benchmark scripts
grep "benchmark\|load-test\|perf-test" package.json Makefile 2>/dev/null
```

### I. Existing Claude Files

Read FULL content if they exist (critical for merge logic):

- `CLAUDE.md`
- `AGENTS.md`
- `AGENTS.md`
- `.claude/skills/*/SKILL.md` (all of them)
- `.claude/settings.json`

### J. Git Context

```bash
git log --oneline -10
git branch --show-current
git remote get-url origin 2>/dev/null || echo "no remote"
```

### K. Check for .repo-scaffold.json Config

```bash
test -f .repo-scaffold.json && cat .repo-scaffold.json || echo "NO_CONFIG"
```

### L. Package Manager Detection

```bash
if [ -f "pnpm-lock.yaml" ]; then echo "pnpm"
elif [ -f "yarn.lock" ]; then echo "yarn"
elif [ -f "package-lock.json" ]; then echo "npm"
elif [ -f "Cargo.lock" ]; then echo "cargo"
elif [ -f "poetry.lock" ]; then echo "poetry"
elif [ -f "Pipfile.lock" ]; then echo "pipenv"
elif [ -f "go.sum" ]; then echo "go"
else echo "unknown"; fi
```

## Step 3: Analyze with Subagent

Now pass all gathered data to the `repo-analyzer` subagent.

Format the prompt as:

```
Analyze this repository and produce a JSON analysis.

## Project Files

### package.json (or equivalent)
[content]

### README.md
[content]

### tsconfig.json (if present)
[content]

### Source Structure
[directory tree]

### Sample Source Files

#### File: src/index.ts
[content]

#### File: src/components/Button.tsx
[content]

[... more samples ...]

### Test Files

#### File: src/components/Button.test.tsx
[content]

### CI/CD
[workflow contents]

### Existing CLAUDE.md
[content if exists]

### Existing Skills
[list of skill names and their purposes]

## Analysis Request

Based on this data, produce a JSON analysis following the schema provided in your instructions.
```

Use the Agent tool with the repo-analyzer subagent. Parse the JSON response carefully.

If JSON parsing fails, retry with a simpler prompt or ask the user for help.

## Step 4: Determine Action Based on Current State

Apply the Behavior Matrix:

### Case 1: No CLAUDE.md + No .claude/skills/
**Action**: Full generation
- Generate CLAUDE.md
- Generate all recommended skills
- Print creation summary

### Case 2: No CLAUDE.md + Has .claude/skills/
**Action**: Generate CLAUDE.md + merge skills
- Generate CLAUDE.md
- Read existing skills
- Generate only NEW recommended skills (avoid duplicates)
- Print what was added

### Case 3: Has CLAUDE.md + No skills
**Action**: Upgrade proposal for CLAUDE.md + generate skills

If CLAUDE.md has scaffold marker:
- Offer full regeneration or merge

If CLAUDE.md is user-written (no marker):
- Present upgrade proposal:
  ```
  📋 CLAUDE.md Upgrade Proposal

  Current CLAUDE.md: [N lines], last modified [date]
  Analysis found:
    [OK] [Sections already present]
    [WARN]  [Missing sections]
    🆕  [N] new skills recommended

  Options:
    [1] Merge additions only (preserve your content, add missing sections)
    [2] Full regeneration (replace with freshly analyzed CLAUDE.md)
    [3] Skip CLAUDE.md, just add skills
    [4] Cancel

  Choose an option:
  ```

Use AskUserQuestion with these options. Wait for response.

### Case 4: Has both CLAUDE.md and skills
**Action**: Drift detection

Check if scaffold marker exists and compare date to current date.

If `--force` flag: offer full regeneration with confirmation.

If `--agents-md-only` flag: skip drift check, regenerate AGENTS.md directly.

Otherwise:
- Check for drift (new dependencies, new directories, framework version change)
- If drift detected: offer targeted update
- If no drift: print "Everything up-to-date" message

### Case 5: Monorepo Detected
**Action**: Multi-package mode

If `--package <name>` specified:
- Generate CLAUDE.md in that package's directory
- Generate skills in `<package>/.claude/skills/`

If no package specified:
- Generate root-level CLAUDE.md for monorepo overview
- List packages
- Ask if they want to scaffold all packages or specific ones

## Step 5: Generate CLAUDE.md

### Load Template

Read the template file:
```bash
cat ~/.claude/plugins/cache/local/repo-scaffold/1.0.0/skills/scaffold/templates/claude-md.template.md
```

### Populate Placeholders

Replace all placeholders with data from the analysis JSON:

- `{VERSION}` → "1.0.0"
- `{DATE}` → current date (YYYY-MM-DD format)
- `{PROJECT_NAME}` → analysis.project.name
- `{PROJECT_DESCRIPTION}` → from README or analysis
- `{PROJECT_TYPE}` → analysis.project.type
- `{PRIMARY_LANGUAGE}` → analysis.project.primary_language
- `{FRAMEWORK}` → analysis.project.framework
- `{RUNTIME}` → analysis.project.runtime
- `{PACKAGE_MANAGER}` → analysis.project.package_manager
- `{ARCHITECTURE_PATTERN}` → analysis.architecture.pattern
- `{ARCHITECTURE_DESCRIPTION}` → describe the pattern in 2-3 sentences
- `{KEY_DIRECTORIES_TABLE}` → format as markdown table or list
- `{ENTRY_POINTS_LIST}` → format as bullet list
- `{TEST_STRATEGY}` → analysis.architecture.test_strategy
- `{CI_CD}` → analysis.architecture.ci_cd
- `{SECONDARY_LANGUAGES_SECTION}` → if present, add as bullet list
- `{DEV_START_COMMAND}` → analysis.dev_workflow.start
- `{TEST_COMMAND}` → analysis.dev_workflow.test
- `{BUILD_COMMAND}` → analysis.dev_workflow.build
- `{LINT_COMMAND}` → analysis.dev_workflow.lint
- `{FORMAT_COMMAND}` → analysis.dev_workflow.format
- `{NAMING_CONVENTION}` → analysis.conventions.naming
- `{IMPORT_CONVENTION}` → analysis.conventions.imports
- `{EXPORT_CONVENTION}` → analysis.conventions.exports
- `{COMMENT_CONVENTION}` → analysis.conventions.comments
- `{ERROR_HANDLING_CONVENTION}` → analysis.conventions.error_handling
- `{ASYNC_CONVENTION}` → analysis.conventions.async_pattern
- `{ALWAYS_INSTRUCTIONS}` → format as bullet list from analysis.claude_instructions.always
- `{NEVER_INSTRUCTIONS}` → format as bullet list from analysis.claude_instructions.never
- `{CAUTION_INSTRUCTIONS}` → format as bullet list from analysis.claude_instructions.caution
- `{SKILLS_LIST}` → format as bullet list: "- `/{skill-name}` — [description]"

### Handle Merge Mode

If user selected "Merge additions only":

1. Read existing CLAUDE.md
2. Identify sections that exist (by headers)
3. Keep existing sections verbatim
4. Append only missing sections
5. Update the scaffold marker line

### Write CLAUDE.md

If NOT in `--dry-run` mode:

```bash
# Write to CLAUDE.md at project root
```

Use Write tool to create the file.

If in `--dry-run` mode:
- Print what would be written (first 50 lines)

## Step 6: Generate Skills

### Conditional Skill Generation

Determine which skills to generate based on repository characteristics:

#### Always Generate
- **code-reviewer**: Every project benefits from code review guidance

#### Conditional Generation by Detection

**test-writer** - Generate if:
- Test files present (`*test.*, *_test.*, *.spec.*`)
- Test framework detected (`jest`, `pytest`, `go test`, `rspec`)
- Testing dependencies in config files

**db-migration-helper** - Generate if:
- Migration directory exists (`migrations/`, `alembic/`, `prisma/migrations/`)
- ORM detected (`prisma`, `typeorm`, `sqlalchemy`, `sequelize`, `gorm`)
- Database config in env files (`DB_*`, `DATABASE_URL`)

**observability** - Generate if:
- Metrics endpoint exists (`/metrics`, `/health`)
- Prometheus client library in dependencies
- APM tool detected (`newrelic`, `datadog`, `elastic-apm`)
- Structured logging library (`winston`, `zap`, `logrus`, `pino`)

**security-scanner** - Generate if:
- Security tools in CI/CD (`gosec`, `snyk`, `trivy`, `bandit`, `eslint-security`)
- Security scanning scripts in `package.json` or `Makefile`
- Container scanning in Dockerfile or CI config

**api-doc-generator** - Generate if:
- OpenAPI/Swagger files exist (`openapi.yaml`, `swagger.json`)
- API documentation directory (`docs/api/`, `api/`)
- Swagger/OpenAPI annotations in code
- REST API endpoints detected in routing files

**perf-tester** - Generate if:
- Load testing tools present (`k6`, `vegeta`, `locust`, `jmeter`)
- Performance test files (`*.perf.ts`, `*_bench_test.go`, `*.bench.js`)
- Benchmark scripts in package.json

**ci-workflow-helper** - Generate if:
- CI/CD config files exist (`.github/workflows/`, `Jenkinsfile`, `azure-pipelines.yml`, `.gitlab-ci.yml`)

**dockerfile-optimizer** - Generate if:
- Dockerfile present
- docker-compose.yml present

**component-generator** - Generate if (frontend projects):
- React/Vue/Svelte/Angular detected in dependencies
- Component directory structure found

**api-route-generator** - Generate if (backend projects):
- API framework detected (`express`, `fastapi`, `gin`, `spring-boot`)
- Route/endpoint files found

**changelog-updater** - Generate if:
- CHANGELOG.md exists
- Keep a Changelog format detected

**doc-writer** - Generate if:
- Documentation directory exists (`docs/`)
- Multiple markdown files present

### Skill Priority Levels

1. **Core** (always useful): code-reviewer, test-writer, ci-workflow-helper
2. **Common** (most projects): db-migration-helper, observability, security-scanner
3. **Specialized** (specific needs): api-doc-generator, perf-tester, component-generator
4. **Optional** (nice to have): changelog-updater, doc-writer, dockerfile-optimizer

Generate Core + Common + any detected Specialized skills.

For each skill in the generation list:

### 1. Load Template

Read the corresponding template:
```bash
cat ~/.claude/plugins/cache/local/repo-scaffold/1.0.0/skills/scaffold/templates/skills/{skill-name}.md
```

### 2. Populate Placeholders

Replace placeholders with project-specific data:

**Common placeholders** (all skills):
- `{PROJECT_NAME}` → analysis.project.name
- `{FRAMEWORK}` → analysis.project.framework
- `{PRIMARY_LANGUAGE}` → analysis.project.primary_language
- `{IMPORT_STYLE}` → analysis.conventions.imports
- `{VERSION}` → "1.0.0"
- `{DATE}` → current date

**test-writer specific**:
- `{TEST_FRAMEWORK}` → detected test framework (Jest, pytest, etc.)
- `{TEST_COMMAND}` → analysis.dev_workflow.test
- `{TEST_FILE_PATTERN}` → detected pattern (co-located, __tests__, etc.)
- `{TEST_DIRECTORY}` → "tests/" or "src/" or detected location
- `{TEST_LOCATION_RULES}` → describe where test files go
- `{PROJECT_TEST_PATTERNS}` → describe observed patterns from samples
- `{TEST_STRUCTURE_DESCRIPTION}` → describe describe/it or test function style
- `{ASSERTION_STYLE}` → describe assertion library (expect, assert, etc.)
- `{MOCKING_STRATEGY}` → describe mocking approach found
- `{TEST_DATA_APPROACH}` → fixtures, factories, inline data
- `{TEST_FILE_COMMAND}` → command to run single file
- `{TEST_WATCH_COMMAND}` → watch mode command
- `{TEST_COVERAGE_COMMAND}` → coverage command
- `{TEST_UTILS_NOTE}` → mention any test utilities found

**component-generator specific**:
- `{COMPONENT_TYPE}` → React, Vue, Svelte
- `{COMPONENT_DIRECTORY}` → src/components/ or detected location
- `{COMPONENT_NAMING}` → PascalCase, kebab-case, etc.
- `{COMPONENT_FILE_STRUCTURE}` → single file, folder per component, etc.
- `{EXAMPLE_COMPONENT_NAME}` → "Button" or similar
- `{COMPONENT_FILES_LIST}` → list what gets generated
- `{COMPONENT_TEMPLATE_DESCRIPTION}` → describe structure
- `{FILE_NAMING_RULES}` → specific rules
- `{IMPORT_STYLE_RULES}` → how to import
- `{EXPORT_STYLE_RULES}` → default vs named
- `{COMPONENT_FILE_DESCRIPTION}` → what goes in main file
- `{TEST_FILE_DESCRIPTION}` → test file structure
- `{STYLES_FILE_DESCRIPTION}` → CSS modules, styled-components, etc.
- `{STORY_FILE_DESCRIPTION}` → Storybook if detected
- `{INDEX_FILE_DESCRIPTION}` → barrel files if used
- `{PROJECT_COMPONENT_PATTERNS}` → observed patterns
- `{PROPS_CONVENTIONS}` → prop types, interfaces
- `{STYLING_APPROACH}` → CSS, styled-components, tailwind, etc.

**api-route-generator specific**:
- `{ROUTER_PATTERN}` → Express, FastAPI, Next.js, etc.
- `{ROUTE_DIRECTORY}` → routes/, api/, endpoints/
- `{VALIDATION_LIBRARY}` → Zod, Joi, Pydantic, etc.
- `{ERROR_HANDLING_PATTERN}` → try/catch, middleware, etc.
- `{EXAMPLE_ROUTE}` → "/users" or similar
- `{ROUTE_FILES_LIST}` → what gets generated
- And other placeholders as defined in template

**db-migration-helper specific**:
- `{ORM}` → Prisma, SQLAlchemy, etc.
- `{DATABASE}` → PostgreSQL, MySQL, etc.
- `{MIGRATION_DIRECTORY}` → prisma/migrations/, alembic/, etc.
- `{SCHEMA_FILE}` → schema.prisma, models.py, etc.
- `{MIGRATION_WORKFLOW_DESCRIPTION}` → describe workflow
- `{MIGRATION_GENERATE_COMMAND}` → specific command
- `{MIGRATION_APPLY_COMMAND}` → apply command
- And other placeholders

**code-reviewer specific**:
- Uses conventions from analysis.conventions
- `{NAMING_CONVENTION}`, `{IMPORT_CONVENTION}`, etc.
- `{ALWAYS_RULES}` → from analysis.claude_instructions.always
- `{NEVER_RULES}` → from analysis.claude_instructions.never
- `{CAUTION_AREAS}` → from analysis.claude_instructions.caution
- `{COMMON_ISSUES}` → derive from patterns

**observability specific**:
- `{METRICS_SYSTEM}` → Prometheus, Datadog, etc.
- `{LOGGING_SYSTEM}` → ELK, CloudWatch, structured logger
- `{TRACING_SYSTEM}` → Jaeger, Zipkin, OpenTelemetry
- `{APM_TOOL}` → NewRelic, Datadog APM, etc.
- `{METRICS_ENDPOINT}` → /metrics, /health/metrics
- `{CUSTOM_METRICS_PATTERN}` → code example for adding metrics
- `{ADD_METRICS_INSTRUCTIONS}` → step-by-step guide
- `{METRICS_CODE_EXAMPLE}` → language-specific example
- `{STRUCTURED_LOGGING_PATTERN}` → logging code pattern
- `{REQUIRED_LOG_FIELDS}` → list of required fields
- `{LOG_AGGREGATION_SETUP}` → ELK, Splunk, etc.
- `{TRACING_CONFIG}` → tracing setup
- `{SPAN_CREATION_PATTERN}` → code example
- `{CONTEXT_PROPAGATION}` → how to propagate trace context
- `{GRAFANA_DASHBOARD_LOCATION}` → where dashboards are stored
- `{BUSINESS_METRICS}` → project-specific metrics
- `{DASHBOARD_CREATION_INSTRUCTIONS}` → how to create dashboards
- `{ALERT_CONFIG_LOCATION}` → alertmanager config location
- `{ADD_ALERT_INSTRUCTIONS}` → how to add new alerts
- `{ALERT_EXAMPLE}` → example alert YAML
- `{LIVENESS_ENDPOINT}` → /health, /healthz
- `{READINESS_ENDPOINT}` → /ready, /readiness
- `{HEALTH_CHECK_PATTERN}` → code example
- `{CPU_PROFILING_COMMAND}` → profiling command
- `{MEMORY_PROFILING_COMMAND}` → memory profiling
- `{CONTINUOUS_PROFILING_SETUP}` → continuous profiling
- `{LOG_QUERY_COMMAND}` → how to query logs
- `{GRAFANA_URL}` → Grafana URL
- `{TRACE_QUERY_COMMAND}` → how to query traces
- `{ALERT_QUERY_COMMAND}` → how to query alerts
- `{SLO_DEFINITIONS}` → service level objectives
- `{RUNBOOK_LOCATION}` → where runbooks are stored

**security-scanner specific**:
- `{SAST_TOOLS}` → gosec, bandit, semgrep, etc.
- `{DEPENDENCY_SCANNER}` → snyk, dependabot, trivy
- `{SECRET_SCANNER}` → gitleaks, trufflehog, detect-secrets
- `{CONTAINER_SCANNER}` → trivy, clair, anchore
- `{SAST_COMMAND}` → command to run SAST
- `{DEPENDENCY_SCAN_COMMAND}` → dependency scan command
- `{SECRET_SCAN_COMMAND}` → secret scan command
- `{CONTAINER_SCAN_COMMAND}` → container scan command
- `{INPUT_VALIDATION_PATTERN}` → validation code pattern
- `{AUTH_PATTERN}` → auth/authz pattern
- `{SECRETS_MANAGEMENT}` → how secrets are managed
- `{SECRET_STORE}` → Vault, AWS Secrets Manager, etc.
- `{API_SECURITY_GUIDELINES}` → API security best practices
- `{DB_SECURITY_GUIDELINES}` → database security
- `{DEPENDENCY_UPDATE_COMMAND}` → how to update deps
- `{CI_SECURITY_GATES}` → security gates in CI/CD
- `{SECURITY_HEADERS_CONFIG}` → security headers setup
- `{COMPLIANCE_REQUIREMENTS}` → SOC2, HIPAA, etc.
- `{SECURITY_TEAM_CONTACT}` → contact info
- `{INCIDENT_RESPONSE_PROCESS}` → incident response
- `{COMMON_VULNERABILITIES}` → project-specific vulns
- `{PENTEST_SCHEDULE}` → penetration test schedule
- `{SECURITY_REVIEW_PROCESS}` → code review process

**api-doc-generator specific**:
- `{API_DOC_FORMAT}` → OpenAPI, Swagger, etc.
- `{API_DOC_LOCATION}` → where docs are stored
- `{INTERACTIVE_DOCS_URL}` → Swagger UI URL
- `{OPENAPI_SPEC_LOCATION}` → spec file location
- `{OPENAPI_GENERATION_COMMAND}` → generate spec command
- `{OPENAPI_ANNOTATION_EXAMPLE}` → code example
- `{OPENAPI_REGEN_COMMAND}` → regenerate command
- `{OPENAPI_VALIDATE_COMMAND}` → validate command
- `{SCHEMA_DEFINITION_PATTERN}` → schema pattern
- `{VALIDATION_RULES_PATTERN}` → validation pattern
- `{API_VERSION}` → current API version
- `{VERSIONING_STRATEGY}` → versioning approach
- `{DEPRECATION_POLICY}` → deprecation policy
- `{SWAGGER_UI_LOCATION}` → Swagger UI location
- `{SWAGGER_UI_URL}` → Swagger UI URL
- `{POSTMAN_COLLECTION_LOCATION}` → Postman collection
- `{POSTMAN_IMPORT_COMMAND}` → import command
- `{CODE_COMMENT_PATTERN}` → doc comment pattern
- `{DOC_GENERATION_COMMAND}` → doc generation command
- `{REST_CONVENTIONS}` → RESTful conventions
- `{RESPONSE_FORMAT_STANDARD}` → response format
- `{ERROR_RESPONSE_FORMAT}` → error format
- `{EXAMPLE_REQUESTS_LOCATION}` → example requests
- `{TEST_AS_DOC_STRATEGY}` → tests as docs
- `{API_CHANGELOG_LOCATION}` → changelog location
- `{SDK_GENERATION}` → SDK generation info
- `{JS_SDK_LOCATION}`, `{PYTHON_SDK_LOCATION}`, etc.
- `{RATE_LIMIT_DOCS}` → rate limiting docs
- `{AUTH_DOCS}` → authentication docs
- `{API_PATTERNS}` → common API patterns

**perf-tester specific**:
- `{LOAD_TEST_TOOL}` → k6, vegeta, locust, jmeter
- `{BENCHMARK_TOOL}` → go test -bench, pytest-benchmark
- `{PROFILING_TOOL}` → pprof, py-spy, etc.
- `{LOAD_TEST_COMMAND}` → command to run load tests
- `{LOAD_TEST_CONFIG_LOCATION}` → config file location
- `{LOAD_TEST_CREATION_PATTERN}` → how to create tests
- `{LOAD_TEST_LANGUAGE}` → JavaScript, Python, etc.
- `{LOAD_TEST_EXAMPLE}` → code example
- `{DEFAULT_VU_COUNT}` → default virtual users
- `{DEFAULT_DURATION}` → default test duration
- `{DEFAULT_RAMPUP}` → default ramp-up time
- `{TARGET_ENDPOINTS}` → which endpoints to test
- `{BENCHMARK_COMMAND}` → benchmark command
- `{BENCHMARK_CODE_EXAMPLE}` → benchmark code
- `{PERFORMANCE_SLAS}` → SLA definitions
- `{TARGET_RPS}` → target requests/second
- `{RESULT_ANALYSIS_PATTERN}` → how to analyze results
- `{RESULT_STORAGE_LOCATION}` → where results are stored
- `{BASELINE_COMPARISON_COMMAND}` → compare with baseline
- `{OPTIMIZATION_STRATEGIES}` → optimization tips
- `{CPU_PROFILE_COMMAND}` → CPU profiling command
- `{MEMORY_PROFILE_COMMAND}` → memory profiling
- `{PROFILE_ANALYSIS_TOOL}` → profile analysis tool
- `{DB_QUERY_PROFILE_COMMAND}` → DB query profiling
- `{SLOW_QUERY_CONFIG}` → slow query log config
- `{CONNECTION_POOL_CONFIG}` → connection pool settings
- `{CACHE_CONFIG}` → cache configuration
- `{CI_PERFORMANCE_GATES}` → performance gates
- `{P95_THRESHOLD}`, `{ERROR_THRESHOLD}`, etc.
- `{CI_LOAD_TEST_COMMAND}` → CI load test command
- `{STRESS_TEST_SCENARIOS}` → stress test scenarios
- `{CHAOS_ENGINEERING_SETUP}` → chaos engineering
- `{APM_SETUP}` → APM setup
- `{RUM_SETUP}` → real user monitoring
- `{SYNTHETIC_MONITORING_SETUP}` → synthetic monitoring
- `{REPORT_GENERATION_COMMAND}` → report generation
- `{REGRESSION_DETECTION}` → regression detection

**Other skills**: Similar placeholder population based on detected technologies.

### 3. Check for Existing Skill

If `.claude/skills/{skill-name}/` already exists:

Read the existing `SKILL.md`:
```bash
cat .claude/skills/{skill-name}/SKILL.md
```

Check first line for scaffold marker.

If marker exists and NOT `--force`:
- Skip with message "Skill {skill-name} already exists"

If marker exists and `--force`:
- Overwrite

If no marker (user-written):
- Skip with warning "Skill {skill-name} exists (user-written), skipping"

### 4. Create Skill Directory

```bash
mkdir -p .claude/skills/{skill-name}
```

### 5. Write SKILL.md

If NOT in `--dry-run` mode:

Write the populated template to `.claude/skills/{skill-name}/SKILL.md`

If in `--dry-run` mode:
- Print what would be written (first 30 lines)

## Step 7: Generate AGENTS.md

### Overview

Generate an AGENTS.md file defining specialized subagents for complex tasks.

### Load Template

```bash
cat ~/.claude/plugins/repo-scaffold/skills/scaffold/templates/agents-md.template.md
```

### Populate Placeholders

Replace placeholders with project-specific data:

- `{PROJECT_NAME}` → analysis.project.name
- `{DATE}` → current date (YYYY-MM-DD)
- `{ARCHITECTURE_PATTERN}` → analysis.architecture.pattern
- `{API_STANDARD}` → detected API standard (REST, GraphQL, gRPC)
- `{LOGGING_SYSTEM}` → detected logging system (ELK, CloudWatch, etc.)
- `{METRICS_SYSTEM}` → detected metrics system (Prometheus, Datadog, etc.)
- `{DATABASE}` → detected database
- `{TEST_FRAMEWORK}` → detected test framework
- `{SECURITY_TOOLS}` → list of detected security tools
- `{COMPLIANCE_STANDARD}` → if detected (SOC2, HIPAA, etc.)
- `{API_DOC_FORMAT}` → OpenAPI, Swagger, etc.
- `{CI_CD_TOOL}` → GitHub Actions, Jenkins, Azure DevOps, etc.

### Conditional Agent Inclusion

Include agents based on project characteristics:

**Always Include**:
- code-reviewer
- api-designer
- troubleshooter
- test-architect
- doc-writer
- refactoring-specialist

**Conditional Agents**:

**db-optimizer** - Include if:
- Database detected in project
- ORM present
- Migration files exist

**security-auditor** - Include if:
- Security tools configured
- Compliance requirements detected
- Enterprise/production project

**deployment-engineer** - Include if:
- CI/CD pipelines present
- Kubernetes manifests found
- Docker present

### Generate Agent List

Create `{AGENTS_LIST}` as a bullet list:
```markdown
- **code-reviewer** — Review code against project conventions
- **api-designer** — Design new API endpoints
- **troubleshooter** — Debug production issues
- **db-optimizer** — Optimize database queries and schema
- **test-architect** — Design comprehensive test strategies
- **security-auditor** — Audit code for security vulnerabilities
- **doc-writer** — Write and maintain documentation
- **refactoring-specialist** — Plan and execute refactoring
- **deployment-engineer** — Manage deployments and CI/CD
```

### Check for Existing AGENTS.md

If `AGENTS.md` exists:
- Read first line for scaffold marker
- If marker exists: update (merge with any user additions)
- If no marker: skip with message "AGENTS.md exists (user-written)"

### Write AGENTS.md

If NOT in `--dry-run` mode:

Write the populated template to `AGENTS.md` at project root.

If in `--dry-run` mode:
- Print what would be written (first 40 lines)

## Step 8: Report

Print a formatted summary:

```
[OK] RepoScaffold Complete

 CLAUDE.md → [created | updated | skipped]
   Location: /path/to/CLAUDE.md
   [N] lines, [M] sections

 AGENTS.md → [created | updated | skipped]
   Location: /path/to/AGENTS.md
   [N] specialized subagents defined

  Skills generated ([N]):
   • {skill-1}  →  .claude/skills/{skill-1}/
   • {skill-2}  →  .claude/skills/{skill-2}/
   • {skill-3}  →  .claude/skills/{skill-3}/

 Next steps:
   • Run /{skill-name} to use a skill
   • Invoke subagents with @{agent-name} for complex tasks
   • Skills auto-invoke when you ask for relevant tasks
   • Re-run /scaffold to detect changes and update

 Tips:
   • Run /scaffold --dry-run to preview future updates
   • Edit CLAUDE.md and AGENTS.md freely — /scaffold will merge your changes
   • To regenerate everything: /scaffold --force
   • View all agents: Read AGENTS.md
```

If in `--dry-run` mode, prefix with:
```
 DRY RUN — No files were written

The following would be created/modified:
```

## Flags Reference

- `--dry-run`: Execute steps 1-7, print what would be generated, write nothing
- `--force`: Skip all confirmation prompts, regenerate everything
- `--skills-only`: Skip CLAUDE.md and AGENTS.md generation, only generate/update skills
- `--claude-md-only`: Skip skills and AGENTS.md generation, only generate/update CLAUDE.md
- `--agents-md-only`: Skip CLAUDE.md and skills, only generate/update AGENTS.md
- `--package <name>`: In monorepos, scaffold only the specified package

## Error Handling

If any step fails:

1. Print clear error message with step number
2. Print the error details
3. Suggest fixes if possible
4. Do not continue to next steps

Common errors:
- JSON parsing failure from subagent → retry or ask user to file bug report
- File read failure → check if file exists or permissions issue
- Write failure → check permissions, disk space

## Configuration Support

If `.repo-scaffold.json` exists at project root, respect these settings:

```json
{
  "skip_skills": ["skill-name"],           // Don't generate these skills
  "extra_context": "string",               // Pass to analyzer
  "protected_files": ["CLAUDE.md"],        // Never overwrite without explicit --force
  "custom_templates": ".scaffold-templates/" // Use custom template directory
}
```

If `~/.claude/repo-scaffold-config.json` exists, respect global settings:

```json
{
  "auto_prompt_on_missing": true,
  "default_mode": "full",
  "skills_always_generate": ["code-reviewer"],
  "skills_never_generate": [],
  "max_files_to_sample": 20,
  "dry_run_by_default": false
}
```

## Implementation Notes

- **Be thorough in reconnaissance** — read actual file contents, don't just list
- **The subagent analysis is critical** — give it rich data, get rich analysis
- **Never overwrite user content without confirmation** — unless `--force` is set
- **Generated files must be immediately useful** — not generic boilerplate
- **Keep the user informed** — print progress for long operations

---

*This skill is the core of the RepoScaffold plugin.*

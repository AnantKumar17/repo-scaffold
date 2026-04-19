---
name: security-scanner
description: >
  Run security scans, analyze vulnerabilities, and enforce security best practices
  for {PROJECT_NAME}. Auto-invoke when asked about security, vulnerabilities, or CVEs.
---

# Security Scanner — {PROJECT_NAME}

## Security Tools Configured

- **SAST**: {SAST_TOOLS}
- **Dependency Scanner**: {DEPENDENCY_SCANNER}
- **Secret Scanner**: {SECRET_SCANNER}
- **Container Scanner**: {CONTAINER_SCANNER}

## Running Security Scans

### SAST (Static Application Security Testing)

{SAST_COMMAND}

Common issues detected:
- SQL injection vulnerabilities
- XSS vulnerabilities
- Path traversal
- Insecure crypto usage
- Race conditions

### Dependency Vulnerability Scan

{DEPENDENCY_SCAN_COMMAND}

Checks for:
- Known CVEs in dependencies
- Outdated packages with security patches
- License compliance issues

### Secret Detection

{SECRET_SCAN_COMMAND}

Detects:
- API keys
- Passwords
- Private keys
- AWS credentials
- Database connection strings

### Container Image Scan

{CONTAINER_SCAN_COMMAND}

Checks for:
- Vulnerable base images
- Exposed ports
- Root user usage
- Outdated system packages

## Security Best Practices

### Input Validation

{INPUT_VALIDATION_PATTERN}

### Authentication & Authorization

{AUTH_PATTERN}

### Secrets Management

{SECRETS_MANAGEMENT}

[OK] **Always**:
- Store secrets in {SECRET_STORE}
- Rotate secrets regularly
- Use environment variables
- Never commit secrets to git

[FAIL] **Never**:
- Hardcode credentials
- Store secrets in code
- Log sensitive data
- Use default passwords

### API Security

{API_SECURITY_GUIDELINES}

### Database Security

{DB_SECURITY_GUIDELINES}

## Vulnerability Management

### Triaging Vulnerabilities

Severity levels:
- **Critical**: Immediate fix required
- **High**: Fix within 7 days
- **Medium**: Fix within 30 days
- **Low**: Fix in next sprint

### Fixing Vulnerabilities

1. **Assess Impact**: Is the vulnerable code path used?
2. **Check for Patch**: Is there an updated version?
3. **Test Fix**: Does the update break anything?
4. **Deploy**: Roll out the fix
5. **Verify**: Rescan to confirm fixed

### Dependency Updates

{DEPENDENCY_UPDATE_COMMAND}

## Security Checklist for New Code

- [ ] Input validated and sanitized
- [ ] Output encoded (prevent XSS)
- [ ] SQL queries parameterized (no string concat)
- [ ] Authentication required
- [ ] Authorization checks in place
- [ ] Error messages don't leak sensitive info
- [ ] Secrets not hardcoded
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Logging doesn't include PII/secrets

## CI/CD Security Gates

{CI_SECURITY_GATES}

## Security Headers

{SECURITY_HEADERS_CONFIG}

Required headers:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- X-XSS-Protection

## Compliance

{COMPLIANCE_REQUIREMENTS}

## Security Contacts

- **Security Team**: {SECURITY_TEAM_CONTACT}
- **Incident Response**: {INCIDENT_RESPONSE_PROCESS}

## Common Vulnerabilities in This Project

{COMMON_VULNERABILITIES}

## Security Testing

### Penetration Testing

{PENTEST_SCHEDULE}

### Security Code Review

{SECURITY_REVIEW_PROCESS}

## Incident Response

1. **Detect**: Monitor alerts, security tools
2. **Contain**: Isolate affected systems
3. **Investigate**: Determine scope and impact
4. **Remediate**: Fix vulnerability, apply patches
5. **Document**: Write postmortem
6. **Learn**: Update processes to prevent recurrence

## Usage

Ask Claude for help with:
- "Run security scan and analyze results"
- "Check for vulnerabilities in dependencies"
- "Review code for security issues"
- "Fix SQL injection in endpoint X"
- "Set up secret scanning in CI"

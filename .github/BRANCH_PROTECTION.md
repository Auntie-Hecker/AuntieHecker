# Branch Protection and Security Configuration

## Overview

This document describes the branch protection rules and security measures implemented for the AuntieHecker cybersecurity investigation project repository.

## Branch Protection Ruleset

The main branch is protected by a comprehensive ruleset located at `.github/rulesets/main-branch-protection.yml`.

### Protection Rules

1. **Deletion Protection**: The main branch cannot be deleted
2. **Force Push Prevention**: Non-fast-forward updates (force pushes) are blocked
3. **Pull Request Requirement**: All changes to main must go through pull requests
4. **Review Requirement**: At least 1 approving review required before merging
5. **Status Check Requirement**: GitHub Actions workflows must pass before merging
6. **Stale Review Dismissal**: Reviews are dismissed when new commits are pushed

### Status Checks Required

- **Deploy static content to Pages**: Ensures the GitHub Pages deployment succeeds
- **CI - Quality Checks**: Comprehensive code quality and security validation

### Bypass Permissions

Repository administrators can bypass these rules in emergency situations while maintaining an audit trail.

## Continuous Integration (CI)

The `.github/workflows/ci-quality.yml` workflow provides automated quality assurance:

### Quality Checks

1. **Code Linting**: ESLint validation for code style and basic errors
2. **Type Checking**: TypeScript compilation validation
3. **Build Verification**: Ensures the application builds successfully
4. **Security Audit**: npm audit for known vulnerabilities
5. **Secret Detection**: Scans source code for potential hardcoded secrets
6. **Configuration Validation**: Validates YAML syntax in GitHub workflows and rulesets

### Scope

The CI workflow focuses on source code (`src/` directory) and excludes:
- Investigation data (`analysis/`, `data/`, `reports/`, `iocs/`)
- Evidence files (`evidence/`)
- Build artifacts (`dist/`, `node_modules/`)
- Documentation files

## Security Considerations

### Cybersecurity Investigation Context

Given that this repository contains cybersecurity investigation data:

1. **Controlled Access**: Branch protection ensures all changes are reviewed
2. **Audit Trail**: All modifications to main branch are logged and traceable
3. **Quality Assurance**: Automated checks prevent introduction of vulnerabilities
4. **Data Integrity**: Force push prevention maintains investigation data integrity

### Sensitive Data Handling

- Source code is scanned for hardcoded secrets
- Investigation data directories are excluded from secret scanning (as they may contain IOCs)
- GitHub Actions workflows validate configuration files

## Implementation Guide

### For Repository Maintainers

1. **Creating Pull Requests**: All changes must be submitted via pull request
2. **Review Process**: Ensure at least one team member reviews changes
3. **Status Checks**: Wait for all CI checks to pass before merging
4. **Emergency Access**: Repository admins can bypass rules if absolutely necessary

### For Contributors

1. Fork the repository or create a feature branch
2. Make your changes in the appropriate directories
3. Ensure your changes pass linting and build checks locally:
   ```bash
   npm run lint
   npm run build
   ```
4. Submit a pull request with a clear description
5. Wait for review and status check completion

## Maintenance

### Updating Protection Rules

To modify branch protection:

1. Edit `.github/rulesets/main-branch-protection.yml`
2. Validate the YAML syntax: `npx js-yaml .github/rulesets/main-branch-protection.yml`
3. Submit via pull request for review

### Adding New Status Checks

To require additional CI checks:

1. Create new GitHub Actions workflow in `.github/workflows/`
2. Add the workflow job name to the `required_status_checks` in the ruleset
3. Test the workflow and update the ruleset via pull request

## Troubleshooting

### Common Issues

- **Status checks failing**: Check the Actions tab for detailed error logs
- **Secret detection warnings**: Review flagged content; may be false positives from investigation data
- **YAML validation errors**: Use `npx js-yaml <file>` to validate syntax

### Getting Help

- Check GitHub Actions logs for specific error details
- Review this documentation for configuration details
- Contact repository maintainers for access or permission issues

---

*This document is part of the AuntieHecker cybersecurity investigation project.*  
*Repository: https://github.com/Deppy04/AuntieHecker*
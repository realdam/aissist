# Add Automated Release Workflow

## Overview
Implement comprehensive automated release workflows for both the aissist CLI (npm package) and the aissist Claude Code plugin. This includes GitHub Actions CI/CD pipelines for testing, building, versioning, changelog generation, and publishing to npm and the Claude Code marketplace.

## Problem Statement
Currently, releasing new versions requires:
- **Manual version bumping** in multiple files (package.json, plugin.json, marketplace.json)
- **Manual changelog updates** - No automated tracking of changes
- **Manual npm publishing** - No CI/CD automation
- **Manual plugin releases** - No automated marketplace publishing
- **No automated testing** - No CI to catch issues before release
- **Inconsistent versioning** - CLI and plugin versions can drift
- **Error-prone process** - Manual steps are easy to forget or execute incorrectly

This creates several problems:
- Releases are time-consuming and tedious
- High risk of human error
- Difficult to maintain version consistency
- No automated quality gates
- Slows down development velocity
- Hard to coordinate CLI and plugin releases

## Proposed Solution
Create automated release workflows that:
1. **Run automated tests** on every PR and push
2. **Version management** - Automated version bumping with semantic versioning
3. **Changelog generation** - Automatic changelog from conventional commits
4. **CLI publishing** - Automated npm package publishing
5. **Plugin publishing** - Automated Claude Code marketplace releases
6. **Coordinated releases** - Option to release CLI and plugin together
7. **Release notes** - Auto-generated GitHub releases with notes
8. **Quality gates** - Tests must pass before publishing

## User Experience

### For Maintainers

**Releasing a new version:**
```bash
# 1. Create and merge PR with conventional commits
git commit -m "feat: add new chat command"

# 2. Trigger release workflow
git tag v1.1.0
git push origin v1.1.0

# Workflow automatically:
# - Runs tests
# - Builds CLI and plugin
# - Updates version in all files
# - Generates changelog
# - Publishes to npm
# - Publishes to marketplace
# - Creates GitHub release
```

**Continuous Integration:**
```bash
# On every PR:
# - Runs tests
# - Validates build
# - Checks linting
# - Reports status
```

### For Users

**Getting updates:**
```bash
# CLI updates via npm
npm update -g aissist

# Plugin updates via Claude Code
claude plugin update aissist
```

## Benefits
1. **Automation** - Eliminate manual release steps
2. **Consistency** - Same process every time
3. **Quality** - Automated testing before release
4. **Speed** - Faster release cycles
5. **Reliability** - Fewer human errors
6. **Transparency** - Auto-generated changelogs
7. **Coordination** - CLI and plugin stay in sync
8. **Documentation** - Clear release notes

## Scope
This change affects:
- **CI/CD**: Add GitHub Actions workflows
- **Versioning**: Automated version management
- **Changelog**: Conventional commits and auto-generation
- **Publishing**: npm and marketplace automation
- **Testing**: CI test execution
- **Documentation**: Release process docs

This does NOT require:
- Changes to CLI functionality
- Changes to plugin functionality
- New features or capabilities
- Migration of existing versions

## Key Design Decisions

### GitHub Actions vs Other CI
**Decision**: Use GitHub Actions
**Rationale**:
- Native GitHub integration
- Free for open source
- Wide ecosystem support
- Simple YAML configuration
- Good npm/marketplace integration

### Semantic Versioning
**Decision**: Follow semver (MAJOR.MINOR.PATCH)
**Rationale**:
- Industry standard
- Clear version meaning
- npm ecosystem expectation
- Backward compatibility signals

### Conventional Commits
**Decision**: Require conventional commit format
**Rationale**:
- Enables changelog automation
- Clear commit intent
- Semantic version derivation
- Standard in modern projects

### Version Synchronization
**Decision**: Keep CLI and plugin versions in sync
**Rationale**:
- Simpler mental model for users
- Easier to communicate releases
- Reduces confusion
- They're tightly coupled anyway

## Success Criteria
1. Tests run automatically on every PR
2. Version bumping is automated
3. Changelog generates automatically
4. CLI publishes to npm automatically
5. Plugin publishes to marketplace automatically
6. GitHub releases created with notes
7. Process is documented clearly
8. Releases complete in <5 minutes
9. Zero-manual-step releases possible
10. Version consistency maintained

## Related Work
- Builds on existing CLI infrastructure (cli-infrastructure spec)
- Uses existing package.json configuration
- Leverages existing plugin configuration
- Integrates with GitHub repository setup
- Follows npm and marketplace publishing standards

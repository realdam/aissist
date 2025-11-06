# Design: Automated Release Workflow

## Architecture

### Component Diagram
```
┌─────────────────────────────────────────────────────────────┐
│ GitHub Repository                                           │
│                                                             │
│  ┌──────────────────────────────────────────┐              │
│  │ Developer Actions                        │              │
│  │                                          │              │
│  │  • Create PR with conventional commits  │              │
│  │  • Merge to main                        │              │
│  │  • Create git tag (v1.2.3)              │              │
│  └──────────────────────────────────────────┘              │
│           │                                                 │
│           ▼                                                 │
│  ┌──────────────────────────────────────────┐              │
│  │ GitHub Actions Workflows                 │              │
│  │                                          │              │
│  │  1. CI (on PR/push)                     │              │
│  │     - Run tests                         │              │
│  │     - Build check                       │              │
│  │     - Lint check                        │              │
│  │                                          │              │
│  │  2. Release (on tag)                    │              │
│  │     - Version bump                      │              │
│  │     - Generate changelog                │              │
│  │     - Build artifacts                   │              │
│  │     - Publish npm                       │              │
│  │     - Publish plugin                    │              │
│  │     - Create GitHub release             │              │
│  └──────────────────────────────────────────┘              │
│           │                │                │               │
└───────────┼────────────────┼────────────────┼───────────────┘
            │                │                │
            ▼                ▼                ▼
    ┌───────────────┐  ┌────────────┐  ┌─────────────┐
    │ npm Registry  │  │ Claude     │  │ GitHub      │
    │               │  │ Marketplace│  │ Releases    │
    └───────────────┘  └────────────┘  └─────────────┘
```

### Workflow Flows

#### 1. Continuous Integration (CI)
```
PR Created/Updated
    ↓
Trigger CI Workflow
    ↓
┌─────────────────────┐
│ Setup Node.js       │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Install Dependencies│
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Run Linting         │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Run Tests           │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Build TypeScript    │
└─────────────────────┘
    ↓
✅ Pass / ❌ Fail
```

#### 2. Release Workflow
```
Tag Created (v1.2.3)
    ↓
Trigger Release Workflow
    ↓
┌─────────────────────┐
│ Checkout Code       │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Parse Version       │
│ from Tag            │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Update Versions     │
│ • package.json      │
│ • plugin.json       │
│ • marketplace.json  │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Generate Changelog  │
│ from Commits        │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Build CLI           │
│ (TypeScript → JS)   │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Run Tests           │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Publish to npm      │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Create GitHub       │
│ Release             │
└─────────────────────┘
    ↓
✅ Release Complete
```

## GitHub Actions Workflows

### Workflow 1: CI (`ci.yml`)

**Trigger**: On pull request and push to main
**Purpose**: Validate code quality before merge

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

**Key Features**:
- Runs on every PR
- Validates build passes
- Ensures tests pass
- Checks code style
- Fast feedback loop

### Workflow 2: Release (`release.yml`)

**Trigger**: On version tag push (v*.*.*)
**Purpose**: Automate entire release process

```yaml
name: Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Extract version from tag
        id: version
        run: echo "VERSION=${GITHUB_REF#refs/tags/v}" >> $GITHUB_OUTPUT

      - name: Update versions
        run: |
          npm version ${{ steps.version.outputs.VERSION }} --no-git-tag-version
          # Update plugin files

      - name: Generate changelog
        run: # Changelog generation

      - name: Build
        run: npm ci && npm run build

      - name: Test
        run: npm test

      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Create GitHub Release
        uses: actions/create-release@v1
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ steps.version.outputs.VERSION }}
          body: ${{ steps.changelog.outputs.content }}
```

**Key Features**:
- Triggered by git tags
- Automated version sync
- Changelog generation
- npm publishing
- GitHub release creation
- Plugin packaging

## Version Management

### Semantic Versioning Strategy

**Format**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

**Example**:
- `1.0.0` → `1.0.1`: Bug fix (patch)
- `1.0.1` → `1.1.0`: New feature (minor)
- `1.1.0` → `2.0.0`: Breaking change (major)

### Version Synchronization

All three version files must stay in sync:

1. **`package.json`**:
```json
{
  "version": "1.2.3"
}
```

2. **`aissist-plugin/.claude-plugin/plugin.json`**:
```json
{
  "version": "1.2.3"
}
```

3. **`aissist-plugin/.claude-plugin/marketplace.json`**:
```json
{
  "plugins": [
    {
      "version": "1.2.3"
    }
  ]
}
```

### Version Update Script

Create `scripts/update-version.js`:
```javascript
import { readFileSync, writeFileSync } from 'fs';

const version = process.argv[2];

// Update package.json
const pkg = JSON.parse(readFileSync('package.json'));
pkg.version = version;
writeFileSync('package.json', JSON.stringify(pkg, null, 2));

// Update plugin.json
const plugin = JSON.parse(readFileSync('aissist-plugin/.claude-plugin/plugin.json'));
plugin.version = version;
writeFileSync('aissist-plugin/.claude-plugin/plugin.json', JSON.stringify(plugin, null, 2));

// Update marketplace.json
const marketplace = JSON.parse(readFileSync('aissist-plugin/.claude-plugin/marketplace.json'));
marketplace.plugins[0].version = version;
writeFileSync('aissist-plugin/.claude-plugin/marketplace.json', JSON.stringify(marketplace, null, 2));

console.log(`✓ Updated all version files to ${version}`);
```

## Changelog Generation

### Conventional Commits

**Format**: `<type>(<scope>): <description>`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `chore`: Maintenance
- `refactor`: Code refactoring
- `test`: Tests
- `perf`: Performance improvement

**Examples**:
```
feat(chat): add conversational assistant command
fix(todo): resolve priority sorting issue
docs(readme): update installation instructions
chore(deps): update dependencies
```

### Changelog Structure

**`CHANGELOG.md`**:
```markdown
# Changelog

## [1.2.0] - 2025-11-06

### Added
- Conversational chat command for natural dialogue
- Todo extraction from context with AI

### Fixed
- Priority sorting in todo list
- Goal deadline parsing

### Changed
- Updated CLI help text
- Improved error messages

## [1.1.0] - 2025-11-05
...
```

### Generation Tool

Use `standard-version` or similar:
```bash
npm install -D standard-version

# In release workflow:
npx standard-version --release-as $VERSION
```

## Publishing

### npm Publishing

**Requirements**:
- npm account
- NPM_TOKEN secret in GitHub
- Public package access

**Process**:
```bash
# In workflow
npm config set //registry.npmjs.org/:_authToken=${NPM_TOKEN}
npm publish --access public
```

**Validation**:
- Tests pass
- Build succeeds
- Version doesn't already exist

### Claude Code Marketplace Publishing

**Requirements**:
- Plugin meets Claude Code standards
- Proper plugin.json configuration
- Marketplace.json configured

**Process**:
Currently manual or via Claude Code CLI (if available):
```bash
claude plugin publish aissist-plugin
```

**Alternative**: Package plugin and include in GitHub release

## Security

### Secrets Management

Required GitHub Secrets:
- `NPM_TOKEN`: npm publishing authentication
- `CLAUDE_TOKEN`: Claude marketplace auth (if automated)

**Setup**:
```bash
# GitHub UI: Settings → Secrets → Actions
# Add secrets: NPM_TOKEN, CLAUDE_TOKEN
```

### Access Control

- Only maintainers can create tags
- Workflows run in isolated environment
- Secrets never logged
- npm 2FA recommended

## Testing Strategy

### Pre-Release Tests

**CI Tests** (on every PR):
- Unit tests
- Integration tests
- Build validation
- Linting

**Release Tests** (before publishing):
- Full test suite
- Build verification
- Version consistency check

### Manual Testing

**Before tagging**:
- Test CLI locally: `npm run build && npm link`
- Test plugin locally: `claude plugin install ./aissist-plugin`
- Verify functionality
- Check documentation

### Rollback Strategy

**If release fails**:
1. Delete git tag: `git tag -d v1.2.3 && git push --delete origin v1.2.3`
2. Unpublish from npm (within 72 hours): `npm unpublish aissist@1.2.3`
3. Fix issues
4. Create new version

## Release Process Documentation

### Standard Release

**For maintainers**:

1. **Prepare release**:
   ```bash
   # Ensure main is up to date
   git checkout main
   git pull origin main

   # Ensure tests pass
   npm test
   ```

2. **Create tag**:
   ```bash
   # Create annotated tag
   git tag -a v1.2.3 -m "Release v1.2.3"

   # Push tag
   git push origin v1.2.3
   ```

3. **Monitor workflow**:
   - Watch GitHub Actions tab
   - Verify workflow completes
   - Check npm: `npm view aissist version`
   - Check GitHub releases

4. **Verify release**:
   ```bash
   # Test npm install
   npm install -g aissist@1.2.3

   # Test plugin update
   claude plugin update aissist
   ```

### Emergency Hotfix

**For critical bugs**:

1. Create hotfix branch from tag
2. Fix bug
3. Update version (patch bump)
4. Create new tag
5. Release follows same process

### Pre-Release / Beta

**For testing**:

```bash
# Tag as pre-release
git tag -a v1.3.0-beta.1 -m "Beta release"

# Workflow publishes as beta
npm publish --tag beta
```

**Users can test**:
```bash
npm install -g aissist@beta
```

## Monitoring & Alerts

### Release Health

**Metrics to track**:
- Workflow success rate
- Release duration
- npm download trends
- Plugin installation count

**Alerts**:
- Workflow failures → Notify maintainers
- npm publish errors → Slack/email
- Version inconsistencies → Pre-release checks

## Future Enhancements

**Not in initial scope**:
1. Automated dependency updates (Dependabot)
2. Automated security scanning
3. Performance benchmarking in CI
4. Docker image publishing
5. Multi-platform CLI binaries
6. Beta/canary release channels
7. Automated documentation deployment

# Implementation Tasks

## Phase 1: CI Workflow Setup
1. **Create CI workflow file**
   - Create `.github/workflows/ci.yml`
   - Configure triggers (PR, push to main)
   - Set up Node.js environment
   - **Validation**: File exists with correct YAML structure

2. **Implement CI steps**
   - Add dependency installation step
   - Add linting step (`npm run lint`)
   - Add test execution step (`npm test`)
   - Add build validation step (`npm run build`)
   - **Validation**: All steps execute correctly

3. **Test CI workflow**
   - Create test PR to trigger CI
   - Verify all checks run
   - Verify pass/fail status appears on PR
   - Test with intentional failure
   - **Validation**: CI catches issues before merge

## Phase 2: Version Management
4. **Create version update script**
   - Create `scripts/update-version.js`
   - Implement logic to update package.json
   - Implement logic to update plugin.json
   - Implement logic to update marketplace.json
   - Add validation that all versions match
   - **Validation**: Script updates all three files consistently

5. **Add version validation**
   - Validate semver format
   - Check for version conflicts
   - Ensure versions don't go backward
   - **Validation**: Invalid versions are rejected

## Phase 3: Changelog Automation
6. **Configure conventional commits**
   - Add commitlint configuration (optional)
   - Document commit format in CONTRIBUTING.md
   - Provide examples of good commit messages
   - **Validation**: Documentation is clear and comprehensive

7. **Set up changelog generation**
   - Add `standard-version` or similar tool as dev dependency
   - Configure changelog template
   - Test changelog generation locally
   - **Validation**: Changelog generates correctly from commits

## Phase 4: Release Workflow
8. **Create release workflow file**
   - Create `.github/workflows/release.yml`
   - Configure tag trigger pattern (`v*.*.*`)
   - Set up Node.js environment
   - **Validation**: Workflow file is valid YAML

9. **Implement version extraction**
   - Add step to extract version from git tag
   - Validate tag format
   - Set as workflow output variable
   - **Validation**: Version correctly extracted from tag

10. **Implement version update step**
    - Call version update script with extracted version
    - Commit updated files (if needed)
    - **Validation**: All version files updated correctly

11. **Implement changelog generation step**
    - Generate changelog from commits
    - Update CHANGELOG.md file
    - **Validation**: Changelog contains version section

12. **Implement build and test steps**
    - Install dependencies
    - Build TypeScript code
    - Run full test suite
    - Abort on failure
    - **Validation**: Tests must pass before publishing

13. **Implement npm publishing step**
    - Configure npm authentication
    - Publish package with npm publish
    - Use NPM_TOKEN from secrets
    - **Validation**: Package appears on npm registry

14. **Implement GitHub release step**
    - Create release with tag
    - Set release title
    - Include generated changelog in body
    - Mark as latest or pre-release as appropriate
    - **Validation**: Release appears on GitHub

## Phase 5: Security Configuration
15. **Set up GitHub secrets**
    - Generate npm access token
    - Add NPM_TOKEN to GitHub repository secrets
    - Document secret requirements
    - **Validation**: Secrets configured and accessible

16. **Configure access permissions**
    - Set workflow permissions appropriately
    - Ensure secrets are not logged
    - Review security best practices
    - **Validation**: No secrets exposed in logs

## Phase 6: Documentation
17. **Create release process documentation**
    - Document how to create a release
    - Explain tagging conventions
    - Describe workflow steps
    - Include troubleshooting guide
    - **Validation**: Documentation is clear and complete

18. **Update CONTRIBUTING.md**
    - Add release process section
    - Document conventional commit format
    - Explain versioning strategy
    - Link to workflow files
    - **Validation**: Contributors understand release process

19. **Create CHANGELOG.md template**
    - Initialize CHANGELOG.md file
    - Add template structure
    - Include initial version
    - **Validation**: File follows Keep a Changelog format

## Phase 7: Testing and Validation
20. **Test release workflow end-to-end**
    - Create test tag (v0.0.1-test or similar)
    - Monitor workflow execution
    - Verify all steps complete
    - Check npm package published
    - Check GitHub release created
    - **Validation**: Full release cycle works

21. **Test CI workflow thoroughly**
    - Test with passing PR
    - Test with failing tests
    - Test with linting errors
    - Test with build failures
    - **Validation**: CI catches all types of issues

22. **Validate version synchronization**
    - Release test version
    - Verify all three files have matching versions
    - Check npm package version matches
    - Check plugin version matches
    - **Validation**: Versions are perfectly synchronized

23. **Test rollback scenario**
    - Simulate failed release
    - Delete tag
    - Verify recovery process
    - **Validation**: Rollback procedures work

24. **Validate with OpenSpec**
    - Run `openspec validate add-automated-release-workflow --strict`
    - Fix any validation errors
    - Verify all requirements covered
    - **Validation**: OpenSpec validation passes

## Phase 8: Polish and Finalization
25. **Review workflow configurations**
    - Check all YAML syntax
    - Verify trigger conditions
    - Validate environment setup
    - Ensure error handling is robust
    - **Validation**: Workflows are production-ready

26. **Clean up test artifacts**
    - Remove test tags
    - Unpublish test versions from npm (if needed)
    - Delete test releases
    - **Validation**: No test artifacts remain

27. **Final documentation review**
    - Proofread all documentation
    - Verify examples are accurate
    - Check links work
    - Ensure completeness
    - **Validation**: Documentation is polished

28. **Create first real release**
    - Tag v1.0.0 (or appropriate version)
    - Monitor workflow
    - Verify publication
    - Announce release
    - **Validation**: First release succeeds

## Dependencies
- **Tasks 4-5** (version management) can be done in parallel with Tasks 6-7 (changelog)
- **Task 8** (release workflow file) depends on Tasks 4-7 being complete
- **Tasks 9-14** (release workflow steps) must be done sequentially
- **Task 15** (secrets) can be done anytime before testing
- **Tasks 17-19** (documentation) can be done in parallel
- **Tasks 20-23** (testing) depend on all implementation being complete
- **Tasks 25-28** (polish) are final steps

## Estimated Timeline
- Phase 1: 2-3 hours
- Phase 2: 2-3 hours
- Phase 3: 1-2 hours
- Phase 4: 4-6 hours
- Phase 5: 1 hour
- Phase 6: 2-3 hours
- Phase 7: 3-4 hours
- Phase 8: 2-3 hours

**Total**: 17-27 hours of focused development time

## Success Criteria
- [x] CI workflow runs on every PR and main push
- [x] CI validates linting, tests, and build
- [x] Version update script synchronizes all three version files
- [x] Changelog generates automatically from conventional commits
- [x] Release workflow triggers on version tags
- [x] npm package publishes automatically
- [x] GitHub releases create automatically with notes
- [x] Version numbers stay synchronized across all files
- [x] Secrets handled securely
- [x] Documentation is complete and clear
- [ ] Full release cycle tested and working (requires NPM_TOKEN and actual release)
- [x] Rollback procedures documented and tested
- [x] `openspec validate --strict` passes

## Implementation Notes

### GitHub Actions Best Practices
- Use latest action versions (@v4, etc.)
- Cache dependencies for faster runs
- Set appropriate timeouts
- Use matrix builds if testing multiple Node versions
- Fail fast on errors

### Version Management
```javascript
// scripts/update-version.js usage
node scripts/update-version.js 1.2.3
// Updates: package.json, plugin.json, marketplace.json
```

### Conventional Commits Examples
```
feat(chat): add conversational assistant command
fix(todo): resolve priority sorting bug
docs(readme): update installation instructions
chore(deps): upgrade dependencies
refactor(storage): improve file organization
test(goal): add tests for deadline parsing
perf(recall): optimize semantic search
```

### Release Tag Format
```bash
# Standard releases
git tag -a v1.0.0 -m "Release 1.0.0"
git tag -a v1.1.0 -m "Release 1.1.0"
git tag -a v2.0.0 -m "Release 2.0.0"

# Pre-releases
git tag -a v1.1.0-beta.1 -m "Beta release 1.1.0-beta.1"
git tag -a v1.1.0-rc.1 -m "Release candidate 1.1.0-rc.1"
```

### NPM Token Generation
```bash
# On npmjs.com:
# 1. Log in
# 2. Access Tokens → Generate New Token
# 3. Select "Automation" type
# 4. Copy token
# 5. Add to GitHub: Settings → Secrets → Actions → New secret
# 6. Name: NPM_TOKEN
```

### Testing Release Workflow Locally
```bash
# Install act for local GitHub Actions testing
brew install act

# Run workflow locally
act -W .github/workflows/release.yml

# Note: Some features (secrets, releases) won't work locally
```

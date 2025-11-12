# Implementation Tasks

## 1. Core Update Checker Utility
- [x] 1.1 Create `src/utils/update-checker.ts` with version comparison logic
- [x] 1.2 Implement npm registry API fetch for latest version (with timeout)
- [x] 1.3 Add semver comparison to determine if update is available
- [x] 1.4 Handle network errors gracefully (return null/undefined on failure)
- [x] 1.5 Write unit tests for update checker utility

## 2. Cache Management
- [x] 2.1 Add cache file structure in `.aissist/cache/update-check.json`
- [x] 2.2 Implement cache read/write functions in `src/utils/storage.ts`
- [x] 2.3 Store last check timestamp and latest version in cache
- [x] 2.4 Validate cache expiry (24-hour TTL)
- [x] 2.5 Write unit tests for cache logic

## 3. Configuration Support
- [x] 3.1 Add `updateCheck.enabled` field to config schema
- [x] 3.2 Default `updateCheck.enabled` to `true` if not set
- [x] 3.3 Update `src/commands/config.ts` to support get/set for `updateCheck.enabled`
- [x] 3.4 Add config documentation to README.md

## 4. Startup Integration
- [x] 4.1 Import update checker in `src/index.ts`
- [x] 4.2 Call update check asynchronously after CLI initialization (non-blocking)
- [x] 4.3 Store update check promise without awaiting it
- [x] 4.4 Display notification after command execution if update available
- [x] 4.5 Ensure no performance impact on command execution

## 5. Notification Display
- [x] 5.1 Create notification formatter using chalk for colored output
- [x] 5.2 Display current version and latest version clearly
- [x] 5.3 Include update command: `npm install -g aissist@latest`
- [x] 5.4 Keep notification non-intrusive (single line or small box)
- [x] 5.5 Test notification appearance in terminal

## 6. Testing
- [x] 6.1 Write unit tests for version comparison logic
- [x] 6.2 Write unit tests for cache management
- [x] 6.3 Write unit tests for config get/set operations
- [x] 6.4 Add E2E test for update notification display (mocked registry response)
- [x] 6.5 Add E2E test for disabled update check configuration
- [x] 6.6 Test network timeout and error handling

## 7. Documentation
- [x] 7.1 Update README.md with update check feature description
- [x] 7.2 Document configuration option in README.md
- [x] 7.3 Add inline code comments for update checker utility
- [x] 7.4 Update CHANGELOG.md with new feature

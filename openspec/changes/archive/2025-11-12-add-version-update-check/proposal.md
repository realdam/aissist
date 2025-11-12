# Add Automatic Version Update Check

## Why
Users may miss important updates, bug fixes, and new features if they don't regularly check for new versions. Proactively notifying users of available updates on CLI startup improves the user experience and ensures they benefit from the latest improvements.

## What Changes
- Add automatic npm registry check for new versions on CLI startup
- Display non-intrusive notification when a newer version is available
- Cache check results to avoid excessive network requests (e.g., once per day)
- Make the update check configurable via user settings
- Ensure the check doesn't block or slow down CLI execution (runs asynchronously in background)

## Impact
- Affected specs: `cli-infrastructure`
- Affected code:
  - `src/index.ts` - Add update check on startup
  - `src/utils/update-checker.ts` - New utility for version checking
  - `src/utils/storage.ts` - Cache update check results
  - `src/commands/config.ts` - Add config option to disable checks
  - Tests: Unit tests for update checker, E2E tests for notification behavior

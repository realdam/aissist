# Add Loading Indicator for Goal Codename Generation

## Why

When adding a new goal, users experience an unresponsive CLI while Claude generates the unique codename. This silent processing creates uncertainty about whether the command is working, especially for users with slower network connections or during peak API usage times. A loading indicator will provide immediate feedback and improve perceived responsiveness.

## What Changes

- Add a spinner/loading indicator when generating goal codenames using Claude AI
- Display the indicator immediately after goal text input and before the deadline prompt
- Use the existing `ora` spinner library (already in dependencies) for consistency with other loading operations
- Show clear messaging: "Generating unique codename..."
- Gracefully handle animation disabling via user config

## Impact

- Affected specs: `goal-management`, `cli-infrastructure`
- Affected code: `src/commands/goal.ts:52`, `src/utils/goal-helpers.ts:69`, `src/llm/claude.ts:305-359`
- User experience improvement with no breaking changes
- Minimal code changes (10-15 lines across 2-3 files)

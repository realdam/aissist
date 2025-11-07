# Implementation Tasks

## 1. Add Loading Indicator Utility

- [x] 1.1 Create or update `src/utils/cli.ts` with `withSpinner()` helper function
- [x] 1.2 Function should accept a promise, message, and optional config awareness
- [x] 1.3 Ensure it respects the `config.animations.enabled` setting (like `playCompletionAnimation`)
- [x] 1.4 Return the promise result transparently

## 2. Update Goal Command

- [x] 2.1 Wrap `generateGoalCodename()` call in `src/commands/goal.ts:52` with the spinner
- [x] 2.2 Use message: "Generating unique codename..."
- [x] 2.3 Ensure error handling still works correctly if codename generation fails
- [x] 2.4 Verify the spinner stops before the deadline prompt appears

## 3. Update Goal Helper

- [x] 3.1 Wrap `generateGoalCodename()` call in `src/utils/goal-helpers.ts:69` with the spinner
- [x] 3.2 Use same message for consistency
- [x] 3.3 Ensure error handling propagates correctly

## 4. Testing

- [x] 4.1 Manual test: `aissist goal add "Test goal"` - verify spinner appears and stops before deadline prompt
- [x] 4.2 Manual test: Verify spinner works with animations disabled in config
- [x] 4.3 Test error case: Verify graceful degradation if Claude API fails
- [x] 4.4 Test fast response: Ensure spinner doesn't flicker on quick API responses
- [x] 4.5 Run existing tests: `npm test` to ensure no regressions

## 5. Documentation

- [x] 5.1 Update plugin skill documentation if CLI behavior significantly changed
- [x] 5.2 Verify README examples still accurate

## 6. Haiku Model Integration

- [x] 6.1 Add model parameter support to `executeClaudeCommand()` in `src/llm/claude.ts:50`
- [x] 6.2 Update `generateGoalCodename()` to use Haiku model for faster, cost-effective generation
- [x] 6.3 Test codename generation with Haiku model
- [x] 6.4 Verify spinner works correctly with Haiku's faster response times

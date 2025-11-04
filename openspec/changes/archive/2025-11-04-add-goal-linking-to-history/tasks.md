# Implementation Tasks

## Phase 1: Core Functionality

### Task 1: Add utility to query active goals
- [x] Create `getActiveGoals()` function in `src/utils/storage.ts`
- [x] Query goals from all date files in `goals/` directory
- [x] Exclude goals in `goals/finished/` directory
- [x] Return array of `{codename, text, date}` objects sorted by date descending
- [x] Add unit tests for `getActiveGoals()`

**Validation**: ✓ Unit tests pass, function returns active goals across multiple dates

### Task 2: Add `--goal` flag to history log command
- [x] Modify `src/commands/history.ts` to accept `--goal` boolean option
- [x] Update command description to mention optional goal linking
- [x] Add basic flag handling (no prompt yet)

**Validation**: ✓ `aissist history log "test" --goal` runs without error (even without prompt)

### Task 3: Implement interactive goal selection prompt
- [x] Import `select` from `@inquirer/prompts` in history command
- [x] Create goal selection choices with format: `codename | goal text`
- [x] Add "None - Don't link to a goal" as first choice
- [x] Handle empty goals list with informative message
- [x] Return selected codename or null

**Validation**: ✓ Prompt displays correctly with active goals and None option, returns selection

## Phase 2: Storage & Integration

### Task 4: Store goal metadata in history entries
- [x] Modify history log action to append `\n\nGoal: {codename}` when goal is selected
- [x] Ensure metadata is added after entry text
- [x] Skip metadata line when user selects "None"
- [x] Update success message to include linked goal when present

**Validation**: ✓ History entries with `--goal` flag store goal metadata correctly in Markdown

### Task 5: Handle edge cases
- [x] No active goals available: show message, log without prompting
- [x] User selects "None": log without goal metadata
- [x] Long goal text: truncate in prompt but preserve full text in storage
- [x] Multiline history entries: ensure goal metadata appears at the end

**Validation**: ✓ All edge cases handled gracefully, no crashes or malformed entries

## Phase 3: Testing & Documentation

### Task 6: Add integration tests
- [x] Test history log with `--goal` flag (mock prompt responses)
- [x] Test history log without `--goal` flag (unchanged behavior)
- [x] Test with no active goals available
- [x] Test with user selecting "None"
- [x] Verify Markdown format correctness

**Validation**: ✓ All integration tests pass (75 total tests pass)

### Task 7: Manual testing across scenarios
- [x] Test with actual `.aissist` directory
- [x] Create multiple goals, log history entries linked to different goals
- [x] Verify history entries are readable and goal links are correct
- [x] Test autocomplete/search in inquirer prompt (if applicable)
- [x] Test with both global and local storage modes

**Validation**: ✓ Feature works end-to-end in real usage, UX is smooth

### Task 8: Update user-facing documentation (optional)
- [ ] Update README.md with `--goal` flag usage example
- [ ] Show example history entry format with goal metadata
- [ ] Document that goal linking is optional

**Validation**: Documentation updates marked as optional - can be done separately

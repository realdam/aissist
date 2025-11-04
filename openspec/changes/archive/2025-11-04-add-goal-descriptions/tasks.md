# Tasks

## Implementation Tasks

### 1. Update GoalEntry interface in storage.ts
- [x] Add optional `description: string | null` field to `GoalEntry` interface
- **Validation**: Type check passes, interface compiles
- **Dependencies**: None - can start immediately

### 2. Update parseGoalEntries to extract descriptions
- [x] Modify regex/parsing logic to detect description blocks (markdown blockquotes)
- [x] Extract description content and populate `GoalEntry.description` field
- [x] Ensure backward compatibility - handle goals without descriptions
- **Validation**: Unit tests pass for both goals with and without descriptions
- **Dependencies**: Task 1 (interface must exist)

### 3. Add updateGoalDescription function to storage.ts
- [x] Create helper function to find and update goal entry description by codename
- [x] Handle adding new descriptions, updating existing ones, and removing descriptions
- [x] Preserve other goal metadata (codename, timestamp, deadline)
- **Validation**: Unit tests cover add/update/remove scenarios
- **Dependencies**: Task 2 (parsing must work)

### 4. Add -D/--description flag to goal add command
- [x] Add option to `goal add` command in goal.ts
- [x] Append description as markdown blockquote when provided
- [x] Test with multiline descriptions
- **Validation**: Manual test - `goal add "Test" -D "Description"` works
- **Dependencies**: Task 1 (interface), Task 2 (parsing)

### 5. Add "Edit Description" action to interactive menu
- [x] Add new choice in interactive goal management menu (line ~274 in goal.ts)
- [x] Prompt user for description text using `@inquirer/prompts.input`
- [x] Call `updateGoalDescription` with the entered text
- [x] Display success/error messages
- **Validation**: Manual test - interactive menu shows option and works correctly
- **Dependencies**: Task 3 (updateGoalDescription must exist)

### 6. Update interactive list display to show descriptions
- [x] Modify goal list display (line ~224-244 in goal.ts) to include description preview
- [x] Truncate descriptions to ~40 characters with ellipsis
- [x] Add description to choice details or separate line
- **Validation**: Manual test - descriptions appear correctly in list
- **Dependencies**: Task 2 (parsing)

### 7. Add comprehensive tests
- [x] Test `parseGoalEntries` with descriptions
- [x] Test `updateGoalDescription` for add/update/remove
- [x] Test backward compatibility with goals without descriptions
- [x] Test multiline descriptions
- **Validation**: All tests pass with `npm test`
- **Dependencies**: Tasks 2, 3 (functions to test must exist)

### 8. Update goal-management spec with MODIFIED requirements
- [ ] Add spec deltas to `openspec/specs/goal-management/spec.md`
- [ ] Document new requirements from goal-description spec
- [ ] Mark as MODIFIED sections
- **Validation**: `openspec validate add-goal-descriptions --strict` passes
- **Dependencies**: All implementation tasks (code must match spec)

## Sequencing Notes
- Tasks 1-3 are foundational and should be done sequentially
- Task 4 and Tasks 5-6 can be done in parallel after Tasks 1-3 complete
- Task 7 should be done incrementally as each function is implemented
- Task 8 is final validation before proposal completion

# Add Goal Descriptions

## Why

Currently, goals only have a title/text field, which may not provide enough context for detailed goals. Users often need to add supplementary information, notes, or detailed context to their goals that doesn't fit well in the main goal text. This leads to:
- Goals with overly long single-line text that's hard to scan
- Lack of space to add implementation notes, sub-tasks, or clarifications
- Reduced ability to distinguish between goal summary and goal details

Adding an optional description field will enable users to:
1. Keep goal titles concise and scannable
2. Add detailed context, notes, or sub-tasks in the description
3. Better organize their thinking around each goal
4. Maintain clean separation between what the goal is (title) and how/why (description)

This enhancement aligns with Aissist's philosophy of providing flexible, human-readable goal management while maintaining the simplicity of the current system.

## What Changes

This proposal adds an optional description field to goals with the following capabilities:

- **Description Flag**: Add `-D, --description <text>` flag to `goal add` command for adding descriptions at creation time
- **Interactive Description Entry**: Add "Edit Description" action to the interactive goal management menu
- **Description Display**: Show descriptions in interactive list view (truncated preview)
- **Storage Format**: Store descriptions as additional markdown content below the goal text
- **GoalEntry Interface**: Extend the `GoalEntry` type to include optional `description` field

The description field is optional and backward compatible - existing goals without descriptions continue to work as before.

## Impact

### Affected Specs
- **MODIFIED**: goal-management (add description field and management actions)

### Affected Code
- `src/commands/goal.ts` - Add description flag to `add` command and interactive description management
- `src/utils/storage.ts` - Update `GoalEntry` interface and `parseGoalEntries` to handle descriptions
- `src/utils/storage.ts` - Add `updateGoalDescription` function

### Dependencies Added
None - uses existing dependencies

### User Impact
- Users can add optional descriptions when creating goals via `-D` flag
- Interactive goal management includes "Edit Description" action
- Existing goals without descriptions continue to work unchanged
- Descriptions are stored in human-readable markdown format
- All data remains Git-compatible and easily editable by hand

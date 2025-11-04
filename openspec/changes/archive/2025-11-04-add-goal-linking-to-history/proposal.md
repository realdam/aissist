# Add Goal Linking to History

## Why

Currently, history entries are isolated logs without any connection to goals. Users cannot easily see which daily activities contribute to their goals, making it difficult to:

- Track progress on specific goals
- Review goal-related activities later
- Understand the relationship between daily work and objectives

Adding optional goal linking to history entries will enable users to:

1. Associate daily activities with specific goals
2. Review which work contributed to each goal
3. Maintain context between daily logs and long-term objectives
4. Optionally organize history entries by goal for better tracking

This enhancement aligns with Aissist's existing goal management features (codenames, deadlines) by creating a bidirectional relationship between goals and daily history.

## What Changes

This proposal enhances the history tracking system with the following capabilities:

- **Optional Goal Linking**: Add `--goal` flag to `history log` command to trigger interactive goal selection
- **Active Goal Query**: Query all active (non-completed) goals across all dates for linking
- **Interactive Selection**: Use inquirer prompts to display goals with format `codename | goal text`
- **Metadata Storage**: Store linked goal as metadata line `Goal: codename` in history entries
- **Skip Option**: Allow users to select "None" to log history without linking

The system will maintain backward compatibility with existing history files. Goal linking is entirely optional.

## Impact

### Affected Specs

- **MODIFIED**: history-tracking (add goal linking capability)

### Affected Code

- `src/commands/history.ts` - Add `--goal` flag and interactive prompt logic
- `src/utils/storage.ts` - Add `getActiveGoals()` utility function

### Dependencies Added

None - uses existing dependencies (@inquirer/prompts for selection, existing goal parsing utilities)

### User Impact

- Users can optionally link history entries to goals using the `--goal` flag
- Interactive prompt makes it easy to select from active goals
- History entries with goal links provide better context when reviewed
- Existing history log behavior unchanged when `--goal` flag is not used
- All data remains human-readable and Git-compatible

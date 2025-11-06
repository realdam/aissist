# Proposal: fix-default-list-show-behavior

## Why

Currently, `aissist goal list` and `aissist history show` default to showing only today's data when no date/timeframe is specified. This creates a poor user experience because:

1. **Goals are long-lived**: Users expect `goal list` to show all active (unfinished) goals, not just goals created today
2. **History spans time**: Users expect `history show` to show their full timeline, not just today's entries
3. **Confusing defaults**: New users who add goals and history over multiple days are confused when commands show nothing

The current behavior forces users to either:
- Remember to use `--date` flags every time
- Only use the commands on the same day they create data
- Not understand why their data "disappeared"

## What Changes

Change the default behavior for list/show commands:

**Before**:
```bash
aissist goal list          # Shows only today's goals
aissist history show       # Shows only today's history
```

**After**:
```bash
aissist goal list          # Shows ALL active (unfinished) goals
aissist history show       # Shows ALL history entries

# Still support date filtering
aissist goal list --date 2025-11-06
aissist history show --date 2025-11-06
```

### Specs Affected

- `goal-management`: Update "Goal Visibility" requirement
- `history-tracking`: Update "History Retrieval" requirement

### Implementation Approach

1. **goal list**: Use existing `getActiveGoals(storagePath)` which already reads all dates
2. **history show**: Read all history files from `history/` directory and concatenate chronologically

## User Benefits

- **Intuitive defaults**: Commands work as users expect out of the box
- **Less friction**: No need to remember special flags for normal usage
- **Better onboarding**: New users immediately see their accumulated data
- **Consistent with tools**: Matches behavior of git log, ls, etc. (show all by default)

## Backward Compatibility

- ✅ Existing `--date` flag still works for filtered views
- ✅ No breaking changes to command syntax
- ✅ Improves UX without removing functionality

## Alternatives Considered

1. **Add --all flag**: Rejected - makes the common case harder
2. **Keep current behavior**: Rejected - violates principle of least surprise
3. **Default to "this week"**: Rejected - arbitrary cutoff, still confusing

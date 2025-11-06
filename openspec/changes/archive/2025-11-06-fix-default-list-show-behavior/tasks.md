# Tasks: fix-default-list-show-behavior

## Implementation Order

### Phase 1: Goal List Command
- [ ] 1. **Refactor goal list to use getActiveGoals()**
   - Replace date-specific file reading with `getActiveGoals(storagePath)`
   - Remove `getCurrentDate()` default
   - Keep `--date` option for filtered view (read specific date file)
   - Update interactive mode to handle cross-date goals
   - **Validation**: Manual test showing goals from multiple dates

### Phase 2: History Show Command
- [ ] 2. **Implement all-history reading function**
   - Create `getAllHistory(storagePath): Promise<HistoryEntry[]>` in storage.ts
   - Read all files from `history/` directory
   - Parse and concatenate entries chronologically (newest first)
   - **Validation**: Unit test with sample history across dates

- [ ] 3. **Refactor history show to read all by default**
   - Use `getAllHistory()` when no `--date` flag provided
   - Keep date-specific behavior when `--date` is passed
   - Format output with date separators for readability
   - **Validation**: Manual test showing history from multiple dates

### Phase 3: Spec Updates
- [ ] 4. **Update goal-management spec**
   - Change "List today's goals" → "List all active goals"
   - Update scenarios to reflect new behavior
   - **Validation**: openspec validate

- [ ] 5. **Update history-tracking spec**
   - Change "View today's history" → "View all history entries"
   - Update scenarios to reflect new behavior
   - **Validation**: openspec validate

### Phase 4: Documentation
- [ ] 6. **Update CLI help text**
   - Update `goal list` description: "List all active goals"
   - Update `history show` description: "Show all history entries"
   - Clarify `--date` flag usage in help text
   - **Validation**: Run `aissist goal --help` and verify

- [ ] 7. **Update README examples**
   - Update command examples to reflect new default behavior
   - Add note about `--date` for filtered views
   - **Validation**: Manual review

- [ ] 8. **Update CLI skill documentation**
   - Update examples in SKILL.md
   - Clarify default vs. filtered behavior
   - **Validation**: Manual review

## Dependencies
- Task 1 is independent (uses existing `getActiveGoals`)
- Tasks 2-3 are sequential (task 3 depends on task 2)
- Tasks 4-5 can be done in parallel after implementation
- Tasks 6-8 can be done in parallel after spec updates

## User-Visible Milestones
- **Milestone 1**: After task 1 - `goal list` shows all goals
- **Milestone 2**: After task 3 - `history show` shows all history
- **Milestone 3**: After task 8 - Complete documentation updated

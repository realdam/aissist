# add-proposal-item-selection

## Why

After Claude generates proposals, users currently have no control over which specific proposal items get converted into todos or goals. All numbered items are automatically saved, which may include items the user wants to skip or handle differently.

## What Changes

- Add an interactive multi-select checkbox step after the user chooses "Create TODOs" or "Save as goals"
- Display all numbered proposal items with checkboxes (all selected by default)
- Allow users to deselect items they don't want to convert
- Only create todos/goals for the selected items
- Maintain goal linking metadata for selected items

## Impact

- Affected specs: `todo-management` (modifies "Propose Command Integration" requirement)
- Affected code: `src/commands/propose.ts` (functions `saveProposalsAsTodos` and `saveProposalsAsGoals`)
- User Experience: Adds one additional interactive step, but with smart defaults (all selected) for quick workflow

# Implementation Tasks

## 1. Refactor Proposal Parsing

- [x] 1.1 Extract proposal item parsing logic into a shared utility function
- [x] 1.2 Return structured array of proposal items (text + index) for reuse
- [x] 1.3 Update both `saveProposalsAsTodos` and `saveProposalsAsGoals` to use the shared parser

## 2. Add Interactive Selection for Todos

- [x] 2.1 Import `checkbox` from `@inquirer/prompts` in propose.ts
- [x] 2.2 Modify `saveProposalsAsTodos` to extract proposals using shared utility
- [x] 2.3 Create checkbox choices with proposal text and value as index
- [x] 2.4 Set all checkboxes to `checked: true` by default
- [x] 2.5 Display checkbox prompt with clear instructions (Space to toggle, Enter to confirm)
- [x] 2.6 Handle empty selection case with informative message
- [x] 2.7 Handle cancellation (ExitPromptError) gracefully
- [x] 2.8 Only create todos for selected indices
- [x] 2.9 Update success message to show count of selected items

## 3. Add Interactive Selection for Goals

- [x] 3.1 Modify `saveProposalsAsGoals` to extract proposals using shared utility
- [x] 3.2 Create checkbox choices with proposal text
- [x] 3.3 Set all checkboxes to `checked: true` by default
- [x] 3.4 Display checkbox prompt
- [x] 3.5 Handle empty selection and cancellation
- [x] 3.6 Only create goals for selected items
- [x] 3.7 Update success message with count

## 4. Testing

- [x] 4.1 Test propose flow with todo creation and selecting all items
- [x] 4.2 Test propose flow with todo creation and selecting subset of items
- [x] 4.3 Test propose flow with todo creation and deselecting all items
- [x] 4.4 Test cancellation during checkbox selection
- [x] 4.5 Test goal creation with selection
- [x] 4.6 Verify goal linkage is preserved for selected items
- [x] 4.7 Test with proposals that have no numbered items

## 5. Documentation

- [x] 5.1 Update inline code comments for new selection flow
- [x] 5.2 Verify error messages are clear and actionable

# Tasks: Save Proposals as Markdown Files

## Implementation Checklist

- [x] **Update storage utilities** (`src/utils/storage.ts`)
  - Add `proposals` folder to storage initialization
  - Ensure `proposals/` is created during `init` command

- [x] **Create proposal export function** (`src/commands/propose.ts`)
  - Add `saveProposalAsMarkdown()` function
  - Format proposal with metadata header (timestamp, timeframe, tag, goal)
  - Use `appendToMarkdown()` for dated file storage
  - Add horizontal rule separator between multiple proposals on same day

- [x] **Update interactive menu** (`src/commands/propose.ts`)
  - Modify `select` prompt to include "Save as Markdown" option
  - Add action handler for 'markdown' case
  - Call `saveProposalAsMarkdown()` when selected

- [x] **Update success messages** (`src/commands/propose.ts`)
  - Display confirmation with file path when proposal is saved
  - Use consistent messaging patterns with other save operations

- [x] **Test the feature**
  - Test saving a proposal as Markdown
  - Test appending multiple proposals to the same day's file
  - Test with various filters (--tag, --goal)
  - Verify folder creation on first use
  - Test cancellation handling

- [x] **Update documentation** (`aissist-plugin/README.md`)
  - Document the new "Save as Markdown" option
  - Add example of saved proposal format
  - Update workflow examples if needed

## Implementation Notes

- Follow existing patterns in `saveProposalsAsTodos()` and `saveProposalsAsGoals()`
- Use `getCurrentDate()` and `getCurrentTime()` for timestamps
- Use `join(storagePath, 'proposals', ...)` for file paths
- Reuse `appendToMarkdown()` utility for file writing
- The full `response` text should be preserved (no parsing needed)

## Dependencies

- No dependencies; this is a standalone feature addition
- Works with existing storage and prompt utilities

## Validation

- [x] Run `openspec validate add-proposal-markdown-export --strict`
- [x] Resolve any validation errors
- [x] Ensure all scenarios are testable

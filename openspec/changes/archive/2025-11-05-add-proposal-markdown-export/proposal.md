# Proposal: Save Proposals as Markdown Files

## Summary
Add the ability for users to save AI-generated proposals as Markdown files in a dedicated `proposals/` folder within their `.aissist/` storage directory. This extends the existing interactive post-proposal flow to include a new "Save as Markdown" option alongside the current "Create TODOs" and "Save as goals" options.

## Motivation
Currently, after Claude generates a proposal, users can only:
1. Create TODOs from the proposal
2. Save proposals as goals
3. Skip saving

However, users may want to preserve the full proposal output as a standalone Markdown document for:
- Reference and planning documentation
- Sharing with others (proposals folder can be committed to Git)
- Historical record of planning sessions
- Integration with external tools that work with Markdown files

## Goals
- Add a `proposals/` folder to the `.aissist/` storage structure
- Extend the post-proposal interactive menu with a "Save as Markdown" option
- Save the full proposal response with metadata (timestamp, timeframe, filters)
- Follow existing patterns for Markdown storage (dated files, human-readable format)

## Non-Goals
- Modifying the proposal generation logic itself
- Adding export to other formats (PDF, HTML, etc.)
- Creating a dedicated proposal management system

## Success Criteria
- Users can select "Save as Markdown" after proposal generation
- Proposals are saved to `.aissist/proposals/YYYY-MM-DD.md` with timestamps
- Saved files include the full proposal text plus metadata header
- The feature integrates seamlessly with existing interactive flow

## Affected Capabilities
- `ai-planning`: Add Markdown export to post-proposal actions
- `storage-system`: Add proposals folder to storage structure

## Related Changes
- None (standalone feature addition)

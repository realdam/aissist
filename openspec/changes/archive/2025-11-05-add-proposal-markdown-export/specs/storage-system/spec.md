# storage-system Spec Delta

## ADDED Requirements

### Requirement: Proposals Folder Storage
The system SHALL provide a dedicated storage location for AI-generated proposal documents.

#### Scenario: Initialize proposals folder
- **WHEN** the user runs `aissist init` or first saves a proposal
- **THEN** the system creates a `proposals/` subdirectory in `.aissist/`
- **AND** the folder is structured for date-based Markdown files

#### Scenario: Store proposals as dated Markdown files
- **WHEN** a proposal is saved
- **THEN** the system stores it in `.aissist/proposals/YYYY-MM-DD.md`
- **AND** the file follows the same date-based naming convention as other storage types
- **AND** the file is human-readable Markdown format
- **AND** multiple proposals on the same day are appended to the same file

#### Scenario: Proposal file format
- **WHEN** writing a proposal to a Markdown file
- **THEN** the file includes:
  - A level-2 heading with timestamp (e.g., `## Proposal at 14:30`)
  - Metadata section with timeframe, tag filters, and goal links
  - The complete proposal text from Claude
  - A horizontal rule separator if appending to existing content

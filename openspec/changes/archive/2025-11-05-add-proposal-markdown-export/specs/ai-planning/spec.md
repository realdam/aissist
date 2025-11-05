# ai-planning Spec Delta

## ADDED Requirements

### Requirement: Save Proposals as Markdown Files
The system SHALL allow users to save AI-generated proposals as Markdown files in a dedicated proposals folder.

#### Scenario: Offer Markdown save option in interactive menu
- **WHEN** a proposal is successfully generated
- **THEN** the system displays an interactive menu with options:
  - "Create TODOs (recommended)"
  - "Save as goals"
  - "Save as Markdown"
  - "Skip"

#### Scenario: User selects "Save as Markdown"
- **WHEN** the user selects "Save as Markdown" from the post-proposal menu
- **THEN** the system saves the full proposal response to `.aissist/proposals/YYYY-MM-DD.md`
- **AND** the file includes a metadata header with:
  - Proposal generation timestamp
  - Timeframe (e.g., "today", "Q1 2026")
  - Any applied filters (tag, goal link)
- **AND** the file contains the complete proposal text from Claude
- **AND** the system displays a success message: "Proposal saved to proposals/YYYY-MM-DD.md"

#### Scenario: Multiple proposals saved on the same day
- **WHEN** a user generates multiple proposals on the same day
- **THEN** the system appends each proposal to the existing `YYYY-MM-DD.md` file
- **AND** separates proposals with a horizontal rule (`---`)
- **AND** each proposal has its own timestamp header

#### Scenario: User cancels Markdown save
- **WHEN** the user is prompted to save as Markdown but cancels (Ctrl+C)
- **THEN** the system displays "Cancelled" and exits without saving
- **AND** no proposal file is created or modified

#### Scenario: Proposals folder doesn't exist
- **WHEN** saving a proposal as Markdown for the first time
- **THEN** the system creates the `.aissist/proposals/` directory if it doesn't exist
- **AND** saves the proposal file normally

## MODIFIED Requirements

### Requirement: Interactive Proposal Follow-up
The system SHALL offer interactive actions after displaying the proposal.

#### Scenario: Offer post-proposal actions (MODIFIED)
- **WHEN** a proposal is successfully generated
- **THEN** the system prompts: "What would you like to do with these proposals?"
- **AND** offers the following options:
  - "Create TODOs (recommended)" [default]
  - "Save as goals"
  - "Save as Markdown" [NEW]
  - "Skip"

#### Scenario: User accepts goal saving
- **WHEN** the user confirms goal saving
- **THEN** the system parses proposed items and creates dated goal entries using `aissist goal add` logic

#### Scenario: User declines or skips
- **WHEN** the user selects "Skip" or cancels
- **THEN** the system exits without modifying storage

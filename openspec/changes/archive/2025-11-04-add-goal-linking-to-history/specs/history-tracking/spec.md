# history-tracking Spec Deltas

## ADDED Requirements

### Requirement: Link History Entries to Goals
The system SHALL allow users to optionally link history entries to active goals through an interactive prompt.

#### Scenario: Log history with goal flag
- **WHEN** the user runs `aissist history log "Completed code review" --goal`
- **THEN** the system displays an interactive prompt showing all active goals
- **AND** allows the user to select a goal by codename or goal text
- **AND** allows the user to skip linking by selecting "None"
- **AND** stores the linked goal as metadata in the history entry

#### Scenario: Display goals in selection prompt
- **WHEN** the interactive goal selection prompt is shown
- **THEN** each goal is displayed with format: `codename | goal text`
- **AND** goals are listed with most recent first
- **AND** only active (non-completed) goals are shown
- **AND** goals from all dates are included, not just today's goals

#### Scenario: Store goal link in history entry
- **WHEN** a user selects a goal to link
- **THEN** the history entry includes a metadata line: `Goal: codename`
- **AND** the metadata line appears after the entry text
- **AND** follows the same format pattern as goal deadlines

#### Scenario: Log history without goal flag
- **WHEN** the user runs `aissist history log "text"` without the `--goal` flag
- **THEN** the system logs the history entry normally
- **AND** does not prompt for goal selection
- **AND** no goal metadata is added

#### Scenario: No active goals available
- **WHEN** the user uses the `--goal` flag but no active goals exist
- **THEN** the system displays a message: "No active goals found"
- **AND** logs the history entry without goal metadata
- **AND** does not show an empty selection prompt

#### Scenario: Skip goal linking in prompt
- **WHEN** the user selects "None" or "Skip" in the goal selection prompt
- **THEN** the system logs the history entry without goal metadata
- **AND** displays success message without goal information

## MODIFIED Requirements

### Requirement: Log History Entries
The system SHALL allow users to log daily activities and events to dated Markdown files with optional goal linking.

#### Scenario: Log history entry
- **WHEN** the user runs `aissist history log "Completed code review"`
- **THEN** the system appends the entry to history/YYYY-MM-DD.md with a timestamp
- **AND** supports optional goal linking via the `--goal` flag

#### Scenario: Log multiline entry
- **WHEN** the user logs a history entry with multiline text
- **THEN** the system preserves the multiline formatting in the Markdown file
- **AND** goal metadata (if present) appears after all entry text

#### Scenario: Multiple entries same day
- **WHEN** the user logs multiple entries on the same day
- **THEN** each entry is appended chronologically with its own timestamp
- **AND** each entry can have its own independent goal link or no link

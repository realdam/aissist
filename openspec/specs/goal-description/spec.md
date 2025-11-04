# goal-description Specification

## Purpose
Enable users to add optional detailed descriptions to their goals, providing additional context, notes, or sub-tasks beyond the goal title while maintaining backward compatibility with existing goals.
## Requirements
### Requirement: Add Goal with Description Flag
The system SHALL allow users to add optional descriptions when creating goals using a command-line flag.

#### Scenario: Add goal with description via flag
- **WHEN** the user runs `aissist goal add "Complete project proposal" -D "Include sections on timeline, budget, and deliverables"`
- **THEN** the system creates a goal entry with both the goal text and the description
- **AND** stores the description as additional markdown content

#### Scenario: Add goal without description
- **WHEN** the user runs `aissist goal add "Review documentation"` without the -D flag
- **THEN** the system creates a goal entry without a description field
- **AND** the goal functions identically to pre-existing goals

#### Scenario: Add goal with multiline description
- **WHEN** the user runs `aissist goal add "Launch product" -D "Phase 1: Beta testing\nPhase 2: Marketing\nPhase 3: Public launch"`
- **THEN** the system preserves the multiline formatting in the description

### Requirement: Interactive Description Management
The system SHALL allow users to add or edit goal descriptions through the interactive goal management interface.

#### Scenario: Add description to existing goal
- **WHEN** the user selects a goal in interactive mode that has no description
- **AND** chooses the "Edit Description" action
- **AND** enters description text
- **THEN** the system adds the description to the goal entry

#### Scenario: Update existing description
- **WHEN** the user selects a goal in interactive mode that already has a description
- **AND** chooses the "Edit Description" action
- **AND** enters new description text
- **THEN** the system replaces the old description with the new one

#### Scenario: Remove description
- **WHEN** the user selects a goal in interactive mode
- **AND** chooses the "Edit Description" action
- **AND** enters an empty string
- **THEN** the system removes the description from the goal

### Requirement: Description Storage Format
The system SHALL store goal descriptions in a structured markdown format that preserves readability and editability.

#### Scenario: Format goal entry with description
- **WHEN** a goal with a description is stored
- **THEN** the entry format is:
  ```
  ## HH:MM - codename

  Goal text

  > Description text

  Deadline: YYYY-MM-DD (if present)
  ```

#### Scenario: Parse goal entry with description
- **WHEN** the system reads a goal file
- **THEN** it correctly extracts goal text and description as separate fields
- **AND** handles goals without descriptions (backward compatible)

### Requirement: Description Display
The system SHALL display goal descriptions in the interactive list view with appropriate formatting.

#### Scenario: Display goal with description in list
- **WHEN** the user views goals in interactive mode
- **AND** a goal has a description
- **THEN** the list shows a truncated preview (e.g., first 40 characters)
- **AND** indicates there is more content with ellipsis if truncated

#### Scenario: Display full description in detail view
- **WHEN** the user selects a goal in interactive mode
- **THEN** the system displays the full goal text and complete description
- **AND** clearly separates them visually

#### Scenario: Display goal without description
- **WHEN** the user views a goal without a description in interactive mode
- **THEN** the system displays only the goal text
- **AND** does not show empty description fields


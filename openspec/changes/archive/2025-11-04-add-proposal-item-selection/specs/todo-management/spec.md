## MODIFIED Requirements

### Requirement: Propose Command Integration

The system SHALL offer to create todos after generating proposals in the propose command.

#### Scenario: Offer todo creation after proposal

- **WHEN** the propose command completes successfully
- **THEN** the system offers three options via interactive prompt:
  1. "Create TODO (recommended)"
  2. "Link to goal"
  3. "Create goal"
  4. "Skip"
- **AND** if user selects "Create TODO", parse proposal items and present multi-select checkbox
- **AND** link to the proposal's goal if one was specified

#### Scenario: Select proposals to convert to todos

- **WHEN** user selects "Create TODO" from the post-proposal menu
- **THEN** the system extracts numbered items (1., 2., 3., etc.) from the proposal
- **AND** displays them in a checkbox interface with all items selected by default
- **AND** allows user to deselect items using Space key
- **AND** creates todos only for the selected items when user confirms with Enter
- **AND** preserves goal linkage from the proposal for selected items

#### Scenario: Select proposals to convert to goals

- **WHEN** user selects "Save as goals" from the post-proposal menu
- **THEN** the system extracts numbered items from the proposal
- **AND** displays them in a checkbox interface with all items selected by default
- **AND** allows user to deselect items using Space key
- **AND** creates goals only for the selected items when user confirms with Enter
- **AND** preserves goal linkage from the proposal for selected items

#### Scenario: Cancel selection

- **WHEN** user cancels the checkbox selection (ESC or Ctrl+C)
- **THEN** the system displays "Selection cancelled"
- **AND** does not create any todos or goals
- **AND** exits gracefully

#### Scenario: No items selected

- **WHEN** user deselects all items and confirms
- **THEN** the system displays "No items selected"
- **AND** does not create any todos or goals

#### Scenario: Parse proposals into todos

- **WHEN** creating todos from selected proposals
- **THEN** the system creates one todo per selected item
- **AND** preserves goal linkage from the proposal
- **AND** displays count of todos created

#### Scenario: Skip todo creation

- **WHEN** user selects "Skip" from the post-proposal menu
- **THEN** the propose command exits without creating todos or goals
- **AND** displays: "Proposals not saved"

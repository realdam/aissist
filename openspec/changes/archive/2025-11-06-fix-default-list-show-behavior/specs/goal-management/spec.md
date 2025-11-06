# goal-management Specification Delta

## MODIFIED Requirements

### Requirement: Goal Visibility
The system SHALL allow users to view their stored goals, defaulting to all active goals unless a specific date is requested.

**Changes**: Changed default behavior from showing today's goals to showing all active goals across all dates.

#### Scenario: List all active goals by default
- **WHEN** the user runs `aissist goal list`
- **THEN** the system displays all active (unfinished) goals from all dates
- **AND** sorts goals by date (most recent first)
- **AND** includes goals with codenames across all goal files

#### Scenario: List goals for specific date
- **WHEN** the user runs `aissist goal list --date YYYY-MM-DD`
- **THEN** the system displays only goals from the specified date
- **AND** behavior is unchanged from previous implementation

#### Scenario: No goals found
- **WHEN** no active goals exist in any date file
- **THEN** the system displays a message indicating no goals were found
- **AND** suggests adding a goal with `aissist goal add`

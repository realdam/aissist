# interactive-deadline-prompt Specification

## Purpose
Enable users to set deadlines for goals during creation using natural language input with an interactive prompt, improving user experience and feature discoverability. This capability provides a frictionless way to add deadlines with smart defaults and flexible input options.
## Requirements
### Requirement: Interactive Deadline Prompt on Goal Creation
The system SHALL prompt the user for a deadline immediately after adding a goal, with "Tomorrow" as the default value.

#### Scenario: User accepts default deadline
- **GIVEN** the user runs `aissist goal add "Complete project proposal"`
- **AND** the system generates a codename for the goal
- **WHEN** the system prompts "Enter deadline (default: Tomorrow):"
- **AND** the user presses Enter without typing anything
- **THEN** the system sets the deadline to tomorrow's date in YYYY-MM-DD format
- **AND** displays "Goal added with codename: [codename]" and "Deadline: YYYY-MM-DD"

#### Scenario: User enters natural language deadline
- **GIVEN** the user runs `aissist goal add "Review quarterly goals"`
- **AND** the system generates a codename for the goal
- **WHEN** the system prompts "Enter deadline (default: Tomorrow):"
- **AND** the user enters "next week"
- **THEN** the system parses "next week" to the last day of next week in YYYY-MM-DD format
- **AND** displays the goal confirmation with the parsed deadline date

#### Scenario: User enters ISO date deadline
- **GIVEN** the user runs `aissist goal add "Submit report"`
- **AND** the system generates a codename for the goal
- **WHEN** the system prompts "Enter deadline (default: Tomorrow):"
- **AND** the user enters "2025-12-31"
- **THEN** the system accepts the ISO date format
- **AND** stores the deadline as "2025-12-31"

#### Scenario: User skips deadline by entering empty string
- **GIVEN** the user runs `aissist goal add "Explore new ideas"`
- **AND** the system generates a codename for the goal
- **WHEN** the system prompts "Enter deadline (default: Tomorrow):"
- **AND** the user types a space or other whitespace and presses Enter
- **THEN** the system treats it as "skip" and adds the goal without a deadline
- **AND** displays "Goal added with codename: [codename]" without a deadline message

#### Scenario: User provides invalid deadline format
- **GIVEN** the user runs `aissist goal add "Learn TypeScript"`
- **AND** the system generates a codename for the goal
- **WHEN** the system prompts "Enter deadline (default: Tomorrow):"
- **AND** the user enters "invalid date"
- **THEN** the system displays an error message with supported format examples
- **AND** re-prompts for the deadline

### Requirement: Backward Compatibility with Flag-Based Deadline
The system SHALL skip the interactive deadline prompt when the user provides the `-d` flag.

#### Scenario: User provides deadline via -d flag
- **GIVEN** the user runs `aissist goal add "Finish coding" -d 2025-11-10`
- **WHEN** the system processes the command
- **THEN** the system does NOT prompt for a deadline interactively
- **AND** uses the provided flag value "2025-11-10" as the deadline
- **AND** validates the date format as before

#### Scenario: User provides invalid deadline via -d flag
- **GIVEN** the user runs `aissist goal add "Test feature" -d tomorrow`
- **WHEN** the system processes the command
- **THEN** the system displays an error "Invalid date format: tomorrow. Use YYYY-MM-DD format."
- **AND** does NOT add the goal
- **AND** does NOT prompt interactively (maintains current behavior)

### Requirement: Natural Language Deadline Parsing
The system SHALL support natural language deadline inputs using the existing timeframe parser.

#### Scenario: Parse "tomorrow" as deadline
- **WHEN** the user enters "tomorrow" at the deadline prompt
- **THEN** the system converts it to the next day's date in YYYY-MM-DD format
- **AND** stores it as the goal deadline

#### Scenario: Parse "next week" as deadline
- **WHEN** the user enters "next week" at the deadline prompt
- **THEN** the system converts it to the end of next week (Sunday) in YYYY-MM-DD format
- **AND** stores it as the goal deadline

#### Scenario: Parse "this month" as deadline
- **WHEN** the user enters "this month" at the deadline prompt
- **THEN** the system converts it to the last day of the current month in YYYY-MM-DD format
- **AND** stores it as the goal deadline

#### Scenario: Parse "next 7 days" as deadline
- **WHEN** the user enters "next 7 days" at the deadline prompt
- **THEN** the system converts it to 7 days from today in YYYY-MM-DD format
- **AND** stores it as the goal deadline

#### Scenario: Parse "2026 Q1" as deadline
- **WHEN** the user enters "2026 Q1" at the deadline prompt
- **THEN** the system converts it to the last day of Q1 2026 (2026-03-31) in YYYY-MM-DD format
- **AND** stores it as the goal deadline


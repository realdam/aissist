# goal-management Specification Delta

## ADDED Requirements

### Requirement: Loading Indicator During Codename Generation
The system SHALL display a loading indicator while generating unique codenames to provide user feedback during AI processing.

#### Scenario: Display spinner during codename generation
- **WHEN** the user runs `aissist goal add "Complete project proposal"`
- **THEN** the system displays a loading indicator with message "Generating unique codename..."
- **AND** the indicator is shown immediately after goal text is captured
- **AND** the indicator stops before prompting for deadline
- **AND** the generated codename is displayed after the indicator completes

#### Scenario: Respect animation config during codename loading
- **WHEN** the user has disabled animations via config (`animations.enabled = false`)
- **AND** the user adds a goal
- **THEN** the system skips the visual spinner
- **AND** still generates the codename normally
- **AND** provides simple text feedback or no feedback during generation

#### Scenario: Handle fast API responses gracefully
- **WHEN** the Claude API responds quickly (< 500ms)
- **THEN** the loading indicator appears briefly without flickering
- **AND** the user experience remains smooth
- **AND** the codename result is displayed normally

#### Scenario: Handle slow API responses with feedback
- **WHEN** the Claude API takes longer than expected (> 5 seconds)
- **THEN** the loading indicator continues spinning
- **AND** provides reassurance that the system is still working
- **AND** does not timeout prematurely

#### Scenario: Loading indicator stops on error
- **WHEN** the codename generation fails due to API error
- **THEN** the loading indicator stops immediately
- **AND** an error message is displayed
- **AND** the user is informed that codename generation failed

## MODIFIED Requirements

### Requirement: Codename Generation
The system SHALL use Claude AI to generate meaningful, unique kebab-case codenames for goals with visual feedback during processing.

**Changes**: Added requirement for loading indicator during generation process.

#### Scenario: Generate codename from goal text
- **WHEN** a new goal is added
- **THEN** the system displays a loading indicator with message "Generating unique codename..."
- **AND** sends the goal text to Claude with instructions to generate a short, meaningful kebab-case identifier
- **AND** ensures the codename is unique within the day's goals
- **AND** stops the loading indicator once generation completes
- **AND** stores the codename with the goal

#### Scenario: Codename length constraint
- **WHEN** generating a codename
- **THEN** the codename should be 1-4 words in kebab-case
- **AND** should capture the core meaning of the goal
- **AND** should be memorable and easy to type

#### Scenario: Codename uniqueness check
- **WHEN** generating a codename
- **THEN** the system checks existing goals in the day's file
- **AND** if the codename exists, instructs Claude to generate an alternative
- **OR** appends a numeric suffix

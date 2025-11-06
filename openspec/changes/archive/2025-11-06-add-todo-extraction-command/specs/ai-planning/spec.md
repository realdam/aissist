# Spec Delta: ai-planning

This delta extends the ai-planning capability to support AI-powered todo extraction from freeform context via a Claude Code plugin slash command.

## ADDED Requirements

### Requirement: Todo Extraction from Context
The system SHALL provide a Claude Code plugin slash command that extracts actionable tasks from freeform context using AI analysis.

#### Scenario: Extract tasks from text context
- **WHEN** the user runs `/aissist:todo "Review API endpoints for security, update docs, and write tests"`
- **THEN** Claude AI analyzes the context and identifies distinct actionable tasks
- **AND** each task is created via `aissist todo add "<task-text>"`
- **AND** tasks are automatically linked to relevant goals using semantic matching
- **AND** a summary is displayed showing goals and added todos grouped by goal

#### Scenario: Extract tasks from multimodal context
- **WHEN** the user runs `/aissist:todo [attach image] "Implement these UI changes"`
- **THEN** Claude AI uses vision capabilities to analyze the attached image
- **AND** extracts actionable tasks from the visual context combined with the text
- **AND** creates todos for each identified task with appropriate goal links
- **AND** displays a summary of created todos

#### Scenario: Handle context with no actionable tasks
- **WHEN** the user provides context that contains no actionable tasks (e.g., "Just some notes about the meeting")
- **THEN** Claude AI identifies that no tasks can be extracted
- **AND** the system displays a message: "No actionable tasks found in the provided context"
- **AND** no todos are created

#### Scenario: Semantic goal matching for extracted tasks
- **WHEN** Claude AI extracts tasks from context
- **THEN** for each task, the system fetches active goals via `aissist goal list`
- **AND** performs semantic matching between task text and goal descriptions
- **AND** links the task to the best-matching goal using `aissist todo add --goal <codename>`
- **AND** if no good match exists, creates the todo without a goal link

#### Scenario: Summary output with goal grouping
- **WHEN** todos are successfully created from extracted tasks
- **THEN** the system displays a summary including:
  - List of goals with todo counts (e.g., "improve-api-security (2 todos)")
  - All added todos grouped by goal
  - Unlinked todos (if any)
  - Total count (e.g., "Created 5 todos linked to 3 goals")
- **AND** the summary clearly shows which todos were linked to which goals

#### Scenario: Priority inference from context
- **WHEN** the context includes priority indicators (e.g., "urgent", "critical", "low priority")
- **THEN** Claude AI infers appropriate priority levels (0-10 scale)
- **AND** creates todos with priority using `aissist todo add --priority N`
- **AND** the summary indicates which todos were created with priority

### Requirement: Plugin Command Integration
The Claude Code plugin SHALL provide a `/aissist:todo` slash command that integrates with the aissist CLI.

#### Scenario: Command accepts freeform arguments
- **WHEN** the user invokes `/aissist:todo` with arguments
- **THEN** the command receives the full argument string via `$ARGUMENTS`
- **AND** Claude has access to any attached images through the message context
- **AND** the command processes both text and visual input

#### Scenario: Command uses allowed tools
- **WHEN** executing `/aissist:todo`
- **THEN** the command has access to `Bash(aissist todo add:*)` for creating todos
- **AND** has access to `Bash(aissist goal list:*)` for fetching goals
- **AND** follows the same security model as other plugin commands

#### Scenario: Error handling for CLI unavailable
- **WHEN** the aissist CLI is not installed or not initialized
- **THEN** the command displays a clear error message
- **AND** provides instructions: "Run: npm install -g aissist && aissist init --global"
- **AND** does not attempt to create any todos

## Notes

- This change extends ai-planning by adding a new entry point (plugin command) while leveraging existing todo and goal systems
- The plugin command follows the same pattern as `/aissist:log` for AI enhancement and intelligent routing
- No changes required to aissist CLI - uses existing `todo add` and `goal list` commands
- Goal matching uses Claude AI for semantic understanding rather than keyword matching
- The command is stateless - all state is managed by the underlying aissist CLI

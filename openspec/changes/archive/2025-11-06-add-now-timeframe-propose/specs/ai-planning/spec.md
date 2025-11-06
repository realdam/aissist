# Spec Delta: ai-planning

## ADDED Requirements

### Requirement: Parse "now" Timeframe
The system SHALL recognize "now" as a special timeframe for immediate action planning.

#### Scenario: User provides "now" timeframe
- **WHEN** the user runs `aissist propose now`
- **THEN** the system parses "now" as a timeframe with:
  - Start: current timestamp
  - End: 2 hours from current timestamp
  - Label: "Right Now"

#### Scenario: "now" timeframe in proposal prompt
- **WHEN** building a proposal prompt with "now" timeframe
- **THEN** the system adjusts the prompt to:
  - Request exactly 1 actionable proposal (not 3-5)
  - Emphasize immediate action (completable within 1-2 hours)
  - Prioritize by urgency and feasibility for short-duration tasks
  - Focus on single next step rather than comprehensive planning

#### Scenario: Invalid timeframe still shows "now" option
- **WHEN** the user provides an invalid timeframe
- **THEN** the error message includes "now" in the supported formats list:
  - "- now (single immediate action)"

## MODIFIED Requirements

### Requirement: Timeframe Parsing
The system SHALL parse natural language timeframe expressions into date ranges for proposal scoping.

#### Scenario: Parse "now" expression (ADDED)
- **WHEN** the user runs `aissist propose now`
- **THEN** the system recognizes "now" as a special immediate-action timeframe
- **AND** returns a timeframe spanning the current moment to 2 hours ahead
- **AND** sets the label to "Right Now"

### Requirement: Claude-Powered Proposal Generation
The system SHALL generate actionable proposals using Claude Code CLI with file analysis tools.

#### Scenario: Build context-rich prompt (MODIFIED)
- **WHEN** invoking Claude for proposal generation
- **THEN** the system constructs a prompt including:
  - Timeframe context (e.g., "planning for Q1 2026", or "immediate action for Right Now")
  - Summary of goals (count and key themes)
  - Recent history patterns (frequency, topics)
  - Available reflections
  - Instruction to analyze data and propose:
    - **3-5 actionable items** for standard timeframes
    - **Exactly 1 actionable item** for "now" timeframe, optimized for 1-2 hour completion

### Requirement: Structured Proposal Output
The system SHALL format proposal output in a clear, actionable structure.

#### Scenario: Display proposal header (MODIFIED)
- **WHEN** outputting a proposal
- **THEN** the system displays a header: `🎯 Proposed Plan for <timeframe>:`
- **AND** for "now" timeframe, the header uses the label "Right Now"

#### Scenario: Display single action for "now" timeframe (ADDED)
- **WHEN** Claude generates a proposal for "now" timeframe
- **THEN** the system displays exactly one action item
- **AND** the action is formatted as: "▶️ [action description]"
- **AND** includes brief context on why this is the most urgent/important immediate action

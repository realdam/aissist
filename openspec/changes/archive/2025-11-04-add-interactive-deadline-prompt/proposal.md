# Add Interactive Deadline Prompt for Goal Creation

## Context
When users add a new goal via the CLI, they currently must either:
- Provide a deadline via the `-d, --deadline` flag in strict YYYY-MM-DD format
- Skip the deadline entirely and add it later via `goal deadline` command or interactive management

This creates friction in the user flow. Users often think about deadlines when creating goals, and forcing them to use a separate command or remember CLI flags reduces the tool's usability.

The system already has a sophisticated timeframe parser (`parseTimeframe` in `src/utils/timeframe-parser.ts`) that supports natural language inputs like "tomorrow", "next week", "this month", etc. However, this capability is only exposed in the `propose` command, not in goal creation.

## Motivation
- **User Experience**: Adding a deadline should be as frictionless as creating the goal itself
- **Consistency**: The propose command already prompts for timeframes with a default; goals should follow the same pattern
- **Natural Language**: Users should be able to say "tomorrow" instead of calculating and typing "2025-11-05"
- **Discoverability**: An interactive prompt makes the deadline feature more visible to users who might not discover the `-d` flag

## Proposed Solution
When a user runs `aissist goal add "Goal text"`, immediately after the goal text is entered and the codename is generated, prompt the user:

```
Enter deadline (default: Tomorrow):
```

The prompt should:
- Default to "Tomorrow" if the user presses Enter without typing anything
- Accept natural language inputs like "tomorrow", "next week", "2025-12-31"
- Use the existing `parseTimeframe` utility to convert input to a date
- Validate the input and re-prompt on errors
- Allow the user to skip by entering an empty string or pressing Ctrl+C

This aligns with the interactive, user-friendly CLI patterns already established in the codebase (interactive goal list, deadline management in UI).

## Scope
- **In Scope**:
  - Adding an interactive prompt to the `goal add` command
  - Integrating the existing `parseTimeframe` utility for deadline parsing
  - Supporting natural language and ISO date formats
  - Providing "Tomorrow" as the default value
  - Maintaining backward compatibility with the `-d` flag

- **Out of Scope**:
  - Changing the deadline storage format (remains YYYY-MM-DD in Markdown)
  - Modifying the timeframe parser (it already works well)
  - Interactive prompts for other goal commands (list, complete, etc.)
  - Batch goal creation with deadlines

## Success Criteria
- Users can add goals with deadlines in one fluid interaction
- Natural language inputs like "tomorrow", "next week" work correctly
- The `-d` flag continues to work for users who prefer non-interactive mode
- Default value of "Tomorrow" is applied when user presses Enter
- Invalid inputs show clear error messages and re-prompt
- Tests validate the new prompting flow

## Dependencies
- Existing `parseTimeframe` utility (already implemented)
- Existing `@inquirer/prompts` for interactive CLI (already in use)
- No new external dependencies required

## Risks & Mitigations
- **Risk**: Users might prefer non-interactive mode for scripting
  - **Mitigation**: Keep `-d` flag working; if present, skip prompt

- **Risk**: Users might not understand natural language format
  - **Mitigation**: Show clear examples in error messages (already implemented in `parseTimeframe`)

- **Risk**: Date ambiguity (e.g., "next week" vs "next 7 days")
  - **Mitigation**: The parser already has well-defined behavior; document it in help text

## Related Changes
- None (standalone enhancement)

## Related Specs
- `goal-management`: Will be modified to add interactive prompting requirement

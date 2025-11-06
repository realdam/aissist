# Add AI-Powered Todo Extraction Command

## Overview
Add a new `/aissist:todo` slash command to the Claude Code plugin that accepts freeform context (text, images, notes, meeting transcripts, etc.) and uses AI to analyze, extract, and create todo items with automatic goal linking. This command will leverage Claude's understanding to parse complex context and break it down into actionable tasks that are added to the aissist CLI.

## Problem Statement
Users often work with rich context containing implicit tasks:
- Meeting notes with action items buried in discussion
- Project documentation listing multiple requirements
- Bug reports describing several fixes needed
- Design documents with implementation steps
- Screenshots showing multiple UI tasks

Currently, users must:
1. Manually identify each task from the context
2. Run `aissist todo add` multiple times
3. Manually link each todo to appropriate goals
4. Track which items were added

This is tedious, error-prone, and doesn't leverage AI capabilities available in Claude Code.

## Proposed Solution
Create a `/aissist:todo` command that:
1. Accepts freeform context as an argument (text, with optional images)
2. Uses Claude AI to analyze the context and extract distinct, actionable tasks
3. Matches each task to existing goals using semantic understanding
4. Creates todos via `aissist todo add` with appropriate goal linking
5. Returns a summary showing goals and all added items grouped by goal

## User Experience

### Basic Usage
```
/aissist:todo Review API endpoints for security vulnerabilities, update docs, and write integration tests
```

**Output:**
```
Extracted 3 todos from context:

Goals:
  improve-api-security (2 todos)
  documentation (1 todo)

Added todos:
  [improve-api-security] Review API endpoints for security vulnerabilities
  [improve-api-security] Write integration tests for API endpoints
  [documentation] Update API documentation

Created 3 todos linked to 2 goals
```

### With Complex Context
```
/aissist:todo [attach meeting-notes.png] From today's sprint planning meeting
```

Claude analyzes the image, extracts action items, and creates todos with goal links.

### Multimodal Support
```
/aissist:todo [attach design-mockup.png] Need to implement these UI changes for the dashboard
```

Claude vision analyzes the mockup and generates specific implementation tasks.

## Benefits
1. **Efficiency**: Extract multiple todos from rich context in one command
2. **Intelligence**: AI understands implicit tasks and breaks them down appropriately
3. **Automation**: Automatic goal linking reduces manual work
4. **Transparency**: Clear summary of what was created and how it was linked
5. **Multimodal**: Supports text and images for maximum flexibility
6. **Consistency**: Follows the same AI-enhancement pattern as `/aissist:log`

## Scope
This change affects:
- **Plugin**: Add new `/aissist:todo` command file
- **AI Planning Spec**: Extend existing AI-enhanced planning capability
- **User Documentation**: Update plugin README with new command

This does NOT require:
- Changes to aissist CLI (uses existing `todo add` command)
- New storage mechanisms (uses existing todo storage)
- Changes to goal matching (uses existing goal system)

## Success Criteria
1. Users can pass freeform context and get multiple todos created
2. Todos are automatically linked to relevant goals
3. Summary clearly shows what was created
4. Command handles both text and image inputs
5. Integration with existing aissist CLI works seamlessly
6. Documentation is clear and includes examples

## Related Work
- Similar pattern to existing `/aissist:log` command (AI enhancement + routing)
- Uses existing `aissist todo add` CLI command
- Leverages existing goal matching from todo system
- Complements goal-planning spec in `openspec/specs/ai-planning/`

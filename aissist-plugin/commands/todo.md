---
description: Extract and create todos from context using AI
argument-hint: <context>
allowed-tools: Bash(aissist todo add:*), Bash(aissist goal list:*), Bash(aissist:*)
---

# AI-Powered Todo Extraction

Extract actionable tasks from freeform context and automatically create todos with goal linking. This command analyzes text and images using AI to identify distinct tasks, matches them to your goals, and creates todos in one step.

## Usage

```
/aissist:todo <context>
```

Or with images:

```
/aissist:todo [attach image(s)] <context>
```

## Arguments

- `context` (required): Freeform description, notes, or context containing tasks. Can be meeting notes, project docs, bug reports, or any text with implicit tasks.

## What It Does

This command uses AI to:

1. **Analyze context**: Parse your input (text and/or images) to understand the content
2. **Extract tasks**: Identify distinct, actionable todo items from the context
3. **Match to goals**: Semantically match each task to your active goals
4. **Create todos**: Add each task via `aissist todo add` with automatic goal linking
5. **Show summary**: Display what was created, grouped by goal

## Examples

### Simple Text with Multiple Tasks

**Input**:
```
/aissist:todo Review API endpoints for security vulnerabilities, update docs, and write integration tests
```

**Output**:
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

### Meeting Notes

**Input**:
```
/aissist:todo From today's standup: Need to fix the payment bug John reported, update the deployment pipeline, and schedule code review with Sarah
```

**Output**:
```
Extracted 3 todos from context:

Goals:
  fix-payments (1 todo)
  devops-improvements (1 todo)

Added todos:
  [fix-payments] Fix payment bug reported by John
  [devops-improvements] Update deployment pipeline
  [] Schedule code review with Sarah

Created 3 todos (2 linked to goals)
```

### Project Documentation

**Input**:
```
/aissist:todo Requirements for the new dashboard:
- Add user analytics chart
- Implement real-time notifications
- Create export functionality
- Optimize mobile layout
```

**Output**:
```
Extracted 4 todos from context:

Goals:
  dashboard-rebuild (4 todos)

Added todos:
  [dashboard-rebuild] Add user analytics chart
  [dashboard-rebuild] Implement real-time notifications
  [dashboard-rebuild] Create export functionality
  [dashboard-rebuild] Optimize mobile layout

Created 4 todos linked to 1 goal
```

### Bug Report

**Input**:
```
/aissist:todo Bug #425: Login fails on mobile Safari. Need to debug the auth flow, check cookie settings, and test across iOS versions.
```

**Output**:
```
Extracted 3 todos from context:

Goals:
  fix-mobile-auth (3 todos)

Added todos:
  [fix-mobile-auth] Debug authentication flow on mobile Safari
  [fix-mobile-auth] Check cookie settings for Safari compatibility
  [fix-mobile-auth] Test login across iOS versions

Created 3 todos linked to 1 goal
```

### With Images (Multimodal)

**Input**:
```
/aissist:todo [attach design-mockup.png] Need to implement these UI changes for the dashboard
```

Claude analyzes the mockup and extracts specific implementation tasks:

**Output**:
```
Extracted 5 todos from context:

Goals:
  dashboard-rebuild (5 todos)

Added todos:
  [dashboard-rebuild] Implement new navigation sidebar with collapsible menu
  [dashboard-rebuild] Add dark mode toggle to header
  [dashboard-rebuild] Create metrics cards with chart visualizations
  [dashboard-rebuild] Update color scheme to match new design system
  [dashboard-rebuild] Add responsive breakpoints for mobile view

Created 5 todos linked to 1 goal
```

**Input**:
```
/aissist:todo [attach meeting-notes.jpg] Action items from sprint planning
```

Claude reads the image and creates todos from the visible action items.

### Priority Inference

**Input**:
```
/aissist:todo URGENT: Critical security patch needed for API auth, also need to update the docs when done
```

**Output**:
```
Extracted 2 todos from context:

Goals:
  security (1 todo)
  documentation (1 todo)

Added todos:
  [security] Apply critical security patch to API authentication (Priority: 9)
  [documentation] Update documentation for security patch

Created 2 todos linked to 2 goals (1 with priority)
```

### No Actionable Tasks

**Input**:
```
/aissist:todo Just some notes from the architecture discussion. We talked about microservices but no decisions yet.
```

**Output**:
```
No actionable tasks found in the provided context.

Tip: If this was meant to be saved for reference, consider using:
  aissist context log architecture "Your notes here"
```

## How It Works

### AI Task Extraction

Claude AI analyzes your context to:
- Identify distinct, actionable items
- Break down complex descriptions into atomic tasks
- Infer priority from urgency indicators
- Handle both explicit lists and implicit tasks in prose

### Semantic Goal Matching

For each extracted task:
1. Fetch your active goals via `aissist goal list`
2. Semantically match the task text to goal descriptions
3. Link to the best-matching goal (or none if no good match)
4. Execute `aissist todo add "<task>" --goal <codename>`

### Summary Output

The summary shows:
- Goals with todo counts
- All todos grouped by goal
- Unlinked todos (created without goal)
- Total count and confirmation

## Edge Cases

### No Active Goals

If you have no goals:
```
Extracted 3 todos from context:

Added todos:
  [] Fix authentication bug
  [] Update API documentation
  [] Write integration tests

Created 3 todos (no goal links available)

Tip: Create goals with `aissist goal add` to enable automatic goal linking
```

### Context Too Vague

If the context is too vague:
```
Unable to extract clear actionable tasks. Try being more specific.

Example: Instead of "work on the project"
Try: "implement user login, add validation, write tests"
```

## Requirements

- **aissist CLI** installed and initialized (`aissist init --global`)
- **Active Claude Code session** for AI analysis
- **Images** (optional) attached to the message for multimodal extraction

## Tips

- **Be specific**: More detail helps AI extract clearer tasks
- **Use natural language**: Write notes as you normally would - bullet points, prose, or mixed
- **Include images**: Attach screenshots of design mockups, bug reports, or meeting notes for richer extraction
- **Trust the AI**: Claude understands context and will break down complex input appropriately
- **Review active goals**: The command matches tasks to your existing goals - run `aissist goal list` to see what's available

## Comparison to Other Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/aissist:todo` | Extract tasks from context | When you have context (notes, docs, images) containing multiple tasks |
| `aissist todo add` | Create single todo | When you have one specific task to add |
| `/aissist:log` | Log completed work | After you've finished work, to record what you did |
| `aissist propose` | Generate future proposals | When planning ahead based on goals and history |

## Error Handling

### CLI Not Found
```
Error: aissist CLI not found
Install with: npm install -g aissist
Then initialize: aissist init --global
```

### Not Initialized
```
Error: aissist not initialized
Run: aissist init --global
```

### Invalid Context
```
Error: No context provided
Usage: /aissist:todo <context>
```

## See Also

- `aissist todo add` - Manually add a single todo
- `aissist todo list` - View your todos
- `aissist goal list` - View active goals for matching
- `/aissist:log` - Log completed work with AI enhancement
- `/aissist:recall` - Search your history with semantic queries

---

## Implementation Instructions

When this command is invoked, follow these steps:

### Step 1: Parse Arguments and Context

Extract the context from `$ARGUMENTS`. If images are attached to the message, they will be available in the conversation context for analysis.

### Step 2: AI Task Extraction

Analyze the provided context to extract actionable tasks. Use the following approach:

**Analysis Prompt:**
```
Analyze the following context and extract distinct, actionable todo items.

Context: [user's input]
[Images: if attached, analyze them using vision capabilities]

Instructions:
- Identify distinct, actionable tasks
- Make tasks atomic and clear
- Infer priority if urgency indicators are present (words like "urgent", "critical", "ASAP")
- Use priority scale: 0 (normal), 5-7 (important), 8-10 (urgent/critical)

Return ONLY a JSON array with this exact structure:
[
  { "text": "task description", "priority": 0 },
  { "text": "another task", "priority": 9 },
  ...
]

If no actionable tasks can be extracted, return an empty array: []
```

Parse the JSON response to get the extracted tasks.

### Step 3: Fetch Active Goals

Run the following command to get active goals:
```bash
aissist goal list --format json
```

Parse the JSON output to get the list of goals. Each goal will have:
- `codename`: The goal identifier
- `text`: The goal description

If the command fails or returns no goals, continue without goal matching.

### Step 4: Semantic Goal Matching

For each extracted task, perform semantic goal matching:

**Matching Prompt (for each task):**
```
Task: "[task text]"

Available Goals:
[for each goal: - codename: description]

Question: Which goal best matches this task?

Instructions:
- Consider the semantic meaning, not just keywords
- Match based on task relevance to goal
- If no goal is a good match, say "none"
- Answer with ONLY the goal codename or "none"

Answer:
```

Store the matched goal codename (or null if "none") for each task.

### Step 5: Create Todos

For each extracted task with its matched goal:

1. Build the command:
   ```bash
   aissist todo add "<task.text>"
   ```

2. Add goal flag if matched:
   ```bash
   aissist todo add "<task.text>" --goal <codename>
   ```

3. Add priority flag if priority > 0:
   ```bash
   aissist todo add "<task.text>" --goal <codename> --priority <priority>
   ```

4. Execute the command using the Bash tool

5. Handle errors:
   - If `aissist` command not found: Display error with installation instructions
   - If storage not initialized: Display error with init instructions
   - Other errors: Display the error message

### Step 6: Generate Summary

After all todos are created, generate a summary:

1. **Group todos by goal**:
   - Create groups for each goal that has todos
   - Create a group for unlinked todos (no goal)

2. **Format the output**:
   ```
   Extracted N todos from context:

   Goals:
     goal-codename-1 (X todos)
     goal-codename-2 (Y todos)

   Added todos:
     [goal-codename-1] Task text
     [goal-codename-1] Another task
     [goal-codename-2] Task for goal 2
     [] Unlinked task

   Created N todos linked to M goals
   ```

3. **Special cases**:
   - If no tasks extracted: "No actionable tasks found in the provided context."
   - If no goals available: Add note "no goal links available"
   - If priorities were added: Note "(N with priority)"

### Step 7: Error Handling

Handle these error scenarios:

- **No context provided**: Display usage message
- **CLI not found**: Show installation instructions
- **Not initialized**: Show init instructions
- **No tasks extracted**: Provide helpful feedback
- **Goal matching fails**: Continue without goal (create todo anyway)

### Important Notes

- Always use proper shell escaping for task text (avoid command injection)
- Execute `aissist todo add` commands sequentially (not in parallel)
- Show progress if extracting/creating many todos (>5)
- Be helpful with error messages and next steps
- Preserve exact task text from extraction (don't modify unnecessarily)

---

$ARGUMENTS

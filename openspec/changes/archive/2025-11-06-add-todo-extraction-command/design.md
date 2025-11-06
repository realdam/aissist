# Design: AI-Powered Todo Extraction

## Architecture

### Component Diagram
```
┌─────────────────────────────────────────────────────────────┐
│ Claude Code Plugin                                          │
│                                                             │
│  ┌──────────────────────────────────────────┐              │
│  │ /aissist:todo Command                    │              │
│  │                                          │              │
│  │  1. Parse arguments (text + images)     │              │
│  │  2. AI Analysis & Task Extraction       │              │
│  │  3. Goal Matching                       │              │
│  │  4. Todo Creation (CLI calls)           │              │
│  │  5. Summary Generation                  │              │
│  └──────────────────────────────────────────┘              │
│           │                │                │               │
│           ▼                ▼                ▼               │
└───────────┼────────────────┼────────────────┼───────────────┘
            │                │                │
            │                │                │
    ┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
    │ Claude AI    │  │ aissist     │  │ aissist    │
    │ (analysis)   │  │ goal list   │  │ todo add   │
    └──────────────┘  └─────────────┘  └────────────┘
```

### Data Flow

1. **Input Processing**
   ```
   User Input (text + optional images)
   → Command receives arguments via $ARGUMENTS
   → Images attached via Claude Code UI
   ```

2. **AI Analysis Phase**
   ```
   Context → Claude AI Analysis → Extracted Task List

   Analysis includes:
   - Parse context (text, images, mixed)
   - Identify distinct actionable tasks
   - Infer priority if mentioned
   - Extract relevant metadata (estimates, dependencies)
   ```

3. **Goal Matching Phase**
   ```
   Extracted Tasks → Goal List → Semantic Matching → Goal Assignments

   For each task:
   - Fetch active goals via `aissist goal list`
   - Semantic match task to goal(s)
   - Determine best fit or no match
   ```

4. **Todo Creation Phase**
   ```
   Matched Tasks → CLI Execution → Created Todos

   For each task:
   - Call `aissist todo add "<text>"` with optional `--goal <codename>`
   - Optional: Add priority if detected (`--priority N`)
   - Capture success/failure
   ```

5. **Summary Generation**
   ```
   Created Todos → Group by Goal → Format Summary → User Output

   Output includes:
   - List of goals with todo counts
   - All added todos grouped by goal
   - Total count and confirmation
   ```

## Algorithm

### Core Extraction Logic

```typescript
async function extractAndCreateTodos(context: string, images?: Image[]): Promise<Summary> {
  // Step 1: AI Analysis
  const analysisPrompt = `
    Analyze the following context and extract distinct, actionable todo items.

    Context: ${context}
    ${images ? 'Images: [analyze attached images]' : ''}

    For each task:
    - Write clear, concise task description
    - Infer priority if mentioned (0-10 scale)
    - Keep tasks atomic and actionable

    Return as JSON array:
    [
      { "text": "task description", "priority": 0 },
      ...
    ]
  `;

  const extractedTasks = await claudeAI.analyze(analysisPrompt);

  // Step 2: Fetch Active Goals
  const goalsResult = await bash('aissist goal list --format json');
  const activeGoals = JSON.parse(goalsResult);

  // Step 3: Match Tasks to Goals
  const matchedTasks = await Promise.all(
    extractedTasks.map(async task => {
      const goalMatch = await semanticGoalMatch(task.text, activeGoals);
      return { ...task, goal: goalMatch };
    })
  );

  // Step 4: Create Todos
  const createdTodos = [];
  for (const task of matchedTasks) {
    let cmd = `aissist todo add "${task.text}"`;
    if (task.goal) cmd += ` --goal ${task.goal}`;
    if (task.priority > 0) cmd += ` --priority ${task.priority}`;

    await bash(cmd);
    createdTodos.push(task);
  }

  // Step 5: Generate Summary
  return generateSummary(createdTodos, activeGoals);
}
```

### Semantic Goal Matching

```typescript
async function semanticGoalMatch(taskText: string, goals: Goal[]): Promise<string | null> {
  if (goals.length === 0) return null;

  const matchPrompt = `
    Task: "${taskText}"

    Available Goals:
    ${goals.map(g => `- ${g.codename}: ${g.text}`).join('\n')}

    Which goal best matches this task?
    Return the goal codename, or "none" if no good match.
    Answer with just the codename or "none".
  `;

  const match = await claudeAI.analyze(matchPrompt);

  return match.toLowerCase() === 'none' ? null : match.trim();
}
```

## Command Structure

### File: `aissist-plugin/commands/todo.md`

```markdown
---
description: Extract and create todos from context using AI
argument-hint: <context>
allowed-tools: Bash(aissist todo add:*), Bash(aissist goal list:*)
---

# AI-Powered Todo Extraction

Extract actionable tasks from freeform context and automatically create todos with goal linking.

## Usage

\`\`\`
/aissist:todo <context>
\`\`\`

... [full documentation] ...

$ARGUMENTS
```

## Integration Points

### With Existing Systems

1. **aissist CLI**
   - Uses `aissist todo add` (no CLI changes needed)
   - Uses `aissist goal list` for fetching goals
   - Leverages existing goal-linking via `--goal` flag

2. **Claude Code Plugin**
   - Follows same pattern as `/aissist:log` command
   - Uses same allowed-tools mechanism
   - Consistent with existing slash command structure

3. **AI Planning Spec**
   - Extends `ai-planning` capability
   - Adds todo extraction as new requirement
   - Aligns with goal-linking factory patterns

### Error Handling

```typescript
try {
  const todos = await extractAndCreateTodos(context, images);
  displaySummary(todos);
} catch (error) {
  if (error.code === 'CLI_NOT_FOUND') {
    throw new Error('aissist CLI not found. Run: npm install -g aissist');
  }
  if (error.code === 'NO_STORAGE') {
    throw new Error('aissist not initialized. Run: aissist init --global');
  }
  throw error;
}
```

## Security Considerations

1. **Command Injection Prevention**
   - Properly escape task text before passing to bash
   - Validate goal codenames match expected format
   - Sanitize all user input

2. **Rate Limiting**
   - Reasonable limit on number of tasks extracted (e.g., max 20)
   - Warn if context is excessively large

3. **Privacy**
   - All data stays local (aissist is local-first)
   - AI analysis happens in Claude Code session
   - No external API calls except Claude AI

## Performance Considerations

1. **Batch Processing**
   - Extract all tasks in single AI call (not per-task)
   - Goal matching can be done in parallel for all tasks

2. **CLI Efficiency**
   - Sequential `todo add` calls (required for proper logging)
   - Consider showing progress for >5 todos

3. **Caching**
   - Cache goal list during command execution
   - No need to call `aissist goal list` multiple times

## Testing Strategy

1. **Unit Testing**
   - Test task extraction from various contexts
   - Test goal matching logic
   - Test summary generation

2. **Integration Testing**
   - Test with actual aissist CLI commands
   - Verify todos created in storage
   - Verify goal links are correct

3. **Manual Testing Scenarios**
   - Simple text with multiple tasks
   - Complex meeting notes
   - Image with task list
   - Context with no actionable tasks
   - Context with explicit priorities

## Future Enhancements

1. **Dependency Detection**
   - Extract task dependencies from context
   - Create todos with dependency metadata

2. **Deadline Extraction**
   - Parse deadline information from context
   - Add `--date` flag to todos

3. **Batch Editing**
   - Allow reviewing tasks before creation
   - Interactive mode to confirm/edit extracted todos

4. **Confidence Scoring**
   - Show confidence level for goal matches
   - Prompt user for low-confidence matches

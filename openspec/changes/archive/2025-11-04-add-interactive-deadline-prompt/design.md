# Design Document: Interactive Deadline Prompt

## Overview
This change adds an interactive deadline prompt to the `goal add` command, allowing users to set deadlines using natural language inputs with "Tomorrow" as the default value.

## Architecture

### Component Interaction
```
User Command: `aissist goal add "text"`
    ↓
goalCommand.add action
    ↓
Generate Codename (existing)
    ↓
[NEW] Check if -d flag was provided
    ↓ (if no -d flag)
[NEW] Prompt for deadline with default "Tomorrow"
    ↓
[NEW] Parse input with parseTimeframe utility
    ↓
[NEW] Convert parsed timeframe to YYYY-MM-DD
    ↓
Build goal entry with deadline (existing)
    ↓
Save to Markdown file (existing)
```

### Key Design Decisions

#### 1. Prompt Placement
**Decision**: Prompt for deadline AFTER codename generation but BEFORE saving the goal.

**Rationale**:
- Codename generation is essential and must succeed first
- If prompt fails or user cancels, we haven't committed anything to storage
- Matches natural user flow: "What is your goal?" → "When should it be done?"

#### 2. Default Value Strategy
**Decision**: Use "Tomorrow" as the default, not "Today".

**Rationale**:
- Most goals are future-oriented (you set them to do later)
- "Today" creates pressure and might be misleading for goals added late in the day
- "Tomorrow" aligns with common user expectations (e.g., to-do apps default to tomorrow)
- Easy to override if user wants today or another date

#### 3. Timeframe Parser Integration
**Decision**: Reuse existing `parseTimeframe` utility, extract end date only.

**Rationale**:
- Avoids code duplication
- Ensures consistency across commands (propose and goal)
- `parseTimeframe` already handles all natural language cases
- For deadlines, we only need the END date of the timeframe (e.g., "next week" → Sunday)

**Implementation**:
```typescript
const parsedTimeframe = parseTimeframe(userInput);
const deadlineDate = formatDate(parsedTimeframe.end);
```

#### 4. Flag vs Prompt Behavior
**Decision**: If `-d` flag is present, skip prompt entirely.

**Rationale**:
- Maintains backward compatibility
- Supports scripting and automation (non-interactive use)
- Clear precedence: explicit flags override interactive prompts
- Matches standard CLI patterns (flags = automated, no flags = interactive)

#### 5. Skip Deadline Handling
**Decision**: Allow users to skip by entering whitespace or empty input (not just Ctrl+C).

**Rationale**:
- Pressing Enter with default would set "Tomorrow"
- Need explicit way to skip without canceling the entire goal
- Whitespace-only input signals "I don't want this" without aborting
- More graceful than forcing Ctrl+C (which might confuse users)

**Implementation**:
```typescript
const deadlineInput = await input({
  message: 'Enter deadline (default: Tomorrow):',
  default: 'Tomorrow',
});

const trimmed = deadlineInput.trim();
if (trimmed === '' || trimmed.toLowerCase() === 'skip') {
  // No deadline set
} else {
  // Parse and use deadline
}
```

#### 6. Error Handling Strategy
**Decision**: On invalid input, show error with examples and re-prompt (like timeframe-parser already does).

**Rationale**:
- `parseTimeframe` already throws descriptive errors with format examples
- Let errors propagate to user, caught by try-catch
- User-friendly error messages guide correct input
- Re-prompting gives immediate recovery without restarting command

## Implementation Details

### Changes to `src/commands/goal.ts`

#### Modify the `add` action:
```typescript
.action(async (text: string, options) => {
  try {
    const storagePath = await getStoragePath();
    const date = getCurrentDate();
    const time = getCurrentTime();
    const filePath = join(storagePath, 'goals', `${date}.md`);

    // Validate deadline if provided via flag
    if (options.deadline && !parseDate(options.deadline)) {
      error(`Invalid date format: ${options.deadline}. Use YYYY-MM-DD format.`);
      return;
    }

    // Get existing codenames to ensure uniqueness
    const existingCodenames = await getExistingCodenames(filePath);

    // Generate codename
    let codename: string;
    try {
      codename = await generateGoalCodename(text, existingCodenames);
    } catch (err) {
      error(`Failed to generate codename: ${(err as Error).message}`);
      return;
    }

    // [NEW] Prompt for deadline if not provided via flag
    let deadlineDate: string | undefined = options.deadline;
    if (!options.deadline) {
      try {
        const deadlineInput = await input({
          message: 'Enter deadline (default: Tomorrow):',
          default: 'Tomorrow',
        });

        const trimmed = deadlineInput.trim();
        if (trimmed !== '' && trimmed.toLowerCase() !== 'skip') {
          const parsedTimeframe = parseTimeframe(trimmed);
          deadlineDate = formatDate(parsedTimeframe.end);
        }
      } catch (err) {
        // User cancelled (Ctrl+C) or parser error
        error(`Failed to parse deadline: ${(err as Error).message}`);
        return;
      }
    }

    // Build goal entry
    let entry = `## ${time} - ${codename}\n\n${text}`;
    if (deadlineDate) {
      entry += `\n\nDeadline: ${deadlineDate}`;
    }

    await appendToMarkdown(filePath, entry);

    success(`Goal added with codename: ${chalk.cyan(codename)}`);
    if (deadlineDate) {
      info(`Deadline: ${deadlineDate}`);
    }
  } catch (err) {
    error(`Failed to add goal: ${(err as Error).message}`);
    throw err;
  }
});
```

### New Imports Required
```typescript
import { parseTimeframe } from '../utils/timeframe-parser.js';
import { formatDate } from '../utils/date.js';
```

### No Changes Needed To
- `parseTimeframe` utility (already complete)
- `formatDate` utility (already exists)
- Storage layer
- Markdown format
- Other goal commands

## Testing Strategy

### Unit Tests
- Test deadline prompt flow with various inputs (tomorrow, next week, ISO dates)
- Test flag precedence (if -d provided, no prompt)
- Test skip behavior (empty/whitespace input)
- Test error handling (invalid formats)

### Integration Tests
- Test full goal add flow with deadline
- Test that deadline is correctly stored in Markdown
- Test that deadline appears in goal list
- Verify backward compatibility with existing goals

### Manual Testing
- Test interactive prompt UX in terminal
- Verify default value behavior
- Test Ctrl+C cancellation
- Verify error messages are clear

## Migration & Backward Compatibility

### Breaking Changes
**None**. This is a purely additive change.

### Existing Behavior Preserved
- `-d` flag continues to work exactly as before
- Goals without deadlines work as before
- All other goal commands unchanged
- Storage format unchanged

### User Migration
No migration needed. Users will discover the new prompt naturally when adding goals.

## Performance Considerations
- Minimal impact: one additional prompt per goal add
- `parseTimeframe` is fast (no network calls)
- No additional file I/O

## Security Considerations
- No new external inputs (same validation as -d flag)
- Date parsing is safe (no code execution)
- No network calls

## Accessibility Considerations
- Inquirer prompts are keyboard-accessible
- Default value reduces typing burden
- Clear error messages aid understanding
- Ctrl+C escape hatch always available

## Future Enhancements (Out of Scope)
- Autocomplete for timeframe suggestions
- Visual calendar picker
- Recurring deadline support
- Deadline reminders

---
description: Generate accomplishment report
argument-hint: [timeframe] [--purpose <type>] [--output <file>]
allowed-tools: Bash(aissist:*), Bash(npx aissist:*), Read, Write
---

# Generate Accomplishment Report

Create a professional, formatted report of your accomplishments suitable for brag documents, promotion cases, manager updates, or status reports.

## Usage

```
/aissist:report [timeframe] [--purpose <type>] [--output <file>]
```

## Arguments

- `timeframe` (optional): Time period to report on. Supports natural language like "today", "week", "month", "quarter", or ISO dates. Defaults to "today"
- `--purpose <type>` (optional): Report purpose that adjusts language and emphasis:
  - `promotion`: Leadership, impact, career growth focus
  - `manager-update`: Business value, deliverables, team collaboration
  - `brag-doc`: Personal achievements and skills developed
  - `status`: Concise bullet points for quick updates
  - `general` (default): Balanced, multi-purpose format
- `--output <file>` (optional): Save report to file instead of displaying
- `--context <name>` (optional): Include specific context in report

## Examples

```
/aissist:report week
/aissist:report quarter --purpose promotion
/aissist:report week --purpose manager-update
/aissist:report month --purpose brag-doc
/aissist:report --purpose status
/aissist:report month --output report.md
```

## What it does

This slash command orchestrates report generation by having Claude directly analyze your aissist data:

1. Check if aissist storage is initialized using `aissist path`
2. Determine the storage path for reading data files
3. Read and parse data from multiple sources within the specified timeframe:
   - History entries (from `history/*.md` files)
   - Completed goals (from `goals/finished/*.md` files)
   - Completed todos (extracted from history entries)
   - Context-specific notes (from `context/*.md` files if --context specified)
4. **Identify vague entries** and interactively clarify them (see Interactive Clarification section below)
5. Aggregate and transform the raw data into professional language
6. Generate a formatted markdown report with sections appropriate to the data:
   - Key Accomplishments
   - Goals Completed
   - Skills Developed
   - Projects & Contributions
   - Productivity Metrics
7. Adapt language and emphasis based on the purpose parameter
8. Output the report or save to file if --output specified

**How it works:** Claude reads the markdown files directly and uses its understanding to:
- Parse dates and filter entries within the timeframe
- **Detect vague or incomplete entries that need clarification**
- **Ask clarifying questions and improve entries interactively**
- Transform technical logs into professional accomplishment statements
- Group related activities into cohesive achievements
- Extract skills and technologies mentioned
- Identify project contributions
- Format everything appropriately for the specified purpose (promotion, manager-update, etc.)

## Interactive Clarification

During report generation, Claude automatically identifies vague or incomplete history entries and asks clarifying questions to improve them. This ensures your report has the specificity and impact needed for professional use.

### What Triggers Clarification

Claude asks questions when it encounters entries with:

1. **Generic descriptions**: "worked on stuff", "fixed things", "did work"
2. **Missing metrics**: "improved performance", "made it faster" (without numbers)
3. **Unclear context**: "meeting", "discussion", "call" (without who/what/why)
4. **Technical jargon**: Domain-specific terms without explanation or impact

### How Clarification Works

**Interactive Flow:**

1. Claude detects a vague entry (e.g., "worked on stuff" from Nov 5)
2. Claude asks a specific clarifying question:
   - For generic work: "What specific work did you complete?"
   - For missing metrics: "What were the before/after measurements?"
   - For unclear meetings: "What was the meeting about? Who attended? What was accomplished?"
3. You provide additional context
4. Claude proposes an improved entry with before/after comparison
5. You confirm (y) or decline (n) the edit
6. If confirmed, Claude updates the history file and continues
7. Final report includes all improvements

**You can skip clarification** for any entry - just respond "skip" or "no" when asked. Claude will continue with the original entry.

### Example Clarification Conversation

```
Claude: I found a vague entry from November 5: "worked on stuff"
        What specific work did you complete?

You: Implemented OAuth 2.0 authentication for the customer portal

Claude: I'll improve this entry to:

Original: "worked on stuff"
Improved: "Implemented OAuth 2.0 authentication system for customer portal"

Update history/2025-11-05.md with this improved entry? (y/n)

You: y

Claude: Entry updated. Continuing with report generation...
```

### Benefits

- **Better reports**: Specific, impactful accomplishments instead of vague notes
- **Improved data**: Your history files get better for future reports
- **Seamless workflow**: No need to manually edit files and regenerate
- **Optional**: Skip any clarification you don't want to provide

## Purpose-Based Formatting

Different purposes emphasize different aspects:

- **promotion**: Highlights leadership actions, team impact, strategic contributions, quantified results
- **manager-update**: Focuses on deliverables, blockers resolved, team collaboration, business value
- **brag-doc**: Emphasizes personal achievements, skills developed, challenges overcome, growth
- **status**: Provides concise bullet points for daily standups or quick updates
- **general**: Balanced tone suitable for multiple audiences

## Requirements

- aissist initialized (run `aissist init` first)
- Some history, goals, or todos logged within the timeframe
- Read access to aissist storage directory

## Tips

- Use `week` or `month` for regular updates
- Use `quarter` for promotion cases or performance reviews
- The `--purpose` flag significantly changes the language and emphasis
- Save important reports with `--output` for future reference
- Link work to goals for better categorization in reports
- **Clarify vague entries when prompted** - it improves both your report and your historical data
- **You can always skip clarification** - just say "skip" or "no" if you don't have time
- **Clarified entries are saved** - they'll automatically appear in future reports too
- Ask a follow-up question if the user wants to export this report in a file format or into an external source using MCP. 

---

$ARGUMENTS

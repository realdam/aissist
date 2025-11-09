# report-command Specification

## Purpose

Provide users with a way to generate professional, human-readable accomplishment reports from their aissist data for various purposes including brag documents, promotion cases, manager updates, and status reports.

This is implemented as a **slash-command-only** feature (`/aissist:report`) where Claude orchestrates the report generation by directly reading and analyzing aissist data files. There is no standalone CLI command - Claude handles timeframe parsing, data aggregation, language transformation, and formatting based on the specified purpose.
## Requirements
### Requirement: Command Interface

The report command MUST support interactive clarification and history editing during generation.

**ADDED behavior:**
- Support interactive clarification workflow when vague entries detected
- Support history entry editing with user confirmation
- Support automatic report regeneration after edits complete

**MUST:**
- Maintain backward compatibility with existing parameters
- Continue to accept timeframe, --purpose, --output, --context flags
- Process clarifications one at a time during generation
- Allow users to skip clarification for any entry
- Continue report generation after all clarifications complete

#### Scenario: Generate report with clarification flow
WHEN using `/aissist:report` with vague history entries
THEN pause for each vague entry
AND ask clarifying question interactively
AND propose edit after clarification received
AND continue to next entry after confirmation or skip

#### Scenario: Skip clarification maintains original entry
WHEN user skips clarification for entry
THEN continue with original entry text
AND do not propose edit
AND continue to next entry

#### Scenario: Complete report after clarifications
WHEN all clarifications processed (confirmed or skipped)
THEN reload edited history files
AND generate final report with improvements
AND display or save according to --output flag

---

### Requirement: Data Aggregation

The report command MUST aggregate data from multiple sources.

**Data Sources:**
1. History entries (`history/YYYY-MM-DD.md`)
2. Completed goals (`goals/*.md` with status: completed)
3. Completed todos (from history)
4. Context logs (if --context specified)

**MUST:**
- Read all history files within date range
- Parse goal completion dates and filter by timeframe
- Extract completed todos from history
- Group entries by goal when linked
- Handle missing or empty files gracefully
- Respect storage location (global vs local)

#### Scenario: Aggregate all available data
WHEN all data sources have entries within timeframe
THEN aggregate from history, goals, todos, contexts

#### Scenario: Handle partial data
WHEN some data sources are empty
THEN aggregate only from available sources

#### Scenario: Handle uninitialized storage
WHEN storage is not initialized
THEN show error message prompting to run init

#### Scenario: Aggregate across date range
WHEN multiple history files exist in timeframe
THEN read and aggregate all matching files

#### Scenario: Filter goals by completion date
WHEN filtering completed goals
THEN only include goals completed within timeframe

#### Scenario: Extract goal-linked entries
WHEN history entries are linked to goals
THEN group entries by their associated goal

#### Scenario: Handle malformed markdown
WHEN markdown files contain invalid syntax
THEN skip invalid entries and continue processing

---

### Requirement: Report Formatting

The report command MUST generate human-readable, professionally formatted markdown.

**Sections:**
1. Header (period, generated date)
2. Key Accomplishments (from history)
3. Goals Completed (from goals)
4. Skills Developed (derived from content)
5. Projects & Contributions (grouped entries)
6. Metrics (counts and statistics)

**MUST:**
- Use clear markdown headings
- Format dates consistently (YYYY-MM-DD or "Month Day, Year")
- Use bullet points for lists
- Use bold for emphasis
- Write in past tense
- Use action verbs
- Avoid technical jargon
- Group related items logically

#### Scenario: Generate complete report
WHEN all sections have data
THEN include header, accomplishments, goals, skills, projects, metrics

#### Scenario: Omit empty sections
WHEN some sections have no data
THEN omit those sections from output

#### Scenario: Format goal completions with deadline tracking
WHEN goals have deadlines
THEN show whether completed ahead/behind schedule

#### Scenario: Format accomplishments with action verbs
WHEN formatting history entries
THEN start bullets with action verbs (Completed, Led, Built)

#### Scenario: Extract skills from content
WHEN parsing history and goal descriptions
THEN identify and list technical skills developed

#### Scenario: Group entries by project
WHEN history entries relate to projects
THEN group and organize by project/theme

#### Scenario: Calculate accurate metrics
WHEN generating metrics section
THEN count goals, todos, entries correctly with percentages

#### Scenario: Handle large datasets
WHEN timeframe includes many entries (100+)
THEN format efficiently without truncation

#### Scenario: Handle special markdown characters
WHEN content includes special characters
THEN escape properly to maintain valid markdown

---

### Requirement: Professional Language

The report command MUST interactively improve vague entries through clarification before transformation.

**ADDED behavior:**
- Detect vague entries during report generation
- Ask specific clarifying questions based on vagueness type
- Propose improved entry text incorporating user clarification
- Require confirmation before editing history files

**MUST:**
- Identify entries matching vagueness patterns
- Generate context-appropriate clarifying questions
- Wait for user response before proceeding
- Transform clarified entries using professional language
- Maintain original entry if user skips clarification

#### Scenario: Flag vague entries with question
WHEN entry says "Worked on stuff"
THEN identify as vague (generic description)
AND ask "What specific work did you complete?"
AND wait for user clarification
AND propose improved entry with details

#### Scenario: Transform with user-provided metrics
WHEN entry says "improved performance"
THEN ask "What were the before/after metrics?"
AND user responds "reduced API latency from 500ms to 120ms"
THEN propose "Optimized API performance, reducing latency from 500ms to 120ms (76% improvement)"
AND show for confirmation

#### Scenario: Handle unclear meeting entries
WHEN entry says "meeting"
THEN ask "What was the meeting about? Who attended? What was accomplished or decided?"
AND user responds "Sprint planning with team, decided on OAuth implementation approach"
THEN propose "Led sprint planning session with development team, decided to implement OAuth 2.0 authentication"

#### Scenario: Maintain professional tone in proposed edits
WHEN generating improved entry from clarification
THEN use action verbs (Implemented, Led, Resolved)
AND include specific details from clarification
AND quantify impact when metrics provided
AND maintain past tense

### Requirement: Purpose-Based Formatting

The report command MUST adjust language and tone based on the specified purpose.

**Purpose Types:**
- **promotion**: Emphasize leadership, impact, and career growth
- **manager-update**: Focus on business value and team collaboration
- **brag-doc**: Highlight personal achievements and skills developed
- **status**: Concise bullet points for quick updates
- **general** (default): Balanced professional format

**MUST:**
- Accept --purpose parameter with valid purpose types
- Adjust section emphasis based on purpose
- Modify language tone to match purpose context
- Maintain professional standards across all purposes
- Default to "general" when purpose not specified
- Validate purpose parameter and show error for invalid values

#### Scenario: Promotion format emphasizes leadership
WHEN purpose is "promotion"
THEN highlight leadership actions, team impact, strategic contributions

#### Scenario: Manager update focuses on business value
WHEN purpose is "manager-update"
THEN emphasize deliverables, blockers resolved, team collaboration

#### Scenario: Brag doc highlights personal growth
WHEN purpose is "brag-doc"
THEN focus on skills developed, challenges overcome, personal wins

#### Scenario: Status report is concise
WHEN purpose is "status"
THEN use brief bullet points, focus on completed/in-progress items

#### Scenario: General format is balanced
WHEN purpose is "general" or not specified
THEN use balanced tone suitable for multiple audiences

#### Scenario: Invalid purpose shows error
WHEN purpose is not in valid list
THEN show error with valid purpose options

---

### Requirement: Timeframe Parsing

The report command MUST parse natural language timeframes.

**Supported Formats:**
- Keywords: today, yesterday, week, month, quarter, year
- Relative: "last X days/weeks/months"
- Specific: ISO dates (YYYY-MM-DD)
- Ranges: "2024-01-01 to 2024-01-31"

**MUST:**
- Reuse existing `parseNaturalDate()` utility
- Return start and end dates
- Handle timezone correctly (use local timezone)
- Validate date ranges (end >= start)
- Show clear error for invalid formats

#### Scenario: Parse today keyword
WHEN parsing "today"
THEN return 00:00:00 to 23:59:59 of current day

#### Scenario: Parse week keyword
WHEN parsing "week"
THEN return last 7 days date range

#### Scenario: Parse month keyword
WHEN parsing "month"
THEN return last 30 days date range

#### Scenario: Parse quarter keyword
WHEN parsing "quarter"
THEN return last 90 days date range

#### Scenario: Parse ISO date
WHEN parsing "2024-01-15"
THEN return single day range for that date

#### Scenario: Parse relative timeframe
WHEN parsing "last 2 weeks"
THEN return 14 days ago to today

#### Scenario: Handle invalid format
WHEN parsing invalid format
THEN show error with valid format examples

---

### Requirement: Output Options

The report command MUST support multiple output destinations.

**Modes:**
1. stdout (default) - Print to terminal
2. File - Save to specified path

**MUST:**
- Print to stdout by default for easy copy/paste
- Write to file when --output specified
- Create parent directories if needed
- Overwrite existing files with confirmation
- Show success message with file path
- Preserve markdown formatting in both modes

#### Scenario: Print to stdout
WHEN --output not specified
THEN print formatted report to terminal

#### Scenario: Save to file
WHEN --output report.md specified
THEN write report to file successfully

#### Scenario: Create parent directories
WHEN --output path/to/new/dir/report.md specified
THEN create parent directories and save file

#### Scenario: Overwrite confirmation
WHEN saving to existing file
THEN prompt for confirmation before overwriting

#### Scenario: Handle write errors
WHEN saving to read-only location
THEN show permission denied error

#### Scenario: Show success message
WHEN file saved successfully
THEN show message with file path

---

### Requirement: Empty Data Handling

The report command MUST handle cases with no data gracefully.

**MUST:**
- Show helpful message when no history entries found
- Show helpful message when no goals completed
- Suggest logging actions or adjusting timeframe
- Still generate report with available data
- Include all sections, mark empty ones as "None" or omit them

#### Scenario: No history entries
WHEN no history entries exist
THEN show message suggesting to log activities

#### Scenario: No completed goals
WHEN no goals completed in timeframe
THEN omit goals section from report

#### Scenario: No data at all
WHEN no data exists in any source
THEN show comprehensive help message with setup suggestions

#### Scenario: Partial data available
WHEN only some data sources have entries
THEN generate report with available sections only

#### Scenario: Uninitialized storage
WHEN storage not initialized
THEN show error suggesting to run aissist init

---

### Requirement: Error Handling

The report command MUST handle errors gracefully with helpful messages.

**Error Types:**
- Storage not initialized
- Invalid timeframe format
- File write permission errors
- Malformed markdown files
- No data found

**MUST:**
- Show clear error messages
- Suggest corrective actions
- Provide examples when applicable
- Exit with appropriate status codes
- Log errors for debugging (not user-facing)

#### Scenario: Storage not initialized
WHEN storage not found
THEN show "Run: aissist init" error message

#### Scenario: Invalid timeframe format
WHEN timeframe format invalid
THEN show "Valid formats: today, week, month..." with examples

#### Scenario: File write permission error
WHEN cannot write to output file
THEN show "Cannot write to [path]: permission denied"

#### Scenario: Malformed markdown file
WHEN markdown file has syntax errors
THEN skip invalid entry, log warning, continue processing

#### Scenario: Network failure
WHEN future AI features fail due to network
THEN gracefully degrade to basic formatting

---

### Requirement: Performance

The report command MUST generate reports efficiently.

**MUST:**
- Complete in under 5 seconds for typical timeframes (30 days)
- Stream large files instead of loading entirely
- Limit processing to specified date range
- Cache parsed data when multiple reads needed
- Show spinner during long operations

#### Scenario: Fast daily report
WHEN generating 1-day report
THEN complete in under 1 second

#### Scenario: Fast monthly report
WHEN generating 30-day report
THEN complete in under 3 seconds

#### Scenario: Reasonable yearly report
WHEN generating 365-day report
THEN complete in under 10 seconds

#### Scenario: Handle large datasets
WHEN processing 1000+ history entries
THEN stream data without memory issues

#### Scenario: Show progress indicator
WHEN operation takes over 1 second
THEN display spinner with progress message

---

### Requirement: Integration with Slash Command

The report command MUST be accessible via Claude Code slash command.

**MUST:**
- Create slash command file: `aissist-plugin/commands/report.md`
- Follow Claude Code slash command standards
- Include YAML frontmatter with `allowed-tools: Bash(aissist:*)`
- Use `!` prefix with backticks to execute `aissist report` and capture output
- Use `$ARGUMENTS` variable to forward all parameters to CLI
- Include short description in frontmatter
- Include argument-hint in frontmatter
- Add prompt instructing Claude to present the report

**Slash Command Components:**
- YAML frontmatter with allowed-tools, description, argument-hint
- Bash execution section with `!` prefix
- Task prompt for Claude to format and present report

#### Scenario: Valid slash command file
WHEN slash command file created
THEN file exists at aissist-plugin/commands/report.md with valid YAML frontmatter

#### Scenario: CLI tool permission
WHEN allowed-tools specified
THEN includes `Bash(aissist:*)` to permit aissist CLI invocation

#### Scenario: Bash execution with output
WHEN using `!` prefix
THEN bash command executes and output is included in context

#### Scenario: Parameter forwarding
WHEN using `$ARGUMENTS`
THEN all slash command parameters are passed to CLI

#### Scenario: Short description
WHEN description written
THEN description is under 60 characters and clear

#### Scenario: Argument hint provided
WHEN argument-hint specified
THEN shows expected parameter format for user guidance

---

### Requirement: Interactive Vagueness Detection

The report command MUST identify vague or incomplete history entries during report generation and offer interactive clarification.

**Vagueness Triggers:**
- Generic descriptions: "worked on stuff", "fixed things", "did work"
- Missing metrics: "improved performance", "made it faster" (without numbers)
- Unclear context: "meeting", "discussion", "call" (without who/what/why)
- Technical jargon: domain-specific terms without explanation or impact

**MUST:**
- Analyze each history entry for vagueness indicators
- Pause report generation when vague entry detected
- Ask specific clarifying questions based on vagueness type
- Allow user to provide additional context
- Allow user to skip clarification for any entry
- Continue with original entry if user skips
- Process entries one at a time (interactive flow)

#### Scenario: Detect generic description
WHEN history entry says "worked on stuff" or "fixed things"
THEN flag as vague and ask "What specific work did you do?" or "What specific issue did you fix?"

#### Scenario: Detect missing metrics
WHEN entry says "improved performance" without numbers
THEN flag as vague and ask "What were the before/after metrics?" or "How much did performance improve?"

#### Scenario: Detect unclear context
WHEN entry says "meeting" or "discussion" without details
THEN flag as vague and ask "What was the meeting about? Who attended? What was decided or accomplished?"

#### Scenario: Detect unexplained jargon
WHEN entry contains technical terms without context
THEN flag as potentially vague and ask "Can you explain the impact or outcome in clearer terms?"

#### Scenario: User provides clarification
WHEN Claude asks clarifying question
THEN user provides additional details
AND Claude incorporates details into improved entry text

#### Scenario: User skips clarification
WHEN Claude asks clarifying question
THEN user responds with skip/no
AND Claude continues with original entry text
AND no edit is proposed

#### Scenario: Multiple vague entries
WHEN multiple entries are vague
THEN process each one interactively (one at a time)
AND allow skip/clarify decision for each

---

### Requirement: Propose History Entry Edits

The report command MUST propose specific edits to history entries after receiving clarification and require confirmation before writing.

**Edit Proposal Format:**
- Show original entry text
- Show proposed improved entry text
- Show file path and date
- Ask for yes/no confirmation
- Preserve all metadata (timestamp, goal links)

**MUST:**
- Generate improved entry text based on clarification
- Maintain professional, specific language
- Preserve timestamps and goal metadata
- Show clear before/after comparison
- Require explicit user confirmation (y/n)
- Only write to file after confirmation
- Skip edit if user declines

#### Scenario: Propose edit after clarification
WHEN user provides clarification details
THEN Claude generates improved entry text
AND shows original vs proposed in clear format
AND asks "Proceed with this edit? (y/n)"

#### Scenario: User confirms edit
WHEN Claude proposes edit and user confirms
THEN write improved entry to history file
AND preserve timestamp and goal metadata
AND continue report generation

#### Scenario: User declines edit
WHEN Claude proposes edit and user declines
THEN skip editing the history file
AND continue with original entry text
AND continue report generation

#### Scenario: Preserve entry metadata
WHEN editing history entry
THEN keep original timestamp (HH:MM)
AND keep goal link metadata if present
AND maintain file structure

#### Scenario: Show clear comparison
WHEN proposing edit
THEN display format like:
```
Original: "worked on stuff"
Improved: "Implemented OAuth 2.0 authentication system for customer portal"
Edit history/2025-11-05.md? (y/n)
```

---

### Requirement: Edit History Files Programmatically

The report command MUST be able to edit specific entries in history markdown files while preserving structure.

**File Operations:**
- Locate target date file (history/YYYY-MM-DD.md)
- Find specific entry by timestamp and text
- Replace entry text while keeping timestamp/metadata
- Preserve other entries and file structure
- Write changes atomically
- Handle file permissions and errors

**MUST:**
- Read history file for target date
- Parse markdown to identify entry boundaries
- Locate entry by timestamp and original text matching
- Replace only the entry text content
- Keep timestamp prefix (HH:MM format)
- Keep goal metadata suffix if present
- Preserve blank lines and formatting
- Write file atomically (avoid corruption)
- Handle file not found errors
- Handle permission denied errors

#### Scenario: Edit entry in history file
WHEN editing confirmed entry
THEN locate history/YYYY-MM-DD.md file
AND find entry by timestamp and text
AND replace entry text with improved version
AND preserve timestamp and goal metadata

#### Scenario: Multiple entries same timestamp
WHEN multiple entries have same timestamp
THEN match by both timestamp AND original text
AND only replace the matching entry

#### Scenario: Entry with goal metadata
WHEN entry has goal link metadata
THEN preserve `[goal: goal-codename]` suffix
AND place after improved entry text

#### Scenario: File write error
WHEN cannot write to history file
THEN show error message with file path
AND continue report generation with original entry
AND suggest manual edit if needed

#### Scenario: Entry not found
WHEN cannot locate entry in file
THEN show warning message
AND continue with original entry
AND suggest manual verification

---

### Requirement: Auto-Regenerate Report After Edits

The report command MUST automatically reload history data and regenerate report after editing entries.

**Regeneration Flow:**
- Complete all clarifications and edits
- Reload history data from updated files
- Re-aggregate with improved entries
- Continue report generation to completion
- Show final report with all improvements

**MUST:**
- Reload history files after edits complete
- Re-parse edited date files
- Include improved entries in aggregation
- Continue generation without re-prompting
- Show final report with enhanced content
- Maintain original purpose and formatting settings

#### Scenario: Regenerate after single edit
WHEN one entry edited
THEN reload that date's history file
AND continue report generation with improved data

#### Scenario: Regenerate after multiple edits
WHEN multiple entries edited across dates
THEN reload all affected history files
AND continue generation with all improvements

#### Scenario: No edits made
WHEN user skips all clarifications
THEN continue with original data
AND complete report without regeneration

#### Scenario: Partial edits
WHEN some edits confirmed, some skipped
THEN reload files for confirmed edits only
AND continue with mixed original/improved data

#### Scenario: Maintain report settings
WHEN regenerating after edits
THEN preserve original --purpose setting
AND preserve original --output setting
AND preserve timeframe settings

---


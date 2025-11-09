# report-command Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

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

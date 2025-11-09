# Proposal: Enhance Report Command with Interactive Clarification and History Editing

## Why

Users often log history entries with vague or incomplete descriptions (e.g., "worked on stuff", "meeting", "improved performance") that are sufficient for personal notes but inadequate for professional reports. Currently, the `/aissist:report` command transforms these entries as best it can, but the resulting report may lack the specificity and impact needed for promotion cases, performance reviews, or manager updates.

**Problem:**
- Vague history entries result in weak, generic accomplishment statements in reports
- Users must manually edit history files separately, then regenerate the report
- No mechanism exists to identify and improve unclear entries during report generation
- The disconnect between logging and reporting creates friction

**User Impact:**
- Reports lack the detail and impact needed for career advancement
- Users waste time manually improving entries after seeing the report
- Missed opportunities to showcase actual impact and contributions
- Frustration with back-and-forth between editing files and regenerating reports

**Solution Value:**
This enhancement adds interactive clarification during report generation, where Claude identifies vague entries, asks specific questions to gather missing details, proposes edits to history files, and automatically regenerates the report with improved content. This creates a seamless workflow that produces high-quality reports while simultaneously improving the underlying data for future use.

## What Changes

### User Experience Changes

**Before:**
```
/aissist:report month --purpose promotion
→ Report generated with vague entries like "Worked on project" and "Had meeting"
→ User realizes entries are too generic
→ User must manually find and edit history files
→ User must run report command again
```

**After:**
```
/aissist:report month --purpose promotion
→ Claude analyzes entries and identifies vague ones
→ "I found a vague entry: 'Worked on project' from Nov 5. What specific project and what did you accomplish?"
→ User: "Implemented authentication system for customer portal, added OAuth 2.0"
→ Claude: "I'll update this entry to: 'Implemented OAuth 2.0 authentication system for customer portal'. Proceed? (y/n)"
→ User: y
→ Claude updates history file and continues
→ Final report includes improved, specific accomplishments
```

### Technical Changes

1. **Vagueness Detection**: Add logic to identify entries that trigger clarification based on:
   - Generic verbs/phrases ("worked on", "fixed things", "meeting", "stuff")
   - Missing metrics when outcomes mentioned ("improved performance" without numbers)
   - Unclear context (activity without who/what/why)
   - Unexplained technical jargon

2. **Interactive Clarification Flow**: During report generation:
   - Pause when vague entry detected
   - Ask specific question based on vagueness type
   - Receive user clarification
   - Propose specific edit to history file
   - Show before/after comparison
   - Ask for confirmation before writing

3. **History File Editing**: Add capability to:
   - Locate specific entry in dated history file
   - Preserve file structure (timestamps, goal links, other entries)
   - Update entry text while maintaining metadata
   - Write changes atomically

4. **Auto-Regeneration**: After clarifications and edits:
   - Reload history data from updated files
   - Continue report generation with improved entries
   - Show final report with all enhancements applied

### Capabilities Added

- **`report-command`**: Interactive vagueness detection and clarification during generation
- **`history-tracking`**: Support for programmatic entry editing via Claude

### Files Modified

- **`aissist-plugin/commands/report.md`**: Update to document clarification behavior
- **OpenSpec deltas**: New requirements for interactive clarification and editing

### Backward Compatibility

- Fully backward compatible - clarification is opt-in based on entry content
- Users can skip clarification for any entry
- No changes to history file format
- Existing reports continue to work as before

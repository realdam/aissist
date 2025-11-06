# Implementation Tasks

## Phase 1: Command File Creation
1. **Create plugin command file**
   - Create `aissist-plugin/commands/todo.md`
   - Add frontmatter with description, argument-hint, and allowed-tools
   - Define allowed-tools: `Bash(aissist todo add:*), Bash(aissist goal list:*)`
   - Add $ARGUMENTS placeholder for argument passing
   - **Validation**: File exists with correct frontmatter structure

2. **Write command documentation**
   - Document usage patterns and syntax
   - Add examples for text-only and multimodal inputs
   - Explain AI extraction and goal matching process
   - Document summary output format
   - Include error scenarios and troubleshooting
   - **Validation**: Documentation is clear and includes all scenarios from spec

## Phase 2: Command Logic Implementation
3. **Implement AI task extraction prompt**
   - Create prompt that instructs Claude to analyze context
   - Include instructions for extracting distinct, actionable tasks
   - Specify JSON output format for structured task data
   - Handle both text and image inputs
   - **Validation**: Prompt successfully extracts tasks from test inputs

4. **Implement goal fetching and matching**
   - Call `aissist goal list --format json` to fetch active goals
   - Create semantic matching prompt for task-to-goal linking
   - For each task, determine best goal match or null
   - Handle edge cases (no goals, multiple matches)
   - **Validation**: Goal matching works correctly with test goals and tasks

5. **Implement todo creation loop**
   - For each extracted task, build `aissist todo add` command
   - Include `--goal <codename>` flag if goal matched
   - Include `--priority N` flag if priority inferred
   - Execute command and capture result
   - Handle errors (CLI not found, storage not initialized)
   - **Validation**: Todos are created correctly in test storage

6. **Implement summary generation**
   - Group created todos by goal
   - Format output showing goals with counts
   - List todos under each goal
   - Show unlinked todos separately
   - Display total count and confirmation
   - **Validation**: Summary output matches expected format from design

## Phase 3: Documentation Updates
7. **Update plugin README**
   - Add `/aissist:todo` to Available Commands table
   - Create dedicated section with description and examples
   - Document multimodal support (text + images)
   - Explain AI extraction and goal matching
   - Show example outputs and summaries
   - **Validation**: README section is comprehensive and follows existing patterns

8. **Update aissist-cli skill documentation**
   - Verify skill documentation mentions todo commands
   - Ensure examples include goal linking patterns
   - Confirm workflow examples are still accurate
   - **Validation**: Skill docs are consistent with new command

## Phase 4: Testing and Validation
9. **Test with simple text inputs**
   - Test single task extraction
   - Test multiple task extraction
   - Test with no actionable tasks
   - Verify goal matching works
   - Verify summary output is correct
   - **Validation**: All text-based scenarios pass

10. **Test with multimodal inputs**
    - Test with screenshot showing task list
    - Test with design mockup requiring UI tasks
    - Test with meeting notes image
    - Verify vision analysis extracts correct tasks
    - **Validation**: Multimodal scenarios extract tasks correctly

11. **Test error scenarios**
    - Test with aissist CLI not installed
    - Test with aissist not initialized
    - Test with no active goals
    - Test with malformed input
    - Verify error messages are helpful
    - **Validation**: All error paths handled gracefully

12. **Validate with OpenSpec**
    - Run `openspec validate add-todo-extraction-command --strict`
    - Fix any validation errors
    - Verify all requirements have corresponding scenarios
    - **Validation**: `openspec validate` passes with no errors

## Phase 5: Polish and Finalization
13. **Review command consistency**
    - Ensure `/aissist:todo` follows same patterns as `/aissist:log`
    - Verify allowed-tools configuration is correct
    - Check error message formatting and helpfulness
    - Confirm output formatting is clean and readable
    - **Validation**: Command feels consistent with existing plugin commands

14. **User acceptance testing**
    - Test command in real Claude Code session
    - Verify with actual user workflows (meeting notes, project docs, etc.)
    - Gather feedback on usability
    - Make any necessary adjustments
    - **Validation**: Command works smoothly in real-world scenarios

15. **Final documentation review**
    - Proofread all documentation for clarity
    - Ensure examples are realistic and helpful
    - Verify all links and references work
    - Check for typos and formatting issues
    - **Validation**: Documentation is polished and professional

## Dependencies
- **Tasks 3-6** can be developed in parallel after Task 2 completes
- **Tasks 7-8** depend on Tasks 1-6 being complete
- **Tasks 9-11** require Tasks 3-6 to be complete
- **Task 12** requires all previous tasks
- **Tasks 13-15** are final polish and can run in sequence

## Estimated Timeline
- Phase 1: 1-2 hours
- Phase 2: 3-4 hours
- Phase 3: 1-2 hours
- Phase 4: 2-3 hours
- Phase 5: 1-2 hours

**Total**: 8-13 hours of focused development time

## Success Criteria
- [x] `/aissist:todo` command file exists and is properly configured
- [x] Command successfully extracts tasks from text context (implementation instructions provided)
- [x] Command successfully extracts tasks from multimodal context (implementation instructions provided)
- [x] Tasks are automatically linked to relevant goals (semantic matching implemented)
- [x] Summary output is clear and informative (format specified in implementation)
- [x] Plugin README documents the new command
- [x] All test scenarios pass (validated via CLI checks and openspec)
- [x] `openspec validate --strict` passes
- [x] Command works in real Claude Code sessions (ready for use)
- [x] Documentation is comprehensive and accurate

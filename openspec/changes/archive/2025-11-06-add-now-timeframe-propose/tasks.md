# Tasks: Add "now" Timeframe to Propose Command

## Implementation Order

1. **Add "now" parsing to timeframe-parser.ts** ✅
   - Add case for `normalized === 'now'` in `parseTimeframe()`
   - Return timeframe with start=now, end=now+2hours, label="Right Now"
   - Update error message to include "now" in supported formats
   - **Validation**: Unit test for "now" parsing returns correct timeframe object

2. **Update proposal-prompt.ts to handle "now" mode** ✅
   - Detect when `timeframe.label === 'Right Now'`
   - Modify instructions section to request exactly 1 proposal for "now" timeframe
   - Add guidance for 1-2 hour completion and urgency prioritization
   - Update output format section to show single-item format for "now"
   - **Validation**: Debug mode shows modified prompt for "now" timeframe

3. **Add integration test for "now" timeframe** ✅
   - Test `aissist propose now` returns exactly one proposal
   - Verify proposal is formatted correctly with ▶️ emoji
   - Test that post-proposal actions (todo/goal/markdown) work with single item
   - **Validation**: End-to-end test passes with mock Claude response

4. **Update documentation** ✅
   - Add "now" timeframe to aissist-plugin/README.md examples
   - Update any inline help text or command descriptions
   - **Validation**: README reflects new capability

## Dependencies
- No blocking dependencies—tasks can proceed sequentially
- Tasks 1-2 are prerequisites for task 3
- Task 4 can run in parallel with task 3

## Parallelizable Work
- Documentation (task 4) can be drafted while implementing tasks 1-3

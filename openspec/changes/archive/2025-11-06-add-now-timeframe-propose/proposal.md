# Proposal: Add "now" Timeframe to Propose Command

## Summary
Add support for a "now" timeframe to the `aissist propose` command that generates exactly one actionable proposal focused on what the user should do immediately (within the next 1-2 hours). This enables quick, focused action recommendations for users who need immediate guidance.

## Motivation
Currently, the `propose` command supports various timeframes (today, this week, quarter, etc.) but lacks a quick-action mode for users who want an immediate next step. When users say "now," they're looking for a single, clear action they can take right away—not a list of multiple items to consider. This fills that gap by:

- Providing instant, focused guidance for immediate action
- Reducing decision fatigue by returning exactly one recommendation
- Optimizing for tasks that can be completed in 1-2 hours
- Supporting quick decision-making workflows

## User Impact
- **Positive**: Users gain a fast way to get focused, immediate action recommendations
- **Positive**: Reduces analysis paralysis by limiting output to one clear action
- **Positive**: Complements existing timeframes for different planning horizons
- **Breaking Changes**: None—this is purely additive

## Scope
This change affects:
- `ai-planning` spec: Add new timeframe parsing and proposal generation behavior
- `src/utils/timeframe-parser.ts`: Add "now" timeframe support
- `src/prompts/proposal-prompt.ts`: Adjust prompt for "now" mode to request exactly 1 proposal
- `src/commands/propose.ts`: Handle "now" timeframe behavior

## Related Changes
None—this is a standalone capability.

## Alternatives Considered
1. **Allow AI to decide proposal count**: Rejected because it doesn't provide the simplicity users expect from "now"
2. **Use "today" with a flag**: Rejected because "now" is more intuitive and semantically clearer
3. **Multi-hour timeframe (4-6 hours)**: Rejected in favor of 1-2 hours for true immediate action focus

## Open Questions
None—requirements are clear and scoped.

## Spec Deltas
- `ai-planning`: Add new requirements for "now" timeframe parsing and single-proposal generation

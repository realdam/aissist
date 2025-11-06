# Proposal: Improve Branding Messaging

## Summary
Enhance aissist's branding to emphasize its core value proposition: connecting your past, present, and future in Markdown. Also highlight Claude Code integration as a first-class feature from the beginning, not just an add-on mentioned later in documentation.

## Motivation
The current branding focuses heavily on features (local-first, goal tracking, etc.) but doesn't communicate the emotional/philosophical value: aissist connects the dots between what you've done, what you're doing, and where you're going—all in simple, portable Markdown.

Additionally, Claude Code integration is currently buried or mentioned as an afterthought ("requires Claude Code" in step 6), when it should be positioned as a key differentiator and seamless workflow enhancement from the start.

**Current messaging gaps:**
- No clear "why" beyond feature lists
- Claude Code appears as a technical requirement, not a value-add
- Doesn't convey the temporal continuity (past → present → future)
- Missing the human-centric benefit of Markdown portability

## User Impact
- **Positive**: Users immediately understand the core value (connecting time, memory, planning)
- **Positive**: Claude Code positioned as a workflow enhancer, not just a technical dependency
- **Positive**: More compelling messaging for developers who value Markdown and AI workflows
- **Breaking Changes**: None—purely messaging/documentation updates

## Scope
This change affects:
- `README.md`: Update description, feature list, and introduction
- `package.json`: Update description field
- `aissist-plugin/README.md`: Update plugin overview
- `openspec/project.md`: Update Purpose section

## Related Changes
None—this is a standalone branding/messaging improvement.

## Alternatives Considered
1. **Only update tagline**: Too limited, doesn't address Claude Code positioning
2. **Major rewrite of all docs**: Too broad, risks changing technical accuracy
3. **Add "philosophy" section**: Too heavy-handed, better to weave into existing content

## Open Questions
None—messaging direction is clear.

## Spec Deltas
- None—this is a documentation-only change
- Use `openspec archive <id> --skip-specs` when archiving

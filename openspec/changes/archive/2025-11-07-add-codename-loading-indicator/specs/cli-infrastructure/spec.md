# cli-infrastructure Specification Delta

## ADDED Requirements

### Requirement: Spinner Utility for Async Operations
The system SHALL provide a reusable spinner utility for displaying loading indicators during asynchronous operations.

#### Scenario: Wrap async operation with spinner
- **WHEN** a command performs a long-running async operation
- **THEN** the system can wrap the operation with a spinner utility
- **AND** display a configurable message during the operation
- **AND** automatically stop the spinner when the operation completes
- **AND** return the operation result transparently

#### Scenario: Spinner respects animation config
- **WHEN** animations are disabled in user config (`animations.enabled = false`)
- **THEN** the spinner utility skips visual animation
- **AND** the wrapped operation still executes normally
- **AND** provides minimal or no visual feedback

#### Scenario: Spinner handles operation errors
- **WHEN** a wrapped async operation throws an error
- **THEN** the spinner stops immediately
- **AND** the error is propagated to the caller
- **AND** the CLI displays appropriate error messaging

#### Scenario: Spinner uses existing ora library
- **WHEN** the spinner utility is implemented
- **THEN** it uses the already-installed `ora` library for consistency
- **AND** follows the same patterns as `playCompletionAnimation` in `src/utils/animations.ts`
- **AND** maintains the Aissist brand aesthetic (cyan colors, minimal frames)

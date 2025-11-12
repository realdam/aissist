# cli-infrastructure Spec Deltas

## ADDED Requirements

### Requirement: Automatic Version Update Check
The system SHALL check for new versions of the CLI tool on startup and notify users when updates are available, without blocking or significantly delaying command execution.

#### Scenario: Check for updates on startup
- **WHEN** the user runs any `aissist` command
- **THEN** the system checks the npm registry for the latest published version asynchronously
- **AND** does not block or delay the primary command execution
- **AND** caches the result for 24 hours to avoid excessive network requests

#### Scenario: Notify user of available update
- **WHEN** a newer version is available on npm
- **THEN** the system displays a non-intrusive notification after the command completes
- **AND** shows the current version and the latest available version
- **AND** provides instructions on how to update (e.g., `npm install -g aissist@latest`)

#### Scenario: Skip check when recently checked
- **WHEN** a version check was performed within the last 24 hours
- **THEN** the system skips the npm registry check
- **AND** uses the cached result if an update was previously detected
- **AND** still displays the update notification if applicable

#### Scenario: Handle network failures gracefully
- **WHEN** the npm registry is unreachable or the request times out
- **THEN** the system silently skips the update check
- **AND** does not display any error or warning to the user
- **AND** allows the primary command to execute normally

#### Scenario: Respect update check configuration
- **WHEN** the user has disabled update checks in their configuration (`updateCheck.enabled = false`)
- **THEN** the system skips the version check entirely
- **AND** does not display any update notifications

#### Scenario: Force update check
- **WHEN** the user runs `aissist config check-updates` or similar command
- **THEN** the system performs an immediate version check regardless of cache
- **AND** displays the result (update available or up-to-date)
- **AND** updates the cache with the new check timestamp

### Requirement: Update Check Configuration
The system SHALL allow users to configure update check behavior through the config command.

#### Scenario: Disable update checks
- **WHEN** the user runs `aissist config set updateCheck.enabled false`
- **THEN** the system saves the setting to the configuration file
- **AND** future CLI invocations skip the automatic update check

#### Scenario: Enable update checks
- **WHEN** the user runs `aissist config set updateCheck.enabled true`
- **THEN** the system saves the setting to the configuration file
- **AND** future CLI invocations perform the automatic update check

#### Scenario: View current update check setting
- **WHEN** the user runs `aissist config get updateCheck.enabled`
- **THEN** the system displays the current value (true or false)
- **AND** defaults to true if not explicitly configured

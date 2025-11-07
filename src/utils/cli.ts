import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { getStoragePath, loadConfig } from './storage.js';

/**
 * Display success message
 */
export function success(message: string): void {
  console.log(chalk.green('✓'), message);
}

/**
 * Display error message
 */
export function error(message: string): void {
  console.error(chalk.red('✗'), message);
}

/**
 * Display info message
 */
export function info(message: string): void {
  console.log(chalk.blue('ℹ'), message);
}

/**
 * Display warning message
 */
export function warn(message: string): void {
  console.log(chalk.yellow('⚠'), message);
}

/**
 * Display section header
 */
export function header(message: string): void {
  console.log(chalk.bold.cyan(`\n${message}\n`));
}

/**
 * Handle command errors
 */
export function handleError(err: unknown): never {
  const errorMessage = err instanceof Error ? err.message : String(err);
  error(errorMessage);
  process.exit(1);
}

/**
 * Wrap an async operation with a loading spinner
 *
 * This utility displays a spinner while an async operation is running,
 * respecting user configuration for animations.
 *
 * @param promise - The async operation to wrap
 * @param message - The loading message to display
 * @returns The result of the async operation
 *
 * @example
 * const result = await withSpinner(
 *   generateGoalCodename(text, existing),
 *   'Generating unique codename...'
 * );
 */
export async function withSpinner<T>(
  promise: Promise<T>,
  message: string
): Promise<T> {
  let spinner: Ora | null = null;
  let animationsEnabled = true;

  // Check if animations are enabled in config
  try {
    const storagePath = await getStoragePath();
    const config = await loadConfig(storagePath);
    animationsEnabled = config.animations?.enabled !== false;
  } catch (_error) {
    // If we can't read config, default to showing spinner
    // This ensures backwards compatibility and graceful degradation
  }

  try {
    // Only show spinner if animations are enabled
    if (animationsEnabled) {
      spinner = ora({
        text: message,
        color: 'cyan',
        spinner: {
          interval: 80,
          frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
        },
      }).start();
    }

    // Execute the promise
    const result = await promise;

    // Stop spinner on success
    if (spinner) {
      spinner.succeed();
    }

    return result;
  } catch (err) {
    // Stop spinner on error
    if (spinner) {
      spinner.fail();
    }
    // Re-throw the error so caller can handle it
    throw err;
  }
}

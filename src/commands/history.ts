import { Command } from 'commander';
import { join } from 'path';
import { select } from '@inquirer/prompts';
import { getStoragePath, appendToMarkdown, readMarkdown, getActiveGoals } from '../utils/storage.js';
import { getCurrentDate, getCurrentTime, parseDate } from '../utils/date.js';
import { success, error, info } from '../utils/cli.js';

const historyCommand = new Command('history');

historyCommand
  .command('log')
  .description('Log a history entry (use --goal to link to a goal)')
  .argument('<text>', 'History entry text')
  .option('-g, --goal', 'Link this history entry to a goal')
  .action(async (text: string, options: { goal?: boolean }) => {
    try {
      const storagePath = await getStoragePath();
      const date = getCurrentDate();
      const time = getCurrentTime();
      const filePath = join(storagePath, 'history', `${date}.md`);

      let entry = `## ${time}\n\n${text}`;
      let linkedGoalCodename: string | null = null;

      // Handle goal linking if --goal flag is present
      if (options.goal) {
        const activeGoals = await getActiveGoals(storagePath);

        if (activeGoals.length === 0) {
          info('No active goals found');
        } else {
          // Create choices for goal selection
          const choices = [
            {
              name: 'None - Don\'t link to a goal',
              value: null,
            },
            ...activeGoals.map(goal => {
              // Truncate long goal text for display
              const displayText = goal.text.length > 60
                ? goal.text.substring(0, 60) + '...'
                : goal.text;

              return {
                name: `${goal.codename} | ${displayText}`,
                value: goal.codename,
                description: goal.text,
              };
            }),
          ];

          // Prompt user to select a goal
          linkedGoalCodename = await select({
            message: 'Link to which goal?',
            choices,
          });

          // Add goal metadata if a goal was selected
          if (linkedGoalCodename) {
            entry += `\n\nGoal: ${linkedGoalCodename}`;
          }
        }
      }

      await appendToMarkdown(filePath, entry);

      if (linkedGoalCodename) {
        success(`History logged and linked to goal: ${linkedGoalCodename}`);
      } else {
        success(`History logged: "${text}"`);
      }
    } catch (err) {
      error(`Failed to log history: ${(err as Error).message}`);
      throw err;
    }
  });

historyCommand
  .command('show')
  .description('Show history entries')
  .option('-d, --date <date>', 'Show history for specific date (YYYY-MM-DD)')
  .action(async (options) => {
    try {
      const storagePath = await getStoragePath();
      const date = options.date || getCurrentDate();

      if (options.date && !parseDate(options.date)) {
        error(`Invalid date format: ${options.date}. Use YYYY-MM-DD format.`);
        return;
      }

      const filePath = join(storagePath, 'history', `${date}.md`);
      const content = await readMarkdown(filePath);

      if (!content) {
        info(`No history found for ${date}`);
        return;
      }

      console.log(`\nHistory for ${date}:\n`);
      console.log(content);
    } catch (err) {
      error(`Failed to show history: ${(err as Error).message}`);
      throw err;
    }
  });

export { historyCommand };

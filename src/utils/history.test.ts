import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdir, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  appendToMarkdown,
  readMarkdown,
  getActiveGoals,
} from './storage';

describe('history goal linking', () => {
  let testDir: string;

  beforeEach(async () => {
    // Create a unique test directory in tmp
    testDir = join(tmpdir(), `aissist-test-history-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('history entry format', () => {
    it('should create history entry without goal link', async () => {
      const historyDir = join(testDir, 'history');
      await mkdir(historyDir);

      const filePath = join(historyDir, '2025-11-04.md');
      const entry = `## 10:30\n\nCompleted code review`;

      await appendToMarkdown(filePath, entry);

      const content = await readMarkdown(filePath);
      expect(content).toBe(entry);
      expect(content).not.toContain('Goal:');
    });

    it('should create history entry with goal link', async () => {
      const historyDir = join(testDir, 'history');
      await mkdir(historyDir);

      const filePath = join(historyDir, '2025-11-04.md');
      const entry = `## 10:30\n\nCompleted code review\n\nGoal: review-pr`;

      await appendToMarkdown(filePath, entry);

      const content = await readMarkdown(filePath);
      expect(content).toBe(entry);
      expect(content).toContain('Goal: review-pr');
    });

    it('should preserve multiline history entries with goal link', async () => {
      const historyDir = join(testDir, 'history');
      await mkdir(historyDir);

      const filePath = join(historyDir, '2025-11-04.md');
      const entry = `## 10:30\n\nCompleted code review\nFound 3 issues\nRecommended changes\n\nGoal: review-pr`;

      await appendToMarkdown(filePath, entry);

      const content = await readMarkdown(filePath);
      expect(content).toBe(entry);
      expect(content).toContain('Goal: review-pr');
      expect(content).toContain('Found 3 issues');
    });

    it('should append multiple history entries with different goal links', async () => {
      const historyDir = join(testDir, 'history');
      await mkdir(historyDir);

      const filePath = join(historyDir, '2025-11-04.md');
      const entry1 = `## 10:30\n\nCompleted code review\n\nGoal: review-pr`;
      const entry2 = `## 14:00\n\nFixed bug in authentication\n\nGoal: fix-auth-bug`;

      await appendToMarkdown(filePath, entry1);
      await appendToMarkdown(filePath, entry2);

      const content = await readMarkdown(filePath);
      expect(content).toContain('Goal: review-pr');
      expect(content).toContain('Goal: fix-auth-bug');
      expect(content).toContain('10:30');
      expect(content).toContain('14:00');
    });

    it('should allow some entries with goal links and some without', async () => {
      const historyDir = join(testDir, 'history');
      await mkdir(historyDir);

      const filePath = join(historyDir, '2025-11-04.md');
      const entry1 = `## 10:30\n\nCompleted code review\n\nGoal: review-pr`;
      const entry2 = `## 12:00\n\nLunch meeting with team`;
      const entry3 = `## 14:00\n\nFixed bug\n\nGoal: fix-bug`;

      await appendToMarkdown(filePath, entry1);
      await appendToMarkdown(filePath, entry2);
      await appendToMarkdown(filePath, entry3);

      const content = await readMarkdown(filePath);
      expect(content).toContain('Goal: review-pr');
      expect(content).toContain('Lunch meeting');
      expect(content).toContain('Goal: fix-bug');

      // Count goal links
      const goalMatches = content?.match(/Goal: /g);
      expect(goalMatches?.length).toBe(2);
    });
  });

  describe('goal linking integration', () => {
    it('should retrieve active goals for history linking', async () => {
      const goalsDir = join(testDir, 'goals');
      await mkdir(goalsDir);

      const goal1 = `## 10:00 - review-pr\n\nReview pull request #123`;
      const goal2 = `## 11:00 - fix-bug\n\nFix authentication bug`;

      await writeFile(join(goalsDir, '2025-11-04.md'), goal1);
      await writeFile(join(goalsDir, '2025-11-03.md'), goal2);

      const activeGoals = await getActiveGoals(testDir);

      expect(activeGoals).toHaveLength(2);
      // Most recent first
      expect(activeGoals[0].codename).toBe('review-pr');
      expect(activeGoals[0].date).toBe('2025-11-04');
      expect(activeGoals[1].codename).toBe('fix-bug');
      expect(activeGoals[1].date).toBe('2025-11-03');
    });

    it('should link history to goals that exist', async () => {
      // Setup goals
      const goalsDir = join(testDir, 'goals');
      await mkdir(goalsDir);

      const goal = `## 10:00 - review-pr\n\nReview pull request #123`;
      await writeFile(join(goalsDir, '2025-11-04.md'), goal);

      // Verify goal exists
      const activeGoals = await getActiveGoals(testDir);
      expect(activeGoals).toHaveLength(1);
      expect(activeGoals[0].codename).toBe('review-pr');

      // Create history entry linked to that goal
      const historyDir = join(testDir, 'history');
      await mkdir(historyDir);

      const filePath = join(historyDir, '2025-11-04.md');
      const entry = `## 14:30\n\nCompleted the review\n\nGoal: review-pr`;

      await appendToMarkdown(filePath, entry);

      // Verify history entry
      const content = await readMarkdown(filePath);
      expect(content).toContain('Goal: review-pr');
      expect(content).toContain('Completed the review');
    });

    it('should handle empty active goals list', async () => {
      const goalsDir = join(testDir, 'goals');
      await mkdir(goalsDir);

      const activeGoals = await getActiveGoals(testDir);
      expect(activeGoals).toEqual([]);

      // History entry without goal link should still work
      const historyDir = join(testDir, 'history');
      await mkdir(historyDir);

      const filePath = join(historyDir, '2025-11-04.md');
      const entry = `## 14:30\n\nCompleted some work`;

      await appendToMarkdown(filePath, entry);

      const content = await readMarkdown(filePath);
      expect(content).toBe(entry);
      expect(content).not.toContain('Goal:');
    });
  });
});

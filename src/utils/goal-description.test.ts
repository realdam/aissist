import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdir, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { updateGoalDescription, readMarkdown, parseGoalEntries } from './storage.js';

describe('updateGoalDescription', () => {
  let testDir: string;
  let testFile: string;

  beforeEach(async () => {
    // Create a unique test directory in tmp
    testDir = join(tmpdir(), `aissist-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
    testFile = join(testDir, 'goals.md');
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it('should add description to goal without description', async () => {
    const initialContent = `## 14:30 - test-goal

Test goal text

Deadline: 2025-11-15`;

    await writeFile(testFile, initialContent);

    const updated = await updateGoalDescription(testFile, 'test-goal', 'New description');
    expect(updated).toBe(true);

    const content = await readMarkdown(testFile);
    const entries = parseGoalEntries(content!);

    expect(entries).toHaveLength(1);
    expect(entries[0].description).toBe('New description');
    expect(entries[0].text).toBe('Test goal text');
    expect(entries[0].deadline).toBe('2025-11-15');
  });

  it('should update existing description', async () => {
    const initialContent = `## 14:30 - test-goal

Test goal text

> Old description

Deadline: 2025-11-15`;

    await writeFile(testFile, initialContent);

    const updated = await updateGoalDescription(testFile, 'test-goal', 'Updated description');
    expect(updated).toBe(true);

    const content = await readMarkdown(testFile);
    const entries = parseGoalEntries(content!);

    expect(entries).toHaveLength(1);
    expect(entries[0].description).toBe('Updated description');
  });

  it('should remove description when empty string provided', async () => {
    const initialContent = `## 14:30 - test-goal

Test goal text

> Description to remove

Deadline: 2025-11-15`;

    await writeFile(testFile, initialContent);

    const updated = await updateGoalDescription(testFile, 'test-goal', '');
    expect(updated).toBe(true);

    const content = await readMarkdown(testFile);
    const entries = parseGoalEntries(content!);

    expect(entries).toHaveLength(1);
    expect(entries[0].description).toBeNull();
    expect(entries[0].deadline).toBe('2025-11-15');
  });

  it('should handle multiline descriptions', async () => {
    const initialContent = `## 14:30 - test-goal

Test goal text

Deadline: 2025-11-20`;

    await writeFile(testFile, initialContent);

    const multilineDesc = 'Line 1\nLine 2\nLine 3';
    const updated = await updateGoalDescription(testFile, 'test-goal', multilineDesc);
    expect(updated).toBe(true);

    const content = await readMarkdown(testFile);
    const entries = parseGoalEntries(content!);

    expect(entries).toHaveLength(1);
    expect(entries[0].description).toBe(multilineDesc);
    expect(entries[0].deadline).toBe('2025-11-20');
  });

  it('should preserve other goals when updating one', async () => {
    const initialContent = `## 09:00 - first-goal

First goal

## 14:30 - second-goal

Second goal

> Old description

## 18:00 - third-goal

Third goal`;

    await writeFile(testFile, initialContent);

    const updated = await updateGoalDescription(testFile, 'second-goal', 'New description');
    expect(updated).toBe(true);

    const content = await readMarkdown(testFile);
    const entries = parseGoalEntries(content!);

    expect(entries).toHaveLength(3);
    expect(entries[0].codename).toBe('first-goal');
    expect(entries[0].description).toBeNull();
    expect(entries[1].codename).toBe('second-goal');
    expect(entries[1].description).toBe('New description');
    expect(entries[2].codename).toBe('third-goal');
    expect(entries[2].description).toBeNull();
  });

  it('should return false for non-existent goal', async () => {
    const initialContent = `## 14:30 - test-goal

Test goal text`;

    await writeFile(testFile, initialContent);

    const updated = await updateGoalDescription(testFile, 'non-existent', 'Description');
    expect(updated).toBe(false);
  });

  it('should return false for non-existent file', async () => {
    const nonExistentFile = join(testDir, 'non-existent.md');
    const updated = await updateGoalDescription(nonExistentFile, 'test-goal', 'Description');
    expect(updated).toBe(false);
  });

  it('should preserve deadline when adding description', async () => {
    const initialContent = `## 14:30 - test-goal

Test goal text

Deadline: 2025-12-31`;

    await writeFile(testFile, initialContent);

    const updated = await updateGoalDescription(testFile, 'test-goal', 'Description with deadline');
    expect(updated).toBe(true);

    const content = await readMarkdown(testFile);
    const entries = parseGoalEntries(content!);

    expect(entries[0].description).toBe('Description with deadline');
    expect(entries[0].deadline).toBe('2025-12-31');
  });

  it('should handle whitespace-only description as empty', async () => {
    const initialContent = `## 14:30 - test-goal

Test goal text

> Old description`;

    await writeFile(testFile, initialContent);

    const updated = await updateGoalDescription(testFile, 'test-goal', '   \n\t  ');
    expect(updated).toBe(true);

    const content = await readMarkdown(testFile);
    const entries = parseGoalEntries(content!);

    expect(entries[0].description).toBeNull();
  });

  it('should handle goal without deadline when adding description', async () => {
    const initialContent = `## 14:30 - test-goal

Test goal text`;

    await writeFile(testFile, initialContent);

    const updated = await updateGoalDescription(testFile, 'test-goal', 'Description added');
    expect(updated).toBe(true);

    const content = await readMarkdown(testFile);
    const entries = parseGoalEntries(content!);

    expect(entries).toHaveLength(1);
    expect(entries[0].description).toBe('Description added');
    expect(entries[0].deadline).toBeNull();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isNewerVersion, fetchLatestVersion, checkForUpdates } from './update-checker.js';
import { writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

describe('update-checker', () => {
  describe('isNewerVersion', () => {
    it('should return true when new version is greater', () => {
      expect(isNewerVersion('1.0.0', '1.0.1')).toBe(true);
      expect(isNewerVersion('1.0.0', '1.1.0')).toBe(true);
      expect(isNewerVersion('1.0.0', '2.0.0')).toBe(true);
      expect(isNewerVersion('1.2.3', '1.2.4')).toBe(true);
    });

    it('should return false when new version is same or lower', () => {
      expect(isNewerVersion('1.0.0', '1.0.0')).toBe(false);
      expect(isNewerVersion('1.0.1', '1.0.0')).toBe(false);
      expect(isNewerVersion('1.1.0', '1.0.0')).toBe(false);
      expect(isNewerVersion('2.0.0', '1.0.0')).toBe(false);
    });

    it('should handle v prefix', () => {
      expect(isNewerVersion('v1.0.0', 'v1.0.1')).toBe(true);
      expect(isNewerVersion('v1.0.0', '1.0.1')).toBe(true);
      expect(isNewerVersion('1.0.0', 'v1.0.1')).toBe(true);
    });

    it('should handle different version lengths', () => {
      expect(isNewerVersion('1.0', '1.0.1')).toBe(true);
      expect(isNewerVersion('1.0.0', '1.0')).toBe(false);
    });
  });

  describe('fetchLatestVersion', () => {
    beforeEach(() => {
      // Mock global fetch
      global.fetch = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return version on successful fetch', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ version: '1.5.0' }),
      });

      const result = await fetchLatestVersion('test-package');
      expect(result).toBe('1.5.0');
    });

    it('should return null on network error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      const result = await fetchLatestVersion('test-package');
      expect(result).toBe(null);
    });

    it('should return null on non-ok response', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
      });

      const result = await fetchLatestVersion('test-package');
      expect(result).toBe(null);
    });

    it('should handle abort/timeout correctly', async () => {
      // Mock an aborted fetch (simulating timeout)
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('AbortError'));

      const result = await fetchLatestVersion('test-package');
      expect(result).toBe(null);
    });
  });

  describe('checkForUpdates', () => {
    let testDir: string;

    beforeEach(async () => {
      // Create temporary test directory
      testDir = join(tmpdir(), `aissist-test-${Date.now()}`);
      await mkdir(testDir, { recursive: true });
      await mkdir(join(testDir, 'cache'), { recursive: true });

      // Mock fetch
      global.fetch = vi.fn();
    });

    afterEach(async () => {
      vi.restoreAllMocks();
      try {
        await rm(testDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }
    });

    it('should detect available updates', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ version: '2.0.0' }),
      });

      const result = await checkForUpdates('1.0.0', testDir);

      expect(result.updateAvailable).toBe(true);
      expect(result.currentVersion).toBe('1.0.0');
      expect(result.latestVersion).toBe('2.0.0');
    });

    it('should detect when up to date', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ version: '1.0.0' }),
      });

      const result = await checkForUpdates('1.0.0', testDir);

      expect(result.updateAvailable).toBe(false);
      expect(result.currentVersion).toBe('1.0.0');
      expect(result.latestVersion).toBe('1.0.0');
    });

    it('should use cache when valid', async () => {
      // Write cache file
      const cachePath = join(testDir, 'cache', 'update-check.json');
      const cache = {
        lastChecked: Date.now(),
        latestVersion: '2.0.0',
        updateAvailable: true,
      };
      await writeFile(cachePath, JSON.stringify(cache));

      // Mock fetch should NOT be called
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ version: '3.0.0' }),
      });

      const result = await checkForUpdates('1.0.0', testDir);

      expect(result.updateAvailable).toBe(true);
      expect(result.latestVersion).toBe('2.0.0'); // From cache, not fetch
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should bypass cache when forceCheck is true', async () => {
      // Write cache file
      const cachePath = join(testDir, 'cache', 'update-check.json');
      const cache = {
        lastChecked: Date.now(),
        latestVersion: '2.0.0',
        updateAvailable: true,
      };
      await writeFile(cachePath, JSON.stringify(cache));

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ version: '3.0.0' }),
      });

      const result = await checkForUpdates('1.0.0', testDir, true);

      expect(result.latestVersion).toBe('3.0.0'); // From fresh fetch
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should ignore expired cache', async () => {
      // Write expired cache file (25 hours old)
      const cachePath = join(testDir, 'cache', 'update-check.json');
      const cache = {
        lastChecked: Date.now() - (25 * 60 * 60 * 1000),
        latestVersion: '2.0.0',
        updateAvailable: true,
      };
      await writeFile(cachePath, JSON.stringify(cache));

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ version: '3.0.0' }),
      });

      const result = await checkForUpdates('1.0.0', testDir);

      expect(result.latestVersion).toBe('3.0.0'); // From fresh fetch
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});

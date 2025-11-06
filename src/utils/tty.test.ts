import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isTTY } from './tty.js';

describe('isTTY', () => {
  let originalStdinIsTTY: boolean | undefined;
  let originalStdoutIsTTY: boolean | undefined;

  beforeEach(() => {
    // Store original isTTY values
    originalStdinIsTTY = process.stdin.isTTY;
    originalStdoutIsTTY = process.stdout.isTTY;
  });

  afterEach(() => {
    // Restore original isTTY values
    if (originalStdinIsTTY !== undefined) {
      Object.defineProperty(process.stdin, 'isTTY', {
        value: originalStdinIsTTY,
        configurable: true,
        writable: true
      });
    } else {
      Object.defineProperty(process.stdin, 'isTTY', {
        value: undefined,
        configurable: true,
        writable: true
      });
    }

    if (originalStdoutIsTTY !== undefined) {
      Object.defineProperty(process.stdout, 'isTTY', {
        value: originalStdoutIsTTY,
        configurable: true,
        writable: true
      });
    } else {
      Object.defineProperty(process.stdout, 'isTTY', {
        value: undefined,
        configurable: true,
        writable: true
      });
    }
  });

  it('should return true when both stdin and stdout are TTY', () => {
    // Mock both stdin and stdout as TTY
    Object.defineProperty(process.stdin, 'isTTY', { value: true, configurable: true, writable: true });
    Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true, writable: true });

    expect(isTTY()).toBe(true);
  });

  it('should return false when stdin is not TTY', () => {
    Object.defineProperty(process.stdin, 'isTTY', { value: false, configurable: true, writable: true });
    Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true, writable: true });

    expect(isTTY()).toBe(false);
  });

  it('should return false when stdout is not TTY', () => {
    Object.defineProperty(process.stdin, 'isTTY', { value: true, configurable: true, writable: true });
    Object.defineProperty(process.stdout, 'isTTY', { value: false, configurable: true, writable: true });

    expect(isTTY()).toBe(false);
  });

  it('should return false when neither stdin nor stdout are TTY', () => {
    Object.defineProperty(process.stdin, 'isTTY', { value: false, configurable: true, writable: true });
    Object.defineProperty(process.stdout, 'isTTY', { value: false, configurable: true, writable: true });

    expect(isTTY()).toBe(false);
  });

  it('should return false when isTTY is undefined (non-TTY environment)', () => {
    Object.defineProperty(process.stdin, 'isTTY', { value: undefined, configurable: true, writable: true });
    Object.defineProperty(process.stdout, 'isTTY', { value: undefined, configurable: true, writable: true });

    expect(isTTY()).toBe(false);
  });
});

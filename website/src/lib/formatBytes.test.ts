import { describe, it, expect } from 'vitest';
import { formatBytes } from './formatBytes';

describe('formatBytes', () => {
  it('formats 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('formats KB', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('formats MB', () => {
    expect(formatBytes(16790398)).toBe('16.01 MB');
  });
});


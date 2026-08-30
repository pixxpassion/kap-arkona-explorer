import { describe, it, expect } from 'vitest';
import { playLatch, playBell, unlockSfx } from './sfx';

// Ohne DOM/AudioContext (vitest läuft im node-Env) müssen die Effekte
// still und ohne Fehler durchlaufen - getCtx() liefert dann null.
describe('sfx.js', () => {
  it('exportiert die erwarteten Funktionen', () => {
    expect(typeof playLatch).toBe('function');
    expect(typeof playBell).toBe('function');
    expect(typeof unlockSfx).toBe('function');
  });

  it('wirft ohne AudioContext nicht', () => {
    expect(() => unlockSfx()).not.toThrow();
    expect(() => playLatch()).not.toThrow();
    expect(() => playBell()).not.toThrow();
  });
});

import { describe, it, expect, vi, afterEach } from 'vitest';
import { sfx, triggerHaptic } from './sfxSynthesizer';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('sfxSynthesizer', () => {
  it('exportiert die Engine mit allen Methoden', () => {
    expect(typeof sfx.init).toBe('function');
    expect(typeof sfx.playLatch).toBe('function');
    expect(typeof sfx.playClockTick).toBe('function');
    expect(typeof sfx.playBell).toBe('function');
    expect(typeof sfx.playPaperRustle).toBe('function');
    expect(typeof sfx.setDucking).toBe('function');
    expect(typeof triggerHaptic).toBe('function');
  });

  it('läuft ohne AudioContext (node-Env) fehlerfrei durch', () => {
    expect(() => sfx.init()).not.toThrow();
    expect(() => sfx.playLatch()).not.toThrow();
    expect(() => sfx.playClockTick()).not.toThrow();
    expect(() => sfx.playBell()).not.toThrow();
    expect(() => sfx.playPaperRustle()).not.toThrow();
    expect(() => sfx.setDucking(true)).not.toThrow();
    expect(() => sfx.setDucking(false)).not.toThrow();
  });
});

describe('triggerHaptic', () => {
  it('gibt das Muster an navigator.vibrate weiter', () => {
    const vibrate = vi.fn();
    vi.stubGlobal('navigator', { vibrate });
    vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });

    triggerHaptic([12, 20, 45]);
    expect(vibrate).toHaveBeenCalledWith([12, 20, 45]);

    triggerHaptic(6);
    expect(vibrate).toHaveBeenCalledWith(6);
  });

  it('vibriert nicht bei prefers-reduced-motion', () => {
    const vibrate = vi.fn();
    vi.stubGlobal('navigator', { vibrate });
    vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });

    triggerHaptic([50, 40, 20, 30, 10]);
    expect(vibrate).not.toHaveBeenCalled();
  });

  it('ist ein No-Op, wenn navigator.vibrate fehlt', () => {
    vi.stubGlobal('navigator', {});
    vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
    expect(() => triggerHaptic([1])).not.toThrow();
  });
});

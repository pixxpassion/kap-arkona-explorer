import { describe, it, expect } from 'vitest';
import { acquireVoice, releaseVoice, isVoiceBusy } from './voicePlayback';

// Die Tests räumen jeweils selbst auf (releaseVoice am Ende), da der
// Modul-Zustand über die Datei hinweg bestehen bleibt.
describe('voicePlayback', () => {
  it('lässt den ersten Sprecher die Stimme belegen', () => {
    const a = Symbol('a');
    expect(acquireVoice(a)).toBe(true);
    expect(isVoiceBusy()).toBe(true);
    releaseVoice(a);
    expect(isVoiceBusy()).toBe(false);
  });

  it('weist einen zweiten Sprecher ab, solange belegt', () => {
    const a = Symbol('a');
    const b = Symbol('b');
    expect(acquireVoice(a)).toBe(true);
    expect(acquireVoice(b)).toBe(false);
    releaseVoice(a);
    expect(acquireVoice(b)).toBe(true);
    releaseVoice(b);
  });

  it('ignoriert das release eines fremden Tokens', () => {
    const a = Symbol('a');
    const b = Symbol('b');
    acquireVoice(a);
    releaseVoice(b); // darf a nicht freigeben
    expect(isVoiceBusy()).toBe(true);
    releaseVoice(a);
  });

  it('erlaubt demselben Token wiederholtes acquire (StrictMode-Doppelmount)', () => {
    const a = Symbol('a');
    expect(acquireVoice(a)).toBe(true);
    expect(acquireVoice(a)).toBe(true);
    releaseVoice(a);
  });
});

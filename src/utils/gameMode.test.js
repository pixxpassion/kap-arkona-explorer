import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GAME_MODES, getInitialGameMode, getGameMode, setGameMode } from './gameMode';

function stubEnv(search = '') {
  const store = {};
  vi.stubGlobal('localStorage', {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  });
  vi.stubGlobal('window', { location: { search } });
}

afterEach(() => vi.unstubAllGlobals());

describe('gameMode', () => {
  beforeEach(() => stubEnv());

  it('Standard ist die Rätsel-Expedition', () => {
    expect(getInitialGameMode()).toBe(GAME_MODES.HISTORIAN);
    expect(getGameMode()).toBe(GAME_MODES.HISTORIAN);
  });

  it('setGameMode speichert eine gültige Wahl', () => {
    setGameMode(GAME_MODES.LIGHT);
    expect(getGameMode()).toBe(GAME_MODES.LIGHT);
    expect(getInitialGameMode()).toBe(GAME_MODES.LIGHT);
  });

  it('setGameMode ignoriert ungültige Werte', () => {
    setGameMode(GAME_MODES.LIGHT);
    setGameMode('quatsch');
    expect(getGameMode()).toBe(GAME_MODES.LIGHT);
  });

  it('?mode=historian gewinnt vor der gemerkten Wahl', () => {
    stubEnv('?mode=historian');
    setGameMode(GAME_MODES.LIGHT);
    expect(getInitialGameMode()).toBe(GAME_MODES.HISTORIAN);
    // getGameMode ignoriert den Query-Parameter
    expect(getGameMode()).toBe(GAME_MODES.LIGHT);
  });

  it('ein unbekannter Query-Wert fällt auf die gemerkte Wahl zurück', () => {
    stubEnv('?mode=raetselraten');
    setGameMode(GAME_MODES.LIGHT);
    expect(getInitialGameMode()).toBe(GAME_MODES.LIGHT);
  });

  it('läuft ohne window/localStorage (node-Env) fehlerfrei', () => {
    vi.unstubAllGlobals();
    expect(() => getInitialGameMode()).not.toThrow();
    expect(getInitialGameMode()).toBe(GAME_MODES.HISTORIAN);
    expect(() => setGameMode(GAME_MODES.LIGHT)).not.toThrow();
  });
});

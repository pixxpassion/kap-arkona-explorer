// Datenstruktur-Tests für die statischen Spieldaten. Kein DOM/React nötig -
// reine Konsistenzprüfung, damit ein Tippfehler in stations.js /
// logbookEntries.js früh auffällt (falsche Station freigeschaltet, fehlende
// Audiodatei, Koordinate außerhalb des Kaps, leere Rätselantwort ...).

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

import { stations, goodieMilestones } from './stations';
import { logbookEntries } from './logbookEntries';

const PUBLIC_DIR = join(import.meta.dirname, '..', '..', 'public');

// Großzügige Bounding-Box um Kap Arkona / Vitt / Putgarten.
const LAT = { min: 54.66, max: 54.69 };
const LON = { min: 13.4, max: 13.45 };

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

// Landmark-IDs, für die LandmarkSketch.jsx eine Skizze kennt - ein Tippfehler
// in logbookEntries[].id würde das Bild sonst still verschwinden lassen.
const KNOWN_SKETCH_IDS = ['schinkelturm', 'peilturm', 'vitt', 'jaromarsburg', 'bunker', 'leuchtturm'];

describe('stations.js', () => {
  it('enthält genau 15 Stationen', () => {
    expect(Array.isArray(stations)).toBe(true);
    expect(stations).toHaveLength(15);
  });

  it('hat lückenlose, eindeutige IDs 1..15 in Reihenfolge', () => {
    expect(stations.map((s) => s.id)).toEqual([...Array(15)].map((_, i) => i + 1));
  });

  it.each(stations.map((s) => [s.id, s]))('Station %i: Texte sind gefüllt', (_id, station) => {
    expect(isNonEmptyString(station.title)).toBe(true);
    expect(isNonEmptyString(station.description)).toBe(true);
    expect(isNonEmptyString(station.schillingText)).toBe(true);
  });

  it.each(stations.map((s) => [s.id, s]))('Station %i: Koordinaten liegen am Kap', (_id, station) => {
    expect(station.target.latitude).toBeGreaterThanOrEqual(LAT.min);
    expect(station.target.latitude).toBeLessThanOrEqual(LAT.max);
    expect(station.target.longitude).toBeGreaterThanOrEqual(LON.min);
    expect(station.target.longitude).toBeLessThanOrEqual(LON.max);
  });

  it.each(stations.map((s) => [s.id, s]))('Station %i: Radius ist positiv', (_id, station) => {
    expect(typeof station.radius).toBe('number');
    expect(station.radius).toBeGreaterThan(0);
  });

  it.each(stations.map((s) => [s.id, s]))('Station %i: Rätsel ist vollständig', (_id, station) => {
    expect(isNonEmptyString(station.riddle.question)).toBe(true);
    expect(isNonEmptyString(station.riddle.successMessage)).toBe(true);
    // Antwort darf Zahl oder String sein, muss aber getrimmt Inhalt haben.
    expect(String(station.riddle.answer).trim().length).toBeGreaterThan(0);
    expect(String(station.riddle.answer)).toBe(String(station.riddle.answer).trim());
  });

  it.each(stations.map((s) => [s.id, s]))('Station %i: Audiodatei existiert', (_id, station) => {
    expect(station.schillingAudio).toMatch(/^audio\/schilling-station-\d{2}\.mp3$/);
    expect(existsSync(join(PUBLIC_DIR, station.schillingAudio))).toBe(true);
  });
});

describe('goodieMilestones', () => {
  const keys = Object.keys(goodieMilestones).map(Number).sort((a, b) => a - b);

  it('greift bei Etappe 5, 10 und 15', () => {
    expect(keys).toEqual([5, 10, 15]);
  });

  it('verweist nur auf existierende Stationen', () => {
    for (const k of keys) expect(k).toBeLessThanOrEqual(stations.length);
  });

  it('hat für jede Etappe einen Text', () => {
    for (const k of keys) expect(isNonEmptyString(goodieMilestones[k])).toBe(true);
  });
});

describe('logbookEntries.js', () => {
  it('enthält genau 6 Einträge mit eindeutigen IDs', () => {
    expect(logbookEntries).toHaveLength(6);
    const ids = logbookEntries.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('nutzt nur IDs, für die LandmarkSketch eine Skizze kennt', () => {
    expect([...logbookEntries.map((e) => e.id)].sort()).toEqual([...KNOWN_SKETCH_IDS].sort());
  });

  it.each(logbookEntries.map((e) => [e.id, e]))('Eintrag "%s": Texte sind gefüllt', (_id, entry) => {
    expect(isNonEmptyString(entry.name)).toBe(true);
    expect(isNonEmptyString(entry.journal)).toBe(true);
  });

  it.each(logbookEntries.map((e) => [e.id, e]))('Eintrag "%s": Audiodatei existiert', (_id, entry) => {
    expect(entry.schillingAudio).toMatch(/^audio\/schilling-logbook-[a-z]+\.mp3$/);
    expect(existsSync(join(PUBLIC_DIR, entry.schillingAudio))).toBe(true);
  });

  it.each(logbookEntries.map((e) => [e.id, e]))(
    'Eintrag "%s": unlockAtCompleted zeigt auf eine echte Station',
    (_id, entry) => {
      expect(Number.isInteger(entry.unlockAtCompleted)).toBe(true);
      expect(entry.unlockAtCompleted).toBeGreaterThanOrEqual(1);
      expect(entry.unlockAtCompleted).toBeLessThanOrEqual(stations.length);
      expect(stations.some((s) => s.id === entry.unlockAtCompleted)).toBe(true);
    },
  );
});

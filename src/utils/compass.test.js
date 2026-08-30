import { describe, it, expect } from 'vitest';
import {
  METER_PER_RUTE,
  metersToRuten,
  formatRuten,
  calculateBearing,
  calculateDistance,
  bearingToCompassLabel,
} from './compass';

describe('compass.js - preußische Rute', () => {
  it('rechnet Meter in Ruten um', () => {
    expect(metersToRuten(METER_PER_RUTE)).toBeCloseTo(1, 6);
    expect(metersToRuten(0)).toBe(0);
    expect(metersToRuten(37.662)).toBeCloseTo(10, 3);
  });

  it('formatiert je nach Größenordnung', () => {
    expect(formatRuten(1)).toBe('keine volle Rute');
    expect(formatRuten(METER_PER_RUTE * 5)).toBe('5.0 Ruten');
    expect(formatRuten(METER_PER_RUTE * 42)).toBe('42 Ruten');
    expect(formatRuten(-5)).toBe('');
    expect(formatRuten(NaN)).toBe('');
  });
});

describe('compass.js - Re-Exporte aus geoUtils', () => {
  it('reicht Peilung, Distanz und Label unverändert durch', () => {
    expect(typeof calculateBearing).toBe('function');
    expect(typeof calculateDistance).toBe('function');
    // Ost von einem Punkt aus -> ~90°
    const b = calculateBearing(54.68, 13.43, 54.68, 13.45);
    expect(b).toBeGreaterThan(80);
    expect(b).toBeLessThan(100);
    expect(bearingToCompassLabel(b)).toBe('O');
  });
});

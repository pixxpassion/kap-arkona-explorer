// src/data/stamps.js
//
// Logbuch-Stempel im Stil einer kaiserlichen Poststation um 1875: ein
// Stempel pro erreichter Station sowie drei Meilenstein-Stempel bei 5, 10
// und 15 Stationen. Werden von <StampStamp> gerendert und in
// ExplorerLogbook auf die Sammelkarten bzw. über das Logbuch gedrückt.

export const STAMP_TYPES = {
  STATION_COMPLETED: {
    id: 'station_completed',
    title: 'STATION ERREICHT',
    subtitle: 'KAP ARKONA 1875',
    color: 'var(--color-wax-red, #a13d2d)',
    icon: 'anchor',
  },
  MEILE_5: {
    id: 'meile_5',
    title: '5 STATIONEN',
    subtitle: 'ERSTER MEILENSTEIN',
    color: 'var(--color-wax-red, #a13d2d)',
    icon: 'compass',
  },
  MEILE_10: {
    id: 'meile_10',
    title: '10 STATIONEN',
    subtitle: 'KAP ARKONA ERKUNDET',
    // dunkles Messing statt hellem Gold: helles Gold verschwindet bei
    // aging-level 2 fast auf dem vergilbten Pergament - so gut lesbar wie
    // die anderen Meilenstein-Stempel (Wachsrot / Tinte).
    color: 'var(--color-brass-dark, #8a6b33)',
    icon: 'lighthouse',
  },
  MEILE_15: {
    id: 'meile_15',
    title: 'EXPEDITION VOLLENDET',
    subtitle: 'KAISERLICHE POST',
    color: 'var(--color-ink, #212c3d)',
    icon: 'crown',
  },
};

// Reihenfolge der Meilenstein-Stempel für die Anzeige im Logbuch.
export const MILESTONE_STAMPS = [
  { atCompleted: 5, type: STAMP_TYPES.MEILE_5 },
  { atCompleted: 10, type: STAMP_TYPES.MEILE_10 },
  { atCompleted: 15, type: STAMP_TYPES.MEILE_15 },
];

/**
 * Deterministischer, aber "zufällig" wirkender Stempelwinkel im Bereich
 * -6° … +6°. Gleicher Seed → gleicher Winkel (kein Springen bei Re-Renders).
 */
export function getStampRotation(seed) {
  const str = String(seed);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (str.charCodeAt(i) + ((hash << 5) - hash)) | 0;
  }
  // 0 … 12  ->  -6 … +6
  return (Math.abs(hash) % 13) - 6;
}

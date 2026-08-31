// src/components/icons/UiIcons.jsx
//
// Schlichte Strich-Icons für die Marken-Hülle (Header, Desktop-Sperre) -
// bewusst getrennt von AntiqueIcons.jsx, das nur die 1875er-Spielerzählung
// bedient. Ersetzen die früheren lucide-react-Icons (Info, Smartphone),
// damit die komplette Bibliothek nicht mehr als Abhängigkeit nötig ist.

const strokeBase = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

// Info-"i" im Kreis - ersetzt lucide "Info". Aktuell ungenutzt (der Header
// zeigt statt des "i" ein Modus-Badge), bleibt als Marken-Hüllen-Icon vor.
export function InfoIcon({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...rest}>
      <g {...strokeBase}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </g>
    </svg>
  );
}

// Smartphone-Umriss - ersetzt lucide "Smartphone" (Desktop-Sperre)
export function SmartphoneIcon({ size = 24, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...rest}>
      <g {...strokeBase}>
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </g>
    </svg>
  );
}

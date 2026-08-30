// src/components/logbook/StampIcons.jsx
//
// Vier Strich-Symbole für die Logbuch-Stempel (Anker, Kompass, Leuchtturm,
// Krone). Gleicher Stil wie AntiqueIcons.jsx: nur Kontur (currentColor),
// runde Kappen, keine Füllflächen - passt zum eingravierten Poststempel.

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Frame({ size = 22, strokeWidth = 1.7, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g {...stroke} strokeWidth={strokeWidth}>
        {children}
      </g>
    </svg>
  );
}

function Anchor(props) {
  return (
    <Frame {...props}>
      <circle cx="12" cy="5" r="2.2" />
      <path d="M12 7.2 V20" />
      <path d="M6.5 12 H17.5" />
      <path d="M4.5 13.4 C4.9 17.4 8.2 20 12 20 C15.8 20 19.1 17.4 19.5 13.4" />
      <path d="M4.5 13.4 L6.7 12.6 M19.5 13.4 L17.3 12.6" />
    </Frame>
  );
}

function Compass(props) {
  return (
    <Frame {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.3 V5 M12 19 V20.7 M3.3 12 H5 M19 12 H20.7" />
      <path d="M15 9 L11 11 L9 15 L13 13 Z" strokeWidth="1.4" />
    </Frame>
  );
}

function Lighthouse(props) {
  return (
    <Frame {...props}>
      <path d="M9 20 L10 9 H14 L15 20 Z" />
      <path d="M9.4 13.5 H14.6 M9.7 16.8 H14.3" />
      <path d="M9.6 9 H14.4 M10 6.4 H14 L14 9 H10 Z" />
      <path d="M12 6.4 V4.2" />
      <path d="M8 6 L4.6 4.4 M16 6 L19.4 4.4 M8 7.6 L4.6 8.8 M16 7.6 L19.4 8.8" opacity="0.6" />
      <path d="M6.5 20 H17.5" />
    </Frame>
  );
}

function Crown(props) {
  return (
    <Frame {...props}>
      <path d="M4.5 8.5 L7.5 15 H16.5 L19.5 8.5 L15 12 L12 6.5 L9 12 Z" />
      <path d="M7.5 17.6 H16.5" />
      <circle cx="4.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="19.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="5.6" r="1" fill="currentColor" stroke="none" />
    </Frame>
  );
}

const STAMP_ICONS = {
  anchor: Anchor,
  compass: Compass,
  lighthouse: Lighthouse,
  crown: Crown,
};

export default function StampIcon({ name, ...props }) {
  const Icon = STAMP_ICONS[name];
  return Icon ? <Icon {...props} /> : null;
}

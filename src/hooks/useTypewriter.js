import { useEffect, useRef, useState } from 'react';

/**
 * Gibt "text" zeichenweise aus, wie auf einer Schreibmaschine getippt.
 * Ruft optional "onType" bei jedem neuen (nicht-Leerzeichen-)Zeichen auf,
 * z.B. für einen Klick-Sound, und "onComplete", sobald der komplette Text
 * steht.
 *
 * Wichtig: Dieser Hook setzt sich NICHT selbst zurück, wenn sich "text" bei
 * gleichbleibender Komponenten-Instanz ändert (das würde synchrones
 * setState im Effekt-Body erfordern, was die Lint-Regeln dieses Projekts
 * unterbinden). Für eine neue Dialogzeile die Komponente stattdessen mit
 * einem neuen "key" (z.B. der Stations-ID) neu mounten lassen - siehe
 * SchillingDialogue.
 *
 * Rückgabe: { displayed, isTyping, skip } — "skip" zeigt sofort den
 * vollständigen Text an (z.B. per Klick auf den Dialog).
 */
export function useTypewriter(text, { speed = 32, onType, onComplete } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(() => Boolean(text));
  const indexRef = useRef(0);

  // Immer aktuelle Callback-Referenzen, ohne den Interval-Effekt bei jedem
  // Render neu aufzusetzen. Ref-Schreibzugriffe gehören in einen Effekt,
  // nicht in den Render-Body selbst.
  const onTypeRef = useRef(onType);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onTypeRef.current = onType;
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!text) return undefined;
    indexRef.current = 0;

    const id = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));

      const lastChar = text[indexRef.current - 1];
      if (lastChar && lastChar.trim() !== '') onTypeRef.current?.(lastChar);

      if (indexRef.current >= text.length) {
        clearInterval(id);
        setIsTyping(false);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  const skip = () => {
    if (!isTyping) return;
    indexRef.current = text.length;
    setDisplayed(text);
    setIsTyping(false);
    onCompleteRef.current?.();
  };

  return { displayed, isTyping, skip };
}

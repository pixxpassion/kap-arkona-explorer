// src/components/Modal.jsx
//
// Nutzt das native <dialog> mit showModal(): Der Browser übernimmt
// Fokus-Steuerung (Fokus wandert beim Öffnen in den Dialog und bleibt dort
// gefangen, beim Schließen kehrt er zum auslösenden Element zurück),
// Escape-Handling und das Inert-Schalten des Hintergrunds. <dialog>:modal
// bringt implizit role="dialog" und aria-modal="true" mit; die Überschrift
// wird per aria-labelledby als Titel verknüpft.
//
// Das native close-Event (onClose) ist die einzige Schließ-Quelle:
// X-Button und Backdrop-Klick rufen dialog.close(), Escape löst es direkt
// aus - alle drei landen im selben onClose-Handler der Elternkomponente.

import { useEffect, useId, useRef } from 'react';
import { InkCross } from './icons/AntiqueIcons';

export default function Modal({ title, onClose, children, closeLabel = 'Schließen', bodyBg }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  const closeDialog = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className="modal-box"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        // Nur ein Klick auf den Backdrop (Ziel ist das <dialog> selbst,
        // nicht ein Kind-Element) schließt.
        if (e.target === e.currentTarget) closeDialog();
      }}
    >
      <div className="modal-header">
        <h2 id={titleId}>{title}</h2>
        <button className="modal-close" onClick={closeDialog} aria-label={closeLabel}>
          <InkCross size={20} />
        </button>
      </div>
      <div className="modal-body">
        {bodyBg && <img src={bodyBg} alt="" className="modal-body-bg" aria-hidden="true" />}
        {children}
      </div>
    </dialog>
  );
}

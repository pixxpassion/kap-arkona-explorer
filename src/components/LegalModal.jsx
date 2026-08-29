// src/components/LegalModal.jsx
import Modal from './Modal';

export default function LegalModal({ onClose }) {
  return (
    <Modal title="Impressum & Datenschutz" onClose={onClose}>
      <h3>Impressum</h3>
      <p>Angaben gemäß § 5 TMG:</p>
      <p>
        Tourismusgesellschaft mbH Kap Arkona<br />
        Am Parkplatz 1<br />
        18556 Putgarten / Rügen
      </p>
      <p>
        Handelsregister: HRB 3196<br />
        Registergericht: Amtsgericht Stralsund
      </p>
      <p>
        <strong>Vertreten durch:</strong><br />
        Geschäftsführer: Andreas Heinemann
      </p>
      <p>
        <strong>Kontakt:</strong><br />
        Telefon: 03 83 91 – 13 0 37<br />
        Telefax: 03 83 91 – 13 0 38<br />
        E-Mail: info@kap-arkona.de
      </p>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
        DE183129121
      </p>
      <p>
        <strong>Redaktionell verantwortlich:</strong><br />
        Andreas Heinemann, Tourismusgesellschaft mbH Kap Arkona, Am Parkplatz 1, 18556
        Putgarten / Rügen
      </p>
      <p>
        <strong>Verbraucherstreitbeilegung/Universalschlichtungsstelle:</strong><br />
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h3>Datenschutzerklärung</h3>
      <p><strong>Hinweis zur verantwortlichen Stelle</strong></p>
      <p>
        Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br />
        Tourismusgesellschaft mbH Kap Arkona<br />
        Geschäftsführer: Andreas Heinemann<br />
        Am Parkplatz 1<br />
        18556 Putgarten / Rügen<br />
        Telefon: 03 83 91 – 13 0 37<br />
        E-Mail: info@kap-arkona.de
      </p>
      <p>
        Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder
        gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von
        personenbezogenen Daten entscheidet.
      </p>

      <p><strong>Externes Hosting</strong></p>
      <p>
        Diese Anwendung wird extern gehostet. Personenbezogene Daten, die auf dieser
        Website erfasst werden, werden auf den Servern des Hosters gespeichert. Das
        externe Hosting erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren
        potenziellen und bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse
        einer sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots
        durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
      </p>
      <p>Wir setzen folgenden Hoster ein:</p>
      <p>
        medienmodernisierer.de<br />
        August-Horch-Straße 9<br />
        41812 Erkelenz<br />
        <a href="https://medienmodernisierer.de" target="_blank" rel="noopener noreferrer">
          https://medienmodernisierer.de
        </a>
      </p>
      <p>
        Wir haben einen Vertrag über Auftragsverarbeitung (AVV) zur Nutzung des oben
        genannten Dienstes geschlossen. Hierbei handelt es sich um einen
        datenschutzrechtlich vorgeschriebenen Vertrag, der gewährleistet, dass dieser die
        personenbezogenen Daten unserer Websitebesucher nur nach unseren Weisungen und
        unter Einhaltung der DSGVO verarbeitet.
      </p>

      <p><strong>Standortdaten (GPS)</strong></p>
      <p>
        Dein Standort wird ausschließlich lokal auf deinem Gerät im Browser verarbeitet,
        um deine Entfernung zur jeweiligen Station zu berechnen. Er wird nicht an uns
        oder Dritte übertragen und nicht gespeichert.
      </p>
      <p><strong>Kamera (Foto-Nachweis)</strong></p>
      <p>
        Falls sich dein Standort nicht per GPS aktualisieren lässt, kannst du
        stattdessen ein Foto als Vor-Ort-Nachweis aufnehmen. Dieses Foto wird
        ausschließlich lokal auf deinem Gerät verarbeitet, nur kurz zur Bestätigung
        angezeigt und nicht gespeichert oder übertragen.
      </p>
      <p><strong>Spielfortschritt</strong></p>
      <p>
        Dein Fortschritt (u. a. aktuelle Station, eingelöste Goodies) wird ausschließlich
        lokal in deinem Browser gespeichert (localStorage) und nicht an uns übertragen.
        Diese App verwendet keine Cookies. Du kannst die gespeicherten Daten jederzeit
        über die Funktion „Tour neu starten" bzw. die Browsereinstellungen löschen.
      </p>
      <p><strong>Server-Log-Dateien</strong></p>
      <p>
        Der Provider der Seiten erhebt und speichert automatisch Informationen in
        sogenannten Server-Log-Dateien, die dein Browser automatisch übermittelt.
        Das sind: Browsertyp und -version, verwendetes Betriebssystem, Referrer-URL,
        Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse. Eine
        Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die
        Erfassung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
        Interesse an der technisch fehlerfreien Darstellung und Optimierung der Website).
      </p>
      <p><strong>SSL- bzw. TLS-Verschlüsselung</strong></p>
      <p>
        Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung
        vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte
        Verbindung erkennst du daran, dass die Adresszeile des Browsers von „http://" auf
        „https://" wechselt und an dem Schloss-Symbol in der Browserzeile.
      </p>

      <p><strong>Deine Rechte</strong></p>
      <p>
        Du hast im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf
        unentgeltliche Auskunft über deine gespeicherten personenbezogenen Daten, deren
        Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf
        Berichtigung oder Löschung dieser Daten (Art. 15–17 DSGVO). Außerdem hast du das
        Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung deiner
        personenbezogenen Daten zu verlangen (Art. 18 DSGVO) sowie ein Widerspruchsrecht
        gegen die Verarbeitung (Art. 21 DSGVO) und ein Recht auf
        Datenübertragbarkeit (Art. 20 DSGVO). Des Weiteren steht dir ein Beschwerderecht
        bei der zuständigen Aufsichtsbehörde zu.
      </p>
      <p>Wende dich dazu an die oben genannte Kontaktadresse.</p>

      <h3>Hinweis zum Spielcharakter</h3>
      <div className="modal-disclaimer">
        Kap Arkona Entdecker ist ein kostenloses Unterhaltungsangebot. Aus der Teilnahme,
        dem Erreichen von Etappen, Rätseln oder sogenannten „Goodies" entsteht kein
        Rechtsanspruch auf Sachleistungen, Prämien oder sonstige Vergünstigungen. Die
        Ausgabe von Goodies erfolgt nach Verfügbarkeit und im Ermessen der ausgebenden
        Stellen vor Ort.
      </div>
    </Modal>
  );
}

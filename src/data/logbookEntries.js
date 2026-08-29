// src/data/logbookEntries.js
//
// Inhalte für das "Entdecker-Logbuch" (ExplorerLogbook). Sechs echte
// Wahrzeichen rund um Kap Arkona, mit historisch recherchierten Fakten
// und einem kurzen Tagebucheintrag aus Sicht von Leuchtturmwärter
// Schilling.
//
// "unlockAtCompleted" verweist auf den Stations-Fortschritt aus
// GameContainer (localStorage-Key "kapArkonaProgress", derselbe Wert wie
// "completedCount" dort): sobald so viele Stationen des Hauptrundwegs
// gemeistert wurden, gilt der Logbuch-Eintrag als gefunden. Die Werte
// entsprechen exakt der "id" der jeweils passenden Station in
// stations.js (z.B. jaromarsburg = Station 3 "Die Jaromarsburg") - bei
// Änderungen an der Stationsreihenfolge in stations.js müssen diese
// Werte hier mitgepflegt werden, sonst schaltet sich beim Lösen einer
// Station der falsche Logbuch-Eintrag frei.
export const logbookEntries = [
  {
    id: 'schinkelturm',
    name: 'Der Schinkelturm',
    unlockAtCompleted: 1,
    schillingAudio: 'audio/schilling-logbook-schinkelturm.mp3',
    journal:
      'Fünfter Mai, im Jahre 1826, ward der Grundstein gelegt - ein Jahr später, am zehnten Dezember, brannte hier zum ersten Mal das Feuer. Backstein für Backstein hat er jeden Sturm überstanden, den die Ostsee uns schickte. Nach dem Turm von Travemünde ist er der zweitälteste seiner Art an unserer ganzen Küste.'
  },
  {
    id: 'peilturm',
    name: 'Der Peilturm',
    unlockAtCompleted: 2,
    schillingAudio: 'audio/schilling-logbook-peilturm.mp3',
    journal:
      'Einhundertelf Stufen führen unter der gläsernen Kuppel hinauf - ich habe sie oft genug gezählt, wenn der Nebel über Arkona hing und ich mir die Beine vertreten musste. Erbaut im Jahre 1927, diente er lange der Peilung der Schiffe. Heute feilschen dort Krämer mit Alpakawolle, aber die Aussicht ist geblieben.'
  },
  {
    id: 'vitt',
    name: 'Fischerdorf Vitt',
    unlockAtCompleted: 10,
    schillingAudio: 'audio/schilling-logbook-vitt.mp3',
    journal:
      'Am fünfundzwanzigsten Mai, anno 1290, gewährte Fürst Witzlaw dem kleinen Hafen das Fischereirecht - seither ziehen die Boote hinaus und die roten Wimpel an den Reusen flattern im Wind. Reetgedeckte Katen ducken sich in die Schlucht, als wollten sie sich vor der See selbst verstecken.'
  },
  {
    id: 'jaromarsburg',
    name: 'Die Jaromarsburg',
    unlockAtCompleted: 3,
    schillingAudio: 'audio/schilling-logbook-jaromarsburg.mp3',
    journal:
      'Vor rund vierzehnhundert Jahren stand hier das Heiligtum der Ranen - dem vierköpfigen Kriegsgott Svantevit geweiht, so erzählt man sich. Von der mächtigen Wallburg sind nur noch Erdwälle geblieben, aber wer genau hinsieht, spürt: die alten Götter sind von hier nie ganz verschwunden.'
  },
  {
    id: 'bunker',
    name: 'Marineführungsbunker',
    unlockAtCompleted: 4,
    schillingAudio: 'audio/schilling-logbook-bunker.mp3',
    journal:
      'Zweitausend Quadratmeter, tief unter der Erde gegraben - bis 1990 saß hier die Volksmarine der DDR und wachte über die Ostsee, verborgen vor jedem Blick von oben. Heute stehen Schiffsmodelle und Navigationsgeräte in den Gängen, wo einst nur Befehle im Flüsterton erklangen.'
  },
  {
    id: 'leuchtturm',
    name: 'Das Leuchtfeuer Arkona',
    unlockAtCompleted: 6,
    schillingAudio: 'audio/schilling-logbook-leuchtturm.mp3',
    journal:
      'Einhundertvierundsechzig Stufen, und dann liegt einem ganz Wittow zu Füßen, an klaren Tagen bis nach Hiddensee. Seit 1902 blitzt mein Feuer alle siebzehn Sekunden dreimal - zweiundzwanzig Seemeilen weit trägt es hinaus in die Nacht. Wer hier oben stand, hat das ganze Kap in der Hand gehalten.'
  }
];

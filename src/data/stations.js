// src/data/stations.js

// Bei diesen erreichten Stationen wird ein Goodie freigeschaltet.
// Einlösbar nach Tourende in der Tourist-Info am Großparkplatz
// oder in der Tourist-Info & Shop bei den Türmen.
export const goodieMilestones = {
  5: "Du hast 5 Stationen gemeistert! Dein erstes Goodie wartet auf dich - einlösbar am Ende deiner Tour in der Tourist-Info am Großparkplatz oder in der Tourist-Info & Shop bei den Türmen.",
  10: "10 Stationen geschafft! Ein weiteres Goodie ist freigeschaltet - hol es dir am Ende deiner Tour ab.",
  15: "Alle 15 Stationen gemeistert! Dein drittes Goodie wartet - genau wie deine Explorer Wandernadel."
};

export const stations = [
  {
    id: 1,
    title: "Start: Der magische Schinkelturm ",
    description: "Begib dich zum ältesten Leuchtturm am Kap Arkona. Er ist quadratisch und aus Backstein gebaut.",
    schillingText: "Moin, Fremder! Ich bin Schilling, Leuchtturmwärter hier oben. Seit Jahren wache ich über die Steilküste - der alte Backsteinturm hat schon so manchen Sturm überstanden, genau wie ich.",
    target: {
      latitude: 54.679722,
      longitude: 13.431389
    },
    radius: 20, // Radius in Metern, ab wann die Station via GPS freigeschaltet wird
    qrFallback: "arkona-poi-1", // Der Code aus dem echten QR-Code vor Ort
    riddle: {
      question: "Über dem Eingang befindet sich eine Jahreszahl. Welche ist es?",
      answer: "1827", // Groß-/Kleinschreibung und Leerzeichen werden automatisch ignoriert
      successMessage: "Klasse! Du hast das erste Rätsel geknackt."
    }
  },
  {
    id: 2,
    title: "Der Peilturm",
    description: "Gehe nun weiter in Richtung Osten zum runden Peilturm...",
    schillingText: "Der Peilturm hat mir schon oft den Weg gewiesen, wenn der Nebel über Arkona hing. Zähl seine Stufen gut, mein Freund - da oben zählt jede einzelne.",
    target: {
      latitude: 54.679200,
      longitude: 13.434500
    },
    radius: 20,
    qrFallback: "arkona-poi-2",
    riddle: {
      question: "Wie viele Stufen führen zur Aussichtsplattform hinauf?",
      answer: "111",
      successMessage: "Perfekt! Weiter geht's zur Steilküste."
    }
  },
  {
    id: 3,
    title: "Station 3: [Name der Station]",
    description: "[Hier eine kurze Wegbeschreibung oder Erklärung für die Touristen eintragen]",
    schillingText: "[Schillings Spruch für Station 3 hier eintragen]",
    target: {
      latitude: 54.679000, // Hier die echten GPS-Breitengrade eintragen
      longitude: 13.435000 // Hier die echten GPS-Längengrade eintragen
    },
    radius: 20,
    qrFallback: "arkona-poi-3",
    riddle: {
      question: "[Deine Rätselfrage für Station 3]",
      answer: "Lösung3",
      successMessage: "Super gelöst! Auf zur nächsten Station."
    }
  },
  {
    id: 4,
    title: "Station 4: [Name der Station]",
    description: "[Wegbeschreibung für Station 4]",
    schillingText: "[Schillings Spruch für Station 4 hier eintragen]",
    target: { latitude: 54.679100, longitude: 13.436000 },
    radius: 20,
    qrFallback: "arkona-poi-4",
    riddle: {
      question: "[Deine Rätselfrage für Station 4]",
      answer: "Lösung4",
      successMessage: "Sehr gut! Du kommst dem Ziel näher."
    }
  },
  {
    id: 5,
    title: "Station 5: [Name der Station]",
    description: "[Wegbeschreibung für Station 5]",
    schillingText: "[Schillings Spruch für Station 5 hier eintragen]",
    target: { latitude: 54.679200, longitude: 13.437000 },
    radius: 20,
    qrFallback: "arkona-poi-5",
    riddle: {
      question: "[Deine Rätselfrage für Station 5]",
      answer: "Lösung5",
      successMessage: "Erstes Goodie erreicht! Fantastisch gemacht."
    }
  },
  {
    id: 6,
    title: "Station 6: [Name der Station]",
    description: "[Wegbeschreibung für Station 6]",
    schillingText: "[Schillings Spruch für Station 6 hier eintragen]",
    target: { latitude: 54.679300, longitude: 13.438000 },
    radius: 20,
    qrFallback: "arkona-poi-6",
    riddle: {
      question: "[Deine Rätselfrage für Station 6]",
      answer: "Lösung6",
      successMessage: "Ganz genau. Weiter geht's!"
    }
  },
  {
    id: 7,
    title: "Station 7: [Name der Station]",
    description: "[Wegbeschreibung für Station 7]",
    schillingText: "[Schillings Spruch für Station 7 hier eintragen]",
    target: { latitude: 54.679400, longitude: 13.439000 },
    radius: 20,
    qrFallback: "arkona-poi-7",
    riddle: {
      question: "[Deine Rätselfrage für Station 7]",
      answer: "Lösung7",
      successMessage: "Hervorragend kombiniert!"
    }
  },
  {
    id: 8,
    title: "Station 8: [Name der Station]",
    description: "[Wegbeschreibung für Station 8]",
    schillingText: "[Schillings Spruch für Station 8 hier eintragen]",
    target: { latitude: 54.679500, longitude: 13.440000 },
    radius: 20,
    qrFallback: "arkona-poi-8",
    riddle: {
      question: "[Deine Rätselfrage für Station 8]",
      answer: "Lösung8",
      successMessage: "Das war schwer, aber du hast es geschafft!"
    }
  },
  {
    id: 9,
    title: "Station 9: [Name der Station]",
    description: "[Wegbeschreibung für Station 9]",
    schillingText: "[Schillings Spruch für Station 9 hier eintragen]",
    target: { latitude: 54.679600, longitude: 13.441000 },
    radius: 20,
    qrFallback: "arkona-poi-9",
    riddle: {
      question: "[Deine Rätselfrage für Station 9]",
      answer: "Lösung9",
      successMessage: "Genial! Nur noch eine Station bis zum zweiten Goodie."
    }
  },
  {
    id: 10,
    title: "Station 10: [Name der Station]",
    description: "[Wegbeschreibung für Station 10]",
    schillingText: "[Schillings Spruch für Station 10 hier eintragen]",
    target: { latitude: 54.679700, longitude: 13.442000 },
    radius: 20,
    qrFallback: "arkona-poi-10",
    riddle: {
      question: "[Deine Rätselfrage für Station 10]",
      answer: "Lösung10",
      successMessage: "Zweites Goodie erreicht! Weiter geht die Tour."
    }
  },
  {
    id: 11,
    title: "Station 11: [Name der Station]",
    description: "[Wegbeschreibung für Station 11]",
    schillingText: "[Schillings Spruch für Station 11 hier eintragen]",
    target: { latitude: 54.679800, longitude: 13.443000 },
    radius: 20,
    qrFallback: "arkona-poi-11",
    riddle: {
      question: "[Deine Rätselfrage für Station 11]",
      answer: "Lösung11",
      successMessage: "Weiter so, Entdecker!"
    }
  },
  {
    id: 12,
    title: "Station 12: [Name der Station]",
    description: "[Wegbeschreibung für Station 12]",
    schillingText: "[Schillings Spruch für Station 12 hier eintragen]",
    target: { latitude: 54.679900, longitude: 13.444000 },
    radius: 20,
    qrFallback: "arkona-poi-12",
    riddle: {
      question: "[Deine Rätselfrage für Station 12]",
      answer: "Lösung12",
      successMessage: "Klasse gelöst!"
    }
  },
  {
    id: 13,
    title: "Station 13: [Name der Station]",
    description: "[Wegbeschreibung für Station 13]",
    schillingText: "[Schillings Spruch für Station 13 hier eintragen]",
    target: { latitude: 54.680000, longitude: 13.445000 },
    radius: 20,
    qrFallback: "arkona-poi-13",
    riddle: {
      question: "[Deine Rätselfrage für Station 13]",
      answer: "Lösung13",
      successMessage: "Fast geschafft!"
    }
  },
  {
    id: 14,
    title: "Station 14: [Name der Station]",
    description: "[Wegbeschreibung für Station 14 - Endspurt!]",
    schillingText: "[Schillings Spruch für Station 14 hier eintragen]",
    target: { latitude: 54.680100, longitude: 13.446000 },
    radius: 20,
    qrFallback: "arkona-poi-14",
    riddle: {
      question: "[Deine Rätselfrage für Station 14]",
      answer: "Lösung14",
      successMessage: "Genial! Nur noch eine Station bis zum großen Finale."
    }
  },
  {
    id: 15,
    title: "Station 15: Das große Finale",
    description: "Du hast es fast geschafft! Erreiche den letzten Punkt, um dein Abenteuer zu vollenden.",
    schillingText: "Du hast den Weg gemeistert, den ich selbst tausendmal gegangen bin. Jetzt fehlt nur noch das letzte Rätsel - dann gehörst du zu uns Gezeichneten von Arkona.",
    target: { latitude: 54.680200, longitude: 13.447000 },
    radius: 20,
    qrFallback: "arkona-poi-15",
    riddle: {
      question: "[Das finale Rätsel des Kap Arkona Explorers]",
      answer: "Finale",
      successMessage: "Du hast es geschafft! Das war die letzte Station."
    }
  }
];

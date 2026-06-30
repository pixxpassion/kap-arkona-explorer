// src/data/stations.js
export const stations = [
  {
    id: 1,
    title: "Start: Der magische Schinkelturm ",
    description: "Begib dich zum ältesten Leuchtturm am Kap Arkona. Er ist quadratisch und aus Backstein gebaut.",
    target: {
      latitude: 54.679722,
      longitude: 13.431389
    },
    radius: 20, // Radius in Metern, ab wann die Station via GPS freigeschaltet wird
    qrFallback: "https://www.summitlynx.com/poi/schinkelturm-123", // Die URL aus dem echten SummitLynx QR-Code
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
    target: {
      latitude: 54.679200, 
      longitude: 13.434500
    },
    radius: 20,
    qrFallback: "https://www.summitlynx.com/poi/peilturm-456",
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
    target: {
      latitude: 54.679000, // Hier die echten GPS-Breitengrade eintragen
      longitude: 13.435000 // Hier die echten GPS-Längengrade eintragen
    },
    radius: 20,
    qrFallback: "https://www.summitlynx.com/poi/placeholder-3",
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
    target: { latitude: 54.679100, longitude: 13.436000 },
    radius: 20,
    qrFallback: "https://www.summitlynx.com/poi/placeholder-4",
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
    target: { latitude: 54.679200, longitude: 13.437000 },
    radius: 20,
    qrFallback: "https://www.summitlynx.com/poi/placeholder-5",
    riddle: {
      question: "[Deine Rätselfrage für Station 5]",
      answer: "Lösung5",
      successMessage: "Halbzeit! Fantastisch gemacht."
    }
  },
  {
    id: 6,
    title: "Station 6: [Name der Station]",
    description: "[Wegbeschreibung für Station 6]",
    target: { latitude: 54.679300, longitude: 13.438000 },
    radius: 20,
    qrFallback: "https://www.summitlynx.com/poi/placeholder-6",
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
    target: { latitude: 54.679400, longitude: 13.439000 },
    radius: 20,
    qrFallback: "https://www.summitlynx.com/poi/placeholder-7",
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
    target: { latitude: 54.679500, longitude: 13.440000 },
    radius: 20,
    qrFallback: "https://www.summitlynx.com/poi/placeholder-8",
    riddle: {
      question: "[Deine Rätselfrage für Station 8]",
      answer: "Lösung8",
      successMessage: "Das war schwer, aber du hast es geschafft!"
    }
  },
  {
    id: 9,
    title: "Station 9: [Name der Station]",
    description: "[Wegbeschreibung für Station 9 - Endspurt!]",
    target: { latitude: 54.679600, longitude: 13.441000 },
    radius: 20,
    qrFallback: "https://www.summitlynx.com/poi/placeholder-9",
    riddle: {
      question: "[Deine Rätselfrage für Station 9]",
      answer: "Lösung9",
      successMessage: "Genial! Nur noch eine Station bis zum großen Finale."
    }
  },
  {
    id: 10,
    title: "Station 10: Das große Finale",
    description: "Du hast es fast geschafft! Erreiche den letzten Punkt, um dein Abenteuer zu vollenden.",
    target: { latitude: 54.679700, longitude: 13.442000 },
    radius: 20,
    qrFallback: "https://www.summitlynx.com/poi/placeholder-10",
    riddle: {
      question: "[Das finale Rätsel des Kap Arkona Explorers]",
      answer: "Finale",
      successMessage: "Du hast es geschafft! Das war die letzte Station."
    }
  }
];
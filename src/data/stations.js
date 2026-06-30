export const stations = [
  {
    id: 1,
    title: "Start: Der Schinkelturm",
    description: "Begib dich zum ältesten Leuchtturm am Kap Arkona. Er ist quadratisch und aus Backstein gebaut.",
    target: {
      latitude: 54.679722,
      longitude: 13.431389
    },
    radius: 20,
    qrFallback: "https://www.summitlynx.com/poi/schinkelturm-123", // Beispiel-URL des echten QR-Codes
    riddle: {
      question: "Über dem Eingang befindet sich eine Jahreszahl. Welche ist es?",
      answer: "1827",
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
  }
];
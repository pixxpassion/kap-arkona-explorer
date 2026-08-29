// src/data/stations.js

// Bei diesen erreichten Stationen wird ein Goodie freigeschaltet.
// Einlösbar nach Tourende in der Tourist-Info am Großparkplatz
// oder in der Tourist-Info & Shop bei den Türmen.
export const goodieMilestones = {
  5: "Du hast 5 Stationen gemeistert! Dein erstes Goodie wartet auf dich - einlösbar am Ende deiner Tour in der Tourist-Info am Großparkplatz oder in der Tourist-Info & Shop bei den Türmen.",
  10: "10 Stationen geschafft! Ein weiteres Goodie ist freigeschaltet - hol es dir am Ende deiner Tour ab.",
  15: "Alle 15 Stationen gemeistert! Dein drittes Goodie wartet - genau wie deine Entdecker-Wandernadel."
};

export const stations = [
  {
    id: 1,
    title: "Start: Der magische Schinkelturm ",
    description: "Begib dich zum ältesten Leuchtturm am Kap Arkona. Er ist quadratisch und aus Backstein gebaut.",
    schillingText: "Moin, Fremder! Ich bin Schilling, Leuchtturmwärter hier oben. Seit Jahren wache ich über die Steilküste - der alte Backsteinturm hat schon so manchen Sturm überstanden, genau wie ich.",
    schillingAudio: "audio/schilling-station-01.mp3",
    target: {
      latitude: 54.679722,
      longitude: 13.431389
    },
    radius: 20, // Radius in Metern, ab wann die Station via GPS freigeschaltet wird
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
    schillingAudio: "audio/schilling-station-02.mp3",
    target: {
      latitude: 54.679200,
      longitude: 13.434500
    },
    radius: 20,
    riddle: {
      question: "Wie viele Stufen führen zur Aussichtsplattform hinauf?",
      answer: "111",
      successMessage: "Perfekt! Weiter geht's zur Steilküste."
    }
  },
  {
    id: 3,
    title: "Die Jaromarsburg",
    description: "Folge dem Weg zu den Wallresten der slawischen Burganlage, unweit des Peilturms.",
    schillingText: "Vor rund vierzehnhundert Jahren stand hier das Heiligtum der Ranen. Von der einst mächtigen Burg sind heute nur noch die Wälle zu erkennen - aber die alten Geschichten spürt man noch immer, wenn der Wind über die Gräser streicht.",
    schillingAudio: "audio/schilling-station-03.mp3",
    target: { latitude: 54.676092, longitude: 13.435376 },
    radius: 20,
    riddle: {
      question: "Wie viele Jahre alt ist die slawische Siedlung hier schätzungsweise (auf- oder abgerundet, in ganzen Hundertern)?",
      answer: "1400",
      successMessage: "Ganz genau - eine ehrwürdige Geschichte."
    }
  },
  {
    id: 4,
    title: "Marineführungsbunker",
    description: "Gehe zum Eingang des unterirdischen Bunkers, der einst der Volksmarine als Gefechtsstand diente.",
    schillingText: "Zweitausend Quadratmeter, tief unter der Erde gegraben - bis 1990 saß hier die Volksmarine der DDR und wachte über die Ostsee, verborgen vor jedem Blick von oben.",
    schillingAudio: "audio/schilling-station-04.mp3",
    target: { latitude: 54.680507, longitude: 13.431341 },
    radius: 20,
    riddle: {
      question: "Wie groß ist die Ausstellungsfläche des Bunkers in Quadratmetern?",
      answer: "2000",
      successMessage: "Sehr gut! Tief unter der Erde findest du dich zurecht."
    }
  },
  {
    id: 5,
    title: "Der kleine Leuchtturm",
    description: "Weiter zum kleinen Leuchtturm, direkt neben dem Erlebnis- und Ausstellungszentrum.",
    schillingText: "Ein junger Geselle unter uns Türmen, aber schon jetzt beliebt für ein Erinnerungsfoto. Nebenan erfährst du mehr über die Seezeichen, die den Schiffen seit jeher den Weg weisen.",
    schillingAudio: "audio/schilling-station-05.mp3",
    target: { latitude: 54.680465, longitude: 13.432157 },
    radius: 20,
    riddle: {
      question: "Wie heißt das Erlebnis- und Ausstellungszentrum direkt nebenan (lateinischer Name für die Ostsee, zwei Wörter)?",
      answer: "Mare Balticum",
      successMessage: "Erstes Goodie erreicht! Fantastisch gemacht."
    }
  },
  {
    id: 6,
    title: "Das Leuchtfeuer Arkona",
    description: "Besteige den großen, neueren Leuchtturm - den höchsten Punkt deiner ganzen Tour.",
    schillingText: "Einhundertvierundsechzig Stufen, und dann liegt einem ganz Wittow zu Füßen. Seit 1902 blitzt mein Feuer alle siebzehn Sekunden dreimal - zweiundzwanzig Seemeilen weit trägt es hinaus in die Nacht.",
    schillingAudio: "audio/schilling-station-06.mp3",
    target: { latitude: 54.679542, longitude: 13.432652 },
    radius: 20,
    riddle: {
      question: "Wie viele Stufen führen im großen Leuchtturm nach oben?",
      answer: "164",
      successMessage: "Ganz genau. Was für eine Aussicht, nicht wahr?"
    }
  },
  {
    id: 7,
    title: "Schiffsfriedhof",
    description: "Suche die kleine Ausstellung über gesunkene Schiffe vor der Küste, nahe der Türme.",
    schillingText: "So manches Schiff hat vor unserer Küste sein Grab gefunden - die See nimmt sich, was ihr gebührt. Hier erfährst du von den Wracks, die bis heute unter den Wellen liegen.",
    schillingAudio: "audio/schilling-station-07.mp3",
    target: { latitude: 54.680429, longitude: 13.431970 },
    radius: 20,
    riddle: {
      question: "Wie wird die Ausstellung über die gesunkenen Schiffe hier genannt (ein Wort)?",
      answer: "Schiffsfriedhof",
      successMessage: "Hervorragend kombiniert!"
    }
  },
  {
    id: 8,
    title: "Steilküste & Fotopoint",
    description: "Gehe zum Aussichtspunkt am Hochufer - halte dich dabei stets auf den gesicherten Wegen.",
    schillingText: "Bei klarer Sicht reicht der Blick von hier weit über die See hinaus. Die Steilküste ist abbruchgefährdet, mein Freund - bleib schön auf dem Pfad, dann kann dir nichts geschehen.",
    schillingAudio: "audio/schilling-station-08.mp3",
    target: { latitude: 54.677435, longitude: 13.430772 },
    radius: 20,
    riddle: {
      question: "Wie viele Kilometer weit reicht der Blick bei klarer Sicht bis zur dänischen Insel Møn (auf 10 gerundet)?",
      answer: "60",
      successMessage: "Das war schwer, aber du hast es geschafft!"
    }
  },
  {
    id: 9,
    title: "Die achteckige Kapelle",
    description: "Steige den Hochuferweg hinab zur kleinen Kapelle oberhalb von Vitt.",
    schillingText: "Ab 1806 wurde hier die Kapelle errichtet, in der bis heute Gottesdienste stattfinden. Ein berühmter Prediger hat diesen Ort einst weit über die Insel hinaus bekannt gemacht.",
    schillingAudio: "audio/schilling-station-09.mp3",
    target: { latitude: 54.666797, longitude: 13.429716 },
    radius: 20,
    riddle: {
      question: "Welcher Pastor machte Vitt durch seine berühmten Uferpredigten bekannt (Nachname)?",
      answer: "Kosegarten",
      successMessage: "Genial! Nur noch eine Station bis zum zweiten Goodie."
    }
  },
  {
    id: 10,
    title: "Fischerdorf Vitt",
    description: "Steige weiter hinab in das kleine Fischerdorf mit den reetgedeckten Katen.",
    schillingText: "Reetgedeckte Katen ducken sich hier in die Schlucht, als wollten sie sich vor der See selbst verstecken. Halte Ausschau nach den roten Wimpeln an den Fischreusen im kleinen Hafen!",
    schillingAudio: "audio/schilling-station-10.mp3",
    target: { latitude: 54.667634, longitude: 13.428269 },
    radius: 20,
    riddle: {
      question: "In welchem Jahr wurde Vitt erstmals urkundlich erwähnt?",
      answer: "1290",
      successMessage: "Zweites Goodie erreicht! Weiter geht die Tour."
    }
  },
  {
    id: 11,
    title: "Blick auf Vitt",
    description: "Gehe zum kleinen Kunstwerk am Ortsrand, das an einen berühmten Maler erinnert.",
    schillingText: "So mancher Künstler stand genau hier und ließ sich von diesem Anblick auf Vitt verzaubern. Licht und Klippen, Boote und Reet - ein Bild wie gemalt, findest du nicht auch?",
    schillingAudio: "audio/schilling-station-11.mp3",
    target: { latitude: 54.669774, longitude: 13.431228 },
    radius: 20,
    riddle: {
      question: "Nach welchem berühmten Maler der Romantik ist dieses Kunstwerk benannt (Nachname)?",
      answer: "Friedrich",
      successMessage: "Weiter so, Entdecker!"
    }
  },
  {
    id: 12,
    title: "Rügenhof & Souvenirshop",
    description: "Wandere zurück in Richtung Putgarten, zum Rügenhof mit Kunsthandwerk und Ferienwohnungen.",
    schillingText: "Mit der Kap Arkona Card gibt's hier zehn Prozent Rabatt auf Kunsthandwerk. Und wenn du länger bleiben willst - eine der Ferienwohnungen hier trägt sogar meinen Namen.",
    schillingAudio: "audio/schilling-station-12.mp3",
    target: { latitude: 54.672728, longitude: 13.415642 },
    radius: 20,
    riddle: {
      question: "Wie viele Ferienwohnungen gibt es insgesamt am Kap Arkona (Rügenhof plus die Wohnung „Leuchtturmwärter“)?",
      answer: "16",
      successMessage: "Klasse gelöst!"
    }
  },
  {
    id: 13,
    title: "Wetterstation Arkona",
    description: "Suche die kleine Wetterstation nahe den Türmen, die seit Langem die Ostsee im Blick behält.",
    schillingText: "Wind, Wellen und Wolken - hier oben wird alles gemessen, was über Arkona zieht. Auch ein alter Seemann wie ich weiß: der Wetterbericht lügt selten, wenn er von hier kommt.",
    schillingAudio: "audio/schilling-station-13.mp3",
    target: { latitude: 54.679041, longitude: 13.434000 },
    radius: 20,
    riddle: {
      question: "Welcher Wetterdienst betreibt die Station hier (Abkürzung, 3 Buchstaben)?",
      answer: "DWD",
      successMessage: "Fast geschafft!"
    }
  },
  {
    id: 14,
    title: "Zurück zum Parkplatz",
    description: "Der Rundweg schließt sich: Kehre zurück zum Großparkplatz in Putgarten, von dem aus deine Reise begann.",
    schillingText: "Der Kreis schließt sich, mein Freund. Von hier bist du losgezogen, und hier kehrst du zurück - reicher um so manche Geschichte vom Kap. Nur noch ein letztes Rätsel trennt dich vom großen Finale.",
    schillingAudio: "audio/schilling-station-14.mp3",
    target: { latitude: 54.670271, longitude: 13.410305 },
    radius: 20,
    riddle: {
      question: "Wie heißt der Ort, an dem der Großparkplatz liegt und deine Tour begann?",
      answer: "Putgarten",
      successMessage: "Genial! Nur noch eine Station bis zum großen Finale."
    }
  },
  {
    id: 15,
    title: "Station 15: Das große Finale",
    description: "Du hast es fast geschafft! Erreiche den letzten Punkt, um dein Abenteuer zu vollenden.",
    schillingText: "Du hast den Weg gemeistert, den ich selbst tausendmal gegangen bin. Jetzt fehlt nur noch das letzte Rätsel - dann gehörst du zu uns Gezeichneten von Arkona.",
    schillingAudio: "audio/schilling-station-15.mp3",
    target: { latitude: 54.670271, longitude: 13.410305 },
    radius: 20,
    riddle: {
      question: "Wie heißt der Leuchtturmwärter, der dich die ganze Tour über begleitet hat?",
      answer: "Schilling",
      successMessage: "Du hast es geschafft! Das war die letzte Station."
    }
  }
];

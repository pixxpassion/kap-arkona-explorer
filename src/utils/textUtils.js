// Normalisiert Nutzereingaben: Groß-/Kleinschreibung und überflüssige
// Leerzeichen (auch mehrfache oder am Rand) werden ignoriert.
export function normalizeAnswer(str) {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

// Levenshtein-Distanz: Anzahl der Einzelzeichen-Änderungen (einfügen,
// löschen, ersetzen), um von "a" zu "b" zu kommen.
function levenshteinDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, (_, i) => [i, ...Array(cols - 1).fill(0)]);
  for (let j = 0; j < cols; j++) matrix[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // löschen
        matrix[i][j - 1] + 1, // einfügen
        matrix[i - 1][j - 1] + cost // ersetzen
      );
    }
  }
  return matrix[rows - 1][cols - 1];
}

// Erlaubte Tippfehler-Toleranz abhängig von der Antwortlänge - bei sehr
// kurzen Lösungswörtern (z. B. Jahreszahlen) bleibt sie strenger, damit
// nicht plötzlich eine ganz andere Zahl als "richtig" durchgeht.
function toleranceFor(length) {
  if (length <= 3) return 0;
  if (length <= 6) return 1;
  return 2;
}

// Prüft eine Nutzerantwort tolerant gegen die Lösung: Groß-/Kleinschreibung
// und Leerzeichen werden ignoriert, kleinere Vertipper werden verziehen.
// Bei rein numerischen Lösungen (z. B. Jahreszahlen) gilt keine
// Tippfehler-Toleranz, da schon eine einzelne Ziffer die Bedeutung ändert -
// dort muss die Zahl exakt stimmen.
export function isAnswerCorrect(userAnswer, correctAnswer) {
  const given = normalizeAnswer(userAnswer);
  const correct = normalizeAnswer(correctAnswer);

  if (given === correct) return true;

  const isNumeric = /^[0-9]+$/.test(correct);
  if (isNumeric) return false;

  const distance = levenshteinDistance(given, correct);
  return distance <= toleranceFor(correct.length);
}

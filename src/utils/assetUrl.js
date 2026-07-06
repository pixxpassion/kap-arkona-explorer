// Baut den korrekten Pfad zu einer Datei im public/-Ordner, egal ob die App
// im Domain-Root oder in einem Unterverzeichnis (z. B. /testen/) läuft.
export function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

// Entfernt Service-Worker und Browser-Caches der App, damit nach einem Update
// oder bei einer "hängenden" Ansicht garantiert die aktuelle Version geladen wird.
// Der Spielfortschritt (localStorage) bleibt davon unberührt.
export async function clearAppCache() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((reg) => reg.unregister()));
  }

  if ('caches' in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }

  window.location.reload();
}

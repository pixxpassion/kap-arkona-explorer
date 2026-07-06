export function isMobileDevice() {
  const uaIsMobile = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(navigator.userAgent);
  const hasTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
  return uaIsMobile || hasTouch;
}

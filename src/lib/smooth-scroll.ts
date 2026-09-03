/**
 * Custom smooth scroll with ease-in-out-cubic animation.
 * Bypasses browser CSS quirks and ensures a visible, silky-smooth slide animation.
 */
export function smoothScrollTo(targetY: number, duration = 800): void {
  if (typeof window === 'undefined') return;

  const startY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
  const diff = targetY - startY;
  if (Math.abs(diff) < 2) return;

  const startTime = performance.now();

  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = easeInOutCubic(progress);

    window.scrollTo(0, Math.round(startY + diff * easeProgress));

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

export function scrollToElement(elementId: string, offset = 80, duration = 800): void {
  if (typeof window === 'undefined') return;
  const el = document.getElementById(elementId);
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
  const targetY = Math.max(0, rect.top + currentScroll - offset);

  smoothScrollTo(targetY, duration);
}

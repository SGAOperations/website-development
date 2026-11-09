const ANNOUNCER_ID = "a11y-announcer";

/** Polite live region for status messages that have no visible text (WCAG 4.1.3). Render once per page. */
export function Announcer() {
  return <div id={ANNOUNCER_ID} role="status" aria-live="polite" aria-atomic="true" className="sr-only" />;
}

/** Read `message` to screen reader users without moving focus. */
export function announce(message: string) {
  const region = document.getElementById(ANNOUNCER_ID);
  if (!region) return;

  // Clear first so repeating the same message is still announced.
  region.textContent = "";
  window.setTimeout(() => {
    region.textContent = message;
  }, 50);
}

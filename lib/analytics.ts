type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

/**
 * Every event name here is also a row in the dashboard at /dashboard.
 * If you add an event, add it there too or it is invisible.
 */
export type EventName =
  | 'cta_click'
  | 'form_start'
  | 'form_field_abandon'
  | 'form_submit'
  | 'form_error'
  | 'safety_section_read'
  | 'faq_open';

export function track(event: EventName, props?: Props): void {
  if (typeof window === 'undefined') return;
  window.plausible?.(event, props ? { props } : undefined);
}

/**
 * Fires once when the safety section has been on screen for 4 seconds.
 * Scroll depth alone lies here — people scroll past. Dwell is the signal.
 */
export function watchSafetyDwell(el: Element, onRead: () => void): () => void {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  let timer: number | undefined;
  let fired = false;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !fired) {
          timer = window.setTimeout(() => {
            fired = true;
            onRead();
          }, 4000);
        } else if (timer !== undefined) {
          window.clearTimeout(timer);
          timer = undefined;
        }
      }
    },
    { threshold: 0.4 },
  );

  observer.observe(el);
  return () => {
    if (timer !== undefined) window.clearTimeout(timer);
    observer.disconnect();
  };
}

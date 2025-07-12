/**
 * Resolve as soon as an element matching `selector` appears in the DOM.
 * Rejects after `timeoutMs` (default: 5 s) so we don’t wait forever.
 */
export function waitForElement<T extends Element = Element>(
  selector: string,
  timeoutMs = 5000,
  root: Document | Element = document,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const existing = root.querySelector<T>(selector);
    if (existing) return resolve(existing);

    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout waiting for ${selector}`));
    }, timeoutMs);

    const observer = new MutationObserver(() => {
      const el = root.querySelector<T>(selector);
      if (el) {
        clearTimeout(timer);
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(root, { childList: true, subtree: true });
  });
}

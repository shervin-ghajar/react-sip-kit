/**
 * Resolve as soon as an element matching `selector` appears in the DOM.
 * Rejects after `timeoutMs` (default: 5 s) so we don’t wait forever.
 */
export declare function waitForElement<T extends Element = Element>(selector: string, timeoutMs?: number, root?: Document | Element): Promise<T>;

"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny global "site is revealed" signal. The loading screen calls
 * markSiteReady() as it starts to exit; the hero intro, 3D scene and nav
 * wait for it so their entrance animations aren't wasted behind the loader.
 */
const EVENT = "gb:site-ready";

export function isSiteReady(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.siteReady === "1";
}

export function markSiteReady() {
  if (isSiteReady()) return;
  document.documentElement.dataset.siteReady = "1";
  window.dispatchEvent(new Event(EVENT));
}

/** Runs `cb` once the site is ready (immediately if it already is). Returns an unsubscribe. */
export function onSiteReady(cb: () => void): () => void {
  if (isSiteReady()) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(EVENT, handler, { once: true });
  return () => window.removeEventListener(EVENT, handler);
}

export function useSiteReady(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener(EVENT, onChange);
      return () => window.removeEventListener(EVENT, onChange);
    },
    isSiteReady,
    () => false,
  );
}

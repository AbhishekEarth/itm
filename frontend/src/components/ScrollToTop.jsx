import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Ensures every route navigation starts at the top of the page.
 * - Disables the browser's automatic scroll restoration so it doesn't fight us.
 * - Runs in useLayoutEffect (before paint) AND useEffect (after paint) for bulletproof behavior.
 * - Temporarily forces scroll-behavior: auto so any CSS "smooth" rule can't cause a mid-page landing.
 * - Honours in-page #hash anchors: if the URL has a #hash, scroll that element into view instead.
 * - Skips POP navigations (browser back/forward) so users land where they expect.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const prev = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = prev;
      };
    }
  }, []);

  const jumpToTop = () => {
    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.scrollTop = 0;
    document.body.scrollTop = 0;
    html.style.scrollBehavior = prevBehavior;
  };

  useLayoutEffect(() => {
    if (navType === "POP") return;

    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(id);
      if (target) {
        const html = document.documentElement;
        const prevBehavior = html.style.scrollBehavior;
        html.style.scrollBehavior = "auto";
        target.scrollIntoView({ block: "start" });
        html.style.scrollBehavior = prevBehavior;
        return;
      }
    }

    jumpToTop();
  }, [pathname, search, hash, navType]);

  useEffect(() => {
    if (navType === "POP" || hash) return;
    const raf = requestAnimationFrame(jumpToTop);
    return () => cancelAnimationFrame(raf);
  }, [pathname, search, navType, hash]);

  return null;
}

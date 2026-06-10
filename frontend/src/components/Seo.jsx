import { useEffect } from "react";

/**
 * SEO injector — React 19 friendly (no helmet).
 * Sets <title>, <meta name="description">, OpenGraph + Twitter + canonical + JSON-LD
 * directly on document.head; resets to a sane default on unmount when needed.
 *
 * Usage:
 *   <Seo
 *     title="CSE Department — ITM Gwalior"
 *     description="…"
 *     image="https://…"
 *     canonical="https://itmgoi.in/cs"
 *     jsonLd={{ "@context": "https://schema.org", "@type": "EducationalOrganization", … }}
 *   />
 */
export default function Seo({
  title,
  description,
  image,
  canonical,
  robots = "index,follow",
  type = "website",
  jsonLd,
}) {
  useEffect(() => {
    const fullTitle = title ? `${title}` : document.title;
    document.title = fullTitle;

    setMeta("name", "description", description);
    setMeta("name", "robots", robots);

    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:image", image);
    setMeta("property", "og:url", canonical || window.location.href);
    setMeta("property", "og:site_name", "ITM Gwalior");

    setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    setCanonical(canonical || window.location.href);

    if (jsonLd) setJsonLd(jsonLd);
    return () => clearJsonLd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, image, canonical, robots, type, JSON.stringify(jsonLd)]);

  return null;
}

function setMeta(attr, key, value) {
  if (value == null) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", String(value));
}

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

const LD_ID = "__itm_jsonld__";

function setJsonLd(data) {
  clearJsonLd();
  const s = document.createElement("script");
  s.id = LD_ID;
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

function clearJsonLd() {
  const existing = document.getElementById(LD_ID);
  if (existing) existing.remove();
}

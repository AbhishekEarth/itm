/**
 * Catch-all page renderer.
 *
 * Any URL that isn't matched by a hard-coded React route falls through to
 * this component. It queries /api/public/page/{path}, and if a row exists in
 * the `pages` table it renders the title + intro + each section's payload as
 * appropriate. If no row exists it shows the 404 fallback.
 *
 * This is what makes the "+ New Page" button in /admin/pages/visual actually
 * useful — visitors can reach the freshly-created page immediately at the
 * URL the admin chose, without anyone touching the SPA's route table.
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Home, ChevronRight } from 'lucide-react';
import { usePublicPage } from '../hooks/usePublicPage';
import Seo from '../components/Seo';

function NotFound({ path }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="text-7xl mb-4">🔍</div>
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1a0606] dark:text-white mb-2">
        Page not found
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-6">
        We couldn't find a page at <span className="font-mono text-[#800000]">{path}</span>.
        It may have been moved or never created.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#800000] text-white text-xs font-black uppercase tracking-widest hover:bg-[#5a0000]"
      >
        <Home size={14} /> Back to Home
      </Link>
    </div>
  );
}

function renderSection(section) {
  const payload = section?.payload || section?.payload_draft || {};
  const kind = section?.kind || 'rich_text';
  const key = `${section?.section_key || section?.id || Math.random()}`;

  // rich_text — payload.md is Markdown source, payload.html is pre-rendered.
  if (kind === 'rich_text') {
    const text = payload.html || payload.md || payload.body || '';
    if (!text) return null;
    return (
      <div
        key={key}
        className="prose prose-sm sm:prose-base dark:prose-invert max-w-none my-5"
        dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br />') }}
      />
    );
  }

  // simple key/value bullet list
  if (kind === 'kv' && payload && typeof payload === 'object') {
    return (
      <ul key={key} className="my-5 space-y-1.5">
        {Object.entries(payload).map(([k, v]) => (
          <li key={k} className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-black text-[#800000]">{k}:</span> {String(v)}
          </li>
        ))}
      </ul>
    );
  }

  // gallery / list
  if (kind === 'list' && Array.isArray(payload)) {
    return (
      <ul key={key} className="my-5 grid sm:grid-cols-2 gap-2.5">
        {payload.map((it, i) => (
          <li key={i} className="text-sm bg-white dark:bg-gray-800 border border-rose-50 dark:border-gray-700 rounded-xl px-3 py-2">
            {typeof it === 'string' ? it : (it.title || JSON.stringify(it))}
          </li>
        ))}
      </ul>
    );
  }

  // image / single
  if (kind === 'image' && payload?.url) {
    return (
      <figure key={key} className="my-5">
        <img
          src={payload.url}
          alt={payload.alt || section.label || ''}
          className="w-full rounded-2xl shadow-md object-cover"
        />
        {payload.caption ? (
          <figcaption className="text-[11px] text-gray-500 mt-2 text-center">{payload.caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  // html escape hatch
  if (kind === 'html' && (payload.html || payload.body)) {
    return (
      <div
        key={key}
        className="my-5"
        dangerouslySetInnerHTML={{ __html: payload.html || payload.body }}
      />
    );
  }

  // unknown kind — show the label as a heading so admins know it exists
  if (section?.label) {
    return (
      <div key={key} className="my-5 text-xs text-gray-500 italic">
        Section "{section.label}" — rendering not implemented for kind "{kind}".
      </div>
    );
  }
  return null;
}

export default function DynamicPage() {
  const location = useLocation();
  const path = location.pathname;
  const { data, isLoading, error } = usePublicPage(path);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center text-gray-400 text-sm">
        Loading…
      </div>
    );
  }
  if (error || !data) return <NotFound path={path} />;

  const sections = Array.isArray(data.sections)
    ? data.sections.filter((s) => s.is_active !== false)
    : [];

  return (
    <div className="min-h-[60vh] bg-[#fbf7f2] dark:bg-[#020617]">
      <Seo
        title={data.meta?.title || data.title}
        description={data.meta?.description || data.intro_md}
        canonical={data.meta?.canonical_url}
        robots={data.meta?.robots}
      />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 border-b border-rose-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          <Link to="/" className="hover:text-[#800000] inline-flex items-center gap-1.5">
            <Home size={11} /> Home
          </Link>
          <ChevronRight size={10} className="text-gray-300" />
          <span className="text-[#800000]">{data.title}</span>
        </div>
      </div>

      {/* Hero / intro */}
      <section className="relative bg-gradient-to-br from-[#3e0202] via-[#800000] to-[#5a0000] text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-10 right-20 w-72 h-72 rounded-full border-2 border-white" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <span className="inline-flex items-center gap-2 text-amber-200 font-bold tracking-widest text-[10px] uppercase mb-3 px-3 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
            <FileText size={11} /> ITM Gwalior
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.05]">
            {data.title}
          </h1>
          {data.intro_md ? (
            <p className="mt-3 text-sm sm:text-base text-rose-100/80 max-w-2xl leading-relaxed">
              {data.intro_md}
            </p>
          ) : null}
        </div>
      </section>

      {/* Body */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {sections.length > 0 ? (
          sections.map(renderSection)
        ) : (
          <div className="text-sm text-gray-500 italic">
            This page is brand-new. Add sections via{' '}
            <Link to={`/admin/pages/${encodeURIComponent(data.key || '')}/edit`} className="text-[#800000] font-black underline">
              the admin editor
            </Link>{' '}
            to fill in content.
          </div>
        )}
      </section>
    </div>
  );
}

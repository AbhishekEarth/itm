import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, FileText, Pencil, Save, X } from 'lucide-react';
import { pagesApi } from '../../api/cms';
import { errorMessage } from '../../api/client';

function SectionEditor({ page, section, onSaved, onClose }) {
  const [draft, setDraft] = useState(JSON.stringify(section.payload ?? {}, null, 2));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const save = async () => {
    setErr(''); setSaving(true);
    try {
      const payload = JSON.parse(draft);
      const updated = await pagesApi.updateSection(page.id, section.section_key, { payload });
      onSaved(updated);
      onClose();
    } catch (e) {
      setErr(e.message ?? errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-3xl bg-white dark:bg-gray-900 h-full overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              Edit section: <span className="font-mono text-sm">{section.section_key}</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Page: <span className="font-mono">{page.path}</span> · kind: {section.kind}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} />
          </button>
        </div>

        <textarea
          rows={Math.min(36, draft.split('\n').length + 2)}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full px-3 py-2 text-xs font-mono border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]"
        />

        {err && <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</div>}

        <div className="mt-4 flex gap-2">
          <button onClick={save} disabled={saving} className="bg-[#800000] text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg flex items-center gap-1.5 disabled:opacity-60">
            <Save size={14} /> {saving ? 'Saving…' : 'Save section'}
          </button>
          <button onClick={onClose} className="text-xs px-4 py-2 rounded-lg">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function PageMetaEditor({ page, onSaved }) {
  const [form, setForm] = useState({
    title: page.title ?? '',
    meta_title: page.meta_title ?? '',
    meta_description: page.meta_description ?? '',
    meta_keywords: (page.meta_keywords || []).join(', '),
    canonical_url: page.canonical_url ?? '',
    robots: page.robots ?? 'index,follow',
    is_published: page.is_published,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setErr(''); setOk(false); setSaving(true);
    try {
      const updated = await pagesApi.update(page.id, {
        ...form,
        meta_keywords: form.meta_keywords.split(',').map((s) => s.trim()).filter(Boolean),
      });
      onSaved(updated);
      setOk(true);
      setTimeout(() => setOk(false), 1500);
    } catch (e2) {
      setErr(errorMessage(e2));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 rounded-xl p-4 grid sm:grid-cols-2 gap-3">
      <label className="text-xs">
        <span className="block font-bold text-gray-500 mb-1">Title</span>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-2 py-1.5 border rounded dark:bg-gray-900 dark:border-gray-700" />
      </label>
      <label className="text-xs">
        <span className="block font-bold text-gray-500 mb-1">Meta title (≤70)</span>
        <input maxLength={70} value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="w-full px-2 py-1.5 border rounded dark:bg-gray-900 dark:border-gray-700" />
      </label>
      <label className="text-xs sm:col-span-2">
        <span className="block font-bold text-gray-500 mb-1">Meta description (≤255)</span>
        <textarea maxLength={255} rows={2} value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} className="w-full px-2 py-1.5 border rounded dark:bg-gray-900 dark:border-gray-700" />
      </label>
      <label className="text-xs">
        <span className="block font-bold text-gray-500 mb-1">Keywords (comma-separated)</span>
        <input value={form.meta_keywords} onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })} className="w-full px-2 py-1.5 border rounded dark:bg-gray-900 dark:border-gray-700" />
      </label>
      <label className="text-xs">
        <span className="block font-bold text-gray-500 mb-1">Canonical URL</span>
        <input value={form.canonical_url} onChange={(e) => setForm({ ...form, canonical_url: e.target.value })} className="w-full px-2 py-1.5 border rounded dark:bg-gray-900 dark:border-gray-700" />
      </label>
      <label className="text-xs">
        <span className="block font-bold text-gray-500 mb-1">Robots</span>
        <input value={form.robots} onChange={(e) => setForm({ ...form, robots: e.target.value })} className="w-full px-2 py-1.5 border rounded dark:bg-gray-900 dark:border-gray-700" />
      </label>
      <label className="text-xs flex items-center gap-2">
        <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
        Published
      </label>
      <div className="sm:col-span-2 flex items-center gap-2">
        <button disabled={saving} className="bg-[#800000] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <Save size={12} /> Save meta
        </button>
        {ok && <span className="text-xs text-emerald-600 font-semibold">Saved.</span>}
        {err && <span className="text-xs text-red-600 font-semibold">{err}</span>}
      </div>
    </form>
  );
}

export default function AdminPages() {
  const qc = useQueryClient();
  const { data: pages = [], isLoading, error } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: () => pagesApi.list(),
  });
  const [editing, setEditing] = useState(null); // {page, section}

  const replacePage = (updated) =>
    qc.setQueryData(['admin-pages'], (arr = []) =>
      arr.map((x) => (x.id === updated.id ? updated : x))
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <FileText size={20} /> Pages
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Edit page metadata + content sections. Sections render as live JSON for now; richer editors arrive in later phases.</p>
          </div>
        </div>

        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{errorMessage(error)}</div>}

        {isLoading && <div className="text-center text-gray-400 py-10">Loading…</div>}

        <div className="space-y-6">
          {pages.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">{p.title}</h2>
                  <div className="text-xs text-gray-500 font-mono">{p.path} · key=<span className="font-semibold">{p.key}</span></div>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${p.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
                  {p.is_published ? 'Published' : 'Draft'}
                </span>
              </div>

              <PageMetaEditor page={p} onSaved={replacePage} />

              <h3 className="mt-5 mb-2 text-[11px] font-black uppercase tracking-widest text-gray-400">Sections</h3>
              <div className="grid gap-2">
                {p.sections.length === 0 && <div className="text-xs text-gray-400">No sections yet.</div>}
                {p.sections.map((s) => (
                  <div key={s.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2.5">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {s.label || s.section_key}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        {s.section_key} · {s.kind} · pos {s.position}
                      </div>
                    </div>
                    <button
                      onClick={() => setEditing({ page: p, section: s })}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1.5"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!isLoading && pages.length === 0 && <div className="text-center text-gray-400 py-10">No pages yet. Seed creates the Home page automatically.</div>}
        </div>
      </div>

      {editing && (
        <SectionEditor
          page={editing.page}
          section={editing.section}
          onClose={() => setEditing(null)}
          onSaved={(updatedSection) => {
            qc.setQueryData(['admin-pages'], (arr = []) =>
              arr.map((pp) =>
                pp.id === editing.page.id
                  ? {
                      ...pp,
                      sections: pp.sections.map((s) =>
                        s.section_key === updatedSection.section_key ? { ...s, ...updatedSection } : s
                      ),
                    }
                  : pp
              )
            );
          }}
        />
      )}
    </div>
  );
}

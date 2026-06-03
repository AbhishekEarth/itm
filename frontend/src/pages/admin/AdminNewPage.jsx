/**
 * /admin/pages/new — dedicated dashboard panel for creating brand-new pages.
 *
 * Pick a SECTION from the dropdown (Departments, About, Clubs, Research,
 * Compliance, Alumni, Custom) — the URL path prefix is auto-set so the new
 * page sits inside the right area of the site (e.g. About → /about/<slug>).
 *
 * On submit:
 *   1. POST /api/admin/pages with {key, path, title, intro_md, status}.
 *   2. Redirect to the visual editor /admin/pages/<key>/edit so the admin can
 *      add sections (rich text, gallery, list, image…) right away.
 *
 * The newly-created page is reachable on the public site at the chosen path,
 * rendered by frontend/src/pages/DynamicPage.jsx.
 */
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, FilePlus2, Building2, Info, Users, FlaskConical,
  ScrollText, Image as ImageIcon, Globe, Rocket, CheckCircle2,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminPagesApi } from '../../api/adminPages';
import { errorMessage } from '../../api/client';

// Each "section" anchors new pages under a URL prefix and a colour scheme.
const SECTIONS = [
  { id: 'departments', label: 'Departments',  prefix: '/departments', Icon: Building2,    accent: 'from-rose-500 to-[#800000]',     hint: 'New academic dept / sub-page under /departments/<slug>' },
  { id: 'about',       label: 'About',        prefix: '/about',       Icon: Info,         accent: 'from-amber-500 to-orange-700',   hint: 'Info pages like /about/leadership, /about/values' },
  { id: 'clubs',       label: 'Clubs & Cells',prefix: '/cells',       Icon: Users,        accent: 'from-emerald-500 to-teal-700',   hint: 'Student clubs, cells and societies under /cells/<slug>' },
  { id: 'research',    label: 'Research',     prefix: '/research',    Icon: FlaskConical, accent: 'from-indigo-500 to-violet-700',  hint: 'Research initiatives, centres, themes under /research/<slug>' },
  { id: 'compliance',  label: 'Compliance',   prefix: '/compliance',  Icon: ScrollText,   accent: 'from-slate-500 to-slate-800',    hint: 'NAAC / NIRF / IQAC / policies under /compliance/<slug>' },
  { id: 'gallery',     label: 'Gallery',      prefix: '/gallery',     Icon: ImageIcon,    accent: 'from-fuchsia-500 to-pink-700',   hint: 'Photo / video collections under /gallery/<slug>' },
  { id: 'custom',      label: 'Custom URL',   prefix: '',             Icon: Globe,        accent: 'from-sky-500 to-blue-700',       hint: 'Free-form path — type any URL starting with /' },
];

function _slug(text) {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminNewPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [section, setSection] = useState('departments');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [customPath, setCustomPath] = useState('/');
  const [intro, setIntro] = useState('');
  const [status, setStatus] = useState('published');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const active = useMemo(() => SECTIONS.find((s) => s.id === section), [section]);

  // Computed final path the visitor will see — auto-derived from section + slug.
  const finalPath = useMemo(() => {
    if (section === 'custom') {
      const p = customPath.trim() || '/';
      return p.startsWith('/') ? p : '/' + p;
    }
    const s = slug.trim() || _slug(title);
    return s ? `${active.prefix}/${s}` : active.prefix;
  }, [section, slug, title, customPath, active]);

  const onTitleChange = (t) => {
    setTitle(t);
    // Auto-fill slug from title until user types their own.
    setSlug((cur) => (cur && cur !== _slug(title) ? cur : _slug(t)));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setOk(''); setBusy(true);
    try {
      const key = _slug(title) || _slug(finalPath.replace(/^\//, '').replace(/\//g, '-'));
      const created = await adminPagesApi.create({
        key,
        path: finalPath,
        title: title.trim(),
        intro_md: intro.trim() || null,
        status,
      });
      qc.invalidateQueries({ queryKey: ['admin-pages-list'] });
      setOk(`Page created at ${created.path}`);
      // Land on the visual editor so admin can add sections immediately.
      setTimeout(() => navigate(`/admin/pages/${encodeURIComponent(created.key)}/edit`), 600);
    } catch (e2) {
      setErr(errorMessage(e2));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <FilePlus2 size={20} /> Create a New Page
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Pick a section, give it a title, choose a URL — your page goes live the moment you click Create.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6">

          {/* SECTION PICKER */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
              1. Which section does it belong to?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {SECTIONS.map((s) => {
                const isActive = s.id === section;
                const Icon = s.Icon;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSection(s.id)}
                    className={`relative text-left p-3 rounded-2xl border transition-all ${
                      isActive
                        ? `bg-gradient-to-br ${s.accent} text-white shadow-md border-transparent`
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#800000]'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-white' : 'text-[#800000] dark:text-rose-300'} />
                    <div className="text-sm font-black mt-1.5 leading-tight">{s.label}</div>
                    <div className={`text-[10px] mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                      {s.prefix || 'free path'}
                    </div>
                    {isActive && <CheckCircle2 size={14} className="absolute top-2 right-2" />}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-500 mt-2 italic">{active?.hint}</p>
          </div>

          {/* TITLE + URL */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-4">
            <label className="block text-xs">
              <span className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1">
                2. Page title
              </span>
              <input
                required
                autoFocus
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="e.g. Student Life, Industry Mentorship, Hackathon Cell"
                className="w-full px-3 py-2 text-base font-bold border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]"
              />
            </label>

            {section === 'custom' ? (
              <label className="block text-xs">
                <span className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1">
                  3. URL Path
                </span>
                <input
                  required
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  placeholder="/your-page-url"
                  className="w-full px-3 py-2 text-sm font-mono border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]"
                />
              </label>
            ) : (
              <label className="block text-xs">
                <span className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1">
                  3. URL slug (last part)
                </span>
                <div className="flex items-stretch border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden focus-within:border-[#800000]">
                  <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-xs font-mono text-gray-500">
                    {active.prefix}/
                  </span>
                  <input
                    required
                    value={slug}
                    onChange={(e) => setSlug(_slug(e.target.value))}
                    placeholder="auto from title"
                    className="flex-1 px-3 py-2 text-sm font-mono dark:bg-gray-900 focus:outline-none"
                  />
                </div>
              </label>
            )}

            <div className="text-[11px] text-gray-500">
              Visitors will reach this page at:&nbsp;
              <span className="font-mono font-black text-[#800000] dark:text-rose-300">{finalPath || '/'}</span>
            </div>
          </div>

          {/* OPTIONAL: intro + status */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-4">
            <label className="block text-xs">
              <span className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1">
                4. Intro paragraph <span className="text-gray-400 font-normal">(optional, Markdown)</span>
              </span>
              <textarea
                rows={4}
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="A short hero paragraph shown at the top of the new page."
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]"
              />
            </label>

            <label className="block text-xs">
              <span className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1">
                5. Status on creation
              </span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]"
              >
                <option value="published">Published — visitors see it immediately</option>
                <option value="draft">Draft — hidden until you publish from the editor</option>
              </select>
            </label>
          </div>

          {ok && <div className="text-xs bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-lg flex items-center gap-2"><CheckCircle2 size={14} /> {ok} — opening editor…</div>}
          {err && <div className="text-xs bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">{err}</div>}

          <div className="flex items-center gap-3">
            <button
              disabled={busy || !title.trim() || (section !== 'custom' && !slug.trim())}
              className="bg-[#800000] text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-40"
            >
              <Rocket size={14} /> {busy ? 'Creating…' : 'Create Page'}
            </button>
            <Link to="/admin/pages" className="text-xs text-gray-500 hover:text-[#800000]">
              ← Back to all pages
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

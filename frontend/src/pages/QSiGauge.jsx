import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Image as ImageIcon, FileSpreadsheet, Video,
  Folder, ChevronDown, ChevronRight, Search, ExternalLink,
  ShieldCheck, ArrowLeft,
} from 'lucide-react';
import { QSI_GAUGE_BASE, QSI_DRIVE_ROOT, QSI_CATEGORIES } from '../data/qsiGaugeManifest';

const PDF_EXT = new Set(['pdf']);
const IMG_EXT = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp']);
const SHEET_EXT = new Set(['xlsx', 'xls', 'csv']);
const DOC_EXT = new Set(['doc', 'docx']);
const VIDEO_EXT = new Set(['mp4', 'mov', 'webm']);

function getExt(name) {
  const i = name.lastIndexOf('.');
  return i < 0 ? '' : name.slice(i + 1).toLowerCase();
}

function FileIcon({ name }) {
  const ext = getExt(name);
  const cls = 'shrink-0';
  if (PDF_EXT.has(ext))  return <FileText size={16} className={`${cls} text-rose-700`} />;
  if (IMG_EXT.has(ext))  return <ImageIcon size={16} className={`${cls} text-emerald-700`} />;
  if (SHEET_EXT.has(ext)) return <FileSpreadsheet size={16} className={`${cls} text-green-700`} />;
  if (DOC_EXT.has(ext))  return <FileText size={16} className={`${cls} text-blue-700`} />;
  if (VIDEO_EXT.has(ext)) return <Video size={16} className={`${cls} text-purple-700`} />;
  return <FileText size={16} className={`${cls} text-gray-500`} />;
}

function fileHref(slug, name) {
  return `${QSI_GAUGE_BASE}/${slug}/${encodeURIComponent(name)}`;
}

function driveHref(id) {
  return `https://drive.google.com/drive/folders/${id}`;
}

function CategoryCard({ category, query }) {
  const [open, setOpen] = useState(false);
  const q = query.trim().toLowerCase();
  const matches = (s) => !q || s.toLowerCase().includes(q);

  const visibleFiles = useMemo(
    () => category.files.filter(matches),
    [category.files, q]
  );
  const visibleSubs = useMemo(
    () => category.subfolders.filter(matches),
    [category.subfolders, q]
  );

  const total = category.files.length + category.subfolders.length;
  const hasMatch = !q || visibleFiles.length || visibleSubs.length || matches(category.label);
  if (!hasMatch) return null;

  const forceOpen = !!q && (visibleFiles.length + visibleSubs.length > 0);
  const expanded = open || forceOpen;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-[#800000] text-white flex items-center justify-center shrink-0">
            <Folder size={16} />
          </div>
          <div className="min-w-0">
            <p className="font-black text-[#3e0202] text-sm sm:text-base truncate">
              {category.label}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {category.pending
                ? 'Pending upload — view on Google Drive'
                : `${category.files.length} file${category.files.length === 1 ? '' : 's'}${category.subfolders.length ? ` · ${category.subfolders.length} subfolder${category.subfolders.length === 1 ? '' : 's'}` : ''}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {total} item{total === 1 ? '' : 's'}
          </span>
          {expanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          {category.pending && (
            <a
              href={driveHref(category.driveId)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#3e0202] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#5a0303] transition"
            >
              <ExternalLink size={13} />
              Browse on Google Drive
            </a>
          )}

          {visibleFiles.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                Documents
              </p>
              <ul className="grid gap-1">
                {visibleFiles.map((name) => (
                  <li key={name}>
                    <a
                      href={fileHref(category.slug, name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50/60 text-sm text-gray-700 hover:text-[#800000] transition group"
                    >
                      <FileIcon name={name} />
                      <span className="flex-1 truncate">{name}</span>
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-gray-400 transition" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {visibleSubs.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                Subfolders
              </p>
              <ul className="grid gap-1">
                {visibleSubs.map((name) => (
                  <li key={name}>
                    <a
                      href={driveHref(category.driveId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open in Google Drive"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-50/60 text-sm text-gray-700 hover:text-amber-900 transition group"
                    >
                      <Folder size={16} className="shrink-0 text-amber-600" />
                      <span className="flex-1 truncate">{name}</span>
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-gray-400 transition" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!category.pending && visibleFiles.length === 0 && visibleSubs.length === 0 && (
            <p className="text-xs text-gray-400 italic">No matches in this section.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function QSiGauge() {
  const [query, setQuery] = useState('');

  const totals = useMemo(() => {
    let files = 0;
    let subs = 0;
    QSI_CATEGORIES.forEach((c) => {
      files += c.files.length;
      subs += c.subfolders.length;
    });
    return { files, subs };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0606] via-[#3e0202] to-[#800000] py-10 px-4">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/images/ITMGOILogo.png" alt="ITM Logo" className="h-12 mx-auto mb-3 drop-shadow-lg" />
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-100 text-[10px] font-bold uppercase tracking-widest mb-3">
            <ShieldCheck size={12} />
            Internal · QS i-gauge 2025-26
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            QS i-gauge Submission Repository
          </h1>
          <p className="text-rose-200/70 text-sm mt-2 max-w-2xl mx-auto">
            Internal evidence library. Not indexed, not linked from the public site. {totals.files} documents across {QSI_CATEGORIES.length} criteria.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-6 mb-6">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all submissions…"
              className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 transition"
            />
          </div>
        </div>

        <div className="space-y-3">
          {QSI_CATEGORIES.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} query={query} />
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-rose-200/50 text-xs">
          <Link to="/" className="inline-flex items-center gap-1.5 hover:text-rose-100 transition">
            <ArrowLeft size={13} /> Back to website
          </Link>
          <a
            href={QSI_DRIVE_ROOT}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-rose-100 transition"
          >
            Source folder on Google Drive <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Plus, Save, Trash2, X } from 'lucide-react';
import { clubsApi, eventsApi, noticesApi, announcementsApi } from '../../api/events';
import { errorMessage } from '../../api/client';

const TABS = [
  { key: 'events', label: 'Events' },
  { key: 'clubs', label: 'Clubs & Cells' },
  { key: 'notices', label: 'Notices' },
  { key: 'announcements', label: 'Announcements' },
];

const SCHEMAS = {
  events: {
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'club_id', label: 'Club ID', type: 'number' },
      { key: 'event_date', label: 'Date (YYYY-MM-DD)' },
      { key: 'event_end_date', label: 'End date (optional)' },
      { key: 'location', label: 'Location' },
      { key: 'type', label: 'Type' },
      { key: 'status', label: 'Status (upcoming/past)' },
      { key: 'banner_url', label: 'Banner URL' },
      { key: 'registration_url', label: 'Registration URL' },
      { key: 'description_md', label: 'Description', textarea: true, rows: 2 },
    ],
    defaults: { title: '', club_id: null, event_date: null, event_end_date: null, location: '', type: '', status: 'upcoming', banner_url: '', registration_url: '', description_md: '', is_featured: false, sort_order: 0 },
  },
  clubs: {
    columns: [
      { key: 'code', label: 'Code (PAC, NSS, …)' },
      { key: 'name', label: 'Name' },
      { key: 'type', label: 'Type (club/cell)' },
      { key: 'icon', label: 'Icon (emoji)' },
      { key: 'accent', label: 'Accent' },
      { key: 'page_path', label: 'Page path' },
      { key: 'scope_key', label: 'Scope key' },
      { key: 'contact_email', label: 'Contact email' },
      { key: 'contact_phone', label: 'Contact phone' },
      { key: 'description', label: 'Description', textarea: true, rows: 2 },
    ],
    defaults: { code: '', name: '', type: 'club', icon: '', accent: '', page_path: '', scope_key: '', contact_email: '', contact_phone: '', description: '', tags: [] },
  },
  notices: {
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'priority', label: 'Priority (low/normal/high/urgent)' },
      { key: 'published_at', label: 'Published at (ISO)' },
      { key: 'expires_on', label: 'Expires on (YYYY-MM-DD)' },
      { key: 'pdf_url', label: 'PDF URL' },
      { key: 'body_md', label: 'Body', textarea: true, rows: 3 },
    ],
    defaults: { title: '', body_md: '', pdf_url: '', audience: ['all'], priority: 'normal', published_at: null, expires_on: null, is_active: true, sort_order: 0 },
  },
  announcements: {
    columns: [
      { key: 'message', label: 'Message' },
      { key: 'link', label: 'Link' },
      { key: 'level', label: 'Level (info/success/warning/critical)' },
      { key: 'starts_on', label: 'Starts (ISO)' },
      { key: 'ends_on', label: 'Ends (ISO)' },
    ],
    defaults: { message: '', link: '', starts_on: null, ends_on: null, level: 'info', is_active: true, sort_order: 0 },
  },
};

const API_BY_TAB = {
  events: eventsApi,
  notices: noticesApi,
  announcements: announcementsApi,
};

function Field({ label, value, onChange, type = 'text', textarea, rows = 3 }) {
  const Cls = "w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]";
  return (
    <label className="block text-xs">
      <span className="block font-bold text-gray-500 mb-1">{label}</span>
      {textarea
        ? <textarea rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={Cls} />
        : <input type={type} value={value ?? ''} onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value)} className={Cls} />}
    </label>
  );
}

function GenericTab({ kind, apiNs, idField = 'id' }) {
  const qc = useQueryClient();
  const schema = SCHEMAS[kind];
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['admin-events-mod', kind],
    queryFn: () => apiNs.list(),
  });
  const [draft, setDraft] = useState(schema.defaults);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');

  const reload = () => {
    qc.invalidateQueries({ queryKey: ['admin-events-mod', kind] });
    qc.invalidateQueries({ queryKey: ['public-events'] });
    qc.invalidateQueries({ queryKey: ['public-notices'] });
    qc.invalidateQueries({ queryKey: ['public-clubs'] });
    qc.invalidateQueries({ queryKey: ['public-announcements'] });
  };

  const add = async (e) => {
    e.preventDefault();
    setErr('');
    try { await apiNs.create(draft); setDraft(schema.defaults); reload(); }
    catch (e2) { setErr(errorMessage(e2)); }
  };

  const save = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const { [idField]: id, ...rest } = editing;
      await apiNs.update(id, rest);
      setEditing(null); reload();
    } catch (e2) { setErr(errorMessage(e2)); }
  };

  const remove = async (it) => {
    if (!confirm('Delete this item?')) return;
    await apiNs.delete(it[idField]); reload();
  };

  return (
    <div className="space-y-3">
      {error && <div className="text-xs text-red-600">{errorMessage(error)}</div>}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-[10px] uppercase tracking-widest text-gray-500">
            <tr>
              {schema.columns.map((c) => <th key={c.key} className="text-left px-3 py-2">{c.label}</th>)}
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading && <tr><td colSpan={schema.columns.length + 1} className="text-center py-6 text-gray-400 text-xs">Loading…</td></tr>}
            {!isLoading && items.length === 0 && <tr><td colSpan={schema.columns.length + 1} className="text-center py-6 text-gray-400 text-xs">No items yet.</td></tr>}
            {items.map((it) => (
              <tr key={it[idField]}>
                {schema.columns.map((c) => (
                  <td key={c.key} className="px-3 py-2 text-xs text-gray-700 dark:text-gray-300 truncate max-w-[16ch]">
                    {String(it[c.key] ?? '')}
                  </td>
                ))}
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(it)} className="text-xs text-[#800000] font-semibold mr-2">edit</button>
                  <button onClick={() => remove(it)} className="text-xs text-gray-400 hover:text-red-600">
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {err && <div className="text-xs text-red-600">{err}</div>}

      <details open className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
        <summary className="cursor-pointer font-bold text-xs uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
          <Plus size={12} /> Add new
        </summary>
        <form onSubmit={add} className="mt-3 grid sm:grid-cols-2 gap-3">
          {schema.columns.map((c) => (
            <Field key={c.key} label={c.label} type={c.type} textarea={c.textarea} rows={c.rows} value={draft[c.key]} onChange={(v) => setDraft({ ...draft, [c.key]: v })} />
          ))}
          <div className="sm:col-span-2">
            <button className="bg-[#800000] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
              <Plus size={12} /> Add
            </button>
          </div>
        </form>
      </details>

      {editing && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <form onSubmit={save} className="relative ml-auto w-full max-w-md bg-white dark:bg-gray-900 h-full overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-base text-gray-900 dark:text-white">Edit</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={16} />
              </button>
            </div>
            <div className="grid gap-3">
              {schema.columns.map((c) => (
                <Field key={c.key} label={c.label} type={c.type} textarea={c.textarea} rows={c.rows} value={editing[c.key]} onChange={(v) => setEditing({ ...editing, [c.key]: v })} />
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button className="bg-[#800000] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                <Save size={12} /> Save
              </button>
              <button type="button" onClick={() => setEditing(null)} className="text-xs px-3 py-1.5 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// Clubs uses `code` as identifier instead of `id`
function ClubsTab() {
  const qc = useQueryClient();
  const schema = SCHEMAS.clubs;
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['admin-clubs'],
    queryFn: () => clubsApi.list(),
  });
  const [draft, setDraft] = useState(schema.defaults);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');

  const reload = () => qc.invalidateQueries({ queryKey: ['admin-clubs'] });
  const add = async (e) => {
    e.preventDefault(); setErr('');
    try { await clubsApi.create(draft); setDraft(schema.defaults); reload(); }
    catch (e2) { setErr(errorMessage(e2)); }
  };
  const save = async (e) => {
    e.preventDefault(); setErr('');
    try { const { code, ...rest } = editing; await clubsApi.update(code, rest); setEditing(null); reload(); }
    catch (e2) { setErr(errorMessage(e2)); }
  };
  const remove = async (it) => { if (!confirm(`Delete ${it.code}?`)) return; await clubsApi.delete(it.code); reload(); };

  return (
    <div className="space-y-3">
      {error && <div className="text-xs text-red-600">{errorMessage(error)}</div>}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-[10px] uppercase tracking-widest text-gray-500">
            <tr>
              {schema.columns.map((c) => <th key={c.key} className="text-left px-3 py-2">{c.label}</th>)}
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading && <tr><td colSpan={schema.columns.length + 1} className="text-center py-6 text-gray-400 text-xs">Loading…</td></tr>}
            {!isLoading && items.length === 0 && <tr><td colSpan={schema.columns.length + 1} className="text-center py-6 text-gray-400 text-xs">No clubs.</td></tr>}
            {items.map((it) => (
              <tr key={it.code}>
                {schema.columns.map((c) => (
                  <td key={c.key} className="px-3 py-2 text-xs text-gray-700 dark:text-gray-300 truncate max-w-[16ch]">{String(it[c.key] ?? '')}</td>
                ))}
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(it)} className="text-xs text-[#800000] font-semibold mr-2">edit</button>
                  <button onClick={() => remove(it)} className="text-xs text-gray-400 hover:text-red-600"><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {err && <div className="text-xs text-red-600">{err}</div>}
      <details open className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
        <summary className="cursor-pointer font-bold text-xs uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
          <Plus size={12} /> Add club / cell
        </summary>
        <form onSubmit={add} className="mt-3 grid sm:grid-cols-2 gap-3">
          {schema.columns.map((c) => (
            <Field key={c.key} label={c.label} textarea={c.textarea} rows={c.rows} value={draft[c.key]} onChange={(v) => setDraft({ ...draft, [c.key]: v })} />
          ))}
          <div className="sm:col-span-2">
            <button className="bg-[#800000] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
              <Plus size={12} /> Add
            </button>
          </div>
        </form>
      </details>
      {editing && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <form onSubmit={save} className="relative ml-auto w-full max-w-md bg-white dark:bg-gray-900 h-full overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-base text-gray-900 dark:text-white">Edit {editing.code}</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={16} />
              </button>
            </div>
            <div className="grid gap-3">
              {schema.columns.filter((c) => c.key !== 'code').map((c) => (
                <Field key={c.key} label={c.label} textarea={c.textarea} rows={c.rows} value={editing[c.key]} onChange={(v) => setEditing({ ...editing, [c.key]: v })} />
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button className="bg-[#800000] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                <Save size={12} /> Save
              </button>
              <button type="button" onClick={() => setEditing(null)} className="text-xs px-3 py-1.5 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function AdminEvents() {
  const [tab, setTab] = useState('events');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar size={20} /> Events · Clubs · Notices
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Events auto-scope to the club's own editor (events.pac / clubs.nss / etc.). Notices &amp; announcements require <code className="font-mono">notices</code>.
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded ${tab === t.key ? 'bg-[#800000] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'clubs' ? <ClubsTab /> : <GenericTab kind={tab} apiNs={API_BY_TAB[tab]} />}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, FlaskConical, Plus, Save, Trash2, X } from 'lucide-react';
import { researchApi } from '../../api/research';
import { errorMessage } from '../../api/client';

const TABS = [
  { key: 'focusAreas', label: 'Focus Areas' },
  { key: 'publications', label: 'Publications' },
  { key: 'books', label: 'Books' },
  { key: 'patents', label: 'Patents' },
  { key: 'journal', label: 'Journal' },
  { key: 'conferences', label: 'Conferences' },
  { key: 'fdps', label: 'FDPs' },
  { key: 'policies', label: 'Policies' },
];

const SCHEMAS = {
  focusAreas: {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'icon', label: 'Icon (emoji)' },
      { key: 'description', label: 'Description', textarea: true, rows: 2 },
      { key: 'sort_order', label: 'Sort', type: 'number' },
    ],
    defaults: { name: '', icon: '', description: '', departments: [], sort_order: 0 },
  },
  publications: {
    columns: [
      { key: 'year', label: 'Year (e.g. 2024-25)' },
      { key: 'count_label', label: 'Count (e.g. 60+)' },
      { key: 'pdf_url', label: 'PDF URL' },
      { key: 'department_code', label: 'Dept code (blank = institute)' },
      { key: 'summary', label: 'Summary', textarea: true, rows: 2 },
    ],
    defaults: { year: '', count_label: '', pdf_url: '', department_code: '', summary: '', sort_order: 0 },
  },
  books: {
    columns: [
      { key: 'year', label: 'Year' },
      { key: 'title', label: 'Title' },
      { key: 'pdf_url', label: 'PDF URL' },
    ],
    defaults: { year: '', title: '', pdf_url: '', contributors: [], sort_order: 0 },
  },
  patents: {
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'patent_no', label: 'Patent No.' },
      { key: 'status', label: 'Status (filed/granted)' },
      { key: 'department_code', label: 'Dept code' },
      { key: 'filed_on', label: 'Filed on (YYYY-MM-DD)' },
      { key: 'granted_on', label: 'Granted on (YYYY-MM-DD)' },
      { key: 'pdf_url', label: 'PDF URL' },
    ],
    defaults: { title: '', inventors: [], filed_on: null, granted_on: null, patent_no: '', status: 'filed', department_code: '', pdf_url: '', sort_order: 0 },
  },
  journal: {
    columns: [
      { key: 'volume', label: 'Volume' },
      { key: 'issue', label: 'Issue' },
      { key: 'year', label: 'Year', type: 'number' },
      { key: 'theme', label: 'Theme' },
      { key: 'cover_url', label: 'Cover URL' },
      { key: 'pdf_url', label: 'PDF URL' },
    ],
    defaults: { volume: '', issue: '', year: new Date().getFullYear(), theme: '', cover_url: '', pdf_url: '', is_published: true, sort_order: 0 },
  },
  conferences: {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'short_name', label: 'Short name' },
      { key: 'year', label: 'Year', type: 'number' },
      { key: 'location', label: 'Location' },
      { key: 'theme', label: 'Theme', textarea: true, rows: 2 },
      { key: 'status', label: 'Status (upcoming/past)' },
      { key: 'brochure_url', label: 'Brochure URL' },
      { key: 'proceedings_url', label: 'Proceedings URL' },
    ],
    defaults: { name: '', short_name: '', year: new Date().getFullYear(), location: '', theme: '', description: '', status: 'upcoming', brochure_url: '', proceedings_url: '', sort_order: 0 },
  },
  fdps: {
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'mode', label: 'Mode (online/offline/hybrid)' },
      { key: 'start_date', label: 'Start (YYYY-MM-DD)' },
      { key: 'end_date', label: 'End (YYYY-MM-DD)' },
      { key: 'status', label: 'Status' },
      { key: 'brochure_url', label: 'Brochure URL' },
    ],
    defaults: { title: '', mode: 'offline', start_date: null, end_date: null, description: '', status: 'upcoming', brochure_url: '', sort_order: 0 },
  },
  policies: {
    columns: [
      { key: 'owner', label: 'Owner (research/compliance/institute)' },
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description', textarea: true, rows: 2 },
      { key: 'icon', label: 'Icon (lucide name)' },
      { key: 'pdf_url', label: 'PDF URL' },
    ],
    defaults: { owner: 'research', title: '', description: '', icon: 'FileText', pdf_url: '', version: '', sort_order: 0 },
  },
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

function ResourceTab({ kind, apiNs }) {
  const qc = useQueryClient();
  const schema = SCHEMAS[kind];
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['admin-research', kind],
    queryFn: () => apiNs.list(),
  });
  const [draft, setDraft] = useState(schema.defaults);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');

  const reload = () => {
    qc.invalidateQueries({ queryKey: ['admin-research', kind] });
    qc.invalidateQueries({ queryKey: ['public-research-rdcell'] });
    qc.invalidateQueries({ queryKey: ['public-research-journal'] });
    qc.invalidateQueries({ queryKey: ['public-research-conferences'] });
    qc.invalidateQueries({ queryKey: ['public-research-fdps'] });
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
    try { const { id, ...rest } = editing; await apiNs.update(id, rest); setEditing(null); reload(); }
    catch (e2) { setErr(errorMessage(e2)); }
  };

  const remove = async (it) => {
    if (!confirm('Delete this item?')) return;
    await apiNs.delete(it.id); reload();
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
              <tr key={it.id}>
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

export default function AdminResearch() {
  const [tab, setTab] = useState('focusAreas');
  const apiNs = researchApi[tab];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <FlaskConical size={20} /> Research Suite
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Sub-scopes: <code className="font-mono">research.rdcell</code> · <code className="font-mono">research.publications</code> · <code className="font-mono">research.journal</code> · <code className="font-mono">research.conference</code> · <code className="font-mono">research.fdp</code>
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

        <ResourceTab kind={tab} apiNs={apiNs} />
      </div>
    </div>
  );
}

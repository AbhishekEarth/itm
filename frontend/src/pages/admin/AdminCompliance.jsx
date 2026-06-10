import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ShieldCheck, Plus, Save, Trash2, X } from 'lucide-react';
import { complianceApi, peopleApi, alumniApi } from '../../api/compliance';
import { researchApi } from '../../api/research';
import { errorMessage } from '../../api/client';

const TABS = [
  { key: 'naac', label: 'NAAC' },
  { key: 'nirf', label: 'NIRF' },
  { key: 'committees', label: 'Committees' },
  { key: 'policies', label: 'Policies' },
  { key: 'board', label: 'Board' },
  { key: 'officials', label: 'Officials' },
  { key: 'alumni', label: 'Alumni' },
  { key: 'chapters', label: 'Alumni Chapters' },
  { key: 'mentorships', label: 'Mentorships' },
];

const SCHEMAS = {
  naac: {
    columns: [
      { key: 'cycle', label: 'Cycle (e.g. Cycle 2)' },
      { key: 'criterion', label: 'Criterion (e.g. 1.1)' },
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description', textarea: true, rows: 2 },
      { key: 'year', label: 'Year', type: 'number' },
      { key: 'pdf_url', label: 'PDF URL' },
    ],
    defaults: { cycle: 'Cycle 2', criterion: '', title: '', description: '', pdf_url: '', year: null, sort_order: 0 },
  },
  nirf: {
    columns: [
      { key: 'year', label: 'Year', type: 'number' },
      { key: 'category', label: 'Category (Engineering/Management/…)' },
      { key: 'rank', label: 'Rank', type: 'number' },
      { key: 'rank_band', label: 'Band (e.g. 201-300)' },
      { key: 'total_score', label: 'Total score', type: 'number' },
      { key: 'document_url', label: 'Document URL' },
    ],
    defaults: { year: new Date().getFullYear(), category: 'Engineering', rank: null, rank_band: '', total_score: null, document_url: '', sort_order: 0 },
  },
  committees: {
    columns: [
      { key: 'committee', label: 'Committee' },
      { key: 'member_name', label: 'Member' },
      { key: 'role', label: 'Role' },
      { key: 'contact', label: 'Contact' },
    ],
    defaults: { committee: '', member_name: '', role: '', contact: '', sort_order: 0 },
  },
  policies: {
    columns: [
      { key: 'owner', label: 'Owner (compliance/research/institute)' },
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description', textarea: true, rows: 2 },
      { key: 'icon', label: 'Icon (lucide name)' },
      { key: 'pdf_url', label: 'PDF URL' },
    ],
    defaults: { owner: 'compliance', title: '', description: '', icon: 'ShieldCheck', pdf_url: '', sort_order: 0 },
  },
  board: {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'organization', label: 'Organization' },
      { key: 'photo_url', label: 'Photo URL' },
    ],
    defaults: { name: '', role: '', organization: '', photo_url: '', bio_md: '', sort_order: 0, is_active: true },
  },
  officials: {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'department_code', label: 'Dept code' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'photo_url', label: 'Photo URL' },
    ],
    defaults: { name: '', role: '', department_code: '', email: '', phone: '', photo_url: '', bio_md: '', sort_order: 0, is_active: true },
  },
  alumni: {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'batch_year', label: 'Batch', type: 'number' },
      { key: 'programme_code', label: 'Programme' },
      { key: 'current_role', label: 'Current role' },
      { key: 'company', label: 'Company' },
      { key: 'location', label: 'Location' },
      { key: 'linkedin', label: 'LinkedIn' },
      { key: 'is_featured', label: 'Featured?', type: 'checkbox' },
    ],
    defaults: { name: '', batch_year: null, programme_code: '', current_role: '', company: '', location: '', linkedin: '', quote: '', photo_url: '', is_featured: true, sort_order: 0 },
  },
  chapters: {
    columns: [
      { key: 'city', label: 'City' },
      { key: 'country', label: 'Country' },
      { key: 'coordinator', label: 'Coordinator' },
      { key: 'members_count', label: 'Members', type: 'number' },
      { key: 'contact_email', label: 'Email' },
      { key: 'contact_phone', label: 'Phone' },
    ],
    defaults: { city: '', country: 'India', coordinator: '', members_count: null, contact_email: '', contact_phone: '', notes: '', sort_order: 0 },
  },
  mentorships: {
    columns: [
      { key: 'name', label: 'Programme name' },
      { key: 'focus_area', label: 'Focus area' },
      { key: 'slots', label: 'Slots', type: 'number' },
      { key: 'is_open', label: 'Open?', type: 'checkbox' },
      { key: 'description_md', label: 'Description', textarea: true, rows: 2 },
    ],
    defaults: { name: '', focus_area: '', description_md: '', slots: null, is_open: true, mentor_alumni_id: null, sort_order: 0 },
  },
};

const API_BY_TAB = {
  naac: complianceApi.naacDocs,
  nirf: complianceApi.nirf,
  committees: complianceApi.committees,
  policies: researchApi.policies,
  board: peopleApi.board,
  officials: peopleApi.officials,
  alumni: alumniApi.profiles,
  chapters: alumniApi.chapters,
  mentorships: alumniApi.mentorships,
};

function Field({ label, value, onChange, type = 'text', textarea, rows = 3 }) {
  const Cls = "w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]";
  if (type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
    );
  }
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
    queryKey: ['admin-compliance', kind],
    queryFn: () => apiNs.list(),
  });
  const [draft, setDraft] = useState(schema.defaults);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');

  const reload = () => {
    qc.invalidateQueries({ queryKey: ['admin-compliance', kind] });
    qc.invalidateQueries({ queryKey: ['public-compliance'] });
    qc.invalidateQueries({ queryKey: ['public-alumni'] });
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
                    {c.type === 'checkbox' ? (it[c.key] ? '✓' : '') : String(it[c.key] ?? '')}
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

export default function AdminCompliance() {
  const [tab, setTab] = useState('naac');
  const apiNs = API_BY_TAB[tab];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={20} /> Compliance · Alumni · About
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Scopes: <code className="font-mono">compliance.naac</code> / <code className="font-mono">.nirf</code> / <code className="font-mono">.committees</code> · <code className="font-mono">alumni.speaks</code> / <code className="font-mono">.chapters</code> / <code className="font-mono">.mentorship</code> · <code className="font-mono">site.settings</code> for Board &amp; Officials.
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

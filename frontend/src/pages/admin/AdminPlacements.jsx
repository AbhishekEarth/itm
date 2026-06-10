import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Briefcase, Plus, Save, Trash2, X } from 'lucide-react';
import { placementsApi } from '../../api/placements';
import { errorMessage } from '../../api/client';

const TABS = [
  { key: 'recruiters', label: 'Recruiters' },
  { key: 'categories', label: 'Categories' },
  { key: 'records', label: 'Records' },
  { key: 'stats', label: 'Stats' },
  { key: 'team', label: 'TAP Team' },
  { key: 'services', label: 'TAP Services' },
  { key: 'mous', label: 'MoUs' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'events', label: 'Events' },
];

const SCHEMAS = {
  recruiters: {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'category_id', label: 'Category ID', type: 'number' },
      { key: 'tier', label: 'Tier (top/standard/partner)' },
      { key: 'logo_url', label: 'Logo URL' },
      { key: 'website', label: 'Website' },
      { key: 'sort_order', label: 'Sort', type: 'number' },
    ],
    defaults: { name: '', category_id: null, tier: 'standard', logo_url: '', website: '', sort_order: 0, is_active: true },
    rowLabel: (r) => r.name,
  },
  categories: {
    columns: [
      { key: 'key', label: 'Key' },
      { key: 'name', label: 'Name' },
      { key: 'sort_order', label: 'Sort', type: 'number' },
    ],
    defaults: { key: '', name: '', sort_order: 0 },
    rowLabel: (r) => r.name,
  },
  records: {
    columns: [
      { key: 'student_name', label: 'Student' },
      { key: 'department_code', label: 'Dept code' },
      { key: 'batch_year', label: 'Batch', type: 'number' },
      { key: 'company', label: 'Company' },
      { key: 'role', label: 'Role' },
      { key: 'package_lpa', label: 'LPA', type: 'number' },
      { key: 'is_featured', label: 'Featured?', type: 'checkbox' },
    ],
    defaults: { student_name: '', department_code: '', batch_year: null, company: '', role: '', package_lpa: null, is_featured: false, sort_order: 0 },
    rowLabel: (r) => `${r.student_name} → ${r.company}`,
  },
  stats: {
    columns: [
      { key: 'department_code', label: 'Dept (blank = institute-wide)' },
      { key: 'batch_year', label: 'Batch year', type: 'number' },
      { key: 'highest_lpa', label: 'Highest LPA', type: 'number' },
      { key: 'average_lpa', label: 'Average LPA', type: 'number' },
      { key: 'placement_rate_pct', label: 'Placement %', type: 'number' },
      { key: 'offers_count', label: 'Offers', type: 'number' },
      { key: 'recruiters_count', label: 'Recruiters', type: 'number' },
    ],
    defaults: { department_code: '', batch_year: new Date().getFullYear(), highest_lpa: null, average_lpa: null, placement_rate_pct: null, offers_count: null, recruiters_count: null, notes: '' },
    rowLabel: (r) => `${r.department_code || 'INST'} ${r.batch_year}`,
  },
  team: {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'initials', label: 'Initials' },
      { key: 'photo_url', label: 'Photo URL' },
      { key: 'sort_order', label: 'Sort', type: 'number' },
    ],
    defaults: { name: '', role: '', email: '', phone: '', initials: '', accent: 'from-rose-500 to-[#800000]', photo_url: '', sort_order: 0 },
    rowLabel: (r) => r.name,
  },
  services: {
    columns: [
      { key: 'icon', label: 'Icon (lucide name)' },
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description', textarea: true, rows: 2 },
      { key: 'accent', label: 'Accent' },
      { key: 'sort_order', label: 'Sort', type: 'number' },
    ],
    defaults: { icon: 'Briefcase', title: '', description: '', accent: 'from-rose-500 to-[#800000]', bg_class: '', text_class: '', sort_order: 0 },
    rowLabel: (r) => r.title,
  },
  mous: {
    columns: [
      { key: 'partner_name', label: 'Partner name' },
      { key: 'description', label: 'Description', textarea: true, rows: 2 },
      { key: 'logo_url', label: 'Logo URL' },
      { key: 'document_label', label: 'Doc label (e.g. MoU 2024)' },
      { key: 'document_url', label: 'Doc URL or upload via Media' },
      { key: 'sort_order', label: 'Sort', type: 'number' },
    ],
    defaults: { owner: 'tap', partner_name: '', description: '', logo: '', logo_url: '', tags: [], document_url: '', document_label: '', sort_order: 0 },
    rowLabel: (r) => r.partner_name,
  },
  testimonials: {
    columns: [
      { key: 'name', label: 'Speaker' },
      { key: 'role', label: 'Role' },
      { key: 'quote', label: 'Quote', textarea: true, rows: 3 },
      { key: 'initials', label: 'Initials' },
      { key: 'accent', label: 'Accent' },
      { key: 'sort_order', label: 'Sort', type: 'number' },
    ],
    defaults: { name: '', role: '', quote: '', initials: '', accent: 'from-rose-500 to-[#800000]', sort_order: 0 },
    rowLabel: (r) => r.name,
  },
  events: {
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description', textarea: true, rows: 2 },
      { key: 'event_date', label: 'Date (YYYY-MM-DD)' },
      { key: 'image_url', label: 'Image URL' },
      { key: 'status', label: 'Status (upcoming/past)' },
      { key: 'icon', label: 'Icon' },
    ],
    defaults: { title: '', description: '', event_date: null, image_url: '', icon: '', type: '', status: 'upcoming', sort_order: 0 },
    rowLabel: (r) => r.title,
  },
};

function Field({ label, value, onChange, type = 'text', textarea, rows = 3, ...rest }) {
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
        ? <textarea rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={Cls} {...rest} />
        : <input type={type} value={value ?? ''} onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value)} className={Cls} {...rest} />}
    </label>
  );
}

function ResourceTab({ kind, apiNs }) {
  const qc = useQueryClient();
  const schema = SCHEMAS[kind];
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['admin-placements', kind],
    queryFn: () => apiNs.list(),
  });
  const [draft, setDraft] = useState(schema.defaults);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');

  const reload = () => {
    qc.invalidateQueries({ queryKey: ['admin-placements', kind] });
    qc.invalidateQueries({ queryKey: ['public-tap'] });
    qc.invalidateQueries({ queryKey: ['public-recruiters'] });
  };

  const add = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await apiNs.create(draft);
      setDraft(schema.defaults);
      reload();
    } catch (e2) { setErr(errorMessage(e2)); }
  };

  const save = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const { id, ...rest } = editing;
      await apiNs.update(id, rest);
      setEditing(null);
      reload();
    } catch (e2) { setErr(errorMessage(e2)); }
  };

  const remove = async (it) => {
    if (!confirm(`Delete "${schema.rowLabel(it)}"?`)) return;
    await apiNs.delete(it.id);
    reload();
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
            <Field
              key={c.key}
              label={c.label}
              type={c.type}
              textarea={c.textarea}
              rows={c.rows}
              value={draft[c.key]}
              onChange={(v) => setDraft({ ...draft, [c.key]: v })}
            />
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
                <Field
                  key={c.key}
                  label={c.label}
                  type={c.type}
                  textarea={c.textarea}
                  rows={c.rows}
                  value={editing[c.key]}
                  onChange={(v) => setEditing({ ...editing, [c.key]: v })}
                />
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

export default function AdminPlacements() {
  const [tab, setTab] = useState('recruiters');
  const apiNs = placementsApi[tab];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase size={20} /> TAP / Placements
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Requires <code className="font-mono">placements.tap</code> scope. Changes immediately reflect on the home recruiter marquee and /tap.
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

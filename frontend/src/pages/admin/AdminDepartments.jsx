import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Building2, Plus, Save, Trash2, X, ImagePlus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { departmentsApi } from '../../api/departments';
import { errorMessage } from '../../api/client';
import MediaPicker, { MediaThumb } from '../../components/admin/MediaPicker';

const SUBTABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'hod', label: 'HoD Profile' },
  { key: 'faculty', label: 'Faculty' },
  { key: 'labs', label: 'Labs' },
  { key: 'partners', label: 'Partners' },
  { key: 'projects', label: 'Projects' },
  { key: 'awards', label: 'Awards' },
];

function Field({ label, value, onChange, type = 'text', textarea, rows = 3, ...rest }) {
  const Cls = "w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]";
  return (
    <label className="block text-xs">
      <span className="block font-bold text-gray-500 mb-1">{label}</span>
      {textarea
        ? <textarea rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={Cls} {...rest} />
        : <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={Cls} {...rest} />}
    </label>
  );
}

/**
 * Image picker — wraps the existing MediaPicker so the admin can upload OR
 * pick an existing asset for a single row field. Persists the media row's id
 * (e.g. `photo_id`) and shows a thumbnail of the live URL.
 *
 *   <ImageField label="Lab image" value={row.photo_id} preview={row.photo_url}
 *               onChange={(picked) => updateRow({ photo_id: picked?.id || null })} />
 */
function ImageField({ label, value, preview, onChange, folder = 'departments/labs' }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="block text-xs">
      <span className="block font-bold text-gray-500 mb-1">{label}</span>
      <div className="flex items-center gap-2">
        <MediaThumb
          media={preview ? { public_url: preview } : null}
          size="h-14 w-14"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1.5"
        >
          <ImagePlus size={12} /> {value ? 'Change' : 'Upload / pick'}
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600 flex items-center gap-1.5"
            title="Remove image"
          >
            <Trash2 size={12} /> Clear
          </button>
        ) : null}
        {value ? <span className="text-[10px] text-gray-400">#{value}</span> : null}
      </div>
      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        onPick={(picked) => onChange(picked)}
        folder={folder}
      />
    </div>
  );
}

function JsonField({ label, value, onChange }) {
  const [draft, setDraft] = useState(() => JSON.stringify(value ?? null, null, 2));
  const [err, setErr] = useState('');
  return (
    <label className="block text-xs">
      <span className="block font-bold text-gray-500 mb-1">{label} <span className="font-mono text-[10px] text-gray-400">(JSON)</span></span>
      <textarea
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          try { onChange(JSON.parse(e.target.value || 'null')); setErr(''); }
          catch (er) { setErr(er.message); }
        }}
        rows={Math.min(12, draft.split('\n').length + 1)}
        className="w-full px-3 py-2 text-xs font-mono border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]"
      />
      {err && <span className="text-[10px] text-red-600">{err}</span>}
    </label>
  );
}

// ── Overview tab ────────────────────────────────────────────────────
function OverviewTab({ dept, onSaved }) {
  const [form, setForm] = useState({
    name: dept.name ?? '',
    short_name: dept.short_name ?? '',
    page_path: dept.page_path ?? '',
    established_year: dept.established_year ?? '',
    intake: dept.intake ?? '',
    duration: dept.duration ?? '',
    affiliation: dept.affiliation ?? '',
    faculty_count: dept.faculty_count ?? '',
    icon: dept.icon ?? '',
    image_url: dept.image_url ?? '',
    badge: dept.badge ?? '',
    subtitle: dept.subtitle ?? '',
    intro_md: dept.intro_md ?? '',
    vision: dept.vision ?? '',
    mission: dept.mission ?? [],
    peos: dept.peos ?? [],
    psos: dept.psos ?? [],
    accreditations: dept.accreditations ?? [],
    chips: dept.chips ?? [],
    features: dept.features ?? [],
    hod_highlights: dept.hod_highlights ?? [],
    placement_payload: dept.placement_payload ?? {},
    contact: dept.contact ?? {},
    meta_title: dept.meta_title ?? '',
    meta_description: dept.meta_description ?? '',
    is_published: dept.is_published,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setErr(''); setOk(false); setSaving(true);
    try {
      const out = { ...form };
      ['established_year', 'intake', 'faculty_count'].forEach((k) => {
        out[k] = out[k] === '' ? null : Number(out[k]);
      });
      const u = await departmentsApi.update(dept.code, out);
      onSaved(u);
      setOk(true);
      setTimeout(() => setOk(false), 1500);
    } catch (e2) {
      setErr(errorMessage(e2));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Short name" value={form.short_name} onChange={(v) => setForm({ ...form, short_name: v })} />
        <Field label="Page path" value={form.page_path} onChange={(v) => setForm({ ...form, page_path: v })} />
        <Field label="Icon (emoji)" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} />
        <Field label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
        <Field label="Badge" value={form.badge} onChange={(v) => setForm({ ...form, badge: v })} />
        <Field label="Established year" type="number" value={form.established_year} onChange={(v) => setForm({ ...form, established_year: v })} />
        <Field label="Intake" type="number" value={form.intake} onChange={(v) => setForm({ ...form, intake: v })} />
        <Field label="Duration" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} />
        <Field label="Affiliation" value={form.affiliation} onChange={(v) => setForm({ ...form, affiliation: v })} />
        <Field label="Faculty count" type="number" value={form.faculty_count} onChange={(v) => setForm({ ...form, faculty_count: v })} />
      </div>

      <Field label="Subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} textarea rows={2} />
      <Field label="Intro" value={form.intro_md} onChange={(v) => setForm({ ...form, intro_md: v })} textarea rows={4} />
      <Field label="Vision" value={form.vision} onChange={(v) => setForm({ ...form, vision: v })} textarea rows={3} />

      <div className="grid sm:grid-cols-2 gap-3">
        <JsonField label="Mission (string[])" value={form.mission} onChange={(v) => setForm({ ...form, mission: v })} />
        <JsonField label="PEOs (string[])" value={form.peos} onChange={(v) => setForm({ ...form, peos: v })} />
        <JsonField label="PSOs (string[])" value={form.psos} onChange={(v) => setForm({ ...form, psos: v })} />
        <JsonField label="Accreditations (string[])" value={form.accreditations} onChange={(v) => setForm({ ...form, accreditations: v })} />
        <JsonField label="Chips ([[icon,label]])" value={form.chips} onChange={(v) => setForm({ ...form, chips: v })} />
        <JsonField label="Features ([{icon,title,sub}])" value={form.features} onChange={(v) => setForm({ ...form, features: v })} />
        <JsonField label="HoD highlights" value={form.hod_highlights} onChange={(v) => setForm({ ...form, hod_highlights: v })} />
        <JsonField label="Placement payload" value={form.placement_payload} onChange={(v) => setForm({ ...form, placement_payload: v })} />
        <JsonField label="Contact {phone,email}" value={form.contact} onChange={(v) => setForm({ ...form, contact: v })} />
      </div>

      <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mt-6">SEO</h4>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Meta title (≤70)" value={form.meta_title} onChange={(v) => setForm({ ...form, meta_title: v })} maxLength={70} />
        <Field label="Meta description (≤255)" value={form.meta_description} onChange={(v) => setForm({ ...form, meta_description: v })} textarea rows={2} maxLength={255} />
      </div>

      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
        Published
      </label>

      <div className="flex items-center gap-3">
        <button disabled={saving} className="bg-[#800000] text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg flex items-center gap-1.5">
          <Save size={14} /> {saving ? 'Saving…' : 'Save overview'}
        </button>
        {ok && <span className="text-xs text-emerald-600 font-semibold">Saved.</span>}
        {err && <span className="text-xs text-red-600 font-semibold">{err}</span>}
      </div>
    </form>
  );
}

// ── HoD tab ─────────────────────────────────────────────────────────
// Default profile photo used when no admin upload exists yet — same one
// rendered on the public-facing dept pages, so admin previews stay accurate.
// Inline SVG silhouette — no external network call.
const DEFAULT_HOD_PHOTO =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ccircle cx='100' cy='80' r='32' fill='%239ca3af'/%3E%3Cpath d='M 40 200 C 40 140 70 130 100 130 C 130 130 160 140 160 200 Z' fill='%239ca3af'/%3E%3C/svg%3E";

function HodTab({ dept, onSaved }) {
  const initial = dept.hod ?? {};
  const [form, setForm] = useState({
    name: initial.name ?? '',
    role: initial.role ?? '',
    qualification: initial.qualification ?? '',
    message_md: initial.message_md ?? '',
    phone: initial.phone ?? '',
    email: initial.email ?? '',
    photo_id: initial.photo_id ?? null,
    photo_url: initial.photo_url ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setErr(''); setOk(false); setSaving(true);
    try {
      // Don't send the response-only `photo_url` field back — the schema only
      // accepts `photo_id`. The resolver re-derives the URL on the next GET.
      const { photo_url, ...payload } = form;
      await departmentsApi.upsertHod(dept.code, payload);
      const refreshed = await departmentsApi.get(dept.code);
      onSaved(refreshed);
      setOk(true);
      setTimeout(() => setOk(false), 1500);
    } catch (e2) {
      setErr(errorMessage(e2));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-4 max-w-2xl">
      {/* Photo preview + upload — default placeholder until admin uploads one */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-rose-50/60 to-amber-50/40 dark:from-gray-800 dark:to-gray-800 border border-rose-100 dark:border-gray-700 rounded-2xl">
        <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-2 ring-white dark:ring-gray-700 shadow-md bg-gray-200">
          <img
            src={form.photo_url || DEFAULT_HOD_PHOTO}
            alt={form.name || 'HoD'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#800000] dark:text-rose-300 mb-1">
            HoD Photo
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            A default placeholder photo is shown until you upload one — change it any time.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#800000] text-white font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-[#5a0000]"
            >
              <ImagePlus size={12} /> {form.photo_id ? 'Change photo' : 'Upload photo'}
            </button>
            {form.photo_id ? (
              <button
                type="button"
                onClick={() => setForm({ ...form, photo_id: null, photo_url: '' })}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600 flex items-center gap-1.5"
              >
                <Trash2 size={12} /> Remove
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Role" value={form.role} onChange={(v) => setForm({ ...form, role: v })} />
        <Field label="Qualification" value={form.qualification} onChange={(v) => setForm({ ...form, qualification: v })} />
        <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
      </div>
      <Field label="HoD message" value={form.message_md} onChange={(v) => setForm({ ...form, message_md: v })} textarea rows={5} />

      <div className="flex items-center gap-3">
        <button disabled={saving} className="bg-[#800000] text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg flex items-center gap-1.5">
          <Save size={14} /> {saving ? 'Saving…' : 'Save HoD profile'}
        </button>
        {ok && <span className="text-xs text-emerald-600 font-semibold">Saved.</span>}
        {err && <span className="text-xs text-red-600 font-semibold">{err}</span>}
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        folder={`departments/${(dept.code || '').toLowerCase()}/hod`}
        onPick={(picked) => {
          setForm({ ...form, photo_id: picked.id, photo_url: picked.public_url });
          setPickerOpen(false);
        }}
      />
    </form>
  );
}

// ── Generic list tab ────────────────────────────────────────────────
function ListTab({ dept, kind, columns, defaults, apiNs, onChanged }) {
  const [items, setItems] = useState(() => dept[kind] ?? []);
  const [draft, setDraft] = useState(defaults);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    try {
      const list = await apiNs.list(dept.code);
      setItems(list);
      onChanged();
    } catch (e) {
      setErr(errorMessage(e));
    }
  };

  const create = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      await apiNs.create(dept.code, draft);
      setDraft(defaults);
      await reload();
    } catch (e2) { setErr(errorMessage(e2)); } finally { setBusy(false); }
  };

  const update = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      await apiNs.update(dept.code, editing.id, editing);
      setEditing(null);
      await reload();
    } catch (e2) { setErr(errorMessage(e2)); } finally { setBusy(false); }
  };

  const remove = async (item) => {
    if (!confirm(`Delete "${item.name || item.student_name || item.title}"?`)) return;
    await apiNs.delete(dept.code, item.id);
    await reload();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-[10px] uppercase tracking-widest text-gray-500">
            <tr>
              {columns.map((c) => <th key={c.key} className="text-left px-3 py-2">{c.label}</th>)}
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="text-center py-6 text-gray-400 text-xs">No items yet.</td></tr>
            )}
            {items.map((it) => (
              <tr key={it.id}>
                {columns.map((c) => {
                  if (c.type === 'image') {
                    const url = it[c.previewKey || 'photo_url'];
                    return (
                      <td key={c.key} className="px-3 py-2">
                        <MediaThumb
                          media={url ? { public_url: url } : null}
                          size="h-10 w-10"
                        />
                      </td>
                    );
                  }
                  return (
                    <td key={c.key} className="px-3 py-2 text-xs text-gray-700 dark:text-gray-300">
                      {String(it[c.key] ?? '')}
                    </td>
                  );
                })}
                <td className="px-3 py-2 text-right">
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
        <form onSubmit={create} className="mt-3 grid sm:grid-cols-2 gap-3">
          {columns.map((c) => {
            if (c.type === 'image') {
              const previewKey = c.previewKey || 'photo_url';
              return (
                <div key={c.key} className="sm:col-span-2">
                  <ImageField
                    label={c.label}
                    value={draft[c.key] ?? null}
                    preview={draft[previewKey] || ''}
                    folder={c.folder}
                    onChange={(picked) =>
                      setDraft({
                        ...draft,
                        [c.key]: picked?.id ?? null,
                        [previewKey]: picked?.public_url ?? '',
                      })
                    }
                  />
                </div>
              );
            }
            return (
              <Field
                key={c.key}
                label={c.label}
                value={draft[c.key] ?? ''}
                onChange={(v) => setDraft({ ...draft, [c.key]: v })}
                textarea={c.textarea}
                rows={c.rows}
              />
            );
          })}
          <div className="sm:col-span-2">
            <button disabled={busy} className="bg-[#800000] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Plus size={12} /> {busy ? 'Adding…' : 'Add'}
            </button>
          </div>
        </form>
      </details>

      {editing && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <form onSubmit={update} className="relative ml-auto w-full max-w-md bg-white dark:bg-gray-900 h-full overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-base text-gray-900 dark:text-white">Edit</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={16} />
              </button>
            </div>
            <div className="grid gap-3">
              {columns.map((c) => {
                if (c.type === 'image') {
                  const previewKey = c.previewKey || 'photo_url';
                  return (
                    <ImageField
                      key={c.key}
                      label={c.label}
                      value={editing[c.key] ?? null}
                      preview={editing[previewKey] || ''}
                      folder={c.folder}
                      onChange={(picked) =>
                        setEditing({
                          ...editing,
                          [c.key]: picked?.id ?? null,
                          [previewKey]: picked?.public_url ?? '',
                        })
                      }
                    />
                  );
                }
                return (
                  <Field
                    key={c.key}
                    label={c.label}
                    value={editing[c.key] ?? ''}
                    onChange={(v) => setEditing({ ...editing, [c.key]: v })}
                    textarea={c.textarea}
                    rows={c.rows}
                  />
                );
              })}
            </div>
            <div className="mt-4 flex gap-2">
              <button disabled={busy} className="bg-[#800000] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Save size={12} /> {busy ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={() => setEditing(null)} className="text-xs px-3 py-1.5 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ── Labs tab — card grid with per-row Upload Image button ─────────────
function LabsTab({ dept, qc, activeCode }) {
  const [items, setItems] = useState(() => dept.laboratories ?? []);
  const [picker, setPicker] = useState(null); // { labId | 'new' }
  const [draft, setDraft] = useState({ name: '', icon: '', description: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const folder = `departments/${(dept.code || '').toLowerCase()}/labs`;

  const reload = async () => {
    try {
      const list = await departmentsApi.labs.list(dept.code);
      setItems(list);
      qc.invalidateQueries({ queryKey: ['public-department', activeCode] });
    } catch (e) {
      setErr(errorMessage(e));
    }
  };

  // Only send fields LaboratoryIn accepts — strips response-only keys like
  // id / department_id / photo_url so the backend Pydantic validator doesn't
  // reject the body with "extra fields".
  const writableLab = (l) => ({
    name: l.name ?? '',
    icon: l.icon ?? null,
    description: l.description ?? null,
    tools: l.tools ?? null,
    photo_id: l.photo_id ?? null,
    sort_order: l.sort_order ?? 0,
  });

  const updateLab = async (lab, patch) => {
    setErr(''); setBusy(true);
    try {
      await departmentsApi.labs.update(dept.code, lab.id, { ...writableLab(lab), ...patch });
      await reload();
    } catch (e) { setErr(errorMessage(e)); }
    finally { setBusy(false); }
  };

  const removeLab = async (lab) => {
    if (!window.confirm(`Delete "${lab.name}"?`)) return;
    await departmentsApi.labs.delete(dept.code, lab.id);
    await reload();
  };

  const createLab = async (e) => {
    e?.preventDefault?.();
    if (!draft.name?.trim()) return;
    setErr(''); setBusy(true);
    try {
      await departmentsApi.labs.create(dept.code, { ...draft, sort_order: items.length, is_active: true });
      setDraft({ name: '', icon: '', description: '' });
      await reload();
    } catch (e2) { setErr(errorMessage(e2)); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      {err && <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">{err}</div>}

      {/* Quick-add bar */}
      <form onSubmit={createLab} className="bg-gradient-to-br from-rose-50/60 to-amber-50/40 dark:from-gray-800 dark:to-gray-800 border border-rose-100 dark:border-gray-700 rounded-2xl p-4">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#800000] mb-2 flex items-center gap-1.5">
          <Plus size={11} /> Add a new lab
        </div>
        <div className="grid sm:grid-cols-[1fr_120px_2fr_auto] gap-2">
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Lab name (e.g. VLSI Lab)"
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900 focus:outline-none focus:border-[#800000]"
          />
          <input
            value={draft.icon}
            onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
            placeholder="Icon (emoji)"
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900 focus:outline-none focus:border-[#800000]"
          />
          <input
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            placeholder="Short description"
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900 focus:outline-none focus:border-[#800000]"
          />
          <button
            disabled={busy || !draft.name.trim()}
            className="bg-[#800000] text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg disabled:opacity-40 flex items-center gap-1.5"
          >
            <Plus size={12} /> Add
          </button>
        </div>
        <p className="text-[10px] text-gray-500 mt-2">
          You'll be able to <strong>upload an image</strong> for the new lab right after adding it.
        </p>
      </form>

      {/* Lab cards — each with its own Upload Image button */}
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">No labs yet. Add one above to get started.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((lab) => (
            <div
              key={lab.id}
              className="group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:shadow-md transition-shadow"
            >
              {/* Image area or empty-state with prominent upload CTA */}
              {lab.photo_url ? (
                <div className="relative h-32 w-full bg-gray-50 dark:bg-gray-800">
                  <img
                    src={lab.photo_url}
                    alt={lab.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPicker({ labId: lab.id })}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur text-[10px] font-black uppercase tracking-widest text-[#800000] shadow-md hover:bg-white flex items-center gap-1"
                  >
                    <ImagePlus size={11} /> Change
                  </button>
                  <button
                    type="button"
                    onClick={() => updateLab(lab, { photo_id: null })}
                    title="Remove image"
                    className="absolute top-2 right-[88px] w-7 h-7 rounded-lg bg-white/95 backdrop-blur text-gray-500 hover:text-red-600 shadow-md flex items-center justify-center"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPicker({ labId: lab.id })}
                  className="relative h-32 w-full bg-gradient-to-br from-rose-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 border-b-2 border-dashed border-rose-300 dark:border-gray-700 flex flex-col items-center justify-center gap-1 hover:from-rose-100 hover:to-amber-100 dark:hover:from-gray-700 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-[#800000] text-white flex items-center justify-center shadow-md">
                    <ImagePlus size={16} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#800000]">Upload Image</span>
                  <span className="text-[9px] text-gray-500">JPEG, PNG · up to 4 MB</span>
                </button>
              )}

              {/* Body — inline editable name / icon / description */}
              <div className="p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <input
                    value={lab.icon || ''}
                    onChange={(e) => setItems((cur) => cur.map((x) => x.id === lab.id ? { ...x, icon: e.target.value } : x))}
                    onBlur={() => updateLab(lab, { icon: lab.icon })}
                    placeholder="🧪"
                    className="w-9 px-1 py-1 text-center text-base border border-gray-200 dark:border-gray-700 rounded dark:bg-gray-800 focus:outline-none focus:border-[#800000]"
                  />
                  <input
                    value={lab.name || ''}
                    onChange={(e) => setItems((cur) => cur.map((x) => x.id === lab.id ? { ...x, name: e.target.value } : x))}
                    onBlur={() => updateLab(lab, { name: lab.name })}
                    className="flex-1 px-2 py-1 text-sm font-black border border-gray-200 dark:border-gray-700 rounded dark:bg-gray-800 focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <textarea
                  rows={2}
                  value={lab.description || ''}
                  onChange={(e) => setItems((cur) => cur.map((x) => x.id === lab.id ? { ...x, description: e.target.value } : x))}
                  onBlur={() => updateLab(lab, { description: lab.description })}
                  placeholder="Short description shown on the public dept page."
                  className="w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded dark:bg-gray-800 focus:outline-none focus:border-[#800000]"
                />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[9px] text-gray-400">#{lab.id} · {dept.code}</span>
                  <button
                    type="button"
                    onClick={() => removeLab(lab)}
                    className="text-[10px] text-gray-400 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={11} /> Delete lab
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <MediaPicker
        open={!!picker}
        onClose={() => setPicker(null)}
        folder={folder}
        onPick={async (picked) => {
          const labId = picker?.labId;
          setPicker(null);
          const lab = items.find((x) => x.id === labId);
          if (!lab) return;
          await updateLab(lab, { photo_id: picked.id });
        }}
      />
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────
export default function AdminDepartments() {
  const { hasScope, isSuperAdmin, isEditor } = useAuth();
  const qc = useQueryClient();
  const [code, setCode] = useState(null);
  const [tab, setTab] = useState('overview');

  const { data: depts = [], isLoading: lLoading } = useQuery({
    queryKey: ['admin-departments-list'],
    queryFn: () => departmentsApi.list(),
  });

  // Default the selected dept to the first the editor can edit.
  const visibleDepts = useMemo(() => {
    if (isSuperAdmin) return depts;
    return depts.filter((d) =>
      hasScope('site.pages') || (d.scope_key && hasScope(d.scope_key))
    );
  }, [depts, hasScope, isSuperAdmin]);

  const activeCode = code || visibleDepts[0]?.code;

  const { data: dept } = useQuery({
    queryKey: ['admin-department', activeCode],
    queryFn: () => departmentsApi.get(activeCode),
    enabled: !!activeCode,
  });

  const onSaved = (updated) => {
    qc.setQueryData(['admin-department', activeCode], updated);
    qc.invalidateQueries({ queryKey: ['admin-departments-list'] });
    qc.invalidateQueries({ queryKey: ['public-department', activeCode] });
    // Homepage Departments grid + any sitewide list reads also need to refresh
    // so an admin edit of CSE intake updates the home tile immediately, not on
    // next browser refresh.
    qc.invalidateQueries({ queryKey: ['public-departments'] });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Building2 size={20} /> Departments
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Per-department editors only see their own dept{isSuperAdmin ? ' — you can see all.' : '.'}
            </p>
          </div>
        </div>

        {lLoading && <div className="text-center text-gray-400 py-10">Loading…</div>}
        {!lLoading && visibleDepts.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            You don't have edit access to any department yet.
            {isEditor && <> Ask the super-admin to grant you a <code className="font-mono">dept.&lt;code&gt;</code> scope.</>}
          </div>
        )}

        {visibleDepts.length > 0 && (
          <>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {visibleDepts.map((d) => {
                const isActive = activeCode === d.code;
                const label = d.short_name && d.short_name !== d.code
                  ? `${d.code} · ${d.short_name}`
                  : d.code;
                return (
                  <button
                    key={d.code}
                    onClick={() => { setCode(d.code); setTab('overview'); }}
                    title={d.name}
                    className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded ${isActive ? 'bg-[#800000] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {dept && (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
                <div className="flex flex-wrap items-baseline justify-between mb-3 gap-2">
                  <div>
                    <h2 className="text-lg font-black text-gray-900 dark:text-white">{dept.name}</h2>
                    <div className="text-xs text-gray-500 font-mono">code={dept.code} · scope={dept.scope_key || 'site.pages'}</div>
                  </div>
                  <a
                    href={dept.page_path || `/${dept.code.toLowerCase()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#800000] underline font-semibold"
                  >
                    View public page →
                  </a>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                  {SUBTABS.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded ${tab === t.key ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {tab === 'overview' && <OverviewTab key={`overview-${dept.code}`} dept={dept} onSaved={onSaved} />}
                {tab === 'hod' && <HodTab key={`hod-${dept.code}`} dept={dept} onSaved={onSaved} />}
                {tab === 'faculty' && (
                  <ListTab
                    key={`faculty-${dept.code}`}
                    dept={{ ...dept, faculty: dept.faculty || [] }}
                    kind="faculty"
                    columns={[
                      { key: 'name', label: 'Name' },
                      { key: 'role', label: 'Role' },
                      { key: 'qualification', label: 'Qualification' },
                      { key: 'email', label: 'Email' },
                    ]}
                    defaults={{ name: '', role: '', qualification: '', email: '', is_highlight: true, sort_order: 0 }}
                    apiNs={departmentsApi.faculty}
                    onChanged={() => qc.invalidateQueries({ queryKey: ['public-department', activeCode] })}
                  />
                )}
                {tab === 'labs' && (
                  <LabsTab
                    key={`labs-${dept.code}`}
                    dept={dept}
                    qc={qc}
                    activeCode={activeCode}
                  />
                )}
                {tab === 'partners' && (
                  <ListTab
                    key={`partners-${dept.code}`}
                    dept={{ ...dept, partners: dept.industry_partners || [] }}
                    kind="partners"
                    columns={[
                      { key: 'name', label: 'Name' },
                      { key: 'category', label: 'Category (industry/govt/psu)' },
                      { key: 'url', label: 'URL' },
                    ]}
                    defaults={{ name: '', category: 'industry', url: '', sort_order: 0 }}
                    apiNs={departmentsApi.partners}
                    onChanged={() => qc.invalidateQueries({ queryKey: ['public-department', activeCode] })}
                  />
                )}
                {tab === 'projects' && (
                  <ListTab
                    key={`projects-${dept.code}`}
                    dept={{ ...dept, projects: dept.student_projects || [] }}
                    kind="projects"
                    columns={[
                      { key: 'title', label: 'Title' },
                      { key: 'note', label: 'Note', textarea: true, rows: 2 },
                      { key: 'year', label: 'Year' },
                    ]}
                    defaults={{ title: '', note: '', year: '', sort_order: 0 }}
                    apiNs={departmentsApi.projects}
                    onChanged={() => qc.invalidateQueries({ queryKey: ['public-department', activeCode] })}
                  />
                )}
                {tab === 'awards' && (
                  <ListTab
                    key={`awards-${dept.code}`}
                    dept={{ ...dept, awards: dept.student_awards || [] }}
                    kind="awards"
                    columns={[
                      { key: 'student_name', label: 'Student name' },
                      { key: 'award', label: 'Award' },
                      { key: 'batch', label: 'Batch' },
                    ]}
                    defaults={{ student_name: '', award: '', batch: '', sort_order: 0 }}
                    apiNs={departmentsApi.awards}
                    onChanged={() => qc.invalidateQueries({ queryKey: ['public-department', activeCode] })}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

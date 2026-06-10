import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Plus, Save, Trash2, X, Image as ImageIcon, Star, Eye, EyeOff,
} from 'lucide-react';
import { whatsNewApi } from '../../api/events';
import { errorMessage } from '../../api/client';
import MediaPicker from '../../components/admin/MediaPicker';

const BLANK = {
  title: '',
  caption: '',
  event_date: '',
  image_id: null,
  image_url: '',
  link_url: '',
  is_active: true,
  is_featured: false,
  sort_order: 0,
};

function Field({ label, value, onChange, type = 'text', textarea, rows = 3, placeholder }) {
  const cls = "w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]";
  return (
    <label className="block text-xs">
      <span className="block font-bold text-gray-500 mb-1">{label}</span>
      {textarea ? (
        <textarea value={value || ''} onChange={onChange} rows={rows} className={cls} placeholder={placeholder} />
      ) : (
        <input type={type} value={value || ''} onChange={onChange} className={cls} placeholder={placeholder} />
      )}
    </label>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition
                  ${value
                    ? 'bg-[#800000] text-white border-[#800000]'
                    : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'}`}
    >
      {label}
    </button>
  );
}

function EditForm({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial || BLANK);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const setEvent = (k) => (e) => set(k)(e.target.value);

  const isEdit = !!initial?.id;

  const submit = async () => {
    setBusy(true);
    setErr('');
    try {
      const payload = {
        title: form.title.trim(),
        caption: form.caption?.trim() || null,
        event_date: form.event_date || null,
        image_id: form.image_id || null,
        image_url: form.image_url?.trim() || null,
        link_url: form.link_url?.trim() || null,
        is_active: !!form.is_active,
        is_featured: !!form.is_featured,
        sort_order: Number(form.sort_order) || 0,
      };
      const saved = isEdit
        ? await whatsNewApi.update(initial.id, payload)
        : await whatsNewApi.create(payload);
      onSaved?.(saved);
      onClose?.();
    } catch (e) {
      setErr(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const previewSrc = form.image_url;

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg h-full bg-white dark:bg-gray-900 overflow-y-auto p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black text-gray-900 dark:text-white">
            {isEdit ? 'Edit update' : 'New update'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} />
          </button>
        </div>

        {err && (
          <div className="mb-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            {err}
          </div>
        )}

        <div className="space-y-4">
          <Field label="Title *" value={form.title} onChange={setEvent('title')} placeholder="Annual Sports Day, Placement Drive…" />

          <Field
            label="Short caption"
            value={form.caption}
            onChange={setEvent('caption')}
            textarea
            rows={3}
            placeholder="One or two sentences describing what happened."
          />

          <Field label="Date" type="date" value={form.event_date} onChange={setEvent('event_date')} />

          <div>
            <span className="block text-xs font-bold text-gray-500 mb-1">Image</span>
            <div className="flex items-start gap-3">
              <div className="w-28 h-20 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden flex items-center justify-center text-gray-400 shrink-0">
                {previewSrc ? (
                  <img src={previewSrc} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={22} />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="w-full text-xs font-black uppercase tracking-widest bg-[#800000] text-white px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-[#5a0000] transition"
                >
                  <ImageIcon size={14} /> Choose or upload image
                </button>
                <input
                  type="text"
                  value={form.image_url || ''}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value, image_id: null }))}
                  placeholder="…or paste an image URL"
                  className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]"
                />
              </div>
            </div>
          </div>

          <Field
            label="Link (optional)"
            value={form.link_url}
            onChange={setEvent('link_url')}
            placeholder="https://…  (renders a 'Read more' link on the card)"
          />

          <Field
            label="Sort order (lower = earlier)"
            type="number"
            value={form.sort_order}
            onChange={setEvent('sort_order')}
          />

          <div className="flex gap-2">
            <Toggle label="Active" value={form.is_active} onChange={set('is_active')} />
            <Toggle label="Featured" value={form.is_featured} onChange={set('is_featured')} />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={busy || !form.title.trim()}
            className="flex-1 bg-gradient-to-r from-rose-600 to-[#800000] text-white text-xs font-black uppercase tracking-widest py-3 rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            <Save size={14} /> {busy ? 'Saving…' : (isEdit ? 'Save changes' : 'Create update')}
          </button>
        </div>

        <MediaPicker
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          folder="whats-new"
          onPick={(m) => setForm((f) => ({ ...f, image_id: m.id, image_url: m.public_url }))}
        />
      </div>
    </div>
  );
}

export default function AdminWhatsNew() {
  const qc = useQueryClient();
  const { data: items = [], isLoading, isError, error } = useQuery({
    queryKey: ['admin-whats-new'],
    queryFn: () => whatsNewApi.list(),
  });

  const [editing, setEditing] = useState(null); // null | BLANK | row
  const [removing, setRemoving] = useState(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-whats-new'] });

  const remove = async (row) => {
    setRemoving(row.id);
    try {
      await whatsNewApi.delete(row.id);
      refresh();
    } catch (e) {
      alert(errorMessage(e));
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#800000] transition"
            >
              <ArrowLeft size={11} /> Back to dashboard
            </Link>
            <h1 className="mt-2 text-xl sm:text-2xl font-black tracking-tight">
              What&apos;s New
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage the cards shown on the public <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">/whats-new</code> page and in the floating sidebar drawer.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditing(BLANK)}
            className="bg-gradient-to-r from-rose-600 to-[#800000] text-white text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md hover:shadow-lg transition"
          >
            <Plus size={14} /> New update
          </button>
        </div>

        {isError && (
          <div className="mb-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            {errorMessage(error)}
          </div>
        )}

        {isLoading && (
          <div className="text-center text-gray-400 py-12 text-sm">Loading…</div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="text-center py-16 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500 font-medium">No updates yet.</p>
            <button
              type="button"
              onClick={() => setEditing(BLANK)}
              className="mt-3 text-xs font-black uppercase tracking-widest text-[#800000] hover:text-[#5a0000]"
            >
              + Add your first update
            </button>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <ul className="space-y-3">
            {items.map((row) => {
              const src = row.resolved_image_url || row.image_url;
              return (
                <li
                  key={row.id}
                  className="flex items-center gap-4 p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                    {src ? (
                      <img src={src} alt={row.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {row.is_featured && (
                        <span className="inline-flex items-center gap-0.5 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          <Star size={9} /> Featured
                        </span>
                      )}
                      {!row.is_active && (
                        <span className="inline-flex items-center gap-0.5 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-gray-200 text-gray-600">
                          <EyeOff size={9} /> Hidden
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-black truncate">{row.title}</h3>
                    <p className="text-[11px] text-gray-500 truncate">
                      {row.event_date || '—'}{row.caption ? ` · ${row.caption}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditing(row)}
                      className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete "${row.title}"? This cannot be undone.`)) {
                          remove(row);
                        }
                      }}
                      disabled={removing === row.id}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-100 disabled:opacity-50 transition"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {editing !== null && (
        <EditForm
          initial={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSaved={refresh}
        />
      )}
    </div>
  );
}

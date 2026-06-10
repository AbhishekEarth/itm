import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Image as ImageIcon, Plus, Trash2, Upload, X } from 'lucide-react';
import { galleryApi } from '../../api/events';
import { mediaApi } from '../../api/cms';
import { errorMessage } from '../../api/client';

function CategoryEditor({ cat, onSaved, onClose }) {
  const [form, setForm] = useState({
    slug: cat?.slug ?? '',
    label: cat?.label ?? '',
    icon: cat?.icon ?? '',
    accent: cat?.accent ?? '',
    description: cat?.description ?? '',
    cover_url: cat?.cover_url ?? '',
    scope_key: cat?.scope_key ?? 'gallery',
    sort_order: cat?.sort_order ?? 0,
  });
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (cat) await galleryApi.updateCategory(cat.id, form);
      else await galleryApi.createCategory(form);
      onSaved();
      onClose();
    } catch (e2) {
      setErr(errorMessage(e2));
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={submit} className="relative ml-auto w-full max-w-md bg-white dark:bg-gray-900 h-full overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-base text-gray-900 dark:text-white">{cat ? 'Edit category' : 'New category'}</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-3 text-xs">
          {[
            ['slug', 'Slug (URL-safe)'],
            ['label', 'Label'],
            ['icon', 'Icon (emoji or lucide)'],
            ['accent', 'Accent (Tailwind classes)'],
            ['scope_key', 'Scope key'],
            ['cover_url', 'Cover URL'],
            ['description', 'Description'],
          ].map(([k, label]) => (
            <label key={k} className="block">
              <span className="block font-bold text-gray-500 mb-1">{label}</span>
              <input value={form[k] ?? ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                     className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800" />
            </label>
          ))}
        </div>
        {err && <div className="mt-3 text-xs text-red-600">{err}</div>}
        <div className="mt-4 flex gap-2">
          <button className="bg-[#800000] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">Save</button>
          <button type="button" onClick={onClose} className="text-xs px-3 py-1.5 rounded-lg">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function CategoryItems({ cat }) {
  const qc = useQueryClient();
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [caption, setCaption] = useState('');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['gallery-items', cat.id],
    queryFn: () => galleryApi.listItems(cat.id),
  });
  const reload = () => qc.invalidateQueries({ queryKey: ['gallery-items', cat.id] });

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true); setErr('');
    try {
      const uploaded = [];
      for (const f of files) {
        const m = await mediaApi.upload(f, { folder: `gallery/${cat.slug}`, alt: f.name });
        uploaded.push(m.id);
      }
      await galleryApi.bulkAdd(cat.id, { media_ids: uploaded, media_urls: [], caption });
      reload();
    } catch (e2) {
      setErr(errorMessage(e2));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const remove = async (i) => { if (!confirm('Delete this image?')) return; await galleryApi.deleteItem(i.id); reload(); };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <label className="cursor-pointer bg-[#800000] hover:bg-[#600000] text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg inline-flex items-center gap-2">
          <Upload size={12} /> {busy ? 'Uploading…' : 'Bulk upload'}
          <input ref={fileRef} type="file" hidden multiple accept="image/*" onChange={onUpload} />
        </label>
        <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Optional caption for all uploaded"
               className="flex-1 px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800" />
      </div>
      {err && <div className="text-xs text-red-600">{err}</div>}
      {isLoading && <div className="text-center text-gray-400 py-6 text-xs">Loading…</div>}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {items.map((i) => (
          <div key={i.id} className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group">
            <img src={i.resolved_media_url} alt={i.caption || ''} className="w-full h-full object-cover" />
            {i.caption && <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-black/50 text-white text-[9px] truncate">{i.caption}</div>}
            <button onClick={() => remove(i)} className="absolute top-1 right-1 p-1 rounded bg-white/80 hover:bg-red-600 hover:text-white text-gray-700">
              <Trash2 size={11} />
            </button>
          </div>
        ))}
        {!isLoading && items.length === 0 && <div className="col-span-full text-center text-gray-400 text-xs py-6">No images. Upload some above.</div>}
      </div>
    </div>
  );
}

export default function AdminGallery() {
  const qc = useQueryClient();
  const { data: cats = [], isLoading } = useQuery({
    queryKey: ['admin-gallery-cats'],
    queryFn: () => galleryApi.listCategories(),
  });
  const [activeId, setActiveId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const active = cats.find((c) => c.id === activeId) || cats[0];

  const removeCategory = async (c) => {
    if (!confirm(`Delete category ${c.label} and all its images?`)) return;
    await galleryApi.deleteCategory(c.id);
    qc.invalidateQueries({ queryKey: ['admin-gallery-cats'] });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ImageIcon size={20} /> Gallery
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Requires <code className="font-mono">gallery</code> scope. Drag-drop multi-upload supported.</p>
          </div>
          <button onClick={() => setCreating(true)} className="bg-[#800000] hover:bg-[#600000] text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg inline-flex items-center gap-2">
            <Plus size={12} /> New category
          </button>
        </div>

        {isLoading && <div className="text-center text-gray-400 py-10">Loading…</div>}

        {!isLoading && cats.length > 0 && (
          <>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {cats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded ${active?.id === c.id ? 'bg-[#800000] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}
                >
                  {c.label} <span className="ml-1 px-1 rounded bg-white/30 text-[9px]">{c.item_count}</span>
                </button>
              ))}
            </div>

            {active && (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-black text-gray-900 dark:text-white">{active.label}</h2>
                    <div className="text-xs text-gray-500 font-mono">slug={active.slug} · scope={active.scope_key || 'gallery'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(active)} className="text-xs text-[#800000] font-semibold">Edit</button>
                    <button onClick={() => removeCategory(active)} className="text-xs text-gray-400 hover:text-red-600">Delete</button>
                  </div>
                </div>
                <CategoryItems cat={active} />
              </div>
            )}
          </>
        )}
        {!isLoading && cats.length === 0 && <div className="text-center text-gray-400 py-10">No categories yet — create one above.</div>}
      </div>

      {creating && <CategoryEditor cat={null} onSaved={() => qc.invalidateQueries({ queryKey: ['admin-gallery-cats'] })} onClose={() => setCreating(false)} />}
      {editing && <CategoryEditor cat={editing} onSaved={() => qc.invalidateQueries({ queryKey: ['admin-gallery-cats'] })} onClose={() => setEditing(null)} />}
    </div>
  );
}

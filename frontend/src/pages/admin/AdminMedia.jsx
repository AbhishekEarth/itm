import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ImageIcon, Trash2, Upload } from 'lucide-react';
import { mediaApi } from '../../api/cms';
import { errorMessage } from '../../api/client';

export default function AdminMedia() {
  const qc = useQueryClient();
  const [folder, setFolder] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['admin-media', folder],
    queryFn: () => mediaApi.list({ folder: folder || undefined }),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-media'] });

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadError('');
    try {
      const fld = folder || prompt('Folder (e.g. hero, gallery)?') || 'misc';
      await mediaApi.upload(file, { folder: fld });
      invalidate();
    } catch (e2) {
      setUploadError(errorMessage(e2));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const remove = async (item) => {
    if (!confirm(`Delete "${item.original_name || item.id}"?`)) return;
    await mediaApi.delete(item.id);
    invalidate();
  };

  const displayError = uploadError || (error ? errorMessage(error) : '');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ImageIcon size={20} /> Media Library
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Images become a thumb / card / hero WebP set on upload. PDFs / docs are stored as-is.</p>
          </div>
          <label className="cursor-pointer bg-[#800000] hover:bg-[#600000] text-white text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl flex items-center gap-2">
            <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload'}
            <input ref={fileRef} type="file" hidden onChange={onUpload} accept="image/*,application/pdf" />
          </label>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <input
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="Filter by folder (blank = all)"
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900"
          />
        </div>

        {displayError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{displayError}</div>}
        {isLoading && <div className="text-center text-gray-400 py-10">Loading…</div>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((m) => (
            <div key={m.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden group">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {m.kind === 'image' ? (
                  <img src={m.public_url} alt={m.alt || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-xs text-gray-500 font-mono">{m.mime}</div>
                )}
              </div>
              <div className="p-2 text-[11px]">
                <div className="truncate text-gray-700 dark:text-gray-300 font-semibold">{m.original_name || `#${m.id}`}</div>
                <div className="text-gray-400 truncate font-mono">{m.folder ?? '-'} · {(m.size_bytes/1024).toFixed(1)} KB</div>
                <div className="mt-1.5 flex items-center justify-between gap-1">
                  <a href={m.public_url} target="_blank" rel="noreferrer" className="text-[#800000] underline">open</a>
                  <button onClick={() => remove(m)} className="text-gray-400 hover:text-red-600">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!isLoading && items.length === 0 && <div className="text-center text-gray-400 py-10 col-span-full">No media yet — upload above.</div>}
        </div>
      </div>
    </div>
  );
}

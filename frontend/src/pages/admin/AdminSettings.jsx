import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Settings as SettingsIcon } from 'lucide-react';
import { settingsApi } from '../../api/cms';
import { errorMessage } from '../../api/client';

function asInputValue(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  try { return JSON.stringify(value, null, 2); } catch { return String(value); }
}

function parseValue(raw, original) {
  // If the original was a string, keep it a string. Otherwise try JSON.
  if (typeof original === 'string') return raw;
  try { return JSON.parse(raw); } catch { return raw; }
}

function SettingRow({ setting, onSaved }) {
  const [draft, setDraft] = useState(asInputValue(setting.value));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);

  useEffect(() => { setDraft(asInputValue(setting.value)); }, [setting.value]);
  const isJsonShaped = typeof setting.value !== 'string';

  const save = async () => {
    setErr(''); setOk(false); setSaving(true);
    try {
      const value = parseValue(draft, setting.value);
      const updated = await settingsApi.upsert(setting.key, { value, group: setting.group });
      onSaved(updated);
      setOk(true);
      setTimeout(() => setOk(false), 1500);
    } catch (e) {
      setErr(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300">{setting.key}</div>
          {setting.description && <div className="text-xs text-gray-500 mt-0.5">{setting.description}</div>}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
          {isJsonShaped ? 'json' : 'text'}
        </span>
      </div>
      {isJsonShaped ? (
        <textarea
          rows={Math.min(12, draft.split('\n').length + 1)}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full px-3 py-2 text-xs font-mono border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]"
        />
      ) : (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]"
        />
      )}
      <div className="mt-3 flex items-center gap-3">
        <button onClick={save} disabled={saving} className="bg-[#800000] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5 disabled:opacity-60">
          <Save size={12} /> {saving ? 'Saving…' : 'Save'}
        </button>
        {ok && <span className="text-xs text-emerald-600 font-semibold">Saved.</span>}
        {err && <span className="text-xs text-red-600 font-semibold">{err}</span>}
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const [group, setGroup] = useState('');
  const qc = useQueryClient();
  const { data: settings = [], isLoading, error } = useQuery({
    queryKey: ['admin-settings', group],
    queryFn: () => settingsApi.list(group || undefined),
  });

  const groups = useMemo(
    () => Array.from(new Set(settings.map((s) => s.group).filter(Boolean))).sort(),
    [settings]
  );

  const onSaved = (updated) => {
    qc.setQueryData(['admin-settings', group], (arr = []) =>
      arr.map((x) => (x.key === updated.key ? updated : x))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <SettingsIcon size={20} /> Site Settings
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Brand, contact, social, SEO defaults. Editable JSON values stay as JSON; plain text stays as text.</p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          <button
            onClick={() => setGroup('')}
            className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded ${!group ? 'bg-[#800000] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}
          >
            All
          </button>
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded ${group === g ? 'bg-[#800000] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}
            >
              {g}
            </button>
          ))}
        </div>

        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{errorMessage(error)}</div>}

        {isLoading ? (
          <div className="text-center text-gray-400 py-10">Loading…</div>
        ) : (
          <div className="grid gap-4">
            {settings.map((s) => (
              <SettingRow key={s.key} setting={s} onSaved={onSaved} />
            ))}
            {settings.length === 0 && <div className="text-center text-gray-400 py-10">No settings yet.</div>}
          </div>
        )}
      </div>
    </div>
  );
}

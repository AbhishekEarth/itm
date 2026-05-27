import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, Search, ShieldCheck, KeyRound, Power, PowerOff, X, Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usersApi, scopesApi } from '../../api/users';
import { errorMessage } from '../../api/client';

const ROLES = ['super_admin', 'editor', 'faculty', 'student'];

function ScopePicker({ allScopes, selected, onChange }) {
  const grouped = useMemo(() => {
    const buckets = {};
    allScopes.forEach((s) => {
      const group = s.key.split('.')[0];
      (buckets[group] ||= []).push(s);
    });
    return Object.entries(buckets).sort(([a], [b]) => a.localeCompare(b));
  }, [allScopes]);

  const toggle = (key) => {
    const set = new Set(selected);
    if (set.has(key)) set.delete(key);
    else set.add(key);
    onChange(Array.from(set));
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-800 max-h-72 overflow-y-auto">
      {grouped.map(([group, scopes]) => (
        <div key={group} className="p-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{group}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {scopes.map((s) => (
              <label key={s.key} className="flex items-start gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(s.key)}
                  onChange={() => toggle(s.key)}
                  className="mt-0.5 accent-[#800000]"
                />
                <span className="leading-tight">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{s.label}</span>
                  <span className="block text-[10px] text-gray-400 font-mono">{s.key}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CreateUserDrawer({ onClose, onCreated, allScopes }) {
  const [form, setForm] = useState({
    username: '', email: '', full_name: '', phone: '',
    role: 'editor', password: '', must_change_password: true, scopes: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const user = await usersApi.create(form);
      onCreated(user);
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative ml-auto w-full max-w-xl bg-white dark:bg-gray-900 h-full overflow-y-auto p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Create user</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <Field label="Username" value={form.username} onChange={(v) => setForm((f) => ({ ...f, username: v }))} required minLength={3} />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} required />
          <Field label="Full name" value={form.full_name} onChange={(v) => setForm((f) => ({ ...f, full_name: v }))} />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <Field label="Temp password" type="password" value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} required minLength={8} />
        </div>

        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-4">
          <input
            type="checkbox"
            checked={form.must_change_password}
            onChange={(e) => setForm((f) => ({ ...f, must_change_password: e.target.checked }))}
          />
          Force password change on first login
        </label>

        {form.role === 'editor' && (
          <div className="mb-4">
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Scopes</label>
            <ScopePicker allScopes={allScopes} selected={form.scopes} onChange={(s) => setForm((f) => ({ ...f, scopes: s }))} />
            <p className="mt-2 text-[11px] text-gray-400">Editor sees ONLY the resources covered by these scopes.</p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#800000] text-white font-black text-xs tracking-widest uppercase py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Save size={14} /> {saving ? 'Creating…' : 'Create user'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required, minLength }) {
  return (
    <div>
      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10"
      />
    </div>
  );
}

function ScopeEditorRow({ user, allScopes, onSaved }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(user.scopes || []);
  const [saving, setSaving] = useState(false);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs text-[#800000] font-semibold hover:underline">
        {user.scopes?.length ? `${user.scopes.length} scope(s)` : 'No scopes — add'}
      </button>
    );
  }

  const save = async () => {
    const current = new Set(user.scopes || []);
    const next = new Set(selected);
    const add = selected.filter((k) => !current.has(k));
    const remove = (user.scopes || []).filter((k) => !next.has(k));
    setSaving(true);
    try {
      const updated = await usersApi.updateScopes(user.id, { add, remove });
      onSaved(updated);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-2">
      <ScopePicker allScopes={allScopes} selected={selected} onChange={setSelected} />
      <div className="flex gap-2">
        <button onClick={save} disabled={saving} className="text-xs bg-[#800000] text-white px-3 py-1.5 rounded font-semibold">
          {saving ? 'Saving…' : 'Save scopes'}
        </button>
        <button onClick={() => { setOpen(false); setSelected(user.scopes || []); }} className="text-xs px-3 py-1.5 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [allScopes, setAllScopes] = useState([]);
  const [q, setQ] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [u, s] = await Promise.all([
        usersApi.list({ q: q || undefined }),
        scopesApi.list(),
      ]);
      setUsers(u);
      setAllScopes(s);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => { load(); }, [load]);

  const search = (e) => { e.preventDefault(); load(); };

  const toggleActive = async (u) => {
    if (u.is_active) {
      if (!confirm(`Deactivate ${u.username}?`)) return;
      await usersApi.deactivate(u.id);
    } else {
      await usersApi.update(u.id, { is_active: true });
    }
    load();
  };

  const resetPassword = async (u) => {
    const pw = prompt(`New temporary password for ${u.username} (≥8 chars):`);
    if (!pw || pw.length < 8) return;
    await usersApi.resetPassword(u.id, { new_password: pw, must_change_password: true });
    alert('Password reset. User must change on next login.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">Users & Scopes</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage super-admins, editors, faculty and student accounts.
              </p>
            </div>
          </div>
          {isSuperAdmin && (
            <button
              onClick={() => setDrawer(true)}
              className="bg-[#800000] text-white font-black text-xs tracking-widest uppercase px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#600000]"
            >
              <Plus size={14} /> New user
            </button>
          )}
        </div>

        <form onSubmit={search} className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by username, email, name…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-700"
            />
          </div>
          <button className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-xs font-black px-4 rounded-xl">Search</button>
        </form>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-[10px] uppercase tracking-widest text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Scopes</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading…</td></tr>
              )}
              {!loading && users.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No users found.</td></tr>
              )}
              {users.map((u) => (
                <tr key={u.id} className="align-top">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900 dark:text-white">{u.username}</div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                    {u.full_name && <div className="text-xs text-gray-500">{u.full_name}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                      u.role === 'super_admin' ? 'bg-rose-100 text-[#800000]' :
                      u.role === 'editor' ? 'bg-amber-100 text-amber-800' :
                      u.role === 'faculty' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-gray-100 text-gray-700'
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    {isSuperAdmin && u.role === 'editor' ? (
                      <ScopeEditorRow
                        user={u}
                        allScopes={allScopes}
                        onSaved={(updated) => setUsers((arr) => arr.map((x) => x.id === updated.id ? updated : x))}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {u.scopes?.length === 0 && <span className="text-xs text-gray-400">—</span>}
                        {u.scopes?.map((s) => (
                          <span key={s} className="text-[10px] font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.is_active ? (
                      <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-emerald-100 text-emerald-800">Active</span>
                    ) : (
                      <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-gray-200 text-gray-600">Disabled</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {isSuperAdmin && (
                        <>
                          <button onClick={() => resetPassword(u)} title="Reset password"
                                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                            <KeyRound size={14} />
                          </button>
                          <button onClick={() => toggleActive(u)} title={u.is_active ? 'Deactivate' : 'Reactivate'}
                                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                            {u.is_active ? <PowerOff size={14} /> : <Power size={14} />}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-gray-400 flex items-center gap-1.5">
          <ShieldCheck size={12} /> Scope changes are logged in the audit trail.
        </p>
      </div>

      {drawer && (
        <CreateUserDrawer
          onClose={() => setDrawer(false)}
          allScopes={allScopes}
          onCreated={() => load()}
        />
      )}
    </div>
  );
}

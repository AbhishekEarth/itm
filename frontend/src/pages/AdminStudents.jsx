import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Plus, Trash2, Users, X, Save } from 'lucide-react';
import { usersApi } from '../api/users';
import { errorMessage } from '../api/client';

const BLANK = {
  username: '',
  email: '',
  full_name: '',
  phone: '',
  password: '',
  role: 'student',
  must_change_password: true,
};

function CreateDrawer({ onClose, onCreated }) {
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setSaving(true);
    try {
      // For students we use enrollment number as both username AND default password
      const payload = { ...form, password: form.password || form.username };
      const u = await usersApi.create(payload);
      onCreated(u); onClose();
    } catch (e2) { setErr(errorMessage(e2)); }
    finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={submit} className="relative ml-auto w-full max-w-md bg-white dark:bg-gray-900 h-full overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Register student</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={18} /></button>
        </div>
        {err && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">{err}</div>}
        <div className="grid gap-3">
          {[
            ['username', 'Enrollment No. (e.g. ITM2026CS001) *'],
            ['email', 'Email *', 'email'],
            ['full_name', 'Full name *'],
            ['phone', 'Phone'],
            ['password', 'Initial password (leave blank to use enrollment no.)'],
          ].map(([k, label, type]) => (
            <label key={k} className="block text-xs">
              <span className="block font-bold text-gray-500 mb-1">{label}</span>
              <input type={type || 'text'} required={['username', 'email', 'full_name'].includes(k)}
                     value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                     className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />
            </label>
          ))}
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={form.must_change_password} onChange={(e) => setForm({ ...form, must_change_password: e.target.checked })} />
            Force password change on first login
          </label>
        </div>
        <button disabled={saving} className="mt-5 w-full bg-[#800000] text-white font-black text-xs tracking-widest uppercase py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
          <Save size={14} /> {saving ? 'Saving…' : 'Register student'}
        </button>
      </form>
    </div>
  );
}

export default function AdminStudents() {
  const qc = useQueryClient();
  const [q, setQ] = useState('');
  const [creating, setCreating] = useState(false);

  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['admin-students', q],
    queryFn: () => usersApi.list({ role: 'student', q: q || undefined, limit: 500 }),
  });

  const remove = async (u) => {
    if (!confirm(`Deactivate ${u.username}?`)) return;
    await usersApi.deactivate(u.id);
    qc.invalidateQueries({ queryKey: ['admin-students'] });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <ChevronLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Users size={20} /> Students
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Registered student accounts. Students have read-only access to the public site + their own dashboard.
              </p>
            </div>
          </div>
          <button onClick={() => setCreating(true)} className="bg-[#800000] hover:bg-[#600000] text-white text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl inline-flex items-center gap-2">
            <Plus size={14} /> Register student
          </button>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by enrollment no, email or name…"
          className="w-full mb-4 px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900"
        />

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{errorMessage(error)}</div>}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-[10px] uppercase tracking-widest text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Enrollment No.</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading && <tr><td colSpan={5} className="text-center py-8 text-gray-400 text-xs">Loading…</td></tr>}
              {!isLoading && students.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-400 text-xs">No students yet. Click <strong>Register student</strong> to add one.</td></tr>}
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-mono text-xs text-[#800000]">{s.username}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{s.full_name || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${s.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
                      {s.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(s)} className="text-xs text-gray-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Tip — for bulk imports use the API at <code className="font-mono">POST /api/users</code> with <code className="font-mono">role:"student"</code>.
        </p>
      </div>

      {creating && (
        <CreateDrawer
          onClose={() => setCreating(false)}
          onCreated={() => qc.invalidateQueries({ queryKey: ['admin-students'] })}
        />
      )}
    </div>
  );
}

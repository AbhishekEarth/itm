import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth';
import { errorMessage } from '../../api/client';

export default function ChangePassword() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.new_password.length < 8) return setErr('New password must be at least 8 characters.');
    if (form.new_password !== form.confirm) return setErr('Confirmation does not match.');
    setBusy(true);
    try {
      await authApi.changePassword(form.current_password, form.new_password);
      setDone(true);
      // Force fresh login with the new password so the must_change flag clears.
      setTimeout(() => { logout(); navigate('/login', { replace: true }); }, 1500);
    } catch (e2) {
      setErr(errorMessage(e2));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0606] via-[#800000] to-[#3e0202] p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-[#800000] flex items-center justify-center text-white">
            <KeyRound size={18} />
          </div>
          <div>
            <h1 className="font-black text-lg text-gray-900 dark:text-white">Set a new password</h1>
            <p className="text-xs text-gray-500 mt-0.5">{user?.username} — first-login password rotation</p>
          </div>
        </div>

        {done ? (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 text-center">
            <CheckCircle2 size={28} className="text-emerald-600 mx-auto mb-3" />
            <p className="text-sm text-emerald-900 dark:text-emerald-100">Password changed. Redirecting to login…</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <Field label="Current password" type="password" value={form.current_password} onChange={(v) => setForm({ ...form, current_password: v })} />
            <Field label="New password (≥8 chars)" type="password" value={form.new_password} onChange={(v) => setForm({ ...form, new_password: v })} />
            <Field label="Confirm new password" type="password" value={form.confirm} onChange={(v) => setForm({ ...form, confirm: v })} />
            {err && <div className="text-xs text-red-600 font-semibold">{err}</div>}
            <button disabled={busy} className="w-full bg-gradient-to-r from-rose-600 to-[#800000] text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl disabled:opacity-60">
              {busy ? 'Saving…' : 'Change password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">{label}</span>
      <input type={type} required value={value} onChange={(e) => onChange(e.target.value)} minLength={type === 'password' ? 8 : undefined}
             className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 focus:outline-none focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10" />
    </label>
  );
}

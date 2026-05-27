import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { admissionsApi } from '../api/admissions';
import { errorMessage } from '../api/client';

const PROGRAMMES = ['B.Tech CSE', 'B.Tech IT', 'B.Tech ECE', 'B.Tech ME', 'B.Tech CE', 'BCA', 'BBA', 'MBA', 'M.Tech', 'MCA'];

/**
 * Standalone admission inquiry form. Drop anywhere; submits to
 * POST /api/admissions/leads (no auth) and notifies the admissions team via SMTP.
 */
export default function AdmissionInquiryForm({ className = '' }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', programme_interest: '',
    city: '', state: 'Madhya Pradesh', source: 'website', message: '',
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      await admissionsApi.submitLead(form);
      setDone(true);
    } catch (e2) {
      setErr(errorMessage(e2));
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className={`bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center ${className}`}>
        <CheckCircle2 size={32} className="text-emerald-600 mx-auto mb-3" />
        <h3 className="font-black text-lg text-emerald-900 dark:text-emerald-100">Thank you!</h3>
        <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-1">
          The admissions team will reach out to you shortly. Reference: <span className="font-mono">{form.email}</span>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 sm:p-6 space-y-3 ${className}`}>
      <div>
        <h3 className="font-black text-lg text-[#1a0606] dark:text-white">Talk to admissions</h3>
        <p className="text-xs text-gray-500 mt-0.5">Fill this and we'll get back within 24 hours.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input required placeholder="Your name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
               className="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />
        <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
               className="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />
        <input placeholder="Phone (10 digits)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
               className="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />
        <select value={form.programme_interest} onChange={(e) => setForm({ ...form, programme_interest: e.target.value })}
                className="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]">
          <option value="">Programme of interest</option>
          {PROGRAMMES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
               className="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />
        <input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
               className="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />
      </div>

      <textarea rows={3} placeholder="Tell us how we can help (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />

      {err && <div className="text-xs text-red-600">{err}</div>}

      <button disabled={busy} className="w-full bg-gradient-to-r from-[#a30000] to-[#800000] text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
        <Send size={12} /> {busy ? 'Submitting…' : 'Submit inquiry'}
      </button>
      <p className="text-[10px] text-gray-400 text-center">
        By submitting you consent to be contacted by the ITM Gwalior admissions team.
      </p>
    </form>
  );
}

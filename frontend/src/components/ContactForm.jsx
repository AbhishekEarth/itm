import { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { formsApi } from '../api/admissions';
import { errorMessage } from '../api/client';

/** Generic contact form → POSTs /api/forms/submit. `kind` defaults to "general".
 *  Use kind="grievance" for the grievance form. */
export default function ContactForm({ kind = 'general', className = '', accent = '#800000' }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      await formsApi.submit({ kind, ...form });
      setDone(true);
    } catch (e2) { setErr(errorMessage(e2)); }
    finally { setBusy(false); }
  };

  if (done) {
    return (
      <div className={`bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center ${className}`}>
        <CheckCircle2 size={28} className="text-emerald-600 mx-auto mb-3" />
        <h3 className="font-black text-base text-emerald-900 dark:text-emerald-100">Message received</h3>
        <p className="text-xs text-emerald-800 dark:text-emerald-200 mt-1">We'll respond to {form.email} shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 sm:p-6 space-y-3 ${className}`}>
      <h3 className="font-black text-lg text-[#1a0606] dark:text-white">
        {kind === 'grievance' ? 'Lodge a grievance' : 'Send us a message'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input required placeholder="Your name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
               className="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />
        <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
               className="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
               className="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />
        <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
               className="px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />
      </div>
      <textarea required rows={4} placeholder="Message *" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:outline-none focus:border-[#800000]" />
      {err && <div className="text-xs text-red-600">{err}</div>}
      <button disabled={busy} style={{ background: `linear-gradient(90deg, ${accent}, #5a0000)` }}
              className="w-full text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
        <Send size={12} /> {busy ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
}

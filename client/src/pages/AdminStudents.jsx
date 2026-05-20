import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Plus, Trash2, Users } from 'lucide-react';

const DEPARTMENTS = ['CS', 'IT', 'ECE', 'CE', 'ME', 'MBA', 'ESH'];
const YEARS = ['1st', '2nd', '3rd', '4th'];

const DEPT_COLORS = {
  CS: 'bg-rose-100 text-[#800000]', IT: 'bg-indigo-100 text-indigo-700',
  ECE: 'bg-amber-100 text-amber-700', CE: 'bg-emerald-100 text-emerald-700',
  ME: 'bg-sky-100 text-sky-700', MBA: 'bg-purple-100 text-purple-700', ESH: 'bg-teal-100 text-teal-700',
};

const BLANK = {
  enrollment_no: '', name: '', department: DEPARTMENTS[0],
  year: YEARS[0], batch: '', email: '', phone: '',
};

export default function AdminStudents() {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [tab, setTab] = useState('list');
  const [students, setStudents] = useState([]);
  const [filterDept, setFilterDept] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchStudents = async () => {
    const params = {};
    if (filterDept) params.department = filterDept;
    if (filterYear) params.year = filterYear;
    const res = await axios.get('/api/students/', { params }).catch(() => ({ data: [] }));
    setStudents(res.data);
  };

  useEffect(() => { fetchStudents(); }, [filterDept, filterYear]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    try {
      await axios.post('/api/students/', data, { headers });
      setMsg({ type: 'ok', text: 'Student registered successfully.' });
      setForm(BLANK);
      fetchStudents();
      setTab('list');
    } catch (err) {
      const detail = err.response?.data?.detail;
      setMsg({ type: 'err', text: detail === 'Enrollment number already registered'
        ? 'That enrollment number is already in use.' : 'Failed to add student.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this student?')) return;
    await axios.delete(`/api/students/${id}`, { headers }).catch(() => {});
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617]">

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <Link to="/admin" className="text-gray-400 hover:text-[#800000] transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-indigo-600" />
            <h1 className="font-black text-gray-900 dark:text-white">Student Management</h1>
          </div>
          <div className="ml-auto flex gap-2">
            {['list', 'add'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${
                  tab === t ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                {t === 'list' ? `All (${students.length})` : '+ Add'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── ADD FORM ── */}
        {tab === 'add' && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 space-y-6">
            <h2 className="font-black text-xl text-gray-900 dark:text-white">Register New Student</h2>

            {msg && (
              <div className={`text-sm font-semibold px-4 py-3 rounded-xl ${
                msg.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {msg.text}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Enrollment No *</label>
                <input required value={form.enrollment_no} onChange={e => setForm(f=>({...f,enrollment_no:e.target.value}))}
                  className="field" placeholder="CS2024001" />
              </div>
              <div>
                <label className="field-label">Full Name *</label>
                <input required value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}
                  className="field" placeholder="Aditya Sharma" />
              </div>
              <div>
                <label className="field-label">Department *</label>
                <select required value={form.department} onChange={e => setForm(f=>({...f,department:e.target.value}))} className="field">
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Year *</label>
                <select required value={form.year} onChange={e => setForm(f=>({...f,year:e.target.value}))} className="field">
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Batch *</label>
                <input required value={form.batch} onChange={e => setForm(f=>({...f,batch:e.target.value}))}
                  className="field" placeholder="2024-2028" />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))}
                  className="field" placeholder="student@itmgoi.in" />
              </div>
              <div>
                <label className="field-label">Phone</label>
                <input value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))}
                  className="field" placeholder="+91-9XXXXXXXXX" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs tracking-widest uppercase px-6 py-3 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-60">
                <Plus size={14} /> {loading ? 'Saving…' : 'Register Student'}
              </button>
              <button type="button" onClick={() => setTab('list')}
                className="border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold text-xs tracking-wide px-5 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* ── LIST ── */}
        {tab === 'list' && (
          <div className="space-y-5">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Dept:</span>
              {['', ...DEPARTMENTS].map(d => (
                <button key={d} onClick={() => setFilterDept(d)}
                  className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${
                    filterDept === d ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-indigo-400'}`}>
                  {d || 'All'}
                </button>
              ))}
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Year:</span>
              {['', ...YEARS].map(y => (
                <button key={y} onClick={() => setFilterYear(y)}
                  className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${
                    filterYear === y ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-indigo-400'}`}>
                  {y || 'All'}
                </button>
              ))}
            </div>

            {students.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-12 text-center">
                <Users size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium text-sm">No students found.</p>
                <button onClick={() => setTab('add')} className="mt-4 bg-indigo-600 text-white font-black text-xs tracking-widest uppercase px-5 py-2.5 rounded-xl">
                  + Register First Student
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map(s => (
                  <div key={s.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-black text-sm text-gray-900 dark:text-white tracking-tight">{s.name}</h3>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">{s.enrollment_no}</p>
                      </div>
                      <button onClick={() => handleDelete(s.id)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${DEPT_COLORS[s.department]}`}>
                        {s.department}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        {s.year} Year
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">{s.batch}</span>
                    </div>
                    {s.email && <p className="text-[10px] text-gray-400 mt-2 truncate">{s.email}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        .field-label { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #6b7280; margin-bottom: 5px; }
        .field { width: 100%; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 14px; font-weight: 500; outline: none; transition: border-color 0.15s; background: #fff; color: #111827; }
        .field:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.08); }
        .dark .field-label { color: #9ca3af; }
        .dark .field { border-color: #374151; background: #1f2937; color: #f9fafb; }
        .dark .field:focus { border-color: #4f46e5; }
      `}</style>
    </div>
  );
}

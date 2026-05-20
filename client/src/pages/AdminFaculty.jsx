import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Plus, Trash2, Upload, X, GraduationCap } from 'lucide-react';

const DEPARTMENTS = ['CS', 'IT', 'ECE', 'CE', 'ME', 'MBA', 'ESH'];
const DESIGNATIONS = ['Professor & HOD', 'Professor', 'Associate Professor', 'Assistant Professor'];

const DEPT_COLORS = {
  CS: 'bg-rose-100 text-[#800000]', IT: 'bg-indigo-100 text-indigo-700',
  ECE: 'bg-amber-100 text-amber-700', CE: 'bg-emerald-100 text-emerald-700',
  ME: 'bg-sky-100 text-sky-700', MBA: 'bg-purple-100 text-purple-700', ESH: 'bg-teal-100 text-teal-700',
};

const BLANK = {
  name: '', designation: DESIGNATIONS[3], department: DEPARTMENTS[0],
  qualification: '', experience_years: 0, specialization: '', email: '', phone: '', bio: '',
};

export default function AdminFaculty() {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [tab, setTab] = useState('list');
  const [faculty, setFaculty] = useState([]);
  const [filterDept, setFilterDept] = useState('');
  const [form, setForm] = useState(BLANK);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);   // { type: 'ok'|'err', text }

  const fetchFaculty = async () => {
    const params = filterDept ? { department: filterDept } : {};
    const res = await axios.get('/api/faculty/', { params }).catch(() => ({ data: [] }));
    setFaculty(res.data);
  };

  useEffect(() => { fetchFaculty(); }, [filterDept]);

  const handleImage = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImage(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (image) data.append('image', image);
    try {
      await axios.post('/api/faculty/', data, { headers });
      setMsg({ type: 'ok', text: 'Faculty member added successfully.' });
      setForm(BLANK);
      setImage(null);
      setPreview(null);
      fetchFaculty();
      setTab('list');
    } catch {
      setMsg({ type: 'err', text: 'Failed to add faculty. Make sure you are logged in.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this faculty member?')) return;
    await axios.delete(`/api/faculty/${id}`, { headers }).catch(() => {});
    setFaculty(prev => prev.filter(f => f.id !== id));
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
            <GraduationCap size={18} className="text-[#800000]" />
            <h1 className="font-black text-gray-900 dark:text-white">Faculty Management</h1>
          </div>
          <div className="ml-auto flex gap-2">
            {['list', 'add'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${
                  tab === t ? 'bg-[#800000] text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                {t === 'list' ? `All (${faculty.length})` : '+ Add'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── ADD FORM ── */}
        {tab === 'add' && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 space-y-6">
            <h2 className="font-black text-xl text-gray-900 dark:text-white">Add New Faculty Member</h2>

            {msg && (
              <div className={`text-sm font-semibold px-4 py-3 rounded-xl ${
                msg.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {msg.text}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="field-label">Full Name *</label>
                <input required value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}
                  className="field" placeholder="Dr. Rajesh Kumar" />
              </div>
              {/* Designation */}
              <div>
                <label className="field-label">Designation *</label>
                <select required value={form.designation} onChange={e => setForm(f=>({...f,designation:e.target.value}))} className="field">
                  {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              {/* Department */}
              <div>
                <label className="field-label">Department *</label>
                <select required value={form.department} onChange={e => setForm(f=>({...f,department:e.target.value}))} className="field">
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              {/* Qualification */}
              <div>
                <label className="field-label">Qualification *</label>
                <input required value={form.qualification} onChange={e => setForm(f=>({...f,qualification:e.target.value}))}
                  className="field" placeholder="Ph.D. (Computer Science)" />
              </div>
              {/* Experience */}
              <div>
                <label className="field-label">Experience (years)</label>
                <input type="number" min="0" value={form.experience_years} onChange={e => setForm(f=>({...f,experience_years:+e.target.value}))} className="field" />
              </div>
              {/* Specialization */}
              <div>
                <label className="field-label">Specialization</label>
                <input value={form.specialization} onChange={e => setForm(f=>({...f,specialization:e.target.value}))}
                  className="field" placeholder="Machine Learning & AI" />
              </div>
              {/* Email */}
              <div>
                <label className="field-label">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))}
                  className="field" placeholder="name@itmgoi.in" />
              </div>
              {/* Phone */}
              <div>
                <label className="field-label">Phone</label>
                <input value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))}
                  className="field" placeholder="+91-9XXXXXXXXX" />
              </div>
              {/* Bio */}
              <div className="sm:col-span-2">
                <label className="field-label">Bio (optional)</label>
                <textarea rows={3} value={form.bio} onChange={e => setForm(f=>({...f,bio:e.target.value}))}
                  className="field resize-none" placeholder="A brief professional biography…" />
              </div>
              {/* Photo */}
              <div className="sm:col-span-2">
                <label className="field-label">Profile Photo (optional)</label>
                {preview ? (
                  <div className="relative inline-block">
                    <img src={preview} className="w-24 h-24 rounded-xl object-cover border border-gray-200" />
                    <button type="button" onClick={() => { setImage(null); setPreview(null); }}
                      className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center shadow">
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-gray-200 hover:border-[#800000] rounded-xl p-5 transition-colors">
                    <Upload size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-400 font-medium">Click to upload photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                  </label>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="bg-[#800000] hover:bg-[#6a0000] text-white font-black text-xs tracking-widest uppercase px-6 py-3 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-60">
                <Plus size={14} /> {loading ? 'Saving…' : 'Add Faculty'}
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
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Filter:</span>
              {['', ...DEPARTMENTS].map(d => (
                <button key={d} onClick={() => setFilterDept(d)}
                  className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${
                    filterDept === d ? 'bg-[#800000] text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-[#800000]'}`}>
                  {d || 'All'}
                </button>
              ))}
            </div>

            {faculty.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-12 text-center">
                <GraduationCap size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium text-sm">No faculty members yet.</p>
                <button onClick={() => setTab('add')} className="mt-4 bg-[#800000] text-white font-black text-xs tracking-widest uppercase px-5 py-2.5 rounded-xl">
                  + Add First Faculty
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {faculty.map(f => (
                  <div key={f.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      {f.image_url ? (
                        <img src={f.image_url} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#800000] to-[#3e0202] text-white flex items-center justify-center font-black text-sm shrink-0">
                          {f.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-sm text-gray-900 dark:text-white tracking-tight truncate">{f.name}</h3>
                        <p className="text-[10px] text-gray-500 font-medium truncate">{f.designation}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${DEPT_COLORS[f.department]}`}>
                        {f.department}
                      </span>
                      {f.experience_years > 0 && (
                        <span className="text-[10px] text-gray-400 font-medium">{f.experience_years} yrs</span>
                      )}
                      <button onClick={() => handleDelete(f.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors ml-auto">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {f.email && <p className="text-[10px] text-gray-400 mt-2 truncate">{f.email}</p>}
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
        .field:focus { border-color: #800000; box-shadow: 0 0 0 3px rgba(128,0,0,0.08); }
        .dark .field-label { color: #9ca3af; }
        .dark .field { border-color: #374151; background: #1f2937; color: #f9fafb; }
        .dark .field:focus { border-color: #800000; }
      `}</style>
    </div>
  );
}

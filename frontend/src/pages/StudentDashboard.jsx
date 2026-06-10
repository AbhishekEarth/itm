import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  GraduationCap, BookOpen, Calendar, Phone, Mail,
  LogOut, User, Building2, Hash, Layers, ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45 } }),
};

const DEPT_PATH = { CS: '/cs', IT: '/it', ECE: '/ece', CE: '/ce', ME: '/me', MBA: '/mba', ESH: '/esh' };

export default function StudentDashboard() {
  const { user: localUser, logout } = useAuth();
  const navigate = useNavigate();
  // Fetch fresh /me — picks up latest scopes + profile after backend updates.
  const { data: me } = useQuery({ queryKey: ['me'], queryFn: authApi.me, staleTime: 60_000 });
  const user = me || localUser;

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  if (!user) return null;

  // Derive department from username convention (e.g. ITM2022CS001 → CS) until the schema carries it explicitly.
  const deptCode = (user.username && /ITM\d{4}([A-Z]{2,3})/.exec(user.username)?.[1]) || user.department || '';
  const deptLink = DEPT_PATH[deptCode] || '/';
  const display = user.full_name || user.username;

  const INFO_CARDS = [
    { icon: Hash, label: 'Enrollment No.', value: user.username, accent: 'bg-indigo-50 text-indigo-600' },
    { icon: Building2, label: 'Department', value: deptCode || '—', accent: 'bg-rose-50 text-[#800000]' },
    { icon: Layers, label: 'Role', value: user.role, accent: 'bg-amber-50 text-amber-700' },
    { icon: Calendar, label: 'Batch', value: user.batch || '—', accent: 'bg-emerald-50 text-emerald-700' },
  ];

  const QUICK_LINKS = [
    { label: 'LMS Portal', desc: 'Course material & assignments', href: 'https://lms.itmgoi.in/', accent: 'from-cyan-500 to-blue-600' },
    { label: 'MIS Login', desc: 'Attendance, grades & receipts', href: 'http://mis.itmgoi.in/', accent: 'from-amber-500 to-orange-600' },
    { label: 'My Department', desc: `Explore ${deptCode || 'your'} dept.`, to: deptLink, accent: 'from-indigo-500 to-violet-700' },
    { label: 'Onboarding', desc: 'New student checklist', to: '/onboarding', accent: 'from-rose-500 to-[#800000]' },
  ];

  return (
    <div className="min-h-screen bg-[#fbf7f2]">

      {/* Header bar */}
      <div className="bg-gradient-to-r from-[#3e0202] via-[#6b0000] to-[#800000] text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <GraduationCap size={20} />
            </div>
            <div>
              <p className="font-black text-sm">Student Portal</p>
              <p className="text-red-200/60 text-xs">ITM Gwalior</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Welcome */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center text-white shrink-0">
            {user.image_url
              ? <img src={user.image_url} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
              : <User size={36} />}
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-1">Welcome back</p>
            <h1 className="text-2xl md:text-3xl font-black text-[#3e0202] tracking-tight">{display}</h1>
            <p className="text-gray-500 text-sm mt-1">{user.username} · {deptCode || 'Student'} · {user.email}</p>
          </div>
        </motion.div>

        {/* Info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INFO_CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div key={c.label} variants={fadeUp} initial="hidden" animate="visible" custom={i * 0.5 + 1}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${c.accent}`}>
                  <Icon size={17} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{c.label}</p>
                <p className="font-black text-[#3e0202] text-sm">{c.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Contact info */}
        {(user.email || user.phone) && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-wrap gap-6">
            {user.email && (
              <a href={`mailto:${user.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#800000] transition-colors">
                <Mail size={15} className="text-[#800000]" /> {user.email}
              </a>
            )}
            {user.phone && (
              <a href={`tel:${user.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#800000] transition-colors">
                <Phone size={15} className="text-[#800000]" /> {user.phone}
              </a>
            )}
          </motion.div>
        )}

        {/* Quick links */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#800000] mb-4">Quick Access</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUICK_LINKS.map((l, i) => {
              const inner = (
                <div className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${l.accent} flex items-center justify-center text-white shrink-0`}>
                    <BookOpen size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[#3e0202] group-hover:text-[#800000] transition-colors text-sm">{l.label}</p>
                    <p className="text-gray-400 text-xs truncate">{l.desc}</p>
                  </div>
                  <ArrowRight size={15} className="text-gray-300 group-hover:text-[#800000] transition-colors shrink-0" />
                </div>
              );
              return l.href
                ? <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{inner}</a>
                : <Link key={l.label} to={l.to}>{inner}</Link>;
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

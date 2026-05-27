import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Mail, LogIn, Eye, EyeOff, Shield, GraduationCap, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth';
import { errorMessage } from '../api/client';

const ROLES = [
  {
    id: 'admin',
    label: 'Admin',
    icon: Shield,
    userField: 'Username',
    userPlaceholder: 'admin',
    pwPlaceholder: '••••••••',
    hint: 'Super-admin or scoped editor account',
    accent: 'from-rose-600 to-[#800000]',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-[#800000]',
    matchRoles: ['super_admin', 'editor', 'admin'],
    redirectByRole: { super_admin: '/admin', editor: '/admin', admin: '/admin' },
  },
  {
    id: 'student',
    label: 'Student',
    icon: GraduationCap,
    userField: 'Enrollment No.',
    userPlaceholder: 'e.g. ITM2022CS001',
    pwPlaceholder: '(default: your enrollment no.)',
    hint: 'Default password = your enrollment number',
    accent: 'from-indigo-500 to-violet-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    matchRoles: ['student'],
    redirectByRole: { student: '/student/dashboard' },
  },
  {
    id: 'faculty',
    label: 'Faculty',
    icon: BookOpen,
    userField: 'Email',
    userPlaceholder: 'your@itmgoi.in',
    pwPlaceholder: '(default: faculty@123)',
    hint: 'Default password = faculty@123',
    accent: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    matchRoles: ['faculty'],
    redirectByRole: { faculty: '/faculty/dashboard' },
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState('admin');
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const role = ROLES.find(r => r.id === activeRole);
  const Icon = role.icon;

  const switchRole = (id) => {
    setActiveRole(id);
    setForm({ username: '', password: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login(form.username, form.password);
      if (!role.matchRoles.includes(data.role)) {
        setError(`This account is a ${data.role}. Please use the ${data.role} tab.`);
        setLoading(false);
        return;
      }
      login(data);
      const target = role.redirectByRole[data.role] || '/';
      navigate(target, { replace: true });
    } catch (err) {
      setError(errorMessage(err) || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0606] via-[#800000] to-[#3e0202] flex items-center justify-center p-4">

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/images/ITMGOILogo.png" alt="ITM Logo" className="h-14 mx-auto mb-4 drop-shadow-lg" />
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight">ITM Gwalior Portal</h1>
          <p className="text-red-200/60 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Role selector tabs */}
        <div className="flex gap-2 mb-4 bg-white/10 p-1 rounded-2xl backdrop-blur">
          {ROLES.map(r => {
            const RIcon = r.icon;
            const active = r.id === activeRole;
            return (
              <button
                key={r.id}
                onClick={() => switchRole(r.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  active ? 'bg-white text-[#800000] shadow-md' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <RIcon size={13} />
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Form card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8">

              {/* Role header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.accent} flex items-center justify-center text-white`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="font-black text-[#3e0202] text-base">{role.label} Sign In</p>
                  <p className="text-gray-400 text-xs">{role.hint}</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username / Enrollment / Email */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                    {role.userField}
                  </label>
                  <div className="relative">
                    {activeRole === 'faculty' ? (
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    ) : (
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    )}
                    <input
                      type={activeRole === 'faculty' ? 'email' : 'text'}
                      required
                      autoComplete="username"
                      value={form.username}
                      onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                      className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 transition"
                      placeholder={role.userPlaceholder}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 transition"
                      placeholder={role.pwPlaceholder}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r ${role.accent} text-white font-black text-[11px] tracking-widest uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 transition-opacity disabled:opacity-60 shadow-md hover:shadow-lg`}
                >
                  {loading ? 'Signing in…' : <><LogIn size={14} /> Sign In as {role.label}</>}
                </button>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-red-200/40 text-xs mt-6">
          <Link to="/" className="hover:text-red-200 transition-colors">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap, Users, Calendar, Image, Music,
  LogOut, ChevronRight, LayoutDashboard, Plus, ShieldCheck,
  Settings as SettingsIcon, FileText, ImageIcon, Building2, Briefcase, FlaskConical, CalendarDays, Images, Inbox, Scale,
  FilePlus2
} from 'lucide-react';
import AgentKnowledgePanel from '../components/admin/AgentKnowledgePanel';

function StatCard({ icon: Icon, label, value, color, to }) {
  return (
    <Link to={to} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md p-6 flex items-center gap-4 transition-all hover:-translate-y-0.5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{value ?? '—'}</p>
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mt-0.5">{label}</p>
      </div>
      <ChevronRight size={16} className="text-gray-300 group-hover:text-[#800000] group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

function ActionCard({ icon: Icon, label, desc, to, accent }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg p-6 transition-all hover:-translate-y-1 block"
    >
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 ${accent}`} />
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${accent}`}>
        <Icon size={20} className="text-white" />
      </div>
      <h3 className="font-black text-base text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
        {label}
        <Plus size={14} className="text-gray-300 group-hover:text-[#800000] transition-colors" />
      </h3>
      <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">{desc}</p>
    </Link>
  );
}

// Cards as data, each tagged with its scope prefix. Admins see everything; an
// editor with scopes ['dept.me','gallery'] sees only cards whose prefix is
// matched by one of their scopes (i.e. dept.* + gallery here).
const STAT_CARDS = [
  { key: 'faculty',    icon: GraduationCap, label: 'Faculty Members',  to: '/admin/faculty',    color: 'bg-gradient-to-br from-[#800000] to-[#3e0202]',  scopePrefix: 'faculty', statKey: 'faculty'   },
  { key: 'students',   icon: Users,         label: 'Students',         to: '/admin/students',   color: 'bg-gradient-to-br from-indigo-500 to-indigo-700', scopePrefix: 'students', statKey: 'students' },
  { key: 'tap',        icon: Calendar,      label: 'TAP Events',       to: '/admin/tap',        color: 'bg-gradient-to-br from-emerald-500 to-teal-700',  scopePrefix: 'placements', statKey: 'events' },
  { key: 'pac',        icon: Music,         label: 'PAC Events',       to: '/admin/pac',        color: 'bg-gradient-to-br from-amber-500 to-orange-600',  scopePrefix: 'events', statKey: 'pac'      },
  { key: 'placements', icon: Image,         label: 'Placement Logos',  to: '/admin/placements', color: 'bg-gradient-to-br from-rose-500 to-pink-700',     scopePrefix: 'placements', statKey: 'placements' },
];

const ACTION_CARDS = [
  { key: 'faculty',          icon: GraduationCap, label: 'Faculty',                 desc: 'Add, view and remove faculty members by department.',      to: '/admin/faculty',          accent: 'bg-gradient-to-br from-[#800000] to-[#3e0202]',   scopePrefix: 'faculty' },
  { key: 'students',         icon: Users,         label: 'Students',                desc: 'Register students, filter by year and department.',         to: '/admin/students',         accent: 'bg-gradient-to-br from-indigo-500 to-indigo-700', scopePrefix: 'students' },
  { key: 'tap',              icon: Calendar,      label: 'TAP Events',              desc: 'Post upcoming campus drives, internships and talks.',       to: '/admin/tap',              accent: 'bg-gradient-to-br from-emerald-500 to-teal-700',  scopePrefix: 'placements' },
  { key: 'pac',              icon: Music,         label: 'PAC Events',              desc: 'Upload cultural event highlights with gallery images.',     to: '/admin/pac',              accent: 'bg-gradient-to-br from-amber-500 to-orange-600',  scopePrefix: 'events' },
  { key: 'placements',       icon: Image,         label: 'Placements',              desc: 'Upload recruiter logos shown on the placements page.',     to: '/admin/placements',       accent: 'bg-gradient-to-br from-rose-500 to-pink-700',     scopePrefix: 'placements' },
  { key: 'users',            icon: ShieldCheck,   label: 'Users & Scopes',          desc: 'Create scoped editors (CS dept, placement cell, etc.).',   to: '/admin/users',            accent: 'bg-gradient-to-br from-violet-500 to-fuchsia-700', adminOnly: true },
  { key: 'pages',            icon: FileText,      label: 'Pages & SEO',             desc: 'Edit page sections + meta title/description/OG image.',    to: '/admin/pages',            accent: 'bg-gradient-to-br from-sky-500 to-blue-700',      scopePrefix: 'site' },
  { key: 'pages-new',        icon: FilePlus2,     label: 'Create New Page',         desc: 'Add a brand-new page to any section.',                     to: '/admin/pages/new',        accent: 'bg-gradient-to-br from-amber-500 to-rose-600',    scopePrefix: 'site' },
  { key: 'settings',         icon: SettingsIcon,  label: 'Site Settings',           desc: 'Logo, brand color, contact, social, default SEO.',         to: '/admin/settings',         accent: 'bg-gradient-to-br from-slate-500 to-slate-700',   adminOnly: true },
  { key: 'media',            icon: ImageIcon,     label: 'Media Library',           desc: 'Upload & manage images, PDFs and brochures.',              to: '/admin/media',            accent: 'bg-gradient-to-br from-fuchsia-500 to-purple-700', scopePrefix: 'gallery' },
  { key: 'departments',      icon: Building2,     label: 'Departments',             desc: 'CS / ECE / IT / CE / ME / MBA / ESH — HoD, faculty, labs.', to: '/admin/departments',      accent: 'bg-gradient-to-br from-emerald-500 to-teal-700',  scopePrefix: 'dept' },
  { key: 'placements-cell',  icon: Briefcase,     label: 'Placement Cell',          desc: 'Recruiters, TAP team, services, MoUs, testimonials, events.', to: '/admin/placements-cell', accent: 'bg-gradient-to-br from-orange-500 to-red-700',    scopePrefix: 'placements' },
  { key: 'research',         icon: FlaskConical,  label: 'Research Suite',          desc: 'Focus areas, publications, books, patents, journal, conferences, FDPs.', to: '/admin/research',  accent: 'bg-gradient-to-br from-cyan-500 to-blue-700',     scopePrefix: 'research' },
  { key: 'events',           icon: CalendarDays,  label: 'Events & Notices',        desc: 'Events, clubs/cells, notices, ticker announcements.',      to: '/admin/events',           accent: 'bg-gradient-to-br from-emerald-500 to-green-700', scopePrefix: 'events' },
  { key: 'gallery',          icon: Images,        label: 'Gallery',                 desc: 'Categories + multi-image upload + captions + videos.',    to: '/admin/gallery',          accent: 'bg-gradient-to-br from-pink-500 to-fuchsia-700',  scopePrefix: 'gallery' },
  { key: 'leads',            icon: Inbox,         label: 'Leads & Inbox',           desc: 'Admission leads, contact, grievance, job applications.',  to: '/admin/leads',            accent: 'bg-gradient-to-br from-yellow-500 to-orange-700', scopePrefix: 'admissions' },
  { key: 'compliance',       icon: Scale,         label: 'Compliance · Alumni · About', desc: 'NAAC, NIRF, committees, board, officials, alumni.',  to: '/admin/compliance',       accent: 'bg-gradient-to-br from-teal-500 to-cyan-700',     scopePrefix: 'compliance' },
];

export default function AdminDashboard() {
  const { logout, token, isAdmin, isEditor, scopes } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});

  // Admins see every card; editors see only cards matching their scopes
  // (same matching as the sidebar: scope === prefix OR scope.startsWith(prefix + '.')).
  const hasAnyScope = useMemo(() => {
    return (prefix) => {
      if (isAdmin) return true;
      if (!prefix) return false;
      return (scopes || []).some((s) => s === prefix || s.startsWith(prefix + '.'));
    };
  }, [isAdmin, scopes]);

  const visibleStatCards = useMemo(
    () => STAT_CARDS.filter((c) => isAdmin || hasAnyScope(c.scopePrefix)),
    [isAdmin, hasAnyScope]
  );

  const visibleActionCards = useMemo(
    () => ACTION_CARDS.filter((c) => {
      if (c.adminOnly) return isAdmin;
      if (isAdmin) return true;
      return hasAnyScope(c.scopePrefix);
    }),
    [isAdmin, hasAnyScope]
  );

  useEffect(() => {
    if (!isAdmin) return; // editors don't need global stats counts
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get('/api/faculty/', { headers }).catch(() => ({ data: [] })),
      axios.get('/api/students/', { headers }).catch(() => ({ data: [] })),
      axios.get('/api/events/all').catch(() => ({ data: { upcoming: [], past: [] } })),
      axios.get('/api/pac/all').catch(() => ({ data: [] })),
      axios.get('/api/placements/all').catch(() => ({ data: [] })),
    ]).then(([fac, stu, ev, pac, pl]) => {
      setStats({
        faculty: fac.data.length,
        students: stu.data.length,
        events: (ev.data.upcoming?.length ?? 0) + (ev.data.past?.length ?? 0),
        pac: pac.data.length,
        placements: pl.data.length,
      });
    });
  }, [token, isAdmin]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617]">

      {/* Top bar */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#800000] to-[#3e0202] flex items-center justify-center">
              <LayoutDashboard size={14} className="text-white" />
            </div>
            <span className="font-black text-sm text-gray-900 dark:text-white tracking-tight">ITM Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#800000] transition-colors"
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* Hero */}
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {isAdmin
              ? 'Manage all content for the ITM Gwalior website.'
              : 'Edit the sections you have access to.'}
          </p>
        </div>

        {/* AI Agent knowledge sync — admin-only (global reindex affects whole site) */}
        {isAdmin && <AgentKnowledgePanel />}

        {/* Stats grid — admins only; editors don't need global counts */}
        {isAdmin && visibleStatCards.length > 0 && (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleStatCards.map((c) => (
                <StatCard
                  key={c.key}
                  icon={c.icon}
                  label={c.label}
                  value={stats[c.statKey]}
                  color={c.color}
                  to={c.to}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick actions — filtered by scope */}
        <div>
          <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">
            {isAdmin ? 'Manage Sections' : 'Your Sections'}
          </h2>
          {visibleActionCards.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-sm text-gray-500 font-medium">
                You don't have access to any sections yet. Ask a super admin to grant you scopes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleActionCards.map((c) => (
                <ActionCard
                  key={c.key}
                  icon={c.icon}
                  label={c.label}
                  desc={c.desc}
                  to={c.to}
                  accent={c.accent}
                />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

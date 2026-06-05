import React, { useState, useEffect } from 'react';
import {
  MessageCircle, Phone, Mail, GraduationCap, ChevronUp, Sparkles, X, Bell,
  Megaphone, Trophy, CalendarDays, BookOpen,
} from 'lucide-react';

const NOTIFICATIONS = [
  {
    icon: Megaphone,
    color: "from-rose-500 to-[#800000]",
    title: "Admissions 2026 — Now Open",
    body: "Online applications for B.Tech, MBA & PG programmes are live. Apply before 30 June 2026.",
    time: "2h ago",
    fresh: true,
  },
  {
    icon: Trophy,
    color: "from-amber-500 to-orange-600",
    title: "Placement Update",
    body: "Microsoft, Infosys and TCS placed 240+ students in the latest drive. Avg CTC up 18%.",
    time: "Yesterday",
    fresh: true,
  },
  {
    icon: CalendarDays,
    color: "from-emerald-500 to-teal-700",
    title: "KRONOS Techno-Cultural Fest",
    body: "Annual fest registrations open till 15 August. 30+ events, 80+ college teams.",
    time: "3 days ago",
  },
  {
    icon: BookOpen,
    color: "from-sky-500 to-blue-700",
    title: "FDP on Generative AI",
    body: "5-day Faculty Development Program from 12–16 August. Microsoft Learn certified track.",
    time: "1 week ago",
  },
];

const FloatingSidebar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  useEffect(() => {
    if (notifOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [notifOpen]);

  const openNotifications = () => {
    setNotifOpen(true);
    setMobileOpen(false);
  };

  const freshCount = NOTIFICATIONS.filter((n) => n.fresh).length;

  const actions = [
    {
      icon: <Bell size={22} className="animate-wiggle" strokeWidth={2.4} />,
      label: "What's New",
      onClick: openNotifications,
      color: "text-white",
      featured: true,
      count: freshCount,
    },
    { icon: <MessageCircle size={20} />, label: "WhatsApp", link: "https://wa.me/917773005065", color: "hover:text-green-400" },
    { icon: <Phone size={20} />, label: "Call Us", link: "tel:+917773005065", color: "hover:text-blue-400" },
    { icon: <Mail size={20} />, label: "Inquiry", link: "/contact", color: "hover:text-amber-400" },
    { icon: <GraduationCap size={20} />, label: "Apply Now", link: "/admissions/how-to-apply", color: "hover:text-red-400" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActionInner = (action) => {
    if (action.featured) {
      return (
        <>
          {/* Outward ping ring — draws the eye */}
          <span className="absolute inset-0 rounded-full bg-rose-400/60 animate-ping" />

          {/* "NEW · N" chip — always visible, sits to the left of the button */}
          <span className="absolute right-full mr-3 flex items-center gap-1 px-2 py-1
                           bg-gradient-to-r from-amber-300 to-amber-400 text-[#3e0202]
                           text-[9px] font-black uppercase tracking-[0.18em]
                           rounded-md shadow-lg whitespace-nowrap select-none
                           ring-1 ring-amber-200/80">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            {action.count > 0 ? `${action.count} New` : "New"}
          </span>

          <div className={`relative ${action.color}`}>
            {action.icon}
          </div>
        </>
      );
    }
    return (
      <>
        <span className="absolute right-full mr-4 px-3 py-1
                         bg-slate-900 text-white text-[10px] font-bold tracking-widest uppercase
                         rounded-md opacity-0 -translate-x-2
                         group-hover:opacity-100 group-hover:translate-x-0
                         transition-all duration-200 pointer-events-none whitespace-nowrap">
          {action.label}
        </span>

        <div className={`transition-colors duration-300 ${action.color}`}>
          {action.icon}
        </div>

        {action.badge && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-2.5 h-2.5">
            <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-75" />
            <span className="relative inline-block w-2 h-2 rounded-full bg-rose-500" />
          </span>
        )}
      </>
    );
  };

  const desktopBtnClass = (action) => action.featured
    ? `group relative flex items-center justify-center w-14 h-14
       bg-gradient-to-br from-[#a30000] via-[#800000] to-[#3e0202]
       text-white border-2 border-amber-300/60
       rounded-full shadow-2xl animate-glow-pulse
       transition-transform duration-300
       hover:scale-110 active:scale-95`
    : `group relative flex items-center justify-center w-12 h-12
       bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl
       text-slate-300 border border-white/10
       rounded-full shadow-2xl transition-all duration-300
       hover:w-14 hover:rounded-2xl hover:-translate-x-1`;

  return (
    <>
      {/* DESKTOP — vertical floating bar pinned to right-middle */}
      <div className="hidden sm:flex fixed right-4 top-1/2 -translate-y-1/2 z-[100] flex-col gap-4 items-end">
        {actions.map((action, index) =>
          action.onClick ? (
            <button key={index} type="button" onClick={action.onClick} className={desktopBtnClass(action)}>
              {renderActionInner(action)}
            </button>
          ) : (
            <a key={index} href={action.link} className={desktopBtnClass(action)}>
              {renderActionInner(action)}
            </a>
          )
        )}

        <button
          onClick={scrollToTop}
          className={`flex items-center justify-center w-12 h-12
                     bg-indigo-600 text-white rounded-full shadow-lg
                     transition-all duration-500 transform
                     ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
                     hover:bg-indigo-500 hover:scale-110 active:scale-95`}
        >
          <ChevronUp size={24} />
        </button>
      </div>

      {/* MOBILE — single FAB bottom-right that expands the actions */}
      <div className="sm:hidden fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-3">
        {actions.map((action, index) => {
          const pillBase = `relative flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full
                       text-white text-[11px] font-bold tracking-widest uppercase
                       shadow-2xl transition-all duration-300`;
          const pillVisibility = mobileOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none';
          const pillSkin = action.featured
            ? `bg-gradient-to-r from-[#a30000] via-[#800000] to-[#3e0202]
               border-2 border-amber-300/60 ring-2 ring-rose-400/30 animate-glow-pulse`
            : `bg-slate-900/95 dark:bg-white/10 backdrop-blur-xl
               border border-white/10`;
          const pillClass = `${pillBase} ${pillSkin} ${pillVisibility}`;
          const inner = (
            <>
              <span className={`flex items-center justify-center w-7 h-7 rounded-full ${action.featured ? 'bg-amber-300/20' : 'bg-white/10'} ${action.color}`}>
                {action.icon}
              </span>
              {action.label}
              {action.featured && (
                <span className="ml-1 px-1.5 py-0.5 rounded-md bg-amber-300 text-[#3e0202] text-[8px] font-black tracking-[0.18em]">
                  {action.count > 0 ? `${action.count} NEW` : "NEW"}
                </span>
              )}
              {action.badge && !action.featured && (
                <span className="flex items-center justify-center w-2 h-2 ml-1">
                  <span className="absolute w-2 h-2 rounded-full bg-rose-500 animate-ping opacity-75" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-rose-500" />
                </span>
              )}
            </>
          );
          return action.onClick ? (
            <button
              key={index}
              type="button"
              onClick={() => { action.onClick(); }}
              className={pillClass}
              style={{ transitionDelay: mobileOpen ? `${index * 40}ms` : '0ms' }}
            >
              {inner}
            </button>
          ) : (
            <a
              key={index}
              href={action.link}
              onClick={() => setMobileOpen(false)}
              className={pillClass}
              style={{ transitionDelay: mobileOpen ? `${index * 40}ms` : '0ms' }}
            >
              {inner}
            </a>
          );
        })}

        {/* Back to Top — appears above the FAB when scrolled */}
        <button
          onClick={scrollToTop}
          className={`flex items-center justify-center w-11 h-11 rounded-full
                     bg-indigo-600 text-white shadow-lg
                     transition-all duration-500
                     ${isVisible && !mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
          <ChevronUp size={20} />
        </button>

        {/* Main FAB */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close quick actions" : "Open quick actions"}
          className={`relative flex items-center justify-center w-11 h-11 rounded-full
                     bg-gradient-to-br from-[#a30000] to-[#800000] text-white shadow-2xl
                     ring-2 ring-amber-300/40 transition-all duration-300
                     active:scale-95`}
        >
          {mobileOpen ? <X size={18} /> : <Sparkles size={18} strokeWidth={2.4} />}
          {!mobileOpen && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-2.5 h-2.5">
              <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-75" />
              <span className="relative inline-block w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#800000]" />
            </span>
          )}
        </button>
      </div>

      {/* NOTIFICATIONS PANEL — right-side drawer, shared mobile + desktop */}
      <div
        onClick={() => setNotifOpen(false)}
        className={`fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm transition-opacity duration-300
                    ${notifOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!notifOpen}
      />
      <aside
        role="dialog"
        aria-label="Notifications"
        aria-hidden={!notifOpen}
        className={`fixed top-0 right-0 z-[120] h-full w-full sm:w-[400px]
                    bg-white dark:bg-[#0a0e1a] shadow-2xl
                    flex flex-col
                    transition-transform duration-300 ease-out
                    ${notifOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="relative px-5 py-4 bg-gradient-to-r from-[#3e0202] via-[#800000] to-[#5a0000] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 border border-white/20">
                <Bell size={16} />
              </span>
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-200">Latest</div>
                <h3 className="text-base font-black tracking-tight">What&apos;s New at ITM</h3>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotifOpen(false)}
              aria-label="Close notifications"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {NOTIFICATIONS.map((n, i) => {
            const Icon = n.icon;
            return (
              <div
                key={i}
                className="group relative flex gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:shadow-md transition-shadow"
              >
                <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${n.color} text-white shadow-sm`}>
                  <Icon size={18} strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-black tracking-tight text-[#1a0606] dark:text-white leading-tight">
                      {n.title}
                    </h4>
                    {n.fresh && (
                      <span className="shrink-0 mt-0.5 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-2">
                    {n.body}
                  </p>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {n.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03]">
          <button
            type="button"
            onClick={() => setNotifOpen(false)}
            className="w-full text-center text-[10px] font-black uppercase tracking-[0.25em] text-[#800000] dark:text-rose-300 hover:text-[#5a0000] transition-colors"
          >
            View all updates →
          </button>
        </div>
      </aside>
    </>
  );
};

export default FloatingSidebar;

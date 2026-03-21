import React from 'react';
import Card from './Card';
import DepartmentSidebar from './DepartmentSidebar';

export default function PageLayout({ 
  name, 
  shortName, 
  badge, 
  subtitle, 
  chips = [], 
  menuItems = [], 
  activeTab, 
  setActiveTab, 
  children 
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] transition-colors duration-500">
      
      {/* ── HERO BANNER ──────────────────────────────────────────── */}
      {/* Removed fixed pt-16 and relative positioning for cleaner flow */}
      <div className="bg-gradient-to-br from-[#3e0202] via-[#800000] to-[#5a0000] py-16 md:py-24 overflow-hidden relative">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-8 right-32 w-72 h-72 rounded-full border-2 border-white"></div>
          <div className="absolute -bottom-20 -left-10 w-96 h-96 rounded-full border border-white/50"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white/20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          {badge && (
            <span className="inline-block text-red-200 font-bold tracking-widest text-xs uppercase mb-3 px-3 py-1 bg-white/10 rounded-full border border-white/20">
              {badge}
            </span>
          )}
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-tight">
             {/* Handle multi-line name if needed */}
             {name}
          </h1>
          
          <p className="text-red-100/80 max-w-xl text-sm leading-relaxed font-medium">
            {subtitle}
          </p>

          {/* Quick-stat chips */}
          <div className="mt-8 flex flex-wrap gap-3">
            {chips.map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold">
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────── */}
      {/* FIX: Removed -mt-10 and replaced with proper pt-12 (padding-top) 
          Using a Grid layout for consistent sidebar/content spacing
      */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        <div className={`grid ${menuItems.length > 0 ? 'lg:grid-cols-4' : 'grid-cols-1'} gap-8 items-start`}>

          {/* ── SIDEBAR ──────────────────────────────────────────── */}
          {menuItems.length > 0 && (
            <aside className="lg:col-span-1">
              <DepartmentSidebar 
                menuItems={menuItems} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
            </aside>
          )}

          {/* ── MAIN CONTENT ─────────────────────────────────────── */}
          <main className={`${menuItems.length > 0 ? 'lg:col-span-3' : ''} space-y-8`}>
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}

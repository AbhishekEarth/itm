import React from 'react';
import Card from './Card';

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
        <div className="grid lg:grid-cols-4 gap-8 items-start">

          {/* ── SIDEBAR ──────────────────────────────────────────── */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32">
              <Card className="overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#800000] via-red-500 to-[#800000]"></div>
                <div className="p-5">
                  <h3 className="font-black text-xs uppercase tracking-widest mb-4 text-[#800000]">
                    {shortName || 'Department'} Menu
                  </h3>
                  <nav className="flex flex-col gap-1">
                    {menuItems.map((item) => (
                      <button
                        key={item}
                        onClick={() => setActiveTab(item)}
                        className={`text-left py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 ${
                          activeTab === item
                            ? 'bg-[#800000] text-white shadow-md shadow-red-900/30'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-[#800000] dark:hover:text-red-400'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </nav>
                </div>
              </Card>
            </div>
          </aside>

          {/* ── MAIN CONTENT ─────────────────────────────────────── */}
          <main className="lg:col-span-3 space-y-8">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}

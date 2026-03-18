import React from 'react';

export default function CSDepartment() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] transition-colors duration-500 pt-32">
      <div className="max-w-7xl mx-auto px-6 pb-20">
        
        {/* Header Section */}
        <div className="mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">NBA Accredited 2022-2025</span>
          <h1 className="text-4xl md:text-6xl font-black text-[#0b2a4a] dark:text-white mt-2 tracking-tighter">
            Computer Science & <br /> Engineering
          </h1>
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 space-y-2">
            <div className="sticky top-32 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800">
              <h3 className="font-black text-xs uppercase tracking-widest mb-6 text-blue-600">Department Menu</h3>
              <nav className="flex flex-col gap-3">
                {['About Department', 'HoD Desk', 'Course', 'Laboratories', 'Faculty', 'Placement', 'OBE'].map((item) => (
                  <button key={item} className="text-left py-2 px-4 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600 transition-all">
                    {item}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-16">
            
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-black text-[#0b2a4a] dark:text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-blue-600 rounded-full"></span> About Department
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                The Discipline of Computer Science and Engineering (CSE) was set up in July 1997. It is one of the disciplines that offers Bachelor of Technology (B.Tech), Master of Technology (M.Tech.) programmes. The discipline adopts a modern approach to teaching wherein students are rendered in adequate academic freedom to innovate and learn in the process. 
              </p>
            </section>

            {/* Vision & Mission Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-500/20">
                <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Vision</h3>
                <p className="text-blue-50 text-sm leading-relaxed">
                  The department envisions nurturing students to become technologically proficient, research competent and socially accountable for the welfare of the society.
                </p>
              </div>
              <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-xl">
                <h3 className="text-xl font-black mb-4 uppercase tracking-tight text-[#0b2a4a] dark:text-blue-400">Mission</h3>
                <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-3 list-disc pl-4">
                  <li>High quality education through effective teaching-learning process.</li>
                  <li>Build scientifically strong engineers for industry and startups.</li>
                  <li>Behavioral ethics for the betterment of society.</li>
                </ul>
              </div>
            </div>

            {/* HoD Desk */}
            <section className="bg-gray-50 dark:bg-gray-900/30 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/50 rounded-full flex-shrink-0 flex items-center justify-center text-4xl">🎓</div>
                <div>
                  <h2 className="text-2xl font-black text-[#0b2a4a] dark:text-white mb-4 italic">"Welcome to the Future of Computing"</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic">
                    I warmly welcome you to the Department of Computer Science & Engineering. We pride ourselves on providing pioneering visionaries of tomorrow, conducting cutting-edge research, and leading a wide range of initiatives that affirm the transformative power of informatics.
                  </p>
                  <p className="mt-6 font-black text-[#0b2a4a] dark:text-white">— Head of Department</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
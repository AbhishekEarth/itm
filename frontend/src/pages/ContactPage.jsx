import React from "react";
import { Phone, Mail, MapPin, GraduationCap, Building2, Globe2, Clock, ExternalLink } from "lucide-react";
import PageShell, { SectionTitle, Card, Prose } from "./_PageShell";

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact ITM Gwalior"
      title="Visit us. Call us."
      accentTitle="Write to us."
      intro="The ITM Gwalior campus is on NH-75, opposite Sithouli Railway Station — nine kilometres from the city centre, easy access by road and rail. Use any of the channels below."
      chips={["NH-75 Sithouli", "M.P. India", "Open Mon–Sat"]}
    >
      {/* Quick contact cards */}
      <section className="grid md:grid-cols-3 gap-5">
        <Card>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#800000] to-[#3e0202] text-amber-200 flex items-center justify-center shadow-md mb-4">
            <GraduationCap size={22} />
          </div>
          <h3 className="font-black text-lg text-[#1a0606] dark:text-white mb-1">Admissions</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">For prospective students and parents</p>
          <ul className="space-y-1.5 text-sm font-bold">
            <li><a href="tel:+917773005065" className="text-[#800000] dark:text-amber-300 hover:underline">+91-77730 05065</a></li>
            <li><a href="tel:+917773001624" className="text-[#800000] dark:text-amber-300 hover:underline">+91-77730 01624</a></li>
            <li><a href="tel:+917773001627" className="text-[#800000] dark:text-amber-300 hover:underline">+91-77730 01627</a></li>
          </ul>
          <a href="mailto:admission@itmgoi.in" className="inline-flex items-center gap-2 mt-4 text-[12px] font-bold text-gray-600 dark:text-gray-400 hover:text-[#800000] dark:hover:text-amber-300 transition-colors">
            <Mail size={13} /> admission@itmgoi.in
          </a>
        </Card>
        <Card>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 text-white flex items-center justify-center shadow-md mb-4">
            <Phone size={22} />
          </div>
          <h3 className="font-black text-lg text-[#1a0606] dark:text-white mb-1">General Office</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">Reception, registrar, accounts</p>
          <ul className="space-y-1.5 text-sm font-bold">
            <li><a href="tel:+917512440056" className="text-[#800000] dark:text-amber-300 hover:underline">+91-751-2440056</a></li>
            <li><a href="tel:+917512432977" className="text-[#800000] dark:text-amber-300 hover:underline">+91-751-2432977</a></li>
          </ul>
          <div className="inline-flex items-center gap-2 mt-4 text-[12px] font-bold text-gray-600 dark:text-gray-400">
            <Clock size={13} /> Mon–Sat · 9:30 – 17:30
          </div>
        </Card>
        <Card>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white flex items-center justify-center shadow-md mb-4">
            <Mail size={22} />
          </div>
          <h3 className="font-black text-lg text-[#1a0606] dark:text-white mb-1">Email</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">By department</p>
          <ul className="space-y-1.5 text-sm font-bold">
            <li><a href="mailto:admission@itmgoi.in" className="text-[#800000] dark:text-amber-300 hover:underline break-all">admission@itmgoi.in</a></li>
            <li><a href="mailto:alumni@itmgoi.in" className="text-[#800000] dark:text-amber-300 hover:underline break-all">alumni@itmgoi.in</a></li>
            <li><a href="mailto:iqac@itmgoi.in" className="text-[#800000] dark:text-amber-300 hover:underline break-all">iqac@itmgoi.in</a></li>
            <li><a href="mailto:tap@itmgoi.in" className="text-[#800000] dark:text-amber-300 hover:underline break-all">tap@itmgoi.in</a></li>
          </ul>
        </Card>
      </section>

      {/* Address + map block */}
      <section className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-[#1a0606] to-[#3e0202] text-white border-amber-300/30">
          <MapPin className="text-amber-300 mb-4" size={28} />
          <h3 className="text-2xl font-black text-white mb-3">Campus Address</h3>
          <p className="text-lg font-bold leading-snug text-white/95 mb-6">
            ITM Campus, Opp. Sithouli Railway Station,<br />
            NH-75 Sithouli, Jhansi Road,<br />
            Gwalior — 475001, Madhya Pradesh, INDIA
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://maps.google.com/?q=ITM+Gwalior+Sithouli" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-amber-300 hover:bg-amber-400 text-[#1a0606] px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">
              <Globe2 size={13} /> Open in Maps
            </a>
            <a href="http://itmgoi.in/OnlineApply_ITMGOI/" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 border border-amber-300/40 hover:bg-amber-300/10 text-amber-300 px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">
              Online Enquiry <ExternalLink size={13} />
            </a>
          </div>
        </Card>

        <Card className="overflow-hidden p-0 h-[420px]">
          <iframe
            title="ITM Gwalior on Google Maps"
            src="https://www.google.com/maps?q=ITM%20Gwalior%20Sithouli&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Card>
      </section>

      {/* Online portals */}
      <section>
        <SectionTitle eyebrow="Official Portals" title="Apply, pay &" accent="grievance." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Online Apply",      href: "http://itmgoi.in/OnlineApply_ITMGOI",                                Icon: Building2 },
            { label: "Online Payment",    href: "https://onlineapply.itmgoi.in/form_hdfc.php?ok=Apply+Now",          Icon: Building2 },
            { label: "Grievance Form",    href: "https://forms.gle/VTEumajnux762Vtv8",                                 Icon: Building2 },
            { label: "Alumni Portal",     href: "https://www.itmalumni.in/",                                            Icon: Building2 },
          ].map((p) => (
            <a key={p.label} href={p.href} target="_blank" rel="noreferrer"
              className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-gray-900 border border-rose-50 dark:border-gray-800 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3">
                <p.Icon size={18} className="text-[#800000] dark:text-amber-300" />
                <span className="text-sm font-bold text-[#1a0606] dark:text-white">{p.label}</span>
              </div>
              <ExternalLink size={14} className="text-gray-400 group-hover:text-[#800000] dark:group-hover:text-amber-300" />
            </a>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

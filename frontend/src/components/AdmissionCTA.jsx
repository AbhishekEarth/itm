import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Phone, Calendar, Sparkles } from "lucide-react";

export default function AdmissionCTA() {
  return (
    <section className="relative py-16 md:py-20 bg-white dark:bg-[#020617] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#3e0202] via-[#800000] to-[#5a0000] text-white p-8 md:p-14 shadow-2xl shadow-rose-900/20"
        >
          {/* Background decoratives */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          ></div>
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-500/30 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-rose-400/20 blur-3xl"></div>

          <div className="relative grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-5">
                <Calendar size={12} className="text-amber-300" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-300">
                  Admissions 2026 — Limited Seats
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05] mb-4">
                Your seat at ITM is one <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-amber-300 to-rose-200 bg-clip-text text-transparent">
                  application away.
                </span>
              </h2>
              <p className="text-sm md:text-base text-rose-100/80 font-medium leading-relaxed max-w-xl mb-8">
                15+ programmes across B.Tech, M.Tech, MCA, MBA, BCA and BBA. NAAC A+, NBA accredited,
                with 90%+ placement track. Apply in under 20 minutes.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/admissions/how-to-apply"
                  className="group inline-flex items-center gap-2 bg-white text-[#800000] px-6 py-4 rounded-full font-black text-[11px] tracking-[0.2em] uppercase shadow-2xl hover:shadow-amber-400/30 dark:shadow-[0_0_15px_rgba(255,255,255,0.12)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.28)] hover:scale-[1.02] transition-all"
                >
                  Apply Now
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://onlineapply.itmgoi.in/form_hdfc.php?ok=Apply+Now"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-black/30 backdrop-blur text-white border border-white/30 px-6 py-4 rounded-full font-black text-[11px] tracking-[0.2em] uppercase hover:bg-black/50 dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all"
                >
                  <CreditCard size={14} /> Pay Online
                </a>
                <a
                  href="tel:+917773005065"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white border border-white/20 px-6 py-4 rounded-full font-black text-[11px] tracking-[0.2em] uppercase hover:bg-white/20 dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all"
                >
                  <Phone size={14} /> Call Us
                </a>
              </div>
            </div>

            {/* Right: counter cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {[
                { label: "Programmes", value: "15+" },
                { label: "Sanctioned Seats", value: "1100+" },
                { label: "Recruiters", value: "150+" },
                { label: "Placement Rate", value: "90%+" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 text-center hover:bg-white/20 transition-colors"
                >
                  <div className="text-3xl md:text-4xl font-black tracking-[-0.04em] leading-none mb-2">
                    {b.value}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest font-black text-rose-100/80">
                    {b.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom strip */}
          <div className="relative mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-widest font-black text-rose-100/70">
            <div className="flex items-center gap-2">
              <Sparkles size={11} className="text-amber-300" />
              <span>NAAC A+ · NBA · AICTE · RGPV</span>
            </div>
            <span>Walk-in counselling open Mon–Sat, 10am to 5pm</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

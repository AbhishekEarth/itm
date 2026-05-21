import React from "react";
import { motion } from "framer-motion";
import {
  Scale, ShieldCheck, Award, FileText, Trophy, Briefcase, GraduationCap,
  Calendar, Building2, ExternalLink, Download, HeartHandshake, Users2, Sparkles, MapPin,
} from "lucide-react";
import PageShell, { SectionTitle, Card, Prose, FactRow } from "./_PageShell";

/* ============================================================
   NAAC POLICIES
   ============================================================ */
export function NAACPolicyPage() {
  return (
    <PageShell
      eyebrow="NAAC Accreditation"
      title="Accredited"
      accentTitle="A · CGPA 3.01."
      intro="ITM Gwalior holds NAAC 'A' grade accreditation with a CGPA of 3.01, valid till 24 November 2030. The institute's quality framework — policies, programme outcomes, audits — is published openly here."
      chips={["NAAC A", "CGPA 3.01", "Valid till Nov 2030", "OBE Compliant"]}
    >
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Quality Policy",      body: "Institutional quality framework aligned with NAAC criteria." },
          { title: "OBE Policy",          body: "Programme outcomes, PEOs and PSOs for every programme." },
          { title: "Curriculum Policy",   body: "Curriculum design, revision and industry-mapping process." },
          { title: "Examination Policy",  body: "ABCAS framework and end-semester examination code." },
          { title: "Research Policy",     body: "Plagiarism, authorship and responsible-conduct guidelines." },
          { title: "Welfare Policies",    body: "Student welfare, anti-ragging, ICC, and grievance redressal frameworks." },
        ].map((p) => (
          <Card key={p.title}>
            <Scale className="text-[#800000] dark:text-amber-300 mb-3" size={22} />
            <h3 className="font-black text-base text-[#1a0606] dark:text-white mb-2">{p.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{p.body}</p>
          </Card>
        ))}
      </section>

      <Card className="text-center bg-gradient-to-br from-[#fbf7f2] to-rose-50/40 dark:from-gray-900 dark:to-gray-900">
        <Sparkles className="mx-auto text-[#800000] dark:text-amber-300 mb-3" size={28} />
        <h3 className="text-2xl font-black text-[#1a0606] dark:text-white mb-2">Looking for a specific document?</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-5 max-w-lg mx-auto">
          The IQAC maintains the complete archive — signed, dated and version-controlled. Write
          to iqac@itmgoi.in or browse via the IQAC page.
        </p>
        <a href="mailto:iqac@itmgoi.in" className="inline-flex items-center gap-2 bg-[#800000] hover:bg-[#5c0202] text-white px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">iqac@itmgoi.in</a>
      </Card>
    </PageShell>
  );
}

/* ============================================================
   COMMITTEES
   ============================================================ */
const COMMITTEES = [
  { name: "IQAC",                              body: "Internal Quality Assurance — quality audits, OBE & NAAC compliance." },
  { name: "Anti-Ragging Committee",            body: "Zero-tolerance enforcement, helpline, grievance redressal (UGC-compliant)." },
  { name: "Internal Complaints Committee (ICC)", body: "Sexual harassment prevention — PoSH-compliant complaint mechanism." },
  { name: "Women Empowerment Cell (WEC)",     body: "Awareness, advocacy and community programming for gender equity." },
  { name: "Anti-Discrimination Cell",         body: "SC/ST, OBC and minority welfare cell — admission, scholarship and grievance." },
  { name: "Examination Committee",            body: "End-semester examination conduct, evaluation and disciplinary actions." },
  { name: "Academic Council",                  body: "Curriculum design, syllabi revision and academic policy oversight." },
  { name: "Research Advisory Committee",      body: "Faculty research, externally-funded projects and PhD scholar oversight." },
  { name: "Library Committee",                 body: "Acquisitions, digital access, IEEE/Springer subscriptions, reading hours." },
  { name: "Sports & Cultural Committee",       body: "Annual sports meet, inter-college tournaments, DiversITM and cultural calendar." },
  { name: "TAP Cell Committee",                body: "Training & placement strategy, employer partnerships, alumni placement support." },
  { name: "Hostel Management Committee",       body: "Residential life, mess, security and student welfare in hostels." },
];

export function CommitteesPage() {
  return (
    <PageShell
      eyebrow="Institutional Committees"
      title="Governance you can"
      accentTitle="trace."
      intro="Twelve standing committees run the day-to-day of the institute — each with published terms of reference, named members and a transparent escalation path."
      chips={["12 committees", "Published TORs", "Named members"]}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMMITTEES.map((c, i) => (
          <motion.div key={c.name}
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: (i % 6) * 0.03 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-rose-50 dark:border-gray-800 p-5"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-gray-800 text-[#800000] dark:text-amber-300 flex items-center justify-center mb-3">
              <Users2 size={18} />
            </div>
            <h3 className="font-black text-[15px] text-[#1a0606] dark:text-white mb-1.5 leading-tight">{c.name}</h3>
            <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{c.body}</p>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}

/* ============================================================
   MOUs
   ============================================================ */
const MOUS = [
  { partner: "Microsoft Learn",          tag: "Centre of Excellence",  body: "MSL CoE recognition (May 2024 – Apr 2025). Tech-first curriculum, certifications and labs." },
  { partner: "Honeywell + ICT Academy",  tag: "WEC CoE 2025",          body: "Centre of Excellence for Women Empowerment, joint workshops and women-in-tech programmes." },
  { partner: "EduSkills",                 tag: "Virtual Internships",   body: "Ranked #35 nationally in EduSkills VIP 2024 — Engineering category. Live internship pipeline." },
  { partner: "AICTE",                     tag: "Approval",              body: "All B.Tech and M.Tech programmes AICTE-approved, with periodic curriculum review." },
  { partner: "RGPV Bhopal",              tag: "Affiliation",           body: "Engineering affiliation — examinations, conferment of degrees, joint research initiatives." },
  { partner: "Jiwaji University",        tag: "MBA Affiliation",       body: "MBA programme affiliation, plus joint cultural festivals and NSS coordination." },
  { partner: "MP Council of S&T",         tag: "Research",              body: "State research grants supporting projects in computing, materials and sustainable engineering." },
  { partner: "Pradhan Mantri Kaushal Vikas Yojana", tag: "Skilling",   body: "Successfully completed PMKVY skill courses — vocational pipeline for rural and EWS students." },
  { partner: "IEEE Student Branch",      tag: "Tech Community",        body: "Active IEEE chapter — competitions, conferences and access to the IEEE digital library." },
  { partner: "Country Delight (Alumni Partner)", tag: "Recruitment",    body: "Alumni-led partnership creating direct hiring channels and internship slots." },
];

export function MOUsPage() {
  return (
    <PageShell
      eyebrow="MOUs & Collaborations"
      title="Industry partners we"
      accentTitle="ship work with."
      intro="From Microsoft to Honeywell to state government — ten plus partnerships that translate directly into student certifications, internships, research projects and CoE recognitions."
      chips={["10+ MOUs", "2 Centres of Excellence", "Govt + Industry + Academia"]}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOUS.map((m, i) => (
          <motion.div key={m.partner}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: (i % 6) * 0.03 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-rose-50 dark:border-gray-800 p-5"
          >
            <span className="inline-block text-[9px] font-black uppercase tracking-widest text-[#800000] dark:text-amber-300 bg-rose-50 dark:bg-gray-800 px-2 py-0.5 rounded mb-3">
              {m.tag}
            </span>
            <h3 className="font-black text-[15px] text-[#1a0606] dark:text-white mb-1.5 leading-tight">{m.partner}</h3>
            <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{m.body}</p>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}

/* ============================================================
   APPRECIATION & RECOGNITION
   ============================================================ */
const RECOGNITIONS = [
  { year: "2024", title: "World Book of Records, London", body: "Honoured for delivering Five Lakh Internships in Three Years." },
  { year: "2024", title: "Microsoft Learn — Centre of Excellence", body: "Selected as a Microsoft Learn CoE (May 2024 – Apr 2025)." },
  { year: "2024", title: "EduSkills #35 All-India", body: "Ranked 35th nationally in EduSkills Virtual Internship Rankings — Engineering category." },
  { year: "2025", title: "Honeywell + ICT Academy CoE", body: "Centre of Excellence for Women Empowerment, in partnership with Honeywell and ICT Academy." },
  { year: "2030", title: "NAAC A · CGPA 3.01", body: "Accreditation valid till 24 November 2030 — A grade with CGPA 3.01." },
  { year: "2022", title: "Best Institute — Training & Placement", body: "Indian Education Excellence Awards. Ranked 5th in Central India (Silicon India)." },
];

export function AppreciationPage() {
  return (
    <PageShell
      eyebrow="Appreciation & Recognition"
      title="Six awards that"
      accentTitle="define the last decade."
      intro="External validators across government, industry and global recognition bodies. Each one points back to specific work by faculty, students or the TAP Cell."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {RECOGNITIONS.map((r, i) => (
          <motion.div key={r.title}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: (i % 6) * 0.04 }}
            className="bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-900 dark:to-gray-900 rounded-3xl border border-amber-100 dark:border-gray-800 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <Award size={20} className="text-amber-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                {r.year}
              </span>
            </div>
            <h3 className="font-black text-base text-[#1a0606] dark:text-white mb-2 leading-snug">{r.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{r.body}</p>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}

/* ============================================================
   NIRF RANKING
   ============================================================ */
const NIRF_REPORTS = [
  { year: "2025", cat: "Engineering",          file: "https://itmgoi.in/assets/images/awads%26ranking/NIRF25_IR-E-C-36219_Sub_30.1.25_Engg_Generated.pdf" },
  { year: "2025", cat: "Management",           file: "https://itmgoi.in/assets/images/awads%26ranking/NIRF25_IR-M-C-36219_Sub_30.1.25_MBA_Generated.pdf" },
  { year: "2025", cat: "Sustainable Dev Goals", file: "https://itmgoi.in/assets/images/awads%26ranking/NIRF25_IR-B-C-36219_Sub_30.1.25_SDG_Generated.pdf" },
  { year: "2025", cat: "Overall",               file: "https://itmgoi.in/assets/images/awads%26ranking/NIRF25_IR-O-C-36219_Sub_30.1.25_Overall_Generated.pdf" },
  { year: "2024", cat: "Engineering",          file: "https://itmgoi.in/assets/images/awads&ranking/Nirf-2024_IR-E-C-36219_Engg_Generate.pdf" },
  { year: "2024", cat: "Management",           file: "https://itmgoi.in/assets/images/awads&ranking/Nirf-2024_IR-M-C-36219_MBA%20Generate.pdf" },
];

export function NIRFPage() {
  return (
    <PageShell
      eyebrow="NIRF Ranking"
      title="National Institutional"
      accentTitle="Ranking Framework."
      intro="ITM Gwalior's NIRF submissions are public. Each year's data — Engineering, Management, SDG and Overall — is published below as the official submitted PDF."
      chips={["NIRF 2025 · 4 categories", "NIRF 2024 · 2 categories"]}
    >
      <section>
        <SectionTitle eyebrow="NIRF 2025 Submissions" title="The latest" accent="data drop." />
        <div className="grid sm:grid-cols-2 gap-4">
          {NIRF_REPORTS.filter((r) => r.year === "2025").map((r) => (
            <a key={r.cat} href={r.file} target="_blank" rel="noreferrer"
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-rose-50 dark:border-gray-800 p-5 hover:shadow-xl transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#800000] to-[#3e0202] text-amber-200 flex items-center justify-center shadow-md">
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-widest font-black text-[#800000] dark:text-amber-300">NIRF 2025</div>
                <div className="font-black text-base text-[#1a0606] dark:text-white">{r.cat}</div>
              </div>
              <Download size={16} className="text-gray-400 group-hover:text-[#800000] dark:group-hover:text-amber-300 transition-colors" />
            </a>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="NIRF 2024 Submissions" title="Previous year" accent="reports." />
        <div className="grid sm:grid-cols-2 gap-4">
          {NIRF_REPORTS.filter((r) => r.year === "2024").map((r) => (
            <a key={r.cat} href={r.file} target="_blank" rel="noreferrer"
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-rose-50 dark:border-gray-800 p-5 hover:shadow-xl transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-gray-800 text-[#800000] dark:text-amber-300 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-widest font-black text-[#800000] dark:text-amber-300">NIRF 2024</div>
                <div className="font-black text-base text-[#1a0606] dark:text-white">{r.cat}</div>
              </div>
              <Download size={16} className="text-gray-400 group-hover:text-[#800000] dark:group-hover:text-amber-300 transition-colors" />
            </a>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

/* ============================================================
   CAREERS / VACANCIES
   ============================================================ */
export function CareersPage() {
  return (
    <PageShell
      eyebrow="Careers at ITM"
      title="Teach. Research."
      accentTitle="Build something."
      intro="ITM Gwalior recruits across faculty, research and administrative roles year-round. Openings are published with full job-description PDFs."
      chips={["Faculty · Staff · Research", "Year-round openings"]}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <Briefcase className="text-[#800000] dark:text-amber-300 mb-3" size={28} />
          <h3 className="font-black text-xl text-[#1a0606] dark:text-white mb-3">Faculty Positions</h3>
          <Prose>
            <p>
              Open positions across CSE, IT, ECE, ME, CE, MBA, Humanities and Basic Sciences.
              We look for PhD or M.Tech holders with strong publication track records and a
              proven commitment to undergraduate teaching.
            </p>
          </Prose>
        </Card>
        <Card>
          <GraduationCap className="text-[#800000] dark:text-amber-300 mb-3" size={28} />
          <h3 className="font-black text-xl text-[#1a0606] dark:text-white mb-3">Research & Admin</h3>
          <Prose>
            <p>
              Junior Research Fellow (JRF) positions on funded projects, plus periodic openings
              in administration, library, IT services and accounts. JRF candidates can apply via
              the dedicated JRF page.
            </p>
          </Prose>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-[#1a0606] to-[#3e0202] text-white border-amber-300/30 text-center">
        <h3 className="text-3xl font-black text-white mb-2">Current openings.</h3>
        <p className="text-rose-100/80 font-medium mb-5 max-w-lg mx-auto">
          The official ITM jobs page lists every open position with downloadable PDFs and
          application deadlines.
        </p>
        <a href="https://www.itmgoi.in/jobs/" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 bg-amber-300 hover:bg-amber-400 text-[#1a0606] px-6 py-3 rounded-xl font-black text-[11px] tracking-widest uppercase">
          View Open Positions <ExternalLink size={13} />
        </a>
      </Card>
    </PageShell>
  );
}

/* ============================================================
   JRF
   ============================================================ */
export function JRFPage() {
  return (
    <PageShell
      eyebrow="Junior Research Fellow"
      title="Research roles for"
      accentTitle="early-career scholars."
      intro="JRF positions are advertised against ITM's externally-funded research projects — M.P. Council of S&T, AICTE, industry grants and the Microsoft Learn Centre of Excellence pipeline."
      chips={["Funded research", "Live grants", "Publication track record"]}
    >
      <div className="grid md:grid-cols-3 gap-5">
        {[
          { Icon: GraduationCap, title: "Who can apply", body: "M.Tech, M.Sc. or B.Tech graduates with strong research aptitude and (typically) NET/GATE qualification." },
          { Icon: Sparkles,      title: "What you get",   body: "UGC-norm stipend, library and lab access, PhD registration support and authorship on publications." },
          { Icon: Calendar,      title: "How to apply",   body: "Openings are advertised on the ITM jobs page. Email applications go to the named Principal Investigator with CV + research statement." },
        ].map((b) => (
          <Card key={b.title}>
            <b.Icon className="text-[#800000] dark:text-amber-300 mb-3" size={26} />
            <h3 className="font-black text-lg text-[#1a0606] dark:text-white mb-2">{b.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{b.body}</p>
          </Card>
        ))}
      </div>
      <a href="https://www.itmgoi.in/JRF.php" target="_blank" rel="noreferrer"
        className="inline-flex items-center gap-2 bg-[#800000] hover:bg-[#5c0202] text-white px-6 py-3 rounded-xl font-black text-[11px] tracking-widest uppercase">
        Current JRF openings <ExternalLink size={13} />
      </a>
    </PageShell>
  );
}

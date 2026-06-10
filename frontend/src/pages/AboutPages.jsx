import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Building2, Users2, Award, Target, Eye, ScrollText, GraduationCap, MapPin,
  Trophy, Leaf, Sparkles, BookOpen, FileText, Calendar, BookmarkCheck, Newspaper,
} from "lucide-react";
import PageShell, { SectionTitle, Prose, Card, FactRow } from "./_PageShell";
import { publicComplianceApi } from "../api/compliance";

/* ============================================================
   1.  ABOUT INSTITUTE
   ============================================================ */
export function AboutInstitutePage() {
  return (
    <PageShell
      eyebrow="About ITM Gwalior"
      title="Three decades of"
      accentTitle="quality engineering education."
      intro="Established in 1997 by the Samata Lok Sansthan Trust, ITM Gwalior has grown into one of central India's most respected technical and management institutions — recognised by the Government of India, AICTE-approved and a designated Centre of Research in Engineering & Technology."
      chips={["Established 1997", "AICTE Approved", "NAAC A · CGPA 3.01", "RGPV Affiliated"]}
    >
      <section>
        <SectionTitle eyebrow="History" title="From a single block to" accent="a 30-acre campus." />
        <Prose>
          <p>
            ITM Gwalior was founded with a single, ambitious objective — to deliver quality
            education in engineering and technology so that it emerges as a world-class
            institution. Three decades later that promise is measurable: 42 state-of-the-art
            laboratories, 728 student computers, a 64,000-volume library and a 2,500-seat
            amphitheatre across a fully self-contained campus on NH-75 Sithouli.
          </p>
          <p>
            The institute is approved by AICTE, recognised by the Government of India and
            affiliated to RGPV Bhopal for engineering programmes and to Jiwaji University,
            Gwalior for MBA. Continuous evaluation through projects, tests and direct industry
            collaborations sits at the heart of our pedagogy — and our work as a recognised
            Centre of Research keeps faculty and students embedded in live R&amp;D.
          </p>
        </Prose>
      </section>

      <section>
        <SectionTitle eyebrow="By the numbers" title="A campus" accent="built at scale." />
        <FactRow items={[
          { num: "1997", label: "Established" },
          { num: "30+",  label: "Years" },
          { num: "30K+", label: "Alumni" },
          { num: "300+", label: "Recruiters" },
          { num: "42",   label: "Labs" },
          { num: "9",    label: "Departments" },
          { num: "64K+", label: "Library Books" },
          { num: "2.5K", label: "NAAD Capacity" },
        ]} />
      </section>

      <section className="grid md:grid-cols-3 gap-3 sm:gap-5">
        <Card>
          <Target className="text-[#800000] mb-3" size={26} />
          <h3 className="font-black text-lg mb-1 text-[#1a0606] dark:text-white">Approvals</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            AICTE approved, Government of India recognised, affiliated with RGPV Bhopal (engineering)
            and Jiwaji University Gwalior (MBA).
          </p>
        </Card>
        <Card>
          <Building2 className="text-[#800000] mb-3" size={26} />
          <h3 className="font-black text-lg mb-1 text-[#1a0606] dark:text-white">Trust</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            Run by Samata Lok Sansthan Trust — a registered educational trust with three decades
            of stewardship in central India.
          </p>
        </Card>
        <Card>
          <MapPin className="text-[#800000] mb-3" size={26} />
          <h3 className="font-black text-lg mb-1 text-[#1a0606] dark:text-white">Location</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            NH-75 Sithouli, opposite Sithouli Railway Station, Jhansi Road, Gwalior 475001 (M.P.).
          </p>
        </Card>
      </section>
    </PageShell>
  );
}

/* ============================================================
   2.  MISSION & VISION
   ============================================================ */
const VALUES = [
  "Humanity and ethics blended with sincerity, integrity and accountability.",
  "Productive delivery supported by healthy competition.",
  "Efficiency and dynamism coupled with sensitivity.",
  "To nurture innovation and the ability to think differently with rational creativity.",
  "Appreciation of sustainable socio-cultural values and pride in being a good professional contributing to the betterment of mankind and mother earth.",
];

export function MissionVisionPage() {
  return (
    <PageShell
      eyebrow="Mission · Vision · Values"
      title="What we"
      accentTitle="stand for."
      intro="The institute's purpose, distilled into three statements that have guided every decision since 1997."
    >
      <section className="grid md:grid-cols-2 gap-3 sm:gap-6">
        <Card className="bg-gradient-to-br from-[#fbf7f2] to-rose-50/40 dark:from-gray-900 dark:to-gray-900 border-rose-100">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#800000] to-[#3e0202] text-amber-200 flex items-center justify-center shadow-md">
              <Eye size={22} />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1a0606] dark:text-white">Vision</h3>
          </div>
          <p className="text-[14px] sm:text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic">
            "To develop the institute into a centre of excellence in education, research, training
            and consultancy to the extent that it becomes a significant player in the technical
            and overall development of the country."
          </p>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50/60 to-white dark:from-gray-900 dark:to-gray-900 border-amber-100">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 text-white flex items-center justify-center shadow-md">
              <Target size={22} />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1a0606] dark:text-white">Mission</h3>
          </div>
          <ul className="space-y-2 sm:space-y-3 text-[14px] sm:text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
            <li>· To meet the global need of competent and dedicated professionals.</li>
            <li>· To undertake R&amp;D, consultancy and extension activities of relevance to humankind.</li>
            <li>· To serve the community through technical and developmental outreach.</li>
          </ul>
        </Card>
      </section>

      <section>
        <SectionTitle eyebrow="Core Values" title="The non-negotiables" accent="we run on." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {VALUES.map((v, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-rose-50 dark:border-gray-800 p-3 sm:p-5">
              <div className="text-[#800000] dark:text-amber-300 font-black text-2xl sm:text-3xl mb-2 leading-none">
                {String(i + 1).padStart(2, "0")}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{v}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

/* ============================================================
   3.  ITM OFFICIALS (Leadership)
   ============================================================ */
const OFFICIALS = [
  { name: "Mr. Rama Shankar Singh",      role: "Chairman, Samata Lok Sansthan Trust" },
  { name: "Mrs. Kanupriya Singh Rathore", role: "Managing Trustee" },
  { name: "Mrs. Ruchi Singh Chauhan",    role: "Vice-Chairperson, Trustee" },
  { name: "Ms. Palak Singh",              role: "Trustee" },
  { name: "Dr. Daulat Singh Chauhan",     role: "Managing Director" },
  { name: "Dr. Meenakshi Mazumdar",      role: "Director, ITM Gwalior" },
  { name: "Dr. R. D. Gupta",              role: "Professor Emeritus" },
  { name: "Dr. S. S. Chauhan",            role: "Dean Academics · HoD Basic Sciences" },
  { name: "Dr. Prashant Shrivastava",    role: "Dean Administration" },
  { name: "Dr. Deepesh Bharadwaj",       role: "Dean Research" },
  { name: "Dr. Rajeev Singh Rathore",    role: "Dean IQAC" },
  { name: "Dr. Manoj Mishra",             role: "Dean Student Welfare" },
  { name: "Dr. Pradeep Yadav",            role: "HoD Computer Science & Engineering" },
  { name: "Dr. Rishi Soni",               role: "Professor, CSE · Dean Counselling" },
  { name: "Dr. Preeti Singh",             role: "HoD Management" },
  { name: "Dr. Aditya Vidyarthi",         role: "HoD Information Technology" },
  { name: "Dr. Manoj Kumar Bandil",      role: "HoD Electronics & Communication" },
  { name: "Dr. Ashutosh Trivedi",         role: "HoD Civil Engineering" },
  { name: "Dr. Shiv Kumar Sharma",       role: "HoD Mechanical Engineering" },
];

function PersonGrid({ people, columns = "lg:grid-cols-3" }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${columns} gap-3 sm:gap-4`}>
      {people.map((p, i) => (
        <motion.div
          key={p.name}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ delay: (i % 6) * 0.04 }}
          className="group bg-white dark:bg-gray-900 rounded-2xl border border-rose-50 dark:border-gray-800 p-3 sm:p-5 flex items-center gap-3 sm:gap-4 hover:shadow-lg transition-shadow"
        >
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#800000] to-[#3e0202] text-amber-200 flex items-center justify-center font-black text-base shrink-0">
            {p.name.split(" ").slice(-1)[0][0]}
          </div>
          <div>
            <div className="font-black text-[15px] leading-tight text-[#1a0606] dark:text-white">{p.name}</div>
            <div className="text-[12px] text-gray-600 dark:text-gray-400 font-medium mt-0.5">{p.role}</div>
            {p.affiliation && (
              <div className="text-[11px] text-amber-700 dark:text-amber-400 font-bold mt-1">{p.affiliation}</div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function OfficialsPage() {
  const { data: live } = useQuery({ queryKey: ["public-officials"], queryFn: publicComplianceApi.officials });
  const people = live && live.length
    ? live.map((o) => ({ name: o.name, role: o.role, affiliation: o.email || o.department_code || "" }))
    : OFFICIALS;
  return (
    <PageShell
      eyebrow="ITM Officials"
      title="The people who"
      accentTitle="run the institute."
      intro="Trustees, the directorate, deans and heads of department — the leadership team responsible for academic, administrative and research operations at ITM Gwalior."
    >
      <section>
        <SectionTitle eyebrow="Leadership" title="Trustees &" accent="senior management." />
        <PersonGrid people={people} />
      </section>
    </PageShell>
  );
}

/* ============================================================
   4.  BOARD OF GOVERNORS
   ============================================================ */
const BOARD = [
  { name: "Ms. Ruchi Singh Chauhan",  role: "Chairman",          affiliation: "Vice-Chairperson, SLS Trust" },
  { name: "Dr. Meenakshi Mazumdar",   role: "Member Secretary",  affiliation: "Director, ITM" },
  { name: "Dr. Daulat Singh Chauhan", role: "Member",            affiliation: "Managing Director, ITM" },
  { name: "Prof. (Dr.) Roopam Gupta", role: "University Nominee", affiliation: "Professor, IT — RGPV Bhopal; Ex-Vice Chancellor" },
  { name: "Dr. D. N. Goswami",         role: "University Nominee", affiliation: "Rector, Jiwaji University Gwalior" },
  { name: "Dr. Shekhar Verma",         role: "Educationist",       affiliation: "Professor, IT — IIITM Allahabad" },
  { name: "Col. B. Venkat",             role: "Educationist",       affiliation: "Registrar, TERI SAS New Delhi" },
  { name: "Prof. Yogesh Upadhyay",     role: "Educationist",       affiliation: "Vice-Chancellor, ITM University" },
  { name: "Mr. Asish Vaish",            role: "Industrialist",      affiliation: "MD, Precision System Bhopal · Jubilant Ingrevia" },
  { name: "CA Vijay Singh Rajawat",    role: "Industrialist",      affiliation: "Chief Manager F&A, JK Tyre Banmore" },
  { name: "Mr. Sunil Yadavalli",       role: "Industrialist",      affiliation: "Head Strategy & Partnership, IDS Inc. Hyderabad" },
  { name: "Mr. Sajal Agrawal",         role: "Industrialist",      affiliation: "Director, Invert Sugar Pvt. Ltd. · ITM Alumni" },
  { name: "Mr. Sachin Kurchiya",       role: "Industrialist",      affiliation: "Manager, Country Delight Gurugram · ITM Alumni" },
  { name: "Dr. Rajeev Singh",           role: "Faculty Member",     affiliation: "Dean IQAC" },
  { name: "Dr. S. S. Chauhan",          role: "Faculty Member",     affiliation: "Dean Academics · HoD Basic Sciences" },
  { name: "Dr. Alka Sanyal",            role: "Faculty Member",     affiliation: "Assistant Professor, Management" },
];

export function BoardOfGovernorsPage() {
  const { data: live } = useQuery({ queryKey: ["public-board"], queryFn: publicComplianceApi.board });
  const people = live && live.length
    ? live.map((b) => ({ name: b.name, role: b.role, affiliation: b.organization || "" }))
    : BOARD;
  return (
    <PageShell
      eyebrow="Board of Governors"
      title="Industry, academia &"
      accentTitle="trusteeship — together."
      intro="The Board of Governors steers institutional strategy. Members are nominated by the trust, the affiliating universities, peer educationists, industry and the faculty."
    >
      <PersonGrid people={people} columns="lg:grid-cols-2" />
    </PageShell>
  );
}

/* ============================================================
   5.  DIRECTOR'S MESSAGE
   ============================================================ */
export function DirectorMessagePage() {
  return (
    <PageShell
      eyebrow="Director's Desk"
      title="A message from"
      accentTitle="Dr. Meenakshi Mazumdar."
      intro="Director, Institute of Technology and Management, Gwalior."
    >
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-8 items-start">
        <Card className="lg:col-span-1 text-center bg-gradient-to-br from-[#fbf7f2] to-rose-50/40 dark:from-gray-900 dark:to-gray-900 border-rose-100">
          <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto rounded-full bg-gradient-to-br from-[#800000] to-[#3e0202] text-amber-200 flex items-center justify-center text-2xl sm:text-4xl font-black mb-3 sm:mb-4">
            MM
          </div>
          <div className="font-black text-xl text-[#1a0606] dark:text-white">Dr. Meenakshi Mazumdar</div>
          <div className="text-sm text-[#800000] dark:text-amber-300 font-bold mt-1">Director, ITM Gwalior</div>
        </Card>

        <div className="lg:col-span-2 space-y-5">
          <blockquote className="border-l-4 border-amber-400 pl-5 italic text-[16px] leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
            Welcome to the Institute of Technology and Management, Gwalior. ITM has established
            its position as a top technical institute in Madhya Pradesh.
          </blockquote>
          <Prose>
            <p>
              Apart from imparting technical skills in Computer Science, Information Technology,
              Electronics and Communication, Civil Engineering, Mechanical Engineering and MBA,
              we develop the overall personality of our students through an all-round approach
              for success in their pursuits.
            </p>
            <p>
              The institute has introduced an Activity-Based Continuous Assessment System (ABCAS)
              and Project-Based Learning for hands-on experience with strong fundamentals. ITM
              encourages faculty to actively collaborate on research projects of societal
              importance. Workshops, soft-skill trainings, industry lectures and technical
              seminars together drive over 80% placement of eligible students.
            </p>
            <p>
              ITM fulfils its social responsibility as a selected institute for Unnat Bharat
              Abhiyan (MHRD initiative) aimed at empowering rural India. We have successfully
              completed Pradhan Mantri Kaushal Vikas Yojana courses, and our faculty have
              received research projects from the M.P. Council of Science and Research, Bhopal.
            </p>
            <p>
              With such a multifaceted outlook, ITM is becoming a leading technical institute.
              A journey has begun, but much lies ahead — and the active support of our students,
              faculty and staff will help fulfil ITM's vision. I congratulate all entrants for
              choosing ITM.
            </p>
          </Prose>
        </div>
      </div>
    </PageShell>
  );
}

/* ============================================================
   6.  PROGRAMMES OFFERED
   ============================================================ */
const UG_PROGRAMMES = [
  { spec: "Computer Science Engineering",           seats: 240, dur: "4 years" },
  { spec: "CSE — AI & Machine Learning",             seats: 90,  dur: "4 years" },
  { spec: "CSE — Data Science",                       seats: 90,  dur: "4 years" },
  { spec: "CSE — Cyber Security",                    seats: 30,  dur: "4 years" },
  { spec: "Information Technology",                  seats: 120, dur: "4 years" },
  { spec: "Electronics & Communication",             seats: 60,  dur: "4 years" },
  { spec: "Mechanical Engineering",                  seats: 30,  dur: "4 years" },
  { spec: "Civil Engineering",                        seats: 30,  dur: "4 years" },
  { spec: "Chemical Engineering",                    seats: 30,  dur: "4 years" },
];
const PG_PROGRAMMES = [
  { prog: "M.Tech", spec: "Computer Science", seats: 9,   dur: "2 years", elig: "B.E./B.Tech in relevant branch" },
  { prog: "M.Tech", spec: "VLSI",              seats: 9,   dur: "2 years", elig: "B.E./B.Tech in relevant branch" },
  { prog: "MBA",     spec: "Management · Finance · HR", seats: 120, dur: "2 years", elig: "Any graduate with 50%" },
  { prog: "MCA",     spec: "Computer Applications", seats: 60,  dur: "2 years", elig: "Graduate with Maths/Physics" },
];

export function ProgrammesPage() {
  return (
    <PageShell
      eyebrow="Programmes Offered"
      title="Engineering, IT,"
      accentTitle="management — under one roof."
      intro="Eight B.Tech specialisations, two M.Tech specialisations, an AICTE-approved MBA and an MCA — with lateral-entry seats available across most branches."
      chips={["10 B.Tech specs", "M.Tech · MBA · MCA", "AICTE Approved", "RGPV / Jiwaji"]}
    >
      <section>
        <SectionTitle eyebrow="Undergraduate" title="B.Tech" accent="programmes." />
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-rose-50 dark:bg-gray-800 text-[10px] uppercase tracking-widest text-[#800000] dark:text-amber-300 font-black">
              <tr>
                <th className="text-left p-4">Specialisation</th>
                <th className="text-center p-4">Seats</th>
                <th className="text-center p-4">Duration</th>
                <th className="text-left p-4 hidden sm:table-cell">Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-100 dark:divide-gray-800">
              {UG_PROGRAMMES.map((u) => (
                <tr key={u.spec} className="font-medium text-gray-700 dark:text-gray-300">
                  <td className="p-4 font-bold text-[#1a0606] dark:text-white">{u.spec}</td>
                  <td className="p-4 text-center">{u.seats}</td>
                  <td className="p-4 text-center">{u.dur}</td>
                  <td className="p-4 hidden sm:table-cell text-xs">10+2 with PCM · 45% Gen / 40% reserved</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 font-medium">
          Lateral-entry seats are available in most branches for direct second-year admission.
        </p>
      </section>

      <section>
        <SectionTitle eyebrow="Postgraduate" title="M.Tech, MBA &" accent="MCA." />
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-rose-50 dark:bg-gray-800 text-[10px] uppercase tracking-widest text-[#800000] dark:text-amber-300 font-black">
              <tr>
                <th className="text-left p-4">Programme</th>
                <th className="text-left p-4">Specialisation</th>
                <th className="text-center p-4">Seats</th>
                <th className="text-center p-4">Duration</th>
                <th className="text-left p-4 hidden md:table-cell">Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-100 dark:divide-gray-800">
              {PG_PROGRAMMES.map((p) => (
                <tr key={p.spec} className="font-medium text-gray-700 dark:text-gray-300">
                  <td className="p-4 font-bold text-[#1a0606] dark:text-white">{p.prog}</td>
                  <td className="p-4">{p.spec}</td>
                  <td className="p-4 text-center">{p.seats}</td>
                  <td className="p-4 text-center">{p.dur}</td>
                  <td className="p-4 hidden md:table-cell text-xs">{p.elig}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-xl text-[#1a0606] dark:text-white mb-1">Ready to apply?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Online enquiry · online pay · campus visit — all in one click.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admissions/how-to-apply" className="bg-[#800000] hover:bg-[#5c0202] text-white px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">How to Apply</Link>
            <Link to="/admissions" className="bg-amber-300 hover:bg-amber-400 text-[#2a0101] px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">Admissions</Link>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}

/* ============================================================
   7.  INFRASTRUCTURE
   ============================================================ */
const FACILITIES = [
  { Icon: BookOpen,    title: "Akshardaam Central Library", body: "64,000+ books, 50,000+ e-journals, IEEE & Springer access — a dedicated library block with reading rooms and digital terminals." },
  { Icon: Building2,   title: "45 Smart Classrooms",        body: "Smart interactive LCDs, ICT audio-video in 25 rooms, Wi-Fi and a fibre-optic backbone across the campus." },
  { Icon: Sparkles,    title: "42 State-of-the-Art Labs",   body: "Including 18 specialised computing labs and licensed software — ANSYS, Microsoft Office, Turnitin and virtual lab access." },
  { Icon: Users2,      title: "728 Computers",              body: "Hybrid terminals across every academic block. Total per-student computing access among the best in central India." },
  { Icon: Trophy,      title: "NAAD Amphitheatre",          body: "A 2,500-seat outdoor amphitheatre — host to DiversITM, Megh Malhar and the institute's biggest cultural productions." },
  { Icon: Calendar,    title: "Auditorium (Upcoming)",      body: "A 1,500-seat modern in-house auditorium currently under development for academic conferences and events." },
  { Icon: Trophy,      title: "Sports Complex",              body: "Cricket, football, basketball, kabaddi, hockey, badminton plus an indoor gym, table tennis, chess and carrom." },
  { Icon: BookmarkCheck, title: "On-Campus Hostels",        body: "Separate residential blocks for boys and girls with mess, Wi-Fi and 24×7 security." },
  { Icon: Leaf,         title: "Meditation Zone",            body: "A 'Zero Gravity' wellness and meditation centre, plus a lawn that seats 100+ for yoga and outdoor events." },
];

export function InfrastructurePage() {
  return (
    <PageShell
      eyebrow="Infrastructure"
      title="Everything a"
      accentTitle="modern campus needs."
      intro="42 labs, 45 smart classrooms, 728 computers, a 64K-book library, a 2,500-seat amphitheatre, residential hostels and a sports complex — all on a single connected campus."
      chips={["45 Classrooms", "42 Labs", "728 Computers", "2.5K Amphitheatre", "On-campus Hostel"]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {FACILITIES.map((f) => (
          <motion.div key={f.title}
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
            className="bg-white dark:bg-gray-900 rounded-3xl border border-rose-50 dark:border-gray-800 p-3 sm:p-6 hover:shadow-xl transition-shadow"
          >
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#800000] to-[#3e0202] text-amber-200 flex items-center justify-center shadow-md mb-3 sm:mb-4">
              <f.Icon size={22} strokeWidth={2.1} />
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-[#1a0606] dark:text-white mb-1.5 sm:mb-2">{f.title}</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium line-clamp-3 sm:line-clamp-none">{f.body}</p>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}

/* ============================================================
   8.  BEST PRACTICES
   ============================================================ */
export function BestPracticesPage() {
  return (
    <PageShell
      eyebrow="Institute Best Practices"
      title="Two practices that"
      accentTitle="define how we work."
      intro="ITM Gwalior's institutional Best Practices, recognised under NAAC criteria. Built from the bottom up over a decade of trial, refinement and student feedback."
    >
      <div className="grid md:grid-cols-2 gap-3 sm:gap-6">
        <Card>
          <span className="text-[10px] uppercase tracking-widest text-amber-700 dark:text-amber-300 font-black">Best Practice 1</span>
          <h3 className="text-lg sm:text-2xl font-black text-[#1a0606] dark:text-white mt-2 mb-2 sm:mb-3 leading-tight">
            Activity-Based Continuous Assessment (ABCAS)
          </h3>
          <Prose>
            <p>
              ABCAS replaces high-stakes single-exam evaluation with continuous, project-based
              assessment. Students earn marks through hands-on projects, lab assignments, peer
              presentations, and industry-aligned activities throughout the semester.
            </p>
            <p>
              The result: stronger fundamentals, better team and presentation skills, and an
              outcomes-mapped grade that genuinely reflects competency rather than a single test.
            </p>
          </Prose>
        </Card>
        <Card>
          <span className="text-[10px] uppercase tracking-widest text-amber-700 dark:text-amber-300 font-black">Best Practice 2</span>
          <h3 className="text-lg sm:text-2xl font-black text-[#1a0606] dark:text-white mt-2 mb-2 sm:mb-3 leading-tight">
            Industry-Embedded Project-Based Learning
          </h3>
          <Prose>
            <p>
              From the first year onward, students work on real projects scoped with industry
              partners and faculty supervisors. Combined with TAP Cell mentorship and the
              Microsoft Learn Centre of Excellence pipeline, this produces graduates who are
              measurably industry-ready.
            </p>
            <p>
              The model directly underwrites our 80%+ placement track record and the World Book
              of Records recognition for delivering five lakh internships in three years.
            </p>
          </Prose>
        </Card>
      </div>

      <p className="text-xs text-gray-500 font-medium">
        Full NAAC documentation for Best Practices is available in the institute's IQAC archive.
      </p>
    </PageShell>
  );
}

/* ============================================================
   9.  STUDENT MAGAZINE
   ============================================================ */
export function MagazinePage() {
  return (
    <PageShell
      eyebrow="Student Magazine"
      title="ITM Sandesh —"
      accentTitle="our annual chronicle."
      intro="Student-written, faculty-edited, designed in-house. The institute's annual magazine captures the year in essays, photo features, alumni voices and research highlights."
    >
      <Card className="bg-gradient-to-br from-[#1a0606] to-[#3e0202] text-white border-amber-300/30">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-center">
          <div>
            <Newspaper className="text-amber-300 mb-3" size={40} />
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">ITM Sandesh</h3>
            <p className="text-rose-100/80 leading-relaxed font-medium mb-4">
              Featuring perspectives from across the institute — student writers, faculty
              columnists, alumni guests and visiting industry leaders. A year-in-review issue
              published every academic session.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="https://www.itmgoi.in/magazine.php" target="_blank" rel="noreferrer"
                className="bg-amber-300 hover:bg-amber-400 text-[#1a0606] px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">Browse Past Issues</a>
              <a href="mailto:magazine@itmgoi.in"
                className="border border-amber-300/40 hover:bg-amber-300/10 text-amber-300 px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">Submit a Piece</a>
            </div>
          </div>
          <div className="aspect-[4/5] rounded-3xl bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center">
            <BookOpen className="text-amber-300/50" size={72} />
          </div>
        </div>
      </Card>
    </PageShell>
  );
}

/* ============================================================
   10. POLICIES & REPORTS
   ============================================================ */
const POLICIES = [
  { title: "Quality Policy",                  body: "The institute's NAAC-aligned quality framework — programme outcomes, course outcomes and continuous improvement cycles." },
  { title: "Outcome-Based Education (OBE)",   body: "POs, PEOs and PSOs defined for every programme — published annually by the IQAC." },
  { title: "Anti-Ragging Policy",              body: "Zero-tolerance policy aligned with UGC regulations. A 28-member committee, helpline numbers and online grievance form." },
  { title: "Sexual Harassment Policy",        body: "ICC-compliant policy and complaint channel managed by the Women Empowerment Cell." },
  { title: "Academic Calendar",                body: "Programme-wise schedule for teaching, evaluation and breaks — published each session." },
  { title: "Examination Code of Conduct",     body: "Procedural and disciplinary norms for end-semester examinations." },
  { title: "Leave & Attendance",                body: "Faculty and student leave/attendance policy with formal application channels." },
  { title: "Research Ethics",                  body: "Plagiarism (Turnitin), authorship norms and responsible research conduct guidelines." },
];

export function PoliciesPage() {
  return (
    <PageShell
      eyebrow="Policies & Reports"
      title="Compliance,"
      accentTitle="transparency, governance."
      intro="The complete set of institutional policies published by ITM Gwalior — academic, administrative, ethical and welfare — together with the reports each one drives."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {POLICIES.map((p) => (
          <Card key={p.title}>
            <ScrollText className="text-[#800000] dark:text-amber-300 mb-3" size={22} />
            <h3 className="font-black text-base text-[#1a0606] dark:text-white mb-2">{p.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{p.body}</p>
          </Card>
        ))}
      </div>
      <Card className="text-center">
        <FileText className="mx-auto text-[#800000] dark:text-amber-300 mb-2" size={28} />
        <h3 className="font-black text-lg text-[#1a0606] dark:text-white">Need a specific document?</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1 mb-4">
          The full IQAC documentation portal carries every signed and dated policy.
        </p>
        <Link to="/iqac" className="inline-flex items-center gap-2 bg-[#800000] hover:bg-[#5c0202] text-white px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">
          Visit IQAC Portal
        </Link>
      </Card>
    </PageShell>
  );
}

/* ============================================================
   11. INSTITUTE DISTINCTIVENESS (dedicated page)
   ============================================================ */
export function DistinctivenessPageRoute() {
  return (
    <PageShell
      eyebrow="Institute Distinctiveness"
      title="Where art meets"
      accentTitle="engineering."
      intro="An engineering campus most students will compare to an art college. ITM's distinctiveness comes from the six cultural and academic pillars our faculty have built since 2006."
    >
      <Prose>
        <p>
          ITM Gwalior is one of the very few engineering institutes in India where students walk
          past international stone sculptures on their way to the computing lab. The campus is an
          open-air gallery — built deliberately over two decades through symposia, festivals,
          curriculum and partnership.
        </p>
      </Prose>
      <Link to="/" className="inline-flex items-center gap-2 text-[#800000] dark:text-amber-300 font-black text-[11px] uppercase tracking-widest">
        ← See the six pillars on the homepage
      </Link>
    </PageShell>
  );
}

/* ============================================================
   12. WHAT GWALIOR OFFERS
   ============================================================ */
const GWALIOR_HIGHLIGHTS = [
  { Icon: Award,       title: "Gwalior Fort",          body: "One of India's largest and most painted forts — sits atop a sandstone hill, immortalised by Mughal chroniclers as 'the pearl in the necklace of forts of Hind'." },
  { Icon: Sparkles,    title: "Tansen's Tomb",          body: "Resting place of the legendary musician Mian Tansen of Akbar's court — Megh Malhar's spiritual home and the namesake of our annual music festival." },
  { Icon: BookOpen,    title: "Scindia Museum",         body: "The Jai Vilas Palace museum — antique Belgian chandeliers, a 12-seat silver dining train, royal carriages and one of India's richest royal collections." },
  { Icon: GraduationCap, title: "Academic Heritage",     body: "Home to Scindia School, IIITM Gwalior, Jiwaji University, ABV-IIITM and other premier institutions — central India's de facto education capital." },
  { Icon: MapPin,      title: "Connectivity",           body: "On the Delhi-Mumbai golden quadrilateral; the Gwalior airport, intercity trains and NH-44/75 highways put Delhi, Agra and Bhopal under 5 hours away." },
  { Icon: Calendar,    title: "Festivals",              body: "The Tansen Sangeet Samaroh and Gwalior Trade Fair anchor a packed cultural calendar across the year." },
];

export function GwaliorPage() {
  return (
    <PageShell
      eyebrow="What Gwalior Offers"
      title="A heritage city for"
      accentTitle="a future-facing campus."
      intro="ITM Gwalior sits in one of India's oldest centres of culture, music, art and education. Here's what life outside the campus gates looks like."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {GWALIOR_HIGHLIGHTS.map((g) => (
          <Card key={g.title}>
            <g.Icon className="text-[#800000] dark:text-amber-300 mb-3" size={26} />
            <h3 className="font-black text-lg text-[#1a0606] dark:text-white mb-2">{g.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{g.body}</p>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

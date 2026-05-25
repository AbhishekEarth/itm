import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HeartHandshake, Leaf, Trophy, Users2, ShieldCheck, Scale,
  Phone, Mail, Sparkles, BookOpen, Cpu, Camera, Film, BookText,
  FlaskConical, Vote, HeartPulse, Bot,
} from "lucide-react";
import PageShell, { SectionTitle, Card, Prose, FactRow } from "./_PageShell";

/* ============================================================
   NSS — National Service Scheme
   ============================================================ */
export function NSSPage() {
  return (
    <PageShell
      eyebrow="NSS Cell · Not Me, But You"
      title="National"
      accentTitle="Service Scheme."
      intro="The NSS Cell at ITM Gwalior operates under the Ministry of Youth Affairs and Sports, Government of India. It is the institute's largest civic-engagement programme — 200 volunteers per session running blood drives, plantation campaigns, village outreach and leadership camps."
      chips={["Govt-funded", "200 volunteers/session", "Both boys & girls units", "NSS State Award nominee"]}
    >
      <section>
        <SectionTitle eyebrow="Mission" title="Civic awareness through" accent="hands-on service." />
        <Prose>
          <p>
            NSS exists to develop students into civically aware citizens. Volunteers are placed
            in real community-need contexts — adopted villages, hospital blood-collection drives,
            sanitation campaigns and the institute's plantation calendar. The motto, "Not Me,
            But You," frames the entire programme.
          </p>
        </Prose>
      </section>

      <section className="grid lg:grid-cols-2 gap-5">
        <Card>
          <Sparkles className="text-[#800000] dark:text-amber-300 mb-3" size={22} />
          <h3 className="font-black text-lg text-[#1a0606] dark:text-white mb-2">Major Initiatives</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium space-y-2">
            <li>· Blood Donation Camps — ~500 units collected for JAH Hospital, Gwalior.</li>
            <li>· "One Student One Tree" plantation drives.</li>
            <li>· Village adoption visits under Unnat Bharat Abhiyan.</li>
            <li>· HIV/AIDS, environment and women's empowerment Nukkad Natak (street plays).</li>
            <li>· 7-day residential leadership training camps.</li>
            <li>· Debates, essay and poster competitions throughout the year.</li>
          </ul>
        </Card>
        <Card>
          <Trophy className="text-[#800000] dark:text-amber-300 mb-3" size={22} />
          <h3 className="font-black text-lg text-[#1a0606] dark:text-white mb-2">Recognition</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium space-y-2">
            <li>· Volunteers selected for the Pre-Republic Day Parade Camp.</li>
            <li>· Volunteers selected for the National Integration Camp.</li>
            <li>· University and national recognition for Swachh Bharat Summer Internship.</li>
            <li>· Perennial Fund Award under UBA for village-adoption work.</li>
            <li>· Awards for Nukkad Natak on HIV awareness and plantation initiatives.</li>
            <li>· Nominated for the NSS State Award by Jiwaji University.</li>
          </ul>
        </Card>
      </section>

      <section>
        <SectionTitle eyebrow="Programme Officers" title="The faculty behind" accent="the cell." />
        <div className="grid sm:grid-cols-2 gap-4">
          <Card><div className="font-black text-base text-[#1a0606] dark:text-white">Mr. Narendra Kumar Verma</div><div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">NSS Programme Officer · Assistant Professor, Mechanical Engineering</div></Card>
          <Card><div className="font-black text-base text-[#1a0606] dark:text-white">Mrs. Archana Tomar</div><div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">NSS Girls Unit Programme Officer · Assistant Professor, CSE</div></Card>
        </div>
      </section>
    </PageShell>
  );
}

/* ============================================================
   UBA — Unnat Bharat Abhiyan
   ============================================================ */
export function UBAPage() {
  return (
    <PageShell
      eyebrow="UBA Cell · Unnat Bharat Abhiyan"
      title="Rural India,"
      accentTitle="engineered."
      intro="A Government of India initiative that connects the institute's expertise with the development challenges of nearby villages. ITM Gwalior has been an active participant since 2018-19."
      chips={["MHRD initiative", "5 villages adopted", "Since 2018-19", "Block Dabra"]}
    >
      <section>
        <SectionTitle eyebrow="Mission" title="Bridging the urban-rural" accent="knowledge gap." />
        <Prose>
          <p>
            UBA exists to leverage ITM's knowledge base for the development challenges of rural
            India. Faculty and students work directly with adopted villages to design,
            prototype and deploy sustainable interventions — from water-harvesting systems to
            digital school libraries.
          </p>
        </Prose>
      </section>

      <section>
        <SectionTitle eyebrow="Adopted Villages" title="Five villages in" accent="Block Dabra, Gwalior." />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {["Sarnagat", "Badera", "Belgada", "Bargava", "Chetupada"].map((v) => (
            <Card key={v} className="text-center"><Leaf className="mx-auto text-emerald-600 dark:text-emerald-400 mb-2" size={22} /><div className="font-black text-[#1a0606] dark:text-white">{v}</div></Card>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-5">
        <Card>
          <h3 className="font-black text-lg text-[#1a0606] dark:text-white mb-3">Active Projects</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium space-y-2">
            <li>· <b>Education</b> — school libraries, digital resources, career guidance.</li>
            <li>· <b>Health & Hygiene</b> — medical camps and sanitation awareness.</li>
            <li>· <b>Infrastructure</b> — water harvesting, road repairs, electrification.</li>
            <li>· <b>Environment</b> — waste management, tree planting, renewable energy.</li>
            <li>· <b>Engagement</b> — 6-7 planned village visits per semester.</li>
          </ul>
        </Card>
        <Card>
          <h3 className="font-black text-lg text-[#1a0606] dark:text-white mb-3">Coordinators</h3>
          <div className="space-y-3 text-sm font-medium">
            <div>
              <div className="font-black text-[#1a0606] dark:text-white">Dr. Meenakshi Mazumdar</div>
              <div className="text-gray-600 dark:text-gray-400">Nodal Officer · meenakshi.mazumdar@itmgoi.in</div>
            </div>
            <div>
              <div className="font-black text-[#1a0606] dark:text-white">Mr. Narendra Kumar Verma</div>
              <div className="text-gray-600 dark:text-gray-400">Institute Coordinator · uba@itmgoi.in · +91-8109707108</div>
            </div>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}

/* ============================================================
   WEC — Women Empowerment Cell
   ============================================================ */
export function WECPage() {
  return (
    <PageShell
      eyebrow="Women Empowerment Cell"
      title="Equal voice."
      accentTitle="Safer campus."
      intro="The WEC creates awareness of women's rights, empowers women and girl students, and treats sexual harassment as unacceptable behaviour — both on campus and in the wider community."
      chips={["Centre of Excellence (2025)", "Honeywell + ICT Academy partner", "Departmental reps"]}
    >
      <section>
        <SectionTitle eyebrow="Leadership" title="Chairperson &" accent="committee." />
        <div className="grid sm:grid-cols-2 gap-4">
          <Card><div className="font-black text-base text-[#1a0606] dark:text-white">Dr. Megha Lahane</div><div className="text-sm text-[#800000] dark:text-amber-300 font-bold mt-1">Chairperson, WEC</div></Card>
          {["Dr. Prabha Dixit", "Ms. Priusha Narwariya", "Ms. Vishakha Yadav"].map((n) => (
            <Card key={n}><div className="font-black text-base text-[#1a0606] dark:text-white">{n}</div><div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Member · WEC</div></Card>
          ))}
        </div>
        <p className="text-xs text-gray-500 font-medium mt-3">Each academic department contributes a female faculty representative.</p>
      </section>

      <section>
        <SectionTitle eyebrow="Programmes" title="What the cell" accent="actually runs." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Awareness & Advocacy", items: ["Expert lecture: Challenges in Being a Woman Sculptor (Feb 2024)", "Seminar: Challenges & Opportunities for Sex Workers & Their Children (Nov 2023)", "Workshop: Prevention of Sexual Harassment at Workplace (Nov 2023)", "Expert talk: Stop Violence Against Women (Nov 2022)"] },
            { title: "Community Engagement", items: ["Nukkad Natak on gender equality across adopted villages (Jan 2024)", "International Women's Day celebrations (2022, 2023)", "Sports Day for female faculty, staff and students (Mar 2023)"] },
            { title: "Student Competitions", items: ["Poster presentation competition", "Self-composed poem recitation", "Skit competitions"] },
          ].map((b) => (
            <Card key={b.title}>
              <h3 className="font-black text-base text-[#1a0606] dark:text-white mb-3">{b.title}</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium space-y-2">
                {b.items.map((it) => <li key={it}>· {it}</li>)}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

/* ============================================================
   Sports Cell
   ============================================================ */
const SPORTS_LIST = ["Cricket", "Football", "Basketball", "Volleyball", "Kabaddi", "Hockey", "Badminton", "Table Tennis", "Chess", "Carrom", "Indoor Gym", "Track & Field"];

export function SportsPage() {
  return (
    <PageShell
      eyebrow="Sports Cell"
      title="Sport, fitness &"
      accentTitle="sportsmanship."
      intro="The Sports Cell promotes fitness, teamwork and sportsmanship — through expert coaching, a sports complex covering 12+ disciplines and a packed inter-college tournament calendar."
      chips={["Hosts RGPV Nodal-level events", "Annual Sports Meet", "State & national reps"]}
    >
      <section className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <h3 className="font-black text-lg text-[#1a0606] dark:text-white mb-3">Sports On Campus</h3>
          <div className="flex flex-wrap gap-2">
            {SPORTS_LIST.map((s) => (
              <span key={s} className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 bg-rose-50 dark:bg-gray-800 text-[#800000] dark:text-amber-300 rounded-full">{s}</span>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium mt-5">
            Multipurpose ground for outdoor sport, an indoor gym, indoor games rooms (chess,
            table tennis, carrom), and a lawn that seats 100+ for yoga and warm-ups.
          </p>
        </Card>
        <Card>
          <h3 className="font-black text-lg text-[#1a0606] dark:text-white mb-3">Achievements</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium space-y-2">
            <li>· Wins / runner-up at Nodal and State tournaments.</li>
            <li>· Student athletes at state and national championships.</li>
            <li>· Alumni placed in government and corporate sports teams.</li>
          </ul>
        </Card>
      </section>

      <section>
        <SectionTitle eyebrow="Leadership" title="Sports" accent="Officer." />
        <Card>
          <div className="font-black text-lg text-[#1a0606] dark:text-white">Mr. Mushahid Khan</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Sports Officer · sportsofficer@itmgoi.in</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-3">Supported by faculty coordinators from CSE, EC, ME, CE, IT and MBA departments.</p>
        </Card>
      </section>
    </PageShell>
  );
}

/* ============================================================
   IQAC
   ============================================================ */
export function IQACPage() {
  return (
    <PageShell
      eyebrow="Internal Quality Assurance Cell"
      title="Quality is"
      accentTitle="a continuous loop."
      intro="The IQAC develops and runs ITM's quality system — for conscious, consistent, catalytic improvement of academic and administrative performance."
      chips={["NAAC A · CGPA 3.01", "OBE compliant", "Annual reports"]}
    >
      <section>
        <SectionTitle eyebrow="Composition" title="Constituted under" accent="the Director." />
        <Prose>
          <p>
            The IQAC is constituted in the institute under the chairmanship of the Director,
            along with the Dean Academics, Heads of Departments, administrative members,
            teaching staff, alumni and other stakeholders.
          </p>
        </Prose>
      </section>

      <section>
        <SectionTitle eyebrow="Responsibilities" title="What the cell" accent="actually does." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Creating and implementing quality benchmarks for academic & administrative activity.",
            "Fostering an environment that centers student learning and faculty growth.",
            "Gathering feedback from students, parents and institutional stakeholders.",
            "Conducting workshops and seminars on quality improvement themes.",
            "Building an institutional quality culture.",
            "Maintaining OBE documentation — POs, PEOs and PSOs for every programme.",
          ].map((it, i) => (
            <Card key={i}>
              <div className="text-2xl font-black text-[#800000] dark:text-amber-300 mb-2">{String(i + 1).padStart(2, "0")}</div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{it}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Action Areas" title="Where IQAC" accent="focuses." />
        <Prose>
          <p>
            Curriculum innovation and examination reforms · library services and community
            engagement · student placement and financial assistance · staff development
            programmes · health services and educational costs.
          </p>
        </Prose>
      </section>
    </PageShell>
  );
}

/* ============================================================
   Anti-Ragging
   ============================================================ */
export function AntiRaggingPage() {
  return (
    <PageShell
      eyebrow="Anti-Ragging Cell"
      title="Zero tolerance."
      accentTitle="Full transparency."
      intro="ITM Gwalior follows the UGC Grievance Redressal Regulations 2012 — addressing academics, examinations, services, financial issues, infrastructure, hostel and discrimination grievances under one transparent policy."
      chips={["UGC-compliant", "28-member committee", "Online grievance form", "Helpline"]}
    >
      <section>
        <SectionTitle eyebrow="Leadership" title="Chairman &" accent="Secretary." />
        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <ShieldCheck className="text-[#800000] dark:text-amber-300 mb-2" size={24} />
            <div className="font-black text-lg text-[#1a0606] dark:text-white">Dr. Manoj Mishra</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Chairman · Dean of Student Welfare</div>
            <a href="tel:+919926519510" className="inline-flex items-center gap-2 text-[#800000] dark:text-amber-300 font-black text-sm mt-3"><Phone size={14} /> +91-99265 19510</a>
          </Card>
          <Card>
            <ShieldCheck className="text-[#800000] dark:text-amber-300 mb-2" size={24} />
            <div className="font-black text-lg text-[#1a0606] dark:text-white">Mr. Nitin Dixit</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Secretary · Associate DSW</div>
            <a href="tel:+919098008180" className="inline-flex items-center gap-2 text-[#800000] dark:text-amber-300 font-black text-sm mt-3"><Phone size={14} /> +91-90980 08180</a>
          </Card>
        </div>
        <p className="text-xs text-gray-500 font-medium mt-3">
          Full 28-member committee covers every academic department (CSE, EC, ME, CE, IT, MBA,
          Humanities), administrative staff and hostel wardens.
        </p>
      </section>

      <section>
        <SectionTitle eyebrow="Grievance Process" title="Report online." accent="Get a written response." />
        <Card>
          <Prose>
            <p>
              The grievance process is <b>time-bound and result-oriented</b>. Students may file
              concerns anonymously or by name through the online form — sexual harassment
              complaints go through the same channel and are routed to the Internal Complaints
              Committee.
            </p>
          </Prose>
          <div className="flex flex-wrap gap-3 mt-5">
            <a href="https://forms.gle/VTEumajnux762Vtv8" target="_blank" rel="noreferrer"
              className="bg-[#800000] hover:bg-[#5c0202] text-white px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">Online Grievance Form</a>
            <a href="tel:+917773005065"
              className="border border-[#800000]/30 hover:bg-rose-50 text-[#800000] dark:border-amber-300/40 dark:hover:bg-amber-300/10 dark:text-amber-300 px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">
              <Phone className="inline mr-1.5" size={12} /> Admission Helpline
            </a>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}

/* ============================================================
   Other Clubs & Activities
   ============================================================ */
const OTHER_CLUBS = [
  { Icon: Bot,           name: "Makers Lab Students Club", body: "Hands-on drone technology and robotics — bridging academic learning with practical application." },
  { Icon: Camera,        name: "Film & Photography Club", body: "Visual arts, composition, lighting and photography technique. Weekly walks plus print studio access." },
  { Icon: Leaf,          name: "Eco Club", body: "Environmental sustainability — recycling, tree planting, clean-up drives and awareness campaigns." },
  { Icon: BookText,      name: "Literary Club", body: "Creativity and critical thinking via debate, open mic and book discussions." },
  { Icon: FlaskConical, name: "Science & Technology Club", body: "STEM exploration, new technologies and collaborative projects across all departments." },
  { Icon: BookOpen,     name: "Library Club", body: "Reading habits and information literacy — quizzes, poster-making and book discussions." },
  { Icon: HeartPulse,    name: "Red Ribbon Club (RRC)", body: "HIV/AIDS awareness, blood donation camps and health workshops." },
  { Icon: Sparkles,     name: "I'vent'o Students Club", body: "Technical, non-technical and eSports competitions, workshops and live projects." },
  { Icon: Cpu,           name: "Google Developer Student Club (GDSC)", body: "Workshops, hackathons and community events in tech, led by Google's student developer program." },
  { Icon: Sparkles,     name: "DataVibe Network (DvN)", body: "For data-science students — networking, technical workshops and project sprints." },
  { Icon: Vote,          name: "Electoral Literacy Club (ELC)", body: "Voter awareness and democratic participation — registration drives and mock elections." },
  { Icon: Film,          name: "Performing Arts Club (PAC)", body: "Music, dance, drama and stagecraft — home of KRONOS, Maharathi and Megh Malhar." },
];

export function OtherClubsPage() {
  return (
    <PageShell
      eyebrow="Student Clubs & Activities"
      title="A community"
      accentTitle="for every passion."
      intro="Twelve active student clubs covering technology, arts, sport, civic engagement and community service — every one of them student-led with faculty mentorship."
      chips={["12 active clubs", "Student-led", "Faculty-mentored"]}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {OTHER_CLUBS.map((c, i) => (
          <motion.div key={c.name}
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: (i % 6) * 0.04 }}
            className="bg-white dark:bg-gray-900 rounded-3xl border border-rose-50 dark:border-gray-800 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#800000] to-[#3e0202] text-amber-200 flex items-center justify-center shadow-md mb-4">
              <c.Icon size={20} strokeWidth={2.1} />
            </div>
            <h3 className="font-black text-base text-[#1a0606] dark:text-white mb-2">{c.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{c.body}</p>
          </motion.div>
        ))}
      </div>
      <Card className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-xl text-[#1a0606] dark:text-white mb-1">Want to start a new club?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Reach out to the Dean of Student Welfare and we'll help you charter it.</p>
          </div>
          <Link to="/contact" className="bg-[#800000] hover:bg-[#5c0202] text-white px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">Contact DSW</Link>
        </div>
      </Card>
    </PageShell>
  );
}

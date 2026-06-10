import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { EditModeProvider, useEditMode, isEmbeddedPreview } from './context/EditModeContext';
import AdminEditBar from './components/admin/AdminEditBar';
import EditableSection from './components/admin/EditableSection';
import AdminLogin from './pages/AdminLogin';

// ─── Admin (lazy) ────────────────────────────────────────────────────────────
const AdminDashboard   = lazy(() => import('./pages/AdminDashboard'));
const EditorDashboard  = lazy(() => import('./pages/admin/EditorDashboard'));
const AdminFaculty     = lazy(() => import('./pages/AdminFaculty'));
const AdminStudents    = lazy(() => import('./pages/AdminStudents'));
const AdminUsers       = lazy(() => import('./pages/admin/AdminUsers'));
const AdminSettings    = lazy(() => import('./pages/admin/AdminSettings'));
const AdminPages       = lazy(() => import('./pages/admin/AdminPages'));
const AdminPageEditor  = lazy(() => import('./pages/admin/AdminPageEditor'));
const AdminPagesList   = lazy(() => import('./pages/admin/AdminPageEditor').then((m) => ({ default: m.PagesList })));
const AdminNewPage     = lazy(() => import('./pages/admin/AdminNewPage'));
const AdminMedia       = lazy(() => import('./pages/admin/AdminMedia'));
const AdminDepartments = lazy(() => import('./pages/admin/AdminDepartments'));
const AdminPlacements  = lazy(() => import('./pages/admin/AdminPlacements'));
const AdminResearch    = lazy(() => import('./pages/admin/AdminResearch'));
const AdminEvents      = lazy(() => import('./pages/admin/AdminEvents'));
const AdminGallery     = lazy(() => import('./pages/admin/AdminGallery'));
const AdminLeads       = lazy(() => import('./pages/admin/AdminLeads'));
const AdminCompliance  = lazy(() => import('./pages/admin/AdminCompliance'));
const AdminWhatsNew    = lazy(() => import('./pages/admin/AdminWhatsNew'));
const ChangePassword   = lazy(() => import('./pages/admin/ChangePassword'));
const AdminPACEventForm = lazy(() => import('./components/AdminPACEventForm'));
const AdminEventForm    = lazy(() => import('./components/AdminEventForm'));

// ─── Public pages (lazy) ─────────────────────────────────────────────────────
// Departments
const CSDepartment          = lazy(() => import('./pages/CSDepartment'));
const ECDepartment          = lazy(() => import('./pages/ECDepartment'));
const ITDepartment          = lazy(() => import('./pages/ITDepartment'));
const CEDepartment          = lazy(() => import('./pages/CEDepartment'));
const MEDepartment          = lazy(() => import('./pages/MEDepartment'));
const MBADepartment         = lazy(() => import('./pages/MBADepartment'));
const ESHDepartment         = lazy(() => import('./pages/ESHDepartment'));
const DynamicDepartmentPage = lazy(() => import('./pages/DynamicDepartmentPage'));
const DepartmentPage        = lazy(() => import('./pages/DepartmentPage'));
const EmergingBranches      = lazy(() => import('./pages/EmergingBranches'));
const AIMLPage              = lazy(() => import('./pages/AIMLPage'));
const CloudComputingPage    = lazy(() => import('./pages/CloudComputingPage'));
const CyberSecurityPage     = lazy(() => import('./pages/CyberSecurityPage'));
const CentralLibrary        = lazy(() => import('./pages/CentralLibrary'));

// Admissions
const Admissions    = lazy(() => import('./pages/Admissions'));
const UGCourses     = lazy(() => import('./pages/UGCourses'));
const PGCourses     = lazy(() => import('./pages/PGCourses'));
const SeekAdmission = lazy(() => import('./pages/SeekAdmission'));

// Research
const Research           = lazy(() => import('./pages/Research'));
const ResearchRDCell     = lazy(() => import('./pages/ResearchRDCell'));
const ResearchInnovation = lazy(() => import('./pages/ResearchInnovation'));
const ResearchJournal    = lazy(() => import('./pages/ResearchJournal'));
const ResearchConference = lazy(() => import('./pages/ResearchConference'));
const ResearchFDP        = lazy(() => import('./pages/ResearchFDP'));

// Clubs / Cells
const PACPage = lazy(() => import('./pages/PACPage'));

// Auth
const Onboarding        = lazy(() => import('./pages/Onboarding'));
const Login             = lazy(() => import('./pages/Login'));
const StudentDashboard  = lazy(() => import('./pages/StudentDashboard'));
const FacultyDashboard  = lazy(() => import('./pages/FacultyDashboard'));

// TAP / Placement
const TapPage = lazy(() => import('./pages/TapPage'));

// About pages
const AboutPages = lazy(() => import('./pages/AboutPages'));

// Cells pages
const CellsPages = lazy(() => import('./pages/CellsPages'));

// Alumni pages
const AlumniPages = lazy(() => import('./pages/AlumniPages'));

// Compliance pages
const CompliancePages = lazy(() => import('./pages/CompliancePages'));

// Gallery pages
const GalleryPages = lazy(() => import('./pages/GalleryPages'));

// Other
const ContactPage        = lazy(() => import('./pages/ContactPage'));
const OpenPositionsPage  = lazy(() => import('./pages/OpenPositionsPage'));
const DynamicPage        = lazy(() => import('./pages/DynamicPage'));
const QSiGauge           = lazy(() => import('./pages/QSiGauge'));
const WhatsNew           = lazy(() => import('./pages/WhatsNew'));

// ─── Always-visible home components (kept eager — they ARE the homepage) ─────
import Header          from './components/Header';
import Hero            from './components/Hero';
import Stats           from './components/Stats';
import Placements      from './components/Placements';
import CampusLife      from './components/CampusLife';
import Departments     from './components/Departments';
import Testimonials    from './components/Testimonials';
import Footer          from './components/Footer';
import WhyITM          from './components/WhyITM';
import RecruiterMarquee from './components/RecruiterMarquee';
import AdmissionCTA    from './components/AdmissionCTA';
import DirectorVision  from './components/DirectorVision';
import Distinctiveness from './components/Distinctiveness';
import FloatingSidebar from './components/FloatingSidebar';
import ScrollToTop     from './components/ScrollToTop';
import { ChatbotWidget } from './components/AIChatbot';
import ClubsCells      from './components/ClubsCells';
import {
  CellsAndCommittees,
  UpcomingEvents,
  QuickLinks,
  AlumniSection,
  GalleryPreview,
  ContactSection,
} from './components/HomeExtras';

// ─── Lazy-page wrapper helpers ────────────────────────────────────────────────
function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#020617]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-[3px] border-[#800000]/20 border-t-[#800000] animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading…</span>
      </div>
    </div>
  );
}

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#020617] text-xs uppercase tracking-widest text-gray-400">
      Loading admin…
    </div>
  );
}

// Wrap any lazy page so we don't repeat <Suspense> at every Route
function P({ component: C }) {
  return (
    <Suspense fallback={<PageFallback />}>
      <C />
    </Suspense>
  );
}

// Lazy wrappers for multi-export page files
// AboutPages
const AboutInstitutePage       = lazy(() => import('./pages/AboutPages').then(m => ({ default: m.AboutInstitutePage })));
const MissionVisionPage        = lazy(() => import('./pages/AboutPages').then(m => ({ default: m.MissionVisionPage })));
const OfficialsPage            = lazy(() => import('./pages/AboutPages').then(m => ({ default: m.OfficialsPage })));
const BoardOfGovernorsPage     = lazy(() => import('./pages/AboutPages').then(m => ({ default: m.BoardOfGovernorsPage })));
const DirectorMessagePage      = lazy(() => import('./pages/AboutPages').then(m => ({ default: m.DirectorMessagePage })));
const ProgrammesPage           = lazy(() => import('./pages/AboutPages').then(m => ({ default: m.ProgrammesPage })));
const InfrastructurePage       = lazy(() => import('./pages/AboutPages').then(m => ({ default: m.InfrastructurePage })));
const BestPracticesPage        = lazy(() => import('./pages/AboutPages').then(m => ({ default: m.BestPracticesPage })));
const MagazinePage             = lazy(() => import('./pages/AboutPages').then(m => ({ default: m.MagazinePage })));
const PoliciesPage             = lazy(() => import('./pages/AboutPages').then(m => ({ default: m.PoliciesPage })));
const DistinctivenessPageRoute = lazy(() => import('./pages/AboutPages').then(m => ({ default: m.DistinctivenessPageRoute })));
const GwaliorPage              = lazy(() => import('./pages/AboutPages').then(m => ({ default: m.GwaliorPage })));

// CellsPages
const NSSPage         = lazy(() => import('./pages/CellsPages').then(m => ({ default: m.NSSPage })));
const UBAPage         = lazy(() => import('./pages/CellsPages').then(m => ({ default: m.UBAPage })));
const WECPage         = lazy(() => import('./pages/CellsPages').then(m => ({ default: m.WECPage })));
const SportsPage      = lazy(() => import('./pages/CellsPages').then(m => ({ default: m.SportsPage })));
const IQACPage        = lazy(() => import('./pages/CellsPages').then(m => ({ default: m.IQACPage })));
const AntiRaggingPage = lazy(() => import('./pages/CellsPages').then(m => ({ default: m.AntiRaggingPage })));
const OtherClubsPage  = lazy(() => import('./pages/CellsPages').then(m => ({ default: m.OtherClubsPage })));

// AlumniPages
const AlumniSpeaksPage = lazy(() => import('./pages/AlumniPages').then(m => ({ default: m.AlumniSpeaksPage })));
const MentorshipPage   = lazy(() => import('./pages/AlumniPages').then(m => ({ default: m.MentorshipPage })));
const MembershipPage   = lazy(() => import('./pages/AlumniPages').then(m => ({ default: m.MembershipPage })));
const ChaptersPage     = lazy(() => import('./pages/AlumniPages').then(m => ({ default: m.ChaptersPage })));

// CompliancePages
const NAACPolicyPage  = lazy(() => import('./pages/CompliancePages').then(m => ({ default: m.NAACPolicyPage })));
const CommitteesPage  = lazy(() => import('./pages/CompliancePages').then(m => ({ default: m.CommitteesPage })));
const MOUsPage        = lazy(() => import('./pages/CompliancePages').then(m => ({ default: m.MOUsPage })));
const AppreciationPage = lazy(() => import('./pages/CompliancePages').then(m => ({ default: m.AppreciationPage })));
const NIRFPage        = lazy(() => import('./pages/CompliancePages').then(m => ({ default: m.NIRFPage })));
const CareersPage     = lazy(() => import('./pages/CompliancePages').then(m => ({ default: m.CareersPage })));
const JRFPage         = lazy(() => import('./pages/CompliancePages').then(m => ({ default: m.JRFPage })));

// GalleryPages
const GalleryHubPage      = lazy(() => import('./pages/GalleryPages').then(m => ({ default: m.GalleryHubPage })));
const CulturalGalleryPage = lazy(() => import('./pages/GalleryPages').then(m => ({ default: m.CulturalGalleryPage })));
const ExpertsGalleryPage  = lazy(() => import('./pages/GalleryPages').then(m => ({ default: m.ExpertsGalleryPage })));
const InfraGalleryPage    = lazy(() => import('./pages/GalleryPages').then(m => ({ default: m.InfraGalleryPage })));
const SportsGalleryPage   = lazy(() => import('./pages/GalleryPages').then(m => ({ default: m.SportsGalleryPage })));
const StudentsGalleryPage = lazy(() => import('./pages/GalleryPages').then(m => ({ default: m.StudentsGalleryPage })));
const LifeAtITMPage       = lazy(() => import('./pages/GalleryPages').then(m => ({ default: m.LifeAtITMPage })));
const VideoGalleryPage    = lazy(() => import('./pages/GalleryPages').then(m => ({ default: m.VideoGalleryPage })));

// ─── Home sections ────────────────────────────────────────────────────────────
const HOME_SECTIONS = [
  { key: 'hero',          label: 'Hero',                node: <Hero /> },
  { key: 'stats',         label: 'Stats',               node: <Stats /> },
  { key: 'director',      label: "Director's Vision",   node: <DirectorVision /> },
  { key: 'why-itm',       label: 'Why ITM',             node: <WhyITM /> },
  { key: 'schools',       label: 'Departments',         node: <section id="schools"><Departments /></section> },
  { key: 'distinct',      label: 'Distinctiveness',     node: <Distinctiveness /> },
  { key: 'recruiters',    label: 'Recruiter Marquee',   node: <RecruiterMarquee /> },
  { key: 'campus-life',   label: 'Campus Life',         node: <CampusLife /> },
  { key: 'clubs',         label: 'Clubs & Cells',       node: <section id="clubs"><ClubsCells /></section> },
  { key: 'cells',         label: 'Cells & Committees',  node: <section id="cells"><CellsAndCommittees /></section> },
  { key: 'placements',    label: 'Placements',          node: <Placements /> },
  { key: 'events',        label: 'Upcoming Events',     node: <section id="events"><UpcomingEvents /></section> },
  { key: 'testimonials',  label: 'Testimonials',        node: <Testimonials /> },
  { key: 'alumni',        label: 'Alumni',              node: <section id="alumni"><AlumniSection /></section> },
  { key: 'gallery',       label: 'Gallery',             node: <section id="gallery"><GalleryPreview /></section> },
  { key: 'quick-links',   label: 'Quick Links',         node: <QuickLinks /> },
  { key: 'admission-cta', label: 'Admission CTA',       node: <AdmissionCTA /> },
  { key: 'contact',       label: 'Contact',             node: <section id="contact"><ContactSection /></section> },
];

function HomeContent() {
  const { getLayout, moveSection, toggleHidden } = useEditMode();
  const pageKey = '/';
  const defaultKeys = HOME_SECTIONS.map((s) => s.key);
  const { order, hidden } = getLayout(pageKey, defaultKeys);
  const byKey = Object.fromEntries(HOME_SECTIONS.map((s) => [s.key, s]));

  return (
    <>
      {order.map((key, i) => {
        const section = byKey[key];
        if (!section) return null;
        return (
          <EditableSection
            key={key}
            label={section.label}
            isFirst={i === 0}
            isLast={i === order.length - 1}
            hidden={!!hidden[key]}
            onMove={(dir) => moveSection(pageKey, defaultKeys, key, dir)}
            onToggleHidden={() => toggleHidden(pageKey, key)}
          >
            {section.node}
          </EditableSection>
        );
      })}
    </>
  );
}

function ProtectedRoute({ children, allowPasswordChange = false, adminOnly = false }) {
  const { isAdmin, isEditor, user } = useAuth();
  if (!isAdmin && !isEditor) return <Navigate to="/admin/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/editor" replace />;
  if (user?.must_change_password && !allowPasswordChange) {
    return <Navigate to="/account/change-password" replace />;
  }
  return <Suspense fallback={<AdminFallback />}>{children}</Suspense>;
}

function EditorRoute({ children }) {
  const { isEditor, isAdmin } = useAuth();
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (!isEditor) return <Navigate to="/admin/login" replace />;
  return <Suspense fallback={<AdminFallback />}>{children}</Suspense>;
}

function StudentRoute({ children }) {
  const { isStudent } = useAuth();
  return isStudent ? children : <Navigate to="/login" replace />;
}

function FacultyRoute({ children }) {
  const { isFaculty } = useAuth();
  return isFaculty ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin') || location.pathname.startsWith('/editor');
  const isHome = location.pathname === '/';
  const embedded = isEmbeddedPreview();
  const showChrome = !isAdminArea && !embedded;

  return (
    <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-500">
      {showChrome && <Header />}
      {showChrome && <FloatingSidebar />}
      {showChrome && <AdminEditBar />}
      <div className={!isAdminArea && !isHome && !embedded ? 'pt-[96px] sm:pt-[128px] lg:pt-[140px]' : ''}>
        <Routes>
          {/* HOME */}
          <Route path="/" element={<HomeContent />} />

          {/* DYNAMIC DEPARTMENT & BRANCH ROUTES */}
          <Route path="/department/:deptId"           element={<P component={DynamicDepartmentPage} />} />
          <Route path="/department/:deptId/:branchId" element={<P component={DynamicDepartmentPage} />} />

          {/* DIRECT DEPARTMENT ROUTES */}
          <Route path="/cs"  element={<P component={CSDepartment} />} />
          <Route path="/it"  element={<P component={ITDepartment} />} />
          <Route path="/ece" element={<P component={ECDepartment} />} />
          <Route path="/ce"  element={<P component={CEDepartment} />} />
          <Route path="/me"  element={<P component={MEDepartment} />} />
          <Route path="/mba" element={<P component={MBADepartment} />} />
          <Route path="/esh" element={<P component={ESHDepartment} />} />

          {/* EMERGING BRANCHES */}
          <Route path="/aiml"                             element={<P component={AIMLPage} />} />
          <Route path="/cyber-security"                   element={<P component={CyberSecurityPage} />} />
          <Route path="/cloud-computing"                  element={<P component={CloudComputingPage} />} />
          <Route path="/department/cse/aiml"              element={<P component={AIMLPage} />} />
          <Route path="/department/cse/cyber-security"    element={<P component={CyberSecurityPage} />} />
          <Route path="/department/cse/cloud-computing"   element={<P component={CloudComputingPage} />} />

          {/* LEGACY REDIRECTS */}
          <Route path="/department/cse"   element={<Navigate to="/cs" replace />} />
          <Route path="/department/it"    element={<Navigate to="/it" replace />} />
          <Route path="/department/ece"   element={<Navigate to="/ece" replace />} />
          <Route path="/department/civil" element={<Navigate to="/ce" replace />} />

          {/* ADMISSIONS */}
          <Route path="/admissions"              element={<P component={Admissions} />} />
          <Route path="/admissions/ug"           element={<P component={UGCourses} />} />
          <Route path="/admissions/pg"           element={<P component={PGCourses} />} />
          <Route path="/admissions/how-to-apply" element={<P component={SeekAdmission} />} />

          {/* RESEARCH */}
          <Route path="/research"                       element={<P component={Research} />} />
          <Route path="/research/rd-cell"               element={<P component={ResearchRDCell} />} />
          <Route path="/research/innovation-ecosystem"  element={<P component={ResearchInnovation} />} />
          <Route path="/research/journal"               element={<P component={ResearchJournal} />} />
          <Route path="/research/conference"            element={<P component={ResearchConference} />} />
          <Route path="/research/fdp"                   element={<P component={ResearchFDP} />} />

          {/* CLUBS */}
          <Route path="/pac"   element={<P component={PACPage} />} />
          <Route path="/uba"   element={<P component={UBAPage} />} />
          <Route path="/nss"   element={<P component={NSSPage} />} />
          <Route path="/sports" element={<P component={SportsPage} />} />
          <Route path="/wec"   element={<P component={WECPage} />} />

          {/* OTHER */}
          <Route path="/onboarding"       element={<P component={Onboarding} />} />
          <Route path="/tap"              element={<P component={TapPage} />} />
          <Route path="/library"          element={<P component={CentralLibrary} />} />
          <Route path="/central-library"  element={<P component={CentralLibrary} />} />
          <Route path="/emerging-branches" element={<P component={EmergingBranches} />} />
          <Route path="/department"       element={<P component={DepartmentPage} />} />
          <Route path="/qsi-gauge"        element={<P component={QSiGauge} />} />
          <Route path="/whats-new"        element={<P component={WhatsNew} />} />

          {/* AUTH */}
          <Route path="/login"               element={<P component={Login} />} />
          <Route path="/student/dashboard"   element={<StudentRoute><P component={StudentDashboard} /></StudentRoute>} />
          <Route path="/faculty/dashboard"   element={<FacultyRoute><P component={FacultyDashboard} /></FacultyRoute>} />

          {/* ADMIN & EDITOR */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin"       element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/editor"      element={<EditorRoute><EditorDashboard /></EditorRoute>} />
          <Route path="/admin/faculty"            element={<ProtectedRoute><AdminFaculty /></ProtectedRoute>} />
          <Route path="/admin/students"           element={<ProtectedRoute><AdminStudents /></ProtectedRoute>} />
          <Route path="/admin/users"              element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/settings"           element={<ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute>} />
          <Route path="/admin/pages"              element={<ProtectedRoute><AdminPages /></ProtectedRoute>} />
          <Route path="/admin/pages/visual"       element={<ProtectedRoute><AdminPagesList /></ProtectedRoute>} />
          <Route path="/admin/pages/new"          element={<ProtectedRoute><AdminNewPage /></ProtectedRoute>} />
          <Route path="/admin/pages/:key/edit"    element={<ProtectedRoute><AdminPageEditor /></ProtectedRoute>} />
          <Route path="/admin/media"              element={<ProtectedRoute><AdminMedia /></ProtectedRoute>} />
          <Route path="/admin/departments"        element={<ProtectedRoute><AdminDepartments /></ProtectedRoute>} />
          <Route path="/admin/placements-cell"    element={<ProtectedRoute><AdminPlacements /></ProtectedRoute>} />
          <Route path="/admin/research"           element={<ProtectedRoute><AdminResearch /></ProtectedRoute>} />
          <Route path="/admin/events"             element={<ProtectedRoute><AdminEvents /></ProtectedRoute>} />
          <Route path="/admin/gallery"            element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
          <Route path="/admin/whats-new"          element={<ProtectedRoute><AdminWhatsNew /></ProtectedRoute>} />
          <Route path="/admin/leads"              element={<ProtectedRoute><AdminLeads /></ProtectedRoute>} />
          <Route path="/admin/compliance"         element={<ProtectedRoute><AdminCompliance /></ProtectedRoute>} />
          <Route path="/account/change-password"  element={<ProtectedRoute allowPasswordChange><ChangePassword /></ProtectedRoute>} />
          <Route path="/admin/pac"                element={<ProtectedRoute><AdminPACEventForm /></ProtectedRoute>} />
          <Route path="/admin/tap"                element={<ProtectedRoute><AdminEventForm /></ProtectedRoute>} />
          <Route path="/admin/placements"         element={<ProtectedRoute><AdminPACEventForm /></ProtectedRoute>} />

          {/* ABOUT */}
          <Route path="/about"                      element={<P component={AboutInstitutePage} />} />
          <Route path="/about/mission-vision"       element={<P component={MissionVisionPage} />} />
          <Route path="/about/officials"            element={<P component={OfficialsPage} />} />
          <Route path="/about/board-of-governors"   element={<P component={BoardOfGovernorsPage} />} />
          <Route path="/about/director-message"     element={<P component={DirectorMessagePage} />} />
          <Route path="/about/programmes"           element={<P component={ProgrammesPage} />} />
          <Route path="/about/infrastructure"       element={<P component={InfrastructurePage} />} />
          <Route path="/about/best-practices"       element={<P component={BestPracticesPage} />} />
          <Route path="/about/distinctiveness"      element={<P component={DistinctivenessPageRoute} />} />
          <Route path="/about/magazine"             element={<P component={MagazinePage} />} />
          <Route path="/about/policies"             element={<P component={PoliciesPage} />} />
          <Route path="/about/gwalior"              element={<P component={GwaliorPage} />} />

          {/* CELLS */}
          <Route path="/cells/nss"    element={<P component={NSSPage} />} />
          <Route path="/cells/uba"    element={<P component={UBAPage} />} />
          <Route path="/cells/wec"    element={<P component={WECPage} />} />
          <Route path="/cells/sports" element={<P component={SportsPage} />} />
          <Route path="/iqac"         element={<P component={IQACPage} />} />
          <Route path="/anti-ragging" element={<P component={AntiRaggingPage} />} />
          <Route path="/clubs"        element={<P component={OtherClubsPage} />} />

          {/* ALUMNI */}
          <Route path="/alumni/speaks"      element={<P component={AlumniSpeaksPage} />} />
          <Route path="/alumni/mentorship"  element={<P component={MentorshipPage} />} />
          <Route path="/alumni/membership"  element={<P component={MembershipPage} />} />
          <Route path="/alumni/chapters"    element={<P component={ChaptersPage} />} />

          {/* COMPLIANCE */}
          <Route path="/naac"                           element={<P component={NAACPolicyPage} />} />
          <Route path="/committees"                     element={<P component={CommitteesPage} />} />
          <Route path="/mous"                           element={<P component={MOUsPage} />} />
          <Route path="/appreciation"                   element={<P component={AppreciationPage} />} />
          <Route path="/nirf"                           element={<P component={NIRFPage} />} />
          <Route path="/careers"                        element={<P component={CareersPage} />} />
          <Route path="/careers/open-positions"         element={<P component={OpenPositionsPage} />} />
          <Route path="/careers/open-positions/:positionId" element={<P component={OpenPositionsPage} />} />
          <Route path="/jrf"                            element={<P component={JRFPage} />} />

          {/* GALLERY */}
          <Route path="/gallery"                element={<P component={GalleryHubPage} />} />
          <Route path="/gallery/cultural"       element={<P component={CulturalGalleryPage} />} />
          <Route path="/gallery/experts"        element={<P component={ExpertsGalleryPage} />} />
          <Route path="/gallery/infrastructure" element={<P component={InfraGalleryPage} />} />
          <Route path="/gallery/sports"         element={<P component={SportsGalleryPage} />} />
          <Route path="/gallery/students"       element={<P component={StudentsGalleryPage} />} />
          <Route path="/gallery/life"           element={<P component={LifeAtITMPage} />} />
          <Route path="/gallery/videos"         element={<P component={VideoGalleryPage} />} />

          {/* CONTACT */}
          <Route path="/contact" element={<P component={ContactPage} />} />

          {/* DYNAMIC PAGES — must be last */}
          <Route path="*" element={<P component={DynamicPage} />} />
        </Routes>
      </div>
      {showChrome && <section id="footer"><Footer /></section>}
      {showChrome && <ChatbotWidget />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <EditModeProvider>
            <ScrollToTop />
            <AppContent />
          </EditModeProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

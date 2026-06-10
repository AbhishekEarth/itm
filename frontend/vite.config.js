import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/uploads': 'http://localhost:8000',
      '/sitemap.xml': {
        target: 'http://localhost:8000',
        rewrite: () => '/api/public/sitemap.xml',
      },
      '/robots.txt': {
        target: 'http://localhost:8000',
        rewrite: () => '/api/public/robots.txt',
      },
    },
  },

  build: {
    // Raise the warning threshold slightly — we'll have many smaller chunks now
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Fine-grained manual chunks so the browser caches vendor libs
        // independently of app code and they never re-download on redeploy.
        manualChunks(id) {
          // ── Vendor: heavy, rarely changed ─────────────────────────────────
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/'))
            return 'vendor-react';
          if (id.includes('node_modules/react-router'))
            return 'vendor-router';
          if (id.includes('node_modules/framer-motion'))
            return 'vendor-motion';
          if (id.includes('node_modules/@tanstack'))
            return 'vendor-query';
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/react-icons'))
            return 'vendor-icons';

          // ── Admin area — only downloaded when staff logs in ───────────────
          if (
            id.includes('/pages/admin/') ||
            id.includes('/pages/AdminDashboard') ||
            id.includes('/pages/AdminFaculty') ||
            id.includes('/pages/AdminStudents') ||
            id.includes('/components/Admin') ||
            id.includes('/components/admin/')
          )
            return 'chunk-admin';

          // ── Department pages ───────────────────────────────────────────────
          if (
            id.includes('CSDepartment') || id.includes('ECDepartment') ||
            id.includes('ITDepartment') || id.includes('CEDepartment') ||
            id.includes('MEDepartment') || id.includes('MBADepartment') ||
            id.includes('ESHDepartment') || id.includes('DynamicDepartment') ||
            id.includes('EmergingBranches') || id.includes('AIMLPage') ||
            id.includes('CyberSecurity') || id.includes('CloudComputing') ||
            id.includes('CentralLibrary')
          )
            return 'chunk-departments';

          // ── Research pages ─────────────────────────────────────────────────
          if (id.includes('/pages/Research'))
            return 'chunk-research';

          // ── About / Compliance / Alumni / Cells pages ─────────────────────
          if (id.includes('AboutPages') || id.includes('CellsPages') ||
              id.includes('AlumniPages') || id.includes('CompliancePages'))
            return 'chunk-about';

          // ── Gallery pages ──────────────────────────────────────────────────
          if (id.includes('GalleryPages'))
            return 'chunk-gallery';

          // ── TAP / Admissions / Contact ─────────────────────────────────────
          if (id.includes('TapPage') || id.includes('Admissions') ||
              id.includes('UGCourses') || id.includes('PGCourses') ||
              id.includes('SeekAdmission') || id.includes('ContactPage'))
            return 'chunk-admissions';
        },
      },
    },
  },
})

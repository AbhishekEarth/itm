/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        accent: {
          500: '#f97316',
          600: '#ea580c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'wiggle': 'wiggle 1.6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        wiggle: {
          '0%, 92%, 100%': { transform: 'rotate(0deg)' },
          '94%':  { transform: 'rotate(-15deg)' },
          '96%':  { transform: 'rotate(12deg)' },
          '98%':  { transform: 'rotate(-8deg)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(244,63,94,0.55), 0 6px 18px rgba(128,0,0,0.35)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(244,63,94,0), 0 6px 24px rgba(128,0,0,0.5)' },
        },
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // CareMate Royal Blue
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        secondary: {
          DEFAULT: '#0369A1', // CareMate premium cyan-blue
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0369A1',
          600: '#075985',
          700: '#0C4A6E',
          800: '#082F49',
          900: '#061D2F',
        },
        sub1: {
          DEFAULT: '#F8FBFF', // CareMate soft surface
          50: '#F8FBFF',
          100: '#EFF6FF',
          200: '#DBEAFE',
          300: '#BFDBFE',
          400: '#93C5FD',
          500: '#60A5FA',
          600: '#3B82F6',
          700: '#2563EB',
          800: '#1D4ED8',
          900: '#1E40AF',
        },
        sub2: {
          DEFAULT: '#475569', // CareMate neutral slate
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        ocean: {
          light: '#60A5FA',
          DEFAULT: '#2563EB',
          dark: '#1E40AF',
        },
        emerald: {
          DEFAULT: '#1D4ED8', // Premium blue accent
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        navy: {
          DEFAULT: '#0F172A', // Dark Navy Text & Header
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        ice: {
          DEFAULT: '#F8FBFF', // Premium blue-white background
          50: '#F8FAFC',
          100: '#EFF6FF',
          200: '#DBEAFE',
          300: '#BFDBFE',
        },
      },
      fontFamily: {
        sans: ['Sarabun', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        sarabun: ['Sarabun', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',   // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(37, 99, 235, 0.08), 0 1px 4px -1px rgba(15, 23, 42, 0.04)',
        'soft': '0 8px 24px -4px rgba(37, 99, 235, 0.11), 0 4px 8px -2px rgba(15, 23, 42, 0.05)',
        'soft-lg': '0 16px 36px -6px rgba(37, 99, 235, 0.16), 0 6px 12px -3px rgba(15, 23, 42, 0.06)',
        'emerald-soft': '0 8px 20px -3px rgba(29, 78, 216, 0.24)',
        'sky-soft': '0 8px 20px -3px rgba(37, 99, 235, 0.24)',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
        'radar-ping': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        'radar-ping': 'radar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
};

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
          DEFAULT: '#0EA5E9', // Ocean Blue
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        ocean: {
          light: '#38BDF8',
          DEFAULT: '#0EA5E9',
          dark: '#0284C7',
        },
        emerald: {
          DEFAULT: '#10B981', // Accent / CTA Green
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        navy: {
          DEFAULT: '#0F172A', // Dark Navy Text & Header
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        ice: {
          DEFAULT: '#F0F9FF', // Ice Blue Background
          50: '#F8FAFC',
          100: '#F0F9FF',
          200: '#E0F2FE',
          300: '#BAE6FD',
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
        'soft-sm': '0 2px 8px -2px rgba(14, 165, 233, 0.08), 0 1px 4px -1px rgba(15, 23, 42, 0.04)',
        'soft': '0 8px 24px -4px rgba(14, 165, 233, 0.10), 0 4px 8px -2px rgba(15, 23, 42, 0.05)',
        'soft-lg': '0 16px 36px -6px rgba(14, 165, 233, 0.14), 0 6px 12px -3px rgba(15, 23, 42, 0.06)',
        'emerald-soft': '0 8px 20px -3px rgba(16, 185, 129, 0.25)',
        'sky-soft': '0 8px 20px -3px rgba(14, 165, 233, 0.25)',
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

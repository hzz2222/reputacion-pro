import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hex-dark':  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='98'%3E%3Cpolygon fill='none' stroke='rgba(255%2C255%2C255%2C0.045)' stroke-width='1' points='28%2C0 56%2C16 56%2C48 28%2C64 0%2C48 0%2C16'/%3E%3Cpolygon fill='none' stroke='rgba(255%2C255%2C255%2C0.045)' stroke-width='1' points='28%2C34 56%2C50 56%2C82 28%2C98 0%2C82 0%2C50'/%3E%3C/svg%3E\")",
        'hex-light': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='98'%3E%3Cpolygon fill='none' stroke='rgba(37%2C99%2C235%2C0.06)' stroke-width='1' points='28%2C0 56%2C16 56%2C48 28%2C64 0%2C48 0%2C16'/%3E%3Cpolygon fill='none' stroke='rgba(37%2C99%2C235%2C0.06)' stroke-width='1' points='28%2C34 56%2C50 56%2C82 28%2C98 0%2C82 0%2C50'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        hex: '56px 98px',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out both',
        'slide-up':   'slideUp 0.6s ease-out both',
        'scale-in':   'scaleIn 0.4s ease-out both',
        'slide-left': 'slideLeft 0.6s ease-out both',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':      'float 6s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:   { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:   { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        slideLeft: { '0%': { opacity: '0', transform: 'translateX(-16px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px 4px rgba(37,99,235,0.25)' },
          '50%':     { boxShadow: '0 0 36px 8px rgba(37,99,235,0.45)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // FinnMate Brand
        finn: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c0d4ff',
          300: '#93b4fe',
          400: '#6090fc',
          500: '#3b6ef8',
          600: '#254ded',
          700: '#1c3ad9',
          800: '#1e30b0',
          900: '#1e2d8b',
          950: '#161d5e',
        },
        aurora: {
          green:  '#00ffa3',
          teal:   '#00d4e8',
          purple: '#9b59ff',
          pink:   '#ff6b9d',
          yellow: '#ffd700',
        },
        nordic: {
          dark:   '#0a0e1a',
          navy:   '#0d1526',
          card:   '#131f35',
          border: '#1e3050',
          muted:  '#2a4060',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'aurora':        'aurora 8s ease-in-out infinite alternate',
        'float':         'float 6s ease-in-out infinite',
        'pulse-glow':    'pulseGlow 2s ease-in-out infinite',
        'slide-up':      'slideUp 0.5s ease-out',
        'slide-in-right':'slideInRight 0.4s ease-out',
        'spin-slow':     'spin 8s linear infinite',
        'bounce-soft':   'bounceSoft 2s ease-in-out infinite',
        'gradient-x':    'gradientX 4s ease infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'typing':        'typing 3s steps(40) infinite',
        'xp-fill':       'xpFill 1s ease-out forwards',
      },
      keyframes: {
        aurora: {
          '0%':   { backgroundPosition: '0% 50%', filter: 'hue-rotate(0deg)' },
          '50%':  { backgroundPosition: '100% 50%', filter: 'hue-rotate(30deg)' },
          '100%': { backgroundPosition: '0% 50%', filter: 'hue-rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 110, 248, 0.3)' },
          '50%':       { boxShadow: '0 0 40px rgba(59, 110, 248, 0.8), 0 0 80px rgba(59,110,248,0.3)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-6px)' },
        },
        gradientX: {
          '0%, 100%': { backgroundSize: '200% 200%', backgroundPosition: 'left center' },
          '50%':       { backgroundSize: '200% 200%', backgroundPosition: 'right center' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        typing: {
          '0%':   { width: '0' },
          '50%':  { width: '100%' },
          '100%': { width: '0' },
        },
        xpFill: {
          from: { width: '0%' },
          to:   { width: 'var(--xp-width)' },
        },
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(135deg, #0a0e1a 0%, #0d1f3c 25%, #0a2a1a 50%, #1a0d2e 75%, #0a0e1a 100%)',
        'finn-gradient':   'linear-gradient(135deg, #254ded 0%, #9b59ff 50%, #00ffa3 100%)',
        'card-gradient':   'linear-gradient(135deg, rgba(19,31,53,0.9) 0%, rgba(19,31,53,0.6) 100%)',
        'shimmer-gradient':'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.05) 50%, transparent 75%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-sm':     '0 0 15px rgba(59,110,248,0.3)',
        'glow':        '0 0 30px rgba(59,110,248,0.4)',
        'glow-lg':     '0 0 60px rgba(59,110,248,0.5)',
        'glow-green':  '0 0 30px rgba(0,255,163,0.4)',
        'glow-purple': '0 0 30px rgba(155,89,255,0.4)',
        'aurora':      '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        'card':        '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
};

export default config;

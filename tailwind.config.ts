import type { Config } from 'tailwindcss';

/**
 * Nolla design tokens.
 * Warm neutrals only: the photography brings the colour.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F7F3EC', // page
        ivory: '#FBF9F5', // raised surfaces
        oat: '#E6D9C9',
        'oat-soft': '#EFE6DA',
        sand: '#D8C6AF',
        taupe: '#A38F7D',
        mocha: '#765F50',
        'mocha-soft': '#F1E9E0',
        espresso: '#3B302A', // deep warm panels
        charcoal: '#252321', // text
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.18em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-md': ['3rem', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-lg': ['4rem', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
        'display-xl': ['5rem', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
      },
      borderRadius: {
        soft: '3px',
        '4xl': '2rem',
      },
      boxShadow: {
        pillow: '0 1px 2px rgba(118,95,80,0.06), 0 12px 32px -12px rgba(118,95,80,0.22)',
        cloud: '0 2px 4px rgba(118,95,80,0.04), 0 30px 80px -30px rgba(90,70,55,0.35)',
        bar: '0 -10px 30px -12px rgba(59,48,42,0.22)',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        rise: 'rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        fade: 'fade 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;

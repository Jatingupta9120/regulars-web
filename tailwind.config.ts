import type { Config } from 'tailwindcss';

// Every value here maps to a CSS custom property defined in app/globals.css.
// Tailwind is used for layout only; the tokens are ours, not Tailwind defaults.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        body: 'var(--body)',
        dim: 'var(--dim)',
        rule: 'var(--rule)',
        mark: 'var(--mark)',
        markInk: 'var(--mark-ink)',
        flag: 'var(--flag)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        text: ['var(--font-text)', 'Georgia', 'serif'],
      },
      fontSize: {
        // 1.25 scale, anchored at 17px body
        micro: ['0.72rem', { lineHeight: '1.4' }],
        label: ['0.78rem', { lineHeight: '1.4' }],
        small: ['0.92rem', { lineHeight: '1.55' }],
        base: ['1.0625rem', { lineHeight: '1.62' }],
        lede: ['1.2rem', { lineHeight: '1.55' }],
        h3: ['1.15rem', { lineHeight: '1.3' }],
        h2: ['1.7rem', { lineHeight: '1.15' }],
        h1: ['clamp(2.1rem, 4.6vw, 3.5rem)', { lineHeight: '1.02' }],
      },
      maxWidth: { measure: '65ch', shell: '1140px' },
      spacing: { section: '5.5rem' },
    },
  },
  plugins: [],
};

export default config;

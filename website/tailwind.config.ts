import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      xs: '360px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '2000px',
    },
    extend: {
      colors: {
        obsidian: {
          DEFAULT: 'var(--color-obsidian)',
          subtle: 'var(--color-obsidian-subtle)',
          card: 'var(--color-obsidian-card)',
          border: 'var(--color-obsidian-border)',
          'border-hover': 'var(--color-obsidian-border-hover)',
        },
        emerald: {
          DEFAULT: 'var(--color-emerald)',
          glow: 'var(--color-emerald-glow)',
          subtle: 'var(--color-emerald-subtle)',
          text: 'var(--color-emerald-text)',
        },
        deleted: {
          red: 'var(--color-deleted-red)',
          bg: 'var(--color-deleted-bg)',
          border: 'var(--color-deleted-border)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        bengali: ['"Hind Siliguri"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 40px -10px rgba(0, 200, 150, 0.35)',
        'glow-subtle': '0 0 30px -5px rgba(0, 200, 150, 0.15)',
        'glass-card': '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;

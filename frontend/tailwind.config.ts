import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6000',
        'primary-dark': '#e55500',
        'primary-light': '#fff4ed',
        ink: '#1a1a2e',
        muted: '#6b7280',
        surface: '#f5f5f5',
        border: '#e5e5e5',
        success: '#00c853',
        danger: '#ff3d00',
        star: '#ffc107',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0,0,0,0.08)',
        card: '0 2px 8px rgba(0,0,0,0.06)',
        elevated: '0 4px 16px rgba(0,0,0,0.10)',
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
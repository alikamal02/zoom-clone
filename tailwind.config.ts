import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // Enables the use of "class" strategy for dark mode
  content: [
    './pages/**/*.{ts,tsx}', 
    './components/**/*.{ts,tsx}', 
    './app/**/*.{ts,tsx}', 
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    fontFamily: {
      'sans': ['Inter', 'sans-serif'], // Assuming "Inter" is the font you want to use
    },
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        primary: '#6677D7',        // Huvudfärg (Main color)
        secondary: '#F5989D',      // Sekundär färg (Secondary color)
        tertiary: '#C0BDCC',       // Andra färger (Other color)
        quaternary: '#93B9A3',     // Additional color
        quinary: '#FFC86B',        // Additional color
        dark: { 1: '#1C1F2E', 2: '#161925', 3: '#252A41', 4: '#1E2757' },
        blue: { 1: '#0E78F9' },
        sky: { 1: '#C9DDFF', 2: '#ECF0FF', 3: '#F5FCFF' },
        orange: { 1: '#FF742E' },
        purple: { 1: '#830EF9' },
        yellow: { 1: '#F9A90E' },
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      backgroundImage: {
        hero: "url('/images/hero-background.png')"
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

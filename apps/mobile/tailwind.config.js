/** @type {import('tailwindcss').Config} */
const dawnTheme = require('../../packages/ui/tailwind-theme.cjs');

module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: dawnTheme,
  },
  plugins: [],
};

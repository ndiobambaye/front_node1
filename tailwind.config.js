/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Newsreader"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        paper: '#F7F3E9',
        ink: {
          50: '#F4F1EA',
          100: '#E8E2D2',
          200: '#DCD4BE',
          300: '#B8AE96',
          400: '#8C8270',
          500: '#5C5444',
          600: '#3A3328',
          700: '#262019',
          900: '#1B1610',
        },
        primary: {
          50: '#FBE9D8',
          100: '#F4D2AC',
          200: '#E9B57C',
          300: '#D9913F',
          400: '#C2762A',
          500: '#AD6321',
          600: '#8F4F19',
          700: '#6E3C12',
        },
        accent: {
          50: '#E4ECE9',
          100: '#C4D6CE',
          500: '#1F5C56',
          600: '#163F3B',
        },
        mauve: {
          50: '#EFE6EE',
          100: '#D9C3D6',
          300: '#9C6E96',
          500: '#6B3F66',
          600: '#522F4E',
          700: '#3D2339',
          900: '#241420',
        },
      },
      borderRadius: {
        card: '3px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(27,22,16,0.06), 0 1px 1px rgba(27,22,16,0.04)',
        'card-hover': '0 6px 16px rgba(27,22,16,0.10), 0 2px 4px rgba(27,22,16,0.06)',
      },
    },
  },
  plugins: [],
}
 
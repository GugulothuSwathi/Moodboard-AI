/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: 'class' means dark mode is toggled by adding class="dark" to <html>
  // This lets us toggle it with JavaScript — perfect for a manual toggle button
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom font families — we import these in layout.jsx from Google Fonts
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],   // Beautiful serif for headings
        body: ['DM Sans', 'system-ui', 'sans-serif'],          // Clean sans for body text
        mono: ['JetBrains Mono', 'monospace'],                  // For hex codes
      },
      // Custom colors for our brand
      colors: {
        brand: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
      },
      // Custom animations for mood board reveal
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      // Custom backdrop blur values
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

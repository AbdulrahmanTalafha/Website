import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2B245B',
          50: '#EEEDF5',
          100: '#D5D3E8',
          200: '#ABA8D1',
          300: '#817DBA',
          400: '#5752A3',
          500: '#2B245B',
          600: '#231E4C',
          700: '#1B173D',
          800: '#13102E',
          900: '#0B091F',
        },
        secondary: {
          DEFAULT: '#FA382E',
          50: '#FFF0EF',
          100: '#FFD9D7',
          200: '#FFB3AF',
          300: '#FF8D87',
          400: '#FB655F',
          500: '#FA382E',
          600: '#D62E25',
          700: '#B3241D',
          800: '#8F1A15',
          900: '#6C100D',
        },
        neutral: {
          50: '#F8F7F4',
          100: '#F0EFE9',
          200: '#E1DFD3',
          300: '#C8C5B0',
          400: '#A8A48D',
          500: '#888470',
          600: '#68654F',
          700: '#48462E',
          800: '#28270D',
          900: '#1A1A00',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'Cairo', 'Noto Sans Arabic', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'count-up': 'countUp 1.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#2B245B',
            a: { color: '#FA382E' },
          },
        },
      },
    },
  },
  plugins: [],
}

export default config

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#1e3a8a',
          dark: '#0a192f',
          light: '#1e40af',
          bg: '#eff6ff',
          50: '#e8f0fe',
          100: '#c5d8fc',
          200: '#9ebef9',
          300: '#74a3f5',
          400: '#5490f2',
          500: '#2563eb',
          600: '#1d55d6',
          700: '#1645be',
          800: '#0f35a3',
          900: '#0a2580',
        },
        gov: {
          50: '#f0f4ff',
          100: '#dde7fa',
          200: '#b8ccf5',
          300: '#8aaeed',
          400: '#5a8de3',
          500: '#1e3a8a',
          600: '#1a3278',
          700: '#152865',
          800: '#0f1e52',
          900: '#091340',
        },
        gold: {
          DEFAULT: '#d4af37',
          dark: '#b8962e',
          light: '#fbbf24',
          bg: '#fef9e7',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      backgroundImage: {
        'hero-pattern':
          "url('https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=1920')",
      },
    },
  },
  plugins: [],
};

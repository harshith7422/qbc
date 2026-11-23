/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d9eb',
          300: '#95bde0',
          400: '#619dd1',
          500: '#3d81be',
          600: '#2b669f',
          700: '#225181',
          800: '#1b4168',
          900: '#0e2338',
          950: '#091522',
        },
        stone: {
          warm: '#f9f8f6',
          surface: '#f5f3ef',
          card: '#ffffff',
          border: '#e6e2dc',
          muted: '#8c857b',
        },
        accent: {
          gold: '#c29a53',
          goldLight: '#dfbe7e',
          goldMuted: '#fbf7ee',
          copper: '#b36a43',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 16px -2px rgba(14, 35, 56, 0.06), 0 2px 6px -1px rgba(14, 35, 56, 0.04)',
        'modal': '0 20px 40px -8px rgba(14, 35, 56, 0.16), 0 8px 16px -4px rgba(14, 35, 56, 0.08)',
      }
    },
  },
  plugins: [],
}

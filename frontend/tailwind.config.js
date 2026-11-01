/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F7F5',
        surface: '#FFFFFF',
        'surface-subtle': '#FAF9F7',
        'card-bg': '#F1EFEA',
        'text-primary': '#1C1C1C',
        'text-secondary': '#757471',
        'text-muted': '#9E9C98',
        'border-soft': '#E6E4DF',
        'border-strong': '#D4D1CA',
        accent: {
          DEFAULT: '#1C1C1C',
          hover: '#333333',
          light: '#EFEFEA'
        },
        sage: {
          DEFAULT: '#4E7A5A',
          light: '#EAF2EC'
        },
        terracotta: {
          DEFAULT: '#C45151',
          light: '#FBEBEB'
        },
        sand: {
          DEFAULT: '#C49E5A',
          light: '#F8F4EC'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif']
      },
      borderRadius: {
        'card': '16px',
        'pill': '9999px'
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'modal': '0 20px 40px rgba(0, 0, 0, 0.12)'
      }
    },
  },
  plugins: [],
}

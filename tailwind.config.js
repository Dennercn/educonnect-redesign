/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neutros cinza-azulados frios: substituem o cinza padrão em todo o portal
        slate: {
          50: '#f7f8fa',
          100: '#eff1f5',
          200: '#e2e5ec',
          300: '#c9ced9',
          400: '#98a0b0',
          500: '#687083',
          600: '#4e5566',
          700: '#393f4d',
          800: '#262a35',
          900: '#191c24',
          950: '#0f1117',
        },
        // Cor de marca: azul acadêmico sóbrio (texto branco sobre o 600 tem contraste 7,2:1)
        brand: {
          50: '#eef2fb',
          100: '#dce4f7',
          200: '#bacaef',
          300: '#8fa8e3',
          400: '#6684d6',
          500: '#4466c8',
          600: '#2f50b4',
          700: '#273f8f',
          800: '#213574',
          900: '#1c2c5e',
          950: '#121b3b',
        },
        // Cor de apoio discreta (azul-petróleo): só em gradientes suaves do logotipo, avatar e capa do perfil
        accent: {
          50: '#ecf6f8',
          100: '#d3eaef',
          400: '#5fa3b5',
          500: '#3c8799',
          600: '#2f6f80',
          700: '#285b69',
        },
      },
      fontFamily: {
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 17, 23, 0.04), 0 8px 24px -16px rgba(15, 17, 23, 0.14)',
        raised: '0 2px 4px rgba(15, 17, 23, 0.05), 0 20px 40px -20px rgba(15, 17, 23, 0.28)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        grow: { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
        progress: { from: { width: '0%' }, to: { width: '100%' } },
      },
      animation: {
        'fade-up': 'fade-up .4s cubic-bezier(.2,.7,.3,1) both',
        'scale-in': 'scale-in .2s cubic-bezier(.2,.7,.3,1) both',
        'fade-in': 'fade-in .2s ease both',
        'slide-up': 'slide-up .3s cubic-bezier(.2,.7,.3,1) both',
        grow: 'grow .8s cubic-bezier(.2,.7,.3,1) both',
      },
    },
  },
  plugins: [],
}

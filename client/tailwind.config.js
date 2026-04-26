/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        orange: '#FF6B2C',
        pink: '#FF3E7A',
        purple: '#7B3FE4',
        dark: '#1F1F1F',
        light: '#F9F9FB',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF6B2C 0%, #FF3E7A 50%, #7B3FE4 100%)',
      },
    },
  },
  plugins: [],
}

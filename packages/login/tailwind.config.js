module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],

  theme: {
    screens: {
      'xs': '414px',
    },
  },
};

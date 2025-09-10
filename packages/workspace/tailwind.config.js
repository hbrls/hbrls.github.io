module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,vue}',
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

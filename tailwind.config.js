/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        Montserrat: ['Montserrat'],
        Roboto: ['Roboto'],
        Ubuntu: ['Ubuntu'],
      },
      colors: {
        basic: '#ffffff',
        dark: '#6d737',
        buttonColor: '#424de6',
        safebg: '#13af252b',
        safe: '#2a835f',
        highlight: '#f3f3f3c4',
        metal: '#dcdee2',
        warningbg: '#f0bc0b5e',
        warning: '#9b7805',
        errorbg: '#f4080847',
        error: '#f71703',
        highlightedText: '#464D86',
        tableHeader: '#f8fbfc',
        tableHeaderText: '#727781',
        darktext: '#444a57',
        progressbar: '#ebf3fe',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'smc': '10px',
        'mdc':'16px',
      },
      screens: {
        'sm': '0px',  // telefoane mici
        'md': '500px',  // tablete
        'lg': '750px', // laptopuri
        'xl': '1024px', // laptopuri mari
      },
    },
  },
  plugins: [],
}

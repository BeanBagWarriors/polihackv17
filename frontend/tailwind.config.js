/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: "#3D52A0",
        lightBlue: "#7091E6",
        darkGray: "#8697C4",
        lightGray: "#ADBBDA",
        primaryWhite: "#EDE8F5"
      },
      keyframes: {

      },
      animation: {
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      prefix: "nextui", // prefix for themes variables
      addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
      defaultTheme: "light", // default theme from the themes object
      defaultExtendTheme: "dark", // default theme to extend on custom themes
      layout: {}, // common layout tokens (applied to all themes)
      themes: {
        light: {
          layout: {}, // light theme layout tokens
          colors: {
            darkBlue: "#3D52A0",
            lightBlue: "#7091E6",
            darkGray: "#8697C4",
            lightGray: "#ADBBDA",
            primaryWhite: "#EDE8F5"
          },
        },
        dark: {
          layout: {}, // dark theme layout tokens
          colors: {
            darkBlue: "#3D52A0",
            lightBlue: "#7091E6",
            darkGray: "#8697C4",
            lightGray: "#ADBBDA",
            primaryWhite: "#EDE8F5"
          },
        },
        // ... custom themes
      },
    }),
  ],
};
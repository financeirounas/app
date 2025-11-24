const colors = require("./src/config/colors.js");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        brand: {
          primary: colors.default.primary,
          warning: colors.default.warning,
          success: colors.default.success,
          danger: colors.default.danger,
          accent: colors.default.accent,
          soft: colors.default.soft,
        },
      },
    },
  },
};

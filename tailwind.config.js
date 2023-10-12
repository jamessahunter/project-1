/** @type {import('tailwinds').Config} */
module.exports = {
  content: ["*.html"],
  theme: {
    extend: {
      textAlign: ["responsive", "hover", "focus", "group-hover", "important"], // Add 'important'
    },
  },
  plugins: [],
};

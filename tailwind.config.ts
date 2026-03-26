/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx,vue,scss}"],
  theme: {
    extend: {
        colors: {
            "primary": "#d4af35",
            "background-light": "#f8f7f6",
            "background-dark": "#201d12",
            "secondary": "#DABB53", // Secondary gold
        },
        
        fontFamily: {
            "display": ["Manrope", "sans-serif"]
        },
        borderRadius: {
            "DEFAULT": "1rem",
            "lg": "2rem",
            "xl": "3rem",
            "full": "9999px"
        },
        borderRadius: {"DEFAULT": "0.5rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px"},
    },
  },
  plugins: [],
  corePlugins: {
    // preflight: false,
  },
};

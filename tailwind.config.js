/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#D4A017",
        goldDark: "#B8890F",
        dark: "#1a1a1a",
        surface: "#0f0f0f",
        solarBlue: "#1a3a5c",
        solarSky: "#4da6ff",
        solarGreen: "#2ecc71",
        solarTeal: "#1abc9c",
      },
      fontFamily: {
        arabic: ["Cairo", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.08)",
        cardHover: "0 8px 30px rgba(0,0,0,0.12)",
        "3d-sm": "0 4px 20px rgba(0,0,0,0.15), 0 1px 3px rgba(212,160,23,0.1)",
        "3d-lg": "0 20px 60px rgba(0,0,0,0.25), 0 0 40px rgba(212,160,23,0.08)",
        "3d-inset": "inset 0 1px 0 rgba(255,255,255,0.1)",
        glow: "0 0 30px rgba(212,160,23,0.35)",
      },
      borderRadius: {
        card: "1rem",
        btn: "0.75rem",
      },
      backgroundImage: {
        "mesh-gradient":
          "radial-gradient(at 40% 20%, rgba(212,160,23,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(77,166,255,0.08) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(46,204,113,0.06) 0px, transparent 50%)",
        "solar-glow":
          "radial-gradient(circle at center, rgba(212,160,23,0.2) 0%, transparent 70%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delay": "float 6s ease-in-out 2s infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212,160,23,0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(212,160,23,0.45)" },
        },
      },
    },
  },
  plugins: [],
};

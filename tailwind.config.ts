import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "fco-navy": "#0A0E1A",
        "fco-green": "#00FF85",
        "fco-gold": "#FFD700",
        "fco-surface": "#161B2A",
      },
      boxShadow: {
        glow: "0 0 30px rgba(0, 255, 133, 0.28)",
        deep: "0 20px 45px rgba(4, 9, 21, 0.55)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top right, rgba(0,255,133,0.24), transparent 40%), radial-gradient(circle at 20% 20%, rgba(255,215,0,0.18), transparent 36%)",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".glass": {
          background: "rgba(22, 27, 42, 0.62)",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        },
      });
    }),
  ],
};

export default config;

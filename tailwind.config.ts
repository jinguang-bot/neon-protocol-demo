import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neon Protocol Brand Colors
        neon: {
          dark: "#0A1628",
          darker: "#050D17",
          purple: "#1A1F3A",
          blue: "#00D9FF",
          violet: "#7B61FF",
          gray: "#94A3B8",
        },
      },
      backgroundColor: {
        neon: {
          dark: "#0A1628",
          darker: "#050D17",
          purple: "#1A1F3A",
          blue: "#00D9FF",
          violet: "#7B61FF",
        },
      },
      borderColor: {
        neon: {
          blue: "#00D9FF",
          violet: "#7B61FF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 24px rgba(0, 217, 255, 0.3)" },
          "100%": { boxShadow: "0 0 32px rgba(0, 217, 255, 0.6)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh": `
          radial-gradient(at 40% 20%, hsla(228,89%,56%,0.3) 0px, transparent 50%),
          radial-gradient(at 80% 0%, hsla(189,100%,56%,0.2) 0px, transparent 50%),
          radial-gradient(at 0% 50%, hsla(355,100%,93%,0.1) 0px, transparent 50%),
          radial-gradient(at 80% 50%, hsla(340,100%,76%,0.1) 0px, transparent 50%),
          radial-gradient(at 0% 100%, hsla(269,100%,77%,0.2) 0px, transparent 50%),
          radial-gradient(at 80% 100%, hsla(242,100%,70%,0.2) 0px, transparent 50%),
          radial-gradient(at 0% 0%, hsla(343,100%,76%,0.1) 0px, transparent 50%)
        `,
      },
    },
  },
  plugins: [],
};

export default config;

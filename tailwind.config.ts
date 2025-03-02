
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#121212", // Darker background
        foreground: "#FAFAF8",
        muted: "#828179",
        accent: "#61AAF2",
        primary: "#55A9F9", // Blue for sent messages
        "primary-foreground": "#FFFFFF",
        secondary: "#4A4A4C", // Dark gray for received messages
        "secondary-foreground": "#FFFFFF",
        border: "#2D2D2D", // Darker border
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        bubble: {
          received: "#4A4A4C", // Dark gray bubbles
          sent: "#55A9F9", // Blue bubbles
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

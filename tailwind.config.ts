import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        lekton: ['var(--lekton)'],
        koulen: ['var(--koulen)'],
        inter: ['var(--inter)'],
        crimson: ['var(--crimson)'],
        roboto: ['var(--roboto)'],
        robotoMono: ['var(--robotoMono)'],
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shake: {  // Añadimos la animación shake
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        bounce: 'bounce 0.5s infinite',
        shake: 'shake 0.5s ease-in-out', // Añadimos la animación shake
      },
    },
  },
  plugins: [forms],
};

export default config;

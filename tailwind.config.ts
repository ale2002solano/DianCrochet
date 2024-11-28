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
      beatfade: {  // Animación beat fade
        '0%, 100%': { transform: 'scale(1)', opacity: '1' },
        '50%': { transform: 'scale(1.2)', opacity: '0.5' },
      },
    },
    animation: {
      bounce: 'bounce 1s infinite',
      shake: 'shake 0.5s ease-in-out', 
      beatfade: 'beatfade 1s ease-in-out infinite', // Añadimos la animación beat fade
    },
  },
  plugins: [forms],
};

export default config;

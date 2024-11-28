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
        roboto:['var(--roboto)'],
        robotoMono:['var(--robotoMono)']
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        bounce: 'bounce 1s infinite',
      },
    },
  },
  plugins: [forms],
};

export default config;

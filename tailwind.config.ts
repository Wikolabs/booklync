import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50:"#faf5ff",100:"#f3e8ff",200:"#e9d5ff",300:"#d8b4fe",500:"#a855f7",600:"#9333ea",700:"#7c3aed",900:"#4c1d95" }
      },
      fontFamily: { display:["'Cormorant Garamond'","serif"], body:["'Sora'","sans-serif"] },
    },
  },
  plugins: [],
};
export default config;

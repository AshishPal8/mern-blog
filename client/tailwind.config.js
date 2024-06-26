/** //@type {import('tailwindcss').Config} */
import flowbite from "flowbite-react/tailwind";
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/lib/**/*.js",
    "./pages/**/*.{ts,tsx}",
    "./public/**/*.html",
    flowbite.content(),
  ],
  theme: {
    extend: {
      Colors: {
        background: "#1C2137",
      },
    },
  },
  plugins: [flowbite.plugin(), require("tailwind-scrollbar")],
};

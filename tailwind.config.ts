import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { addDynamicIconSelectors } from '@iconify/tailwind';

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [addDynamicIconSelectors()],
} satisfies Config;

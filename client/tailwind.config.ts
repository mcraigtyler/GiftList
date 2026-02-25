import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  corePlugins: {
    // Disable Tailwind's base CSS reset so it doesn't conflict with PrimeReact styles
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config

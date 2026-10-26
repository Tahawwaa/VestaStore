import type { Config } from 'tailwindcss';
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Vazirmatn Variable', 'sans-serif'] },
      colors: { ink: '#302d29', paper: '#f7f5f1', accent: '#78604b' },
    },
  },
} satisfies Config;

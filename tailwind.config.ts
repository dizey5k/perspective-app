import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fest: {
          bg: '#0a1519',
          surface: '#12252a',
          border: 'rgba(255, 255, 255, 0.1)',
          accent: '#d946ef',
          blue: '#3b82f6',
          cyan: '#06b6d4',
        },
      },
      backgroundImage: {
        'impulse-gradient': 'linear-gradient(135deg, #d946ef 0%, #3b82f6 100%)',
        'impulse-glow':
          'radial-gradient(circle at center, rgba(59,130,246,0.3) 0%, rgba(10,21,25,0) 70%)',
      },
      fontFamily: {
        // Желательно потом подключить современный гротеск (например, Montserrat или Geologica)
        sans: ['var(--font-geist-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

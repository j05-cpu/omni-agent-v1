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
        obsidian: {
          900: '#0a0a0f',
          800: '#12121a',
          700: '#1a1a26',
          600: '#252533',
          500: '#333340',
        },
        emerald: {
          950: '#021a10',
          900: '#032d1a',
          800: '#044029',
          700: '#065238',
          600: '#086547',
          500: '#10b981',
          400: '#34d399',
          300: '#6ee7b7',
        },
        accent: {
          gold: '#fbbf24',
          crimson: '#dc2626',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(16, 185, 129, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
export default config

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        territory: {
          primary: "#0A84FF",
          secondary: "#0071E3",
          accent: "#64D2FF"
        },
        ocean: {
          950: "#01050F",
          900: "#04122B",
          800: "#062043",
          700: "#0A3566"
        }
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Inter", "sans-serif"]
      },
      backgroundImage: {
        'ocean-gradient': 'radial-gradient(120% 120% at 50% 0%, #0A3566 0%, #04122B 45%, #01050F 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'step-in': 'stepIn 360ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        stepIn: {
          '0%': { opacity: '0', transform: 'translateY(14px) scale(0.992)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    }
  },
  plugins: [],
}

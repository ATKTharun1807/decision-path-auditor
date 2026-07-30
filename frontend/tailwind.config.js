/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        aurora: {
          bg:        '#F8FAFC', // Warm White/Slate
          sidebar:   '#EEF4F7', // Soft Sand / Ice
          card:      '#FFFFFF', // Pure White
          primary:   '#0EA5A4', // Teal Primary
          secondary: '#3B82F6', // Blue
          accent:    '#F59E0B', // Amber Accent
          success:   '#10B981', // Mint Emerald
          warning:   '#F97316', // Orange
          danger:    '#DC2626', // Red
          text:      '#1E293B', // Slate Text
          muted:     '#64748B', // Muted Text
          border:    '#E2E8F0', // Border
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'aurora': '0 4px 20px -2px rgba(14, 165, 164, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'aurora-lg': '0 12px 36px -4px rgba(14, 165, 164, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'floating': '0 20px 40px -8px rgba(30, 41, 59, 0.12), 0 0 1px 1px rgba(226, 232, 240, 0.8)',
        'glow-teal': '0 0 25px rgba(14, 165, 164, 0.25)',
      },
      keyframes: {
        "flow-pulse": {
          '0%, 100%': { strokeDashoffset: '0' },
          '50%': { strokeDashoffset: '20' },
        },
        "node-glow": {
          '0%, 100%': { box: '0 0 0 0 rgba(14, 165, 164, 0.4)' },
          '50%': { box: '0 0 0 8px rgba(14, 165, 164, 0)' },
        },
      },
      animation: {
        "flow-pulse": "flow-pulse 2s linear infinite",
        "node-glow":  "node-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

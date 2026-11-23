import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [presetWind3()],
  theme: {
    colors: {
      paper: '#f4f4f0',
      surface: '#ffffff',
      ink: '#171715',
      mute: '#74746c',
      line: '#dfdfd8',
      success: '#1e7a4c',
      danger: '#b3261e',
    },
    fontFamily: {
      sans: 'Inter Variable, Inter, system-ui, -apple-system, Segoe UI, sans-serif',
    },
  },
  shortcuts: {
    btn: 'inline-flex h-11 items-center justify-center gap-2 px-5 text-sm font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40',
    'btn-primary': 'btn bg-ink text-white hover:bg-black',
    'btn-secondary': 'btn border border-line bg-white text-ink hover:border-ink',
    field:
      'h-10 w-full border border-line bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-ink',
    eyebrow: 'text-[11px] font-medium uppercase tracking-[0.14em] text-mute',
    'icon-btn': 'inline-grid place-items-center transition-colors duration-200 disabled:pointer-events-none',
  },
})

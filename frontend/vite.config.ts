import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // コンポーネントのテストで DOM が必要なため jsdom を使う
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    // テストがまだ 1 件も無い段階でも CI を通す
    passWithNoTests: true,
  },
})

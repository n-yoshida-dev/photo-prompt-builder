import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages の配置先（/<リポジトリ名>/ か独自ドメインか）に依存しないよう、相対パスで出力する。
  // 見本の画像は import.meta.env.BASE_URL（ここでは ./）を頭に付けて読むので、そのまま届く
  base: './',
  test: {
    // コンポーネントのテストで DOM が必要なため jsdom を使う
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    // テストがまだ 1 件も無い段階でも CI を通す
    passWithNoTests: true,
  },
})

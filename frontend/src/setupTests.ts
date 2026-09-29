// Vitest 実行前の共通セットアップ。toBeInTheDocument などのマッチャを有効にする
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// テストごとに描画した画面を片付ける。vitest の globals を使っていないので、Testing Library の自動片付けが働かない
afterEach(() => {
  cleanup()
})

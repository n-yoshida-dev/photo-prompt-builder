import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

// テスト基盤（vitest + jsdom + testing-library）が動くことを確かめる最小のテスト
describe('App', () => {
  it('アプリ名の見出しを表示する', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'photo-prompt-builder' })).toBeInTheDocument()
  })
})

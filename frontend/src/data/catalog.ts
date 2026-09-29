// マスタデータ一式をまとめる。buildPrompt と画面はここから読む
import type { Catalog } from '../prompt/types'
import { choices } from './choices'
import { presets } from './presets'
import { preserve } from './preserve'
import { toggles } from './toggles'

export const catalog: Catalog = { presets, preserve, toggles, choices }

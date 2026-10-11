// スタイルの見本画像のマスタデータ。画像は frontend/public/samples/ に置き、ここにはファイル名と画像の説明だけを書く
// 見本は、AI で作った架空の写真を、アプリが作るプロンプト（既定の条件）そのままで Codex に加工させたもの（logs/decisions.md 2026-10-03）。
// 作り方（モデル・日付）と利用条件は docs/sample-images.md。使ったプロンプトは docs/sample-images/prompts/ にあり、
// プリセットの文を変えると samples.test.ts が止める（見本を作り直すまで、見本と文が食い違うため）

// 見本の元にした架空の写真（実在の人は写っていない）
export type SampleOriginalId = 'family' | 'playground' | 'travel'

export type SampleOriginal = {
  id: SampleOriginalId
  file: string // frontend/public/samples/ からの相対パス
  label: string // 画面に添える短い名前
  alt: string // 画像の代わりに読み上げる文
}

// 1 つのスタイルの見本
export type PresetSample = {
  file: string // frontend/public/samples/ からの相対パス
  // 画像の実際の横と縦（px）。読み込む前から正しい形で場所を取り、読み込んだときに行の高さがずれないようにする。
  // 正方形・縦長の見本もあるので、全部を 4:3 とは書かない。ファイルと一致することを samples.test.ts が確かめる
  width: number
  height: number
  originalId: SampleOriginalId // どの写真から作ったか
  alt: string // 画像の代わりに読み上げる文
}

export const sampleOriginals: SampleOriginal[] = [
  {
    id: 'family',
    file: 'originals/family.webp',
    label: '公園の家族',
    alt: '紅葉の公園で、黄色いニット帽の男の子が両親と手をつないでいる写真',
  },
  {
    id: 'playground',
    file: 'originals/playground.webp',
    label: '遊具の子ども',
    alt: '公園の赤い滑り台の上で、女の子が手を振っている写真',
  },
  {
    id: 'travel',
    file: 'originals/travel.webp',
    label: '旅先の家族',
    alt: '灯台のある海辺で、女の子を肩車した父と、母と男の子が並んでいる写真',
  },
]

// プリセット id ごとの見本。全プリセットに 1 枚ずつあることを samples.test.ts が確かめる
export const presetSamples: Record<string, PresetSample> = {
  diorama: {
    file: 'diorama.webp',
    width: 640,
    height: 640,
    originalId: 'playground',
    alt: '見本：滑り台と砂場のある遊具が、台座に載った模型になっている。子どもはいない',
  },
  'diorama-family': {
    file: 'diorama-family.webp',
    width: 640,
    height: 640,
    originalId: 'playground',
    alt: '見本：滑り台の上で手を振る女の子ごと、遊具が台座に載った模型になっている',
  },
  'editorial-poster': {
    file: 'editorial-poster.webp',
    width: 640,
    height: 853,
    originalId: 'family',
    alt: '見本：上半分に元の家族写真、下半分に紙に描いた家族のイラストと「Autumn Days」の文字が入った縦長のポスター',
  },
  'doodle-friends': {
    file: 'doodle-friends.webp',
    width: 640,
    height: 480,
    originalId: 'family',
    alt: '見本：家族写真はそのままで、まわりにペンで描いた黄色い小人たちが遊んでいる',
  },
  'sketchbook-extension': {
    file: 'sketchbook-extension.webp',
    width: 640,
    height: 480,
    originalId: 'travel',
    alt: '見本：スケッチブックに貼った旅先の家族写真の外へ、海と岬の景色が鉛筆と色鉛筆で描き広げられている',
  },
  'pop-up-book': {
    file: 'pop-up-book.webp',
    width: 640,
    height: 480,
    originalId: 'family',
    alt: '見本：開いた絵本から、紅葉の公園と、切り抜いた紙の家族が立ち上がっている',
  },
  'commemorative-stamp': {
    file: 'commemorative-stamp.webp',
    width: 640,
    height: 480,
    originalId: 'family',
    alt: '見本：家族を平らな挿絵で描いた記念切手。額面と「AUTUMN PARK」の文字、消印が入っている',
  },
  'sugoroku-board': {
    file: 'sugoroku-board.webp',
    width: 640,
    height: 480,
    originalId: 'travel',
    alt: '見本：海と灯台の景色がすごろく盤になり、家族が台に立ったコマになっている。横にさいころがある',
  },
  'specimen-box': {
    file: 'specimen-box.webp',
    width: 640,
    height: 480,
    originalId: 'travel',
    alt: '見本：麦わら帽子・サングラス・服・サンダル・灯台の模型などが、仕切りのある木の標本箱に並んでいる',
  },
  'travel-stamps': {
    file: 'travel-stamps.webp',
    width: 640,
    height: 480,
    originalId: 'travel',
    alt: '見本：海と灯台の景色が、旅のノートに押した 1 つの大きなゴム印になっている。人はいない',
  },
  'travel-stamps-family': {
    file: 'travel-stamps-family.webp',
    width: 640,
    height: 480,
    originalId: 'travel',
    alt: '見本：家族 4 人と灯台の景色が、顔までゴム印の太い線と平らな色で、1 つの大きなスタンプになっている',
  },
}

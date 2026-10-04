<!-- 2026-10-04 に Claude が複数のサブエージェント（集め役 5・統合 1・審査 3・まとめ 1）で作った調査レポート。経緯は logs/decisions.md 2026-10-04「スタイルは…（アイデア賞）を集める方向で見直す」 -->

# スタイル見直しの調査レポート（「雰囲気を変えるだけではない加工」）

調査日: 2026-10-04。5 つの調べ方（海外のプロンプト集、海外の流行記事、日本語の Web、子育て家族の記念品、ゼロからの発想）で 35 案を集め、3 つの観点で点を付けました。観点は「アイデア」「家族の写真に向くか」「作りやすさ」で、それぞれ 1〜5 点です。点は審査役の見立てで、画像を作って試してはいません。

## 1. 結論

- **勧めるのは次の 9 案です。** らくがきの小人、スケッチブック、飛び出す絵本、記念切手、すごろく盤、標本箱、かざしたスケッチ、寝相アート、アクリルスタンド。
- **選んだ理由:** 良いと言われた 3 本（ジオラマ・Editorial Poster・旅のスタンプ）には共通点がありました。どれも「写真を加工した絵」ではなく、「作られた物や紙の作品を、外から撮った写真」になっています。台座・ページ・机のように、物が置かれた場所まで写っています。パッとしない 5 本は、写真の画角のまま、質感だけが変わっています。9 案は、写真が物・形式・遊び道具に変わるものから選びました。
- **もう一つの理由:** 上位の 2 案（らくがきの小人・スケッチブック）は、写真の顔をそのまま残す作りです。そのため、TODO フェーズ2.5 の「顔を画風に寄せる」という課題が、そもそも起きにくいと見ています（Claude の推定）。
- **パッとしない 5 本の扱い（案です。決めるのはユーザー）:**
  - (a) 画面から外す
  - (b) 「物にする」形で作り直す。例：毛糸の刺しゅうワッペンを「布かばんに縫い付けたワッペンを撮った写真」にする。透明水彩はスケッチブック案に吸収する
  - (c) 「画風を変えるだけ」の小分類として残す

  粘土アニメ風を外すと決めた場合は、フェーズ2.5 の「顔を画風に寄せる」の対象からも外れます。

## 2. 推薦の一覧

| 名前 | 写真が何になるか | 向いている家族の場面 | 人物の扱い | 合計点（15点満点） |
|---|---|---|---|---|
| 写真とらくがきの小人 | 紙の上の写真の家族と、ペンで描いた小人たちの一コマの物語 | 日常・成長記録・誕生日・公園 | 残す | 12 |
| 写真の続きを描いたスケッチブック | スケッチブックに貼った写真のプリントと、その外へ広がる手描きの景色 | 旅行・公園・入園入学 | 残す | 12 |
| 飛び出す絵本 | 机の上で開いた、紙細工の飛び出す絵本の見開き | 誕生日・旅行・七五三・贈り物 | 選べる | 11 |
| 記念切手 | 封筒に貼り、消印を押した記念切手 | 誕生・七五三・入園・年賀状 | 選べる | 10 |
| すごろく盤 | 写真の地形がそのまま盤面になる、手作りのすごろく | 旅行・公園・夏休み・キャンプ | 選べる | 10 |
| 思い出の標本箱 | 写真に写った物だけを並べた、木の標本箱 | 海・山の旅行・遠足・初めての靴 | 消す | 10 |
| 風景にかざしたスケッチ | 写真の中に、景色の続きを空想で描いた画用紙が写り込む | 公園・旅行・成長記録 | 残す | 10 |
| 寝相アート | 寝ている赤ちゃんのまわりを、布と小物で作った場面にする | ハーフバースデー・月齢フォト | 残す | 10 |
| うちの子アクリルスタンド | 棚に飾った透明アクリルのスタンド（アクスタ） | 七五三・入園卒園・祖父母への贈り物 | 残す | 10 |

先に 3 つの言葉を説明します。

- **保持文**: アプリが毎回プロンプトに付ける固定の文です。顔・服・ポーズ・人数と並びを変えないよう指示します。
- **被写体の種類**: そのスタイルが人物を残すか（人物）、人物を消して建物や風景を主役にするか（風景）、場所と人物の両方を作り替えるか（人物と場所）の区別です。どの保持文（構図の保ち方を含む）を付けるかがこれで決まります（SPEC.md「プリセット」）。
- **CC BY 4.0 / MIT**: 作者名などを書けば、文章を使ったり書き換えたりしてよい、という利用条件です。

## 3. 推薦した案ごとの説明

### 写真とらくがきの小人（12点）

- **どう変わるか:** 写真の家族を、写真の質感のまま切り抜いて生成りの紙に置きます。黒いペンの小人たちがまわりで拍手したり、荷物を運んだり、同じポーズを真似したりします。
- **アイデア賞と見る理由:** 絵柄は変えずに「何が起きているか」を足します。Editorial Poster と同じ「写真＋手描き」の組み合わせです。
- **気をつける点:** AI が写真の子どもまで線画に描き直すおそれがあります。小人が顔や手に重なること、吹き出しや手書き文字が入ること（「文字を入れない」で抑える）も起きやすいです。動きの少ない写真では物語が生まれにくい見立てです。
- **出どころ:** 原文は 2 つありますが、どちらも本文は使えないので一から書きます。
  - albert-imagebook（MIT）: https://github.com/AlbertAZ1992/albert-imagebook/blob/277f38d1f12a90296d11b7dc4954155821a66e6e/styles/photo-doodle-story/prompt.md 。作者自身が「元の着想の作者と利用条件が未解決」と書いており、旅のスタンプの元と同じ扱いです。
  - SeeAPI（CC BY 4.0）: https://github.com/SeeAPI/nano-banana-prompts-for-image-editing 。X の投稿を書き直したもので、CC BY が書き直し版まで覆うかは確かめられていません。
- **保持文との相性:** 良いです。写真の構図のまま上に線を描き足す版なら、今の「人物と場所」で足ります。紙に置き直す版には、「切り抜いて置き直す人物」という新しい種類が要ります。

### 写真の続きを描いたスケッチブック（12点）

- **どう変わるか:** 開いたスケッチブックの真ん中に、マスキングテープで写真のプリントを留めます。プリントの外へ、景色の続きを鉛筆と色鉛筆で描き広げます。
- **アイデア賞と見る理由:** 写真と絵の境目が見どころになります。プリントの中は写真のままなので、顔の課題が起きません。
- **気をつける点:** 次の 3 つを起こさないよう、強く書く必要があります。プリントの内側まで描き直されて顔や服が変わる。写真の外に家族を描き足して人数が増える。日付やメモの文字が入る。
- **出どころ:** 近い発想の原文が、作者本人の CC BY 4.0 で公開されています（https://github.com/aimikoda/nano-banana-pro-prompts の 1.6）。ただし中身は別の型なので、一から書いて参考元として名前を出す形が無難と見ます。
- **保持文との相性:** 「写真のまま残す人物」という新しい種類があると書きやすいです（推定）。

### 飛び出す絵本（11点）

- **どう変わるか:** 写真の場面が、机の上で開いた紙の飛び出す絵本になります。家族は写真を厚紙に刷って切り抜いた部品にして、顔を写真のまま残します。
- **アイデア賞と見る理由:** 「本という物」に変わり、場面が紙の層に組み直されます。
- **気をつける点:**
  - 見開き中央の折り目が顔を横切らないよう指示します。紙人形化で顔が平らになることもあります。
  - 題名や本文の文字が入りやすいです。
  - ジオラマと「小さな立体の世界」で印象が近いです。
  - 子どもの写真から作った作例は見つかっておらず、仕上がりは試していません。
- **出どころ:** どの原文も作者本人の利用条件が無いため、一から書きます。
- **保持文との相性:** 人物を残す版と消す版の 2 枚にするなら、ジオラマと同じ分け方が要ります（被写体と「Do not:」だけで分ける）。

### 記念切手（10点）

- **どう変わるか:** 写真の場面を、ギザギザの縁の記念切手の絵柄にして、消印付きの封筒に貼ります。
- **アイデア賞と見る理由:** 「切手という小さな印刷物」に入れ直す形式の変化です。
- **気をつける点:**
  - 額面や国名の文字が無いと、切手らしさが落ちます。数字だけ許すかを決める必要があります。
  - 細い線の版画調にすると、子どもの顔が老けて見えやすいです。
  - 実在の郵便マークに似せないようにします。
  - 名前が「旅のスタンプ」と紛らわしいです。
  - 何枚も並べる小型シートの版は顔が崩れやすいので、封筒 1 枚の版を勧めます。
- **出どころ:** 発案です。一から書きます。

### すごろく盤（10点）

- **どう変わるか:** 公園や川や街並みの写真が、マスの並ぶ手作りのすごろく盤になります。サイコロとコマを添えます。
- **アイデア賞と見る理由:** 写真が「遊べる道具」に変わります。Google 公式ブログが 2025 年の流行として紹介した型です（https://blog.google/products-and-platforms/products/gemini/nano-banana-google-trends-2025/ 。利用条件の明記は無いので一から書きます）。
- **気をつける点:** マスに数字や「スタート」の文字が入りやすいです。地形を作り替えすぎると、元の場所が分からなくなります。家族を入れる版は、人物の置き方の設計が要ります。
- **保持文との相性:** 風景だけの版から始めるのが素直と見ます。

### 思い出の標本箱（10点）

- **どう変わるか:** 写真に写った物だけ（帽子・どんぐり・貝殻・靴など）を、木の標本箱の仕切りに 1 つずつ並べます。
- **アイデア賞と見る理由:** 場面ではなく「その日の持ち物」を取り出します。人物を描かないので、顔の問題はありません。
- **気をつける点:**
  - 写真に無い物をでっち上げるのが、いちばん起きやすい失敗です。「写っている物だけ。少なくてよい」と書きます。
  - 生き物を標本にする見せ方や、ピンを刺す見せ方は禁止します。
  - 小物が少ない写真では、空っぽの箱になります。
- **出どころ:** 利用条件が明記された原文は無いので、一から書きます。
- **保持文との相性:** 「写真に写った物」という新しい種類が要ります。

### 風景にかざしたスケッチ（10点）

- **どう変わるか:** 写真はそのまま残します。人物にかからない位置に、手で持った画用紙が写り込みます。紙の中だけ、景色の線の続きがやさしい空想の絵になります（雲がくじらになる、など）。
- **アイデア賞と見る理由:** 見た瞬間に「なるほど」と思える仕掛けです。
- **気をつける点:**
  - 紙が顔を隠さないようにします。
  - 大人の手が不自然に見えることがあります。
  - 線をぴったり合わせる精度は、今の AI では不安定と見ます。
  - 特定の作家の手法に近いので、作家名を使わず一から書きます。
  - 既定の「余計な物を足さない」とぶつかるので、紙の中だけ例外にする書き方が要ります。

### 寝相アート（10点）

- **どう変わるか:** 真上から撮った寝ている赤ちゃんの写真で、まわりを布とおもちゃで作った絵本のような場面にします。赤ちゃんの姿勢と服はそのままです。
- **アイデア賞と見る理由:** 日本の子育て家庭で実際に作られ、写真館も撮影メニューにしている文化です。
- **気をつける点:**
  - 顔のまわりに布を置くと窒息を連想させるので、空ける指示が必須です。
  - 対象外の写真では、子どもを寝かせた姿勢に作り替えてしまいます。使える写真を画面で示す必要があります。
  - 寝ている目を開けさせないようにします。
- **出どころ:** プロンプトの原文は無いので、一から書きます。
- **保持文との相性:** 今の 3 種に当てはまりにくいと見ます（推定）。

### うちの子アクリルスタンド（10点）

- **どう変わるか:** 家族を元のポーズのまま切り抜いて透明なアクリル板に印刷し、背景板と一緒に棚に飾った写真にします。
- **アイデア賞と見る理由:** 顔は印刷物として写真のまま残るので、保持文と相性が良いです。七五三・入園の記念品としても実在します。
- **気をつける点:**
  - アニメ絵に描き直されやすいです。
  - アクリルの反射が顔にかかることがあります。
  - 家族を 1 枚の板にまとめると書かないと、人数や並びが崩れます。
  - 「透明板に刷っただけ」に見えると、インスタント写真風と同じ弱さになります。
- **出どころ:** 利用条件が明記された原文は無いので、一から書きます。
- **保持文との相性:** 「切り抜いて置き直す人物」という新しい種類が要ります。

## 4. 惜しかった案

- **光る切り絵のシャドーボックス（10点）:** 灯りの入った額は魅力的です。ただ飛び出す絵本と同じ「紙の層の立体」で、人物の層がシルエットや逆光で暗くなりやすいので外しました。
- **街の壁に飾られた一枚（10点）:** 大型ビジョンの版は安定して作れます。ただ街の 3D ビジョンとしては既に流行った型です。子どもを街中に出すイメージを嫌う親もいます。
- **思い出ステッカー（10点）:** 子どもが喜ぶ物になり、ぷっくりシールの流行にも乗れます。ただ白フチのステッカー化は 2025 年にいちばんありふれた加工の一つです（アイデア 2 点）。
- **スノードーム（9点）:** 風景だけなら作りやすいです。ただジオラマと印象が重なり、家族版は「ガラスに閉じ込める」演出になります。
- **金屏風（9点）:** 七五三や正月に合う和の形式です。ただ折り目が顔を横切り、服を和装に変えたがるので、人物版のリスクが大きいです。
- **家族の星座（8点）:** アイデアは 4 点です。ただ「お星さまになる」が亡くなったことの言い回しと重なり、顔も線画に簡略化されます。
- **探し絵の絵本ページ（8点）:** 子どもが自分を探して遊べる発想です。ただ家族が小さすぎて、顔の保持文が効きません。
- **机の上のフィギュア（8点）:** 作者本人が CC BY 4.0 で出した原文があり、使うのはいちばん楽です。ただ 2025 年にいちばん広まった、まさに「ありふれた」加工です。

## 5. 調査の限界

- **画像は 1 枚も作っていません。** 点と、崩れやすい点の指摘は、どれも審査役の見立てです。子どもの写真で試した作例を確認できたのは、ごく一部です（トレカ・フィギュア・ぬりえ・切手の記事）。採用の前に見本画像で確かめる必要があります。Codex で作るなら ChatGPT の利用枠を使うので、ユーザーの了承（タスクごとに 1 回）が要ります。
- **利用条件は、まとめ役のリポジトリの表示ではなく、作者本人の表示で判断しました。** 本文を使えそうな原文は、推薦 9 案にはほとんどありません。確かめきれなかったものは次のとおりです。
  - SeeAPI の「らくがき」は X 投稿の書き直しで、CC BY が覆うかは未確認です。
  - albert-imagebook の最初の 7 本は、作者が「着想の出どころが未解決」と書いています。
  - ZeroLu のリポジトリは、LICENSE が MIT、README の表示が CC BY 4.0 で食い違っています。
- **開けなかった出典は載せていません。** X の投稿（402 エラー）、TechRepublic（403）、Newsweek（本文を取れず）、Etsy（403）です。紹介記事や収集リポジトリで確かめられたものだけを出典にしました。
- **アプリ側の作業量は推定です。** 「新しい被写体の種類が要るか」「文字を入れないとぶつかるか」は、プロンプトの設計前の見立てです。

## 付録 A：35 案すべての点数

点は 3 つの観点（アイデア／家族向け／作りやすさと権利）の 1〜5 点。どれかが 2 点以下の案に「弱」を付けた。人物：keep＝残す、remove＝消す、either＝選べる。
構図：same-frame＝元の構図のまま、re-laid-out＝作品のレイアウトに配置し直す、new-object＝写真が立体物などの新しい物になる。

| id | 名前 | 合計 | アイデア | 家族 | 作りやすさ | 弱 | 人物 | 構図 |
|---|---|---|---|---|---|---|---|---|
| C03 | 写真とらくがきの小人（Photo Doodle Friends） | 12 | 4 | 4 | 4 |  | keep | re-laid-out |
| C29 | 写真の続きを描いたスケッチブック（Photo Continued in a Sketchbook） | 12 | 4 | 4 | 4 |  | keep | re-laid-out |
| C01 | 飛び出す絵本（Pop-up Book） | 11 | 4 | 4 | 3 |  | either | new-object |
| C02 | うちの子アクリルスタンド（Acrylic Standee） | 10 | 3 | 3 | 4 |  | keep | new-object |
| C05 | 記念切手（Commemorative Stamp） | 10 | 4 | 3 | 3 |  | either | re-laid-out |
| C08 | 思い出ステッカー（Die-cut Sticker Sheet） | 10 | 2 | 4 | 4 | 弱 | keep | new-object |
| C09 | 光る切り絵のシャドーボックス（Glowing Papercut Shadow Box） | 10 | 3 | 4 | 3 |  | either | new-object |
| C14 | 街の壁に飾られた一枚（Photo on a City Wall） | 10 | 3 | 3 | 4 |  | keep | new-object |
| C20 | すごろく盤（Adventure Board Game） | 10 | 4 | 3 | 3 |  | either | new-object |
| C27 | 寝相アート（Nesou Art Flat-lay） | 10 | 4 | 3 | 3 |  | keep | same-frame |
| C31 | 思い出の標本箱（Memory Specimen Box） | 10 | 4 | 3 | 3 |  | remove | re-laid-out |
| C34 | 風景にかざしたスケッチ（Sketch Held Up to the Scene） | 10 | 4 | 3 | 3 |  | keep | same-frame |
| C04 | スノードーム（Snow Globe Keepsake） | 9 | 3 | 3 | 3 |  | either | new-object |
| C11 | 記念トレカ（Keepsake Trading Card） | 9 | 2 | 3 | 4 | 弱 | keep | re-laid-out |
| C13 | 金屏風（Gold-Leaf Folding Screen） | 9 | 3 | 3 | 3 |  | either | new-object |
| C17 | スーツケースの中の旅（Suitcase World） | 9 | 3 | 3 | 3 |  | either | new-object |
| C23 | お菓子の家（Gingerbread House） | 9 | 3 | 2 | 4 | 弱 | remove | new-object |
| C30 | 紙の舞台（トイシアター）（Paper Toy Theater） | 9 | 3 | 3 | 3 |  | keep | new-object |
| C06 | 家族の星座（Family Constellation Star Chart） | 8 | 4 | 2 | 2 | 弱 | keep | re-laid-out |
| C07 | エナメルの旅みやげ（Enamel Travel Keepsake） | 8 | 3 | 2 | 3 | 弱 | either | new-object |
| C10 | 机の上のフィギュア（Collectible Figurine） | 8 | 2 | 2 | 4 | 弱 | keep | new-object |
| C16 | 探し絵の絵本ページ（Search-and-Find Page） | 8 | 4 | 2 | 2 | 弱 | keep | re-laid-out |
| C25 | 千歳飴の袋（Chitose-ame Bag） | 8 | 3 | 2 | 3 | 弱 | keep | re-laid-out |
| C26 | 教室の黒板アート（Classroom Chalkboard Mural） | 8 | 3 | 2 | 3 | 弱 | keep | new-object |
| C33 | 染付の絵皿（Blue-and-White Porcelain Plate） | 8 | 3 | 2 | 3 | 弱 | either | new-object |
| C35 | 夏休みの絵日記（Summer Picture Diary Page） | 8 | 3 | 3 | 2 | 弱 | keep | re-laid-out |
| C12 | 美術館に飾られた一枚（Portrait in a Museum Gallery） | 7 | 2 | 2 | 3 | 弱 | keep | new-object |
| C15 | 写真から飛び出す（Out of the Print） | 7 | 2 | 2 | 3 | 弱 | keep | new-object |
| C18 | 家族のマトリョーシカ（Family Nesting Dolls） | 7 | 3 | 2 | 2 | 弱 | keep | new-object |
| C21 | 雑誌の表紙（Kids Magazine Cover） | 7 | 2 | 2 | 3 | 弱 | keep | re-laid-out |
| C22 | まちがいさがし（Spot the Difference Puzzle） | 7 | 3 | 2 | 2 | 弱 | keep | re-laid-out |
| C24 | ことば図鑑ポスター（Picture Word Poster） | 7 | 3 | 2 | 2 | 弱 | keep | re-laid-out |
| C28 | 家族の記念メダル（Commemorative Relief Medal） | 7 | 3 | 2 | 2 | 弱 | keep | new-object |
| C32 | 窓のステンドグラス（Stained Glass Window） | 7 | 2 | 2 | 3 | 弱 | either | new-object |
| C19 | 名前の文字の中の思い出（Name Wordscape） | 6 | 2 | 2 | 2 | 弱 | either | re-laid-out |

## 付録 B：出典（集め役が開いて確かめたもの。括弧内は作者が明記した利用条件）

- C03 写真とらくがきの小人
  - https://github.com/SeeAPI/nano-banana-prompts-for-image-editing (CC BY 4.0（SeeAPI の LICENSE.md）。ただし @azed_ai の X 投稿をもとに SeeAPI が書き直したもので、CC BY が書き直し版まで覆うかは未確認（毛糸の刺しゅう P28 と同じ状態）)
  - https://github.com/JimmyLv/awesome-nano-banana (明記なし（収集者の CC BY 4.0 表示は原作者の許諾ではない）)
  - https://github.com/AlbertAZ1992/albert-imagebook/blob/277f38d1f12a90296d11b7dc4954155821a66e6e/styles/photo-doodle-story/prompt.md (MIT と表示（LICENSE「Copyright (c) 2026 Albert's Imagebook contributors」）。ただし作者の docs/sources.md と docs/example-history.md に、このスタイルを含む最初の 7 本は利用者提供の着想から作り、原作者・URL・利用条件が未解決だと書かれている。旅のスタンプの元（rubber-stamp-travel-journal）と同じ扱い)
  - https://note.com/bonjinika/n/na3255dc17465 (明記なし（作者はプロンプトの SNS 転載・DM 共有をしないよう求めている。生成画像の投稿は可。本文は使えない）)
  - https://nonno.hpplus.jp/editors/entertainment/358143/ (明記なし)
- C29 写真の続きを描いたスケッチブック
  - https://github.com/ZeroLu/awesome-nanobanana-pro (明記なし（まとめのリポジトリは CC BY 4.0 の表示。原作者 @munou_ac 本人の利用条件は無い）)
  - https://github.com/aimikoda/nano-banana-pro-prompts (CC BY 4.0（作者本人のリポジトリ。README に「All created by @aimikoda」と「Licensed under CC BY 4.0」）)
- C01 飛び出す絵本
  - https://github.com/JimmyLv/awesome-nano-banana (明記なし（収集リポジトリの CC BY 4.0 表示は収集者のもの。原作者 @dotey の許諾ではない）)
  - https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts (明記なし（YouMind の CC BY 4.0 は収集者の表示。原作者の許諾ではない）)
  - https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md (明記なし（収集リポジトリは GitHub 上 Apache-2.0、README のバッジは CC BY 4.0。どちらも原作者本人の許諾ではない）)
  - https://note.com/yudo_tanaka/n/n1b2c05624e81?hl=en (明記なし)
  - https://hashout.jp/ai/885/ (明記なし)
  - https://note.com/lalala7720/n/n8941f9fd4330 (明記なし（「[ ]部分を自由に変更してお使いください」とあるが、再配布・改変の利用条件は書かれていない）)
  - https://paperlove.cards/ (明記なし)
  - https://nanobananaprompt.me/categories/art-design (明記なし（ページは © 2026 NanoBananaPrompt. All rights reserved）)
- C02 うちの子アクリルスタンド
  - https://note.com/tokyo_mhz/n/n1953615e717a (明記なし)
  - https://github.com/JimmyLv/awesome-nano-banana (明記なし（収集者の CC BY 4.0 表示は原作者の許諾ではない）)
  - https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md (明記なし（集めたリポジトリは CC BY 4.0 の表示だが、元の作者の X 投稿に利用条件の記載なし）)
  - https://note.com/komugi_dolko/n/n29d96e044d47 (明記なし（プロンプトは有料部分）)
  - https://aitool-lab.jp/ai/work-efficiency/image-generation/gemini-img-prompts/ (明記なし（記事に「コピペOK」とあるが、再配布・改変の利用条件の明記ではない）)
  - https://www.ko-bo.jp/view/category/ct919 (明記なし)
  - https://mixi.co.jp/news/2025/0916/44794/ (明記なし)
- C05 記念切手
  - https://www.lilachbullock.com/mothers-day-photo-prompts-chatgpt-gift-worthy-edits/ (明記なし（ページ末尾に All rights reserved）)
  - https://x.com/Artedeingenio/status/1919675514144313671 (明記なし。X の投稿は 402 で開けなかった。集め役が紹介記事から拾った URL で、本文は確かめていない)
  - https://note.com/neet_narita/n/na26342cd6330 (明記なし（記事中に「実在の郵便ロゴ、他人の写真や既存キャラ使用はNG」とある）)
- C08 思い出ステッカー
  - https://github.com/AlbertAZ1992/albert-imagebook/blob/277f38d1f12a90296d11b7dc4954155821a66e6e/styles/little-day-stickers/prompt.md (MIT（LICENSE「Copyright (c) 2026 Albert's Imagebook contributors」）。採用済みの透明水彩と同じく後から足した 17 スタイルの 1 つで、利用者提供の着想の記録は無い。確認したコミットは透明水彩と同じ 277f38d)
  - https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md (明記なし（集めたリポジトリは CC BY 4.0 の表示だが、元の作者の X 投稿に利用条件の記載なし）)
  - https://github.com/JimmyLv/awesome-nano-banana (明記なし（プロンプトの作者は X の投稿者）)
  - https://jbpress.ismedia.jp/articles/-/92447 (明記なし)
  - https://note.com/sugar_arc_works/n/nbfa58dd1a5e5 (明記なし（「ご自由に修正して使ってください」とあるが、利用条件の明記ではない）)
  - https://note.com/just_50/n/n58fd67472299 (明記なし)
- C09 光る切り絵のシャドーボックス
  - https://note.com/tnnumaru/n/n2d86589a27bc (明記なし)
  - https://aitool-lab.jp/ai/work-efficiency/image-generation/gemini-img-prompts/ (明記なし（記事に「コピペOK」とあるが、再配布・改変の利用条件の明記ではない）)
  - https://jennifermaker.com/light-painting-shadow-box/ (明記なし)
  - https://jennifermaker.com/paper-cut-light-box-tutorial/ (型紙について「物を作って売ってよい、使ったことを書いてほしい」と明記。プロンプトではない)
  - https://github.com/AlbertAZ1992/albert-imagebook/blob/277f38d1f12a90296d11b7dc4954155821a66e6e/styles/paper-poetry/prompt.md (MIT)
  - https://orion4d.github.io/Gemini_Banana_by_orion4d/nano_banana_prompt_guide_en.html (MIT（GitHub のリポジトリ情報）。ページ末尾に「Free to use (credit appreciated)」)
- C14 街の壁に飾られた一枚
  - https://github.com/ZeroLu/awesome-nanobanana-pro (明記なし（収集リポジトリは README のバッジが CC BY 4.0、GitHub 上は MIT。作者本人の利用条件は書かれていない）)
  - https://note.com/google_gemini/n/nbc87f3fc8c83 (明記なし)
  - https://note.com/tokyo_mhz/n/n1953615e717a (明記なし)
- C20 すごろく盤
  - https://blog.google/products-and-platforms/products/gemini/nano-banana-google-trends-2025/ (明記なし)
- C27 寝相アート
  - https://www.studio-alice.co.jp/shortcut/halfbd_s/column/detail14.html (明記なし)
  - https://mixi.co.jp/news/2025/0916/44794/ (明記なし)
- C31 思い出の標本箱
  - https://notegpt.io/blog/trending-nano-banana-pro-prompts-use-cases (明記なし（© 2026 notegpt.io. All rights reserved）)
- C34 風景にかざしたスケッチ
  - https://www.designboom.com/art/ben-heine-pencil-vs-camera/ (明記なし（画像は © Ben Heine）)
- C04 スノードーム
  - https://github.com/aimikoda/nano-banana-pro-prompts (CC BY 4.0（README 末尾。作者 @aimikoda 本人の作）)
  - https://github.com/JimmyLv/awesome-nano-banana (明記なし（収集者の CC BY 4.0 表示は原作者の許諾ではない）)
  - https://www.media.io/image-effects/ai-christmas-snow-globe-effect.html (明記なし)
  - https://github.com/ZeroLu/awesome-nanobanana-pro (明記なし（README のバッジは CC BY 4.0、GitHub 上は MIT。作者本人の利用条件は書かれていない）)
  - https://note.com/google_gemini/n/nb1c0145d180e (明記なし)
  - https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md (明記なし（収集リポジトリは GitHub 上 Apache-2.0、README のバッジは CC BY 4.0。作者本人の利用条件は書かれていない）)
  - https://note.com/rinta_29/n/nf440767799af (明記なし（プロンプトは有料部分）)
  - https://www.zazzle.com/personalized_family_photos_keepsake_snow_globe-256415421968979911 (明記なし)
- C11 記念トレカ
  - https://www.onlinemarketing-academy.com/blog/395/ai-tips-for-business/915/50-most-wanted-prompts-for-gemini-s-nano-banana (明記なし（Copyright © Online Marketing Academy）)
  - https://note.com/mato_note/n/nee9a5fcb1328 (明記なし)
- C13 金屏風
  - https://www.byoubu.co.jp/ (明記なし)
- C17 スーツケースの中の旅
  - https://github.com/SeeAPI/awesome-gpt-image-2.5-prompts (明記なし（同リポジトリの docs/sources-and-rights.md に「No repository-wide license has been assigned」とある。nano-banana のリポジトリと違い CC BY 4.0 ではない）)
- C23 お菓子の家
  - https://www.media.io/image-effects/ai-gingerbread-generator.html (明記なし)
- C30 紙の舞台（トイシアター）
  - https://en.wikipedia.org/wiki/Toy_theater (明記なし（取得した本文の範囲では確認できず）)
- C06 家族の星座
  - https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md (明記なし（収集リポジトリは GitHub 上 Apache-2.0、README のバッジは CC BY 4.0。どちらも原作者本人の許諾ではない）)
  - https://capricorn-press.com/wall-art/custom-celestial-chart/ (明記なし)
- C07 エナメルの旅みやげ
  - https://github.com/AlbertAZ1992/albert-imagebook/blob/277f38d1f12a90296d11b7dc4954155821a66e6e/styles/enamel-travel-keepsake/prompt.md (MIT（LICENSE「Copyright (c) 2026 Albert's Imagebook contributors」）。ただし docs/sources.md と docs/example-history.md に、このスタイルを含む最初の 7 本は利用者提供の着想から作り、原作者・利用条件が未解決との注記がある。旅のスタンプの元と同じ扱い)
- C10 机の上のフィギュア
  - https://github.com/SeeAPI/nano-banana-prompts-for-image-editing/blob/0f832f28983d3c82bcc1b8862377d89cb1cef858/prompts/miniature-figurine/prompt.txt (CC BY 4.0（LICENSE.md の「SeeAPI’s original prompts ... are licensed under CC BY 4.0」。表示義務は手描きアニメ映画風と同じ）)
  - https://github.com/google-gemini/cookbook/blob/main/quickstarts/Get_Started_Nano_Banana.ipynb (Apache-2.0（ノートブック冒頭の「Copyright 2026 Google LLC」と Apache License 2.0 の表示）。ただし本文は 2025 年に X で流行した書き方とほぼ同じで、Google は元の作者を書いていない)
  - https://blog.google/products-and-platforms/products/gemini/nano-banana-google-trends-2025/ (明記なし)
- C16 探し絵の絵本ページ
  - https://github.com/ZeroLu/awesome-gpt-image (明記なし（収集リポジトリの MIT は収集者のもの。原作者の許諾ではない）)
  - https://github.com/ZeroLu/awesome-nanobanana-pro (明記なし（商標入り。収集リポジトリの CC BY 4.0 / MIT 表示は原作者の許諾ではない）)
- C26 教室の黒板アート
  - https://ja.wikipedia.org/wiki/%E9%BB%92%E6%9D%BF%E3%82%A2%E3%83%BC%E3%83%88%E7%94%B2%E5%AD%90%E5%9C%92 (明記なし（Wikipedia 本文は CC BY-SA だが、参考にするのは文化の存在だけ）)
  - https://github.com/ZeroLu/awesome-nanobanana-pro (明記なし（作者は X の投稿者。リポジトリ自体は LICENSE が MIT、README のバッジが CC BY 4.0 で食い違っている）)
- C12 美術館に飾られた一枚
  - https://github.com/ZeroLu/awesome-nanobanana-pro (明記なし（まとめのリポジトリは README のバッジが CC BY 4.0、LICENSE が MIT。原作者本人の利用条件は無い）)
- C15 写真から飛び出す
  - https://github.com/JimmyLv/awesome-nano-banana (明記なし（原文には商標「Polaroid」とちびキャラ化が入っているので、雰囲気だけを参考にする）)
- C18 家族のマトリョーシカ
  - https://github.com/JimmyLv/awesome-nano-banana (明記なし（収集者の CC BY 4.0 表示は原作者の許諾ではない）)
- C21 雑誌の表紙
  - https://www.aitoolsforkids.com/blog/chatgpt-images-2-for-kids-activities (明記なし)
  - https://github.com/ZeroLu/awesome-nanobanana-pro (明記なし（集めたリポジトリは CC BY 4.0 の表示だが、元の作者の X 投稿に利用条件の記載なし）)
- C22 まちがいさがし
  - https://dev.to/seehiong/prompt-to-puzzle-generating-infinite-spot-the-difference-games-with-gemini-1o8j (明記なし)
- C24 ことば図鑑ポスター
  - https://github.com/PicoTrex/Awesome-Nano-Banana-images/blob/main/README_en.md (明記なし（集めたリポジトリは CC BY 4.0 の表示だが、元の作者の X 投稿に利用条件の記載なし）)
  - https://www.aitoolsforkids.com/blog/chatgpt-images-2-for-kids-activities (明記なし)
- C28 家族の記念メダル
  - https://medal-coin.com/pickup/commemorative.html (明記なし)
  - https://github.com/JimmyLv/awesome-nano-banana (明記なし（プロンプトの作者は X の投稿者）)
- C32 窓のステンドグラス
  - https://aitool-lab.jp/ai/work-efficiency/image-generation/gemini-img-prompts/ (明記なし（見出しに「コピペOK」とあるが、CC BY などの利用条件の明記は無い）)
  - https://orion4d.github.io/Gemini_Banana_by_orion4d/nano_banana_prompt_guide_en.html (MIT（GitHub のリポジトリ情報）。ページ末尾に「Free to use (credit appreciated)」)
- C19 名前の文字の中の思い出
  - https://github.com/AlbertAZ1992/albert-imagebook/blob/main/styles/summer-wordscape/prompt.md (MIT（LICENSE「Copyright (c) 2026 Albert's Imagebook contributors」）。17 の新しいスタイルの 1 つで、利用者提供の着想の記録は無い)

## 付録 C：統合のときに落とした案

- ぬりえ（oss の Coloring Page）：線画に描き直すのが本体で、画風の変更に近い。ChatGPT のぬりえ化は専用サービスがいくつもあるほどありふれていて、ユーザーの言う「ありふれた加工」に当たる。global・family・ideation の調査も同じ理由で外していた
- カプセルトイ（japan の Capsule Toy Figure）：カプセルという容器に子どもの像を入れる見せ方で、前提の「子どもを箱やパッケージに閉じ込める」演出に当たる（上を開けても容器の連想が残る。oss の調査も同じ理由で外した）。「子どもが小さな立体の像になる」部分は C10 机の上のフィギュアで扱える。出典は science-everyday.com の記事と、とすくんの note（後者は C02・C14 に残した）
- お菓子になる（アイシングクッキー／手づくりケーキ、japan の Iced Cookie Keepsake）：子どもの顔を食べ物にする演出。食べる・ナイフを入れる連想や、盛り上がったアイシングの目が不気味になりやすく、前提の「不気味・怖い」に当たる。顔・服・ポーズの保持もほぼできない（family の調査も同じ理由で外した）
- キャラ弁（japan の Character Bento）：海苔とご飯で作った子どもの顔が不気味になりやすく、「子どもの顔を食べる」抵抗もある。服・ポーズ・人数も保てず、固定の保持文と根本的にぶつかる（oss・family・ideation の調査も外していた）
- 光るクリスタルの記念品（family の Laser-etched Crystal Keepsake）：白一色の像が遺影や追悼品に見えやすい（実際に追悼用途の商品も多い）。前提の「不気味・怖い」を避ける方針に合わず、顔立ちも点の集まりになって残らない（ideation の調査も同じ理由で外した）。35 件の上限に収めるため、リスクが最も重いこの案を落とした
- 統合：ぷっくりシール（japan の Puffy Dome Sticker）は型抜きシールの素材違いなので、C08 思い出ステッカーに「ぷっくりの版」として統合した（concept・output・risks に残し、出典 4 件も移した）
- 統合：街頭ビジョン（japan の Giant City Billboard）は、oss の街の壁画（Town Mural）と同じ「写真が街の建物の壁に大きく飾られ、通行人と一緒に写る」加工。C14 に統合し、手描きの壁画と大型ビジョンを媒体違いの版として残した
- 統合（同じ加工の言い換え）：飛び出す絵本 5 件（oss・global・japan・family・ideation）→C01、アクリルスタンド 5 件→C02、らくがきの小人 4 件（oss・global・japan・family）→C03、スノードーム 4 件（oss・global・japan・family）→C04、記念切手 4 件（oss・global・japan・ideation）→C05、星座 3 件（oss・japan・family）→C06、エナメルの旅みやげ 3 件（global・japan・family）→C07、型抜きステッカー 3 件（oss・global・family）＋ぷっくりシール→C08、切り絵のシャドーボックス 3 件（japan・family・ideation）→C09、フィギュア 2 件（oss・global）→C10、トレカ 2 件（global・japan）→C11、美術館の額 2 件（global・ideation）→C12、金屏風 2 件（family・ideation）→C13。出典は URL と項目が同じものだけを 1 つにまとめ、ほかは全部残した
- 前提の「今ある 10 スタイル」「見送った案」と同じものは、5 つの探し方の候補の中には無かった（各調査が事前に外していた。旅のスタンプの元の rubber-stamp-travel-journal、Pixar 風、ブロックのミニフィグ、フォトブース、等身大の箱、Y2K、9 コマの絵コンテなど）

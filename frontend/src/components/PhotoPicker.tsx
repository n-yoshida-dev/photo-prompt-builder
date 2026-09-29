import { useEffect, useId, useState, type ChangeEvent } from 'react'

// 選んだ写真 1 枚ぶんの表示用データ。url はブラウザ内だけで有効な一時 URL（blob:）
type PhotoPreview = {
  name: string
  url: string
}

// 写真の選択とサムネイル表示。写真は送信も保存もせず、この画面で確認用に表示するだけ（CLAUDE.md「守ること」）
export function PhotoPicker() {
  const inputId = useId()
  const [photos, setPhotos] = useState<PhotoPreview[]>([])
  const [skipped, setSkipped] = useState(0)

  // 選び直したときと画面を閉じたときに、前の一時 URL を解放する（メモリを掴んだままにしない）
  useEffect(() => {
    return () => {
      for (const photo of photos) {
        URL.revokeObjectURL(photo.url)
      }
    }
  }, [photos])

  // ファイル選択の変更を受け、画像だけをプレビューに並べる。画像でないファイルは数だけ知らせる
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    const images = files.filter((file) => file.type.startsWith('image/'))
    setSkipped(files.length - images.length)
    setPhotos(images.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })))
  }

  return (
    <section className="step" aria-labelledby={`${inputId}-heading`}>
      <h2 id={`${inputId}-heading`} className="step-heading">
        <span className="step-number">1</span>写真を選ぶ
      </h2>
      <p className="step-note">
        写真はこの端末の外に出ません。ここでは確認のために表示するだけで、AI
        のサイトには自分で添付します。
      </p>
      <label className="file-button" htmlFor={inputId}>
        写真を選ぶ（複数可）
      </label>
      <input
        id={inputId}
        className="visually-hidden"
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
      />
      <p className="photo-count" aria-live="polite">
        {photos.length === 0 ? 'まだ選んでいません' : `${photos.length} 枚を選んでいます`}
        {skipped > 0 && `（画像ではないファイル ${skipped} 件は除きました）`}
      </p>
      {photos.length > 0 && (
        <ul className="photo-list">
          {photos.map((photo) => (
            <li key={photo.url} className="photo-print">
              <img src={photo.url} alt={photo.name} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

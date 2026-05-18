import { useState, useRef } from 'react'

const MAX_IMAGES = 4
const MIN_IMAGES = 2

export default function UploadScreen({ onStart }) {
  const [images, setImages] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const canStart = images.length >= MIN_IMAGES

  function addFiles(files) {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'))
    setImages(prev => [...prev, ...valid].slice(0, MAX_IMAGES))
  }

  function handleFileChange(e) {
    addFiles(e.target.files)
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  function removeImage(index) {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="screen upload-screen">
      {/* Header */}
      <div className="upload-header">
        <div className="upload-logo">📚</div>
        <h1 className="upload-title">دَرْسي</h1>
        <p className="upload-subtitle">صوّر درسك، وسنشرحه لك بذكاء ✨</p>
      </div>

      {/* Drop zone */}
      {images.length < MAX_IMAGES && (
        <div
          className={`upload-zone${isDragOver ? ' drag-over' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          role="button"
          aria-label="رفع صور الدرس"
        >
          <div className="upload-zone-icon">📷</div>
          <p className="upload-zone-text">اضغط لرفع صور الدرس</p>
          <p className="upload-zone-hint">أو اسحب الصور هنا • من {MIN_IMAGES} إلى {MAX_IMAGES} صور</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Previews */}
      {images.length > 0 && (
        <>
          <p className="upload-counter">
            {images.length} من {MAX_IMAGES} صور
            {images.length < MAX_IMAGES && ' · اضغط للإضافة'}
          </p>
          <div className="previews-grid">
            {images.map((file, i) => (
              <div key={i} className="preview-item">
                <img src={URL.createObjectURL(file)} alt={`صورة ${i + 1}`} />
                <button
                  className="preview-remove"
                  onClick={() => removeImage(i)}
                  aria-label="حذف الصورة"
                >✕</button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <div
                className="preview-item"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', border: '2px dashed #c7d2fe', background: '#fafbff',
                  fontSize: 32, color: '#a5b4fc',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                +
                <input
                  type="file" accept="image/*" multiple
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* CTA */}
      <div className="mt-auto">
        {images.length > 0 && images.length < MIN_IMAGES && (
          <p style={{ textAlign: 'center', color: '#f59e0b', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
            ⚠️ يرجى رفع صورتين على الأقل
          </p>
        )}
        <button
          className="btn btn-primary"
          disabled={!canStart}
          onClick={() => canStart && onStart(images)}
        >
          <span>🚀</span>
          ابدأ التحليل والشرح
        </button>
      </div>
    </div>
  )
}

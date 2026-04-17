import { useRef, useState, useCallback } from 'react'
import {
  uploadProductImage,
  deleteProductImage,
  extractPathFromPublicUrl,
  validateImageFile,
} from '@/services/storage'

const DEFAULT_MAX = 8

/**
 * Controlled image uploader for the admin product form.
 *
 * Props:
 *   value: string[]                URLs (ordered — index 0 is principal)
 *   onChange: (next: string[]) => void
 *   maxFiles?: number              Hard cap on total images (default 8)
 */
export const ImageUploader = ({ value = [], onChange, maxFiles = DEFAULT_MAX }) => {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState([])

  const remaining = Math.max(0, maxFiles - value.length)

  const processFiles = useCallback(
    async (fileList) => {
      if (!fileList || fileList.length === 0) return

      const incoming = Array.from(fileList).slice(0, remaining)
      if (incoming.length === 0) {
        setErrors([`Máximo ${maxFiles} imágenes por producto.`])
        return
      }

      setErrors([])
      setUploading(true)

      // Filter client-side first (so we don't hit storage for obvious rejects)
      const prepared = incoming.map((file) => {
        const err = validateImageFile(file)
        return { file, err }
      })

      const valid = prepared.filter((p) => !p.err).map((p) => p.file)
      const invalidErrors = prepared
        .filter((p) => p.err)
        .map((p) => `${p.file.name || 'archivo'}: ${p.err}`)

      const results = await Promise.all(valid.map((f) => uploadProductImage(f)))

      const successUrls = results.filter((r) => r.url).map((r) => r.url)
      const uploadErrors = results
        .map((r, i) => (r.error ? `${valid[i].name || 'archivo'}: ${r.error}` : null))
        .filter(Boolean)

      if (successUrls.length > 0) onChange([...value, ...successUrls])

      const combined = [...invalidErrors, ...uploadErrors]
      if (combined.length > 0) setErrors(combined)

      setUploading(false)
    },
    [maxFiles, onChange, remaining, value],
  )

  const handleInputChange = (event) => {
    processFiles(event.target.files)
    // reset so the same file can be re-selected later
    event.target.value = ''
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragOver(false)
    processFiles(event.dataTransfer.files)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    if (!dragOver) setDragOver(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setDragOver(false)
  }

  const handleMove = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const handleRemove = (index) => {
    const url = value[index]
    const next = value.filter((_, i) => i !== index)
    onChange(next)
    const path = extractPathFromPublicUrl(url)
    if (path) {
      // Fire-and-forget — we don't block the UI on storage cleanup
      deleteProductImage(path).catch(() => {})
    }
  }

  return (
    <div className="flex flex-col" style={{ gap: '1.5rem' }}>
      {/* Drop zone / file input trigger */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
        className="relative cursor-pointer text-center transition-colors"
        style={{
          border: dragOver
            ? '2px dashed var(--color-accent)'
            : '2px dashed var(--color-surface)',
          backgroundColor: dragOver
            ? 'rgba(28, 182, 254, 0.08)'
            : 'var(--color-base)',
          padding: '2.5rem 1.5rem',
          opacity: uploading ? 0.6 : 1,
          pointerEvents: uploading ? 'none' : 'auto',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />

        <span
          className="label-xs text-[var(--color-muted)] block"
          style={{ letterSpacing: '0.25em', marginBottom: '0.5rem' }}
        >
          {uploading ? 'Subiendo…' : 'Añadir imágenes'}
        </span>
        <p
          className="font-serif text-[var(--color-ink)]"
          style={{
            fontSize: '1.15rem',
            fontWeight: 300,
            lineHeight: 1.3,
          }}
        >
          Arrastra fotos aquí o haz clic para seleccionarlas
        </p>
        <p
          className="font-sans text-[var(--color-muted)]"
          style={{
            fontSize: '0.72rem',
            marginTop: '0.5rem',
            letterSpacing: '0.02em',
          }}
        >
          JPG, PNG, WEBP · máx 5 MB · {value.length} / {maxFiles}
        </p>
      </div>

      {errors.length > 0 && (
        <ul
          className="font-sans text-red-600"
          style={{
            fontSize: '0.78rem',
            lineHeight: 1.55,
            paddingLeft: '1rem',
          }}
        >
          {errors.map((err, i) => (
            <li key={i} style={{ listStyle: 'disc' }}>
              {err}
            </li>
          ))}
        </ul>
      )}

      {/* Thumbnails grid */}
      {value.length > 0 && (
        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(9rem, 1fr))',
            gap: '0.85rem',
          }}
        >
          {value.map((url, i) => (
            <Thumbnail
              key={url + i}
              url={url}
              isPrincipal={i === 0}
              canMoveLeft={i > 0}
              canMoveRight={i < value.length - 1}
              onMoveLeft={() => handleMove(i, -1)}
              onMoveRight={() => handleMove(i, 1)}
              onRemove={() => handleRemove(i)}
              disabled={uploading}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const Thumbnail = ({
  url,
  isPrincipal,
  canMoveLeft,
  canMoveRight,
  onMoveLeft,
  onMoveRight,
  onRemove,
  disabled,
}) => (
  <div
    className="group relative bg-[var(--color-surface)]"
    style={{
      aspectRatio: '3 / 4',
      overflow: 'hidden',
      border: '1px solid var(--color-surface)',
    }}
  >
    <img
      src={url}
      alt=""
      className="h-full w-full object-cover"
      loading="lazy"
    />

    {isPrincipal && (
      <span
        className="absolute left-2 top-2 bg-[var(--color-ink)] font-sans text-[var(--color-paper)]"
        style={{
          fontSize: '0.6rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          padding: '0.3rem 0.55rem',
        }}
      >
        Principal
      </span>
    )}

    {/* Persistent remove button — always visible on all devices, bottom-right corner */}
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onRemove?.()
      }}
      disabled={disabled}
      title="Eliminar imagen"
      className="absolute bottom-2 right-2 font-sans text-[var(--color-paper)] disabled:opacity-30"
      style={{
        width: '1.75rem',
        height: '1.75rem',
        display: 'grid',
        placeItems: 'center',
        fontSize: '1rem',
        lineHeight: 1,
        backgroundColor: 'rgba(220, 38, 38, 0.92)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.2)',
        zIndex: 2,
      }}
    >
      ×
    </button>

    {/* Hover overlay — reorder arrows only, × is handled by the persistent button above */}
    <div
      className="absolute inset-0 flex items-end opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      style={{
        background:
          'linear-gradient(to top, rgba(10, 37, 64, 0.85) 0%, rgba(10, 37, 64, 0.25) 55%, transparent 100%)',
        padding: '0.55rem',
      }}
    >
      <div
        className="flex w-full items-center"
        style={{ gap: '0.35rem' }}
      >
        <ThumbButton
          onClick={onMoveLeft}
          disabled={!canMoveLeft || disabled}
          title="Mover a la izquierda"
        >
          ←
        </ThumbButton>
        <ThumbButton
          onClick={onMoveRight}
          disabled={!canMoveRight || disabled}
          title="Mover a la derecha"
        >
          →
        </ThumbButton>
      </div>
    </div>
  </div>
)

const ThumbButton = ({ children, onClick, disabled, title, danger = false }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation()
      onClick?.()
    }}
    disabled={disabled}
    title={title}
    className="font-sans text-[var(--color-paper)] transition-opacity hover:opacity-80 disabled:opacity-30"
    style={{
      fontSize: '0.95rem',
      lineHeight: 1,
      width: '2rem',
      height: '2rem',
      display: 'grid',
      placeItems: 'center',
      backgroundColor: danger
        ? 'rgba(220, 38, 38, 0.95)'
        : 'rgba(255, 255, 255, 0.18)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
    }}
  >
    {children}
  </button>
)

import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchSetting, updateSetting } from '@/services/settings'
import {
  uploadProductImage,
  deleteProductImage,
  extractPathFromPublicUrl,
  validateImageFile,
} from '@/services/storage'
import { HERO_PLACEHOLDER } from '@/lib/placeholderImages'

const SETTING_KEY = 'hero_image'

const HeroSettings = () => {
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const inputRef = useRef(null)

  const loadSetting = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await fetchSetting(SETTING_KEY)
    if (err) setError('No se pudo cargar la configuración del Hero.')
    else setImageUrl(data?.url ?? null)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadSetting()
  }, [loadSetting])

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    clearMessages()

    const validationError = validateImageFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setUploading(true)

    // Upload new image
    const { url: newUrl, error: uploadErr } = await uploadProductImage(file)
    if (uploadErr) {
      setError(uploadErr)
      setUploading(false)
      return
    }

    // Delete old image from storage if it exists
    if (imageUrl) {
      const oldPath = extractPathFromPublicUrl(imageUrl)
      if (oldPath) deleteProductImage(oldPath).catch(() => {})
    }

    // Save to site_settings
    setSaving(true)
    const { error: saveErr } = await updateSetting(SETTING_KEY, { url: newUrl })
    setSaving(false)
    setUploading(false)

    if (saveErr) {
      setError('Imagen subida pero no se pudo guardar. Inténtalo de nuevo.')
      return
    }

    setImageUrl(newUrl)
    setSuccess('Imagen del Hero actualizada.')
  }

  const handleRestore = async () => {
    clearMessages()
    setSaving(true)

    // Delete current image from storage
    if (imageUrl) {
      const path = extractPathFromPublicUrl(imageUrl)
      if (path) deleteProductImage(path).catch(() => {})
    }

    const { error: saveErr } = await updateSetting(SETTING_KEY, { url: null })
    setSaving(false)

    if (saveErr) {
      setError('No se pudo restaurar el placeholder.')
      return
    }

    setImageUrl(null)
    setSuccess('Hero restaurado al placeholder por defecto.')
  }

  const displayUrl = imageUrl || HERO_PLACEHOLDER

  if (loading) {
    return (
      <div
        className="font-sans text-[var(--color-muted)]"
        style={{ fontSize: '0.85rem', padding: '2rem 0' }}
      >
        Cargando configuración…
      </div>
    )
  }

  return (
    <div className="flex flex-col" style={{ gap: '2.5rem', maxWidth: '48rem' }}>
      {/* Header */}
      <div>
        <span
          className="label-xs text-[var(--color-muted)]"
          style={{ letterSpacing: '0.25em' }}
        >
          Configuración
        </span>
        <h1
          className="font-serif text-[var(--color-ink)]"
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginTop: '0.5rem',
          }}
        >
          Imagen del Hero
        </h1>
        <p
          className="font-sans text-[var(--color-muted)]"
          style={{ fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.5 }}
        >
          Esta imagen aparece en la sección principal de la página de inicio.
        </p>
      </div>

      {/* Messages */}
      {error && (
        <p className="font-sans text-red-600" style={{ fontSize: '0.85rem' }}>
          {error}
        </p>
      )}
      {success && (
        <p className="font-sans text-green-700" style={{ fontSize: '0.85rem' }}>
          {success}
        </p>
      )}

      {/* Current image preview */}
      <div className="flex flex-col" style={{ gap: '1rem' }}>
        <span
          className="label-xs text-[var(--color-muted)]"
          style={{ letterSpacing: '0.25em' }}
        >
          {imageUrl ? 'Imagen actual' : 'Placeholder por defecto'}
        </span>
        <div
          className="relative overflow-hidden bg-[var(--color-surface)]"
          style={{ aspectRatio: '4/5', maxHeight: '28rem' }}
        >
          <img
            src={displayUrl}
            alt="Hero preview"
            className="h-full w-full object-cover"
          />
          {!imageUrl && (
            <span
              className="absolute top-3 left-3 bg-[var(--color-ink)] font-sans text-[var(--color-paper)]"
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                padding: '0.3rem 0.55rem',
              }}
            >
              Placeholder
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center" style={{ gap: '0.75rem' }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || saving}
          className="bg-[var(--color-ink)] font-sans text-[var(--color-paper)] transition-opacity hover:opacity-85 disabled:opacity-50"
          style={{
            padding: '0.95rem 1.5rem',
            fontSize: '0.72rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          {uploading ? 'Subiendo…' : 'Cambiar imagen'}
        </button>

        {imageUrl && (
          <button
            type="button"
            onClick={handleRestore}
            disabled={uploading || saving}
            className="font-sans text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)] disabled:opacity-50"
            style={{
              padding: '0.95rem 1.5rem',
              fontSize: '0.72rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              border: '1px solid var(--color-surface)',
            }}
          >
            Restaurar placeholder
          </button>
        )}
      </div>

      {/* Info */}
      <p
        className="font-sans text-[var(--color-muted)]"
        style={{ fontSize: '0.72rem', lineHeight: 1.6 }}
      >
        Formato recomendado: JPG o WEBP, proporción 4:5, mínimo 1400px de ancho. Máx 5 MB.
      </p>
    </div>
  )
}

export default HeroSettings

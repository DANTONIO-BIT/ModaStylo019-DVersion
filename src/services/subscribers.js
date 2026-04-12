import { supabase } from '@/lib/supabase'

// Basic email shape validation — matches the regex used in form components
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Persist a new email subscriber in Supabase.
 *
 * @param {Object} params
 * @param {string}        params.email  - Required, validated + normalized
 * @param {string|null}   params.nombre - Optional display name
 * @param {'contact'|'footer'} params.source - Origin form
 * @returns {Promise<{ ok: boolean, reason?: 'invalid'|'duplicate'|'unknown', error?: any }>}
 */
export const subscribeEmail = async ({ email, nombre = null, source = 'contact' }) => {
  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanNombre = nombre?.trim() || null

  if (!EMAIL_REGEX.test(cleanEmail)) {
    return { ok: false, reason: 'invalid' }
  }

  const { error } = await supabase
    .from('email_subscribers')
    .insert({ email: cleanEmail, nombre: cleanNombre, source })

  if (error) {
    // Postgres unique_violation — email already subscribed
    if (error.code === '23505') {
      return { ok: false, reason: 'duplicate' }
    }
    return { ok: false, reason: 'unknown', error }
  }

  return { ok: true }
}

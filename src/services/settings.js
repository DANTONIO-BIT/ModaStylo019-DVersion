import { supabase } from '@/lib/supabase'

/**
 * Fetch a single setting by key.
 * @param {string} key
 * @returns {Promise<{ data: any, error: string|null }>}
 */
export const fetchSetting = async (key) => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data?.value ?? null, error: null }
}

/**
 * Upsert a setting by key.
 * @param {string} key
 * @param {any} value  — stored as JSONB
 * @returns {Promise<{ error: string|null }>}
 */
export const updateSetting = async (key, value) => {
  const { error } = await supabase
    .from('site_settings')
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )

  return { error: error?.message ?? null }
}

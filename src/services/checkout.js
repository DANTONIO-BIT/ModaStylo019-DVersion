import { supabase } from '@/lib/supabase'

export const createCheckoutSession = async (items) => {
  const itemsForApi = items.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    talla: item.talla,
    cantidad: item.cantidad,
  }))

  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { items: itemsForApi },
  })

  if (error) {
    throw new Error(error.message || 'Error al crear sesión de checkout')
  }

  if (data?.url) {
    window.location.href = data.url
  } else {
    throw new Error('No se recibió URL de checkout')
  }
}
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, talla) => {
        const items = get().items
        const existing = items.find(
          (i) => i.id === product.id && i.talla === talla
        )

        if (existing) {
          set({
            items: items.map((i) =>
              i.id === product.id && i.talla === talla
                ? { ...i, cantidad: i.cantidad + 1 }
                : i
            ),
          })
        } else {
          set({ items: [...items, { ...product, talla, cantidad: 1 }] })
        }
      },

      removeItem: (id, talla) =>
        set({ items: get().items.filter((i) => !(i.id === id && i.talla === talla)) }),

      updateCantidad: (id, talla, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(id, talla)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id && i.talla === talla ? { ...i, cantidad } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      // Computed
      total: () =>
        get().items.reduce((sum, i) => sum + i.precio * i.cantidad, 0),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.cantidad, 0),

      // WhatsApp message builder
      buildWhatsAppMessage: () => {
        const items = get().items
        if (items.length === 0) return ''

        const lines = items.map(
          (i) => `• ${i.nombre} — Talla: ${i.talla} x${i.cantidad} (€${(i.precio * i.cantidad).toFixed(2)})`
        )

        const total = get().total()
        const msg = [
          'Hola! Me gustaría hacer un pedido:',
          '',
          ...lines,
          '',
          `Total: €${total.toFixed(2)}`,
          '',
          '¿Podéis confirmar disponibilidad?',
        ].join('\n')

        return encodeURIComponent(msg)
      },
    }),
    {
      name: 'mmj-cart',
      version: 1,
    }
  )
)

import { Hero } from '@/components/home/Hero'
import { SeccionProductos } from '@/components/home/SeccionProductos'
import { Newsletter } from '@/components/home/Newsletter'

const Home = () => (
  <main>
    <Hero />
    <SeccionProductos
      eyebrow="[01] / Novedades"
      titulo="Novedades"
      descripcion="Las ultimas incorporaciones a nuestra coleccion"
      orden="novedad"
      limit={4}
    />
    <SeccionProductos
      eyebrow="[02] / Favoritos"
      titulo="Mas Vendidos"
      descripcion="Las piezas que mas quieren nuestras clientas"
      orden="mas_vendidos"
      limit={4}
    />
    <Newsletter />
  </main>
)

export default Home

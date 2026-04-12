import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { CartDrawer } from '@/components/carrito/CartDrawer'
import { PageTransition } from '@/components/layout/PageTransition'
import { CustomCursor } from '@/components/ui/CustomCursor'

const Layout = () => (
  <>
    <Header />
    <main>
      <PageTransition />
    </main>
    <Footer />
    <MobileMenu />
    <WhatsAppButton />
    <CartDrawer />
    <CustomCursor />
  </>
)

export default Layout

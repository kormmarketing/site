import { useState } from 'react'
import Privacy from './components/Privacy/Privacy'
import DentalPromo from './components/Dental/DentalPromo'
import FurniturePromo from './components/Furniture/FurniturePromo'
import Promo from './components/Promo/Promo'
import NotFound from './components/NotFound/NotFound'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useLenis } from './hooks/useLenis'
import { useScrollProgress } from './hooks/useScrollProgress'

import Loader   from './components/Loader/Loader'
import Cursor   from './components/Cursor/Cursor'
import Nav      from './components/Nav/Nav'
import Hero     from './components/Hero/Hero'
import Marquee  from './components/Marquee/Marquee'
import Services from './components/Services/Services'
import Portfolio from './components/Portfolio/Portfolio'
import Automation from './components/Automation/Automation'
import Process from './components/Process/Process'
import About   from './components/About/About'
import CTA      from './components/CTA/CTA'
import Contact  from './components/Contact/Contact'
import Footer   from './components/Footer/Footer'

gsap.registerPlugin(ScrollTrigger)

// Известные роуты — всё остальное → 404
const KNOWN_ROUTES = ['/', '/privacy', '/dental-promo2026', '/furniture-promo2026', '/promo2026']

export default function App() {
  const path = window.location.pathname
  if (path === '/privacy') return <Privacy />
  if (path === '/dental-promo2026') return <DentalPromo />
  if (path === '/furniture-promo2026') return <FurniturePromo />
  if (path === '/promo2026') return <Promo />
  if (!KNOWN_ROUTES.includes(path)) return <NotFound />

  const [loading, setLoading] = useState(true)

  useLenis()
  const progress = useScrollProgress()

  const handleLoaderComplete = () => {
    setLoading(false)
    // Give DOM time to paint then refresh ScrollTrigger
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }

  return (
    <>
      {loading && <Loader onComplete={handleLoaderComplete} />}

      {/* Scroll progress bar */}
      <div
        className="scroll-progress"
        style={{ width: `${progress}%` }}
      />

      {/* Gradient orbs background */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* Custom cursor (desktop only, hidden during loader) */}
      {!loading && <Cursor />}

      {/* Page content */}
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Portfolio />
        <Process />
        <About />
        <CTA />
        <Automation />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

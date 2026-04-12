import { useState } from 'react'
import Privacy from './components/Privacy/Privacy'
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

export default function App() {
  if (window.location.pathname === '/privacy') return <Privacy />

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

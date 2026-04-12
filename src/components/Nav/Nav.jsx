import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const NAV_LINKS = [
  { label: 'Услуги',   href: '#услуги'    },
  { label: 'Работы',   href: '#портфолио' },
  { label: 'Процесс',  href: '#процесс'   },
  { label: 'Обо мне',  href: '#обо мне'       },
  { label: 'Автоматизация', href: '#автоматизация' },
  { label: 'Контакт',  href: '#контакт'       },
]

function scrollTo(href) {
  const target = document.querySelector(href)
  if (!target) return
  if (window.__lenis) window.__lenis.scrollTo(target, { offset: -72, duration: 1.2 })
  else target.scrollIntoView({ behavior: 'smooth' })
}

// ── Desktop NavLink ───────────────────────────────────────────────────
function NavLink({ href, label, onNavigate }) {
  const [hovered, setHovered] = useState(false)
  const lineRef = useRef(null)

  const handleEnter = () => {
    setHovered(true)
    gsap.fromTo(lineRef.current,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.3, ease: 'power2.out' },
    )
  }
  const handleLeave = () => {
    setHovered(false)
    gsap.to(lineRef.current, {
      scaleX: 0, transformOrigin: 'right center',
      duration: 0.2, ease: 'power2.in',
    })
  }

  return (
    <a
      href={href}
      onClick={(e) => { e.preventDefault(); scrollTo(href); onNavigate?.() }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        display: 'flex', flexDirection: 'column', gap: '4px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        fontWeight: 400,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: hovered ? '#FFFFFF' : '#A0A0A0',
        textDecoration: 'none',
        transition: 'color 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{label}</span>
      <span
        ref={lineRef}
        style={{
          display: 'block', height: '2px', width: '100%',
          background: 'linear-gradient(90deg, #6366F1, #06B6D4)',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
        }}
      />
    </a>
  )
}

// ── Main ──────────────────────────────────────────────────────────────
export default function Nav() {
  const headerRef = useRef(null)
  const dotRef    = useRef(null)
  const line1Ref  = useRef(null)
  const line2Ref  = useRef(null)
  const line3Ref  = useRef(null)
  const menuRef   = useRef(null)
  const linkRefs  = useRef([])
  const menuBottomRef = useRef(null)

  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled  = useRef(false)

  // ── Scroll: glassmorphism header ──────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > 60
      if (past === scrolled.current) return
      scrolled.current = past
      gsap.to(headerRef.current, {
        backgroundColor: past ? 'rgba(5,5,5,0.9)' : 'rgba(5,5,5,0)',
        backdropFilter:   past ? 'blur(20px)'      : 'blur(0px)',
        borderBottomColor: past ? '#1E1E1E'        : 'rgba(30,30,30,0)',
        duration: 0.4, ease: 'power2.out',
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Dot pulse ────────────────────────────────────────────────────
  useEffect(() => {
    gsap.to(dotRef.current, {
      scale: 1.4, duration: 1, repeat: -1, yoyo: true,
      ease: 'sine.inOut',
    })
  }, [])

  // ── Burger / menu toggle ──────────────────────────────────────────
  useEffect(() => {
    if (menuOpen) {
      // burger → cross
      gsap.to(line1Ref.current, { rotate: 45,  y: 7,  duration: 0.3, ease: 'power2.inOut' })
      gsap.to(line2Ref.current, { opacity: 0,          duration: 0.15 })
      gsap.to(line3Ref.current, { rotate: -45, y: -7, duration: 0.3, ease: 'power2.inOut' })

      gsap.fromTo(menuRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.3, ease: 'power2.out' },
      )
      gsap.fromTo(
        [...linkRefs.current, menuBottomRef.current].filter(Boolean),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, delay: 0.05, ease: 'power3.out' },
      )
    } else {
      // cross → burger
      gsap.to(line1Ref.current, { rotate: 0, y: 0, duration: 0.3, ease: 'power2.inOut' })
      gsap.to(line2Ref.current, { opacity: 1, duration: 0.15, delay: 0.1 })
      gsap.to(line3Ref.current, { rotate: 0, y: 0, duration: 0.3, ease: 'power2.inOut' })
      gsap.to(menuRef.current,  { autoAlpha: 0, duration: 0.25, ease: 'power2.in' })
    }
  }, [menuOpen])

  const closeMenu = (href) => {
    setMenuOpen(false)
    if (href) setTimeout(() => scrollTo(href), 320)
  }

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header
        ref={headerRef}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 102,
          backgroundColor: 'rgba(5,5,5,0)',
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
          borderBottom: '1px solid rgba(30,30,30,0)',
          height: '72px',
        }}
      >
        <div style={{
          width: '100%',
          padding: '0 6%', height: '72px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }} className="nav-inner">

          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); scrollTo('#hero') }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2px',
              textDecoration: 'none', userSelect: 'none', flexShrink: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '22px', fontWeight: 700, color: '#FFFFFF',
                letterSpacing: '-0.01em', lineHeight: 1,
              }}>
                КОРМ
              </span>
              <span
                ref={dotRef}
                style={{
                  display: 'inline-block',
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
                }}
              />
            </div>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px', color: '#6366F1',
              letterSpacing: '0.1em', lineHeight: 1,
            }}>
              маркетинг
            </span>
          </a>

          {/* Desktop nav */}
          <nav style={{
            display: 'flex', alignItems: 'center', gap: '40px',
          }} className="nav-desktop">
            {NAV_LINKS.map(link => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>

          {/* CTA button */}
          <a
            href="#контакт"
            data-cursor="button"
            onClick={(e) => { e.preventDefault(); scrollTo('#контакт') }}
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '12px 28px', borderRadius: '100px',
              background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px', fontWeight: 500,
              textDecoration: 'none', border: 'none',
              whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'all 0.3s',
            }}
            className="nav-cta"
            onMouseEnter={e => gsap.to(e.currentTarget, {
              scale: 1.04,
              boxShadow: '0 0 28px rgba(99,102,241,0.21)',
              duration: 0.25,
            })}
            onMouseLeave={e => gsap.to(e.currentTarget, {
              scale: 1,
              boxShadow: '0 0 0px rgba(99,102,241,0)',
              duration: 0.25,
            })}
          >
            Начать проект →
          </a>

          {/* Burger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            style={{
              display: 'none', flexDirection: 'column', justifyContent: 'center',
              gap: '5px', width: '32px', height: '32px',
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
              flexShrink: 0,
            }}
            className="nav-burger"
          >
            <span ref={line1Ref} style={{
              display: 'block', height: '1.5px', width: '24px',
              background: '#FFFFFF', borderRadius: '2px',
            }} />
            <span ref={line2Ref} style={{
              display: 'block', height: '1.5px', width: '24px',
              background: '#FFFFFF', borderRadius: '2px',
            }} />
            <span ref={line3Ref} style={{
              display: 'block', height: '1.5px', width: '24px',
              background: '#FFFFFF', borderRadius: '2px',
            }} />
          </button>
        </div>
      </header>

      {/* ── Mobile fullscreen menu ──────────────────────────────────── */}
      <div
        ref={menuRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 101,
          background: '#050505',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          visibility: 'hidden', opacity: 0,
        }}
      >
        <nav style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '18px',
        }}>
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              ref={el => (linkRefs.current[i] = el)}
              href={link.href}
              onClick={(e) => { e.preventDefault(); closeMenu(link.href) }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 600,
                color: '#FFFFFF', textDecoration: 'none',
                lineHeight: 1.15, opacity: 0,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#6366F1')}
              onMouseLeave={e => (e.currentTarget.style.color = '#FFFFFF')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Bottom: Telegram + location */}
        <div
          ref={menuBottomRef}
          style={{
            position: 'absolute', bottom: '40px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '12px',
            opacity: 0,
          }}
        >
          <a
            href="https://t.me/korm_marketing"
            target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px', color: '#6366F1',
              textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6366F1')}
          >
            Telegram
          </a>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px', color: '#3A3A3A',
            letterSpacing: '0.06em',
          }}>
            Серпухов · МО
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .nav-desktop { display: none !important; }
          .nav-cta     { display: none !important; }
          .nav-burger  { display: flex !important; }
        }
        @media (max-width: 600px) {
          .nav-inner { padding: 0 24px !important; }
        }
      `}</style>
    </>
  )
}

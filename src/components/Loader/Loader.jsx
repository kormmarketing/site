import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export default function Loader({ onComplete }) {
  const containerRef = useRef(null)
  const logoRef      = useRef(null)
  const subRef       = useRef(null)
  const barRef       = useRef(null)
  const dotRef       = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // 1. Logo slides in
    tl.fromTo(logoRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }
    )
    // 2. Sub-text
    tl.fromTo(subRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35 },
      '-=0.2'
    )
    // 3. Progress bar fills
    tl.fromTo(barRef.current,
      { scaleX: 0, transformOrigin: 'left' },
      { scaleX: 1, duration: 1.1, ease: 'power2.inOut' },
      '-=0.1'
    )
    // 4. Brief pause then slide up
    tl.to(containerRef.current, {
      yPercent: -105,
      duration: 0.75,
      ease: 'power4.inOut',
      delay: 0.25,
      onComplete,
    })

    return () => tl.kill()
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050505',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '28px',
      }}
    >
      {/* Logo */}
      <div ref={logoRef} style={{ opacity: 0, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '36px',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
          }}>
            КОРМ
          </span>
          <span
            ref={dotRef}
            style={{
              width: '8px', height: '8px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #6366F1, #06B6D4)',
              flexShrink: 0,
            }}
          />
        </div>
        <p
          ref={subRef}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: '#6366F1',
            marginTop: '6px',
            letterSpacing: '0.06em',
            opacity: 0,
          }}
        >
          маркетинг
        </p>
      </div>

      {/* Progress bar */}
      <div style={{
        width: '180px',
        height: '2px',
        background: '#1E1E1E',
        borderRadius: '1px',
        overflow: 'hidden',
      }}>
        <div
          ref={barRef}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #06B6D4)',
            transformOrigin: 'left',
            transform: 'scaleX(0)',
          }}
        />
      </div>
    </div>
  )
}

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'

// ─────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────
const COLS = 120
const ROWS = 80
const COUNT = COLS * ROWS
const INFLUENCE_R = 2.5
const TYPEWRITER_TEXT = '< Серпухов · МО · Корм Маркетинг />'

// Pre-computed accent color channels
const BR = 0x1e / 255, BG = 0x1e / 255, BB = 0x1e / 255 // #1E1E1E
const AR = 0x63 / 255, AG = 0x66 / 255, AB = 0xf1 / 255 // #6366F1

// ─────────────────────────────────────────────────────────────────
// Three.js particle grid
// ─────────────────────────────────────────────────────────────────
function ParticleGrid() {
  const meshRef = useRef(null)
  const { viewport } = useThree()
  const mouseWorld = useRef({ x: -9999, y: -9999 })

  // Spacing to cover the full viewport + a little margin
  const sX = (viewport.width  * 1.06) / (COLS - 1)
  const sY = (viewport.height * 1.06) / (ROWS - 1)

  // Allocate all typed arrays once; recalculate origins when spacing changes
  const arrays = useMemo(() => {
    const pos  = new Float32Array(COUNT * 3)
    const col  = new Float32Array(COUNT * 3)
    const orig = new Float32Array(COUNT * 3)
    const vel  = new Float32Array(COUNT * 3)

    const totalW = (COLS - 1) * sX
    const totalH = (ROWS - 1) * sY

    let i = 0
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = c * sX - totalW / 2
        const y = r * sY - totalH / 2
        orig[i] = pos[i] = x
        orig[i + 1] = pos[i + 1] = y
        orig[i + 2] = pos[i + 2] = 0
        col[i] = BR; col[i + 1] = BG; col[i + 2] = BB
        i += 3
      }
    }
    return { pos, col, orig, vel }
  }, [sX, sY])

  // Mouse → world coordinates
  useEffect(() => {
    const onMove = (e) => {
      mouseWorld.current = {
        x:  (e.clientX / window.innerWidth  - 0.5) * viewport.width,
        y: -(e.clientY / window.innerHeight - 0.5) * viewport.height,
      }
    }
    const onLeave = () => { mouseWorld.current = { x: -9999, y: -9999 } }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [viewport])

  // InstancedMesh refs for direct matrix buffer access (faster than setMatrixAt loop)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const colObj = useMemo(() => new THREE.Color(), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t   = clock.getElapsedTime()
    const { pos, col, orig, vel } = arrays
    const mx  = mouseWorld.current.x
    const my  = mouseWorld.current.y
    const mesh = meshRef.current

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      const ox = orig[i3], oy = orig[i3 + 1]

      // Slow wave target
      const tx = ox + Math.cos(oy * 1.5 + t * 0.45) * 0.03
      const ty = oy + Math.sin(ox * 1.5 + t * 0.65) * 0.05

      // Mouse attraction
      const dx = mx - pos[i3]
      const dy = my - pos[i3 + 1]
      const dist2 = dx * dx + dy * dy
      let fx = 0, fy = 0
      if (dist2 < INFLUENCE_R * INFLUENCE_R) {
        const dist = Math.sqrt(dist2)
        const f = (1 - dist / INFLUENCE_R) * 0.22
        fx = dx * f
        fy = dy * f
      }

      // Spring integration (velocity verlet-lite)
      vel[i3]     = (vel[i3]     + (tx + fx - pos[i3])     * 0.1) * 0.78
      vel[i3 + 1] = (vel[i3 + 1] + (ty + fy - pos[i3 + 1]) * 0.1) * 0.78
      pos[i3]     += vel[i3]
      pos[i3 + 1] += vel[i3 + 1]

      // Update instance transform
      dummy.position.set(pos[i3], pos[i3 + 1], 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      // Color: interpolate based on displacement from origin
      const dispX = pos[i3] - ox, dispY = pos[i3 + 1] - oy
      const disp  = Math.sqrt(dispX * dispX + dispY * dispY)
      const blend = Math.min(disp * 5.5, 1)
      colObj.setRGB(
        BR + (AR - BR) * blend,
        BG + (AG - BG) * blend,
        BB + (AB - BB) * blend,
      )
      mesh.setColorAt(i, colObj)
    }

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
      <sphereGeometry args={[0.015, 6, 4]} />
      <meshBasicMaterial vertexColors={true} />
    </instancedMesh>
  )
}

// ─────────────────────────────────────────────────────────────────
// Hero content
// ─────────────────────────────────────────────────────────────────
const STATS = [
  { value: '27', label: 'проектов в портфолио' },
  { value: '5 лет', label: 'в digital' },
  { value: 'МО', label: 'Серпухов и область' },
]

const SUB_WORDS = 'Сайты · Реклама · Автоматизация · ИИ'.split(' ')

export default function Hero() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  const [glSupported, setGlSupported] = useState(true)

  // Update isMobile on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Check WebGL support once
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2')
      setGlSupported(!!gl)
    } catch {
      setGlSupported(false)
    }
  }, [])

  // Typewriter
  const [typed, setTyped]   = useState('')
  const [twDone, setTwDone] = useState(false)

  // GSAP refs
  const wrap1 = useRef(null), wrap2 = useRef(null), wrap3 = useRef(null)
  const wordRefs    = useRef([])
  const counterRefs = useRef([])
  const btnsRef     = useRef(null)

  // ── Typewriter ──────────────────────────────────────────────────
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      setTyped(TYPEWRITER_TEXT.slice(0, i))
      if (i >= TYPEWRITER_TEXT.length) { clearInterval(id); setTwDone(true) }
    }, 40)
    return () => clearInterval(id)
  }, [])

  // ── GSAP reveal timeline ────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.25 })

    // H1 lines slide up from overflow-hidden containers
    tl.fromTo(
      [wrap1.current, wrap2.current, wrap3.current],
      { y: 110, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.95, stagger: 0.2, ease: 'power4.out' },
    )
    // Sub-words stagger
    .fromTo(
      wordRefs.current.filter(Boolean),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power2.out' },
      '-=0.45',
    )
    // Counters slide in from right
    .fromTo(
      counterRefs.current.filter(Boolean),
      { x: 18, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.45, stagger: 0.1, ease: 'power2.out' },
      '<',
    )
    // Buttons
    .fromTo(
      btnsRef.current,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.2',
    )

    return () => tl.kill()
  }, [])

  // ── WhatsApp hover handlers ──────────────────────────────────────
  const waEnter = (e) => {
    e.currentTarget.style.borderColor = '#6366F1'
    e.currentTarget.style.boxShadow   = '0 0 18px rgba(99,102,241,0.22)'
  }
  const waLeave = (e) => {
    e.currentTarget.style.borderColor = '#1E1E1E'
    e.currentTarget.style.boxShadow   = 'none'
  }

  return (
    <section
      id="hero"
      className="hero-section"
      style={{
        position: 'relative',
        height: isMobile ? 'auto' : '100vh',
        minHeight: isMobile ? 'auto' : undefined,
        paddingTop: isMobile ? '100px' : undefined,
        paddingBottom: isMobile ? '60px' : undefined,
        background: '#050505',
        overflow: 'hidden',
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
      }}
    >
      {/* ── Background ──────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {isMobile || !glSupported ? (
          <div style={{
            width: '100%', height: '100%',
            background: 'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(99,102,241,0.12) 0%, transparent 60%), #050505',
          }} />
        ) : (
          <Canvas
            camera={{ fov: 75, near: 0.1, far: 100, position: [0, 0, 5] }}
            gl={{ antialias: false, alpha: false, failIfMajorPerformanceCaveat: false }}
            style={{ background: '#050505' }}
            onCreated={({ gl }) => {
              gl.setClearColor('#050505')
            }}
          >
            <ParticleGrid />
          </Canvas>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div
        style={{ position: 'relative', zIndex: 1, paddingTop: 'clamp(16px, 4vw, 64px)', width: '100%', paddingLeft: '6%', paddingRight: '6%' }}
      >

        {/* Typewriter tag */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px',
            color: '#6366F1',
            marginBottom: '36px',
            minHeight: '20px',
            letterSpacing: '0.02em',
          }}
        >
          {typed}
          <span
            style={{
              animation: 'blink 0.9s step-end infinite',
              opacity: twDone ? 1 : 1,
              marginLeft: '1px',
            }}
          >
            |
          </span>
        </div>

        {/* ── H1 three lines ──────────────────────────────────── */}
        <div style={{ marginBottom: '44px' }}>

          {/* Line 1 — semantic H1 */}
          <div style={{ overflow: 'hidden' }}>
            <div ref={wrap1} style={{ opacity: 0 }}>
              <h1
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(36px, 6.5vw, 160px)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  lineHeight: 1.05,
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                Делаем бизнес
              </h1>
            </div>
          </div>

          {/* Line 2 */}
          <div style={{ overflow: 'hidden' }}>
            <div ref={wrap2} style={{ opacity: 0 }}>
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(36px, 6.5vw, 160px)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  lineHeight: 1.05,
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                заметным
              </p>
            </div>
          </div>

          {/* Line 3 — "в" white + "интернете" gradient + SVG underline */}
          <div style={{ overflow: 'hidden' }}>
            <div ref={wrap3} style={{ opacity: 0 }}>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(36px, 6.5vw, 160px)',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.05,
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                в{' '}
                <span
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #06B6D4)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gradientShift 3s ease infinite',
                  }}
                >
                  интернете
                </span>
              </p>

              {/* Animated SVG underline */}
              <svg
                viewBox="0 0 500 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  display: 'block',
                  width: 'clamp(200px, 32vw, 800px)',
                  height: '8px',
                  marginTop: '2px',
                }}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="ulGrad" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                    <stop offset="0%"   stopColor="#6366F1" />
                    <stop offset="60%"  stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                <path
                  d="M 2 5 Q 250 1 498 5"
                  stroke="url(#ulGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    strokeDasharray: 520,
                    strokeDashoffset: 520,
                    animation: 'drawLine 1s cubic-bezier(0.4,0,0.2,1) forwards 1.3s',
                  }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Two columns ─────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            gap: '60px',
            marginBottom: '40px',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          {/* Left: words */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px 6px',
              maxWidth: '320px',
              alignItems: 'center',
            }}
          >
            {SUB_WORDS.map((word, i) => (
              <span
                key={i}
                ref={(el) => (wordRefs.current[i] = el)}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  color: '#A0A0A0',
                  opacity: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Right: counters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {STATS.map((s, i) => (
              <div
                key={i}
                ref={(el) => (counterRefs.current[i] = el)}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px',
                  color: '#A0A0A0',
                  opacity: 0,
                  letterSpacing: '0.02em',
                }}
              >
                <span style={{ color: '#6366F1' }}>[ {s.value} ]</span>
                {' '}
                {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Buttons ─────────────────────────────────────────── */}
        <div
          ref={btnsRef}
          style={{
            display: 'flex',
            gap: '14px',
            alignItems: 'center',
            flexWrap: 'wrap',
            opacity: 0,
          }}
        >
          {/* Primary */}
          <a
            href="#портфолио"
            data-cursor="button"
            onClick={(e) => { e.preventDefault(); window.__lenis?.scrollTo('#портфолио', { duration: 1.2 }) }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 30px',
              borderRadius: '100px',
              background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              border: 'none',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.2, ease: 'power2.out' })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1,    duration: 0.2, ease: 'power2.out' })}
          >
            Смотреть работы ↓
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/korm_marketing"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 30px',
              borderRadius: '100px',
              background: 'transparent',
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              border: '1px solid #1E1E1E',
              transition: 'border-color 0.25s, box-shadow 0.25s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={waEnter}
            onMouseLeave={waLeave}
          >
            Telegram →
          </a>
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────── */}
      <div
        className="hero-scroll-indicator"
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          zIndex: 1,
        }}
      >
        {/* Line */}
        <div
          style={{
            width: '2px',
            height: '56px',
            background: '#1E1E1E',
            borderRadius: '1px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: '#6366F1',
              animation: 'scrollFill 1.6s ease-in-out infinite',
            }}
          />
        </div>
        {/* Label */}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            color: '#A0A0A0',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            transform: 'rotate(90deg)',
            transformOrigin: 'center',
            marginLeft: '28px',
          }}
        >
          scroll
        </span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-scroll-indicator { display: none !important; }
        }
      `}</style>
    </section>
  )
}

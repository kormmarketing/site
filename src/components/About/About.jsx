import { useRef, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { gsap } from 'gsap'

const STATS = [
  { value: '3+',  label: 'года в digital' },
  { value: '27',  label: 'проектов'       },
  { value: '24/7', label: 'на связи'      },
]

const STACK = [
  'HTML', 'CSS', 'JavaScript', 'React',
  'Python', 'GSAP', 'Three.js', 'Директ', 'GPT API', 'n8n',
]


export default function About() {
  const labelRef   = useRef(null)
  const titleRef   = useRef(null)
  const textRefs   = useRef([])
  const statsRefs  = useRef([])
  const stackRefs  = useRef([])

  const { ref: sectionRef, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  // ── GSAP reveals ───────────────────────────────────────────────
  useEffect(() => {
    if (!inView) return

    const tl = gsap.timeline()

    tl.fromTo(labelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })
    tl.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' },
      '-=0.2',
    )
    tl.fromTo(
      textRefs.current.filter(Boolean),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.12, ease: 'power2.out' },
      '-=0.4',
    )
    tl.fromTo(
      statsRefs.current.filter(Boolean),
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.1, ease: 'power2.out' },
      '-=0.3',
    )
    tl.fromTo(
      stackRefs.current.filter(Boolean),
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.35, stagger: 0.05, ease: 'back.out(1.7)' },
      '-=0.25',
    )
  }, [inView])

  return (
    <section
      id="обо мне"
      ref={sectionRef}
      style={{ background: '#050505', padding: '120px 0', position: 'relative', zIndex: 1 }}
    >
      <div style={{
        width: '100%', padding: '0 6%',
        display: 'grid',
        gridTemplateColumns: '45fr 55fr',
        gap: '64px',
        alignItems: 'center',
      }} className="about-grid">

        {/* ── Left: visual block ───────────────────────────── */}
        <div style={{
          width: '100%', height: '520px',
          background: 'linear-gradient(160deg, #0F0F1A, #0A141F)',
          borderRadius: '20px',
          border: '1px solid #1E1E1E',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          {/* Background photo */}
          <img
            src="/about-photo.png"
            alt="Роман — специалист по digital-маркетингу, КОРМ Маркетинг, Серпухов"
            loading="lazy"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />

          {/* Gradient overlay at bottom for stats */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '200px',
            background: 'linear-gradient(to top, #0A141F 30%, transparent)',
          }} />

          {/* Stats */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            padding: '28px',
            gap: '8px',
          }}>
            {STATS.map((s, i) => (
              <div
                key={s.value}
                ref={el => (statsRefs.current[i] = el)}
                style={{
                  textAlign: 'center',
                  opacity: 0,
                  borderRight: i < STATS.length - 1 ? '1px solid #1E1E1E' : 'none',
                }}
              >
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '48px', fontWeight: 700,
                  color: '#6366F1',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px', color: '#A0A0A0',
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: text ───────────────────────────────────── */}
        <div>
          <p
            ref={labelRef}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px', color: '#6366F1',
              marginBottom: '20px', opacity: 0, letterSpacing: '0.04em',
            }}
          >
            {'< привет_мир />'}
          </p>

          <div style={{ overflow: 'hidden', marginBottom: '28px' }}>
            <h2
              ref={titleRef}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(32px, 3.5vw, 48px)',
                fontWeight: 700, color: '#FFFFFF',
                margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1, opacity: 0,
              }}
            >
              Строю то что<br />приносит клиентов
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
            {[
              'Специализируюсь на комплексном digital-продвижении малого бизнеса — от сайта до настроенной рекламы.',
              'Живу в Серпухове, знаю локальный рынок. Работаю по всей МО и удалённо по России.',
              'Не просто делаю сайты — строю системы которые генерируют заявки каждый день.',
            ].map((text, i) => (
              <p
                key={i}
                ref={el => (textRefs.current[i] = el)}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px', color: '#A0A0A0',
                  lineHeight: 1.7, margin: 0, opacity: 0,
                }}
              >
                {text}
              </p>
            ))}
          </div>

          {/* Tech stack */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {STACK.map((tag, i) => (
              <span
                key={tag}
                ref={el => (stackRefs.current[i] = el)}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px', color: '#A0A0A0',
                  border: '1px solid #1E1E1E',
                  borderRadius: '100px',
                  padding: '6px 14px',
                  cursor: 'default',
                  transition: 'border-color 0.2s, color 0.2s',
                  opacity: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#6366F1'
                  e.currentTarget.style.color = '#FFFFFF'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#1E1E1E'
                  e.currentTarget.style.color = '#A0A0A0'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
          .about-grid > div:first-child {
            height: 360px !important;
          }
        }
      `}</style>
    </section>
  )
}

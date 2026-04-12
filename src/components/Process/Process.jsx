import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useInView } from 'react-intersection-observer'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { num: '01', side: 'left',  title: 'БРИФ',        desc: 'Созваниваемся и разбираем задачу.',                        time: '30 минут'  },
  { num: '02', side: 'right', title: 'СТРАТЕГИЯ',    desc: 'Предлагаю структуру и каналы.',                           time: '1 день'    },
  { num: '03', side: 'left',  title: 'РАЗРАБОТКА',   desc: 'Делаю и показываю промежуточно.',                         time: '3–5 дней'  },
  { num: '04', side: 'right', title: 'ЗАПУСК',       desc: 'Публикуем, тестируем, настраиваем аналитику.',            time: '1 день'    },
  { num: '05', side: 'left',  title: 'РЕЗУЛЬТАТ',    desc: 'Отчёт, корректировки, поддержка.',                        time: 'ongoing'   },
]

export default function Process() {
  const lineRef   = useRef(null)
  const lineWrap  = useRef(null)
  const cardRefs  = useRef([])
  const labelRef  = useRef(null)
  const titleRef  = useRef(null)

  const { ref: headerRef, inView } = useInView({ triggerOnce: true, threshold: 0.4 })

  // Header reveal
  useEffect(() => {
    if (!inView) return
    gsap.fromTo(labelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })
    gsap.fromTo(titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', delay: 0.15 },
    )
  }, [inView])

  // Gradient line draws while scrolling through timeline
  useEffect(() => {
    const line = lineRef.current
    const wrap = lineWrap.current
    if (!line || !wrap) return

    gsap.fromTo(line,
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 65%',
          end: 'bottom 35%',
          scrub: 0.8,
        },
      },
    )
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  // Card slide-in from sides
  useEffect(() => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const fromLeft = STEPS[i].side === 'left'
      gsap.fromTo(el,
        { x: fromLeft ? -80 : 80, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 84%', toggleActions: 'play none none none' },
        },
      )
    })
  }, [])

  return (
    <section
      id="процесс"
      style={{ background: '#0F0F0F', padding: '120px 0', position: 'relative', zIndex: 1 }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* ── Header ─────────────────────────────────────────── */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '80px' }}>
          <p
            ref={labelRef}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px', color: '#6366F1',
              marginBottom: '20px', opacity: 0, letterSpacing: '0.04em',
            }}
          >
            // 03 процесс
          </p>
          <div style={{ overflow: 'hidden' }}>
            <h2
              ref={titleRef}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 700, color: '#FFFFFF',
                margin: 0, letterSpacing: '-0.02em', lineHeight: 1.05, opacity: 0,
              }}
            >
              Как я работаю
            </h2>
          </div>
        </div>

        {/* ── Timeline ──────────────────────────────────────── */}
        <div
          ref={lineWrap}
          style={{ position: 'relative' }}
          className="process-timeline"
        >

          {/* Center vertical line */}
          <div style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0,
            width: '2px', transform: 'translateX(-50%)',
            background: '#1E1E1E', zIndex: 0,
          }}>
            <div
              ref={lineRef}
              style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(180deg, #6366F1, #8B5CF6 50%, #06B6D4)',
                transformOrigin: 'top center', transform: 'scaleY(0)',
              }}
            />
          </div>

          {STEPS.map((step, i) => (
            <div
              key={step.num}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 48px 1fr',
                gap: '0 32px',
                alignItems: 'center',
                paddingBottom: i < STEPS.length - 1 ? '60px' : '0',
                position: 'relative', zIndex: 1,
              }}
              className="process-row"
            >

              {/* Left slot */}
              <div className="slot-left" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {step.side === 'left' && (
                  <div
                    ref={el => (cardRefs.current[i] = el)}
                    style={{
                      maxWidth: '460px', width: '100%',
                      background: '#0A0A0A',
                      border: '1px solid #1E1E1E',
                      borderRadius: '12px', padding: '32px',
                      opacity: 0,
                    }}
                  >
                    <StepCard step={step} />
                  </div>
                )}
              </div>

              {/* Dot */}
              <div className="slot-dot" style={{
                width: '48px', height: '48px', flexShrink: 0,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(99,102,241,0.4)',
                zIndex: 2, position: 'relative',
              }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '15px', fontWeight: 700, color: '#FFFFFF',
                }}>
                  {step.num}
                </span>
              </div>

              {/* Right slot */}
              <div className="slot-right" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                {step.side === 'right' && (
                  <div
                    ref={el => (cardRefs.current[i] = el)}
                    style={{
                      maxWidth: '460px', width: '100%',
                      background: '#0A0A0A',
                      border: '1px solid #1E1E1E',
                      borderRadius: '12px', padding: '32px',
                      opacity: 0,
                    }}
                  >
                    <StepCard step={step} />
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .process-timeline { padding-left: 0 !important; }
          /* Line shifts to left edge */
          .process-timeline > div[style*="absolute"] {
            left: 23px !important;
          }
          .process-row {
            grid-template-columns: 48px 1fr !important;
            gap: 0 16px !important;
          }
          /* Dot always column 1 */
          .process-row .slot-dot {
            grid-column: 1 !important;
            grid-row: 1 !important;
          }
          /* Left-side card → column 2 */
          .process-row .slot-left {
            grid-column: 2 !important;
            grid-row: 1 !important;
            justify-content: flex-start !important;
          }
          /* Right-side card → column 2 */
          .process-row .slot-right {
            grid-column: 2 !important;
            grid-row: 1 !important;
          }
          /* Hide whichever slot is empty (the one that wasn't repositioned above the other) */
          .process-row .slot-left:not(:has(*)),
          .process-row .slot-right:not(:has(*)) {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}

function StepCard({ step }) {
  return (
    <>
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px', color: '#6366F1',
        letterSpacing: '0.14em', marginBottom: '12px',
      }}>
        {step.title}
      </p>
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '15px', color: '#FFFFFF',
        lineHeight: 1.65, margin: '0 0 18px',
      }}>
        {step.desc}
      </p>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '12px', color: '#A0A0A0',
        background: '#111111',
        border: '1px solid #1E1E1E',
        borderRadius: '100px',
        padding: '4px 14px',
        display: 'inline-block',
      }}>
        ⏱ {step.time}
      </span>
    </>
  )
}

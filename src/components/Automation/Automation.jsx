import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ── SVG Icons ────────────────────────────────────────────────────────
const IconTelegram = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)
const IconMessage = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)
const IconCRM = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
    <line x1="12" y1="7" x2="5" y2="17" /><line x1="12" y1="7" x2="19" y2="17" />
  </svg>
)
const IconBell = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)
const IconBrain = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="3" x2="12" y2="9" /><line x1="12" y1="15" x2="12" y2="21" />
    <line x1="3" y1="12" x2="9" y2="12" /><line x1="15" y1="12" x2="21" y2="12" />
    <line x1="5.64" y1="5.64" x2="9.17" y2="9.17" /><line x1="14.83" y1="14.83" x2="18.36" y2="18.36" />
    <line x1="5.64" y1="18.36" x2="9.17" y2="14.83" /><line x1="14.83" y1="9.17" x2="18.36" y2="5.64" />
  </svg>
)
const IconWave = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

// ── Data ─────────────────────────────────────────────────────────────
const TERMINAL_LINES = [
  { delay: 0,     icon: null, time: null,    text: '─── Система запущена ───────────────────', color: '#3A3A3A', isSep: true },
  { delay: 800,   icon: '►',  time: '23:47', text: 'Новое сообщение в Telegram от Алексея',   color: '#06B6D4' },
  { delay: 1600,  icon: '⚡', time: '23:47', text: 'Бот анализирует запрос...',                color: '#6366F1' },
  { delay: 2400,  icon: '✓',  time: '23:47', text: 'Бот ответил за 2.3 секунды',              color: '#10B981' },
  { delay: 3200,  icon: '⚡', time: '23:47', text: 'Создаю заявку в CRM...',                  color: '#6366F1' },
  { delay: 4000,  icon: '✓',  time: '23:47', text: 'Заявка #2847 создана автоматически',      color: '#10B981' },
  { delay: 4800,  icon: '🔔', time: '23:48', text: 'Уведомление отправлено менеджеру',        color: '#F59E0B' },
  { delay: 5600,  icon: '⚡', time: '23:48', text: 'Проверяю свободное время в расписании...', color: '#6366F1' },
  { delay: 6400,  icon: '✓',  time: '23:48', text: 'Найден слот: завтра 14:00',               color: '#10B981' },
  { delay: 7200,  icon: '✓',  time: '23:49', text: 'Клиент получил подтверждение записи',    color: '#10B981' },
  { delay: 8000,  icon: '🔔', time: '23:49', text: 'Напоминание запланировано на 13:00',      color: '#F59E0B' },
  { delay: 8800,  icon: null, time: null,    text: '─────────────────────────────────────────', color: '#3A3A3A', isSep: true },
  { delay: 9600,  icon: '✓',  time: null,    text: 'ИТОГ: Заявка обработана без участия человека', color: '#10B981', isBold: true },
  { delay: 9750,  icon: null, time: null,    text: '   Время обработки: 127 секунд',          color: '#A0A0A0' },
  { delay: 9900,  icon: null, time: null,    text: '   Статус: Запись подтверждена',           color: '#A0A0A0' },
  { delay: 10050, icon: null, time: null,    text: '   Вы: спали 😴',                          color: '#10B981', isSleep: true },
]

const SOLUTIONS = [
  { Icon: IconTelegram, accent: '#06B6D4', title: 'Telegram-бот для записи',  desc: 'Принимает заявки и записывает клиентов круглосуточно без вашего участия',    tag: 'Экономия 3ч/день' },
  { Icon: IconMessage,  accent: '#10B981', title: 'Автоответы WhatsApp/TG',   desc: 'Мгновенно отвечает на типовые вопросы и квалифицирует клиентов',            tag: 'Ответ за 5 секунд' },
  { Icon: IconCRM,      accent: '#6366F1', title: 'CRM с автозадачами',       desc: 'Заявки сами попадают в CRM, менеджер получает задачу автоматически',        tag: 'Ноль потерянных заявок' },
  { Icon: IconBell,     accent: '#F59E0B', title: 'Уведомления клиентам',     desc: 'Напоминает клиентам о записи, снижает количество отмен на 60%',             tag: 'Отмен -60%' },
  { Icon: IconBrain,    accent: '#8B5CF6', title: 'GPT для обработки заявок', desc: 'Анализирует запросы клиентов и формирует персональные ответы',              tag: 'ИИ 24/7' },
  { Icon: IconWave,     accent: '#EC4899', title: 'Авто-отчёты и дашборд',    desc: 'Все метрики в одном месте, отчёт формируется автоматически каждый день',    tag: 'Данные в реальном времени' },
]

const BEFORE = [
  'Клиент написал ночью — никто не ответил',
  'Забыли перезвонить — потеряли сделку',
  'Запись только через звонок в рабочее время',
  'Заявки теряются в мессенджерах',
  'Отчёт вручную — час работы менеджера',
  'Клиент ждёт ответа по несколько часов',
]
const AFTER = [
  'Бот ответил клиенту за 5 секунд',
  'CRM поставила задачу менеджеру автоматически',
  'Онлайн-запись работает 24/7 без вас',
  'Все заявки в одном месте с уведомлениями',
  'Дашборд обновляется в реальном времени',
  'Клиент получает ответ мгновенно',
]

// ── Animated counter ─────────────────────────────────────────────────
function useAnimatedValue(target, duration = 400) {
  const [display, setDisplay] = useState(target)
  const frameRef = useRef(null)
  const fromRef  = useRef(target)

  useEffect(() => {
    const from = fromRef.current
    if (from === target) return
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    const start = performance.now()
    const delta = target - from
    function tick(now) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - t) ** 3
      const val = Math.round(from + delta * eased)
      setDisplay(val)
      if (t < 1) frameRef.current = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    fromRef.current = from
    frameRef.current = requestAnimationFrame(tick)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [target, duration])

  return display
}

// ── Terminal ─────────────────────────────────────────────────────────
function Terminal() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const containerRef = useRef(null)
  const [visibleSet, setVisibleSet]     = useState(new Set())
  const [fading, setFading]             = useState(false)
  const [glowing, setGlowing]           = useState(false)
  const [processedCount, setProcessedCount] = useState(47)
  const timeoutsRef = useRef([])
  const loopRef = useRef(null)

  loopRef.current = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setVisibleSet(new Set())
    setFading(false)
    setGlowing(false)
    TERMINAL_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleSet(prev => new Set([...prev, i]))
        if (line.isSleep) setGlowing(true)
      }, line.delay)
      timeoutsRef.current.push(t)
    })
    const t1 = setTimeout(() => {
      setFading(true)
      const t2 = setTimeout(() => loopRef.current?.(), 600)
      timeoutsRef.current.push(t2)
    }, 10050 + 3000)
    timeoutsRef.current.push(t1)
  }

  useEffect(() => {
    if (!inView || !containerRef.current) return
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out' }
    )
    loopRef.current?.()
  }, [inView])

  useEffect(() => () => { timeoutsRef.current.forEach(clearTimeout) }, [])

  useEffect(() => {
    const iv = setInterval(() => {
      setProcessedCount(c => c + (Math.random() > 0.4 ? 1 : 2))
    }, 3000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div ref={ref} style={{ maxWidth: '780px', margin: '80px auto 0' }}>
      <div ref={containerRef} style={{
        background: '#0A0A0A', border: '1px solid #1E1E1E',
        borderRadius: '16px', overflow: 'hidden', opacity: 0,
        transition: 'box-shadow 1s ease',
        boxShadow: glowing ? '0 0 120px rgba(16,185,129,0.12)' : '0 0 80px rgba(6,182,212,0.08)',
      }}>
        {/* Header */}
        <div style={{
          background: '#111111', padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: '8px',
          borderBottom: '1px solid #1E1E1E',
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['#FF5F57', '#FFBD2E', '#28CA41'].map(c => (
              <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
            ))}
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#A0A0A0' }}>
              automation.system — live
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#606060' }}>
              {processedCount}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%', background: '#10B981',
                animation: 'pulseGreen 1.5s ease-in-out infinite',
              }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#10B981' }}>
                ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{
          padding: '32px', minHeight: '320px',
          opacity: fading ? 0 : 1, transition: 'opacity 0.5s ease',
        }} className="terminal-body">
          {TERMINAL_LINES.map((line, i) =>
            visibleSet.has(i) && (
              <div key={i} style={{
                display: 'flex', gap: '16px',
                marginBottom: line.isSep ? '8px' : '5px',
                animation: 'fadeInLine 0.3s ease',
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '13px',
                  color: '#606060', width: '50px', flexShrink: 0,
                  visibility: line.time ? 'visible' : 'hidden',
                }}>
                  {line.time || '00:00'}
                </span>
                {line.icon && (
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '14px',
                    color: line.color, flexShrink: 0, width: '20px',
                  }}>
                    {line.icon}
                  </span>
                )}
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '14px',
                  color: line.color, fontWeight: line.isBold ? 600 : 400,
                  paddingLeft: !line.icon ? '24px' : 0,
                }}>
                  {line.text}
                  {line.isSleep && (
                    <span style={{
                      display: 'inline-block', width: '8px', height: '14px',
                      background: '#06B6D4', marginLeft: '4px',
                      verticalAlign: 'text-bottom',
                      animation: 'blink 1s step-end infinite',
                    }} />
                  )}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

// ── Solution card (used inside modal) ────────────────────────────────
function SolutionCard({ sol }) {
  const [hovered, setHovered] = useState(false)
  const { Icon, accent, title, desc, tag } = sol
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#0A0A0A',
        border: `1px solid ${hovered ? accent : '#1E1E1E'}`,
        borderRadius: '16px', padding: '28px',
        position: 'relative', overflow: 'hidden',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? `0 16px 32px ${accent}1A` : 'none',
        transition: 'border-color 0.4s, transform 0.4s, box-shadow 0.4s',
      }}
    >
      <div style={{
        position: 'absolute', right: '-40px', top: '-40px',
        width: '140px', height: '140px', borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}, transparent)`,
        opacity: hovered ? 0.08 : 0.04, transition: 'opacity 0.4s', pointerEvents: 'none',
      }} />
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        background: `${accent}1A`, border: `1px solid ${accent}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: hovered ? 'spinSlow 8s linear infinite' : 'none',
      }}>
        <Icon size={22} color={accent} />
      </div>
      <h4 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '17px', fontWeight: 600, color: '#FFFFFF', margin: '16px 0 6px',
      }}>{title}</h4>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '13px',
        color: '#A0A0A0', lineHeight: 1.6, margin: '0 0 16px',
      }}>{desc}</p>
      <div style={{
        display: 'inline-block',
        background: `${accent}14`, border: `1px solid ${accent}26`,
        borderRadius: '100px', padding: '5px 12px',
        fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: accent,
      }}>{tag}</div>
    </div>
  )
}

// ── Automation Modal ──────────────────────────────────────────────────
function AutoModal({ onClose }) {
  const leftColRef   = useRef(null)
  const rightColRef  = useRef(null)

  const [hours, setHours] = useState(3)
  const monthlyCostTarget = Math.round(hours * 22 * 500)
  const savingsTarget     = Math.round(monthlyCostTarget * 0.7)
  const paybackVal        = (30000 / savingsTarget).toFixed(1)
  const monthlyCostDisp   = useAnimatedValue(monthlyCostTarget)
  const savingsDisp       = useAnimatedValue(savingsTarget)
  const fmt = n => n.toLocaleString('ru-RU') + ' ₽'
  const sliderPct = ((hours - 1) / 7) * 100

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (leftColRef.current && rightColRef.current) {
      gsap.fromTo(leftColRef.current,  { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'power2.out' })
      gsap.fromTo(rightColRef.current, { x: 40,  opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, delay: 0.45, ease: 'power2.out' })
    }
  }, [])

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      data-lenis-prevent
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        overflowY: 'auto',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '960px', width: '100%',
          background: '#0A0A0A',
          border: '1px solid #1E1E1E',
          borderRadius: '24px', overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
          boxShadow: '0 0 120px rgba(6,182,212,0.1)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '24px', right: '24px', zIndex: 10,
            width: '44px', height: '44px', borderRadius: '50%',
            border: '1px solid #2A2A2A', background: 'transparent',
            color: '#A0A0A0', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', transition: 'border-color 0.2s, color 0.2s, transform 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#06B6D4'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'rotate(90deg)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#A0A0A0'; e.currentTarget.style.transform = 'rotate(0deg)' }}
        >✕</button>

        {/* Modal Hero */}
        <div style={{
          padding: '64px 64px 48px',
          background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(99,102,241,0.06))',
          borderBottom: '1px solid #1E1E1E',
        }} className="modal-hero-pad">
          <p style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '12px',
            color: '#06B6D4', letterSpacing: '0.12em', textTransform: 'uppercase',
            margin: '0 0 16px',
          }}>// автоматизация бизнеса</p>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
            color: '#FFFFFF', margin: '0 0 12px', lineHeight: 1.1, letterSpacing: '-0.02em',
          }}>Как это работает</h2>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#A0A0A0',
            margin: 0, lineHeight: 1.6,
          }}>Полная картина: сравнение, инструменты и расчёт экономии для вашего бизнеса.</p>
        </div>

        <div style={{ padding: '64px' }} className="modal-body-pad">

          {/* ── Before/After ── */}
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 600,
            color: '#FFFFFF', margin: '0 0 8px',
          }}>Как меняется бизнес</h3>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#A0A0A0',
            margin: '0 0 32px',
          }}>Реальная разница которую видно сразу</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginBottom: '80px' }}
            className="ba-grid">
            <div ref={leftColRef} style={{
              background: '#111', border: '1px solid #1E1E1E',
              borderRadius: '16px 0 0 16px', padding: '32px', opacity: 0,
            }} className="ba-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', color: '#EF4444',
                }}>✗</div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 600, color: '#EF4444' }}>Без автоматизации</span>
              </div>
              {BEFORE.map((text, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                  padding: '12px 0',
                  borderBottom: i < BEFORE.length - 1 ? '1px solid #1E1E1E' : 'none',
                }}>
                  <span style={{ color: '#EF4444', flexShrink: 0, fontWeight: 600 }}>✗</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B7280', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>

            <div ref={rightColRef} style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.06), rgba(99,102,241,0.04))',
              border: '1px solid rgba(6,182,212,0.2)',
              borderRadius: '0 16px 16px 0', padding: '32px', opacity: 0,
            }} className="ba-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', color: '#10B981',
                }}>✓</div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 600, color: '#10B981' }}>С автоматизацией</span>
              </div>
              {AFTER.map((text, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                  padding: '12px 0',
                  borderBottom: i < AFTER.length - 1 ? '1px solid rgba(6,182,212,0.1)' : 'none',
                }}>
                  <span style={{ color: '#10B981', flexShrink: 0, fontWeight: 600 }}>✓</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#E5E7EB', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Solutions ── */}
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 600,
            color: '#FFFFFF', margin: '0 0 32px',
          }}>Что автоматизирую</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '80px' }}
            className="sol-grid">
            {SOLUTIONS.map((sol, i) => <SolutionCard key={i} sol={sol} />)}
          </div>

          {/* ── Calculator ── */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.06), rgba(99,102,241,0.04))',
            border: '1px solid rgba(6,182,212,0.15)',
            borderRadius: '20px', padding: '48px',
            position: 'relative', overflow: 'hidden',
            marginBottom: '64px',
          }} className="calc-pad">
            <div style={{
              position: 'absolute', width: '280px', height: '280px', borderRadius: '50%',
              background: '#06B6D4', filter: 'blur(80px)', opacity: 0.04,
              top: '-80px', left: '-80px', pointerEvents: 'none',
            }} />

            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 600,
              color: '#FFFFFF', textAlign: 'center', margin: '0 0 6px',
            }}>Сколько времени теряет ваш бизнес?</h3>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#A0A0A0',
              textAlign: 'center', margin: '0 0 40px',
            }}>Посчитайте сколько стоит рутина</p>

            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#A0A0A0', marginBottom: '16px' }}>
              Сколько часов в день уходит на переписку, запись и рутину?
            </p>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: 700,
                background: 'linear-gradient(135deg, #06B6D4, #6366F1)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{hours}</span>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#A0A0A0' }}>часов в день</div>
            </div>
            <input
              type="range" min="1" max="8" step="0.5" value={hours}
              onChange={e => setHours(parseFloat(e.target.value))}
              className="auto-slider"
              style={{ '--pct': `${sliderPct}%` }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '32px' }}
              className="calc-results">
              {[
                { label: 'Стоимость рутины в месяц', value: fmt(monthlyCostDisp), color: '#EF4444' },
                { label: 'Экономия с автоматизацией', value: '↑ ' + fmt(savingsDisp), color: '#10B981' },
                { label: 'Окупаемость за', value: paybackVal + ' мес.', color: '#06B6D4' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  background: '#0A0A0A', border: '1px solid #1E1E1E',
                  borderRadius: '14px', padding: '20px', textAlign: 'center',
                }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#A0A0A0', marginBottom: '10px', lineHeight: 1.4 }}>{label}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(18px, 2.5vw, 28px)', fontWeight: 700, color }}>{value}</div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#4B5563', textAlign: 'center', margin: '12px 0 0' }}>
              * Расчёт приблизительный. Реальная экономия зависит от бизнеса.
            </p>
          </div>

          {/* ── CTA ── */}
          <div style={{ textAlign: 'center' }}>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700,
              color: '#FFFFFF', margin: '0 0 12px', lineHeight: 1.1,
            }}>Готов поставить бизнес<br />на автопилот?</h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#A0A0A0', margin: '0 0 32px', lineHeight: 1.7 }}>
              Разберём какие процессы можно автоматизировать у вас — бесплатно за 30 минут
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
              className="auto-cta-btns">
              <a href="https://t.me/korm_marketing" target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: 'linear-gradient(135deg, #06B6D4, #6366F1)',
                  borderRadius: '100px', padding: '16px 36px',
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: 500,
                  color: '#FFFFFF', textDecoration: 'none',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 0 28px rgba(6,182,212,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
              >Обсудить в Telegram →</a>
              <a href="tel:"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  border: '1px solid #2A2A2A', borderRadius: '100px', padding: '16px 36px',
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: 500,
                  color: '#A0A0A0', textDecoration: 'none',
                  transition: 'border-color 0.25s, color 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#06B6D4'; e.currentTarget.style.color = '#FFF' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#A0A0A0' }}
              >Позвонить</a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

// ── Main ─────────────────────────────────────────────────────────────
export default function Automation() {
  const sectionRef  = useRef(null)
  const labelRef    = useRef(null)
  const line1Ref    = useRef(null)
  const line2Ref    = useRef(null)
  const glitchRef   = useRef(null)
  const subtitleRef = useRef(null)
  const orb1Ref     = useRef(null)
  const orb2Ref     = useRef(null)

  const [modalOpen, setModalOpen] = useState(false)

  const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true, threshold: 0.2 })

  // Header reveal
  useEffect(() => {
    if (!headerInView) return
    const tl = gsap.timeline()
    tl.fromTo(labelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
    tl.fromTo(line1Ref.current, { y: '100%' }, { y: '0%', duration: 0.8, ease: 'power4.out' }, '-=0.1')
    tl.fromTo(line2Ref.current, { y: '100%' }, { y: '0%', duration: 0.8, ease: 'power4.out' }, '-=0.55')
    tl.fromTo(subtitleRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.3')
  }, [headerInView])

  // Parallax
  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(orb1Ref.current, { y: -100, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.to(orb2Ref.current, { y: 60,   ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Glitch
  useEffect(() => {
    const iv = setInterval(() => {
      if (!glitchRef.current) return
      glitchRef.current.style.animation = 'none'
      void glitchRef.current.offsetWidth
      glitchRef.current.style.animation = 'glitch 0.3s ease forwards'
      setTimeout(() => { if (glitchRef.current) glitchRef.current.style.animation = 'none' }, 350)
    }, 8000)
    return () => clearInterval(iv)
  }, [])

  return (
    <section
      id="автоматизация"
      ref={sectionRef}
      style={{ background: '#050505', position: 'relative', overflow: 'hidden', zIndex: 1 }}
    >
      {/* Orbs */}
      <div ref={orb1Ref} style={{
        position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
        top: '-150px', left: '-150px', pointerEvents: 'none',
      }} />
      <div ref={orb2Ref} style={{
        position: 'absolute', width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        bottom: '100px', right: '-100px', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', padding: '120px 6%' }}>

        {/* Header */}
        <div ref={headerRef} style={{ textAlign: 'center' }}>
          <p ref={labelRef} style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px', color: '#06B6D4',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '24px', opacity: 0,
          }}>// 04 автоматизация</p>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ overflow: 'hidden' }}>
              <div ref={line1Ref} style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 700,
                lineHeight: 0.95, letterSpacing: '-0.02em',
                color: '#FFFFFF', transform: 'translateY(100%)',
              }}>Пока вы спите —</div>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div ref={line2Ref} style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 700,
                lineHeight: 0.95, letterSpacing: '-0.02em',
                transform: 'translateY(100%)',
              }}>
                <span ref={glitchRef} style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #06B6D4, #6366F1)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>бизнес работает</span>
              </div>
            </div>
          </div>

          <p ref={subtitleRef} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '17px', color: '#A0A0A0',
            lineHeight: 1.7, maxWidth: '520px',
            margin: '0 auto', opacity: 0,
          }} className="auto-subtitle">
            Настраиваю систему которая принимает заявки, отвечает клиентам и ведёт учёт — без вашего участия. 24 часа в сутки, 7 дней в неделю.
          </p>
        </div>

        {/* Terminal */}
        <Terminal />

        {/* CTA button */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'transparent',
              border: '1px solid rgba(6,182,212,0.4)',
              borderRadius: '100px', padding: '16px 36px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '15px', fontWeight: 500, color: '#06B6D4',
              cursor: 'pointer',
              transition: 'border-color 0.3s, background 0.3s, color 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#06B6D4'
              e.currentTarget.style.background = 'rgba(6,182,212,0.08)'
              e.currentTarget.style.boxShadow = '0 0 24px rgba(6,182,212,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)'
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Подробнее об автоматизации
            <span style={{ fontSize: '18px' }}>→</span>
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && <AutoModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>

      <style>{`
        @keyframes pulseGreen {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes fadeInLine {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes glitch {
          0%   { transform: translate(0);         filter: none; }
          20%  { transform: translate(-2px, 2px);  filter: hue-rotate(90deg); }
          40%  { transform: translate(2px, -2px);  filter: hue-rotate(-90deg); }
          70%  { transform: translate(0);          filter: none; }
          100% { transform: translate(0);          filter: none; }
        }
        .auto-slider {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 4px; border-radius: 2px; outline: none; cursor: pointer;
          background: linear-gradient(to right, #06B6D4 var(--pct, 28%), #1E1E1E var(--pct, 28%));
        }
        .auto-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: linear-gradient(135deg, #06B6D4, #6366F1);
          border: 2px solid #FFF;
          box-shadow: 0 0 12px rgba(6,182,212,0.3);
          cursor: grab; transition: transform 0.2s, box-shadow 0.2s;
        }
        .auto-slider:active::-webkit-slider-thumb {
          transform: scale(1.3); box-shadow: 0 0 20px rgba(6,182,212,0.5); cursor: grabbing;
        }
        .auto-slider::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: linear-gradient(135deg, #06B6D4, #6366F1);
          border: 2px solid #FFF; cursor: grab;
        }
        @media (max-width: 768px) {
          .auto-subtitle    { font-size: 15px !important; }
          .terminal-body    { padding: 16px !important; }
          .terminal-body span { font-size: 11px !important; }
          .ba-grid   { grid-template-columns: 1fr !important; gap: 12px !important; }
          .ba-col    { border-radius: 16px !important; padding: 24px !important; }
          .sol-grid  { grid-template-columns: 1fr !important; }
          .calc-results { grid-template-columns: 1fr !important; }
          .auto-cta-btns a { width: 100% !important; justify-content: center; }
          .modal-hero-pad  { padding: 32px 24px 28px !important; }
          .modal-body-pad  { padding: 32px 24px !important; }
          .calc-pad { padding: 28px 20px !important; }
        }
        @media (max-width: 480px) {
          .terminal-body span { font-size: 10px !important; }
        }
      `}</style>
    </section>
  )
}

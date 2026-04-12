import { useRef } from 'react'

// ── Text rows ───────────────────────────────────────────────────────
const ROW1 = [
  'Яндекс Директ', 'Сайты под ключ', 'SEO продвижение',
  'Авито', 'CRM системы', 'Telegram боты', 'Автоматизация',
]
const ROW2 = [
  'Vibe Coding', 'ИИ интеграции', 'Лидогенерация',
  'Аналитика', 'Воронки продаж', 'Three.js', 'React',
]

// ── Single item with dot separator ─────────────────────────────────
function Item({ label, color, fontWeight }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '15px',
          fontWeight,
          color,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: '#6366F1',
          margin: '0 22px',
          fontSize: '15px',
          fontWeight,
          flexShrink: 0,
        }}
      >
        ·
      </span>
    </span>
  )
}

// ── One marquee row ─────────────────────────────────────────────────
function MarqueeRow({ items, reverse = false, speed, color, fontWeight }) {
  const trackRef = useRef(null)

  const pause  = () => { if (trackRef.current) trackRef.current.style.animationPlayState = 'paused' }
  const resume = () => { if (trackRef.current) trackRef.current.style.animationPlayState = 'running' }

  const renderedItems = items.map((label, i) => (
    <Item key={i} label={label} color={color} fontWeight={fontWeight} />
  ))

  return (
    <div
      style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div
        ref={trackRef}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          animation: `${reverse ? 'marqueeRtl' : 'marqueeLtr'} ${speed}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {/* Two copies → seamless loop at exactly -50% / +50% */}
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>{renderedItems}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center' }} aria-hidden="true">{renderedItems}</span>
      </div>
    </div>
  )
}

// ── Export ──────────────────────────────────────────────────────────
export default function Marquee() {
  return (
    <section
      style={{
        background: '#0F0F0F',
        borderTop: '1px solid #1E1E1E',
        borderBottom: '1px solid #1E1E1E',
        padding: '18px 0',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <MarqueeRow items={ROW1} reverse={false} speed={35} color="#FFFFFF" fontWeight={500} />
      <div style={{ height: '10px' }} />
      <MarqueeRow items={ROW2} reverse={true}  speed={25} color="#A0A0A0" fontWeight={400} />
    </section>
  )
}

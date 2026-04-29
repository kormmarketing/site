import { useEffect, useRef, useState } from 'react'

// ─── Цвета бренда ────────────────────────────────────────────────
const BRAND = {
  bg:       '#050505',
  primary:  '#6366F1',
  cyan:     '#06B6D4',
  purple:   '#8B5CF6',
  text:     '#FFFFFF',
  muted:    '#A0A0A0',
  border:   '#1E1E1E',
}

const rand = (seed) => Math.sin(seed * 9999) * 0.5 + 0.5

export default function NotFound() {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem('korm_404_high') || '0', 10) } catch { return 0 }
  })
  const [glitchText, setGlitchText] = useState('404')

  // Сохраняем рекорд
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      try { localStorage.setItem('korm_404_high', String(score)) } catch {}
    }
  }, [score, highScore])

  // Глитч текста
  useEffect(() => {
    const chars = ['#', '@', '*', '!', '?', '%', '&', '4', '0']
    const id = setInterval(() => {
      const glitched = '404'.split('').map(c =>
        Math.random() < 0.4 ? chars[Math.floor(Math.random() * chars.length)] : c
      ).join('')
      setGlitchText(glitched)
      setTimeout(() => setGlitchText('404'), 100)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  // Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf = 0
    let w = 0, h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 120 }, (_, i) => ({
      x: rand(i + 1) * w,
      y: rand(i + 100) * h,
      r: rand(i + 200) * 1.4 + 0.2,
      tw: rand(i + 300) * Math.PI * 2,
      sp: rand(i + 400) * 0.02 + 0.005,
    }))

    let digits = []
    const spawnDigit = () => {
      digits.push({
        x: Math.random() * w,
        y: -30,
        char: Math.random() < 0.5 ? '4' : '0',
        speed: 1 + Math.random() * 2.5,
        size: 14 + Math.random() * 26,
        hue: Math.random() < 0.5 ? 240 : 190,
        rot: 0,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        alive: true,
      })
    }
    let spawnTimer = 0

    let particles = []
    const explode = (x, y, hue) => {
      for (let i = 0; i < 18; i++) {
        const a = Math.random() * Math.PI * 2
        const v = 1 + Math.random() * 4
        particles.push({
          x, y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          life: 1,
          hue,
        })
      }
    }

    let mouse = { x: -9999, y: -9999 }
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const t = e.touches ? e.touches[0] : e
      mouse.x = t.clientX - rect.left
      mouse.y = t.clientY - rect.top
    }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const t = e.touches ? e.touches[0] : e
      const cx = t.clientX - rect.left
      const cy = t.clientY - rect.top
      for (const d of digits) {
        if (!d.alive) continue
        const dist = Math.hypot(d.x - cx, d.y - cy)
        if (dist < d.size * 0.9) {
          d.alive = false
          explode(d.x, d.y, d.hue)
          setScore(s => s + 1)
          break
        }
      }
    }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    canvas.addEventListener('click', onClick)
    canvas.addEventListener('touchmove', onMove, { passive: true })
    canvas.addEventListener('touchstart', onClick, { passive: true })

    let last = performance.now()
    const loop = (now) => {
      const dt = Math.min(now - last, 60)
      last = now

      ctx.fillStyle = 'rgba(5,5,5,0.22)'
      ctx.fillRect(0, 0, w, h)

      ctx.fillStyle = '#FFFFFF'
      for (const s of stars) {
        s.tw += s.sp * dt * 0.06
        const alpha = 0.3 + Math.sin(s.tw) * 0.3 + 0.4
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      if (mouse.x > 0 && mouse.y > 0) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 90)
        grad.addColorStop(0, 'rgba(99,102,241,0.20)')
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 90, 0, Math.PI * 2)
        ctx.fill()
      }

      spawnTimer += dt
      if (spawnTimer > 600) {
        spawnTimer = 0
        spawnDigit()
      }

      for (const d of digits) {
        if (!d.alive) continue
        d.y += d.speed * (dt / 16)
        d.rot += d.rotSpeed
        if (d.y > h + 40) { d.alive = false; continue }

        const color = `hsl(${d.hue}, 80%, 65%)`
        ctx.save()
        ctx.translate(d.x, d.y)
        ctx.rotate(d.rot)
        ctx.font = `700 ${d.size}px 'JetBrains Mono', monospace`
        ctx.fillStyle = color
        ctx.shadowBlur = 14
        ctx.shadowColor = color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(d.char, 0, 0)
        ctx.restore()
      }

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.08
        p.life -= 0.018
        if (p.life <= 0) continue
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.life})`
        ctx.shadowBlur = 8
        ctx.shadowColor = `hsl(${p.hue}, 80%, 70%)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
      digits = digits.filter(d => d.alive)
      particles = particles.filter(p => p.life > 0)

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('touchmove', onMove)
      canvas.removeEventListener('touchstart', onClick)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: BRAND.bg,
      color: BRAND.text,
      overflow: 'hidden',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <style>{`
        * { box-sizing: border-box; cursor: auto !important; }
        a, button, [role="button"] { cursor: pointer !important; }
        canvas { cursor: crosshair !important; }

        @keyframes glitchShake {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, -2px); }
          80% { transform: translate(1px, 2px); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 24px rgba(99,102,241,0.5)); }
          50% { filter: drop-shadow(0 0 48px rgba(6,182,212,0.7)); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        .nf-num {
          font-size: clamp(120px, 28vw, 320px);
          font-weight: 800;
          line-height: 0.9;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: glow 3s ease-in-out infinite;
          position: relative;
          user-select: none;
        }
        .nf-num::before, .nf-num::after {
          content: attr(data-text);
          position: absolute;
          left: 0; top: 0;
          width: 100%; height: 100%;
          background: inherit;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nf-num::before {
          color: #FF0050;
          background: none;
          -webkit-text-fill-color: #FF0050;
          animation: glitchShake 3s infinite linear;
          mix-blend-mode: screen;
          opacity: 0.55;
          transform: translate(-3px, 0);
        }
        .nf-num::after {
          color: #00FFE7;
          background: none;
          -webkit-text-fill-color: #00FFE7;
          animation: glitchShake 2.4s infinite linear reverse;
          mix-blend-mode: screen;
          opacity: 0.55;
          transform: translate(3px, 0);
        }

        .nf-scanline {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.06) 50%, transparent 100%);
          height: 80px;
          pointer-events: none;
          animation: scanline 6s linear infinite;
          z-index: 2;
        }

        .nf-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 16px 32px; border-radius: 100px;
          background: linear-gradient(135deg, #6366F1, #06B6D4);
          color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .nf-cta:hover { transform: scale(1.04); box-shadow: 0 0 32px rgba(99,102,241,0.4); }

        .nf-cta-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 100px;
          background: transparent;
          border: 1px solid #2E2E2E;
          color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px; font-weight: 500;
          text-decoration: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .nf-cta-ghost:hover { border-color: #6366F1; box-shadow: 0 0 18px rgba(99,102,241,0.18); }

        @media (max-width: 700px) {
          .nf-stats { flex-direction: column; gap: 8px !important; }
          .nf-actions { flex-direction: column; gap: 12px; align-items: stretch !important; }
          .nf-actions a { text-align: center; justify-content: center; }
        }
      `}</style>

      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          zIndex: 1,
        }}
      />

      <div className="nf-scanline" />

      <div style={{
        position: 'relative', zIndex: 3,
        height: '100%', width: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 6%',
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', top: '24px', left: '24px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '12px', color: BRAND.primary,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          pointerEvents: 'auto',
        }}>
          // system::error_404
          <span style={{ animation: 'blink 1s infinite', marginLeft: '6px' }}>_</span>
        </div>

        <a href="/" style={{
          position: 'absolute', top: '20px', right: '24px',
          textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '8px',
          pointerEvents: 'auto',
        }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '18px', fontWeight: 700, color: '#fff',
          }}>КОРМ</span>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
            flexShrink: 0,
          }} />
        </a>

        <h1
          className="nf-num"
          data-text={glitchText}
          style={{ margin: 0 }}
        >
          {glitchText}
        </h1>

        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(13px, 2vw, 16px)',
          color: BRAND.muted,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginTop: '8px',
          textAlign: 'center',
        }}>
          {'> page_not_found'}
        </p>

        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: '#C0C0C0',
          textAlign: 'center',
          maxWidth: '520px',
          marginTop: '24px', marginBottom: '8px',
          lineHeight: 1.6,
        }}>
          Эта страница потерялась в космосе.
        </p>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(13px, 1.6vw, 14px)',
          color: BRAND.muted,
          textAlign: 'center',
          maxWidth: '500px',
          marginTop: 0, marginBottom: '32px',
          lineHeight: 1.6,
        }}>
          А пока — клацай по падающим цифрам и набивай рекорд.<br/>
          <span style={{ color: '#6A6A6A' }}>(на мобиле — пальцем тапай)</span>
        </p>

        <div className="nf-stats" style={{
          display: 'flex', gap: '20px', marginBottom: '32px',
          fontFamily: "'JetBrains Mono', monospace",
          pointerEvents: 'auto',
        }}>
          <div style={{
            padding: '10px 18px', borderRadius: '12px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.3)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '11px', color: BRAND.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Score</span>
            <span style={{
              fontSize: '20px', fontWeight: 700,
              color: BRAND.primary,
              animation: score > 0 ? 'pulse 0.4s' : 'none',
              minWidth: '32px', display: 'inline-block', textAlign: 'right',
            }}>{score}</span>
          </div>
          <div style={{
            padding: '10px 18px', borderRadius: '12px',
            background: 'rgba(139,92,246,0.06)',
            border: '1px solid rgba(139,92,246,0.25)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '11px', color: BRAND.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Best</span>
            <span style={{ fontSize: '20px', fontWeight: 700, color: BRAND.purple, minWidth: '32px', display: 'inline-block', textAlign: 'right' }}>{highScore}</span>
          </div>
        </div>

        <div className="nf-actions" style={{
          display: 'flex', justifyContent: 'center',
          pointerEvents: 'auto',
        }}>
          <a href="/" className="nf-cta">← Вернуться на главную</a>
        </div>
      </div>
    </div>
  )
}

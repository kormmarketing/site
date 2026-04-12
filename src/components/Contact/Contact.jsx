import { useRef, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

// ── Shared input style ──────────────────────────────────────────────
const BASE = {
  background: '#0A0A0A',
  border: '1px solid #1E1E1E',
  borderRadius: '12px',
  padding: '16px 20px',
  color: '#FFFFFF',
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  appearance: 'none',
  WebkitAppearance: 'none',
}

const onFocus = (e) => {
  e.target.style.borderColor = '#6366F1'
  e.target.style.boxShadow   = '0 0 0 3px rgba(99,102,241,0.08)'
}
const onBlur = (e) => {
  e.target.style.borderColor = '#1E1E1E'
  e.target.style.boxShadow   = 'none'
}

// ── Component ───────────────────────────────────────────────────────
export default function Contact() {
  const [form, setForm] = useState({ name: '', contact: '', task: '', budget: '', message: '' })
  const [sent, setSent]   = useState(false)
  const [busy, setBusy]   = useState(false)

  const labelRef      = useRef(null)
  const titleInnerRef = useRef(null)
  const { ref: headerRef, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (!inView) return
    const tl = gsap.timeline()
    tl.fromTo(labelRef.current,      { opacity: 0 }, { opacity: 1, duration: 0.5 })
    tl.fromTo(titleInnerRef.current, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' }, '-=0.2')
  }, [inView])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setBusy(true)
    setTimeout(() => { setBusy(false); setSent(true) }, 800)
  }

  return (
    <section
      id="контакт"
      style={{ background: '#0F0F0F', padding: '120px 0', position: 'relative', zIndex: 1 }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>

        {/* ── Header ─────────────────────────────────────── */}
        <div ref={headerRef} style={{ marginBottom: '56px', textAlign: 'center' }}>
          <p
            ref={labelRef}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px',
              color: '#6366F1',
              marginBottom: '20px',
              opacity: 0,
              letterSpacing: '0.04em',
            }}
          >
            // напиши мне
          </p>
          <div style={{ overflow: 'hidden', marginBottom: '16px' }}>
            <div ref={titleInnerRef} style={{ opacity: 0 }}>
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
              }}>
                Начнём проект?
              </h2>
            </div>
          </div>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            color: '#A0A0A0',
            margin: 0,
          }}>
            Расскажи о задаче — отвечу в течение часа
          </p>
        </div>

        {/* ── Form / Success ──────────────────────────────── */}
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: 'center', padding: '60px 0' }}
            >
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(20px, 4vw, 32px)',
                color: '#6366F1',
                marginBottom: '20px',
              }}>
                {'< заявка_отправлена />'}
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '18px',
                color: '#FFFFFF',
              }}>
                Увидел. Отвечу в течение часа.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.35 }}
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              {/* Row 1: name + contact */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}
                className="contact-row">
                <input
                  name="name" required value={form.name}
                  onChange={handleChange} placeholder="Имя"
                  style={BASE} onFocus={onFocus} onBlur={onBlur}
                />
                <input
                  name="contact" required value={form.contact}
                  onChange={handleChange} placeholder="Телефон или Telegram"
                  style={BASE} onFocus={onFocus} onBlur={onBlur}
                />
              </div>

              {/* Row 2: task type + budget */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}
                className="contact-row">
                <div style={{ position: 'relative' }}>
                  <select
                    name="task" value={form.task}
                    onChange={handleChange}
                    style={{ ...BASE, color: form.task ? '#FFFFFF' : '#A0A0A0', cursor: 'pointer' }}
                    onFocus={onFocus} onBlur={onBlur}
                  >
                    <option value="" disabled>Тип задачи</option>
                    <option value="site">Сайт</option>
                    <option value="ads">Реклама</option>
                    <option value="auto">Автоматизация</option>
                    <option value="ai">ИИ-интеграция</option>
                    <option value="other">Другое</option>
                  </select>
                  <span style={{
                    position: 'absolute', right: '16px', top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#A0A0A0', pointerEvents: 'none', fontSize: '12px',
                  }}>▾</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <select
                    name="budget" value={form.budget}
                    onChange={handleChange}
                    style={{ ...BASE, color: form.budget ? '#FFFFFF' : '#A0A0A0', cursor: 'pointer' }}
                    onFocus={onFocus} onBlur={onBlur}
                  >
                    <option value="" disabled>Бюджет</option>
                    <option value="15k">до 15 000 ₽</option>
                    <option value="50k">15 000 – 50 000 ₽</option>
                    <option value="150k">50 000 – 150 000 ₽</option>
                    <option value="150k+">от 150 000 ₽</option>
                  </select>
                  <span style={{
                    position: 'absolute', right: '16px', top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#A0A0A0', pointerEvents: 'none', fontSize: '12px',
                  }}>▾</span>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                name="message" rows={4} value={form.message}
                onChange={handleChange} placeholder="Расскажи о проекте"
                style={{ ...BASE, resize: 'vertical', lineHeight: 1.6 }}
                onFocus={onFocus} onBlur={onBlur}
              />

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={busy}
                whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(99,102,241,0.3)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                data-cursor="button"
                style={{
                  width: '100%',
                  padding: '18px',
                  borderRadius: '100px',
                  border: 'none',
                  background: busy
                    ? '#1E1E1E'
                    : 'linear-gradient(135deg, #6366F1, #06B6D4)',
                  color: '#FFFFFF',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: busy ? 'not-allowed' : 'pointer',
                  letterSpacing: '-0.01em',
                  transition: 'background 0.3s',
                }}
              >
                {busy ? 'Отправляю...' : 'Отправить заявку →'}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Direct contacts */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          marginTop: '40px',
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'Telegram', href: 'https://t.me/' },
            { label: 'Серпухов · МО', href: null },
          ].map(({ label, href }) =>
            href ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '14px',
                  color: '#A0A0A0', textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.target.style.color = '#A0A0A0')}
              >
                {label}
              </a>
            ) : (
              <span key={label} style={{
                fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#A0A0A0',
              }}>{label}</span>
            )
          )}
        </div>
      </div>

      {/* Mobile 1-col inputs */}
      <style>{`
        @media (max-width: 580px) {
          .contact-row { grid-template-columns: 1fr !important; }
          select { background: #0A0A0A; }
        }
        select option { background: #0A0A0A; color: #FFFFFF; }
      `}</style>
    </section>
  )
}

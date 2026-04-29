import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Animated counter ─────────────────────────────────────────────
function useCountUp(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(target)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

// ── FAQ Item ──────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      borderBottom: '1px solid #1E1E1E',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: '16px',
          padding: '20px 0', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(15px, 2vw, 17px)', fontWeight: 600,
          color: open ? '#6366F1' : '#FFFFFF',
          transition: 'color 0.2s', lineHeight: 1.4,
        }}>{q}</span>
        <span style={{
          fontSize: '20px', color: '#6366F1', flexShrink: 0,
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
          display: 'inline-block',
        }}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(14px, 1.8vw, 15px)',
              color: '#A0A0A0', lineHeight: 1.7,
              paddingBottom: '20px',
            }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Section label ─────────────────────────────────────────────────
function Label({ children }) {
  return (
    <p style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '12px', color: '#6366F1',
      letterSpacing: '0.08em', textTransform: 'uppercase',
      marginBottom: '16px',
    }}>// {children}</p>
  )
}

// ── Reveal wrapper ────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 40, fullHeight = false }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={fullHeight ? { height: '100%' } : undefined}
    >
      {children}
    </motion.div>
  )
}

// ── Check icon ────────────────────────────────────────────────────
const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// ── Main component ────────────────────────────────────────────────
export default function FurniturePromo() {
  const [formSent, setFormSent] = useState(false)
  const [formBusy, setFormBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({ name: '', contact: '', website: '' })
  const [formAgree, setFormAgree] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox])

  // Stats reveal
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.3 })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.name.trim()) { setFormError('Введите название компании'); return }
    if (!form.contact.trim()) { setFormError('Введите телефон или Telegram'); return }
    if (!formAgree) { setFormError('Подтвердите согласие на обработку персональных данных'); return }
    if (form.website) { setFormSent(true); return } // honeypot
    setFormBusy(true)
    try {
      const res = await fetch('/api/send.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'furniture',
          fields: { name: form.name, contact: form.contact },
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error)
      setFormSent(true)
    } catch (err) {
      setFormError(err.message || 'Ошибка. Напишите напрямую: @korm_marketing')
    } finally {
      setFormBusy(false)
    }
  }

  const PHONE = '+7 995 500-30-14'
  const PHONE_HREF = 'tel:+79955003014'
  const TG = 'https://t.me/korm_marketing'

  const PAINS = [
    'Хочется крупных заказов на кухни, гардеробные, премиум-проекты — но Авито приводит мелочёвку. А именно крупные заказы дают основную маржу и развитие производства',
    'Карточка в Яндекс.Картах есть, но давно не обновлялась — фото старые, услуг с ценами нет, истории не публикуются, проектов нет',
    'Сайта нет вообще, или есть, но устаревший. Без портфолио клиент не доверит дорогую кухню или гардеробную. На фото в WhatsApp серьёзный заказ не продать',
    'Отзывы появляются медленно, негативные не отрабатываются',
    'На рынке высокая конкуренция: десятки локальных мастерских и крупные федеральные сети с большими маркетинговыми бюджетами. Без онлайн-присутствия локальной компании сложно конкурировать в поиске',
  ]

  const MAPS_LIST = [
    'Заполняю все поля карточки правильно: услуги, цены, фото производства и проектов, описание, режим работы',
    'Подбираю оптимальный платный тариф Яндекс.Бизнес под ваш бюджет (при необходимости)',
    'Ставлю систему получения реальных отзывов от клиентов (QR-коды, скрипты менеджеру)',
    'Повышаю рейтинг компании',
    'Веду стабильный контент-план: истории, акции, новые готовые проекты',
    'Слежу за актуальностью: фото, цены, часы работы',
  ]

  const SITE_LIST = [
    'Делаю аккуратный, презентабельный сайт под мебельную сферу',
    'Наполняю контентом: блоки услуг, портфолио проектов, прайс, акции, контакты',
    'Формирую необходимый контент, если у вас его недостаточно. Прорабатываем блоки услуг, портфолио и описание производства',
    'Устанавливаю Яндекс.Метрику и аналитику',
    'Привязываю ваш домен',
    'Даю подробную инструкцию: как менять контент самостоятельно',
    '2 месяца сопровождения после запуска: правки, ошибки, технические вопросы',
  ]

  const PROCESS = [
    { num: '01', title: 'Знакомство', time: '15 минут', items: ['Звонок или встреча у вас на производстве/в шоуруме', 'Я уже изучил вашу компанию онлайн — приду с конкретным планом', 'Вы решаете брать или нет — без давления'] },
    { num: '02', title: 'Договор и старт', time: '1 день', items: ['Подписываем договор, где прописываем все работы и гарантии', 'Чек, документы', 'Поэтапная оплата по результату'] },
    { num: '03', title: 'Работа', time: '1–4 недели', items: ['Карточка — 3-5 дней', 'Сайт — от 1 недели', 'Регулярные отчёты, согласование на каждом этапе'] },
    { num: '04', title: 'Сопровождение', time: '2 мес гарантии', items: ['2 месяца гарантии на сайт', 'Ежемесячное ведение карточки', 'Поддержка по любым вопросам'] },
  ]

  const FAQS = [
    { q: 'Почему так дёшево? Сколько стоят такие услуги в Москве?', a: 'В Москве сайт-портфолио для мебельной компании — от 80–150 тыс., ведение Карт — от 30 тыс./мес. Я работаю в Серпухове, без офиса и команды менеджеров — поэтому цены ниже. Качество от этого не страдает.' },
    { q: 'Я уже работал с маркетологами и ничего не получилось.', a: 'Понимаю, такое часто бывает с агентствами на удалёнке. Я работаю иначе: приезжаю лично на производство, разбираюсь в вашей ситуации, отвечаю за результат. Если за 2 месяца карточка не вырастет — вернётесь к прежней схеме без потерь.' },
    { q: 'Не хочу заниматься этим — нет времени.', a: 'Это и есть моя задача. После запуска беру всё на себя — обновление карточки, ответы на отзывы, актуальные акции, добавление новых готовых проектов на сайт. Ваше участие — раз в месяц 15 минут на согласование плана и присылка фото готовых работ.' },
    { q: 'Что если придут негативные отзывы?', a: 'В мебельной нише бывают споры по срокам или нюансам сборки — это нормально. Грамотный ответ на негатив часто работает на репутацию лучше, чем десять положительных. Знаю как отвечать, чтобы рейтинг не падал, а часть негативных удаляется через службу поддержки Яндекса.' },
    { q: 'Какие гарантии?', a: 'Договор как самозанятый — это юридический документ. На сайт даю 2 месяца гарантии: правки, ошибки, технические вопросы — бесплатно. На карточку — гарантия в виде ежемесячного отчёта: видите рост позиций и количество новых отзывов.' },
    { q: 'А если я найду подрядчика дешевле?', a: 'Найдёте — обязательно. Только потом часто возвращаются после исполнителя, который сделал на коленке и пропал. Я не самый дешёвый, но и не самый дорогой. И главное — я в Серпухове, со мной можно встретиться.' },
  ]

  return (
    <div style={{ background: '#050505', minHeight: '100vh', color: '#FFFFFF', overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; cursor: auto !important; }
        a, button, [role="button"] { cursor: pointer !important; }
        html { scroll-behavior: smooth; }
        body { margin: 0; cursor: auto !important; }

        .dp-container { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 6%; }
        .dp-section { padding: 96px 0; }

        .dp-btn-primary {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 16px 32px; border-radius: 100px;
          background: linear-gradient(135deg, #6366F1, #06B6D4);
          color: #fff; font-family: 'Space Grotesk', sans-serif;
          font-size: 16px; font-weight: 600; text-decoration: none;
          border: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .dp-btn-primary:hover { transform: scale(1.03); box-shadow: 0 0 32px rgba(99,102,241,0.4); }
        .dp-btn-primary:active { transform: scale(0.97); }

        .dp-btn-outline {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 15px 32px; border-radius: 100px;
          background: transparent; border: 1px solid #2E2E2E;
          color: #FFFFFF; font-family: 'Space Grotesk', sans-serif;
          font-size: 16px; font-weight: 600; text-decoration: none;
          cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .dp-btn-outline:hover { border-color: #6366F1; box-shadow: 0 0 18px rgba(99,102,241,0.2); }

        .dp-card {
          background: #0F0F0F; border: 1px solid #1E1E1E;
          border-radius: 20px; padding: 32px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .dp-card:hover { border-color: #2E2E2E; transform: translateY(-2px); }

        .dp-h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(28px, 4.5vw, 52px);
          font-weight: 700; letter-spacing: -0.02em; line-height: 1.1;
          color: #FFFFFF; margin: 0 0 16px;
        }

        .dp-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .dp-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .dp-three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .dp-process-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

        .dp-package-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 40px;
          align-items: stretch;
          position: relative;
        }
        .dp-urg-cta { display: inline-block; }

        @media (max-width: 900px) {
          .dp-process-grid { grid-template-columns: repeat(2, 1fr); }
          .dp-two-col { grid-template-columns: 1fr; }
          .dp-package-grid { grid-template-columns: 1fr; gap: 28px; }
          .dp-package-price { max-width: 360px; margin: 0 auto; width: 100%; }
        }
        @media (max-width: 700px) {
          .dp-stats-grid { grid-template-columns: 1fr; gap: 16px; }
          .dp-three-col { grid-template-columns: 1fr; }
          .dp-process-grid { grid-template-columns: 1fr; }
          .dp-section { padding: 64px 0; }
          .dp-card { padding: 24px; }
          .dp-urg-cta { display: flex; justify-content: center; }
          .dp-urg-cta a { width: 100%; max-width: 340px; }
        }

        @keyframes dpFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes dpPulse { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.3)} 50%{box-shadow:0 0 0 12px rgba(99,102,241,0)} }
        @keyframes dpGlow { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes bounce { 0%,100%{transform:translateY(0) translateX(-50%)} 50%{transform:translateY(8px) translateX(-50%)} }

        -webkit-tap-highlight-color: transparent;
      `}</style>

      {/* ── NAV ──────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #1E1E1E',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 6%', height: '64px',
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '18px', fontWeight: 700, color: '#fff' }}>КОРМ</span>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#06B6D4)', flexShrink: 0 }} />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href={TG} target="_blank" rel="noopener noreferrer"
            className="dp-btn-primary" style={{ padding: '10px 22px', fontSize: '14px' }}>
            Написать в Telegram
          </a>
        </div>
      </nav>

      {/* ── BLOCK 1: HERO ─────────────────────────────────────────── */}
      <section style={{
        minHeight: '100svh', paddingTop: '64px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* BG gradient */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse 70% 50% at 20% 50%, rgba(99,102,241,0.1) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(6,182,212,0.07) 0%, transparent 60%), #050505',
        }} />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="dp-container" style={{ position: 'relative', zIndex: 1, padding: '80px 6% 60px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: '12px',
              color: '#6366F1', letterSpacing: '0.1em', marginBottom: '28px',
            }}>
              Серпухов · Мебель на заказ · Маркетинг
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 'clamp(32px, 5.5vw, 72px)',
              fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em',
              color: '#FFFFFF', margin: '0 0 24px', maxWidth: '820px',
            }}
          >
            Постоянные клиенты у вас уже есть.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #06B6D4)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradShift 3s ease infinite',
            }}>
              Поможем найти новых.
            </span>
          </motion.h1>

          {/* Quote-style anti-objection block */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              borderLeft: '2px solid transparent',
              borderImage: 'linear-gradient(180deg, #6366F1, #06B6D4) 1',
              paddingLeft: 'clamp(16px, 2vw, 24px)',
              maxWidth: '600px',
              marginBottom: '40px',
            }}
          >
            <p style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 'clamp(17px, 2.4vw, 22px)',
              fontWeight: 600, color: '#FFFFFF',
              lineHeight: 1.4, margin: '0 0 14px',
              letterSpacing: '-0.01em',
            }}>
              Постоянные клиенты дают <span style={{ color: '#A0A0A0' }}>стабильность.</span><br />
              Новые — <span style={{
                background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>развитие.</span><br />
              Одно не заменяет другое — это работает вместе.
            </p>
            <p style={{
              fontFamily: 'Inter,sans-serif',
              fontSize: 'clamp(13px, 1.7vw, 15px)',
              color: '#7A7A7A', lineHeight: 1.6, margin: 0,
            }}>
              Сарафан — это потолок. Яндекс Карты и сайт — это рост.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '20px' }}
          >
            <a href="#cta" className="dp-btn-primary"
              style={{ fontSize: 'clamp(14px, 2vw, 16px)', padding: 'clamp(14px,2vw,18px) clamp(24px,3vw,36px)' }}>
              Заказать продвижение бизнеса
            </a>
            <a href={TG} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: 'Inter,sans-serif', fontSize: '15px',
                color: '#A0A0A0', textDecoration: 'none',
                transition: 'color 0.2s', padding: '4px 0',
              }}
              onMouseEnter={e => e.target.style.color = '#6366F1'}
              onMouseLeave={e => e.target.style.color = '#A0A0A0'}
            >
              или сразу написать в Telegram →
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: '12px',
              color: '#4A4A4A', marginBottom: '0',
            }}
          >
            По договору · С гарантией
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          animation: 'bounce 2s ease-in-out infinite',
          zIndex: 1,
        }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#3A3A3A', letterSpacing: '0.1em', margin: 0 }}>Узнать больше</p>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ── BLOCK 2: STATS ───────────────────────────────────────── */}
      <section className="dp-section" style={{ background: '#0A0A0A', borderTop: '1px solid #1E1E1E', borderBottom: '1px solid #1E1E1E' }}>
        <div className="dp-container">
          <Reveal>
            <Label>рынок серпухова</Label>
            <h2 className="dp-h2" style={{ marginBottom: '48px' }}>
              Что происходит на рынке мебели на заказ<br />
              <span style={{ color: '#6366F1' }}>в Серпухове прямо сейчас</span>
            </h2>
          </Reveal>

          <div className="dp-stats-grid" ref={statsRef}>
            {[
              {
                num: '9 из 10',
                label: 'клиентов изучают компанию онлайн перед обращением',
                desc: 'Карточка в Яндексе, портфолио, отзывы, сайт — всё это смотрят до того как написать или приехать на замер.',
                color: '#6366F1',
              },
              {
                num: 'от 4,7★',
                label: 'рейтинг, которому доверяют',
                desc: 'При рейтинге ниже 4.5 клиент уходит к конкуренту. Один негативный отзыв обрушивает то, что копилось годами.',
                color: '#8B5CF6',
              },
              {
                num: '8 сек',
                label: 'у вашего сайта на первое впечатление',
                desc: 'Если за 8 секунд сайт не вызвал доверия — клиент закрыл вкладку.',
                color: '#06B6D4',
              },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="dp-card" style={{ height: '100%' }}>
                  <div style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700,
                    color: s.color, lineHeight: 1, marginBottom: '12px',
                    letterSpacing: '-0.02em',
                  }}>{s.num}</div>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '10px', lineHeight: 1.4 }}>{s.label}</p>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: '#6A6A6A', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div style={{
              marginTop: '40px', padding: '24px 32px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.05))',
              border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 600,
                color: '#FFFFFF', margin: 0,
              }}>
                Доверие к мебельщику начинается <span style={{ color: '#6366F1' }}>до первого замера.</span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BLOCK 3: PAIN POINTS ─────────────────────────────────── */}
      <section className="dp-section">
        <div className="dp-container">
          <Reveal>
            <Label>узнаёте?</Label>
            <h2 className="dp-h2" style={{ marginBottom: '48px' }}>Узнаёте ситуацию?</h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '720px' }}>
            {PAINS.map((pain, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div style={{
                  display: 'flex', gap: '14px', alignItems: 'flex-start',
                  padding: '18px 20px', background: '#0A0A0A',
                  border: '1px solid #1E1E1E', borderRadius: '12px',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#2E2E2E'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#1E1E1E'}
                >
                  <div style={{ marginTop: '2px', flexShrink: 0 }}><IconX /></div>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 'clamp(14px, 1.8vw, 15px)', color: '#C0C0C0', lineHeight: 1.6, margin: 0 }}>{pain}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '16px', color: '#A0A0A0', margin: 0 }}>
                Если узнали хотя бы 2–3 пункта — посмотрите что я предлагаю.
              </p>
              <span style={{ color: '#6366F1', fontSize: '20px' }}>↓</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BLOCK 3.5: EXAMPLES ──────────────────────────────────── */}
      <section className="dp-section" style={{ background: '#0A0A0A', borderTop: '1px solid #1E1E1E', borderBottom: '1px solid #1E1E1E' }}>
        <div className="dp-container">
          <Reveal>
            <Label>как это выглядит</Label>
            <h2 className="dp-h2">Покажу на примерах</h2>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 'clamp(15px, 2vw, 17px)', color: '#A0A0A0', lineHeight: 1.7, maxWidth: '620px', marginBottom: '48px' }}>
              Карточка в Яндекс.Картах приводит клиента. Сайт убеждает остаться.
            </p>
          </Reveal>

          <div className="dp-two-col">
            {/* LEFT: Yandex Maps Example */}
            <Reveal delay={0} fullHeight>
              <div className="dp-card" style={{ height: '100%', borderColor: 'rgba(99,102,241,0.3)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px',
                  }}>📍</div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    Карточка в Яндекс.Картах
                  </h3>
                </div>

                {/* Phone-style screenshot in 16/10 stage */}
                <button
                  type="button"
                  onClick={() => setLightbox('/promo/ya-furniture.png')}
                  style={{
                    aspectRatio: '16/10',
                    background: '#0A0A0F',
                    border: '1px solid #2A2A35',
                    borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '16px',
                    overflow: 'hidden',
                    margin: '0 0 24px',
                    cursor: 'zoom-in', position: 'relative',
                    transition: 'border-color 0.2s',
                    width: '100%',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A35' }}
                >
                  <img
                    src="/promo/ya-furniture.png"
                    alt="Карточка мебельной компании в Яндекс.Картах — Серпухов"
                    loading="lazy"
                    style={{
                      height: '100%', maxWidth: '100%', width: 'auto',
                      objectFit: 'contain',
                      borderRadius: '14px',
                      border: '4px solid #1A1A22',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                      background: '#FFFFFF',
                    }}
                  />
                  <span style={{
                    position: 'absolute', bottom: '10px', right: '10px',
                    padding: '4px 8px', background: 'rgba(0,0,0,0.6)',
                    borderRadius: '6px', fontSize: '10px',
                    color: '#A0A0A0', fontFamily: "'JetBrains Mono',monospace",
                  }}>🔍 увеличить</span>
                </button>

                <p style={{
                  fontFamily: 'Inter,sans-serif', fontSize: '14px',
                  color: '#A0A0A0', lineHeight: 1.6, marginBottom: '20px',
                }}>
                  Это первое, что видит клиент, когда ищет мебель в Серпухове. От рейтинга, фото и отзывов зависит — позвонит он или уйдёт к конкуренту.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                  {[
                    'Появляетесь в поиске Карт выше конкурентов',
                    'Клиент видит реальные отзывы и свежие фото',
                    'Один тап — звонок или маршрут к вам',
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ marginTop: '2px', flexShrink: 0 }}><IconCheck /></div>
                      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#C0C0C0', margin: 0, lineHeight: 1.5 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* RIGHT: Site Example */}
            <Reveal delay={0.1} fullHeight>
              <div className="dp-card" style={{ height: '100%', borderColor: 'rgba(6,182,212,0.3)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(6,182,212,0.12)',
                    border: '1px solid rgba(6,182,212,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px',
                  }}>🌐</div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    Сайт на Tilda
                  </h3>
                </div>

                {/* Browser mockup — total 16/10 height */}
                <button
                  type="button"
                  onClick={() => setLightbox('/promo/site_furniture.jpg')}
                  style={{
                    position: 'relative', width: '100%',
                    aspectRatio: '16/10',
                    margin: '0 0 24px',
                    background: '#0F0F14',
                    border: '1px solid #2A2A35',
                    borderRadius: '14px',
                    overflow: 'hidden', padding: 0, cursor: 'zoom-in',
                    display: 'flex', flexDirection: 'column',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#06B6D4' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A35' }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '10px 14px', background: '#13131A',
                    borderBottom: '1px solid #2A2A35', flexShrink: 0,
                  }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FEBC2E' }} />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28C840' }} />
                    <div style={{
                      flex: 1, marginLeft: '10px', height: '20px',
                      background: '#0A0A0F', borderRadius: '6px',
                      display: 'flex', alignItems: 'center', padding: '0 10px',
                    }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#5A5A6A' }}>mebel-serpuhov.ru</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, position: 'relative', background: '#FAF7F2', overflow: 'hidden' }}>
                    <img
                      src="/promo/site_furniture.jpg"
                      alt="Сайт мебельной компании — пример"
                      loading="lazy"
                      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                    />
                  </div>
                  <span style={{
                    position: 'absolute', bottom: '10px', right: '10px',
                    padding: '4px 8px', background: 'rgba(0,0,0,0.6)',
                    borderRadius: '6px', fontSize: '10px',
                    color: '#A0A0A0', fontFamily: "'JetBrains Mono',monospace",
                  }}>🔍 увеличить</span>
                </button>

                <p style={{
                  fontFamily: 'Inter,sans-serif', fontSize: '14px',
                  color: '#A0A0A0', lineHeight: 1.6, marginBottom: '20px',
                }}>
                  Сюда попадает клиент после Карт или поиска. Сайт показывает товар, цены и условия — клиент понимает что вам можно доверять и едет заказывать.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                  {[
                    'Понятная структура: услуги, цены, контакты',
                    'Адаптируется под телефон автоматически',
                    'Можно вносить правки самостоятельно по инструкции',
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ marginTop: '2px', flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#C0C0C0', margin: 0, lineHeight: 1.5 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <p style={{
              fontFamily: 'Inter,sans-serif', fontSize: 'clamp(15px, 2vw, 17px)',
              color: '#A0A0A0', lineHeight: 1.7, textAlign: 'center',
              maxWidth: '720px', margin: '40px auto 0',
            }}>
              Когда оба инструмента работают вместе — клиент находит вас в Картах, переходит на сайт, выбирает и понимает что вам можно доверять. И едет заказывать к вам, а не к конкурентам. <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Это и есть тот самый поток новых клиентов.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── BLOCK 4: SOLUTION ────────────────────────────────────── */}
      <section className="dp-section" style={{ background: '#080808' }}>
        <div className="dp-container">
          <Reveal>
            <Label>решение</Label>
            <h2 className="dp-h2">Два инструмента. Один результат —</h2>
            <h2 className="dp-h2" style={{ color: '#6366F1', marginBottom: '16px' }}>поток новых заказов на мебель.</h2>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 'clamp(15px, 2vw, 17px)', color: '#A0A0A0', lineHeight: 1.7, maxWidth: '620px', marginBottom: '48px' }}>
              Карточка в Яндекс.Картах и сайт компании работают в связке. Карточка приводит человека, сайт-портфолио его убеждает.
            </p>
          </Reveal>

          <div className="dp-two-col">
            {/* Card A: Yandex Maps */}
            <Reveal delay={0} fullHeight>
              <div className="dp-card" style={{ height: '100%', borderColor: 'rgba(99,102,241,0.3)', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  display: 'inline-flex', padding: '8px 14px', borderRadius: '100px',
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                  marginBottom: '20px',
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#6366F1', letterSpacing: '0.06em' }}>ЯНДЕКС.КАРТЫ</span>
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px' }}>
                  Карточка под ключ + продвижение
                </h3>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#6366F1', margin: '0 0 24px' }}>
                  Поднимаем карточку в поиске выше и делаем заметнее
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', flex: 1 }}>
                  {MAPS_LIST.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ marginTop: '2px', flexShrink: 0 }}><IconCheck /></div>
                      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#C0C0C0', margin: 0, lineHeight: 1.5 }}>{item}</p>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid #1E1E1E', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#A0A0A0' }}>Оформление под ключ </span>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: '#4A4A4A', textDecoration: 'line-through' }}>9 000 ₽</span>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: '#6366F1', display: 'block', marginTop: '2px' }}>*Акция до 31.05.2026</span>
                    </div>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>5 000 ₽</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#A0A0A0' }}>Оформление + продвижение </span>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: '#4A4A4A', textDecoration: 'line-through' }}>19 000 ₽</span>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: '#6366F1', display: 'block', marginTop: '2px' }}>*Акция до 31.05.2026</span>
                    </div>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '18px', fontWeight: 700, color: '#6366F1' }}>12 000 ₽/мес</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card B: Site */}
            <Reveal delay={0.1} fullHeight>
              <div className="dp-card" style={{ height: '100%', borderColor: 'rgba(6,182,212,0.3)', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  display: 'inline-flex', padding: '8px 14px', borderRadius: '100px',
                  background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)',
                  marginBottom: '20px',
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#06B6D4', letterSpacing: '0.06em' }}>САЙТ КОМПАНИИ</span>
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px' }}>
                  Сайт компании на Tilda
                </h3>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#06B6D4', margin: '0 0 24px' }}>
                  Который клиенту понятен, а вам легко администрировать
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', flex: 1 }}>
                  {SITE_LIST.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ marginTop: '2px', flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#C0C0C0', margin: 0, lineHeight: 1.5 }}>{item}</p>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid #1E1E1E', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#A0A0A0' }}>Сайт под ключ </span>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: '#4A4A4A', textDecoration: 'line-through' }}>35 000 ₽</span>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: '#6366F1', display: 'block', marginTop: '2px' }}>*Акция до 31.05.2026</span>
                    </div>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>22 000 ₽</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#A0A0A0' }}>Абонент. сопровождение </span>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: '#4A4A4A', textDecoration: 'line-through' }}>8 000 ₽</span>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: '#6366F1', display: 'block', marginTop: '2px' }}>*Акция до 31.05.2026</span>
                    </div>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '18px', fontWeight: 700, color: '#06B6D4' }}>5 000 ₽/мес</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── BLOCK 5: PACKAGE ─────────────────────────────────────── */}
      <section className="dp-section">
        <div className="dp-container">
          <Reveal>
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(6,182,212,0.1) 100%)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '24px', padding: 'clamp(32px, 5vw, 56px)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Glow */}
              <div style={{
                position: 'absolute', top: '-50%', right: '-20%', width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)',
                pointerEvents: 'none',
              }} />

              <div className="dp-package-grid">
                <div>
                  <div style={{
                    display: 'inline-flex', padding: '6px 14px', borderRadius: '100px',
                    background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                    marginBottom: '20px',
                  }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#6366F1', letterSpacing: '0.08em' }}>⭐ ЛУЧШЕЕ ПРЕДЛОЖЕНИЕ</span>
                  </div>
                  <h2 className="dp-h2" style={{ marginBottom: '16px' }}>
                    Комплекс<br />
                    <span style={{
                      background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>«Репутация + Сайт»</span>
                  </h2>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '16px', color: '#A0A0A0', lineHeight: 1.7, marginBottom: '28px', maxWidth: '500px' }}>
                    Клиенты вас видят, доверяют, получают актуальную информацию — этим вы повышаете значимость и ценность своего бренда.
                  </p>

                  {/* First month */}
                  <div style={{
                    padding: '18px 20px',
                    background: 'rgba(99,102,241,0.06)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: '14px',
                    marginBottom: '14px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#6366F1', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>1-й месяц · старт</span>
                      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '20px', fontWeight: 700, color: '#FFFFFF' }}>34 000 ₽</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        ['Сайт на Tilda под ключ', '22 000 ₽'],
                        ['Проработка карточки + продвижение', '12 000 ₽'],
                      ].map(([label, price], i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <IconCheck />
                            <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#C0C0C0' }}>{label}</span>
                          </div>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#6A6A6A' }}>{price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recurring */}
                  <div style={{
                    padding: '18px 20px',
                    background: 'rgba(6,182,212,0.05)',
                    border: '1px solid rgba(6,182,212,0.18)',
                    borderRadius: '14px',
                    marginBottom: '32px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#06B6D4', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Со 2-го месяца</span>
                      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '20px', fontWeight: 700, color: '#FFFFFF' }}>17 000 ₽<span style={{ fontSize: '14px', color: '#A0A0A0', fontWeight: 500 }}> / мес</span></span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        ['Продвижение карточки Яндекс.Карт', '12 000 ₽'],
                        ['Сопровождение сайта', '5 000 ₽'],
                      ].map(([label, price], i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <IconCheck />
                            <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#C0C0C0' }}>{label}</span>
                          </div>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#6A6A6A' }}>{price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price block — full height on desktop, centered on mobile */}
                <div className="dp-package-price" style={{
                  background: 'rgba(5,5,5,0.6)',
                  border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px',
                  padding: '36px 28px', textAlign: 'center',
                  animation: 'dpPulse 3s ease-in-out infinite',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  alignItems: 'center', height: '100%', minHeight: '320px', gap: '20px',
                }}>
                  <div>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#6366F1', margin: '0 0 8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>1-й месяц</p>
                    <p style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: 'clamp(34px, 5vw, 48px)', fontWeight: 700,
                      background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                      margin: '0 0 6px', lineHeight: 1,
                    }}>34 000 ₽</p>
                    <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: '#A0A0A0', margin: 0 }}>быстрый старт</p>
                  </div>

                  <div style={{ width: '60%', height: '1px', background: '#1E1E1E' }} />

                  <div>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#06B6D4', margin: '0 0 8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Дальше</p>
                    <p style={{
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 700,
                      color: '#FFFFFF',
                      margin: 0, lineHeight: 1,
                    }}>17 000 ₽<span style={{ fontSize: '14px', color: '#A0A0A0', fontWeight: 500 }}> /мес</span></p>
                  </div>

                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#6366F1', margin: 0 }}>
                    стабильный рост и продвижение
                  </p>

                  <a href="#cta" className="dp-btn-primary" style={{ width: '100%', fontSize: '15px' }}>
                    Забронировать комплекс
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BLOCK 6: EXTRA SERVICES ──────────────────────────────── */}
      <section className="dp-section" style={{ background: '#0A0A0A', borderTop: '1px solid #1E1E1E' }}>
        <div className="dp-container">
          <Reveal>
            <Label>отдельно</Label>
            <h2 className="dp-h2" style={{ marginBottom: '40px' }}>Если нужно что-то отдельное</h2>
          </Reveal>
          <div className="dp-three-col">
            {[
              {
                icon: '📈',
                title: 'SEO-продвижение сайта',
                desc: 'Системная работа над ростом позиций по запросам "кухни на заказ серпухов", "шкафы-купе серпухов", "мебель на заказ серпухов" и связанным',
                price: '25 000 ₽/мес',
              },
              {
                icon: '✨',
                title: 'Дизайнерский сайт на коде',
                desc: 'С анимациями, индивидуальным дизайном. Для премиум-сегмента, желающих выделиться среди федеральных сетей.',
                price: '50 000 ₽',
                old: '73 000 ₽',
              },
              {
                icon: '🔧',
                title: 'Доработки и точечные задачи',
                desc: 'Telegram-бот, правки на сайте, настройка рекламы, дизайн объявлений для расклейки в новостройках, аналитика, скрипты продаж',
                price: '5 000 ₽/мес',
              },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1} fullHeight>
                <div className="dp-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '28px', marginBottom: '14px' }}>{s.icon}</div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '17px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px' }}>{s.title}</h3>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#6A6A6A', lineHeight: 1.6, margin: '0 0 16px', flex: 1 }}>{s.desc}</p>
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '18px', fontWeight: 700, color: '#6366F1' }}>{s.price}</span>
                      {s.old && <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: '#3A3A3A', textDecoration: 'line-through' }}>{s.old}</span>}
                    </div>
                    {s.old && <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: '#6366F1', margin: '4px 0 0' }}>*Акция до 31.05.2026</p>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOCK 7: PROCESS ─────────────────────────────────────── */}
      <section className="dp-section">
        <div className="dp-container">
          <Reveal>
            <Label>как работаем</Label>
            <h2 className="dp-h2">Как мы будем работать</h2>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '17px', color: '#A0A0A0', lineHeight: 1.6, marginBottom: '48px', maxWidth: '560px' }}>
              Без сюрпризов. Понятные этапы, фиксированная цена, поэтапная оплата.
            </p>
          </Reveal>
          <div className="dp-process-grid">
            {PROCESS.map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
                  }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.1))',
                      border: '1px solid rgba(99,102,241,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'JetBrains Mono',monospace", fontSize: '14px',
                      fontWeight: 700, color: '#6366F1', flexShrink: 0,
                    }}>{step.num}</div>
                    <div>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '17px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>{step.title}</p>
                      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#6366F1', margin: 0 }}>{step.time}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {step.items.map((item, j) => (
                      <p key={j} style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#7A7A7A', margin: 0, lineHeight: 1.5, paddingLeft: '4px', borderLeft: '2px solid #1E1E1E' }}>{item}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOCK 8: ABOUT ───────────────────────────────────────── */}
      <section className="dp-section" style={{ background: '#080808', borderTop: '1px solid #1E1E1E' }}>
        <div className="dp-container">
          <Reveal>
            <Label>кто я</Label>
          </Reveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'flex-start' }}>
            {/* Photo */}
            <Reveal delay={0}>
              <div style={{
                width: 'clamp(200px, 30vw, 300px)',
                height: 'clamp(250px, 35vw, 360px)',
                borderRadius: '20px', overflow: 'hidden',
                border: '1px solid #1E1E1E', flexShrink: 0,
                position: 'relative',
              }}>
                <img src="/about-photo.png" alt="Роман, digital-маркетолог, Серпухов"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(5,5,5,0.6) 0%, transparent 50%)',
                }} />
              </div>
            </Reveal>

            {/* Text */}
            <Reveal delay={0.1}>
              <div style={{ flex: '1 1 320px' }}>
                <h2 className="dp-h2" style={{ marginBottom: '20px' }}>Про меня коротко</h2>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '16px', color: '#A0A0A0', lineHeight: 1.8, marginBottom: '24px' }}>
                  Занимаюсь интернет-маркетингом для бизнеса в Серпухове и МО с 2021 года. Делаю сайты, веду карточки на Яндекс.Картах, настраиваю рекламу.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  {[
                    'Вывел проект в ТОП-10 Москвы за 3 месяца в высококонкурентной нише',
                    'Сделал десятки сайтов и рекламных кампаний для малого бизнеса МО',
                    'Доверяют как локальные компании, так и крупные проекты в Москве',
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <IconCheck />
                      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '15px', color: '#C0C0C0', margin: 0, lineHeight: 1.6 }}>{item}</p>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '15px', color: '#7A7A7A', lineHeight: 1.7, marginBottom: '28px' }}>
                  Работаю как самозанятый, по договору. Не агентство — со мной можно встретиться лично, без менеджеров и долгих согласований.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                  {[['5 лет', 'в маркетинге'], ['30+', 'проектов'], ['+23%', 'средний прирост клиентов']].map(([num, label]) => (
                    <div key={label} style={{
                      padding: '24px 28px', background: '#0F0F0F',
                      border: '1px solid #1E1E1E', borderRadius: '16px', textAlign: 'center',
                      minWidth: '170px', flex: '1 1 170px', maxWidth: '220px',
                    }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(28px, 3.5vw, 36px)', fontWeight: 700, color: '#6366F1', margin: '0 0 6px', lineHeight: 1 }}>{num}</p>
                      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: '#A0A0A0', margin: 0, lineHeight: 1.4 }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── BLOCK 9: FAQ ─────────────────────────────────────────── */}
      <section className="dp-section">
        <div className="dp-container">
          <Reveal>
            <Label>вопросы</Label>
            <h2 className="dp-h2" style={{ marginBottom: '48px' }}>Частые вопросы</h2>
          </Reveal>
          <div style={{ maxWidth: '760px' }}>
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <FaqItem q={faq.q} a={faq.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── URGENCY BLOCK ────────────────────────────────────────── */}
      <section className="dp-section" style={{ padding: '64px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Animated red glow background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(239,68,68,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'dpGlow 2.5s ease-in-out infinite',
        }} />
        <div className="dp-container" style={{ position: 'relative' }}>
          <Reveal>
            <div style={{
              border: '1px solid rgba(239,68,68,0.35)',
              borderRadius: '24px',
              padding: 'clamp(28px, 5vw, 48px)',
              background: 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(5,5,5,0.4) 100%)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Pulsing dot */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '6px 14px', borderRadius: '100px',
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.35)',
                marginBottom: '20px',
              }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#EF4444', flexShrink: 0,
                  animation: 'urgPulse 1.4s ease-in-out infinite',
                  boxShadow: '0 0 10px rgba(239,68,68,0.8)',
                }} />
                <span style={{
                  fontFamily: "'JetBrains Mono',monospace", fontSize: '11px',
                  color: '#EF4444', letterSpacing: '0.1em', fontWeight: 600,
                }}>ВНИМАНИЕ</span>
              </div>

              <h2 className="dp-h2" style={{ marginBottom: '20px', maxWidth: '820px' }}>
                По акции беру{' '}
                <span style={{ color: '#EF4444', position: 'relative', display: 'inline-block' }}>
                  только 5 проектов
                  <svg viewBox="0 0 200 8" style={{
                    position: 'absolute', left: 0, bottom: '-6px',
                    width: '100%', height: '6px',
                  }}>
                    <path d="M 0 4 Q 100 0 200 4" stroke="#EF4444" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
                {' '}— дальше по обычной цене
              </h2>

              <p style={{
                fontFamily: 'Inter,sans-serif', fontSize: 'clamp(15px, 2vw, 17px)',
                color: '#C0C0C0', lineHeight: 1.7, marginBottom: '28px', maxWidth: '720px',
              }}>
                Действующая акция распространяется только на <span style={{ color: '#FFFFFF', fontWeight: 600 }}>5 проектов</span>. <span style={{ color: '#FFFFFF', fontWeight: 600 }}>2 уже заняты, осталось 3 свободных слота</span>. Кто успел — заходит в работу по сниженной цене. После — стоимость возвращается к обычной.
              </p>

              {/* Slot progress */}
              <div style={{ marginBottom: '24px', maxWidth: '480px' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '10px',
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#A0A0A0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Слотов по акции</span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                    <span style={{ color: '#10B981' }}>3</span>
                    <span style={{ color: '#5A5A5A' }}> / 5</span>
                  </span>
                </div>
                <div style={{
                  display: 'flex', gap: '6px',
                }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} style={{
                      flex: 1, height: '10px', borderRadius: '4px',
                      background: n <= 2 ? '#EF4444' : 'rgba(16,185,129,0.2)',
                      border: n <= 2 ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(16,185,129,0.4)',
                      boxShadow: n > 2 ? '0 0 10px rgba(16,185,129,0.3)' : 'none',
                      animation: n > 2 ? 'urgPulse 2s ease-in-out infinite' : 'none',
                    }} />
                  ))}
                </div>
              </div>

              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '12px',
                marginBottom: '28px', alignItems: 'center',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 18px',
                  background: 'rgba(239,68,68,0.06)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: '12px',
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#A0A0A0' }}>Занято:</span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '15px', fontWeight: 700, color: '#EF4444' }}>2</span>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 18px',
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: '12px',
                }}>
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: '#10B981', flexShrink: 0,
                    boxShadow: '0 0 12px rgba(16,185,129,0.6)',
                    animation: 'urgPulse 1.6s ease-in-out infinite',
                  }} />
                  <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#A0A0A0' }}>Свободно:</span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '15px', fontWeight: 700, color: '#10B981' }}>3 слота</span>
                </div>
              </div>

              {/* Savings highlight */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
                padding: '16px 22px', marginBottom: '24px',
                background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(99,102,241,0.06))',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '14px',
              }}>
                <div style={{
                  fontSize: '28px', lineHeight: 1, flexShrink: 0,
                }}>💰</div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#10B981', margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                    Если успеете — экономия
                  </p>
                  <p style={{
                    fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(20px, 3vw, 26px)',
                    fontWeight: 700, color: '#FFFFFF', margin: 0, lineHeight: 1.2,
                  }}>до <span style={{ color: '#10B981' }}>27 000 ₽</span> на старте</p>
                </div>
                <p style={{
                  fontFamily: 'Inter,sans-serif', fontSize: '12px',
                  color: '#7A7A7A', margin: 0, lineHeight: 1.5, maxWidth: '180px',
                }}>+ постоянная скидка 10 000 ₽/мес на сопровождении</p>
              </div>

              <div className="dp-urg-cta">
                <a href="#cta" className="dp-btn-primary" style={{ fontSize: '15px' }}>
                  Занять место →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
        <style>{`
          @keyframes urgPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.4); opacity: 0.6; }
          }
        `}</style>
      </section>

      {/* ── BLOCK 10: FINAL CTA ──────────────────────────────────── */}
      <section id="cta" className="dp-section" style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(5,5,5,1) 50%, rgba(6,182,212,0.06) 100%)',
        borderTop: '1px solid #1E1E1E',
      }}>
        <div className="dp-container" style={{ textAlign: 'center' }}>
          <Reveal>
            <Label>финал</Label>
            <h2 className="dp-h2" style={{ maxWidth: '720px', margin: '0 auto 20px' }}>
              Составим план работ для вашей компании за{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>15 минут</span>
            </h2>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '17px', color: '#A0A0A0', marginBottom: '48px' }}>
              Бесплатно. Без обязательств. После звонка вы решите — нужно вам это или нет.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{
              maxWidth: '480px', margin: '0 auto',
              background: '#0A0A0A', border: '1px solid #1E1E1E',
              borderRadius: '24px', padding: 'clamp(28px, 4vw, 44px)',
            }}>
              {formSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '20px 0' }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>Заявка получена!</p>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '15px', color: '#A0A0A0' }}>Свяжусь в течение часа. Я в Серпухове.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '20px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px', textAlign: 'left' }}>
                    Оставить заявку
                  </h3>
                  <input
                    type="text" name="website" tabIndex="-1" autoComplete="off"
                    value={form.website || ''}
                    onChange={e => setForm({ ...form, website: e.target.value })}
                    style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                    aria-hidden="true"
                  />
                  {[
                    { name: 'name', placeholder: 'Название компании' },
                    { name: 'contact', placeholder: 'Телефон или Telegram' },
                  ].map(({ name, placeholder }) => (
                    <input
                      key={name} name={name} required
                      value={form[name]}
                      onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                      placeholder={placeholder}
                      style={{
                        background: '#050505', border: '1px solid #1E1E1E',
                        borderRadius: '12px', padding: '14px 18px',
                        color: '#FFFFFF', fontFamily: 'Inter,sans-serif',
                        fontSize: '15px', outline: 'none', width: '100%',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#6366F1'}
                      onBlur={e => e.target.style.borderColor = '#1E1E1E'}
                    />
                  ))}
                  {formError && (
                    <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: '#EF4444', margin: 0 }}>{formError}</p>
                  )}
                  <label style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    marginTop: '4px', cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'Inter,sans-serif', fontSize: '12px',
                    color: '#A0A0A0', lineHeight: 1.5,
                  }}>
                    <input
                      type="checkbox" checked={formAgree}
                      onChange={(e) => setFormAgree(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#6366F1', flexShrink: 0, marginTop: '2px', cursor: 'pointer' }}
                    />
                    <span>
                      Я соглашаюсь с{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#6366F1', textDecoration: 'none' }}>
                        политикой конфиденциальности
                      </a>{' '}и обработкой персональных данных
                    </span>
                  </label>
                  <button type="submit" disabled={formBusy} className="dp-btn-primary"
                    style={{ width: '100%', padding: '16px', fontSize: '16px', marginTop: '4px', opacity: formBusy ? 0.7 : 1 }}>
                    {formBusy ? 'Отправляю...' : 'Свяжитесь со мной →'}
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
              <a href={PHONE_HREF} className="dp-btn-outline" style={{ fontSize: '16px' }}>
                📞 {PHONE}
              </a>
              <a href={TG} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: 'Inter,sans-serif', fontSize: '15px', color: '#A0A0A0', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#6366F1'}
                onMouseLeave={e => e.target.style.color = '#A0A0A0'}
              >
                Написать в Telegram → @korm_marketing
              </a>
            </div>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#4A4A4A', marginTop: '16px' }}>
              Отвечу в течение часа. Я в Серпухове, приеду на встречу.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── LIGHTBOX ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.92)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px', cursor: 'zoom-out',
            }}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Закрыть"
              style={{
                position: 'absolute', top: '20px', right: '20px',
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#FFFFFF', fontSize: '22px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >×</button>
            <motion.img
              src={lightbox}
              alt=""
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: '95vw', maxHeight: '92vh',
                borderRadius: '12px', boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                cursor: 'default',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #1E1E1E', padding: '32px 6%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', background: '#050505' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>КОРМ</span>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#06B6D4)' }} />
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#6366F1' }}>маркетинг</span>
        </a>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#3A3A3A' }}>
          © {new Date().getFullYear()} · Серпухов
        </span>
        <a href="/privacy" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#3A3A3A', textDecoration: 'none' }}>
          Политика конфиденциальности
        </a>
      </footer>
    </div>
  )
}

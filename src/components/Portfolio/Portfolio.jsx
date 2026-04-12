import { useRef, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

// ── Data ─────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    title: 'АвтоМастер',
    type: 'Лендинг · Автосервис',
    category: 'sites',
    gradient: 'linear-gradient(135deg, #1A1510, #2A2318)',
    textColor: 'white',
    description: 'Сделал продающий лендинг для автосервиса в Серпухове. Упор на онлайн-запись и доверие: реальные мастера, гарантии, прозрачные цены.',
    done: [
      'Разработал лендинг с нуля за 3 дня',
      'Онлайн-форма записи с уведомлением в Telegram',
      'Адаптив под мобильные',
      'Подключил Яндекс Метрику и цели',
      'Скорость 95+ PageSpeed',
    ],
    stats: { time: '3 дня', conversion: '6.8%', leads: '38/мес' },
    stack: ['HTML', 'CSS', 'JS', 'GSAP'],
    preview: '/portfolio/auto_lend/index.html',
    link: '/portfolio/auto_lend/index.html',
  },
  {
    id: 2,
    title: 'Dental Club',
    type: 'Лендинг · Стоматология',
    category: 'sites',
    gradient: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
    textColor: '#1A1A1A',
    description: 'Сделал премиальный лендинг для стоматологии в Серпухове. Минималистичный дизайн уровня европейских клиник — акцент на врачей, доверие и бесплатный первичный осмотр.',
    done: [
      'Дизайн в стиле premium-медицины',
      'Аккордеон услуг с ценами',
      'Блок врачей с биографиями',
      'Форма записи на приём',
      'Адаптив и оптимизация скорости',
    ],
    stats: { time: '4 дня', conversion: '9.2%', leads: '52/мес' },
    stack: ['HTML', 'CSS', 'JS'],
    preview: '/portfolio/dental_lend/index.html',
    link: '/portfolio/dental_lend/index.html',
  },
  {
    id: 3,
    title: 'PLAST Потолки',
    type: 'Лендинг · Натяжные потолки',
    category: 'sites',
    gradient: 'linear-gradient(135deg, #1A1A2E, #16213E)',
    textColor: 'white',
    description: 'Сделал лендинг для компании натяжных потолков. Стиль премиум-студии, интерактивный калькулятор стоимости — клиент считает цену сам и сразу оставляет заявку.',
    done: [
      'Премиум дизайн под архитектурное бюро',
      'Калькулятор стоимости в реальном времени',
      'Карусель материалов drag-to-scroll',
      'Форма вызова замерщика',
      'Таймлайн процесса работы',
    ],
    stats: { time: '4 дня', conversion: '7.4%', leads: '31/мес' },
    stack: ['HTML', 'CSS', 'JS'],
    preview: '/portfolio/plast_lend/index.html',
    link: '/portfolio/plast_lend/index.html',
  },
  {
    id: 4,
    title: 'CleanSpace',
    type: 'Лендинг · Клининг',
    category: 'sites',
    gradient: 'linear-gradient(135deg, #022C22, #064E3B)',
    textColor: 'white',
    description: 'Сделал лендинг для клининговой компании с анимациями которых нет у конкурентов. Canvas-пузырьки в hero, живой счётчик уборок, трёхшаговый калькулятор.',
    done: [
      'Canvas анимация пузырьков в hero',
      'Живой счётчик выполненных уборок',
      'Калькулятор стоимости 3 шага',
      '3D flip карточки услуг',
      'Анимированный трек статуса после заявки',
    ],
    stats: { time: '5 дней', conversion: '11.2%', leads: '67/мес' },
    stack: ['HTML', 'CSS', 'JS', 'Canvas'],
    preview: '/portfolio/clean_lend/index.html',
    link: '/portfolio/clean_lend/index.html',
  },
  {
    id: 5,
    title: 'КАРГО',
    type: 'Лендинг · Грузоперевозки',
    category: 'sites',
    gradient: 'linear-gradient(135deg, #1C0A00, #431407)',
    textColor: 'white',
    description: 'Сделал лендинг для логистической компании. Брутальный стиль без мультяшности, калькулятор стоимости с выбором типа авто, грузчиков и расстояния.',
    done: [
      'Индустриальный дизайн без мультяшности',
      'Калькулятор с типом авто и расстоянием',
      'SVG карта зон доставки',
      'Анимированный таймлайн процесса',
      'Drag-скролл отзывов',
    ],
    stats: { time: '4 дня', conversion: '5.9%', leads: '28/мес' },
    stack: ['HTML', 'CSS', 'JS', 'SVG'],
    preview: '/portfolio/gruz_lend/index.html',
    link: '/portfolio/gruz_lend/index.html',
  },
  {
    id: 6,
    title: 'BRUTAL CUT',
    type: 'Лендинг · Барбершоп',
    category: 'sites',
    gradient: 'linear-gradient(135deg, #1A0A00, #2D1B00)',
    textColor: 'white',
    description: 'Сделал тёмный лендинг для барбершопа. Стиль Peaky Blinders — онлайн-запись к конкретному мастеру, аккордеон услуг с ценами.',
    done: [
      'Тёмный дизайн с золотыми акцентами',
      'Форма онлайн-записи к мастеру',
      'Аккордеон услуг с ценами',
      'Блок мастеров с специализацией',
      'Drag-скролл отзывов',
    ],
    stats: { time: '4 дня', conversion: '8.7%', leads: '44/мес' },
    stack: ['HTML', 'CSS', 'JS', 'GSAP'],
    preview: '/portfolio/barber_land/index.html',
    link: '/portfolio/barber_land/index.html',
  },
  {
    id: 8,
    title: 'Авито · Автосервис',
    type: 'Кейс · Авито продвижение',
    category: 'ads',
    gradient: 'linear-gradient(135deg, #000428, #004E92)',
    textColor: 'white',
    description: 'Автосервис в Серпухове получал 8–12 звонков в месяц с Авито. Переупаковал профиль, написал продающие объявления, настроил платное продвижение. Через месяц — 34 звонка.',
    done: [
      'Аудит и полная переупаковка профиля',
      '10 продающих объявлений с живыми фото',
      'Настройка платного продвижения',
      'Паралельно оформил Яндекс Карты',
      'Мониторинг позиций каждую неделю',
    ],
    stats: { time: '14 дней', conversion: 'CTR: 12.4%', leads: '34/мес' },
    stack: ['Авито', 'Яндекс Карты', 'Canva'],
    image: '/portfolio-avito.png',
    preview: null,
    link: null,
  },
  {
    id: 9,
    title: 'TG Bot · Косметология',
    type: 'Кейс · Автоматизация',
    category: 'auto',
    gradient: 'linear-gradient(135deg, #0F2027, #203A43)',
    textColor: 'white',
    description: 'Мастер-косметолог тратила 2–3 часа в день на запись клиентов вручную. Написал Telegram-бот: принимает заявки, ведёт расписание, отправляет напоминания. Теперь запись идёт 24/7 без участия мастера.',
    done: [
      'Разработал Telegram-бота на Python',
      'Интеграция с Google Sheets — расписание онлайн',
      'Автоматические напоминания клиентам за 24ч',
      'Уведомления мастеру о новых записях',
      'Простое управление расписанием из бота',
    ],
    stats: { time: '7 дней', conversion: '+18 записей', leads: '−2.5ч/день' },
    stack: ['Python', 'Telegram API', 'Google Sheets'],
    image: '/portfolio-tgbot.png',
    preview: null,
    link: null,
  },
  {
    id: 10,
    title: 'Яндекс Карты · Стоматология',
    type: 'Кейс · Локальное продвижение',
    category: 'ads',
    gradient: 'linear-gradient(135deg, #FF4D00, #FF6B35)',
    textColor: 'white',
    tag: 'Серпухов · 14 дней',
    description: 'Стоматология в Серпухове была на 8-й странице Яндекс Карт — клиенты просто не доходили до неё. Полностью переупаковал карточку: фото, описание, услуги, цены, ответы на отзывы. Подключил платное продвижение. Через 2 недели клиника вошла в ТОП-3.',
    done: [
      'Полное заполнение карточки организации',
      'Загрузка 40+ профессиональных фото',
      'Прописал все услуги с ценами',
      'Ответил на все старые отзывы',
      'Стратегия получения новых отзывов',
      'Подключил платное продвижение',
      'Еженедельный мониторинг позиций',
    ],
    results: [
      { label: 'Позиция в картах', value: 'ТОП-3', accent: true },
      { label: 'Звонков в месяц', value: '+67%', accent: false },
      { label: 'Срок результата', value: '14 дней', accent: false },
    ],
    stats: { time: '14 дней', conversion: 'ТОП-3', leads: '+67% звонков' },
    quote: '"Люди говорят что нашли нас в Яндексе. Раньше такого вообще не было — только сарафан."',
    quoteAuthor: 'Администратор клиники',
    stack: ['Яндекс Карты', 'Яндекс Бизнес', 'Canva'],
    image: '/portfolio-maps.png',
    preview: null,
    link: null,
  },
]

const FILTERS = [
  { label: 'Все',           value: 'all'   },
  { label: 'Сайты',         value: 'sites' },
  { label: 'Реклама',       value: 'ads'   },
  { label: 'Автоматизация', value: 'auto'  },
]

// ── Check item ───────────────────────────────────────────────────────
function CheckItem({ text }) {
  return (
    <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
      <span style={{ color: '#6366F1', flexShrink: 0, marginTop: '1px', fontSize: '15px' }}>✓</span>
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#A0A0A0', lineHeight: 1.5 }}>
        {text}
      </span>
    </li>
  )
}

// ── Browser preview mockup ───────────────────────────────────────────
function BrowserPreview({ src, gradient }) {
  const [loaded, setLoaded] = useState(false)
  const [cacheBuster] = useState(() => Date.now())
  const containerRef = useRef(null)

  // URL to show in the address bar (just the filename/path without leading slash)
  const displayUrl = src.replace(/^\/portfolio\//, '').replace('/index.html', '') + '.ru'

  return (
    <div style={{
      width: '100%', height: '320px',
      background: '#141414',
      borderBottom: '1px solid #1E1E1E',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Browser chrome bar */}
      <div style={{
        height: '40px', flexShrink: 0,
        background: '#1C1C1C',
        borderBottom: '1px solid #2A2A2A',
        display: 'flex', alignItems: 'center',
        padding: '0 16px', gap: '12px',
      }}>
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: '7px', flexShrink: 0 }}>
          <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#FF5F56', display: 'block' }} />
          <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#FFBD2E', display: 'block' }} />
          <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#27C93F', display: 'block' }} />
        </div>
        {/* URL bar */}
        <div style={{
          flex: 1, height: '24px',
          background: '#111111',
          border: '1px solid #2A2A2A',
          borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '6px', padding: '0 10px',
          maxWidth: '480px', margin: '0 auto',
        }}>
          {/* Lock icon */}
          <svg width="10" height="11" viewBox="0 0 10 11" fill="none" style={{ flexShrink: 0 }}>
            <rect x="1.5" y="4.5" width="7" height="6" rx="1" stroke="#4A4A4A" strokeWidth="1.2" />
            <path d="M3 4.5V3a2 2 0 014 0v1.5" stroke="#4A4A4A" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px', color: '#666',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {displayUrl}
          </span>
        </div>
      </div>

      {/* Iframe area */}
      <div
        ref={containerRef}
        style={{
          flex: 1, position: 'relative',
          overflow: 'hidden',
          background: gradient,
        }}
      >
        {/* Gradient fallback while loading */}
        {!loaded && (
          <div style={{
            position: 'absolute', inset: 0,
            background: gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              border: '2px solid #1E1E1E',
              borderTopColor: '#6366F1',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        )}
        <iframe
          src={`${src}?v=${cacheBuster}`}
          title="preview"
          scrolling="no"
          onLoad={() => setLoaded(true)}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '1280px',
            height: '600px',
            border: 'none',
            transformOrigin: 'top left',
            transform: 'scale(0.703)',
            pointerEvents: 'none',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.5s',
          }}
        />
      </div>
    </div>
  )
}

// ── Modal ────────────────────────────────────────────────────────────
function Modal({ project, onClose }) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const statIcons = { time: '⏱', conversion: '📈', leads: '📬' }
  const statLabels = { time: 'Срок', conversion: 'Конверсия', leads: 'Заявок' }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      data-lenis-prevent
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '40px 24px',
        overflowY: 'auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '900px',
          background: '#0F0F0F',
          border: '1px solid #1E1E1E',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {/* ── Hero preview ─────────────────────────────────── */}
        {project.preview ? (
          <BrowserPreview src={project.preview} gradient={project.gradient} />
        ) : (
          <div style={{
            width: '100%', height: '320px',
            background: project.gradient,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {project.image && (
              <img src={project.image} alt={project.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
            )}
            <div style={{
              position: 'absolute', width: '300px', height: '300px',
              borderRadius: '50%', filter: 'blur(80px)',
              background: 'rgba(99,102,241,0.25)', top: '-60px', left: '-60px',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', width: '200px', height: '200px',
              borderRadius: '50%', filter: 'blur(60px)',
              background: 'rgba(6,182,212,0.2)', bottom: '-40px', right: '-40px',
              pointerEvents: 'none',
            }} />
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 700,
              color: project.textColor || 'white',
              letterSpacing: '-0.02em',
              textAlign: 'center',
              position: 'relative', zIndex: 1,
              padding: '0 32px',
              textShadow: project.textColor === '#1A1A1A' ? 'none' : '0 2px 20px rgba(0,0,0,0.4)',
            }}>
              {project.title}
            </h2>
          </div>
        )}

        {/* ── Close button (after hero so it renders on top) ── */}
        <CloseButton onClose={onClose} />

        {/* ── Body ─────────────────────────────────────────── */}
        <div style={{ padding: '48px', display: 'grid', gridTemplateColumns: '60fr 40fr', gap: '48px' }}
          className="modal-body">

          {/* Left */}
          <div>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px', color: '#6366F1',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              {project.type}
            </p>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '32px', fontWeight: 600, color: '#FFFFFF',
              letterSpacing: '-0.02em', margin: '0 0 20px', lineHeight: 1.1,
            }}>
              {project.title}
            </h3>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px', color: '#A0A0A0',
              lineHeight: 1.7, margin: '0 0 32px',
            }}>
              {project.description}
            </p>

            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px', color: '#6366F1',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              Что сделано
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {project.done.map((item, i) => <CheckItem key={i} text={item} />)}
            </ul>
          </div>

          {/* Right */}
          <div>
            <div style={{
              background: '#0A0A0A',
              border: '1px solid #1E1E1E',
              borderRadius: '12px',
              padding: '32px',
            }}>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px', color: '#A0A0A0',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                marginBottom: '24px',
              }}>
                Результат проекта
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                {Object.entries(project.stats).map(([key, val], i) => (
                  <div key={key}>
                    <div style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px', color: '#A0A0A0',
                      marginBottom: '4px',
                    }}>
                      {statIcons[key]} {statLabels[key]}
                    </div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '20px', fontWeight: 600,
                      color: i === 1 ? '#6366F1' : '#FFFFFF',
                      letterSpacing: '-0.01em',
                    }}>
                      {val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stack */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '28px' }}>
                {project.stack.map(tag => (
                  <span key={tag} style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px', color: '#A0A0A0',
                    border: '1px solid #1E1E1E',
                    borderRadius: '100px', padding: '4px 12px',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Link button */}
              {project.link ? (
                <a
                  href={project.link}
                  style={{
                    display: 'block', width: '100%',
                    padding: '14px',
                    borderRadius: '100px',
                    background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
                    color: '#FFFFFF',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px', fontWeight: 600,
                    textDecoration: 'none', textAlign: 'center',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Посмотреть сайт →
                </a>
              ) : (
                <button
                  onClick={onClose}
                  style={{
                    display: 'block', width: '100%',
                    padding: '14px',
                    borderRadius: '100px',
                    border: '1px solid #1E1E1E',
                    background: 'transparent',
                    color: '#A0A0A0',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px', fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#FFFFFF' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E1E1E'; e.currentTarget.style.color = '#A0A0A0' }}
                >
                  Обсудить похожий проект →
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 640px) {
          .modal-body { grid-template-columns: 1fr !important; padding: 24px !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  )
}

// ── Close button ─────────────────────────────────────────────────────
function CloseButton({ onClose }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClose}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute', top: '20px', right: '20px', zIndex: 10,
        width: '40px', height: '40px', borderRadius: '50%',
        border: `1px solid ${hovered ? '#6366F1' : '#1E1E1E'}`,
        background: '#0F0F0F',
        color: '#FFFFFF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '18px', lineHeight: 1,
        transform: hovered ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'border-color 0.3s, transform 0.3s',
      }}
      aria-label="Закрыть"
    >
      ✕
    </button>
  )
}

// ── Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, onClick }) {
  const [hovered, setHovered] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [cacheBuster] = useState(() => Date.now())

  return (
    <div style={{ breakInside: 'avoid', marginBottom: '16px' }}>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        data-cursor="button"
        onClick={onClick}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{
          background: '#0F0F0F',
          border: `1px solid ${hovered ? '#6366F1' : '#2E2E2E'}`,
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color 0.25s, box-shadow 0.25s',
          boxShadow: hovered
            ? '0 0 0 1px rgba(99,102,241,0.3), 0 8px 32px rgba(0,0,0,0.4)'
            : '0 0 0 0px transparent, 0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        {/* Preview */}
        <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
          {project.preview ? (
            <>
              {!iframeLoaded && (
                <div style={{ position: 'absolute', inset: 0, background: project.gradient }} />
              )}
              <iframe
                src={`${project.preview}?v=${cacheBuster}`}
                title={project.title}
                scrolling="no"
                onLoad={() => setIframeLoaded(true)}
                style={{
                  position: 'absolute', top: 0, left: 0,
                  width: '200%', height: '200%',
                  border: 'none',
                  transformOrigin: 'top left',
                  transform: 'scale(0.5)',
                  pointerEvents: 'none',
                  opacity: iframeLoaded ? 1 : 0,
                  transition: 'opacity 0.4s',
                }}
              />
            </>
          ) : project.image ? (
            <img src={project.image} alt={project.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: project.gradient }} />
          )}

          {/* Hover overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', inset: 0, zIndex: 2,
                  backdropFilter: 'blur(4px)',
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px', fontWeight: 500, color: '#FFFFFF',
                  pointerEvents: 'none',
                }}>
                  Открыть кейс →
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div style={{ padding: '20px 24px 24px' }}>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '18px', fontWeight: 600, color: '#FFFFFF',
            margin: '0 0 6px', letterSpacing: '-0.01em',
          }}>
            {project.title}
          </h3>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px', color: '#6366F1',
            margin: '0 0 14px', letterSpacing: '0.02em',
          }}>
            {project.type}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {project.stack.slice(0, 4).map(tag => (
              <span key={tag} style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px', color: '#A0A0A0',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid #1E1E1E',
                borderRadius: '6px', padding: '3px 10px',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeProject, setActiveProject] = useState(null)

  const labelRef      = useRef(null)
  const titleInnerRef = useRef(null)
  const { ref: headerRef, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (!inView) return
    const tl = gsap.timeline()
    tl.fromTo(labelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })
    tl.fromTo(titleInnerRef.current, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' }, '-=0.2')
  }, [inView])

  const filtered = activeFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter)

  const col1 = filtered.filter((_, i) => i % 3 === 0)
  const col2 = filtered.filter((_, i) => i % 3 === 1)
  const col3 = filtered.filter((_, i) => i % 3 === 2)

  return (
    <section
      id="портфолио"
      style={{ background: '#050505', padding: '120px 0', position: 'relative', zIndex: 1 }}
    >
      <div style={{ width: "100%", paddingLeft: "6%", paddingRight: "6%" }}>

        {/* ── Header ─────────────────────────────────────── */}
        <div ref={headerRef} style={{ marginBottom: '56px' }}>
          <p
            ref={labelRef}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px', color: '#6366F1',
              marginBottom: '20px', opacity: 0, letterSpacing: '0.04em',
            }}
          >
            // 02 работы
          </p>
          <div style={{ overflow: 'hidden' }}>
            <div ref={titleInnerRef} style={{ opacity: 0 }}>
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(40px, 5vw, 64px)',
                fontWeight: 700, color: '#FFFFFF',
                margin: 0, letterSpacing: '-0.02em', lineHeight: 1.05,
              }}>
                Портфолио
              </h2>
            </div>
          </div>
        </div>

        {/* ── Filters ────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '48px' }}>
          {FILTERS.map(f => {
            const isActive = activeFilter === f.value
            return (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px', fontWeight: 500,
                  color: isActive ? '#FFFFFF' : '#A0A0A0',
                  background: isActive ? 'linear-gradient(135deg, #6366F1, #06B6D4)' : 'transparent',
                  border: isActive ? 'none' : '1px solid #1E1E1E',
                  borderRadius: '100px', padding: '9px 22px',
                  cursor: 'pointer',
                  transition: 'color 0.2s, background 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = '#6366F1' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = '#1E1E1E' }}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* ── Grid ───────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="portfolio-masonry"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                alignItems: 'start',
              }}
            >
              <div>{col1.map(p => <ProjectCard key={p.id} project={p} onClick={() => setActiveProject(p)} />)}</div>
              <div>{col2.map(p => <ProjectCard key={p.id} project={p} onClick={() => setActiveProject(p)} />)}</div>
              <div>{col3.map(p => <ProjectCard key={p.id} project={p} onClick={() => setActiveProject(p)} />)}</div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── CTA ────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
          <a
            href="#контакт"
            data-cursor="button"
            onClick={(e) => { e.preventDefault(); window.__lenis?.scrollTo('#контакт', { duration: 1.2 }) }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '16px 36px', borderRadius: '100px',
              background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px', fontWeight: 500,
              textDecoration: 'none',
            }}
            onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.2 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.2 })}
          >
            Обсудить ваш проект →
          </a>
        </div>
      </div>

      {/* ── Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {activeProject && (
          <Modal project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .portfolio-masonry { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .portfolio-masonry { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

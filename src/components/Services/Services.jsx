import { useRef, useEffect, useState, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

// ── SVG Icons ────────────────────────────────────────────────────────
const IconLightning = ({ size = 36, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)
const IconGlobe = ({ size = 36, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)
const IconPin = ({ size = 36, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)
const IconCpu = ({ size = 36, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
  </svg>
)
const IconChart = ({ size = 36, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
)
const IconTarget = ({ size = 36, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)
const IconTelegram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </svg>
)

// ── Data ─────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: 1, num: '01',
    Icon: IconLightning,
    title: 'UX и дизайн',
    subtitle: 'Интерфейсы и фирменный стиль',
    desc: 'Дизайн который продаёт — от логотипа до готового интерфейса',
    gradient: 'linear-gradient(135deg, #1E1B4B, #312E81, #1E1B4B)',
    accent: '#6366F1', accent2: '#818CF8',
    price: 'от 15 000 ₽', priceLabel: 'разово',
    facts: [
      { icon: '⚡', text: 'Первый макет за 2 дня' },
      { icon: '💰', text: 'от 15 000 ₽' },
      { icon: '🎨', text: 'Уникальный стиль под бренд' },
    ],
    forWho: [
      { icon: '🏪', text: 'Бизнес без фирменного стиля' },
      { icon: '📱', text: 'Кому нужен современный дизайн сайта' },
      { icon: '🚀', text: 'Стартапы и новые проекты' },
    ],
    included: [
      'Анализ конкурентов и целевой аудитории',
      'Разработка логотипа и фирменного стиля',
      'UX-прототип сайта или приложения',
      'UI-дизайн в Figma с компонентами',
      'Адаптивные макеты под все устройства',
      'Брендбук с правилами использования',
      'Иконки и графика под проект',
      'Передача исходников и шрифтов',
    ],
    steps: [
      { num: '01', title: 'Бриф и исследование', desc: 'Изучаем бренд, аудиторию, конкурентов', time: '1 день' },
      { num: '02', title: 'Концепция и прототип', desc: 'Структура, wireframes, визуальный стиль', time: '2-3 дня' },
      { num: '03', title: 'Финальный дизайн', desc: 'Готовые макеты с правками и сдача', time: '2-3 дня' },
    ],
    results: ['Единый стиль бренда во всех каналах', 'Интерфейс который интуитивно понятен', 'Конверсия растёт за счёт правильного UX'],
  },
  {
    id: 2, num: '02',
    Icon: IconGlobe,
    title: 'Сайты под ключ',
    subtitle: 'Разработка и дизайн',
    desc: 'Лендинги на Tilda и Вайб-коде',
    gradient: 'linear-gradient(135deg, #064E3B, #065F46, #047857)',
    accent: '#10B981', accent2: '#34D399',
    price: 'от 25 000 ₽', priceLabel: 'разово',
    facts: [
      { icon: '⚡', text: 'Готово за 5 дней' },
      { icon: '💰', text: 'от 25 000 ₽' },
      { icon: '📈', text: 'Конверсия 6-12%' },
    ],
    forWho: [
      { icon: '🏗', text: 'Бизнес без сайта или со старым' },
      { icon: '📱', text: 'Кому нужен современный дизайн' },
      { icon: '🎯', text: 'Кто хочет продающую страницу' },
    ],
    included: [
      'Анализ конкурентов и целевой аудитории',
      'Структура и прототип лендинга',
      'Уникальный дизайн под бренд',
      'Разработка с анимациями',
      'Форма заявки с уведомлениями',
      'Адаптив под все устройства',
      'Подключение Яндекс Метрики',
      'Скорость загрузки 90+ PageSpeed',
    ],
    steps: [
      { num: '01', title: 'Бриф и прототип', desc: 'Разбираем задачу и структуру', time: '1 день' },
      { num: '02', title: 'Дизайн и разработка', desc: 'Делаем и показываем промежуточно', time: '3-4 дня' },
      { num: '03', title: 'Правки и запуск', desc: 'Финальные правки и публикация', time: '1 день' },
    ],
    results: ['Конверсия 6-12% с первого месяца', 'Скорость загрузки 90+ PageSpeed', 'Адаптив под мобильные 100%'],
  },
  {
    id: 3, num: '03',
    Icon: IconPin,
    title: 'Авито + Карты',
    subtitle: 'Локальное продвижение',
    desc: 'Входящий поток без рекламного бюджета',
    gradient: 'linear-gradient(135deg, #7C2D12, #9A3412, #C2410C)',
    accent: '#F97316', accent2: '#FB923C',
    price: 'от 15 000 ₽', priceLabel: 'разово',
    facts: [
      { icon: '⚡', text: 'Результат за 7 дней' },
      { icon: '💰', text: 'от 15 000 ₽' },
      { icon: '📈', text: 'Звонки без Директа' },
    ],
    forWho: [
      { icon: '🏪', text: 'Локальные услуги и мастера' },
      { icon: '🏠', text: 'Бизнес в Серпухове и МО' },
      { icon: '💡', text: 'Кто хочет клиентов без бюджета' },
    ],
    included: [
      'Полная упаковка профиля Авито',
      'До 20 продающих объявлений',
      'Обработка и загрузка фотографий',
      'Настройка платного продвижения',
      'Полное заполнение Яндекс Карт',
      'Стратегия получения первых отзывов',
      'Ответы на существующие отзывы',
      'Еженедельный мониторинг позиций',
    ],
    steps: [
      { num: '01', title: 'Упаковка профиля', desc: 'Заполняем Авито и Карты полностью', time: '2 дня' },
      { num: '02', title: 'Объявления и фото', desc: 'Создаём продающий контент', time: '2 дня' },
      { num: '03', title: 'Продвижение', desc: 'Запускаем и мониторим позиции', time: 'ongoing' },
    ],
    results: ['CTR объявлений 10-15%', 'Входящие звонки без рекламного бюджета', 'Яндекс Карты ТОП-3 за 2 недели'],
  },
  {
    id: 4, num: '04',
    Icon: IconCpu,
    title: 'ИИ-автоматизация',
    subtitle: 'Боты и интеграции',
    desc: 'Чат-боты и интеграции. Бизнес работает пока вы спите',
    gradient: 'linear-gradient(135deg, #1E3A5F, #1E40AF, #1D4ED8)',
    accent: '#3B82F6', accent2: '#60A5FA',
    price: 'от 30 000 ₽', priceLabel: 'разово',
    facts: [
      { icon: '⚡', text: 'Готово за 7-10 дней' },
      { icon: '💰', text: 'от 30 000 ₽' },
      { icon: '📈', text: 'Экономия 3ч/день' },
    ],
    forWho: [
      { icon: '⚙️', text: 'Бизнес с рутинными задачами' },
      { icon: '📱', text: 'Кто теряет заявки ночью' },
      { icon: '🚀', text: 'Кто хочет расти без найма' },
    ],
    included: [
      'Аудит бизнес-процессов',
      'Telegram-бот для заявок и записи',
      'Интеграция с CRM или Google Sheets',
      'Автоответы в мессенджерах',
      'GPT-интеграция для контента',
      'Уведомления и напоминания клиентам',
      'Панель управления ботом',
      'Техподдержка 1 месяц включена',
    ],
    steps: [
      { num: '01', title: 'Аудит процессов', desc: 'Находим что можно автоматизировать', time: '1 день' },
      { num: '02', title: 'Разработка', desc: 'Пишем бота и интеграции', time: '5-7 дней' },
      { num: '03', title: 'Тест и запуск', desc: 'Проверяем и запускаем в работу', time: '1 день' },
    ],
    results: ['Экономия 2-4 часа в день на рутине', 'Заявки принимаются 24/7 без вас', 'Ноль потерянных обращений'],
  },
  {
    id: 5, num: '05',
    Icon: IconChart,
    title: 'Аналитика + CRM',
    subtitle: 'Цифры и процессы',
    desc: 'Сквозная аналитика, воронки, сделки',
    gradient: 'linear-gradient(135deg, #1A1A2E, #16213E, #0F3460)',
    accent: '#8B5CF6', accent2: '#A78BFA',
    price: 'от 25 000 ₽', priceLabel: 'разово',
    facts: [
      { icon: '⚡', text: 'Внедрение 10 дней' },
      { icon: '💰', text: 'от 25 000 ₽' },
      { icon: '📈', text: 'Конверсия +30%' },
    ],
    forWho: [
      { icon: '😤', text: 'Кто теряет заявки и не знает где' },
      { icon: '📉', text: 'Кто не понимает откуда клиенты' },
      { icon: '👥', text: 'Команды от 2 менеджеров' },
    ],
    included: [
      'Настройка Яндекс Метрики с нуля',
      'Цели и воронка конверсий',
      'Настройка CRM под бизнес',
      'Интеграция сайт → CRM автоматически',
      'Воронка продаж под ваш процесс',
      'Дашборд с ключевыми метриками',
      'Интеграция с телефонией',
      'Обучение команды — 1 день',
    ],
    steps: [
      { num: '01', title: 'Аудит и план', desc: 'Находим где теряются заявки', time: '2 дня' },
      { num: '02', title: 'Настройка', desc: 'Внедряем CRM и аналитику', time: '5-7 дней' },
      { num: '03', title: 'Обучение', desc: 'Показываем команде как работать', time: '1 день' },
    ],
    results: ['Потери заявок снижаются на 80%', 'Конверсия в сделку растёт на 30%', 'Полная прозрачность откуда клиенты'],
  },
  {
    id: 6, num: '06',
    Icon: IconTarget,
    title: 'Отдел продаж',
    subtitle: 'Построение с нуля',
    desc: 'Выстраиваем отдел продаж который закрывает сделки без вас',
    gradient: 'linear-gradient(135deg, #2D1B69, #4C1D95, #5B21B6)',
    accent: '#7C3AED', accent2: '#8B5CF6',
    price: 'от 50 000 ₽', priceLabel: 'разово',
    facts: [
      { icon: '⚡', text: 'Запуск за 14 дней' },
      { icon: '💰', text: 'от 50 000 ₽' },
      { icon: '📈', text: 'Конверсия в сделку +40%' },
    ],
    forWho: [
      { icon: '🔥', text: 'Бизнес где продажи висят на владельце' },
      { icon: '😩', text: 'Кто устал закрывать все сделки сам' },
      { icon: '📈', text: 'Кто готов масштабировать выручку' },
    ],
    included: [
      'Аудит текущих продаж и воронки',
      'Разработка скриптов продаж под нишу',
      'Настройка CRM (AmoCRM / Битрикс24)',
      'Автоматическая воронка квалификации',
      'Система KPI и мотивации менеджеров',
      'Шаблоны переписок и ответов',
      'Интеграция с телефонией и мессенджерами',
      'Обучение менеджеров — 2 дня',
    ],
    steps: [
      { num: '01', title: 'Аудит и стратегия', desc: 'Разбираем текущие продажи и точки роста', time: '2 дня' },
      { num: '02', title: 'Построение системы', desc: 'CRM, скрипты, воронка, KPI', time: '7-10 дней' },
      { num: '03', title: 'Запуск и обучение', desc: 'Обучаем команду и запускаем в работу', time: '2 дня' },
    ],
    results: ['Конверсия из заявки в сделку растёт на 40%', 'Владелец выходит из операционных продаж', 'Прозрачная воронка и контроль каждой сделки'],
  },
]

// ── Floating particles for modal hero ────────────────────────────────
function HeroParticles({ accent }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 3,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 4 + Math.random() * 6,
    dx: (Math.random() - 0.5) * 40,
    dy: (Math.random() - 0.5) * 40,
    opacity: 0.3 + Math.random() * 0.4,
  }))
  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: 'white',
            opacity: p.opacity,
            animation: `float-${p.id % 5} ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────
function ServiceModal({ service, onClose }) {
  const includedRefs = useRef([])
  const stepsRefs = useRef([])
  const [iconHovered, setIconHovered] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Animate included items and steps on mount
  useEffect(() => {
    const items = includedRefs.current.filter(Boolean)
    const steps = stepsRefs.current.filter(Boolean)
    if (items.length) {
      gsap.fromTo(items,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.35, ease: 'power2.out' }
      )
    }
    if (steps.length) {
      gsap.fromTo(steps,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.15, delay: 0.5, ease: 'power2.out' }
      )
    }
  }, [])

  const accent = service.accent
  const accent2 = service.accent2

  return (
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
        display: 'flex',
        alignItems: 'flex-start',
        padding: '20px 16px 40px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 80 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 40 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '900px',
          width: '100%',
          margin: '40px auto',
          background: '#0F0F0F',
          border: '1px solid #1E1E1E',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: `0 0 120px ${accent}26`,
        }}
      >
        {/* ✕ Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '24px', right: '24px', zIndex: 10,
            width: '44px', height: '44px', borderRadius: '50%',
            border: '1px solid #2A2A2A', background: 'transparent',
            color: '#A0A0A0', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', transition: 'border-color 0.2s, color 0.2s, transform 0.3s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#6366F1'
            e.currentTarget.style.color = 'white'
            e.currentTarget.style.transform = 'rotate(90deg)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#2A2A2A'
            e.currentTarget.style.color = '#A0A0A0'
            e.currentTarget.style.transform = 'rotate(0deg)'
          }}
        >
          ✕
        </button>

        {/* ── Hero ── */}
        <div style={{
          width: '100%', height: '260px',
          background: service.gradient,
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <HeroParticles accent={accent} />

          {/* Bottom gradient */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
            background: 'linear-gradient(to bottom, transparent, #0F0F0F)',
            pointerEvents: 'none',
          }} />

          {/* Icon */}
          <div
            onMouseEnter={() => setIconHovered(true)}
            onMouseLeave={() => setIconHovered(false)}
            style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', zIndex: 1,
              animation: iconHovered ? 'none' : 'spin 20s linear infinite',
              cursor: 'default',
            }}
          >
            <service.Icon size={36} color="white" />
          </div>

          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700,
            color: '#FFFFFF', marginTop: '16px', textAlign: 'center',
            position: 'relative', zIndex: 1, marginBottom: '8px',
            padding: '0 60px',
          }}>
            {service.title}
          </h2>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px', color: 'rgba(255,255,255,0.6)',
            textAlign: 'center', position: 'relative', zIndex: 1, margin: 0,
          }}>
            {service.subtitle}
          </p>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '48px' }} className="modal-body">

          {/* Facts pills */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {service.facts.map((f, i) => (
              <div key={i} style={{
                background: '#0A0A0A', border: '1px solid #2A2A2A',
                borderRadius: '100px', padding: '10px 20px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px', color: 'white',
                display: 'flex', alignItems: 'center', gap: '8px',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ color: accent }}>{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>

          <div style={{ height: '1px', background: '#1E1E1E', marginBottom: '32px' }} />

          {/* Two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '58fr 42fr', gap: '48px' }}
            className="modal-cols">

            {/* LEFT */}
            <div>
              {/* For who */}
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.15em', color: accent, textTransform: 'uppercase', marginBottom: '8px' }}>
                Для кого
              </p>
              <div style={{ height: '1px', background: '#1E1E1E', marginBottom: '16px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                {service.forWho.map((w, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                      background: `linear-gradient(135deg, ${accent}22, ${accent2}11)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px',
                    }}>{w.icon}</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#A0A0A0' }}>{w.text}</span>
                  </div>
                ))}
              </div>

              {/* Included */}
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.15em', color: accent, textTransform: 'uppercase', marginBottom: '8px' }}>
                Что входит
              </p>
              <div style={{ height: '1px', background: '#1E1E1E', marginBottom: '16px' }} />
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0' }}>
                {service.included.map((item, i) => (
                  <li
                    key={i}
                    ref={el => (includedRefs.current[i] = el)}
                    style={{ opacity: 0, paddingBottom: '12px', marginBottom: '4px' }}
                  >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                        background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', color: 'white', marginTop: '1px',
                      }}>✓</div>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#A0A0A0', lineHeight: 1.5 }}>
                        {item}
                      </span>
                    </div>
                    {/* progress bar */}
                    <div style={{ height: '1px', background: '#1E1E1E', marginTop: '12px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: accent, opacity: 0.3,
                        animation: `fillBar 0.6s ease forwards ${0.35 + i * 0.08}s`,
                        width: '0%',
                      }} />
                    </div>
                  </li>
                ))}
              </ul>

              {/* Steps */}
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.15em', color: accent, textTransform: 'uppercase', marginBottom: '8px', marginTop: '32px' }}>
                Как работаем
              </p>
              <div style={{ height: '1px', background: '#1E1E1E', marginBottom: '20px' }} />
              <div style={{ display: 'flex', gap: '0', flexDirection: 'column' }}>
                {service.steps.map((step, i) => (
                  <div
                    key={i}
                    ref={el => (stepsRefs.current[i] = el)}
                    style={{ opacity: 0, display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}
                  >
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '32px', fontWeight: 700,
                      color: accent, opacity: 0.3, lineHeight: 1, flexShrink: 0, width: '48px',
                    }}>{step.num}</span>
                    <div>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: 'white', margin: '0 0 4px' }}>{step.title}</p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#A0A0A0', margin: '0 0 4px' }}>{step.desc}</p>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: accent }}>{step.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — offer card */}
            <div>
              <div style={{
                background: `linear-gradient(135deg, ${accent}14, ${accent2}08)`,
                border: `1px solid ${accent}33`,
                borderRadius: '20px', padding: '32px',
                position: 'sticky', top: '40px',
              }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.15em', color: accent, textTransform: 'uppercase', margin: '0 0 12px' }}>
                  Стоимость
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700,
                    background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>
                    {service.price}
                  </span>
                </div>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#A0A0A0' }}>
                  {service.priceLabel}
                </span>

                <div style={{ height: '1px', background: '#2A2A2A', margin: '20px 0' }} />

                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.1em', color: '#A0A0A0', textTransform: 'uppercase', margin: '0 0 12px' }}>
                  Что получите
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {service.results.map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ color: accent, fontSize: '16px', lineHeight: 1.4, flexShrink: 0 }}>→</span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'white', fontWeight: 500, lineHeight: 1.4 }}>{r}</span>
                    </div>
                  ))}
                </div>

                <div style={{ height: '1px', background: '#2A2A2A', margin: '20px 0' }} />

                <motion.a
                  href="#контакт"
                  onClick={e => {
                    e.preventDefault()
                    onClose()
                    setTimeout(() => {
                      const el = document.querySelector('#контакт')
                      if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.2 })
                      else el?.scrollIntoView({ behavior: 'smooth' })
                    }, 400)
                  }}
                  whileHover={{ scale: 1.03, boxShadow: `0 0 32px ${accent}55` }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'center',
                    padding: '16px',
                    borderRadius: '100px',
                    background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                    color: 'white',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '15px', fontWeight: 600,
                    textDecoration: 'none', cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  Обсудить проект →
                </motion.a>

                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#A0A0A0', textAlign: 'center', margin: '12px 0 12px' }}>
                  или напишите сразу
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  {[
                    { href: 'https://t.me/', label: 'Telegram', icon: <IconTelegram /> },
                  ].map(({ href, label, icon }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      aria-label={label}
                      style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        border: '1px solid #2A2A2A', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#A0A0A0', textDecoration: 'none',
                        transition: 'border-color 0.2s, color 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = accent
                        e.currentTarget.style.color = accent
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#2A2A2A'
                        e.currentTarget.style.color = '#A0A0A0'
                      }}
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Service Card ─────────────────────────────────────────────────────
function ServiceCard({ service, wrapRef, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div ref={wrapRef} style={{ opacity: 0, height: '100%' }}>
      <motion.div
        data-cursor="button"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={onClick}
        style={{
          position: 'relative',
          background: '#0F0F0F',
          border: `1px solid ${hovered ? service.accent : '#1E1E1E'}`,
          borderRadius: '20px',
          padding: '28px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          cursor: 'pointer',
          transition: 'border-color 0.3s',
          boxSizing: 'border-box',
        }}
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
      >
        {/* Background number */}
        <span style={{
          position: 'absolute', top: '8px', right: '16px',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '80px', fontWeight: 700,
          color: '#FFFFFF',
          opacity: hovered ? 0.10 : 0.04,
          lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
          transition: 'opacity 0.3s',
        }} aria-hidden="true">
          {service.num}
        </span>

        {/* Icon */}
        <motion.div
          animate={hovered ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: service.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '20px', flexShrink: 0,
          }}
        >
          <service.Icon size={22} color="white" />
        </motion.div>

        <h3 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '22px', fontWeight: 600, color: '#FFFFFF',
          margin: '0 0 12px', letterSpacing: '-0.01em',
        }}>
          {service.title}
        </h3>

        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px', color: '#A0A0A0', lineHeight: 1.7, margin: 0, flex: 1,
        }}>
          {service.desc}
        </p>

        <motion.div
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontFamily: 'Inter, sans-serif', fontSize: '13px',
            color: service.accent, marginTop: '16px',
          }}
        >
          Подробнее
          <motion.span
            animate={hovered ? { x: 4 } : { x: 0 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────
export default function Services() {
  const [activeService, setActiveService] = useState(null)

  const labelRef = useRef(null)
  const titleInnerRef = useRef(null)
  const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true, threshold: 0.3 })
  const cardRefs = useRef([])
  const { ref: gridRef, inView: gridInView } = useInView({ triggerOnce: true, threshold: 0.08 })

  useEffect(() => {
    if (!headerInView) return
    const tl = gsap.timeline()
    tl.fromTo(labelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.55, ease: 'power2.out' })
    tl.fromTo(titleInnerRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power4.out' }, '-=0.2')
  }, [headerInView])

  useEffect(() => {
    if (!gridInView) return
    gsap.fromTo(
      cardRefs.current.filter(Boolean),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    )
  }, [gridInView])

  const openService = useCallback((service) => setActiveService(service), [])
  const closeService = useCallback(() => setActiveService(null), [])

  return (
    <section id="услуги" style={{ background: '#050505', padding: '120px 0', position: 'relative', zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-6">

        <div ref={headerRef} style={{ marginBottom: '72px' }}>
          <p ref={labelRef} style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px', color: '#6366F1',
            marginBottom: '20px', opacity: 0, letterSpacing: '0.04em',
          }}>
            // 01 услуги
          </p>
          <div style={{ overflow: 'hidden' }}>
            <div ref={titleInnerRef} style={{ opacity: 0 }}>
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(40px, 5vw, 64px)',
                fontWeight: 700, color: '#FFFFFF',
                margin: 0, letterSpacing: '-0.02em', lineHeight: 1.05,
              }}>
                Что я делаю
              </h2>
            </div>
          </div>
        </div>

        <div
          ref={gridRef}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}
          className="services-grid"
        >
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              wrapRef={el => (cardRefs.current[i] = el)}
              onClick={() => openService(service)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeService && (
          <ServiceModal service={activeService} onClose={closeService} />
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) { .services-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 580px) { .services-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 700px) {
          .modal-body { padding: 24px !important; }
          .modal-cols { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fillBar { from { width: 0%; } to { width: 100%; } }
        @keyframes float-0 { from { transform: translate(0,0); } to { transform: translate(15px,-20px); } }
        @keyframes float-1 { from { transform: translate(0,0); } to { transform: translate(-18px,12px); } }
        @keyframes float-2 { from { transform: translate(0,0); } to { transform: translate(20px,15px); } }
        @keyframes float-3 { from { transform: translate(0,0); } to { transform: translate(-12px,-18px); } }
        @keyframes float-4 { from { transform: translate(0,0); } to { transform: translate(10px,20px); } }
      `}</style>
    </section>
  )
}

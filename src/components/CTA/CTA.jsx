import { useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'

export default function CTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 4s ease infinite',
      }}
    >
      <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', padding: '0 24px' }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 700,
            color: '#FFFFFF',
            margin: '0 0 16px',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          Готов начать проект?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '18px',
            color: 'rgba(255,255,255,0.85)',
            margin: '0 0 40px',
          }}
        >
          Напишу стратегию бесплатно
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          {/* Telegram */}
          <a
            href="https://t.me/korm_marketing"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '100px',
              background: '#FFFFFF',
              color: '#6366F1',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.2 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1,    duration: 0.2 })}
          >
            Telegram
          </a>

          {/* Portfolio */}
          <a
            href="#портфолио"
            data-cursor="button"
            onClick={(e) => { e.preventDefault(); window.__lenis?.scrollTo('#портфолио', { duration: 1.2 }) }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '100px',
              background: 'transparent',
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              border: '2px solid rgba(255,255,255,0.7)',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FFFFFF' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)' }}
          >
            Работы
          </a>
        </motion.div>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'

// Don't render on touch devices
function isTouchDevice() {
  return window.matchMedia('(hover: none)').matches
}

export default function Cursor() {
  const [mounted, setMounted] = useState(false)
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  // Raw mouse position (instant)
  const mouse = useRef({ x: -200, y: -200 })
  // Lerped ring position
  const ring = useRef({ x: -200, y: -200 })

  // Current cursor state
  const state = useRef('default') // 'default' | 'hover' | 'text' | 'click'
  const rafId = useRef(null)

  useEffect(() => {
    if (isTouchDevice()) return
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Hide native cursor
    document.body.style.cursor = 'none'

    // ── Helpers ──────────────────────────────────────────────────
    const applyState = (s) => {
      state.current = s
      const dot = dotRef.current
      const r = ringRef.current
      if (!dot || !r) return

      if (s === 'default') {
        dot.style.opacity = '1'
        dot.style.width = '6px'
        dot.style.height = '6px'
        dot.style.borderRadius = '50%'
        r.style.width = '44px'
        r.style.height = '44px'
        r.style.borderRadius = '50%'
        r.style.borderWidth = '1.5px'
        r.style.borderColor = '#6366F1'
        r.style.background = 'transparent'
        r.style.transition = 'width 0.25s, height 0.25s, border-radius 0.25s, background 0.25s, opacity 0.25s'
      } else if (s === 'hover') {
        dot.style.opacity = '0'
        r.style.width = '64px'
        r.style.height = '64px'
        r.style.borderRadius = '50%'
        r.style.borderWidth = '1.5px'
        r.style.borderColor = '#6366F1'
        r.style.background = 'rgba(99, 102, 241, 0.12)'
        r.style.transition = 'width 0.25s, height 0.25s, border-radius 0.25s, background 0.25s, opacity 0.25s'
      } else if (s === 'text') {
        dot.style.opacity = '0'
        r.style.width = '2px'
        r.style.height = '24px'
        r.style.borderRadius = '1px'
        r.style.borderWidth = '0'
        r.style.background = '#6366F1'
        r.style.transition = 'width 0.2s, height 0.2s, border-radius 0.2s, background 0.2s, opacity 0.2s'
      } else if (s === 'click') {
        r.style.width = '32px'
        r.style.height = '32px'
        r.style.transition = 'width 0.08s, height 0.08s'
      }
    }

    // ── Mouse events ─────────────────────────────────────────────
    const onMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      const target = e.target
      const cursorAttr = target.closest('[data-cursor]')?.dataset.cursor
      const isLink = target.closest('a, button')

      if (state.current === 'click') return // don't change while clicking

      if (cursorAttr === 'text' || target.closest('[data-cursor="text"]')) {
        if (state.current !== 'text') applyState('text')
      } else if (cursorAttr === 'button' || isLink || target.closest('[data-cursor="button"]')) {
        if (state.current !== 'hover') applyState('hover')
      } else {
        if (state.current !== 'default') applyState('default')
      }
    }

    const onDown = () => {
      applyState('click')
    }

    const onUp = () => {
      // Restore state based on element under cursor
      const el = document.elementFromPoint(mouse.current.x, mouse.current.y)
      const cursorAttr = el?.closest('[data-cursor]')?.dataset.cursor
      const isLink = el?.closest('a, button')

      if (cursorAttr === 'text') applyState('text')
      else if (cursorAttr === 'button' || isLink) applyState('hover')
      else applyState('default')
    }

    const onLeave = () => {
      mouse.current = { x: -200, y: -200 }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)

    // ── RAF loop ──────────────────────────────────────────────────
    const LERP = 0.08

    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * LERP
      ring.current.y += (mouse.current.y - ring.current.y) * LERP

      const dot = dotRef.current
      const r = ringRef.current

      if (dot) {
        // Dot: instant, centred on cursor
        dot.style.transform = `translate(${mouse.current.x - 3}px, ${mouse.current.y - 3}px)`
      }

      if (r) {
        // Ring: lerped. Offset by half its rendered size so it centres on cursor.
        const rw = r.offsetWidth / 2
        const rh = r.offsetHeight / 2
        r.style.transform = `translate(${ring.current.x - rw}px, ${ring.current.y - rh}px)`
      }

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)

    // Set initial default state
    applyState('default')

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafId.current)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <>
      {/* Dot — instant */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#FFFFFF',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
        }}
      />

      {/* Ring — lerped */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          border: '1.5px solid #6366F1',
          background: 'transparent',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
          transition: 'width 0.25s, height 0.25s, border-radius 0.25s, background 0.25s, opacity 0.25s',
        }}
      />
    </>
  )
}

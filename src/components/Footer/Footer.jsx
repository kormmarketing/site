const NAV = ['Услуги', 'Портфолио', 'Контакт']
const NAV_HREFS = ['#услуги', '#портфолио', '#контакт']

const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
  </svg>
)

export default function Footer() {
  const year = new Date().getFullYear()

  const scrollTo = (href) => {
    const el = document.querySelector(href)
    if (!el) return
    if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.2 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer style={{
      background: '#050505',
      borderTop: '1px solid #1E1E1E',
      position: 'relative',
      zIndex: 1,
    }}>
      <div className="max-w-7xl mx-auto px-6" style={{ padding: '64px 24px 0' }}>

        {/* ── Three columns ──────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '48px',
          paddingBottom: '56px',
          borderBottom: '1px solid #1E1E1E',
        }} className="footer-grid">

          {/* Col 1: brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '22px', fontWeight: 700, color: '#FFFFFF',
              }}>
                КОРМ
              </span>
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                background: 'radial-gradient(circle, #6366F1, #06B6D4)',
              }} />
            </div>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px', color: '#6366F1',
              letterSpacing: '0.04em', marginBottom: '20px',
            }}>
              маркетинг
            </p>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px', color: '#A0A0A0',
              lineHeight: 1.7, maxWidth: '280px',
            }}>
              Цифровой партнёр для малого и среднего бизнеса в Серпухове и МО.
              Сайты, реклама, автоматизация.
            </p>
          </div>

          {/* Col 2: navigation */}
          <div>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px', color: '#6366F1',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Навигация
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {NAV.map((label, i) => (
                <li key={label}>
                  <a
                    href={NAV_HREFS[i]}
                    onClick={(e) => { e.preventDefault(); scrollTo(NAV_HREFS[i]) }}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px', color: '#A0A0A0',
                      textDecoration: 'none', transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.target.style.color = '#A0A0A0')}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: contacts + socials */}
          <div>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px', color: '#6366F1',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Контакты
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {[
                { label: 'Telegram', href: 'https://t.me/' },
                { label: 'Серпухов, МО', href: null },
              ].map(({ label, href }) =>
                href ? (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '14px',
                      color: '#A0A0A0', textDecoration: 'none', transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.target.style.color = '#A0A0A0')}
                  >
                    {label}
                  </a>
                ) : (
                  <span key={label} style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#A0A0A0' }}>
                    {label}
                  </span>
                )
              )}
            </div>

            {/* Socials */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { Icon: TelegramIcon, href: 'https://t.me/', label: 'Telegram' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: '38px', height: '38px',
                    borderRadius: '10px',
                    border: '1px solid #1E1E1E',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#A0A0A0', textDecoration: 'none',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#6366F1'
                    e.currentTarget.style.color = '#6366F1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#1E1E1E'
                    e.currentTarget.style.color = '#A0A0A0'
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 0',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px', color: '#A0A0A0',
          }}>
            © {year} Корм Маркетинг
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px', color: '#A0A0A0',
          }}>
            Серпухов · МО
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}

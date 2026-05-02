import { Link, useLocation } from 'react-router-dom'
import { colors, fonts, siteInfo } from '../theme'

const navLinks = [
  { to: '/',                label: 'Home' },
  { to: '/services',        label: 'Services' },
  { to: '/framework',       label: 'CE Framework' },
  { to: '/lab',             label: 'Lab' },
  { to: '/vulnerabilities', label: 'Vulnerabilities' },
  { to: '/dashboard',       label: 'Dashboard' },
  { to: '/docs',            label: 'Docs & Policies' },
  { to: '/news',            label: 'News' },
  { to: '/about',           label: 'About' },
  { to: '/contact',         label: 'Contact' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <>
      {/* TOP ALERT BAR */}
      <div style={{
        background: colors.red,
        color: '#fff',
        textAlign: 'center',
        padding: '6px 1rem',
        fontFamily: fonts.mono,
        fontSize: '10px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        animation: 'blink 3s infinite',
        position: 'relative',
        zIndex: 300,
      }}>
        ⬡ TANASIOM AEGIS SECURITY & COMPLIANCE — CYBER ESSENTIALS READINESS — UK SME SPECIALIST ⬡
      </div>

      {/* MAIN NAV */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        background: 'rgba(5,8,16,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        height: '56px',
        gap: '1rem',
      }}>

        {/* LOGO */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          textDecoration: 'none',
          flexShrink: 0,
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            background: colors.blue,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            flexShrink: 0,
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{
              fontFamily: fonts.display,
              fontSize: '1.1rem',
              letterSpacing: '3px',
              color: colors.textBright,
            }}>
              TANASIOM <span style={{ color: colors.oliveBright }}>AEGIS</span>
            </span>
            <span style={{
              fontFamily: fonts.mono,
              fontSize: '0.5rem',
              letterSpacing: '2px',
              color: colors.textDim,
              textTransform: 'uppercase',
            }}>
              Security & Compliance
            </span>
          </div>
        </Link>

        {/* NAV LINKS */}
        <div style={{
          display: 'flex',
          gap: '2px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          flex: 1,
          justifyContent: 'center',
        }}>
          {navLinks.map(l => {
            const isActive = pathname === l.to
            return (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  fontFamily: fonts.mono,
                  fontSize: '0.68rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '3px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                  color: isActive ? colors.blueBright : colors.textDim,
                  background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                  borderBottom: isActive ? `2px solid ${colors.blueBright}` : '2px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = colors.textBright
                    e.currentTarget.style.background = 'rgba(29,78,216,0.08)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = colors.textDim
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {l.label}
              </Link>
            )
          })}
        </div>

        {/* RIGHT — BOOK + GITHUB */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0 }}>
          <Link
            to="/contact"
            style={{
              fontFamily: fonts.display,
              fontSize: '0.85rem',
              letterSpacing: '2px',
              background: colors.red,
              color: '#fff',
              padding: '0.4rem 1rem',
              textDecoration: 'none',
              transition: 'all 0.2s',
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = colors.redBright }}
            onMouseLeave={e => { e.currentTarget.style.background = colors.red }}
          >
            BOOK
          </Link>

          <a
            href={siteInfo.github}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: fonts.mono,
              fontSize: '0.65rem',
              color: colors.textDim,
              textDecoration: 'none',
              border: `1px solid ${colors.border}`,
              padding: '4px 10px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = colors.blue
              e.currentTarget.style.color = colors.blueBright
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = colors.border
              e.currentTarget.style.color = colors.textDim
            }}
          >
            GH ↗
          </a>
        </div>
      </nav>
    </>
  )
}
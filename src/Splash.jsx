import { useState, useEffect } from 'react'
import { colors, fonts } from './theme'

const LINES = [
  { text: 'TANASIOM AEGIS SECURITY & COMPLIANCE', color: '#60a5fa', delay: 0 },
  { text: 'INITIALISING SYSTEM...', color: colors.textDim, delay: 400 },
  { text: 'LOADING CE FRAMEWORK v3.3 - NCSC ALIGNED...', color: colors.textDim, delay: 800 },
  { text: 'ESTABLISHING SECURE CONNECTION...', color: colors.textDim, delay: 1200 },
  { text: 'LOADING VULNERABILITY DATABASE...', color: colors.textDim, delay: 1600 },
  { text: 'LOADING POLICY LIBRARY - 13 DOCUMENTS...', color: colors.textDim, delay: 2000 },
  { text: 'LOADING ASSESSMENT ENGINE - 50 CONTROLS...', color: colors.textDim, delay: 2400 },
  { text: 'SYSTEM READY - ACCESS GRANTED', color: '#10b981', delay: 2900 },
]

export default function Splash({ children }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i])
        setProgress(Math.round(((i + 1) / LINES.length) * 100))
      }, line.delay)
    })
    setTimeout(() => setFadeOut(true), 3400)
    setTimeout(() => setDone(true), 4000)
  }, [])

  if (done) return children

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', zIndex: 99999,
      opacity: fadeOut ? 0 : 1, transition: 'opacity 0.6s ease',
      fontFamily: fonts.mono,
    }}>
      {/* Subtle grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.02) 80px, rgba(255,255,255,0.02) 81px), repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.02) 80px, rgba(255,255,255,0.02) 81px)', pointerEvents: 'none' }} />
      {/* Subtle glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '680px', padding: '0 2rem' }}>

        {/* BRAND */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', background: '#1d4ed8', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', flexShrink: 0 }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: fonts.display, fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', letterSpacing: '5px', color: '#f0f6ff', lineHeight: 0.9 }}>TANASIOM AEGIS</div>
              <div style={{ fontFamily: fonts.mono, fontSize: '0.65rem', letterSpacing: '4px', color: '#60a5fa', textTransform: 'uppercase', marginTop: '0.35rem' }}>Security & Compliance</div>
            </div>
          </div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '4px', color: 'rgba(224,236,255,0.3)', textTransform: 'uppercase' }}>
            Cyber Essentials Readiness — UK SME Specialists
          </div>
        </div>

        {/* TERMINAL */}
        <div style={{ background: 'rgba(5,8,16,0.7)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', marginBottom: '2rem', minHeight: '180px', backdropFilter: 'blur(12px)' }}>
          <div style={{ fontSize: '0.6rem', color: 'rgba(224,236,255,0.2)', letterSpacing: '2px', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
            TANASIOM-AEGIS-SYSTEM v3.0 — SECURE BOOT
          </div>
          {LINES.map((line, i) => (
            <div key={i} style={{
              fontSize: '0.68rem',
              color: visibleLines.includes(i) ? line.color : 'transparent',
              letterSpacing: '1px', marginBottom: '0.4rem',
              transition: 'color 0.3s ease',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ color: '#3b82f6', flexShrink: 0 }}>{'>'}</span>
              {line.text}
            </div>
          ))}
        </div>

        {/* PROGRESS */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.6rem', color: 'rgba(224,236,255,0.3)', letterSpacing: '2px' }}>LOADING</span>
            <span style={{ fontSize: '0.6rem', color: '#60a5fa', letterSpacing: '2px' }}>{progress}%</span>
          </div>
          <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)', width: `${progress}%`, transition: 'width 0.4s ease', borderRadius: '2px' }} />
          </div>
        </div>

      </div>
    </div>
  )
}
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const valueStack = [
  { item: 'Full CE Gap Analysis (50-question audit)', value: '£450' },
  { item: 'RAG Status Report per control area', value: '£200' },
  { item: 'Prioritised Remediation Roadmap', value: '£300' },
  { item: 'Evidence Pack Templates (7 documents)', value: '£250' },
  { item: '30-Day Fix Plan Checklist', value: '£147' },
  { item: 'Staff Awareness Micro-Training Slides', value: '£197' },
  { item: 'Interactive CE Dashboard Access', value: '£127' },
  { item: '48-Hour Turnaround Guarantee', value: '£PRICELESS' },
]

const services = [
  { icon: '🛡️', num: '01', title: 'CE Pre-Certification', desc: 'Full gap analysis across all 5 NCSC control areas. We find every gap before the assessor does.', link: '/framework', tag: 'MOST POPULAR' },
  { icon: '🔍', num: '02', title: 'Penetration Testing', desc: 'Controlled offensive assessments. CVSS-rated findings. Full written reports with CE mapping.', link: '/lab', tag: 'OFFENSIVE' },
  { icon: '📋', num: '03', title: 'Policies & Documentation', desc: '7+ downloadable templates — firewall rules, patch management, incident response, MFA guides.', link: '/docs', tag: 'COMPLIANCE' },
  { icon: '👤', num: '04', title: 'Access Control Audits', desc: 'Account reviews, MFA rollout, privilege analysis. Full access matrix documentation.', link: '/services', tag: 'CE AREA 4' },
  { icon: '🐛', num: '05', title: 'Bug Bounty & Vuln Research', desc: 'Structured vulnerability discovery. Responsible disclosure. CVSS-rated with exploitation evidence.', link: '/vulnerabilities', tag: 'RESEARCH' },
  { icon: '🖥️', num: '06', title: 'Device Sanitisation', desc: 'GDPR-compliant secure wiping. Certified disposal. Evidence pack provided. Zero trace guaranteed.', link: '/services', tag: 'GDPR' },
  { icon: '♻️', num: '07', title: 'Device Ecology', desc: 'Circular IT for SMEs. Secure disposal, certified data destruction, hardware resale, server rental.', link: '/services', tag: 'CIRCULAR IT' },
  { icon: '🎓', num: '08', title: 'Compliance Training', desc: 'Staff awareness for CE, GDPR, ISO 21434. Niche manuals for SIA Security and HGV sectors.', link: '/services', tag: 'TRAINING' },
]

const painStats = [
  { n: '£12,000+', l: 'Average UK SME breach cost', sub: 'Including downtime, fines & reputation' },
  { n: '43%', l: 'Of cyberattacks target SMEs', sub: 'Yet most have zero formal protection' },
  { n: '60%', l: 'Of SMEs close within 6 months', sub: 'After a significant data breach' },
]

export default function Home() {
  return (
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#f4f6f8', color: '#1a2332', minHeight: '100vh', overflowX: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        .svc-card { background: #ffffff; border: 1px solid #dde3ec; padding: 1.75rem; text-decoration: none; color: inherit; display: block; transition: all 0.3s; position: relative; overflow: hidden; }
        .svc-card:hover { border-color: #1d4ed8; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(29,78,216,0.08); }
        .vs-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-bottom: 1px solid #edf0f5; font-size: 0.82rem; transition: background 0.2s; }
        .vs-row:hover { background: rgba(29,78,216,0.03); }
        .btn-primary { background: #1d4ed8; color: #fff; font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; letter-spacing: 3px; padding: 0.9rem 2.5rem; border: none; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px)); }
        .btn-primary:hover { background: #1e40af; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(29,78,216,0.3); }
        .btn-ghost { background: transparent; color: #1a2332; font-family: 'Share Tech Mono', monospace; font-size: 0.78rem; letter-spacing: 2px; padding: 0.9rem 1.75rem; border: 1px solid #c8d0dc; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; }
        .btn-ghost:hover { border-color: #1d4ed8; color: #1d4ed8; }
        .pain-card { padding: 2rem 1.5rem; text-align: center; border-right: 1px solid #dde3ec; position: relative; overflow: hidden; transition: background 0.3s; background: #ffffff; }
        .pain-card:hover { background: #f8f9fc; }
        .cred-card { background: #ffffff; padding: 1.25rem; text-align: center; border: 1px solid #dde3ec; transition: all 0.2s; }
        .cred-card:hover { border-color: #1d4ed8; box-shadow: 0 4px 16px rgba(29,78,216,0.06); }
      `}</style>

      {/* HERO */}
      <div style={{ padding: '6rem 2rem 5rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.02) 80px, rgba(255,255,255,0.02) 81px), repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.02) 80px, rgba(255,255,255,0.02) 81px)', pointerEvents: 'none' }} />
        {/* Subtle blue glow — no animation */}
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '4px', color: '#60a5fa', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: 24, height: 1, background: '#60a5fa', display: 'inline-block' }} />
            CYBER ESSENTIALS READINESS · UK SME SPECIALIST · LEGAL TENDER

          </div>

          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', lineHeight: 0.9, letterSpacing: '3px', marginBottom: '0.5rem', color: '#f0f6ff' }}>
            TANASIOM AEGIS
          </h1>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)', letterSpacing: '6px', color: '#60a5fa', marginBottom: '2rem' }}>
            SECURITY & COMPLIANCE
          </h2>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1rem, 2vw, 1.3rem)', color: 'rgba(224,236,255,0.7)', fontStyle: 'italic', marginBottom: '0.75rem', maxWidth: '620px', lineHeight: 1.7 }}>
            Your business will be breached.<br />
            <strong style={{ color: '#f0f6ff', fontStyle: 'normal' }}>The only question is — do you find the gap first, or do they?</strong>
          </p>

          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', color: 'rgba(224,236,255,0.35)', letterSpacing: '3px', marginBottom: '2.5rem', textTransform: 'uppercase' }}>
            Cyber Essentials · Penetration Testing · Device Ecology · Compliance
          </div>

          {/* OFFER CARD */}
          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderLeft: '3px solid #3b82f6', padding: '1.75rem 2rem', maxWidth: '520px', marginBottom: '2.5rem', backdropFilter: 'blur(12px)' }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: 'rgba(224,236,255,0.4)', letterSpacing: '3px', marginBottom: '1rem' }}>// SME CYBER RISK REVIEW — FIXED FEE ENGAGEMENT</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4rem', lineHeight: 1, color: '#f0f6ff' }}>£397</span>
              <div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: 'rgba(224,236,255,0.35)', textDecoration: 'line-through' }}>£1,671 total value</div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#60a5fa' }}>YOU SAVE £1,274</div>
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(224,236,255,0.55)', marginBottom: '1rem', lineHeight: 1.6 }}>Full gap analysis · RAG report · Remediation roadmap · 48hr turnaround</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#f87171', fontFamily: "'Share Tech Mono', monospace" }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f87171', display: 'inline-block' }} />
              ONLY 5 SLOTS AVAILABLE THIS MONTH
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/framework" className="btn-primary">RUN FREE ASSESSMENT →</Link>
            <Link to="/contact" className="btn-ghost" style={{ color: 'rgba(224,236,255,0.7)', borderColor: 'rgba(255,255,255,0.2)' }}>SECURE YOUR SLOT</Link>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: 'rgba(224,236,255,0.3)', letterSpacing: '2px' }}>10× GUARANTEE OR YOU DON'T PAY</div>
          </div>
        </div>
      </div>

      {/* PAIN STATS */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #dde3ec' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
          {painStats.map((s, i) => (
            <div key={s.l} className="pain-card" style={{ borderRight: i < 2 ? '1px solid #dde3ec' : 'none' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: i === 0 ? '#ef4444' : i === 1 ? '#1d4ed8' : '#16a34a' }} />
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1d4ed8', lineHeight: 1, marginBottom: '0.5rem', paddingTop: '1.5rem' }}>{s.n}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '0.9rem', color: '#1a2332', marginBottom: '0.35rem' }}>{s.l}</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#8a96a8' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEM SECTION */}
      <div style={{ background: '#f4f6f8', padding: '5rem 2rem', borderBottom: '1px solid #dde3ec' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#ef4444', letterSpacing: '3px', marginBottom: '1rem' }}>// THE PROBLEM</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '2px', color: '#0f172a', marginBottom: '1.25rem', lineHeight: 1 }}>
                YOU THINK YOU'RE SECURE.<br /><span style={{ color: '#ef4444' }}>YOU'RE NOT.</span>
              </h2>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', color: '#4a5568', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                "Most SMEs don't get hacked because they're targeted. They get hacked because they're easy."
              </p>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.8 }}>
                No firewall documentation. No MFA on admin accounts. Patches 60 days overdue. Default passwords still running on network devices. This is the reality for 8 out of 10 SMEs we assess.
                <br /><br />
                <strong style={{ color: '#0f172a' }}>And every single one of those gaps is an automatic Cyber Essentials fail.</strong>
              </p>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #dde3ec', borderLeft: '3px solid #ef4444', padding: '2rem', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#8a96a8', letterSpacing: '3px', marginBottom: '1.25rem' }}>// COST OF INACTION</div>
              {[
                { label: 'Failed CE certification fee', cost: '£350–600', color: '#ef4444' },
                { label: 'Lost public sector tender', cost: '£10,000+', color: '#ef4444' },
                { label: 'Average SME breach cost', cost: '£12,000+', color: '#ef4444' },
                { label: 'GDPR fine (small breach)', cost: '£72,000+', color: '#ef4444' },
                { label: 'Tanasiom Aegis review', cost: '£397', color: '#16a34a' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #edf0f5', fontSize: '0.82rem' }}>
                  <span style={{ color: '#64748b' }}>{r.label}</span>
                  <span style={{ color: r.color, fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>{r.cost}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* VALUE STACK */}
      <div style={{ background: '#ffffff', padding: '5rem 2rem', borderBottom: '1px solid #dde3ec' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#1d4ed8', letterSpacing: '3px', marginBottom: '1rem' }}>// THE OFFER</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '2px', color: '#0f172a', lineHeight: 0.95, marginBottom: '1.5rem' }}>
                THE MOST ASYMMETRIC<br /><span style={{ color: '#1d4ed8' }}>BET IN CYBER.</span>
              </h2>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontStyle: 'italic', color: '#4a5568', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                "£397 against £12,000+ in potential losses. You'd have to be irrational to say no."
              </p>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.8, marginBottom: '2rem' }}>
                This isn't a consultancy retainer. It isn't a day-rate audit. It's a fixed-scope, fixed-fee engagement with one outcome: you know exactly what to fix, in what order, to pass Cyber Essentials.
                <br /><br />
                <strong style={{ color: '#0f172a' }}>And if you don't feel you got 10× the value — you don't pay. Full stop.</strong>
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.5rem', background: '#f0f7ff', border: '1px solid #bfdbfe', marginBottom: '2rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid #1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>🛡️</div>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '2px', color: '#1d4ed8', marginBottom: '0.35rem' }}>THE 10× GUARANTEE</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.65 }}>If after your review you don't genuinely feel you received at least 10× the value of what you paid — you don't pay. No forms. No awkward process. Just say the word.</div>
                </div>
              </div>
              <Link to="/contact" className="btn-primary" style={{ display: 'inline-block' }}>SECURE YOUR SLOT NOW →</Link>
            </div>

            <div style={{ background: '#f8faff', border: '1px solid #dde3ec', overflow: 'hidden', position: 'relative', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #1d4ed8, #3b82f6, #1d4ed8)' }} />
              <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid #dde3ec' }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#8a96a8', letterSpacing: '3px' }}>// WHAT YOU GET</div>
              </div>
              {valueStack.map((v) => (
                <div key={v.item} className="vs-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: '#16a34a', fontSize: '0.7rem' }}>✓</span>
                    <span style={{ color: '#1a2332', fontSize: '0.82rem' }}>{v.item}</span>
                  </div>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: '#1d4ed8', whiteSpace: 'nowrap', marginLeft: '1rem' }}>{v.value}</span>
                </div>
              ))}
              <div style={{ padding: '1.25rem 1.5rem', background: '#f0f7ff', borderTop: '1px solid #dde3ec' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#8a96a8', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem' }}>TOTAL PERCEIVED VALUE</span>
                  <span style={{ color: '#8a96a8', textDecoration: 'line-through', fontFamily: "'Share Tech Mono', monospace" }}>£1,671</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#1d4ed8' }}>YOU PAY TODAY</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: '#0f172a' }}>£397</span>
                </div>
              </div>
              <div style={{ padding: '1rem 1.5rem' }}>
                <Link to="/contact" style={{ display: 'block', textAlign: 'center', background: '#1d4ed8', color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '3px', padding: '1rem', textDecoration: 'none', transition: 'all 0.2s', clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1e40af' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1d4ed8' }}
                >BOOK YOUR REVIEW — £397 →</Link>
                <div style={{ textAlign: 'center', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#8a96a8', marginTop: '0.75rem', letterSpacing: '2px' }}>10× GUARANTEE · 5 SLOTS LEFT · REMOTE · 48HR</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div style={{ background: '#f4f6f8', borderTop: '1px solid #dde3ec', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#1d4ed8', letterSpacing: '3px', marginBottom: '0.75rem' }}>// SERVICE ARCHITECTURE</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '2px', color: '#0f172a', lineHeight: 0.95 }}>
                FULL-SPECTRUM<br /><span style={{ color: '#1d4ed8' }}>CYBER SERVICES</span>
              </h2>
            </div>
            <Link to="/services" className="btn-ghost">VIEW ALL SERVICES →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1px', background: '#dde3ec' }}>
            {services.map(s => (
              <Link key={s.title} to={s.link} className="svc-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#c8d0dc' }}>{s.num}</div>
                  {s.tag && <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', letterSpacing: '1px', color: '#1d4ed8', border: '1px solid rgba(29,78,216,0.3)', padding: '2px 6px' }}>{s.tag}</span>}
                </div>
                <div style={{ fontSize: '1.6rem', marginBottom: '0.65rem' }}>{s.icon}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.05rem', letterSpacing: '1px', color: '#0f172a', marginBottom: '0.5rem' }}>{s.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.65 }}>{s.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CREDENTIALS */}
      {/* CREDENTIALS */}
      <div style={{ background: '#ffffff', borderTop: '1px solid #dde3ec', borderBottom: '1px solid #dde3ec', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#8a96a8', letterSpacing: '3px', textAlign: 'center', marginBottom: '2.5rem' }}>// CREDENTIALS & AUTHORITY</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>

            {/* NCSC */}
            <div className="cred-card">
              <svg viewBox="0 0 48 48" width="40" height="40" style={{ margin: '0 auto 0.75rem', display: 'block' }}>
                <polygon points="24,4 44,14 44,34 24,44 4,34 4,14" fill="none" stroke="#1d4ed8" strokeWidth="2"/>
                <polygon points="24,10 38,18 38,30 24,38 10,30 10,18" fill="#1d4ed8" opacity="0.08"/>
                <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="monospace" fill="#1d4ed8">NCSC</text>
              </svg>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '2px', color: '#1d4ed8', marginBottom: '0.3rem' }}>NCSC</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', color: '#8a96a8', lineHeight: 1.4 }}>National Cyber Security Centre Aligned</div>
            </div>

            {/* IASME */}
            <div className="cred-card">
              <svg viewBox="0 0 48 48" width="40" height="40" style={{ margin: '0 auto 0.75rem', display: 'block' }}>
                <rect x="6" y="8" width="36" height="32" rx="3" fill="none" stroke="#1d4ed8" strokeWidth="2"/>
                <rect x="6" y="8" width="36" height="10" rx="3" fill="#1d4ed8" opacity="0.12"/>
                <text x="24" y="17" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="monospace" fill="#1d4ed8">IASME</text>
                <line x1="12" y1="26" x2="36" y2="26" stroke="#1d4ed8" strokeWidth="1.5" opacity="0.4"/>
                <line x1="12" y1="31" x2="30" y2="31" stroke="#1d4ed8" strokeWidth="1.5" opacity="0.3"/>
                <line x1="12" y1="36" x2="26" y2="36" stroke="#1d4ed8" strokeWidth="1.5" opacity="0.2"/>
              </svg>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '2px', color: '#1d4ed8', marginBottom: '0.3rem' }}>IASME</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', color: '#8a96a8', lineHeight: 1.4 }}>Consortium CE Certification Body</div>
            </div>

            {/* Cyber Essentials */}
            <div className="cred-card">
              <svg viewBox="0 0 48 48" width="40" height="40" style={{ margin: '0 auto 0.75rem', display: 'block' }}>
                <path d="M24 4 L40 10 L40 26 C40 35 32 42 24 44 C16 42 8 35 8 26 L8 10 Z" fill="none" stroke="#1d4ed8" strokeWidth="2"/>
                <path d="M24 10 L34 14 L34 26 C34 31 30 36 24 38 C18 36 14 31 14 26 L14 14 Z" fill="#1d4ed8" opacity="0.08"/>
                <polyline points="18,24 22,28 30,20" stroke="#1d4ed8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '2px', color: '#1d4ed8', marginBottom: '0.3rem' }}>CYBER ESSENTIALS</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', color: '#8a96a8', lineHeight: 1.4 }}>CE & CE+ Readiness Specialist</div>
            </div>

            {/* CRISC */}
            <div className="cred-card">
              <svg viewBox="0 0 48 48" width="40" height="40" style={{ margin: '0 auto 0.75rem', display: 'block' }}>
                <circle cx="24" cy="24" r="18" fill="none" stroke="#1d4ed8" strokeWidth="2"/>
                <circle cx="24" cy="24" r="10" fill="#1d4ed8" opacity="0.08"/>
                <text x="24" y="21" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="monospace" fill="#1d4ed8">RISK</text>
                <text x="24" y="30" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#1d4ed8" opacity="0.7">ISACA</text>
              </svg>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '2px', color: '#1d4ed8', marginBottom: '0.3rem' }}>CRISC</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', color: '#8a96a8', lineHeight: 1.4 }}>Certified Risk & Info Systems Control</div>
            </div>

            {/* GRC */}
            <div className="cred-card">
              <svg viewBox="0 0 48 48" width="40" height="40" style={{ margin: '0 auto 0.75rem', display: 'block' }}>
                <rect x="8" y="8" width="14" height="14" rx="2" fill="none" stroke="#1d4ed8" strokeWidth="2"/>
                <rect x="26" y="8" width="14" height="14" rx="2" fill="none" stroke="#1d4ed8" strokeWidth="2"/>
                <rect x="8" y="26" width="14" height="14" rx="2" fill="none" stroke="#1d4ed8" strokeWidth="2"/>
                <rect x="26" y="26" width="14" height="14" rx="2" fill="#1d4ed8" opacity="0.12" stroke="#1d4ed8" strokeWidth="2"/>
                <text x="33" y="36" textAnchor="middle" fontSize="6" fontWeight="700" fontFamily="monospace" fill="#1d4ed8">✓</text>
              </svg>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '2px', color: '#1d4ed8', marginBottom: '0.3rem' }}>GRC</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', color: '#8a96a8', lineHeight: 1.4 }}>Governance Risk & Compliance</div>
            </div>

            {/* AWS */}
            <div className="cred-card">
              <svg viewBox="0 0 48 48" width="40" height="40" style={{ margin: '0 auto 0.75rem', display: 'block' }}>
                <path d="M8 28 Q24 36 40 28" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 22 Q24 14 36 22" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                <circle cx="24" cy="24" r="6" fill="#1d4ed8" opacity="0.1" stroke="#1d4ed8" strokeWidth="1.5"/>
                <text x="24" y="27" textAnchor="middle" fontSize="6" fontWeight="700" fontFamily="monospace" fill="#1d4ed8">AWS</text>
              </svg>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '2px', color: '#1d4ed8', marginBottom: '0.3rem' }}>AWS SAA-C03</div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', color: '#8a96a8', lineHeight: 1.4 }}>Solutions Architect Associate</div>
            </div>

          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', padding: '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#f87171', letterSpacing: '4px', marginBottom: '1.5rem' }}>⏳ 5 SLOTS AVAILABLE THIS MONTH</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '3px', color: '#f0f6ff', lineHeight: 0.9, marginBottom: '1.5rem' }}>
            STOP GUESSING.<br />START KNOWING.
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', color: 'rgba(224,236,255,0.6)', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Book your 45-minute SME Cyber Risk Review. Get your prioritised action plan within 48 hours. Pass CE prepared.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary" style={{ fontSize: '1.3rem', padding: '1rem 3rem' }}>BOOK YOUR REVIEW — £397 →</Link>
            <Link to="/framework" className="btn-ghost" style={{ color: 'rgba(224,236,255,0.7)', borderColor: 'rgba(255,255,255,0.2)' }}>TRY FREE ASSESSMENT FIRST</Link>
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: 'rgba(224,236,255,0.2)', marginTop: '1.5rem', letterSpacing: '3px' }}>
            10× VALUE GUARANTEE · REMOTE · 48-HR TURNAROUND · NCSC CE v3.3 · UK BASED
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#0f172a', padding: '0.75rem 2rem', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)' }}>
          TANASIOM AEGIS SECURITY & COMPLIANCE — CYBER ESSENTIALS READINESS FRAMEWORK
        </div>
      </div>
      <footer style={{ padding: '2rem 2rem', borderTop: '1px solid #dde3ec', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: '#f4f6f8' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#8a96a8', letterSpacing: '0.2em' }}>
          TANASIOM AEGIS SECURITY & COMPLIANCE © 2026 · DUMITRU TANASIE · BSc CYBER SECURITY & NETWORKING · LONDON MET
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="https://github.com/ddt-Tanasie/Tanasiom-Aegis-CE-Readiness-Framework" target="_blank" rel="noreferrer" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#8a96a8', textDecoration: 'none' }}>GITHUB ↗</a>
          <Link to="/framework" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#8a96a8', textDecoration: 'none' }}>FREE ASSESSMENT ↗</Link>
        </div>
      </footer>

    </div>
  )
}
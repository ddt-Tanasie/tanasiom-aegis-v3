import { useState } from 'react'
import { Link } from 'react-router-dom'

const mono = "'Share Tech Mono', monospace"
const display = "'Bebas Neue', sans-serif"
const body = "'Barlow Condensed', sans-serif"
const serif = "'Cormorant Garamond', serif"

const CE_FAILURES = [
  {
    area: 'Firewalls',
    icon: '🛡️',
    color: '#dc2626',
    verdict: 'FAIL',
    headline: 'The front door was wide open.',
    story: 'The network had 20+ ports exposed with no documented justification. One of them was a root-level shell — no password, no authentication, no exploit required. Anyone who found it had immediate, complete control.',
    plain: 'Under Cyber Essentials, every open port needs a business reason. Ports with no documented justification are an automatic failure. Most SME networks we see have legacy ports left open from years ago that nobody remembers opening.',
    stat: '20+ undocumented open ports',
    cta: 'CE requires all inbound connections to be blocked by default unless explicitly approved.',
  },
  {
    area: 'Secure Configuration',
    icon: '⚙️',
    color: '#d97706',
    verdict: 'FAIL',
    headline: 'Every default was still a default.',
    story: 'Default credentials were running across three services — a database, a remote desktop tool, and a web management panel. The database was accessible from any IP. The admin panel accepted "admin / admin". These aren\'t edge cases. These are the settings software ships with.',
    plain: 'Changing default passwords before deployment is one of the most basic CE requirements — and one of the most commonly missed. Assessors check for it specifically.',
    stat: '3 services with unchanged default credentials',
    cta: 'CE requires all default passwords to be changed before any system goes into use.',
  },
  {
    area: 'Update Management',
    icon: '🔄',
    color: '#d97706',
    verdict: 'FAIL',
    headline: 'The software hadn\'t been updated in years.',
    story: 'Multiple services were running versions with publicly known critical vulnerabilities — some dating back to 2004. One was a supply chain backdoor introduced into the software\'s own installer. It had been sitting there, exploitable, for over a decade.',
    plain: 'CE requires critical and high-risk patches to be applied within 14 days of release. End-of-life software with no available patches is an automatic failure — it doesn\'t matter how long it\'s been running without incident.',
    stat: '6 services running end-of-life or critically unpatched software',
    cta: 'CE requires all in-scope software to be vendor-supported and patched within 14 days.',
  },
  {
    area: 'User Access Control',
    icon: '🔑',
    color: '#dc2626',
    verdict: 'FAIL',
    headline: 'Once in, we took everything.',
    story: 'After gaining initial access, we extracted the full user credential database within minutes. Three of five passwords were cracked in under two minutes using freely available tools and a common wordlist. We then created a hidden administrator account that would survive a reboot — and would still be there weeks later if nobody audited the user list.',
    plain: 'CE requires separation of admin accounts, strong password policies, brute-force protection, and a formal process for removing accounts when staff leave. Weak passwords and unreviewed accounts are two of the most common SME failures.',
    stat: 'Full credential database extracted · 3/5 passwords cracked in under 2 minutes',
    cta: 'CE requires MFA on all cloud services, separate admin accounts, and regular access reviews.',
  },
  {
    area: 'Malware Protection',
    icon: '🦠',
    color: '#7c3aed',
    verdict: 'FAIL',
    headline: 'Nothing was watching.',
    story: 'No antivirus. No endpoint monitoring. No logging. Malicious files were uploaded, executed, and removed with no alert triggered at any point. We established persistent access, ran credential extraction tools, and exfiltrated data — all without a single detection event.',
    plain: 'CE requires active, real-time malware protection on all in-scope devices. A product that isn\'t running, isn\'t updated, or only runs scheduled scans does not meet the requirement.',
    stat: 'Zero detections across the full engagement',
    cta: 'CE requires active anti-malware with real-time protection enabled on every in-scope device.',
  },
]

const TIMELINE = [
  { time: '09:47', phase: 'Network mapped', detail: '4 hosts identified. 20+ open ports catalogued. Operating system versions fingerprinted.', icon: '🔍' },
  { time: '10:22', phase: 'Vulnerabilities identified', detail: 'Cross-referenced all service versions against public CVE records. 6 critical vulnerabilities confirmed before any exploitation attempt.', icon: '📋' },
  { time: '10:31', phase: 'Initial access gained', detail: 'Exploited a known vulnerability in an unpatched service. Root-level access obtained in under 4 minutes from first connection.', icon: '⚡' },
  { time: '10:44', phase: 'Credentials extracted', detail: 'Full user credential database retrieved and cracked. 3 of 5 passwords recovered in under 2 minutes.', icon: '🔓' },
  { time: '11:02', phase: 'Lateral movement confirmed', detail: 'Three independent paths to full system control identified and verified. Each one exploiting a different CE control area failure.', icon: '🕸️' },
  { time: '11:18', phase: 'Persistence established', detail: 'Hidden administrator account created. Would remain undetected indefinitely without a formal user access review.', icon: '🕷️' },
  { time: '11:35', phase: 'Assessment complete', detail: 'All 5 Cyber Essentials control areas: FAIL. Every finding traceable to a control that CE exists to prevent.', icon: '📊' },
]

function CEFailCard({ f, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: '#ffffff', border: '1px solid #dde3ec', borderLeft: `4px solid ${f.color}`, overflow: 'hidden', transition: 'all 0.2s' }}>
      {/* Header — always visible */}
      <div style={{ padding: '1.5rem', cursor: 'pointer', display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: '1rem', alignItems: 'start' }} onClick={() => setOpen(o => !o)}>
        <div style={{ width: 40, height: 40, background: `${f.color}12`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{f.icon}</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: mono, fontSize: '0.58rem', color: f.color, border: `1px solid ${f.color}40`, padding: '1px 7px', letterSpacing: '2px' }}>CE: {f.verdict}</span>
            <span style={{ fontFamily: display, fontSize: '0.8rem', letterSpacing: '2px', color: '#64748b' }}>{f.area.toUpperCase()}</span>
          </div>
          <h3 style={{ fontFamily: serif, fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', fontStyle: 'italic', color: '#0f172a', lineHeight: 1.3, marginBottom: '0.4rem' }}>{f.headline}</h3>
          <div style={{ fontFamily: mono, fontSize: '0.62rem', color: f.color, letterSpacing: '1px' }}>{f.stat}</div>
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.8rem', flexShrink: 0, paddingTop: '0.25rem' }}>{open ? '▲' : '▼'}</div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div style={{ borderTop: '1px solid #edf0f5' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            <div style={{ padding: '1.25rem 1.5rem', borderRight: '1px solid #edf0f5' }}>
              <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#94a3b8', letterSpacing: '2px', marginBottom: '0.6rem' }}>WHAT WE FOUND</div>
              <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.8 }}>{f.story}</p>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#1d4ed8', letterSpacing: '2px', marginBottom: '0.6rem' }}>WHY IT MATTERS FOR CE</div>
              <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.8, marginBottom: '1rem' }}>{f.plain}</p>
              <div style={{ background: '#f0f7ff', border: '1px solid #bfdbfe', borderLeft: `3px solid #1d4ed8`, padding: '0.75rem 1rem' }}>
                <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#1d4ed8', letterSpacing: '1px', marginBottom: '0.25rem' }}>CE REQUIREMENT</div>
                <div style={{ fontSize: '0.8rem', color: '#1e40af', lineHeight: 1.65 }}>{f.cta}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Lab() {
  const [activeSection, setActiveSection] = useState('findings')

  return (
    <div style={{ fontFamily: body, background: '#f4f6f8', color: '#1a2332', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        @media(max-width:768px){ .lab-hero-grid{grid-template-columns:1fr!important;} .lab-finding-detail{grid-template-columns:1fr!important;} .lab-timeline{grid-template-columns:1fr!important;} }
      `}</style>

      {/* LEGAL NOTE */}
      <div style={{ background: '#fefce8', borderBottom: '1px solid #fde68a', padding: '0.4rem 1.5rem', textAlign: 'center' }}>
        <span style={{ fontFamily: mono, fontSize: '0.58rem', color: '#92400e', letterSpacing: '2px' }}>
          ALL TESTING CONDUCTED WITHIN AN ISOLATED VIRTUALISED ENVIRONMENT · NO EXTERNAL OR LIVE SYSTEMS INVOLVED · COMPUTER MISUSE ACT 1990 COMPLIANT
        </span>
      </div>

      {/* HERO */}
      <div style={{ padding: '5rem 1.5rem 4rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '4px', color: '#60a5fa', marginBottom: '1.5rem' }}>// TANASIOM AEGIS SECURITY & COMPLIANCE — TECHNICAL EVIDENCE</div>
          <h1 style={{ fontFamily: display, fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 0.9, letterSpacing: '3px', color: '#f0f6ff', marginBottom: '1.25rem' }}>
            WE BUILT THE NETWORK.<br />
            <span style={{ color: '#f87171' }}>THEN WE BROKE IT.</span>
          </h1>
          <p style={{ fontFamily: serif, fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontStyle: 'italic', color: 'rgba(224,236,255,0.7)', maxWidth: '680px', lineHeight: 1.8, marginBottom: '2rem' }}>
            A simulated SME network. Standard off-the-shelf configuration. No security consultant involved in the setup. We then assessed it against Cyber Essentials — the same framework your business will be judged against when you apply.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderLeft: '3px solid #f87171', padding: '1.25rem 1.5rem', maxWidth: '640px', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.95rem', color: 'rgba(224,236,255,0.8)', lineHeight: 1.8 }}>
              <strong style={{ color: '#f0f6ff' }}>All 5 Cyber Essentials control areas failed.</strong> Not because the network was unusually poorly configured — but because it was configured the way most SME networks are configured. That is the point.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveSection('findings')} style={{ background: activeSection === 'findings' ? '#dc2626' : 'transparent', color: activeSection === 'findings' ? '#fff' : 'rgba(224,236,255,0.7)', fontFamily: display, fontSize: '1rem', letterSpacing: '3px', padding: '0.75rem 1.75rem', border: `1px solid ${activeSection === 'findings' ? '#dc2626' : 'rgba(255,255,255,0.2)'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
              SEE THE FINDINGS
            </button>
            <button onClick={() => setActiveSection('timeline')} style={{ background: activeSection === 'timeline' ? '#1d4ed8' : 'transparent', color: activeSection === 'timeline' ? '#fff' : 'rgba(224,236,255,0.7)', fontFamily: display, fontSize: '1rem', letterSpacing: '3px', padding: '0.75rem 1.75rem', border: `1px solid ${activeSection === 'timeline' ? '#1d4ed8' : 'rgba(255,255,255,0.2)'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
              HOW IT UNFOLDED
            </button>
            <button onClick={() => setActiveSection('context')} style={{ background: activeSection === 'context' ? '#7c3aed' : 'transparent', color: activeSection === 'context' ? '#fff' : 'rgba(224,236,255,0.7)', fontFamily: display, fontSize: '1rem', letterSpacing: '3px', padding: '0.75rem 1.75rem', border: `1px solid ${activeSection === 'context' ? '#7c3aed' : 'rgba(255,255,255,0.2)'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
              WHAT THIS MEANS FOR YOU
            </button>
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #dde3ec' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', background: '#dde3ec' }}>
          {[
            { n: '5/5', l: 'CE control areas failed', color: '#dc2626' },
            { n: '12', l: 'Vulnerabilities identified', color: '#d97706' },
            { n: '6', l: 'Critical severity findings', color: '#dc2626' },
            { n: '< 4 min', l: 'Time to full system access', color: '#dc2626' },
            { n: '< 2 min', l: 'Time to crack 3 passwords', color: '#d97706' },
          ].map(s => (
            <div key={s.l} style={{ background: '#ffffff', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontFamily: display, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: s.color, lineHeight: 1, marginBottom: '0.35rem' }}>{s.n}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* FINDINGS */}
        {activeSection === 'findings' && (
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ fontFamily: mono, fontSize: '9px', color: '#dc2626', letterSpacing: '3px', marginBottom: '0.5rem' }}>// WHAT A STANDARD SME NETWORK LOOKS LIKE UNDER ASSESSMENT</div>
              <h2 style={{ fontFamily: display, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '2px', color: '#0f172a', marginBottom: '0.75rem' }}>
                FIVE CONTROL AREAS. <span style={{ color: '#dc2626' }}>FIVE FAILURES.</span>
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '680px', lineHeight: 1.8 }}>
                Each failure below is a real finding from our lab environment — configured to reflect the defaults and oversights we most commonly observe in UK SME networks. Click any finding to understand what we found, why it matters, and what Cyber Essentials requires.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#dde3ec', marginBottom: '3rem' }}>
              {CE_FAILURES.map((f, i) => <CEFailCard key={f.area} f={f} index={i} />)}
            </div>

            {/* THE CONCLUSION */}
            <div style={{ background: '#ffffff', border: '1px solid #dde3ec', padding: '2.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: mono, fontSize: '9px', color: '#1d4ed8', letterSpacing: '3px', marginBottom: '0.75rem' }}>// THE CONCLUSION</div>
                  <h3 style={{ fontFamily: display, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', letterSpacing: '2px', color: '#0f172a', lineHeight: 0.95, marginBottom: '1.25rem' }}>
                    THIS ISN'T A WORST-CASE SCENARIO.<br />
                    <span style={{ color: '#1d4ed8' }}>IT'S THE AVERAGE CASE.</span>
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                    The network we tested wasn't designed to fail. It was simply built the way most SME networks are built — by people whose job is running a business, not securing one. The controls that CE requires aren't advanced. They're foundational. The gap between where most SMEs are and where CE needs them to be is almost always closable. The question is whether you find that gap before an assessor — or an attacker — does.
                  </p>
                  <p style={{ fontFamily: serif, fontSize: '1.05rem', fontStyle: 'italic', color: '#475569', lineHeight: 1.75 }}>
                    "The most consistent finding across every SME network we assess isn't a sophisticated vulnerability. It's a series of small, fixable defaults that nobody got around to changing."
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'Firewalls', pct: 0, color: '#dc2626' },
                    { label: 'Secure Configuration', pct: 0, color: '#dc2626' },
                    { label: 'Update Management', pct: 0, color: '#dc2626' },
                    { label: 'User Access Control', pct: 0, color: '#dc2626' },
                    { label: 'Malware Protection', pct: 0, color: '#dc2626' },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', color: '#334155' }}>{s.label}</span>
                        <span style={{ fontFamily: mono, fontSize: '0.65rem', color: '#dc2626', border: '1px solid #fecaca', padding: '1px 7px' }}>FAIL</span>
                      </div>
                      <div style={{ height: '6px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '2px' }}>
                        <div style={{ height: '100%', background: '#dc2626', borderRadius: '2px', width: '100%', opacity: 0.3 }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '0.5rem', padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', textAlign: 'center' }}>
                    <span style={{ fontFamily: display, fontSize: '1.1rem', letterSpacing: '3px', color: '#dc2626' }}>CE RESULT: NOT CERTIFIED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TIMELINE */}
        {activeSection === 'timeline' && (
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ fontFamily: mono, fontSize: '9px', color: '#1d4ed8', letterSpacing: '3px', marginBottom: '0.5rem' }}>// FROM FIRST CONNECTION TO FULL COMPROMISE</div>
              <h2 style={{ fontFamily: display, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '2px', color: '#0f172a', marginBottom: '0.75rem' }}>
                UNDER TWO HOURS. <span style={{ color: '#1d4ed8' }}>START TO FINISH.</span>
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '680px', lineHeight: 1.8 }}>
                This is the sequence of events from the moment we connected to the network. Each step used publicly available tools and publicly documented vulnerabilities. No zero-days. No sophisticated tradecraft. Just methodical application of what every attacker already knows.
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              {/* Vertical line */}
              <div style={{ position: 'absolute', left: '39px', top: 0, bottom: 0, width: '1px', background: '#dde3ec', zIndex: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {TIMELINE.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', background: '#ffffff', border: '1px solid #dde3ec', padding: '1.5rem', position: 'relative', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderLeftColor = '#1d4ed8'}
                    onMouseLeave={e => e.currentTarget.style.borderLeftColor = '#dde3ec'}
                  >
                    <div style={{ flexShrink: 0, textAlign: 'center', width: '56px' }}>
                      <div style={{ fontFamily: mono, fontSize: '0.68rem', color: '#dc2626', letterSpacing: '1px', marginBottom: '0.3rem' }}>{t.time}</div>
                      <div style={{ width: 36, height: 36, background: '#f8faff', border: '1px solid #dde3ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', margin: '0 auto' }}>{t.icon}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: display, fontSize: '1.1rem', letterSpacing: '2px', color: '#0f172a', marginBottom: '0.4rem' }}>{t.phase}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.7 }}>{t.detail}</div>
                    </div>
                    <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#94a3b8', flexShrink: 0 }}>STEP {String(i + 1).padStart(2, '0')}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#f0f7ff', border: '1px solid #bfdbfe', padding: '2rem', marginTop: '2rem' }}>
              <div style={{ fontFamily: mono, fontSize: '9px', color: '#1d4ed8', letterSpacing: '3px', marginBottom: '0.5rem' }}>// IMPORTANT CONTEXT</div>
              <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.8 }}>
                The speed of this engagement is not the headline. The more important point is that <strong>every single step was preventable</strong> — and the prevention for each one is explicitly required by Cyber Essentials. The framework exists precisely because these findings repeat, reliably, across SME networks that haven't been formally assessed.
              </p>
            </div>
          </div>
        )}

        {/* CONTEXT / WHAT THIS MEANS */}
        {activeSection === 'context' && (
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ fontFamily: mono, fontSize: '9px', color: '#7c3aed', letterSpacing: '3px', marginBottom: '0.5rem' }}>// TRANSLATING THIS TO YOUR BUSINESS</div>
              <h2 style={{ fontFamily: display, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '2px', color: '#0f172a', marginBottom: '0.75rem' }}>
                YOUR NETWORK ISN'T THIS NETWORK.<br />
                <span style={{ color: '#7c3aed' }}>BUT IT MIGHT BE CLOSER THAN YOU THINK.</span>
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '680px', lineHeight: 1.8 }}>
                We're not suggesting your business is as exposed as the network we tested. What we are saying is that the gaps we found — default credentials, unpatched software, no access reviews, no malware monitoring — are not exotic. They're the gaps we encounter most frequently when working with SMEs who are applying for CE for the first time.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: '#dde3ec', marginBottom: '2.5rem' }}>
              {[
                { q: 'Do you know every open port on your network?', context: 'CE assessors ask for documented business justification for every inbound connection. Most SMEs have never audited their firewall rules.', icon: '🛡️' },
                { q: 'Has anyone changed the default passwords on your router, switches and cloud tools?', context: 'Default credentials are the most common first-step for attackers. CE requires all defaults to be changed before deployment.', icon: '🔐' },
                { q: 'Do you know which software on your network is no longer receiving security updates?', context: 'End-of-life software is an automatic CE failure. Most SMEs are running at least one application past its support date.', icon: '🔄' },
                { q: 'When did you last review who has admin access to your systems?', context: 'Ex-employees with active accounts and excessive privileges are among the most common access control findings.', icon: '👥' },
                { q: 'Is antivirus actively running — not just installed — on every device that touches your business data?', context: 'Installed and running are different things. CE requires active real-time protection, not just software that was set up once.', icon: '🦠' },
              ].map(item => (
                <div key={item.q} style={{ background: '#ffffff', padding: '1.75rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                  <h4 style={{ fontFamily: serif, fontSize: '1.05rem', fontStyle: 'italic', color: '#0f172a', lineHeight: 1.5, marginBottom: '0.75rem' }}>{item.q}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.7 }}>{item.context}</p>
                </div>
              ))}
            </div>

            {/* CE JOURNEY */}
            <div style={{ background: '#ffffff', border: '1px solid #dde3ec', padding: '2.5rem', marginBottom: '2rem' }}>
              <div style={{ fontFamily: mono, fontSize: '9px', color: '#1d4ed8', letterSpacing: '3px', marginBottom: '0.75rem' }}>// THE PATH FROM WHERE YOU ARE TO WHERE CE NEEDS YOU TO BE</div>
              <h3 style={{ fontFamily: display, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '2px', color: '#0f172a', marginBottom: '1.5rem' }}>
                EVERY FINDING IN THIS LAB IS FIXABLE. <span style={{ color: '#16a34a' }}>MOST IN DAYS.</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: '#dde3ec', marginBottom: '1.5rem' }}>
                {[
                  { step: '01', label: 'Know your gaps', desc: 'Run the free self-check or book the Gap Review. You can\'t fix what you haven\'t found.', color: '#1d4ed8' },
                  { step: '02', label: 'Close the blockers', desc: 'MFA, patch management, access reviews, default passwords. Most are configuration changes, not purchases.', color: '#7c3aed' },
                  { step: '03', label: 'Build the evidence', desc: 'CE requires proof — documented firewall rules, a password policy, a patching log. Without documentation, controls don\'t count.', color: '#d97706' },
                  { step: '04', label: 'Apply with confidence', desc: 'Submit to an IASME-licensed Certification Body. With the right preparation, most SMEs pass first time.', color: '#16a34a' },
                ].map(s => (
                  <div key={s.step} style={{ background: '#f8faff', padding: '1.5rem', borderTop: `3px solid ${s.color}` }}>
                    <div style={{ fontFamily: mono, fontSize: '0.6rem', color: s.color, letterSpacing: '3px', marginBottom: '0.35rem' }}>STEP {s.step}</div>
                    <div style={{ fontFamily: display, fontSize: '1rem', letterSpacing: '1px', color: '#0f172a', marginBottom: '0.5rem' }}>{s.label}</div>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.65 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CTA */}
      <div style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: mono, fontSize: '9px', color: '#60a5fa', letterSpacing: '4px', marginBottom: '1.5rem' }}>// THE PRACTICAL NEXT STEP</div>
          <h2 style={{ fontFamily: display, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '3px', color: '#f0f6ff', lineHeight: 0.9, marginBottom: '1.25rem' }}>
            FIND OUT WHERE<br /><span style={{ color: '#60a5fa' }}>YOUR NETWORK STANDS.</span>
          </h2>
          <p style={{ fontFamily: serif, fontSize: '1.15rem', fontStyle: 'italic', color: 'rgba(224,236,255,0.6)', maxWidth: '500px', margin: '0 auto 1rem', lineHeight: 1.8 }}>
            The free self-check takes 15 minutes and tells you exactly which of these five areas your business needs to address before applying.
          </p>
          <p style={{ fontFamily: mono, fontSize: '0.68rem', color: 'rgba(224,236,255,0.35)', marginBottom: '2.5rem', letterSpacing: '1px' }}>
            Or book the 48-hour Gap Review if you'd rather have a human walk through it with you.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/framework" style={{ background: '#1d4ed8', color: '#fff', fontFamily: display, fontSize: '1.1rem', letterSpacing: '3px', padding: '1rem 2.5rem', textDecoration: 'none', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1e40af'}
              onMouseLeave={e => e.currentTarget.style.background = '#1d4ed8'}
            >START FREE SELF-CHECK →</Link>
            <Link to="/contact" style={{ background: 'transparent', color: 'rgba(224,236,255,0.7)', fontFamily: mono, fontSize: '0.78rem', letterSpacing: '2px', padding: '1rem 1.75rem', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(224,236,255,0.7)' }}
            >BOOK GAP REVIEW — £397</Link>
          </div>
        </div>
      </div>

    </div>
  )
}
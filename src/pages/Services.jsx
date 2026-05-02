import { Link } from 'react-router-dom'
import { useState } from 'react'

// ── JOURNEY STEPS ──
const journey = [
  {
    step: '01', label: 'CHECK', color: '#1d4ed8',
    name: 'CE Gap Assessment', price: '£397',
    tagline: 'Will you pass Cyber Essentials?',
    desc: 'Most SMEs think they\'re 80% ready. The average we find is 42%. In 48 hours you\'ll know exactly where you stand — and exactly what to fix.',
    cta: 'START HERE', link: '/contact',
    next: 'Most clients move to STEP 2 within 2 weeks.',
    detail: `What actually happens:\nYou book a remote session (45–60 mins via Google Meet or Teams). I walk through all 50 CE questions with you — in plain English, not IASME jargon. I'm asking about your actual setup: what devices you use, how your Wi-Fi is configured, whether your cloud services have MFA on, what your patching looks like.\n\nWhat you receive within 48 hours:\nA written gap report with a RAG (Red/Amber/Green) score for each of the 5 CE control areas. Every gap is explained clearly — what it is, why it matters, and exactly what to do to fix it. Not vague recommendations. Specific actions.\n\nImportant — what this is NOT:\nThis is not a formal certification audit. I am not an IASME assessor and I do not issue CE certificates. This is a pre-certification readiness review — the preparation that means when you DO apply through IASME, you pass first time.\n\nWho this is for:\nAny UK SME that needs CE for a government contract, wants cyber insurance, or simply wants to know if their basic security hygiene is actually in order. You do not need to be technical. I translate everything.`,
  },
  {
    step: '02', label: 'FIX', color: '#0ea5e9',
    name: 'CE Pass Implementation', price: '£897',
    tagline: 'We fix everything blocking you.',
    desc: 'You know your gaps. Now we close them. Policies written. Evidence built. Every blocker removed. You go from gap report to submission-ready in 30 days.',
    cta: 'GET SUBMISSION-READY', link: '/contact',
    next: 'After this, you apply directly to IASME. Most clients pass first time.',
    detail: `This is not "more documents." This is a complete transformation.\n\nWhat's included:\nEverything from the CE Gap Assessment (Step 1) plus: all 7 policy documents written and customised specifically for your business — not generic templates you have to edit yourself. A 30-day remediation plan broken into weekly milestones so you know exactly what to do each week. Two 30-minute follow-up calls to check progress and answer questions. And a final evidence pack formatted ready for your IASME submission.\n\nWhy £897 works:\nThe alternative is a failed CE application — which costs £350–600 in fees, weeks of delay, and the contract you needed it for. This package removes that risk entirely.\n\nTimeline:\nTypically 4–6 weeks from booking to submission-ready. After this, you apply directly to an IASME-accredited certification body. We prepare you — they certify you.\n\nWho this is for:\nSMEs who have identified their gaps (either through Step 1 or independently) and need professional help closing them before applying.`,
  },
  {
    step: '03', label: 'PROVE', color: '#7c3aed',
    name: 'IASME Certification',
    price: 'From £320',
    tagline: 'Apply. Get certified. Win contracts.',
    desc: 'We don\'t issue CE certificates — IASME-accredited bodies do. But after Steps 1 and 2, you apply with confidence. Most of our prepared clients pass first time.',
    cta: 'LEARN ABOUT IASME', link: 'https://iasme.co.uk', external: true,
    next: 'Once certified, you need to maintain compliance year-round.',
    detail: `Important context:\nCyber Essentials certificates are issued by IASME-accredited certification bodies. No one else — including Tanasiom Aegis — can issue them. The certification fee (from £320+VAT for CE Basic) is paid directly to the certification body.\n\nWhat we do:\nWe make sure you pass. Our entire engagement in Steps 1 and 2 is structured around the exact questions IASME assessors ask. By the time you submit, you shouldn't be guessing any answers.\n\nCE vs CE+:\nCE Basic is a self-assessment questionnaire reviewed by an assessor. CE Plus includes a technical audit by an assessor — more rigorous, more credible, higher cost. Most SMEs start with CE Basic. We advise on which is right for your situation.\n\nAfter certification:\nYour certificate is valid for 12 months. At renewal, the assessor checks your answers again. If your controls have slipped, you fail. This is where Step 4 becomes important.`,
  },
  {
    step: '04', label: 'MAINTAIN', color: '#16a34a',
    name: 'Annual CE Maintenance',
    price: '£297/yr',
    tagline: 'Never let your certificate lapse.',
    desc: 'CE certificates last 12 months. Most SMEs panic-prepare for renewal every year. This retainer makes that problem disappear permanently.',
    cta: 'STAY CERT-READY', link: '/contact',
    next: '',
    detail: `What the retainer includes:\nMonthly 15-minute check-in calls to review patch status, any new devices or services added to scope, and any access control changes. Automated reminders when critical patch deadlines approach. An 8-week pre-renewal audit to catch any new gaps before you submit. Priority response if you have a compliance question between calls.\n\nThe maths:\n£297/year is £24.75/month. A failed CE renewal costs £350–600 in fees alone — plus the potential loss of the contract that requires it. One prevented failure pays for years of this retainer.\n\nWhat's not included:\nThis is a maintenance retainer, not a full advisory. Major changes to your infrastructure (new office, new cloud platform, new team members) may require a fresh gap assessment. We'll tell you when that's the case.`,
  },
]

// ── ADD-ONS ──
const addons = [
  {
    icon: '📋', name: 'Policy Documentation Pack', price: '£297',
    desc: 'All 7 CE-aligned policy documents — written, customised, ready to submit. Not templates. Actual documents with your company name, your devices, your setup.',
    detail: `IASME assessors don't just ask "do you have a firewall" — they ask "can you show me your firewall rules documentation with business justification for each rule?" That's a different question entirely.\n\nWhat I provide:\nSeven policy documents written in a format IASME assessors recognise and accept. Each one is customised to your actual business — your devices, your team size, your cloud services.\n\nDocuments included:\nFirewall rules documentation · Password & MFA policy · Patch management procedure · Incident response policy · User access control matrix · Scope definition document · BYOD & remote working policy\n\nTypically delivered within 5 working days of our initial call.`,
  },
  {
    icon: '👤', name: 'Access Control Audit', price: '£597',
    desc: 'User account sprawl is the silent CE killer. Ghost accounts, shared logins, admin rights handed out years ago and never reviewed. We find all of it.',
    detail: `CE Area 4 (User Access Control) is where most SMEs have the messiest gaps.\n\nEx-employees who still have active accounts. Three people sharing one admin login. The MD using their personal email as the Microsoft 365 admin account. No MFA on anything.\n\nWhat the audit covers:\nEvery account across your in-scope systems. Active Directory or Microsoft 365 user list review. Cloud service logins. Admin account separation. MFA status per user and per service.\n\nDeliverable:\nA complete access matrix — every user, their access level, MFA status, and last review date. This is required CE evidence.`,
  },
  {
    icon: '⚡', name: 'Quick Risk Report', price: '£97',
    desc: 'A tender deadline is tomorrow. Your insurer asked a question you can\'t answer. This 1-hour session + written summary tells you exactly where your biggest risks are. Same day.',
    detail: `What this actually is:\nA focused 1-hour remote conversation where I ask targeted questions about your current security setup and give you an honest picture of your biggest risks. No 50-question process. Just the headline findings.\n\nDeliverable:\nA 1-page written risk summary emailed same day. Top 3 critical risks, what each means in plain English, and the single most important action for each.\n\nWhat this is not:\nThis is not a full gap analysis. Think of it as triage — it tells you where to look next.`,
  },
  {
    icon: '🔄', name: 'Pre-Renewal Gap Check', price: '£197',
    desc: 'CE requirements changed significantly in April 2026. MFA rules tightened. Scope expanded. Don\'t assume your old answers still pass — check before you submit.',
    detail: `What changed in CE v3.3 (April 2026):\nThe NCSC updated CE requirements to mandate MFA on all cloud services — not just admin accounts. They also tightened the definition of "in-scope devices" to include more BYOD and home-working scenarios.\n\nWhat this service covers:\nA focused remote review specifically checking your setup against the updated v3.3 requirements. I'm not re-doing your full assessment — I'm targeting the areas that changed.\n\nDeliverable:\nA short written summary of what still passes, what now fails, and what you need to fix before your renewal application. Typically 30–45 minutes.`,
  },
  {
    icon: '🎓', name: 'Staff Awareness Training', price: '£397',
    desc: 'Your firewall is configured. Your patches are up to date. Then Dave clicks a phishing link. Staff awareness is your last line of defence — and IASME assessors ask about it.',
    detail: `Delivered remotely via Google Meet or Teams. Works best for teams of 5–30 people.\n\nWhat the session covers:\nPhishing — how to spot it, what to do, what not to do. Password hygiene — why password managers matter. Device security for remote workers. Incident reporting — what counts as an incident and who to tell.\n\nDeliverable:\nCompletion records for each attendee, suitable as CE evidence.`,
  },
  {
    icon: '🖥️', name: 'Device Sanitisation', price: 'From £49/device',
    desc: 'Old laptops sitting in a drawer are a GDPR liability. A factory reset doesn\'t erase data. Certified data destruction does — with an evidence certificate for each device.',
    detail: `A factory reset removes the operating system's pointer to the data. The data itself is still there and recoverable with free tools in under 10 minutes.\n\nWhat certified destruction means:\nA multi-pass overwrite following DoD 5220.22-M standard, with a destruction certificate issued for each device. This is your evidence of GDPR-compliant disposal.\n\nCollection available within the Midlands. Postal option for small quantities.`,
  },
]

// ── ADVANCED (hidden by default) ──
const advanced = [
  { icon: '🔍', name: 'External Network Pentest', price: '£2,000–£5,000', badge: 'CREST-ALIGNED', desc: 'Black-box external assessment of your network perimeter. CVSS-rated findings with full exploitation evidence and CE-mapped remediation.', detail: `We attack your perimeter the same way a real threat actor would. The difference is we write it all down and tell you how to fix it.\n\nThis is an external test — we test what an attacker can reach from the internet. Every action is logged, documented, and conducted under a signed rules of engagement.\n\nDeliverable: Executive summary + technical findings report with CVSS v3.1 ratings + CE mapping.\n\nTimeline: 2–4 weeks from scoping call to final report.` },
  { icon: '🌐', name: 'Web Application Test', price: '£3,500–£8,000', badge: 'OWASP TOP 10', desc: 'Manual and automated web application testing. Authentication bypass, injection flaws, session management, API security. Not just automated scanning.', detail: `Automated scanners catch maybe 30% of real web application vulnerabilities. The rest require a human tester who understands application logic.\n\nCoverage: Authentication bypass · Session token analysis · SQL and command injection · XSS · CSRF · IDOR · Sensitive data exposure · API security issues.\n\nWho needs this: SMEs with customer-facing web applications handling personal data, payment flows, or login portals.` },
  { icon: '🏢', name: 'Internal Infrastructure Test', price: '£5,000–£15,000', badge: 'MITRE ATT&CK', desc: 'Simulates a threat actor already inside your network. Lateral movement, privilege escalation, credential harvesting — full kill-chain documented.', detail: `Perimeter defences stop untargeted attacks. They don't stop phishing or insider threats. An internal test assumes the attacker is already in — the realistic threat model for SMEs in 2026.\n\nAll findings mapped to the MITRE ATT&CK framework. Satisfies demanding enterprise clients and insurers.\n\nPre-requisite: Signed rules of engagement and written authorisation from the asset owner.` },
  { icon: '📡', name: 'Monthly Security Retainer', price: '£500–£2,000/mo', badge: 'ONGOING', desc: 'Ongoing security advisory for SMEs that need more than a once-a-year checkup but can\'t justify a full-time security hire.', detail: `Monthly advisory calls · Patch compliance monitoring · Threat briefing summaries relevant to your sector · Priority response.\n\nUpper tier includes quarterly vulnerability scanning and access control reviews.\n\nContact us to discuss the right level for your business.` },
]

function DetailBlock({ text, accentColor }) {
  return (
    <div style={{ background: '#f8faff', border: '1px solid #dde3ec', borderLeft: `3px solid ${accentColor}`, padding: '1.25rem', marginTop: '0.75rem' }}>
      {text.split('\n').map((line, i) => (
        line === '' ? <br key={i} /> :
        line.endsWith(':') ? <div key={i} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: accentColor, letterSpacing: '2px', marginBottom: '0.3rem', marginTop: '0.75rem' }}>{line}</div> :
        <p key={i} style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.75, marginBottom: '0.2rem' }}>{line}</p>
      ))}
    </div>
  )
}

function AddonCard({ s }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: '#fff', border: '1px solid #dde3ec', padding: '1.5rem', transition: 'all 0.2s', borderTop: open ? '3px solid #1d4ed8' : '3px solid transparent' }}>
      <div style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>{s.icon}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.05rem', letterSpacing: '2px', color: '#0f172a', marginBottom: '0.2rem' }}>{s.name}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', color: '#1d4ed8', marginBottom: '0.6rem' }}>{s.price}</div>
      <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.7, marginBottom: '1rem' }}>{s.desc}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Link to="/contact" style={{ flex: 1, background: 'transparent', color: '#1d4ed8', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '2px', padding: '0.55rem', border: '1px solid #bfdbfe', textDecoration: 'none', display: 'block', textAlign: 'center', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background='#eff6ff' }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent' }}
        >ENQUIRE →</Link>
        <button onClick={() => setOpen(o => !o)} style={{ background: open ? '#eff6ff' : 'transparent', color: open ? '#1d4ed8' : '#94a3b8', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', padding: '0.55rem 0.85rem', border: `1px solid ${open ? '#bfdbfe' : '#e2e8f0'}`, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
          {open ? '▲' : '▼'}
        </button>
      </div>
      {open && <DetailBlock text={s.detail} accentColor="#1d4ed8" />}
    </div>
  )
}

function AdvancedCard({ s }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: '#fff', border: '1px solid #fecaca', padding: '1.5rem', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #ef4444, transparent)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.52rem', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '2px 6px' }}>{s.badge}</span>
      </div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.05rem', letterSpacing: '2px', color: '#0f172a', marginBottom: '0.2rem' }}>{s.name}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', color: '#ef4444', marginBottom: '0.6rem' }}>{s.price}</div>
      <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.7, marginBottom: '1rem' }}>{s.desc}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Link to="/contact" style={{ flex: 1, background: 'transparent', color: '#ef4444', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', letterSpacing: '2px', padding: '0.55rem', border: '1px solid rgba(239,68,68,0.3)', textDecoration: 'none', display: 'block', textAlign: 'center', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.04)' }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent' }}
        >SCOPING CALL →</Link>
        <button onClick={() => setOpen(o => !o)} style={{ background: open ? 'rgba(239,68,68,0.06)' : 'transparent', color: open ? '#ef4444' : '#94a3b8', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', padding: '0.55rem 0.85rem', border: `1px solid ${open ? 'rgba(239,68,68,0.3)' : '#e2e8f0'}`, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
          {open ? '▲' : '▼'}
        </button>
      </div>
      {open && <DetailBlock text={s.detail} accentColor="#ef4444" />}
    </div>
  )
}

export default function Services() {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#f4f6f8', color: '#1a2332', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&family=Cormorant+Garamond:ital,wght@1,400;1,600&display=swap');
        @media(max-width:768px){ .svc-journey{grid-template-columns:1fr!important;} .svc-grid-3{grid-template-columns:1fr!important;} .svc-grid-2{grid-template-columns:1fr!important;} .svc-arrow{display:none!important;} }
      `}</style>

      {/* HERO */}
      <div style={{ padding: '5rem 1.5rem 4rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '4px', color: '#60a5fa', marginBottom: '1.5rem' }}>// TANASIOM AEGIS SECURITY & COMPLIANCE</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 0.9, letterSpacing: '3px', color: '#f0f6ff', marginBottom: '1rem' }}>
            ONE GOAL.<br /><span style={{ color: '#60a5fa' }}>YOU PASS CYBER ESSENTIALS.</span>
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', color: 'rgba(224,236,255,0.65)', maxWidth: '580px', margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
            We don't issue CE certificates — IASME-accredited bodies do. What we do is make sure that when you apply, you pass. Every service below is built around that single outcome.
          </p>
          <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', padding: '0.75rem 1.25rem', display: 'inline-block', marginBottom: '2rem' }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#fbbf24', letterSpacing: '1px' }}>⚠ We are a readiness and advisory service. We prepare you — IASME certifies you.</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ background: '#1d4ed8', color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '3px', padding: '0.85rem 2rem', textDecoration: 'none', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='#1e40af'}
              onMouseLeave={e => e.currentTarget.style.background='#1d4ed8'}
            >START WITH £397 →</Link>
            <Link to="/framework" style={{ background: 'transparent', color: 'rgba(224,236,255,0.7)', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem', letterSpacing: '2px', padding: '0.85rem 1.75rem', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'; e.currentTarget.style.color='rgba(224,236,255,0.7)' }}
            >FREE ASSESSMENT FIRST</Link>
          </div>
        </div>
      </div>

      {/* THE JOURNEY */}
      <div style={{ padding: '4rem 1.5rem', background: '#ffffff', borderBottom: '1px solid #dde3ec' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#1d4ed8', letterSpacing: '3px', marginBottom: '0.5rem' }}>// THE CLEAR PATH TO CERTIFICATION</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '2px', color: '#0f172a' }}>
              FOUR STEPS. <span style={{ color: '#1d4ed8' }}>ONE OUTCOME.</span>
            </h2>
          </div>

          {/* STEP CARDS */}
          <div className="svc-journey" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', alignItems: 'stretch' }}>
            {journey.map((s, idx) => {
              const [open, setOpen] = useState(false)
              return (
                <div key={s.step} style={{ display: 'flex', alignItems: 'stretch' }}>
                  <div style={{ flex: 1, background: '#f8faff', border: '1px solid #dde3ec', borderLeft: idx === 0 ? '1px solid #dde3ec' : 'none', borderTop: `4px solid ${s.color}`, padding: '2rem 1.5rem', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: s.color, letterSpacing: '3px', marginBottom: '0.4rem' }}>STEP {s.step}</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '3px', color: s.color, marginBottom: '0.25rem' }}>{s.label}</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '1px', color: '#0f172a', marginBottom: '0.25rem' }}>{s.name}</div>
                    {s.price && <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', color: s.color, marginBottom: '0.5rem' }}>{s.price}</div>}
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem', fontStyle: 'italic', color: '#475569', lineHeight: 1.6, marginBottom: '0.75rem' }}>"{s.tagline}"</p>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.7, marginBottom: '1rem', flex: 1 }}>{s.desc}</p>
                    {s.next && <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: s.color, letterSpacing: '1px', background: `${s.color}10`, border: `1px solid ${s.color}30`, padding: '0.4rem 0.65rem', marginBottom: '1rem', lineHeight: 1.5 }}>→ {s.next}</div>}
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto' }}>
                      {s.external
                        ? <a href={s.link} target="_blank" rel="noreferrer" style={{ flex: 1, background: s.color, color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.85rem', letterSpacing: '2px', padding: '0.65rem', textDecoration: 'none', display: 'block', textAlign: 'center', transition: 'all 0.2s' }}>{s.cta} ↗</a>
                        : <Link to={s.link} style={{ flex: 1, background: s.color, color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.85rem', letterSpacing: '2px', padding: '0.65rem', textDecoration: 'none', display: 'block', textAlign: 'center', transition: 'all 0.2s' }}>{s.cta} →</Link>
                      }
                      <button onClick={() => setOpen(o => !o)} style={{ background: open ? `${s.color}15` : 'transparent', color: open ? s.color : '#94a3b8', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', padding: '0.65rem 0.75rem', border: `1px solid ${open ? s.color : '#e2e8f0'}`, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                        {open ? '▲' : '▼'}
                      </button>
                    </div>
                    {open && <DetailBlock text={s.detail} accentColor={s.color} />}
                  </div>
                  {idx < journey.length - 1 && (
                    <div className="svc-arrow" style={{ display: 'flex', alignItems: 'center', padding: '0 0.2rem', color: '#cbd5e1', fontSize: '1.2rem', flexShrink: 0 }}>→</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ADD-ONS */}
      <div style={{ padding: '4rem 1.5rem', background: '#f4f6f8', borderBottom: '1px solid #dde3ec' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#1d4ed8', letterSpacing: '3px', marginBottom: '0.5rem' }}>// OPTIONAL ADD-ONS · BOLT ON TO ANY JOURNEY STEP</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '2px', color: '#0f172a', marginBottom: '0.75rem' }}>
            NEED SOMETHING <span style={{ color: '#1d4ed8' }}>SPECIFIC?</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '580px', marginBottom: '2.5rem', lineHeight: 1.8 }}>
            These services complement the 4-step journey. Some clients need specific pieces — a policy pack, an access audit, a quick report before a deadline. Everything is fixed-fee and standalone.
          </p>
          <div className="svc-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {addons.map(s => <AddonCard key={s.name} s={s} />)}
          </div>
        </div>
      </div>

      {/* ADVANCED — HIDDEN BEHIND TOGGLE */}
      <div style={{ padding: '3rem 1.5rem', background: '#ffffff', borderBottom: '1px solid #dde3ec' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: showAdvanced ? '2.5rem' : '0' }}>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#ef4444', letterSpacing: '3px', marginBottom: '0.4rem' }}>// ADVANCED SECURITY · FOR GROWING BUSINESSES</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '2px', color: '#0f172a' }}>
                PENETRATION TESTING & <span style={{ color: '#ef4444' }}>MANAGED SECURITY</span>
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.35rem' }}>For SMEs that have CE sorted and want to go deeper. Not where most clients start.</p>
            </div>
            <button onClick={() => setShowAdvanced(s => !s)} style={{ background: showAdvanced ? '#fff5f5' : '#f8faff', color: showAdvanced ? '#ef4444' : '#1d4ed8', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.72rem', letterSpacing: '2px', padding: '0.75rem 1.5rem', border: `1px solid ${showAdvanced ? '#fecaca' : '#bfdbfe'}`, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
              {showAdvanced ? 'HIDE ADVANCED ▲' : 'VIEW ADVANCED SERVICES ▼'}
            </button>
          </div>
          {showAdvanced && (
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.68rem', color: '#ef4444', letterSpacing: '2px', marginBottom: '2rem', padding: '0.5rem 1rem', border: '1px solid rgba(239,68,68,0.3)', display: 'inline-block', background: 'rgba(239,68,68,0.04)' }}>
                ⚠ ALL OFFENSIVE ACTIVITIES CONDUCTED UNDER STRICT WRITTEN AUTHORISATION — COMPUTER MISUSE ACT 1990 COMPLIANT
              </div>
              <div className="svc-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {advanced.map(s => <AdvancedCard key={s.name} s={s} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* THREAT MAP */}
      <div style={{ padding: '4rem 1.5rem', background: '#f4f6f8', borderBottom: '1px solid #dde3ec' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#ef4444', letterSpacing: '3px', marginBottom: '0.5rem' }}>// LIVE GLOBAL THREAT INTELLIGENCE</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '2px', color: '#0f172a', marginBottom: '0.75rem' }}>THIS IS HAPPENING <span style={{ color: '#ef4444' }}>RIGHT NOW.</span></h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '580px', marginBottom: '2rem', lineHeight: 1.8 }}>Live cyberattack intelligence from Bitdefender's global threat network. Every event is a real attack. This is why your business cannot afford to wait.</p>
          <div style={{ border: '1px solid #dde3ec', overflow: 'hidden', background: '#fff' }}>
            <div style={{ position: 'relative', height: '3px', background: 'linear-gradient(90deg, #ef4444, #1d4ed8, #16a34a)' }} />
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #dde3ec', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#64748b', letterSpacing: '2px' }}>LIVE — BITDEFENDER GLOBAL THREAT MAP</span>
              <a href="https://threatmap.bitdefender.com" target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#1d4ed8', textDecoration: 'none' }}>OPEN FULL MAP ↗</a>
            </div>
            <iframe src="https://threatmap.bitdefender.com" style={{ width: '100%', height: '480px', border: 'none', display: 'block' }} title="Bitdefender Live Threat Map" loading="lazy" />
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#60a5fa', letterSpacing: '4px', marginBottom: '1.5rem' }}>// START THE JOURNEY</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '3px', color: '#f0f6ff', lineHeight: 0.9, marginBottom: '1rem' }}>
            KNOW WHERE YOU STAND<br /><span style={{ color: '#60a5fa' }}>IN 48 HOURS.</span>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontStyle: 'italic', color: 'rgba(224,236,255,0.55)', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.8 }}>
            Start with Step 1. Most clients go from zero to submission-ready in under 6 weeks.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ background: '#1d4ed8', color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '3px', padding: '1rem 2.5rem', textDecoration: 'none', transition: 'all 0.2s', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
              onMouseEnter={e => e.currentTarget.style.background='#1e40af'}
              onMouseLeave={e => e.currentTarget.style.background='#1d4ed8'}
            >BOOK STEP 1 — £397 →</Link>
            <Link to="/framework" style={{ background: 'transparent', color: 'rgba(224,236,255,0.7)', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem', letterSpacing: '2px', padding: '1rem 1.75rem', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'; e.currentTarget.style.color='rgba(224,236,255,0.7)' }}
            >FREE ASSESSMENT FIRST</Link>
          </div>
        </div>
      </div>

    </div>
  )
}
import { useState } from 'react'
import { Link } from 'react-router-dom'

// ─── WHAT WE DO ───────────────────────────────────────────────────────────────
const SERVICES_DETAIL = [
  {
    code: '01',
    icon: '🔍',
    name: 'Gap Review',
    price: '£397',
    color: '#1d4ed8',
    tagline: '48-hour human-led CE readiness assessment',
    what: 'A senior consultant reviews your current controls, scope statement, and evidence position against the CE v3.3 requirements in force from April 2026. You receive a written gap report, prioritised action list, and evidence checklist within 48 hours.',
    who: 'Any UK business preparing to apply for CE certification — especially those who have run the self-check and found blockers, or those renewing after a control change.',
    output: 'Written gap report · Prioritised remediation list · Evidence checklist · Scope review · 30-min debrief call',
    legal: 'This service constitutes a readiness advisory opinion only. It is not a certification decision and may not be represented as such. Certification is issued solely by IASME-licensed Certification Bodies.',
  },
  {
    code: '02',
    icon: '📋',
    name: 'Policy Pack',
    price: '£297',
    color: '#059669',
    tagline: 'CE-required policies tailored to your business',
    what: 'We take the 6 CE-required policy documents and customise them to your legal entity, named asset inventory, specific cloud services, and named approvers. Delivered as editable Word documents with version control and approval fields pre-populated.',
    who: 'Businesses that have downloaded the free templates and need them adapted to their actual environment before submission as CE evidence.',
    output: '6 CE-required policies · GDPR Data Protection Policy · Incident Response Plan · Asset Inventory template · All fully customised',
    legal: 'Policy documents are working templates prepared against the published CE v3.3 requirements. They must be reviewed and approved internally before submission as evidence. Tanasiom Aegis is not an IASME Certification Body.',
  },
  {
    code: '03',
    icon: '🛠️',
    name: 'CE Pass Implementation',
    price: '£897',
    color: '#7c3aed',
    tagline: 'Full fix service — from gaps to submission-ready',
    what: 'We work alongside your team to implement the remediation identified in the Gap Review: MFA enablement, firewall rule documentation, patch tracking setup, user access review, and scope definition. Includes all policy documents and a pre-submission evidence review.',
    who: 'Businesses that want hands-on implementation support rather than doing it themselves. Typically chosen by businesses with confirmed certification deadlines or contract requirements.',
    output: 'Gap Review included · Full policy pack · MFA setup guidance · Evidence pack review · Pre-submission sign-off checklist',
    legal: 'Implementation support is delivered on a best-efforts basis against CE v3.3 requirements in force at the time of engagement. A passing assessment is not guaranteed. Certification decisions rest solely with the Certification Body.',
  },
  {
    code: '04',
    icon: '🔄',
    name: 'Annual Maintenance',
    price: '£297/yr',
    color: '#d97706',
    tagline: 'Keep your controls current between renewal cycles',
    what: 'Annual check-in covering scheme updates (CE requirements change), control drift review, patch tracking audit, and updated policy documents. Ensures your controls remain compliant between certification cycles without paying for a full Gap Review each year.',
    who: 'Businesses already certified who want to maintain compliance throughout the year and avoid surprises at renewal.',
    output: 'Annual control review · Updated policy documents · Scheme change briefing · Renewal readiness report',
    legal: 'Annual maintenance is an advisory service and does not constitute ongoing certification. Your CE certificate must be renewed annually through an IASME-licensed Certification Body.',
  },
]

// ─── WHY US ───────────────────────────────────────────────────────────────────
const DIFFERENTIATORS = [
  {
    icon: '🇬🇧',
    title: 'Built specifically for UK SMEs',
    desc: 'Every service is scoped to the UK Cyber Essentials scheme — NCSC, IASME, ICO. No American frameworks repackaged for the UK market. No enterprise pricing structure padded to look affordable.',
  },
  {
    icon: '📐',
    title: 'Fixed fees — published upfront',
    desc: 'Every service has a published price. No discovery calls to get a quote. No day-rate surprises. No retainers. You know exactly what you\'re paying before you engage.',
  },
  {
    icon: '⚡',
    title: '48-hour turnaround on Gap Reviews',
    desc: 'Most consultancies quote 2–4 weeks for a gap assessment. We deliver a written report within 48 hours of receiving your completed intake form and self-check output.',
  },
  {
    icon: '🔓',
    title: 'Free self-check — no sales hook',
    desc: 'The 50-question CE self-check is genuinely free with no account required. You get a full gap report and remediation prompts without speaking to anyone. Engage only if you want to.',
  },
  {
    icon: '📋',
    title: 'Framework-first, not audit-first',
    desc: 'We help you build the controls first, then document the evidence. Most consultancies audit what you have and invoice for the gap. We work with you to close it.',
  },
  {
    icon: '⚖️',
    title: 'Legal-grade documentation',
    desc: 'Every deliverable includes governing law clauses, liability disclaimers, version control, and approval fields. Documents that pass legal scrutiny as well as technical scrutiny.',
  },
]

// ─── HOW WE WORK ─────────────────────────────────────────────────────────────
const PROCESS = [
  { step: '01', title: 'Run the free self-check', desc: 'Answer 50 questions across the 5 CE control areas. Takes 15 minutes. Get an instant readiness estimate, gap list, and remediation prompts. No account, no obligation.', cta: null },
  { step: '02', title: 'Review your results', desc: 'Download your readiness estimate report. Review the gap analysis. If you have likely blockers or want a human to validate your scope and evidence — proceed to step 3.', cta: null },
  { step: '03', title: 'Book a Gap Review', desc: 'Submit your intake form with your self-check output. We review your results, scope statement, and current evidence position and return a written report within 48 hours.', cta: 'BOOK GAP REVIEW — £397' },
  { step: '04', title: 'Implement and certify', desc: 'Follow the prioritised action plan. Use the policy templates. Apply to an IASME-licensed Certification Body when your evidence pack is ready. Most prepared clients pass first time.', cta: null },
]

// ─── CREDENTIALS ─────────────────────────────────────────────────────────────
const CREDENTIALS = [
  { label: 'CE Scheme Reference', value: 'NCSC / IASME v3.3 (April 2026)', url: 'https://www.ncsc.gov.uk/cyberessentials/overview' },
  { label: 'Certification Issued By', value: 'IASME-licensed Certification Bodies', url: 'https://iasme.co.uk/cyber-essentials/certify/' },
  { label: 'Data Protection', value: 'UK GDPR / DPA 2018 compliant', url: 'https://ico.org.uk' },
  { label: 'Governing Law', value: 'England & Wales', url: null },
  { label: 'Framework Alignment', value: 'NCSC, IASME, ICO, CMA', url: null },
  { label: 'Service Availability', value: 'UK businesses only', url: null },
]

// ─── LEGAL NOTICES ────────────────────────────────────────────────────────────
const LEGAL_ITEMS = [
  {
    heading: 'Independence from NCSC and IASME',
    body: 'Tanasiom Aegis is an independent cybersecurity readiness consultancy. We are not affiliated with, endorsed by, or acting as agents of the National Cyber Security Centre (NCSC), IASME Consortium, the UK Government, or any Certification Body. Cyber Essentials certificates are issued exclusively by IASME-licensed Certification Bodies.',
  },
  {
    heading: 'Nature of readiness advisory services',
    body: 'All services provided by Tanasiom Aegis constitute readiness advisory opinions prepared against the publicly available CE v3.3 requirements. No service constitutes a certification decision, a guarantee of certification outcome, or a formal audit under any statutory framework. Assessors at Certification Bodies may reach different conclusions.',
  },
  {
    heading: 'Policy and template documents',
    body: 'Policy templates and working documents are prepared as starting-point frameworks based on published CE requirements. They must be reviewed, completed, adapted to your specific environment, and approved internally before use as CE evidence. They do not constitute legal advice. Tanasiom Aegis recommends independent legal review of any policy document before formal adoption.',
  },
  {
    heading: 'Limitation of liability',
    body: 'To the maximum extent permitted by applicable law, Tanasiom Aegis\'s liability in connection with any service is limited to the fee paid for that service. We exclude liability for indirect or consequential loss including loss of contract, loss of certification, regulatory penalty, or business interruption. Nothing in these terms excludes liability for fraud or death/personal injury caused by negligence.',
  },
  {
    heading: 'Data handling and GDPR',
    body: 'Information submitted through intake forms and self-check tools is used solely to prepare and deliver the requested service. We do not sell or share personal data with third parties for marketing purposes. Data is retained for the duration of the engagement and a reasonable period thereafter for business records. You have the right to access, correct, or request deletion of your data. For data requests: tanasiomaegis@gmail.com.',
  },
  {
    heading: 'Governing law and jurisdiction',
    body: 'These terms and all services provided by Tanasiom Aegis are governed by the laws of England and Wales. Any dispute arising from or in connection with these terms or any service shall be subject to the exclusive jurisdiction of the courts of England and Wales.',
  },
]

// ─── STATS ────────────────────────────────────────────────────────────────────
const STATS = [
  { n: '50', label: 'Questions in the free self-check', sub: 'Covering all 5 CE control areas' },
  { n: '£397', label: 'Entry point — Gap Review', sub: 'Fixed fee, no surprises' },
  { n: '48hr', label: 'Report turnaround', sub: 'From intake to written output' },
  { n: '43%', label: 'UK businesses breached in 2025/26', sub: 'CSBS 2025/2026 — DSIT' },
]

export default function About() {
  const [openService, setOpenService] = useState(null)
  const [openLegal, setOpenLegal]     = useState(null)
  const [tickerPos, setTickerPos]     = useState(0)

  // Ticker animation
  useState(() => {
    const t = setInterval(() => setTickerPos(p => p + 1), 50)
    return () => clearInterval(t)
  })

  const TICKER = 'Tanasiom Aegis · Independent CE Readiness Consultancy · UK SMEs · Fixed Fees · No Retainers · 48-Hour Turnaround · Not affiliated with NCSC or IASME · Certification issued by IASME-licensed bodies'
  const offset = (tickerPos * 0.35) % (TICKER.length * 7.5)

  return (
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#f4f6f8', color: '#1a2332', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes livepulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media(max-width:768px){ .ab-2col{grid-template-columns:1fr!important;} .ab-4col{grid-template-columns:1fr 1fr!important;} }
      `}</style>

      {/* TICKER */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0.5rem 0', overflow: 'hidden', position: 'relative' }}>
        <div style={{ whiteSpace: 'nowrap', transform: `translateX(-${offset}px)`, display: 'inline-block' }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', color: '#64748b', letterSpacing: '0.04em', paddingRight: '4rem' }}>{TICKER} · {TICKER}</span>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(90deg,#0f172a,transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(270deg,#0f172a,transparent)', pointerEvents: 'none' }} />
      </div>

      {/* ── HERO — human story ──────────────────────────────────────────────── */}
      <div style={{ padding: '5rem 1.5rem 4rem', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '15%', right: '8%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(29,78,216,0.08) 0%,transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 4, color: '#60a5fa', marginBottom: '1rem', animation: 'fadeUp 0.6s ease both' }}>// ABOUT TANASIOM AEGIS SECURITY & COMPLIANCE</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.8rem,8vw,6rem)', lineHeight: 0.88, letterSpacing: 3, color: '#f0f6ff', marginBottom: '1.5rem', animation: 'fadeUp 0.6s 0.1s ease both' }}>
            UK SMES DESERVE<br /><span style={{ color: '#60a5fa' }}>ENTERPRISE-GRADE</span><br />CYBER PROTECTION.
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', fontStyle: 'italic', color: 'rgba(224,236,255,0.65)', maxWidth: 640, lineHeight: 1.75, marginBottom: '1rem', animation: 'fadeUp 0.6s 0.2s ease both' }}>
            We built Tanasiom Aegis because we kept seeing the same problem: small UK businesses failing Cyber Essentials not because their controls were weak — but because nobody gave them a practical, affordable, honest way to prepare.
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: 'rgba(224,236,255,0.45)', maxWidth: 580, lineHeight: 1.75, marginBottom: '2.5rem', animation: 'fadeUp 0.6s 0.25s ease both' }}>
            Enterprise consultancies charge enterprise fees. Generic checklists don't survive an assessor's scrutiny. And the government's own free tools tell you what to do — but not how to evidence it, what counts as a blocker, or where most organisations actually fail.
          </p>

          {/* STAT STRIP */}
          <div className="ab-4col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(255,255,255,0.08)', maxWidth: 800, marginBottom: '2.5rem', animation: 'fadeUp 0.6s 0.3s ease both' }}>
            {STATS.map(s => (
              <div key={s.n} style={{ background: 'rgba(255,255,255,0.04)', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#60a5fa', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', color: 'rgba(224,236,255,0.6)', marginTop: '0.25rem', lineHeight: 1.5 }}>{s.label}</div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.48rem', color: 'rgba(224,236,255,0.3)', marginTop: '0.2rem' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', animation: 'fadeUp 0.6s 0.35s ease both' }}>
            <Link to="/framework" style={{ background: '#1d4ed8', color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: 3, padding: '0.9rem 2rem', textDecoration: 'none', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1e40af'}
              onMouseLeave={e => e.currentTarget.style.background = '#1d4ed8'}
            >RUN FREE SELF-CHECK →</Link>
            <Link to="/contact" style={{ background: 'transparent', color: 'rgba(224,236,255,0.7)', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', letterSpacing: 2, padding: '0.9rem 1.75rem', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(224,236,255,0.7)' }}
            >BOOK GAP REVIEW — £397</Link>
          </div>
        </div>
      </div>

      {/* ── THE PROBLEM WE SOLVE ────────────────────────────────────────────── */}
      <div style={{ padding: '4rem 1.5rem', background: '#ffffff', borderBottom: '1px solid #dde3ec' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="ab-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#1d4ed8', letterSpacing: 3, marginBottom: '0.5rem' }}>// THE PROBLEM</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem,4vw,3.2rem)', letterSpacing: 2, color: '#0f172a', lineHeight: 0.95, marginBottom: '1.5rem' }}>
                MOST SMEs FAIL CE<br /><span style={{ color: '#dc2626' }}>NOT BECAUSE THEY'RE INSECURE.</span><br />BECAUSE THEY WERE UNPREPARED.
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.85, marginBottom: '1rem' }}>
                The CE scheme is straightforward in principle. In practice, the most common failure reasons are not technical — they're documentary. Undocumented firewall rules. MFA enabled but not on the right services. Scope statements that exclude cloud services. Patch logs that don't demonstrate the 14-day rule.
              </p>
              <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.85, marginBottom: '1rem' }}>
                Assessors don't fail businesses for bad intentions. They fail them for incomplete evidence. A business can have every control technically in place and still fail because they couldn't demonstrate it in the format the scheme requires.
              </p>
              <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.85 }}>
                That's the gap we fill. Not the controls themselves — the preparation, the evidence, and the understanding of what assessors actually check.
              </p>
            </div>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#1d4ed8', letterSpacing: 3, marginBottom: '1.5rem' }}>// COMMON FAILURE POINTS — CE v3.3</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#dde3ec' }}>
                {[
                  { rank: '01', issue: 'MFA not enabled on cloud services', detail: 'CE v3.3 mandates MFA for ALL users on ALL cloud services. Microsoft 365, Xero, Dropbox — all of it. Most partial deployments fail.', severity: 'BLOCKER' },
                  { rank: '02', issue: 'Firewall rules undocumented', detail: 'Inbound rules must be documented with business justification, approver, and date. A working firewall with no paperwork will fail.', severity: 'BLOCKER' },
                  { rank: '03', issue: 'Scope too narrow', detail: 'Excluding cloud services, BYOD devices, or remote worker laptops from scope. Assessors challenge scope statements that leave obvious assets out.', severity: 'BLOCKER' },
                  { rank: '04', issue: '14-day patch rule not evidenced', detail: 'Critical patches must be applied within 14 days — and you must prove it. A patch log showing dates is required.', severity: 'HIGH' },
                  { rank: '05', issue: 'Default passwords not changed', detail: 'Routers, access points, and applications with unchanged default credentials. Assessors specifically check this.', severity: 'HIGH' },
                  { rank: '06', issue: 'End-of-life software still running', detail: 'Windows 7, Office 2010, unsupported applications. If the vendor isn\'t releasing patches, CE won\'t accept it.', severity: 'HIGH' },
                ].map(f => (
                  <div key={f.rank} style={{ background: '#f8faff', padding: '1rem 1.25rem', borderLeft: `3px solid ${f.severity === 'BLOCKER' ? '#dc2626' : '#d97706'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.52rem', color: f.severity === 'BLOCKER' ? '#dc2626' : '#d97706', border: `1px solid ${f.severity === 'BLOCKER' ? '#dc2626' : '#d97706'}`, padding: '1px 5px' }}>{f.severity}</span>
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.9rem', letterSpacing: 1, color: '#0f172a' }}>{f.issue}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{f.detail}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
                <Link to="/vulnerabilities" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', color: '#1d4ed8', letterSpacing: 2, textDecoration: 'none' }}>SEE FULL CE FAILURE LIBRARY →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── WHY TANASIOM AEGIS ──────────────────────────────────────────────── */}
      <div style={{ padding: '4rem 1.5rem', background: '#f4f6f8', borderBottom: '1px solid #dde3ec' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#1d4ed8', letterSpacing: 3, marginBottom: '0.5rem' }}>// WHY TANASIOM AEGIS</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: 2, color: '#0f172a', marginBottom: '2.5rem' }}>
            WHAT MAKES US DIFFERENT.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1px', background: '#dde3ec' }}>
            {DIFFERENTIATORS.map(d => (
              <div key={d.title} style={{ background: '#ffffff', padding: '2rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8faff'; e.currentTarget.style.borderTop = '3px solid #1d4ed8' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderTop = 'none' }}
              >
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '1rem' }}>{d.icon}</span>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: 1, color: '#0f172a', marginBottom: '0.6rem' }}>{d.title}</div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.75 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <div style={{ padding: '4rem 1.5rem', background: '#ffffff', borderBottom: '1px solid #dde3ec' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#1d4ed8', letterSpacing: 3, marginBottom: '0.5rem' }}>// HOW IT WORKS</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: 2, color: '#0f172a', marginBottom: '2.5rem' }}>
            FROM SELF-CHECK TO CERTIFIED. <span style={{ color: '#1d4ed8' }}>IN FOUR STEPS.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: '#dde3ec' }}>
            {PROCESS.map((p, i) => (
              <div key={p.step} style={{ background: '#f8faff', padding: '2rem 1.5rem', borderTop: `3px solid ${['#1d4ed8','#0ea5e9','#7c3aed','#16a34a'][i]}` }}>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: ['#1d4ed8','#0ea5e9','#7c3aed','#16a34a'][i], letterSpacing: 3, marginBottom: '0.35rem' }}>STEP {p.step}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.05rem', letterSpacing: 1, color: '#0f172a', marginBottom: '0.75rem' }}>{p.title}</div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.75, marginBottom: p.cta ? '1.25rem' : 0 }}>{p.desc}</p>
                {p.cta && (
                  <Link to="/contact" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', color: '#7c3aed', letterSpacing: 2, textDecoration: 'none' }}>{p.cta} →</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES DETAIL ─────────────────────────────────────────────────── */}
      <div style={{ padding: '4rem 1.5rem', background: '#f4f6f8', borderBottom: '1px solid #dde3ec' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#1d4ed8', letterSpacing: 3, marginBottom: '0.5rem' }}>// OUR SERVICES — FULL DETAIL</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: 2, color: '#0f172a', marginBottom: '2rem' }}>
            FIXED FEES. CLEAR SCOPE. <span style={{ color: '#1d4ed8' }}>NO SURPRISES.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#dde3ec' }}>
            {SERVICES_DETAIL.map((svc, i) => (
              <div key={svc.code} style={{ background: openService === i ? '#f0f7ff' : '#ffffff', overflow: 'hidden', transition: 'background 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'stretch', cursor: 'pointer' }} onClick={() => setOpenService(openService === i ? null : i)}>
                  <div style={{ width: 4, background: svc.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{svc.icon}</span>
                      <div>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', color: '#94a3b8', marginBottom: '0.2rem' }}>SERVICE {svc.code}</div>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: 2, color: '#0f172a' }}>{svc.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>{svc.tagline}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: svc.color }}>{svc.price}</div>
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{openService === i ? '▲' : '▼'}</span>
                    </div>
                  </div>
                </div>
                {openService === i && (
                  <div style={{ borderTop: '1px solid #dde3ec', padding: '1.5rem 1.5rem 2rem 2rem' }}>
                    <div className="ab-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#1d4ed8', letterSpacing: 2, marginBottom: '0.5rem' }}>WHAT IT IS</div>
                        <p style={{ fontSize: '0.83rem', color: '#334155', lineHeight: 1.8 }}>{svc.what}</p>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#1d4ed8', letterSpacing: 2, marginBottom: '0.5rem' }}>WHO IT'S FOR</div>
                        <p style={{ fontSize: '0.83rem', color: '#334155', lineHeight: 1.8, marginBottom: '1rem' }}>{svc.who}</p>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#1d4ed8', letterSpacing: 2, marginBottom: '0.5rem' }}>WHAT YOU RECEIVE</div>
                        <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.8 }}>{svc.output}</p>
                      </div>
                    </div>
                    <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderLeft: `3px solid #f59e0b`, padding: '0.85rem 1rem', marginBottom: '1.25rem' }}>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', color: '#92400e', letterSpacing: 1, marginBottom: '0.25rem' }}>LEGAL NOTICE — SERVICE SCOPE</div>
                      <p style={{ fontSize: '0.75rem', color: '#78350f', lineHeight: 1.65, margin: 0 }}>{svc.legal}</p>
                    </div>
                    <Link to="/contact" style={{ background: svc.color, color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.95rem', letterSpacing: 3, padding: '0.75rem 1.75rem', textDecoration: 'none', display: 'inline-block', clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))', transition: 'opacity 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >ENQUIRE ABOUT {svc.name.toUpperCase()} →</Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CREDENTIALS & ALIGNMENT ─────────────────────────────────────────── */}
      <div style={{ padding: '4rem 1.5rem', background: '#0f172a', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="ab-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#60a5fa', letterSpacing: 3, marginBottom: '0.5rem' }}>// FRAMEWORK ALIGNMENT</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', letterSpacing: 2, color: '#f0f6ff', marginBottom: '1.5rem' }}>
                BUILT ON OFFICIAL SOURCES. <span style={{ color: '#60a5fa' }}>NOT OPINION.</span>
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                Every question in our self-check, every template, and every gap report is built against the publicly available CE v3.3 requirements as maintained by NCSC and operated by IASME. We do not interpret, paraphrase, or soften the requirements. We work from the source.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1e293b' }}>
                {CREDENTIALS.map(c => (
                  <div key={c.label} style={{ background: '#0f172a', padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#475569' }}>{c.label}</span>
                    {c.url
                      ? <a href={c.url} target="_blank" rel="noreferrer" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#60a5fa', textDecoration: 'none' }}>{c.value} ↗</a>
                      : <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#94a3b8' }}>{c.value}</span>
                    }
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#60a5fa', letterSpacing: 3, marginBottom: '0.5rem' }}>// OFFICIAL SOURCES</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', letterSpacing: 2, color: '#f0f6ff', marginBottom: '1.5rem' }}>
                ALWAYS VERIFY DIRECT.
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                We actively encourage clients to verify scheme requirements directly from official sources. Our role is to prepare you — not to replace the Certification Body or official guidance.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#1e293b' }}>
                {[
                  { name: 'NCSC', desc: 'Official CE overview', url: 'https://www.ncsc.gov.uk/cyberessentials/overview', tag: 'GOV.UK' },
                  { name: 'IASME', desc: 'Certification bodies & pricing', url: 'https://iasme.co.uk', tag: 'IASME' },
                  { name: 'IASME Readiness Tool', desc: 'Official free self-assessment', url: 'https://iasme.co.uk/cyber-essentials/readiness-tool/', tag: 'FREE' },
                  { name: 'ICO', desc: 'GDPR & data protection', url: 'https://ico.org.uk', tag: 'REGULATOR' },
                ].map(s => (
                  <a key={s.name} href={s.url} target="_blank" rel="noreferrer" style={{ background: '#0f172a', padding: '1.1rem', textDecoration: 'none', transition: 'background 0.2s', display: 'block' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
                    onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
                  >
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.52rem', color: '#3b82f6', marginBottom: '0.25rem' }}>{s.tag}</div>
                    <div style={{ fontSize: '0.85rem', color: '#f0f6ff', fontWeight: 600, marginBottom: '0.2rem' }}>{s.name} ↗</div>
                    <div style={{ fontSize: '0.7rem', color: '#475569' }}>{s.desc}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LEGAL SECTION ───────────────────────────────────────────────────── */}
      <div style={{ padding: '4rem 1.5rem', background: '#f4f6f8', borderTop: '1px solid #dde3ec' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#64748b', letterSpacing: 3, marginBottom: '0.5rem' }}>// LEGAL NOTICES & TERMS OF SERVICE</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', letterSpacing: 2, color: '#0f172a', marginBottom: '0.75rem' }}>
            TERMS OF ENGAGEMENT.
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.75, maxWidth: 680, marginBottom: '2rem' }}>
            Please read the following notices before engaging any Tanasiom Aegis service. By submitting an enquiry or booking a service you confirm you have read and understood these terms.
          </p>

          {/* Prominent independence banner */}
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderLeft: '4px solid #dc2626', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#dc2626', letterSpacing: 1, marginBottom: '0.35rem' }}>IMPORTANT — INDEPENDENCE NOTICE</div>
            <p style={{ fontSize: '0.82rem', color: '#7f1d1d', lineHeight: 1.7, margin: 0 }}>
              Tanasiom Aegis is <strong>not affiliated with, endorsed by, or acting on behalf of</strong> the National Cyber Security Centre (NCSC), IASME Consortium, the UK Government, or any Certification Body. <strong>Cyber Essentials certificates are issued exclusively by IASME-licensed Certification Bodies.</strong> Our services constitute independent readiness advisory only.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#dde3ec' }}>
            {LEGAL_ITEMS.map((item, i) => (
              <div key={i} style={{ background: openLegal === i ? '#f8faff' : '#ffffff', overflow: 'hidden', transition: 'background 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.5rem', cursor: 'pointer' }} onClick={() => setOpenLegal(openLegal === i ? null : i)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', color: '#94a3b8' }}>§{String(i+1).padStart(2,'0')}</span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.95rem', letterSpacing: 1, color: '#0f172a' }}>{item.heading}</span>
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem', flexShrink: 0 }}>{openLegal === i ? '▲' : '▼'}</span>
                </div>
                {openLegal === i && (
                  <div style={{ borderTop: '1px solid #edf0f5', padding: '1rem 1.5rem 1.25rem' }}>
                    <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.8, margin: 0 }}>{item.body}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#94a3b8', lineHeight: 1.8 }}>
            Full terms of service available on request. Registered business details available on request. Contact: tanasiomaegis@gmail.com · Governing law: England & Wales
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────────────── */}
      <div style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#60a5fa', letterSpacing: 4, marginBottom: '1.5rem' }}>// READY TO START?</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,6vw,5rem)', letterSpacing: 3, color: '#f0f6ff', lineHeight: 0.9, marginBottom: '1rem' }}>
            CHECK YOUR STATUS.<br /><span style={{ color: '#60a5fa' }}>FREE. RIGHT NOW.</span>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(224,236,255,0.5)', lineHeight: 1.8, marginBottom: '2rem' }}>
            15 minutes. 50 questions. A full gap report with remediation prompts — no account, no obligation, no sales call required.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/framework" style={{ background: '#1d4ed8', color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.15rem', letterSpacing: 3, padding: '1rem 2.25rem', textDecoration: 'none', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1e40af'}
              onMouseLeave={e => e.currentTarget.style.background = '#1d4ed8'}
            >RUN FREE SELF-CHECK →</Link>
            <Link to="/contact" style={{ background: 'transparent', color: 'rgba(224,236,255,0.7)', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem', letterSpacing: 2, padding: '1rem 1.75rem', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(224,236,255,0.7)' }}
            >BOOK GAP REVIEW — £397</Link>
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', color: 'rgba(224,236,255,0.2)', letterSpacing: 1, marginTop: '1.5rem' }}>
            Independent readiness advisory · Not affiliated with NCSC or IASME · Governing law: England & Wales
          </div>
        </div>
      </div>
    </div>
  )
}

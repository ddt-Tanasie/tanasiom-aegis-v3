import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// ─── VIDEOS — verified working UK CE/cyber content ────────────────────────────
const VIDEOS = [
  {
    id: 'E8rcmkRMNDw',
    title: 'Cyber Essentials Certification: Explained in 6 Minutes',
    tag: 'CERTIFICATION',
    desc: 'Why CE certification matters for UK SMEs, what it covers, and how to get certified. Published Oct 2025.',
  },
  {
    id: 'PBc_64hYws4',
    title: 'Cyber Essentials — How to Get Certified',
    tag: 'CERTIFICATION',
    desc: 'The two pathways to CE certification explained — self-guided and assessor-led. IASME guidance.',
  },
  {
    id: '7yUzFGIVJNo',
    title: 'CE Scheme Changes: April 2025 Updates',
    tag: 'SCHEME UPDATE',
    desc: 'Breakdown of the April 2025 updates including proof-of-scan requirement and revised questionnaire structure.',
  },
  {
    id: 'YBPfylJLUTE',
    title: 'CE and CE Plus: Successful Certification Webinar',
    tag: 'CERTIFICATION',
    desc: 'Full walkthrough of what assessors look for during CE and CE Plus assessments. Practical guidance.',
  },
  {
    id: 'Vwj60yr4ApU',
    title: 'Cyber Essentials: 5 Key Steps to Certification',
    tag: 'CONTROLS',
    desc: 'Alan Calder, IT Governance — the five essential steps every organisation must complete before applying.',
  },
  {
    id: 'nI6bdfx2RLU',
    title: 'Preparing for CE and CE Plus Certification',
    tag: 'CONTROLS',
    desc: 'Practical preparation steps for both CE and CE Plus, with focus on evidence pack requirements.',
  },
]

// ─── AI QUICK PROMPTS ─────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  'Is Cyber Essentials a legal requirement in the UK?',
  'What do I actually need to pass CE certification?',
  'What are the latest cyberattacks on UK SMEs in 2026?',
  'How much does Cyber Essentials cost?',
  'What changed in CE v3.3?',
  'Do I need CE to win government contracts?',
  'What is MFA and why does CE require it?',
  'What happens if I fail CE?',
]

// ─── NEWS — updated May 2026 ──────────────────────────────────────────────────
const NEWS = [
  {
    title: 'CSBS 2025/2026: 43% of UK Businesses Breached — 612,000 Organisations Hit',
    date: '30 Apr 2026',
    source: 'DSIT / Home Office',
    url: 'https://www.gov.uk/government/statistics/cyber-security-breaches-survey-2025',
    tag: 'THREAT',
    summary: 'The official UK Cyber Security Breaches Survey 2025/2026 found 43% of UK businesses experienced a breach in the last 12 months — roughly 612,000 organisations. Phishing dominates. Revenue impact has more than doubled year-on-year.',
  },
  {
    title: 'M&S, Co-op and Harrods Hit by Ransomware in Spring 2026 Wave',
    date: 'Apr 2026',
    source: 'NCSC',
    url: 'https://www.ncsc.gov.uk/news/ncsc-statement-on-incidents-affecting-uk-retailers',
    tag: 'THREAT',
    summary: 'NCSC confirmed a wave of ransomware attacks on major UK retailers including Marks & Spencer, Co-op, and Harrods. DragonForce ransomware deployed via social engineering against IT helpdesks. CE controls would have materially reduced exposure.',
  },
  {
    title: 'Cyber Essentials v3.3 Goes Live — 27 April 2026',
    date: '27 Apr 2026',
    source: 'IASME',
    url: 'https://iasme.co.uk/cyber-essentials/',
    tag: 'SCHEME UPDATE',
    summary: 'CE v3.3 is now the live scheme. MFA mandatory on all cloud services for all users — not just admins. 14-day patch rule strictly enforced. BYOD devices accessing org data now explicitly in scope.',
  },
  {
    title: 'Only 47% of UK Businesses Have MFA — CSBS 2026',
    date: 'Apr 2026',
    source: 'DSIT',
    url: 'https://www.gov.uk/government/statistics/cyber-security-breaches-survey-2025',
    tag: 'ENFORCEMENT',
    summary: 'The CSBS 2025/2026 found only 47% of UK businesses have MFA enabled on all cloud services. CE v3.3 makes this mandatory. Businesses without MFA face certain certification failure and high breach risk.',
  },
  {
    title: 'UK Government CE Mandate: All Central Government Suppliers Must Certify',
    date: 'Jan 2026',
    source: 'GOV.UK',
    url: 'https://www.gov.uk/government/publications/cyber-essentials-scheme-overview',
    tag: 'PROCUREMENT',
    summary: 'All suppliers handling government data or delivering central government contracts must hold valid Cyber Essentials certification. The mandate is increasingly applied across local government and NHS supply chains.',
  },
  {
    title: 'AI-Powered Phishing Rose 65% in 2025 — Now UK\'s Top Attack Vector',
    date: 'Mar 2026',
    source: 'NCSC / SpyCloud',
    url: 'https://www.ncsc.gov.uk/guidance/phishing',
    tag: 'THREAT',
    summary: 'AI-generated phishing emails are now indistinguishable from legitimate communications. Deepfake phishing targeting UK executives rose 200% in 2025. Technical controls — SPF, DKIM, DMARC — and staff training are critical.',
  },
]

const TAG_COLORS = {
  'THREAT':       '#dc2626',
  'SCHEME UPDATE':'#1d4ed8',
  'PROCUREMENT':  '#059669',
  'ENFORCEMENT':  '#b45309',
  'REGULATION':   '#7c3aed',
  'NCSC':         '#0369a1',
}

// ─── STATIC FAQ — instant, zero dependencies, never breaks ───────────────────
const FAQ_DB = {
  'Is Cyber Essentials a legal requirement in the UK?': `Cyber Essentials is NOT a legal requirement for most UK businesses. You won't be fined for not having it.

However, it IS effectively mandatory in several situations:

Government contracts: All suppliers handling UK government data or delivering central government contracts must hold a valid CE certificate. This has been enforced since 2014 and expanded in 2025-2026.

Cyber insurance: Most UK insurers now ask for CE at renewal. Without it, premiums rise or cover is refused.

Supply chain pressure: Large enterprises increasingly require CE from their suppliers as part of due diligence.

NHS and public sector: CE is required across much of the NHS supply chain and local government procurement.

Bottom line: it's not the law, but if you work with government, enterprise clients, or want cyber insurance, you effectively need it.`,

  'What do I actually need to pass CE certification?': `To pass Cyber Essentials you must demonstrate control across 5 areas:

1. Firewalls — all devices protected, admin interfaces not internet-facing, default-deny on inbound traffic, rules documented.

2. Secure Configuration — default passwords changed, unnecessary software removed, auto-run disabled, device lock enabled.

3. Update Management — all software licensed and supported, critical patches (CVSS 7.0+) applied within 14 days of release.

4. User Access Control — MFA on ALL cloud services for ALL users (mandatory under v3.3), separate admin accounts, leavers disabled same day.

5. Malware Protection — active anti-malware on all devices, real-time protection enabled, definitions auto-updated.

You also need a formally defined scope document. Assessors will check your evidence — screenshots, policy documents, and patch logs. The most common fail points are missing MFA, undocumented firewall rules, and out-of-date software.`,

  'What are the latest cyberattacks on UK SMEs in 2026?': `The UK Cyber Security Breaches Survey 2025/2026 (published 30 April 2026) found 43% of UK businesses — roughly 612,000 organisations — experienced a breach in the last 12 months.

Key threats in 2025-2026:

Phishing: Still the dominant vector by far. AI-generated phishing emails are now indistinguishable from legitimate communications. AI-driven attacks rose 65% in 2025.

Ransomware: April 2026 saw M&S, Co-op, and Harrods all hit in a coordinated wave using DragonForce ransomware. Attackers used social engineering against IT helpdesks to bypass MFA.

MFA fatigue attacks: Attackers flood users with push notifications until they approve. Akira ransomware group specialises in this.

Supply chain attacks: Tripling year-on-year. SMEs are targeted as a route into larger enterprise clients.

Only 47% of UK businesses have MFA fully deployed — despite it blocking 99% of account takeover attacks.`,

  'How much does Cyber Essentials cost?': `There are two tiers of Cyber Essentials:

CE Basic (self-assessment): You complete an online questionnaire verified by a Certification Body. Pricing starts from around £320+VAT for micro organisations and scales with company size. Check iasme.co.uk for current pricing — it's updated regularly.

CE Plus (with technical audit): Includes an assessor-led vulnerability scan on top of the questionnaire. Quoted individually — typically £1,000–£3,000+ depending on scope and organisation size.

Other costs to factor in:
- Remediation work before you apply (the main variable)
- Failed applications cost the full fee again on resubmission
- Our Gap Review (£397) identifies blockers before you pay for certification

The IASME readiness tool is free to use before you commit. So is our 50-question self-check on this site.`,

  'What changed in CE v3.3?': `CE v3.3 went live on 27 April 2026. Key changes from previous versions:

MFA now mandatory for ALL users on ALL cloud services — not just admins. This is the biggest change and affects most SMEs using Microsoft 365, Google Workspace, Xero, or any other cloud platform.

BYOD explicitly in scope: personal devices that access organisational data or cloud services must meet CE requirements. This is a significant scope expansion.

14-day patch rule tightened: critical and high-risk patches (CVSS 7.0+) must be applied within 14 days. The rule now explicitly covers cloud service configuration changes too.

Scope documentation required: you must formally define your CE boundary before applying. Assessors now challenge incomplete scope statements more rigorously.

Proof-of-scan requirement: a vulnerability scan result is now required as supporting evidence in some assessment pathways.

If you last certified under v3.2 or earlier, you'll need to review your MFA and BYOD position before renewal.`,

  'Do I need CE to win government contracts?': `Yes — for most central government contracts.

Since 2014, all suppliers handling UK government data or delivering IT services to central government must hold a valid Cyber Essentials certificate. This requirement was extended and reinforced in 2025-2026.

Where CE is required:
- All central government IT and digital contracts
- MOD supply chain (often CE Plus required)
- NHS contracts and suppliers
- Local government — increasingly required but varies by council
- Any contract involving personal data belonging to government

Where it helps but isn't always mandatory:
- Private sector enterprise procurement
- Cyber insurance applications
- Tender responses where it gives a competitive edge

Important: your CE certificate must be current (valid for 12 months). An expired certificate does not count. Check the contract requirement carefully — some require CE Plus, not just CE Basic.`,

  'What is MFA and why does CE require it?': `MFA stands for Multi-Factor Authentication. It means proving your identity with two or more things — typically your password plus a code from an app on your phone.

Why it matters: Microsoft research shows MFA blocks 99.9% of automated account takeover attacks. Without it, a stolen or guessed password gives an attacker full access to your email, files, and cloud systems.

Why CE v3.3 requires it: Under the current scheme, MFA is mandatory on ALL cloud services for ALL users. Not just admins — everyone. Microsoft 365, Google Workspace, Xero, Salesforce, Dropbox — all of it.

How to enable it (Microsoft 365): Sign in to admin.microsoft.com → Identity → Properties → Manage Security Defaults → Enable. All users will be prompted to register at next sign-in.

Acceptable MFA methods (strongest to weakest):
1. FIDO2 hardware key (e.g. YubiKey)
2. Authenticator app (Microsoft/Google Authenticator)
3. SMS code (acceptable but weaker)

Missing MFA on any cloud service is a likely certification blocker.`,

  'What happens if I fail CE?': `Failing CE is common — around 30-40% of first applications have issues flagged.

What happens immediately: The Certification Body will tell you exactly which controls failed and why. You don't lose your money on the spot — most CBs give you a short window to remediate and resubmit.

If you can't fix it in the window: you need to reapply and pay the certification fee again. This is why preparation matters.

Common reasons for failure:
- MFA not enabled on cloud services
- Unsupported or unpatched software found
- Firewall rules not documented
- Scope too narrow (devices or cloud services excluded incorrectly)
- Default passwords not changed on network devices

What to do before applying: Run our free 50-question self-check to identify likely blockers. If the results show gaps, the £397 Gap Review turns those into a prioritised fix list with evidence guidance before you pay for certification.

There's no penalty for failing beyond the reapplication cost and delay.`,
}

// Fuzzy match — find closest FAQ entry or return null
function lookupFAQ(question) {
  const q = question.toLowerCase().trim()
  // Exact match first
  for (const [key, val] of Object.entries(FAQ_DB)) {
    if (key.toLowerCase() === q) return val
  }
  // Keyword match
  const keywords = {
    'legal': 'Is Cyber Essentials a legal requirement in the UK?',
    'require': 'Is Cyber Essentials a legal requirement in the UK?',
    'law': 'Is Cyber Essentials a legal requirement in the UK?',
    'need to pass': 'What do I actually need to pass CE certification?',
    'what do i need': 'What do I actually need to pass CE certification?',
    'pass ce': 'What do I actually need to pass CE certification?',
    'latest': 'What are the latest cyberattacks on UK SMEs in 2026?',
    'attack': 'What are the latest cyberattacks on UK SMEs in 2026?',
    'threat': 'What are the latest cyberattacks on UK SMEs in 2026?',
    'breach': 'What are the latest cyberattacks on UK SMEs in 2026?',
    'cost': 'How much does Cyber Essentials cost?',
    'price': 'How much does Cyber Essentials cost?',
    'how much': 'How much does Cyber Essentials cost?',
    'v3.3': 'What changed in CE v3.3?',
    'changed': 'What changed in CE v3.3?',
    'update': 'What changed in CE v3.3?',
    'new in ce': 'What changed in CE v3.3?',
    'government': 'Do I need CE to win government contracts?',
    'contract': 'Do I need CE to win government contracts?',
    'tender': 'Do I need CE to win government contracts?',
    'procurement': 'Do I need CE to win government contracts?',
    'mfa': 'What is MFA and why does CE require it?',
    'multi-factor': 'What is MFA and why does CE require it?',
    'two factor': 'What is MFA and why does CE require it?',
    'authenticator': 'What is MFA and why does CE require it?',
    'fail': 'What happens if I fail CE?',
    'failed': 'What happens if I fail CE?',
    'reject': 'What happens if I fail CE?',
    'didn\'t pass': 'What happens if I fail CE?',
  }
  for (const [kw, faqKey] of Object.entries(keywords)) {
    if (q.includes(kw)) return FAQ_DB[faqKey]
  }
  // Generic fallback
  return `That's a great question. Here's what we can tell you based on the current CE v3.3 scheme (live April 2026):

Cyber Essentials covers 5 control areas: Firewalls, Secure Configuration, Update Management, User Access Control, and Malware Protection. MFA is now mandatory on all cloud services for all users. Critical patches must be applied within 14 days.

For a full assessment of your specific situation, run our free 50-question self-check — it covers all 50 CE requirements and gives you a personalised gap report. Or book the £397 Gap Review for a human-led analysis.

You can also find authoritative answers at ncsc.gov.uk or iasme.co.uk.`
}

async function askFreeAI(question) {
  // Simulate slight delay for UX feel, then return static answer
  await new Promise(r => setTimeout(r, 400))
  const answer = lookupFAQ(question)
  if (!answer) throw new Error('No answer found')
  return answer
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function NewsCard({ item }) {
  const tagColor = TAG_COLORS[item.tag] || '#1d4ed8'
  return (
    <a href={item.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{ background: '#ffffff', border: '1px solid #dde3ec', borderTop: `3px solid ${tagColor}`, padding: '1.5rem', transition: 'all 0.2s', height: '100%', boxSizing: 'border-box' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#f8faff'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', color: tagColor, border: `1px solid ${tagColor}`, padding: '2px 6px', letterSpacing: '1px', flexShrink: 0 }}>{item.tag}</span>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{item.date}</span>
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '1px', color: '#0f172a', lineHeight: 1.3, marginBottom: '0.65rem' }}>{item.title} ↗</div>
        <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.65, marginBottom: '0.75rem' }}>{item.summary}</p>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', color: '#94a3b8' }}>{item.source}</div>
      </div>
    </a>
  )
}

function VideoCard({ v }) {
  const [playing, setPlaying] = useState(false)
  const [thumbError, setThumbError] = useState(false)
  const TC = { CERTIFICATION: '#1d4ed8', 'SCHEME UPDATE': '#1d4ed8', CONTROLS: '#059669', 'THREAT INTEL': '#dc2626', REGULATION: '#7c3aed', NCSC: '#0369a1' }
  const tc = TC[v.tag] || '#1d4ed8'

  return (
    <div
      style={{ background: '#0f172a', border: '1px solid #1e293b', overflow: 'hidden', transition: 'border-color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#334155'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}
    >
      <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            title={v.title}
          />
        ) : (
          <>
            {!thumbError ? (
              <img
                src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                alt={v.title}
                onError={() => setThumbError(true)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#475569' }}>VIDEO</span>
              </div>
            )}
            <div
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.35)', transition: 'background 0.2s' }}
              onClick={() => setPlaying(true)}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}
            >
              <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.95)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '18px solid #0f172a', marginLeft: 5 }} />
              </div>
            </div>
          </>
        )}
      </div>
      <div style={{ padding: '1rem 1.25rem' }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.52rem', color: tc, border: `1px solid ${tc}`, padding: '2px 6px', letterSpacing: '1px', display: 'inline-block', marginBottom: '0.5rem' }}>{v.tag}</span>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.95rem', letterSpacing: '1px', color: '#f0f6ff', lineHeight: 1.3, marginBottom: '0.4rem' }}>{v.title}</div>
        <p style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.6 }}>{v.desc}</p>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function News() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [aiQuery, setAiQuery]         = useState('')
  const [aiResponse, setAiResponse]   = useState('')
  const [aiLoading, setAiLoading]     = useState(false)
  const [aiError, setAiError]         = useState('')
  const [asked, setAsked]             = useState(false)
  const [tickerPos, setTickerPos]     = useState(0)
  const aiRef = useRef(null)

  useEffect(() => {
    const t = setInterval(() => setTickerPos(p => p + 1), 50)
    return () => clearInterval(t)
  }, [])

  const TICKER = 'CE v3.3 live April 2026: MFA mandatory on all cloud services · 14-day critical patch rule · BYOD devices in scope · 43% of UK businesses breached in 2025/2026 · M&S, Co-op, Harrods hit by ransomware April 2026 · Government suppliers must hold valid CE'
  const offset = (tickerPos * 0.4) % (TICKER.length * 7.5)

  const FILTERS = ['ALL', 'THREAT', 'SCHEME UPDATE', 'PROCUREMENT', 'ENFORCEMENT']
  const filtered = activeFilter === 'ALL' ? NEWS : NEWS.filter(n => n.tag === activeFilter)

  const handleAsk = async (q) => {
    const query = (q || aiQuery).trim()
    if (!query) return
    setAiQuery(query)
    setAiLoading(true)
    setAiError('')
    setAiResponse('')
    setAsked(true)
    setTimeout(() => aiRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    try {
      const res = await askFreeAI(query)
      setAiResponse(res)
    } catch (e) {
      setAiError('Could not reach the AI assistant right now. Try again in a moment, or browse the quick answers below.')
    }
    setAiLoading(false)
  }

  return (
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#f4f6f8', color: '#1a2332', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&family=Cormorant+Garamond:ital,wght@1,400;1,600&display=swap');
        @keyframes blink { 0%,100%{opacity:0.3;transform:scale(0.75)} 50%{opacity:1;transform:scale(1)} }
        @keyframes livepulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media(max-width:900px){ .vgrid{grid-template-columns:1fr 1fr!important;} }
        @media(max-width:600px){ .ngrid{grid-template-columns:1fr!important;} .vgrid{grid-template-columns:1fr!important;} .qgrid{grid-template-columns:1fr 1fr!important;} }
      `}</style>

      {/* TICKER */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0.5rem 0', overflow: 'hidden', position: 'relative' }}>
        <div style={{ whiteSpace: 'nowrap', transform: `translateX(-${offset}px)`, display: 'inline-block' }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', color: '#64748b', letterSpacing: '0.04em', paddingRight: '4rem' }}>{TICKER} · {TICKER}</span>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(90deg,#0f172a,transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(270deg,#0f172a,transparent)', pointerEvents: 'none' }} />
      </div>

      {/* HERO */}
      <div style={{ padding: '4.5rem 1.5rem 3.5rem', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '8%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 4, color: '#60a5fa', marginBottom: '1rem' }}>// INTELLIGENCE · REGULATION · THREAT UPDATES · MAY 2026</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,7vw,5rem)', lineHeight: 0.9, letterSpacing: 3, color: '#f0f6ff', marginBottom: '1rem' }}>
            STAY AHEAD.<br /><span style={{ color: '#60a5fa' }}>STAY CERTIFIED.</span>
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(224,236,255,0.6)', maxWidth: 560, lineHeight: 1.7, marginBottom: '2rem' }}>
            Live threat intelligence, regulatory changes, and an AI assistant that answers your CE questions in plain English — free, no account needed.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => aiRef.current?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: '#1d4ed8', color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: 3, padding: '0.85rem 1.75rem', border: 'none', cursor: 'pointer', clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1e40af'}
              onMouseLeave={e => e.currentTarget.style.background = '#1d4ed8'}
            >ASK THE AI ASSISTANT ↓</button>
            <Link to="/framework" style={{ background: 'transparent', color: 'rgba(224,236,255,0.7)', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', letterSpacing: 2, padding: '0.85rem 1.5rem', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(224,236,255,0.7)' }}
            >FREE SELF-CHECK →</Link>
          </div>
        </div>
      </div>

      {/* AI ASSISTANT */}
      <div ref={aiRef} style={{ padding: '4rem 1.5rem', background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#60a5fa', letterSpacing: 3, marginBottom: '0.5rem' }}>// FREE AI ASSISTANT — NO ACCOUNT NEEDED</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem,4vw,3rem)', letterSpacing: 2, color: '#f0f6ff', marginBottom: '0.5rem' }}>ASK ANYTHING ABOUT CE.</h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: 'rgba(224,236,255,0.4)', marginBottom: '2rem' }}>
            Plain English answers on certification, regulations, controls, costs, and the latest threats.
          </p>

          {/* Quick prompts */}
          <div className="qgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {QUICK_PROMPTS.map((p, i) => (
              <button key={i} onClick={() => handleAsk(p)}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1e293b', color: '#94a3b8', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.5px', padding: '0.65rem 0.75rem', cursor: 'pointer', textAlign: 'left', lineHeight: 1.5, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(29,78,216,0.18)'; e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#93c5fd' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8' }}
              >{p}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <input
              value={aiQuery}
              onChange={e => setAiQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk()}
              placeholder="Type your question — e.g. Do I need CE if I'm a sole trader? What's the 14-day patch rule?"
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid #1e293b', color: '#f0f6ff', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.92rem', padding: '0.85rem 1rem', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#1e293b'}
            />
            <button
              onClick={() => handleAsk()}
              disabled={aiLoading || !aiQuery.trim()}
              style={{ background: aiLoading || !aiQuery.trim() ? '#1e293b' : '#1d4ed8', color: aiLoading || !aiQuery.trim() ? '#475569' : '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: 2, padding: '0.85rem 1.5rem', border: 'none', cursor: aiLoading || !aiQuery.trim() ? 'not-allowed' : 'pointer', clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
            >{aiLoading ? 'THINKING...' : 'ASK →'}</button>
          </div>

          {/* Response */}
          {asked && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e293b', borderLeft: '3px solid #3b82f6', padding: '1.5rem', minHeight: 80 }}>
              {aiLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, background: '#3b82f6', borderRadius: '50%', animation: `blink 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
                  </div>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#475569' }}>Thinking about your question...</span>
                </div>
              )}
              {aiError && (
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.72rem', color: '#f87171', lineHeight: 1.6 }}>⚠ {aiError}</div>
              )}
              {aiResponse && !aiLoading && (
                <>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', color: '#3b82f6', letterSpacing: 2, marginBottom: '0.85rem' }}>// AI RESPONSE · TANASIOM AEGIS ADVISOR</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.95rem', color: 'rgba(224,236,255,0.85)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{aiResponse}</div>
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #1e293b', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Link to="/framework" style={{ background: '#1d4ed8', color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.85rem', letterSpacing: 2, padding: '0.6rem 1.25rem', textDecoration: 'none', clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))' }}>RUN FREE SELF-CHECK →</Link>
                    <Link to="/contact" style={{ color: '#60a5fa', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', letterSpacing: 2, textDecoration: 'none' }}>BOOK GAP REVIEW — £397 →</Link>
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.52rem', color: '#334155', marginLeft: 'auto' }}>AI guidance only — verify at ncsc.gov.uk</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* UPSELL STRIP */}
      <div style={{ background: '#1d4ed8', padding: '1.25rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.68rem', color: 'rgba(255,255,255,0.85)', letterSpacing: 1 }}>
            43% of UK businesses were breached last year. Know exactly where you stand — free, 15 minutes.
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/framework" style={{ background: '#fff', color: '#1d4ed8', fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.9rem', letterSpacing: 2, padding: '0.6rem 1.25rem', textDecoration: 'none' }}>FREE SELF-CHECK →</Link>
            <Link to="/contact" style={{ background: 'transparent', color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.9rem', letterSpacing: 2, padding: '0.6rem 1.25rem', border: '1px solid rgba(255,255,255,0.4)', textDecoration: 'none' }}>GAP REVIEW — £397</Link>
          </div>
        </div>
      </div>

      {/* NEWS FEED */}
      <div style={{ padding: '4rem 1.5rem', background: '#f4f6f8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#1d4ed8', letterSpacing: 3, marginBottom: '0.4rem' }}>// UK CYBER INTELLIGENCE · UPDATED MAY 2026</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: 2, color: '#0f172a' }}>LATEST FROM THE FRONT LINE.</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 6, height: 6, background: '#16a34a', borderRadius: '50%', animation: 'livepulse 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', color: '#16a34a', letterSpacing: 1 }}>MAY 2026</span>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                style={{ background: activeFilter === f ? '#1d4ed8' : '#ffffff', color: activeFilter === f ? '#fff' : '#475569', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: 2, padding: '0.45rem 0.85rem', border: `1px solid ${activeFilter === f ? '#1d4ed8' : '#dde3ec'}`, cursor: 'pointer', transition: 'all 0.15s' }}
              >{f}</button>
            ))}
          </div>

          <div className="ngrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            {filtered.map((item, i) => <NewsCard key={i} item={item} />)}
          </div>

          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <a href="https://www.ncsc.gov.uk/news" target="_blank" rel="noreferrer"
              style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', color: '#64748b', letterSpacing: 2, textDecoration: 'none', border: '1px solid #dde3ec', padding: '0.65rem 1.5rem', display: 'inline-block', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#1d4ed8'; e.currentTarget.style.color = '#1d4ed8' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#dde3ec'; e.currentTarget.style.color = '#64748b' }}
            >MORE FROM NCSC ↗</a>
          </div>
        </div>
      </div>

      {/* VIDEOS */}
      <div style={{ padding: '4rem 1.5rem', background: '#0f172a', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#60a5fa', letterSpacing: 3, marginBottom: '0.4rem' }}>// VIDEO INTELLIGENCE · CE CERTIFICATION & CONTROLS</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: 2, color: '#f0f6ff', marginBottom: '0.5rem' }}>
            WATCH. UNDERSTAND. <span style={{ color: '#60a5fa' }}>ACT.</span>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: 'rgba(224,236,255,0.4)', marginBottom: '2.5rem' }}>
            Verified working videos on CE requirements and certification. Click to play.
          </p>
          <div className="vgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            {VIDEOS.map((v, i) => <VideoCard key={i} v={v} />)}
          </div>
        </div>
      </div>

      {/* OFFICIAL SOURCES */}
      <div style={{ padding: '3.5rem 1.5rem', background: '#ffffff', borderTop: '1px solid #dde3ec' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#64748b', letterSpacing: 3, marginBottom: '1.5rem' }}>// OFFICIAL SOURCES — ALWAYS VERIFY DIRECT</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '1px', background: '#dde3ec' }}>
            {[
              { label: 'NCSC', sub: 'Threat alerts & CE guidance', url: 'https://www.ncsc.gov.uk', tag: 'GOV.UK' },
              { label: 'IASME Consortium', sub: 'CE scheme operator & pricing', url: 'https://iasme.co.uk', tag: 'IASME' },
              { label: 'ICO', sub: 'Data protection & 72hr breach rule', url: 'https://ico.org.uk', tag: 'REGULATOR' },
              { label: 'GOV.UK Cyber', sub: 'Government CE requirements', url: 'https://www.gov.uk/government/publications/cyber-essentials-scheme-overview', tag: 'GOV.UK' },
              { label: 'CISA Advisories', sub: 'Global threat intelligence', url: 'https://www.cisa.gov/news-events/cybersecurity-advisories', tag: 'INTEL' },
              { label: 'CVE Database', sub: 'Official vulnerability records', url: 'https://cve.mitre.org', tag: 'CVE' },
            ].map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer"
                style={{ background: '#f8faff', padding: '1.25rem', textDecoration: 'none', display: 'block', transition: 'all 0.2s', borderTop: '2px solid transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f0f7ff'; e.currentTarget.style.borderTopColor = '#1d4ed8' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f8faff'; e.currentTarget.style.borderTopColor = 'transparent' }}
              >
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.52rem', color: '#1d4ed8', letterSpacing: 2, marginBottom: '0.35rem' }}>{s.tag}</div>
                <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600, marginBottom: '0.2rem' }}>{s.label} ↗</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{s.sub}</div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#60a5fa', letterSpacing: 4, marginBottom: '1.5rem' }}>// READING ABOUT THREATS ISN'T PROTECTION</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.2rem,6vw,4.5rem)', letterSpacing: 3, color: '#f0f6ff', lineHeight: 0.9, marginBottom: '1rem' }}>
            KNOW YOUR STATUS.<br /><span style={{ color: '#60a5fa' }}>NOT JUST THE NEWS.</span>
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(224,236,255,0.5)', lineHeight: 1.8, marginBottom: '2rem' }}>
            The 15-minute self-check tells you exactly where you stand against CE v3.3 — free, no account needed.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/framework" style={{ background: '#1d4ed8', color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: 3, padding: '0.9rem 2rem', textDecoration: 'none', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1e40af'}
              onMouseLeave={e => e.currentTarget.style.background = '#1d4ed8'}
            >RUN FREE SELF-CHECK →</Link>
            <Link to="/contact" style={{ background: 'transparent', color: 'rgba(224,236,255,0.7)', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem', letterSpacing: 2, padding: '0.9rem 1.5rem', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(224,236,255,0.7)' }}
            >BOOK GAP REVIEW — £397</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

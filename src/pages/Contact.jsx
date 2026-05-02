import { useState } from 'react'
import { Link } from 'react-router-dom'

// ─── WEB3FORMS — free, no backend, key is public-safe ────────────────────────
// 1. Go to web3forms.com
// 2. Enter: tanasiomaegis@gmail.com  → they email you a free access key
// 3. Paste it below — that's it, everything goes straight to your inbox
const W3F_KEY = 'fafdbcfa-f86f-456d-958d-44da4a95e651'

async function sendEmail(subject, lines, replyTo, replyName, caseId) {
  const message = Array.isArray(lines) ? lines.join('\n') : lines
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: W3F_KEY, subject, message, botcheck: '',
      from_name: 'Tanasiom Aegis Security & Compliance',
      replyto: replyTo || '',
    }),
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Submission failed')

  // Auto-reply to client
  if (replyTo && caseId) {
    const isGapReview = subject.includes('Gap Review')
    const autoBody = [
      `Dear ${replyName},`,
      '',
      'Thank you for contacting Tanasiom Aegis Security & Compliance.',
      '',
      `YOUR CASE REFERENCE: ${caseId}`,
      'Please quote this reference in all correspondence with us.',
      '',
      '=== WHAT HAPPENS NEXT ===',
      isGapReview
        ? '1. We review your self-check results (within 2 hours)'
        : '1. We review your enquiry and identify the right service (within 4 hours)',
      '2. You receive a response with a clear proposal (within 1 business day)',
      '3. No payment is taken until scope is confirmed and agreed',
      '',
      '=== CONTACT ===',
      'Email: tanasiomaegis@gmail.com',
      'Response: within 1 business day | Coventry, UK | Remote nationally',
      '',
      '=== LEGAL NOTICE ===',
      'This acknowledgement does not constitute a contract or guarantee of certification.',
      'Tanasiom Aegis is an independent readiness advisory service.',
      'Not affiliated with NCSC, IASME, or any Certification Body.',
      'CE certificates issued solely by IASME-licensed Certification Bodies.',
      'Governing law: England & Wales.',
      '',
      'Tanasiom Aegis Security & Compliance',
      'tanasiomaegis@gmail.com',
    ].join('\n')

    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: W3F_KEY,
        subject: `Your Enquiry — Case ${caseId} | Tanasiom Aegis`,
        message: autoBody,
        botcheck: '',
        from_name: 'Tanasiom Aegis Security & Compliance',
        to_email: replyTo,
        replyto: 'tanasiomaegis@gmail.com',
      }),
    })
  }
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const inp = {
  width: '100%', boxSizing: 'border-box',
  background: '#f8faff', border: '1px solid #dde3ec',
  color: '#0f172a', fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: '0.92rem', padding: '0.75rem 1rem',
  outline: 'none', transition: 'border-color 0.2s',
}
const labelSt = {
  fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem',
  color: '#64748b', letterSpacing: '1px', display: 'block', marginBottom: '0.35rem',
}
const onFocus = e => e.target.style.borderColor = '#1d4ed8'
const onBlur  = e => e.target.style.borderColor = '#dde3ec'

// ─── TRACK A — WARM (ran self-check) ─────────────────────────────────────────
function TrackWarm({ onSuccess }) {
  const [f, setF] = useState({
    contact_name: '', contact_email: '', contact_phone: '',
    company_name: '', employees: '', industry: '',
    score: '', blockers: '', urgency: '', notes: '', gdpr: false,
  })
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))
  const [sending, setSending] = useState(false)
  const [err, setErr] = useState('')

  const submit = async () => {
    if (!f.contact_name || !f.contact_email) { setErr('Name and email are required.'); return }
    if (!f.gdpr) { setErr('Please confirm your consent to be contacted before submitting.'); return }
    setSending(true); setErr('')
    try {
      const caseId = 'TA-' + Date.now().toString(36).toUpperCase().slice(-6) + '-' + Math.random().toString(36).toUpperCase().slice(2,5)
      await sendEmail(
        `[TANASIOM AEGIS] Gap Review Booking ${caseId} — ${f.company_name || f.contact_name}`,
        [
          '=== GAP REVIEW BOOKING (WARM TRACK) ===',
          `Name: ${f.contact_name}`,
          `Email: ${f.contact_email}`,
          `Phone: ${f.contact_phone || 'N/A'}`,
          `Company: ${f.company_name || 'N/A'}`,
          `Industry: ${f.industry || 'N/A'}`,
          `Employees: ${f.employees || 'N/A'}`,
          '',
          '=== SELF-CHECK RESULTS ===',
          `Readiness Estimate: ${f.score || 'Not provided'}%`,
          `Blockers Found: ${f.blockers || 'N/A'}`,
          `Urgency: ${f.urgency || 'N/A'}`,
          '',
          '=== NOTES ===',
          f.notes || 'None provided',
          '',
          'GDPR consent: YES',
          '',
          `Case ID: ${caseId}`,
          'GDPR consent: YES',
        ],
        f.contact_email, f.contact_name, caseId
      )
      onSuccess({ name: f.contact_name, email: f.contact_email, company: f.company_name, track: 'warm', caseId })
    } catch (e) { setErr('Send failed. Please email tanasiomaegis@gmail.com directly.') }
    setSending(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Score input */}
      <div style={{ background: '#f0f7ff', border: '1px solid #bfdbfe', borderLeft: '4px solid #1d4ed8', padding: '1.25rem 1.5rem' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#1d4ed8', letterSpacing: 2, marginBottom: '0.75rem' }}>YOUR SELF-CHECK RESULTS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <span style={labelSt}>Readiness estimate (%)</span>
            <input value={f.score} onChange={e => set('score', e.target.value)} placeholder="e.g. 58" style={inp} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <span style={labelSt}>Number of blockers found</span>
            <input value={f.blockers} onChange={e => set('blockers', e.target.value)} placeholder="e.g. 3" style={inp} onFocus={onFocus} onBlur={onBlur} />
          </div>
        </div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', color: '#64748b', marginTop: '0.6rem' }}>
          This helps us arrive prepared — no need to re-explain your position.
        </div>
      </div>

      {/* Your details */}
      <div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#1d4ed8', letterSpacing: 3, marginBottom: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid #edf0f5' }}>YOUR DETAILS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { k: 'contact_name', l: 'Full Name *', ph: 'e.g. Jane Smith' },
            { k: 'contact_email', l: 'Email *', ph: 'e.g. jane@company.co.uk', type: 'email' },
            { k: 'contact_phone', l: 'Phone (optional)', ph: 'e.g. 07700 900123' },
            { k: 'company_name', l: 'Company Name', ph: 'e.g. Acorn Solutions Ltd' },
          ].map(fd => (
            <div key={fd.k}>
              <span style={labelSt}>{fd.l}</span>
              <input value={f[fd.k]} onChange={e => set(fd.k, e.target.value)} placeholder={fd.ph} type={fd.type || 'text'} style={inp} onFocus={onFocus} onBlur={onBlur} />
            </div>
          ))}
        </div>
      </div>

      {/* Organisation */}
      <div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#1d4ed8', letterSpacing: 3, marginBottom: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid #edf0f5' }}>YOUR ORGANISATION</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <span style={labelSt}>Industry</span>
            <select value={f.industry} onChange={e => set('industry', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
              <option value="">Select...</option>
              {['Construction','Manufacturing','Professional Services','Healthcare','Retail / E-commerce','Logistics / Transport','Technology / IT','Security Services','Financial Services','Legal','Education','Public Sector','Other'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <span style={labelSt}>Employees</span>
            <select value={f.employees} onChange={e => set('employees', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
              <option value="">Select...</option>
              {['1–5','6–10','11–25','26–50','51–100','100–250','250+'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <span style={labelSt}>How urgently do you need CE certification?</span>
            <select value={f.urgency} onChange={e => set('urgency', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
              <option value="">Select...</option>
              {['ASAP — I have a contract deadline','Within 1 month','1–3 months','3–6 months','No fixed deadline — planning ahead'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <span style={labelSt}>Anything else we should know? (optional)</span>
        <textarea value={f.notes} onChange={e => set('notes', e.target.value)}
          placeholder="Previous CE attempts, specific blockers you've identified, your current setup, any concerns..."
          rows={4} style={{ ...inp, resize: 'vertical', lineHeight: 1.65 }} onFocus={onFocus} onBlur={onBlur}
        />
      </div>

      {/* GDPR */}
      <div style={{ background: '#f8faff', border: '1px solid #dde3ec', padding: '1rem 1.25rem' }}>
        <label style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', cursor: 'pointer' }}>
          <input type="checkbox" checked={f.gdpr} onChange={e => set('gdpr', e.target.checked)}
            style={{ marginTop: 3, flexShrink: 0, accentColor: '#1d4ed8', width: 16, height: 16 }} />
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', color: '#475569', lineHeight: 1.7 }}>
            I consent to Tanasiom Aegis contacting me about Cyber Essentials readiness services. My details will be used only to prepare and deliver the requested service and will not be shared with third parties for marketing purposes. I understand I can withdraw consent at any time by emailing tanasiomaegis@gmail.com. <span style={{ color: '#1d4ed8' }}>Required *</span>
          </span>
        </label>
      </div>

      {err && <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.68rem', color: '#dc2626' }}>⚠ {err}</div>}

      <button onClick={submit} disabled={sending} style={{ background: sending ? '#e2e8f0' : '#1d4ed8', color: sending ? '#94a3b8' : '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.05rem', letterSpacing: 3, padding: '1rem', border: 'none', cursor: sending ? 'not-allowed' : 'pointer', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))', transition: 'all 0.2s', width: '100%' }}
        onMouseEnter={e => { if (!sending) e.currentTarget.style.background = '#1e40af' }}
        onMouseLeave={e => { if (!sending) e.currentTarget.style.background = '#1d4ed8' }}
      >{sending ? 'SENDING...' : 'BOOK MY GAP REVIEW — £397 →'}</button>

      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', color: '#94a3b8', textAlign: 'center', lineHeight: 1.7 }}>
        No payment taken here · We will confirm scope and send an invoice before any work begins · Response within 1 business day
      </div>
    </div>
  )
}

// ─── TRACK B — COLD (haven't run self-check) ─────────────────────────────────
function TrackCold({ onSuccess }) {
  const [f, setF] = useState({
    contact_name: '', contact_email: '', contact_phone: '',
    company_name: '', employees: '', industry: '',
    ce_status: '', concern: '', service: '', notes: '', how_found: '', gdpr: false,
  })
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))
  const [sending, setSending] = useState(false)
  const [err, setErr] = useState('')

  const submit = async () => {
    if (!f.contact_name || !f.contact_email) { setErr('Name and email are required.'); return }
    if (!f.gdpr) { setErr('Please confirm your consent to be contacted before submitting.'); return }
    setSending(true); setErr('')
    try {
      const caseId = 'TA-' + Date.now().toString(36).toUpperCase().slice(-6) + '-' + Math.random().toString(36).toUpperCase().slice(2,5)
      await sendEmail(
        `[TANASIOM AEGIS] General Enquiry ${caseId} — ${f.company_name || f.contact_name}`,
        [
          '=== GENERAL ENQUIRY (COLD TRACK) ===',
          `Name: ${f.contact_name}`,
          `Email: ${f.contact_email}`,
          `Phone: ${f.contact_phone || 'N/A'}`,
          `Company: ${f.company_name || 'N/A'}`,
          `Industry: ${f.industry || 'N/A'}`,
          `Employees: ${f.employees || 'N/A'}`,
          `CE Status: ${f.ce_status || 'N/A'}`,
          `How Found: ${f.how_found || 'N/A'}`,
          '',
          '=== SERVICE & MESSAGE ===',
          `Service of Interest: ${f.service || 'Not specified'}`,
          `Message: ${f.notes || 'None provided'}`,
          '',
          `Case ID: ${caseId}`,
          'GDPR consent: YES',
        ],
        f.contact_email, f.contact_name, caseId
      )
      onSuccess({ name: f.contact_name, email: f.contact_email, company: f.company_name, track: 'cold', caseId })
    } catch (e) { setErr('Send failed. Please email tanasiomaegis@gmail.com directly.') }
    setSending(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Nudge to self-check */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '4px solid #16a34a', padding: '1.1rem 1.25rem' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#16a34a', letterSpacing: 2, marginBottom: '0.35rem' }}>BEFORE YOU SUBMIT — SAVE TIME</div>
        <p style={{ fontSize: '0.8rem', color: '#166534', lineHeight: 1.65, margin: '0 0 0.65rem' }}>
          Running the free 15-minute self-check first means we arrive with your gap report already reviewed — faster response, more useful advice. No account needed.
        </p>
        <Link to="/framework" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', color: '#16a34a', letterSpacing: 2, textDecoration: 'none' }}>RUN FREE SELF-CHECK FIRST →</Link>
      </div>

      {/* Your details */}
      <div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#1d4ed8', letterSpacing: 3, marginBottom: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid #edf0f5' }}>YOUR DETAILS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { k: 'contact_name', l: 'Full Name *', ph: 'e.g. Jane Smith' },
            { k: 'contact_email', l: 'Email *', ph: 'e.g. jane@company.co.uk', type: 'email' },
            { k: 'contact_phone', l: 'Phone (optional)', ph: 'e.g. 07700 900123' },
            { k: 'company_name', l: 'Company Name', ph: 'e.g. Acorn Solutions Ltd' },
          ].map(fd => (
            <div key={fd.k}>
              <span style={labelSt}>{fd.l}</span>
              <input value={f[fd.k]} onChange={e => set(fd.k, e.target.value)} placeholder={fd.ph} type={fd.type || 'text'} style={inp} onFocus={onFocus} onBlur={onBlur} />
            </div>
          ))}
        </div>
      </div>

      {/* Organisation */}
      <div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#1d4ed8', letterSpacing: 3, marginBottom: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid #edf0f5' }}>YOUR ORGANISATION</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <span style={labelSt}>Industry</span>
            <select value={f.industry} onChange={e => set('industry', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
              <option value="">Select...</option>
              {['Construction','Manufacturing','Professional Services','Healthcare','Retail / E-commerce','Logistics / Transport','Technology / IT','Security Services','Financial Services','Legal','Education','Public Sector','Other'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <span style={labelSt}>Employees</span>
            <select value={f.employees} onChange={e => set('employees', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
              <option value="">Select...</option>
              {['1–5','6–10','11–25','26–50','51–100','100–250','250+'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <span style={labelSt}>CE Status</span>
            <select value={f.ce_status} onChange={e => set('ce_status', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
              <option value="">Select...</option>
              {['Never applied','Applied and failed','Currently certified — renewal due','Required for a contract','Just exploring'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <span style={labelSt}>How Did You Find Us</span>
            <select value={f.how_found} onChange={e => set('how_found', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
              <option value="">Select...</option>
              {['Google search','LinkedIn','Referral / word of mouth','GitHub','Direct / knew the brand','Other'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* What they need */}
      <div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#1d4ed8', letterSpacing: 3, marginBottom: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid #edf0f5' }}>WHAT YOU NEED</div>
        <div style={{ marginBottom: '0.75rem' }}>
          <span style={labelSt}>Service of Interest</span>
          <select value={f.service} onChange={e => set('service', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
            <option value="">Select...</option>
            {['CE Gap Review — £397','Policy Pack — £297','CE Pass Implementation — £897','Annual Maintenance — £297/yr','Not sure — need advice first'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <span style={labelSt}>Tell us what you need</span>
          <textarea value={f.notes} onChange={e => set('notes', e.target.value)}
            placeholder="Describe your situation — what systems you run, any specific concerns, deadlines, what you've already tried..."
            rows={4} style={{ ...inp, resize: 'vertical', lineHeight: 1.65 }} onFocus={onFocus} onBlur={onBlur}
          />
        </div>
      </div>

      {/* GDPR */}
      <div style={{ background: '#f8faff', border: '1px solid #dde3ec', padding: '1rem 1.25rem' }}>
        <label style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', cursor: 'pointer' }}>
          <input type="checkbox" checked={f.gdpr} onChange={e => set('gdpr', e.target.checked)}
            style={{ marginTop: 3, flexShrink: 0, accentColor: '#1d4ed8', width: 16, height: 16 }} />
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', color: '#475569', lineHeight: 1.7 }}>
            I consent to Tanasiom Aegis contacting me about Cyber Essentials readiness services. My details will be used only to prepare and deliver the requested service and will not be shared with third parties for marketing purposes. I understand I can withdraw consent at any time by emailing tanasiomaegis@gmail.com. <span style={{ color: '#1d4ed8' }}>Required *</span>
          </span>
        </label>
      </div>

      {err && <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.68rem', color: '#dc2626' }}>⚠ {err}</div>}

      <button onClick={submit} disabled={sending} style={{ background: sending ? '#e2e8f0' : '#1d4ed8', color: sending ? '#94a3b8' : '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.05rem', letterSpacing: 3, padding: '1rem', border: 'none', cursor: sending ? 'not-allowed' : 'pointer', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))', transition: 'all 0.2s', width: '100%' }}
        onMouseEnter={e => { if (!sending) e.currentTarget.style.background = '#1e40af' }}
        onMouseLeave={e => { if (!sending) e.currentTarget.style.background = '#1d4ed8' }}
      >{sending ? 'SENDING...' : 'SEND ENQUIRY →'}</button>

      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', color: '#94a3b8', textAlign: 'center', lineHeight: 1.7 }}>
        No commitment · Response within 1 business day · No payment taken here
      </div>
    </div>
  )
}

// ─── CONFIRMATION ─────────────────────────────────────────────────────────────
function Confirmation({ data }) {
  const isWarm = data.track === 'warm'
  return (
    <div style={{ maxWidth: 600, margin: '6rem auto', padding: '0 1.5rem' }}>
      <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderTop: '4px solid #16a34a', padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: 3, color: '#16a34a', marginBottom: '0.75rem' }}>
          {isWarm ? 'GAP REVIEW BOOKED' : 'ENQUIRY RECEIVED'}
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', fontStyle: 'italic', color: '#64748b', lineHeight: 1.75, marginBottom: '2rem' }}>
          {isWarm
            ? 'Your results have been received. We will review your gap report and be in touch within one business day to confirm scope and send the invoice.'
            : 'Your enquiry has been received. We will respond within one business day with a clear proposal.'
          }
        </p>

        {/* What happens next */}
        <div style={{ background: '#f8faff', border: '1px solid #dde3ec', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#1d4ed8', letterSpacing: 3, marginBottom: '1rem' }}>// WHAT HAPPENS NEXT</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {(isWarm ? [
              { step: '01', text: 'We review your self-check results and gap report', time: 'Within 2 hours' },
              { step: '02', text: 'You receive a confirmation email with scope and invoice', time: 'Within 1 business day' },
              { step: '03', text: 'Payment confirmed — we begin the Gap Review', time: 'Same day as payment' },
              { step: '04', text: 'Written gap report delivered with prioritised action plan', time: 'Within 48 hours of payment' },
            ] : [
              { step: '01', text: 'We review your enquiry and assess the right service for you', time: 'Within 4 hours' },
              { step: '02', text: 'You receive a response with a clear proposal and next steps', time: 'Within 1 business day' },
              { step: '03', text: 'If helpful, we may suggest running the free self-check first', time: '15 minutes — your call' },
            ]).map(s => (
              <div key={s.step} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#1d4ed8', flexShrink: 0, marginTop: 2 }}>{s.step}</span>
                <div>
                  <div style={{ fontSize: '0.83rem', color: '#0f172a', marginBottom: '0.1rem' }}>{s.text}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', color: '#94a3b8' }}>{s.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#f8faff', border: '1px solid #dde3ec', padding: '1rem', marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#64748b', letterSpacing: 3, marginBottom: '0.6rem' }}>SUBMISSION DETAILS</div>
          <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.8 }}>
            <div><span style={{ color: '#94a3b8', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem' }}>Name: </span>{data.name}</div>
            <div><span style={{ color: '#94a3b8', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem' }}>Email: </span>{data.email}</div>
            {data.company && <div><span style={{ color: '#94a3b8', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem' }}>Company: </span>{data.company}</div>}
            {data.caseId && <div style={{marginTop:'0.5rem',paddingTop:'0.5rem',borderTop:'1px solid #edf0f5'}}><span style={{ color: '#94a3b8', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem' }}>Case reference: </span><span style={{fontFamily:"'Share Tech Mono',monospace",color:'#1d4ed8',fontWeight:600}}>{data.caseId}</span></div>}
            {data.caseId && <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'0.65rem',color:'#94a3b8',marginTop:'0.2rem'}}>A confirmation email has been sent to {data.email}</div>}
          </div>
        </div>

        <Link to="/" style={{ background: 'transparent', color: '#1d4ed8', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.68rem', letterSpacing: 2, padding: '0.7rem 1.5rem', border: '1px solid #bfdbfe', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >← BACK TO HOME</Link>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Contact() {
  const [track, setTrack]       = useState(null)   // null | 'warm' | 'cold'
  const [confirmed, setConfirmed] = useState(null)
  const [tickerPos, setTickerPos] = useState(0)

  // ticker
  useState(() => {
    const t = setInterval(() => setTickerPos(p => p + 1), 50)
    return () => clearInterval(t)
  })
  const TICKER = 'Tanasiom Aegis · Gap Review — £397 · Policy Pack — £297 · CE Pass Implementation — £897 · 48-hour turnaround · No payment taken on this form · Response within 1 business day'
  const offset = (tickerPos * 0.35) % (TICKER.length * 7.5)

  if (confirmed) return (
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#f4f6f8', minHeight: '100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&family=Cormorant+Garamond:ital,wght@1,400;1,600&display=swap');`}</style>
      <Confirmation data={confirmed} />
    </div>
  )

  return (
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#f4f6f8', color: '#1a2332', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&family=Cormorant+Garamond:ital,wght@1,400;1,600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @media(max-width:900px){ .ct-grid{grid-template-columns:1fr!important} }
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
      <div style={{ padding: '4rem 1.5rem 3rem', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '8%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 4, color: '#60a5fa', marginBottom: '1rem' }}>// BEGIN YOUR ENGAGEMENT</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,7vw,5rem)', lineHeight: 0.9, letterSpacing: 3, color: '#f0f6ff', marginBottom: '1rem' }}>
            LET'S CLOSE<br /><span style={{ color: '#60a5fa' }}>YOUR GAPS.</span>
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(224,236,255,0.6)', maxWidth: 540, lineHeight: 1.75 }}>
            Every engagement starts by understanding where you are. Tell us your situation and we will respond within one business day with a clear, fixed-fee proposal.
          </p>
        </div>
      </div>

      {/* TRACK SELECTOR — shown until a track is picked */}
      {!track && (
        <div style={{ padding: '3.5rem 1.5rem', background: '#ffffff', borderBottom: '1px solid #dde3ec' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#1d4ed8', letterSpacing: 3, marginBottom: '0.5rem' }}>// STEP 1 — TELL US WHERE YOU ARE</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: 2, color: '#0f172a', marginBottom: '0.75rem' }}>
              HAVE YOU RUN THE FREE SELF-CHECK?
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 580 }}>
              It takes 15 minutes and gives us your gap report before we speak — which means a faster, more useful response. But if you'd prefer to go straight to an enquiry, that's fine too.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: 760 }}>

              {/* WARM */}
              <div style={{ background: '#f0f7ff', border: '2px solid #1d4ed8', padding: '2rem', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}
                onClick={() => setTrack('warm')}
                onMouseEnter={e => { e.currentTarget.style.background = '#dbeafe'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f0f7ff'; e.currentTarget.style.transform = 'none' }}
              >
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', color: '#1d4ed8', letterSpacing: 2, marginBottom: '0.75rem' }}>RECOMMENDED</div>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✅</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: 2, color: '#0f172a', marginBottom: '0.5rem' }}>YES — I'VE RUN THE SELF-CHECK</div>
                <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.7, marginBottom: '1rem' }}>
                  I have my readiness estimate and gap report. I want to book a Gap Review or discuss next steps.
                </p>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', color: '#1d4ed8', letterSpacing: 1 }}>
                  BOOK GAP REVIEW — £397 →
                </div>
              </div>

              {/* COLD */}
              <div style={{ background: '#f8faff', border: '1px solid #dde3ec', padding: '2rem', cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setTrack('cold')}
                onMouseEnter={e => { e.currentTarget.style.background = '#f0f7ff'; e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f8faff'; e.currentTarget.style.borderColor = '#dde3ec'; e.currentTarget.style.transform = 'none' }}
              >
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', color: '#64748b', letterSpacing: 2, marginBottom: '0.75rem' }}>GENERAL ENQUIRY</div>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💬</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: 2, color: '#0f172a', marginBottom: '0.5rem' }}>NO — SEND A GENERAL ENQUIRY</div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.7, marginBottom: '1rem' }}>
                  I haven't run the self-check yet, or I want to ask about services before committing to anything.
                </p>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', color: '#64748b', letterSpacing: 1 }}>
                  SEND ENQUIRY →
                </div>
              </div>
            </div>

            {/* No check yet nudge */}
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', color: '#94a3b8' }}>Haven't run the self-check yet?</span>
              <Link to="/framework" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', color: '#1d4ed8', letterSpacing: 2, textDecoration: 'none' }}>RUN IT FREE — 15 MINUTES →</Link>
            </div>
          </div>
        </div>
      )}

      {/* FORM + SIDEBAR */}
      {track && (
        <div className="ct-grid" style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem', alignItems: 'start' }}>

          {/* FORM PANEL */}
          <div>
            {/* Track switcher */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#94a3b8' }}>Track:</span>
              <button onClick={() => setTrack('warm')} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: 1, padding: '3px 10px', border: `1px solid ${track === 'warm' ? '#1d4ed8' : '#dde3ec'}`, background: track === 'warm' ? '#1d4ed8' : 'transparent', color: track === 'warm' ? '#fff' : '#64748b', cursor: 'pointer' }}>
                ✅ I ran the self-check
              </button>
              <button onClick={() => setTrack('cold')} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: 1, padding: '3px 10px', border: `1px solid ${track === 'cold' ? '#1d4ed8' : '#dde3ec'}`, background: track === 'cold' ? '#1d4ed8' : 'transparent', color: track === 'cold' ? '#fff' : '#64748b', cursor: 'pointer' }}>
                💬 General enquiry
              </button>
              <button onClick={() => setTrack(null)} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>← back</button>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #dde3ec', borderTop: `3px solid #1d4ed8`, padding: '2rem' }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#1d4ed8', letterSpacing: 3, marginBottom: '1.5rem' }}>
                {track === 'warm' ? '// BOOK GAP REVIEW — £397' : '// GENERAL ENQUIRY'}
              </div>
              {track === 'warm'
                ? <TrackWarm onSuccess={setConfirmed} />
                : <TrackCold onSuccess={setConfirmed} />
              }
            </div>
          </div>

          {/* SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* What happens next */}
            <div style={{ background: '#ffffff', border: '1px solid #dde3ec', borderTop: '3px solid #16a34a', padding: '1.5rem' }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#16a34a', letterSpacing: 3, marginBottom: '1.25rem' }}>// WHAT HAPPENS NEXT</div>
              {[
                { icon: '📬', step: 'We receive your form', detail: 'Immediately — you\'ll see a confirmation screen' },
                { icon: '🔍', step: 'We review your position', detail: track === 'warm' ? 'Your gap report reviewed within 2 hours' : 'We assess the right service for you' },
                { icon: '📧', step: 'You hear from us', detail: 'Within 1 business day — clear proposal, fixed fee' },
                { icon: '✅', step: 'Work begins', detail: 'On payment confirmation — 48hr report delivery' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.85rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: i < 3 ? '1px solid #edf0f5' : 'none' }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 600, marginBottom: '0.15rem' }}>{s.step}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', color: '#94a3b8', lineHeight: 1.5 }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div style={{ background: '#ffffff', border: '1px solid #dde3ec', padding: '1.5rem' }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#1d4ed8', letterSpacing: 3, marginBottom: '1.25rem' }}>// FIXED FEES</div>
              {[
                { svc: 'Gap Review', price: '£397', note: '48-hour written report', color: '#1d4ed8' },
                { svc: 'Policy Pack', price: '£297', note: '6 CE-required policies tailored', color: '#059669' },
                { svc: 'CE Pass Implementation', price: '£897', note: 'Full fix + evidence pack', color: '#7c3aed' },
                { svc: 'Annual Maintenance', price: '£297/yr', note: 'Ongoing compliance support', color: '#d97706' },
              ].map(p => (
                <div key={p.svc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.65rem 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 600 }}>{p.svc}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', color: '#94a3b8' }}>{p.note}</div>
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.15rem', color: p.color, flexShrink: 0, marginLeft: '0.5rem' }}>{p.price}</div>
                </div>
              ))}
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', color: '#94a3b8', marginTop: '0.75rem', lineHeight: 1.6 }}>
                No payment taken on this form. Invoice sent on scope confirmation.
              </div>
            </div>

            {/* Legal / independence */}
            <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderLeft: '3px solid #f59e0b', padding: '1.1rem 1.25rem' }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', color: '#92400e', letterSpacing: 1, marginBottom: '0.4rem' }}>INDEPENDENCE NOTICE</div>
              <p style={{ fontSize: '0.75rem', color: '#78350f', lineHeight: 1.7, margin: 0 }}>
                Tanasiom Aegis is an independent readiness consultancy. We are not affiliated with NCSC, IASME, or any Certification Body. CE certificates are issued solely by IASME-licensed bodies. Our services are advisory only.
              </p>
            </div>

            {/* Direct contact */}
            <div style={{ background: '#ffffff', border: '1px solid #dde3ec', padding: '1.5rem' }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#1d4ed8', letterSpacing: 3, marginBottom: '1rem' }}>// PREFER EMAIL DIRECT?</div>
              <a href="mailto:tanasiomaegis@gmail.com" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.68rem', color: '#1d4ed8', textDecoration: 'none', letterSpacing: 1 }}>
                tanasiomaegis@gmail.com ↗
              </a>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.58rem', color: '#94a3b8', marginTop: '0.4rem' }}>Response within 1 business day · Coventry, UK · Remote nationally</div>
            </div>

          </div>
        </div>
      )}

      {/* BOTTOM LEGAL STRIP */}
      <div style={{ borderTop: '1px solid #dde3ec', background: '#0f172a', padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', color: '#334155', letterSpacing: 1, lineHeight: 1.8 }}>
          TANASIOM AEGIS SECURITY & COMPLIANCE · INDEPENDENT READINESS ADVISORY · NOT AFFILIATED WITH NCSC OR IASME<br />
          GOVERNING LAW: ENGLAND & WALES · UK GDPR / DPA 2018 · tanasiomaegis@gmail.com
        </div>
      </div>
    </div>
  )
}

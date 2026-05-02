import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const mono = "'Share Tech Mono', monospace"
const display = "'Bebas Neue', sans-serif"
const body = "'Barlow Condensed', sans-serif"
const serif = "'Cormorant Garamond', serif"

const THREAT_FEED = [
  { time:'09:42', sev:'CRITICAL', source:'CISA KEV', msg:'CVE-2026-1731 BeyondTrust RCE added to KEV — immediate action required', color:'#dc2626' },
  { time:'09:31', sev:'HIGH',     source:'NCSC',     msg:'Active phishing campaign targeting UK construction SMEs via fake invoice portals', color:'#d97706' },
  { time:'09:15', sev:'CRITICAL', source:'CISA KEV', msg:'CVE-2025-53770 SharePoint ToolShell — 424 unpatched servers confirmed by Shadowserver', color:'#dc2626' },
  { time:'08:57', sev:'MEDIUM',   source:'IASME',    msg:'CE v3.3 MFA requirements updated April 2026 — all cloud services now mandatory', color:'#2563eb' },
  { time:'08:44', sev:'HIGH',     source:'NCSC',     msg:'Ransomware targeting UK SMEs <50 employees — RDP brute force initial vector', color:'#d97706' },
  { time:'08:22', sev:'CRITICAL', source:'CISA KEV', msg:'CVE-2025-3248 Langflow AI RCE actively exploited — patch to 1.3.0 immediately', color:'#dc2626' },
  { time:'07:55', sev:'HIGH',     source:'NCSC',     msg:'Default router credential attacks surging — 3,400 UK SME routers compromised this week', color:'#d97706' },
  { time:'07:33', sev:'MEDIUM',   source:'ICO',      msg:'GDPR enforcement against 8 UK SMEs for inadequate access controls — fines issued', color:'#2563eb' },
  { time:'06:48', sev:'CRITICAL', source:'NCSC',     msg:'Redis CVSS 10.0 — unauthenticated deployments vulnerable to full RCE chain', color:'#dc2626' },
  { time:'06:21', sev:'HIGH',     source:'NCSC',     msg:'Supply chain attack campaign targeting UK professional services via compromised MSP tooling', color:'#d97706' },
]

const UK_SECTORS = [
  { sector:'Healthcare',           risk:91, trend:'+15%', incidents:312 },
  { sector:'Construction',         risk:87, trend:'+12%', incidents:234 },
  { sector:'Financial Services',   risk:83, trend:'+9%',  incidents:267 },
  { sector:'Logistics / Transport',risk:78, trend:'+11%', incidents:201 },
  { sector:'Legal',                risk:76, trend:'+10%', incidents:198 },
  { sector:'Professional Services',risk:72, trend:'+8%',  incidents:189 },
  { sector:'Technology / IT',      risk:69, trend:'+7%',  incidents:178 },
  { sector:'Retail / E-commerce',  risk:65, trend:'+5%',  incidents:156 },
]

const CE_STATS = [
  { control:'Firewalls',             pass:67, fail:33, topIssue:'Default credentials unchanged' },
  { control:'Secure Configuration',  pass:54, fail:46, topIssue:'Unnecessary services running' },
  { control:'Update Management',     pass:48, fail:52, topIssue:'Patches >14 days overdue' },
  { control:'User Access Control',   pass:41, fail:59, topIssue:'MFA not enabled on cloud services' },
  { control:'Malware Protection',    pass:71, fail:29, topIssue:'Definitions not auto-updating' },
]

const LAB_SUMMARY = [
  { id:'LAB-01', name:'Metasploitable 2',  findings:12, critical:6, cvss:'10.0', status:'COMPLETE',    color:'#16a34a' },
  { id:'LAB-02', name:'DVWA Web App',      findings:9,  critical:3, cvss:'9.8',  status:'IN PROGRESS', color:'#d97706' },
  { id:'LAB-03', name:'Linux Forensics',   findings:0,  critical:0, cvss:'N/A',  status:'IN PROGRESS', color:'#d97706' },
  { id:'LAB-04', name:'Active Directory',  findings:0,  critical:0, cvss:'TBC',  status:'PLANNED',     color:'#94a3b8' },
  { id:'LAB-05', name:'Cloud Misconfig',   findings:0,  critical:0, cvss:'TBC',  status:'PLANNED',     color:'#94a3b8' },
]

const CERT_TIMELINE = [
  { step:'Free Assessment',   done:true,  desc:'50-question CE readiness check',           link:'/framework' },
  { step:'Gap Analysis',      done:true,  desc:'Identify all control area failures',        link:'/framework' },
  { step:'Policy Templates',  done:true,  desc:'Download 7 CE-aligned policy documents',   link:'/docs' },
  { step:'Expert Review',     done:false, desc:'Tanasiom Aegis professional session — £397', link:'/contact' },
  { step:'Remediation',       done:false, desc:'Fix identified gaps using roadmap',         link:'/services' },
  { step:'IASME Application', done:false, desc:'Submit CE self-assessment £320+',           link:'https://iasme.co.uk' },
  { step:'CE Certified ✓',   done:false, desc:'Certificate issued — valid 12 months',      link:'https://www.ncsc.gov.uk/cyberessentials/overview' },
]

const CVE_TICKER = [
  'CVE-2026-1731 · BeyondTrust RCE · CVSS 9.9 · CISA KEV',
  'CVE-2025-53770 · SharePoint ToolShell · CVSS 9.8 · CISA KEV',
  'CVE-2025-3248 · Langflow AI RCE · CVSS 9.8 · CISA KEV',
  'CVE-2025-49844 · Redis Lua RCE · CVSS 10.0 · Patch Available',
  'CVE-2025-32463 · sudo PrivEsc · CVSS 9.3 · CISA KEV',
  'CVE-2025-64446 · FortiWeb AuthBypass · CVSS 9.8 · CISA KEV',
  'CVE-2011-2523 · vsftpd Backdoor · CVSS 10.0 · LAB CONFIRMED',
  'CVE-2007-2447 · Samba RCE · CVSS 9.3 · LAB CONFIRMED',
  'CVE-2025-1974 · IngressNightmare K8s · CVSS 9.8 · Patch Available',
  'CVE-2025-32432 · Craft CMS RCE · CVSS 10.0 · CISA KEV',
]

// ── TYPEWRITER ──
function Typewriter({ texts, speed = 60 }) {
  const [display, setDisplay] = useState('')
  const [textIdx, setTextIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIdx]
    const t = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), 2000)
        else setCharIdx(c => c + 1)
      } else {
        setDisplay(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) { setDeleting(false); setTextIdx(i => (i + 1) % texts.length); setCharIdx(0) }
        else setCharIdx(c => c - 1)
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(t)
  }, [charIdx, deleting, textIdx, texts, speed])

  return <span>{display}<span style={{ color:'#1d4ed8' }}>█</span></span>
}

// ── ANIMATED COUNTER ──
function Counter({ target, prefix = '', suffix = '' }) {
  const [val, setVal] = useState(0)
  const done = useRef(false)
  useEffect(() => {
    if (done.current) return
    done.current = true
    const steps = 60
    const inc = target / steps
    let current = 0
    const t = setInterval(() => {
      current += inc
      if (current >= target) { setVal(target); clearInterval(t) }
      else setVal(Math.floor(current))
    }, 2000 / steps)
    return () => clearInterval(t)
  }, [target])
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>
}

// ── RADAR CHART ──
function RadarChart({ data, size = 200 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38
  const n = data.length
  const points = (values) => data.map((_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2
    const v = (values[i] / 100) * r
    return `${cx + v * Math.cos(angle)},${cy + v * Math.sin(angle)}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', maxWidth: size }}>
      {[20,40,60,80,100].map(level => (
        <polygon key={level} points={points(data.map(() => level))} fill="none" stroke="#edf0f5" strokeWidth="0.8" />
      ))}
      {data.map((_, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="#edf0f5" strokeWidth="0.8" />
      })}
      <polygon points={points(data.map(d => d.value))} fill="rgba(29,78,216,0.1)" stroke="#1d4ed8" strokeWidth="1.5" />
      {data.map((d, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2
        const v = (d.value / 100) * r
        const lx = cx + (r + 16) * Math.cos(angle)
        const ly = cy + (r + 16) * Math.sin(angle)
        return (
          <g key={i}>
            <circle cx={cx + v * Math.cos(angle)} cy={cy + v * Math.sin(angle)} r="3" fill="#1d4ed8" />
            <text x={lx} y={ly + 3} textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ── RISK HEAT MAP ──
function RiskHeatMap() {
  const [hovered, setHovered] = useState(null)
  const cells = [
    { label:'FTP', risk:95, cve:'CVE-2011-2523' },{ label:'SMB', risk:88, cve:'CVE-2007-2447' },
    { label:'Telnet', risk:92, cve:'Plaintext' },{ label:'RDP', risk:75, cve:'Brute Force' },
    { label:'VNC', risk:70, cve:'Default Creds' },{ label:'HTTP', risk:65, cve:'Web App Flaws' },
    { label:'MySQL', risk:85, cve:'No Auth' },{ label:'SSH', risk:45, cve:'Weak Keys' },
    { label:'IRC', risk:80, cve:'CVE-2010-2075' },{ label:'distcc', risk:90, cve:'CVE-2004-2687' },
    { label:'NFS', risk:88, cve:'World Mount' },{ label:'PostgreSQL', risk:72, cve:'Default User' },
    { label:'Tomcat', risk:68, cve:'Default Creds' },{ label:'SMTP', risk:40, cve:'Open Relay' },
    { label:'DNS', risk:35, cve:'Zone Transfer' },
  ]
  const rc = (r) => r >= 90 ? '#dc2626' : r >= 75 ? '#d97706' : r >= 50 ? '#2563eb' : '#16a34a'

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'2px' }}>
        {cells.map((c, i) => (
          <div key={i} style={{ background: hovered===i ? rc(c.risk) : `${rc(c.risk)}15`, border:`1px solid ${rc(c.risk)}40`, padding:'0.6rem 0.4rem', textAlign:'center', cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ fontFamily:mono, fontSize:'0.55rem', color: hovered===i?'#fff':rc(c.risk), fontWeight:700 }}>{c.risk}</div>
            <div style={{ fontFamily:display, fontSize:'0.6rem', letterSpacing:'1px', color: hovered===i?'#fff':'#0f172a', marginTop:'0.15rem' }}>{c.label}</div>
          </div>
        ))}
      </div>
      {hovered !== null && (
        <div style={{ marginTop:'0.75rem', padding:'0.65rem 1rem', background:'#f8faff', border:`1px solid ${rc(cells[hovered].risk)}40`, fontFamily:mono, fontSize:'0.62rem', color:'#64748b' }}>
          <span style={{ color:rc(cells[hovered].risk) }}>{cells[hovered].label}</span>
          {' '}· Risk Score: <span style={{ color:rc(cells[hovered].risk), fontWeight:700 }}>{cells[hovered].risk}/100</span>
          {' '}· {cells[hovered].cve}
        </div>
      )}
    </div>
  )
}

// ── NETWORK PACKETS CANVAS ──
function NetworkPackets() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = 120
    const packets = Array.from({length:8}, (_, i) => ({
      x: Math.random() * canvas.width,
      y: 20 + (i % 4) * 25,
      speed: 0.5 + Math.random() * 1.5,
      color: Math.random() > 0.7 ? '#dc2626' : Math.random() > 0.5 ? '#d97706' : '#2563eb',
      size: 3 + Math.random() * 3,
      label: ['SYN','ACK','RST','FIN','DATA','EXPLOIT','SCAN','PROBE'][i],
    }))
    const nodes = [50, canvas.width * 0.35, canvas.width * 0.65, canvas.width - 50]
    const nodeLabels = ['KALI', 'SWITCH', 'UBUNTU', 'MSF2']
    const nodeColors = ['#dc2626', '#1d4ed8', '#d97706', '#7c3aed']
    let raf
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      nodes.forEach((nx, i) => {
        ctx.beginPath(); ctx.arc(nx, 60, 12, 0, Math.PI * 2)
        ctx.fillStyle = `${nodeColors[i]}15`; ctx.fill()
        ctx.strokeStyle = nodeColors[i]; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.fillStyle = nodeColors[i]; ctx.font = '7px monospace'; ctx.textAlign = 'center'
        ctx.fillText(nodeLabels[i], nx, 63)
        if (i < nodes.length - 1) {
          ctx.beginPath(); ctx.moveTo(nx + 12, 60); ctx.lineTo(nodes[i+1] - 12, 60)
          ctx.strokeStyle = '#dde3ec'; ctx.lineWidth = 1; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([])
        }
      })
      packets.forEach(p => {
        p.x += p.speed
        if (p.x > canvas.width + 20) p.x = -20
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color; ctx.fill()
        ctx.beginPath(); ctx.moveTo(p.x - p.size * 4, p.y); ctx.lineTo(p.x, p.y)
        ctx.strokeStyle = `${p.color}40`; ctx.lineWidth = p.size; ctx.stroke()
        ctx.fillStyle = p.color; ctx.font = '6px monospace'; ctx.textAlign = 'center'
        ctx.fillText(p.label, p.x, p.y - p.size - 3)
      })
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={canvasRef} style={{ width:'100%', height:'120px', display:'block', background:'#f8faff' }} />
}

// ── LIVE CLOCK ──
function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])
  const pad = n => String(n).padStart(2, '0')
  return (
    <div style={{ fontFamily:mono, fontSize:'1.8rem', color:'#1d4ed8', letterSpacing:'4px', lineHeight:1 }}>
      {pad(time.getHours())}:{pad(time.getMinutes())}:{pad(time.getSeconds())}
      <div style={{ fontSize:'0.6rem', color:'#94a3b8', letterSpacing:'2px', marginTop:'0.2rem' }}>
        {time.toLocaleDateString('en-GB',{weekday:'short',day:'2-digit',month:'short',year:'numeric'})} · UTC
      </div>
    </div>
  )
}

// ── MAIN ──────────────────────────────────────
export default function Dashboard() {
  const [cveIdx, setCveIdx] = useState(0)
  const [activeFeed, setActiveFeed] = useState(null)
  const [tab, setTab] = useState('ce')
  const [activeSector, setActiveSector] = useState(null)

  useEffect(() => {
    const t = setInterval(() => setCveIdx(i => (i + 1) % CVE_TICKER.length), 3000)
    return () => clearInterval(t)
  }, [])

  const sevColor = s => s==='CRITICAL'?'#dc2626':s==='HIGH'?'#d97706':'#2563eb'

  return (
    <div style={{ fontFamily:body, background:'#f4f6f8', color:'#1a2332', minHeight:'100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&family=Cormorant+Garamond:ital,wght@1,400;1,600&display=swap');
        @keyframes tickerScroll { from { transform:translateX(0) } to { transform:translateX(-50%) } }
        @media(max-width:768px){ .dash-hero-grid{grid-template-columns:1fr!important;} .dash-kpi{grid-template-columns:repeat(3,1fr)!important;} }
      `}</style>

      {/* CVE TICKER */}
      <div style={{ background:'#0f172a', borderBottom:'1px solid #1e293b', padding:'0.35rem 0', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center' }}>
          <div style={{ background:'#dc2626', padding:'0.35rem 1rem', fontFamily:mono, fontSize:'0.55rem', color:'#fff', letterSpacing:'2px', flexShrink:0, zIndex:1 }}>● LIVE CVE</div>
          <div style={{ overflow:'hidden', flex:1 }}>
            <div style={{ display:'flex', gap:'3rem', animation:'tickerScroll 30s linear infinite', whiteSpace:'nowrap' }}>
              {[...CVE_TICKER,...CVE_TICKER].map((t,i) => (
                <span key={i} style={{ fontFamily:mono, fontSize:'0.6rem', color:'#64748b' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding:'4rem 1.5rem 3rem', background:'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'20%', right:'10%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div style={{ maxWidth:'1100px', margin:'0 auto', position:'relative', zIndex:2 }}>
          <div className="dash-hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'2rem', alignItems:'start' }}>
            <div>
              <div style={{ fontFamily:mono, fontSize:'9px', color:'#60a5fa', letterSpacing:'4px', marginBottom:'1rem' }}>// TANASIOM AEGIS SECURITY & COMPLIANCE — INTELLIGENCE HUB</div>
              <h1 style={{ fontFamily:display, fontSize:'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing:'3px', color:'#f0f6ff', lineHeight:0.9, marginBottom:'1rem' }}>
                THE CE<br /><span style={{ color:'#60a5fa' }}>INTELLIGENCE</span><br />HUB.
              </h1>
              <p style={{ fontFamily:serif, fontSize:'1.05rem', fontStyle:'italic', color:'rgba(224,236,255,0.65)', maxWidth:'520px', lineHeight:1.8, marginBottom:'1.5rem' }}>
                Live threat intelligence mapped to Cyber Essentials. UK sector risk data. Your certification journey — tracked in one place.
              </p>
              <div style={{ fontFamily:mono, fontSize:'0.75rem', color:'#b8d468', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', padding:'0.65rem 1rem', display:'inline-block', marginBottom:'2rem' }}>
                <span style={{ color:'rgba(224,236,255,0.4)' }}>operator@aegis:~$ </span>
                <Typewriter texts={['assess --ce --scope all','monitor --threat-feed --live','scan --cve --filter critical','report --ce-readiness --export']} speed={55} />
              </div>
              <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                <Link to="/framework" style={{ background:'#1d4ed8', color:'#fff', fontFamily:display, fontSize:'1rem', letterSpacing:'3px', padding:'0.85rem 2rem', textDecoration:'none', clipPath:'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))', transition:'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#1e40af'}
                  onMouseLeave={e => e.currentTarget.style.background='#1d4ed8'}
                >START FREE SELF-CHECK →</Link>
                <Link to="/contact" style={{ background:'transparent', color:'rgba(224,236,255,0.7)', fontFamily:mono, fontSize:'0.72rem', letterSpacing:'2px', padding:'0.85rem 1.5rem', border:'1px solid rgba(255,255,255,0.2)', textDecoration:'none', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'; e.currentTarget.style.color='#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'; e.currentTarget.style.color='rgba(224,236,255,0.7)' }}
                >BOOK GAP REVIEW — £397</Link>
              </div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <LiveClock />
              <div style={{ marginTop:'1.25rem', display:'flex', flexDirection:'column', gap:'0.5rem', alignItems:'flex-end' }}>
                {[
                  { label:'THREAT LEVEL',   val:'HIGH',   c:'#d97706' },
                  { label:'CISA KEV ACTIVE', val:'6',      c:'#dc2626' },
                  { label:'LAB STATUS',      val:'ACTIVE', c:'#16a34a' },
                  { label:'CE FRAMEWORK',    val:'LIVE',   c:'#16a34a' },
                ].map(s => (
                  <div key={s.label} style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                    <span style={{ fontFamily:mono, fontSize:'0.55rem', color:'rgba(224,236,255,0.4)', letterSpacing:'1px' }}>{s.label}</span>
                    <span style={{ fontFamily:mono, fontSize:'0.65rem', color:s.c, border:`1px solid ${s.c}40`, padding:'1px 8px', letterSpacing:'1px' }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={{ background:'#ffffff', borderBottom:'1px solid #dde3ec' }}>
        <div className="dash-kpi" style={{ maxWidth:'1100px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'1px', background:'#dde3ec' }}>
          {[
            { label:'CVEs Tracked',     val:10,    prefix:'',  suffix:'',  color:'#dc2626' },
            { label:'CISA KEV Active',  val:6,     prefix:'',  suffix:'',  color:'#dc2626' },
            { label:'Lab Findings',     val:21,    prefix:'',  suffix:'',  color:'#d97706' },
            { label:'CE Templates',     val:7,     prefix:'',  suffix:'',  color:'#1d4ed8' },
            { label:'UK SMEs At Risk',  val:43,    prefix:'',  suffix:'%', color:'#d97706' },
            { label:'Avg Breach Cost',  val:12000, prefix:'£', suffix:'+', color:'#dc2626' },
          ].map(k => (
            <div key={k.label} style={{ background:'#ffffff', padding:'1.25rem', textAlign:'center' }}>
              <div style={{ fontFamily:display, fontSize:'clamp(1.4rem,2.5vw,1.8rem)', color:k.color, lineHeight:1 }}>
                <Counter target={k.val} prefix={k.prefix} suffix={k.suffix} />
              </div>
              <div style={{ fontFamily:mono, fontSize:'0.5rem', color:'#94a3b8', letterSpacing:'1px', marginTop:'0.25rem' }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TAB NAV */}
      <div style={{ background:'#ffffff', borderBottom:'1px solid #dde3ec', position:'sticky', top:'56px', zIndex:50 }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', display:'flex', overflowX:'auto', scrollbarWidth:'none' }}>
          {[
            { id:'ce',       label:'CE TRACKER' },
            { id:'overview', label:'OVERVIEW' },
            { id:'threats',  label:'THREAT FEED' },
            { id:'sectors',  label:'SECTOR RISK' },
            { id:'labs',     label:'LAB INTEL' },
            { id:'network',  label:'NETWORK VIZ' },
            { id:'map',      label:'ATTACK MAP' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:mono, fontSize:'0.62rem', letterSpacing:'2px', padding:'0.85rem 1rem', whiteSpace:'nowrap', color: tab===t.id?'#dc2626':'#64748b', borderBottom:`2px solid ${tab===t.id?'#dc2626':'transparent'}`, transition:'all 0.15s' }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2.5rem 1.5rem' }}>

        {/* ── CE TRACKER (default tab) ── */}
        {tab === 'ce' && (
          <div>
            <div style={{ fontFamily:mono, fontSize:'9px', color:'#1d4ed8', letterSpacing:'3px', marginBottom:'1.75rem' }}>// YOUR CYBER ESSENTIALS CERTIFICATION JOURNEY</div>

            {/* JOURNEY STRIP */}
            <div style={{ background:'#ffffff', border:'1px solid #dde3ec', padding:'2rem', marginBottom:'2rem' }}>
              <div style={{ fontFamily:serif, fontSize:'1.1rem', fontStyle:'italic', color:'#475569', marginBottom:'1.5rem', maxWidth:'600px', lineHeight:1.7 }}>
                Most SMEs are somewhere in this journey without realising it. The question is whether you find the gaps before an assessor does.
              </div>
              <div style={{ display:'flex', alignItems:'flex-start', gap:0, overflowX:'auto', paddingBottom:'1rem' }}>
                {CERT_TIMELINE.map((step, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', flexShrink:0 }}>
                    <div style={{ textAlign:'center', width:'110px' }}>
                      <div style={{ width:40, height:40, borderRadius:'50%', border:`2px solid ${step.done?'#16a34a':i===CERT_TIMELINE.findIndex(s=>!s.done)?'#1d4ed8':'#dde3ec'}`, background: step.done?'#f0fdf4':i===CERT_TIMELINE.findIndex(s=>!s.done)?'#eff6ff':'transparent', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 0.65rem' }}>
                        {step.done
                          ? <span style={{ color:'#16a34a', fontSize:'1.1rem' }}>✓</span>
                          : <span style={{ fontFamily:mono, fontSize:'0.6rem', color: i===CERT_TIMELINE.findIndex(s=>!s.done)?'#1d4ed8':'#94a3b8' }}>{String(i+1).padStart(2,'0')}</span>
                        }
                      </div>
                      <div style={{ fontFamily:display, fontSize:'0.68rem', letterSpacing:'1px', color: step.done?'#16a34a':i===CERT_TIMELINE.findIndex(s=>!s.done)?'#0f172a':'#94a3b8', marginBottom:'0.25rem' }}>{step.step}</div>
                      <div style={{ fontFamily:mono, fontSize:'0.5rem', color:'#94a3b8', lineHeight:1.4, padding:'0 0.25rem' }}>{step.desc}</div>
                      {!step.done && i===CERT_TIMELINE.findIndex(s=>!s.done) && (
                        <Link to={step.link} style={{ display:'inline-block', marginTop:'0.5rem', fontFamily:mono, fontSize:'0.52rem', color:'#1d4ed8', border:'1px solid #bfdbfe', padding:'2px 6px', textDecoration:'none', background:'#eff6ff' }}>
                          NEXT STEP →
                        </Link>
                      )}
                    </div>
                    {i < CERT_TIMELINE.length - 1 && (
                      <div style={{ flex:1, height:'2px', background: step.done?'#16a34a':'#dde3ec', marginTop:'20px', minWidth:'20px', transition:'background 0.3s' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CE CONTROL CARDS */}
            <div style={{ fontFamily:mono, fontSize:'9px', color:'#64748b', letterSpacing:'3px', marginBottom:'1rem' }}>// CE PASS RATES ACROSS UK SMES — IASME/NCSC 2025</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1px', background:'#dde3ec', marginBottom:'2rem' }}>
              {CE_STATS.map(c => {
                const passColor = c.pass>=70?'#16a34a':c.pass>=50?'#d97706':'#dc2626'
                return (
                  <div key={c.control} style={{ background:'#ffffff', padding:'1.5rem', transition:'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f8faff'}
                    onMouseLeave={e => e.currentTarget.style.background='#ffffff'}
                  >
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem', alignItems:'center' }}>
                      <div style={{ fontFamily:display, fontSize:'0.8rem', letterSpacing:'1px', color:'#0f172a' }}>{c.control}</div>
                      <div style={{ fontFamily:display, fontSize:'1.2rem', color:passColor }}>{c.pass}%</div>
                    </div>
                    <div style={{ height:'6px', background:'#edf0f5', borderRadius:'3px', marginBottom:'0.75rem' }}>
                      <div style={{ height:'100%', background:passColor, borderRadius:'3px', width:`${c.pass}%` }} />
                    </div>
                    <div style={{ fontFamily:mono, fontSize:'0.52rem', color:'#94a3b8', marginBottom:'0.25rem' }}>Top failure:</div>
                    <div style={{ fontSize:'0.75rem', color:'#dc2626', lineHeight:1.4 }}>{c.topIssue}</div>
                    <div style={{ marginTop:'0.75rem', display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontFamily:mono, fontSize:'0.52rem', color:'#16a34a' }}>PASS {c.pass}%</span>
                      <span style={{ fontFamily:mono, fontSize:'0.52rem', color:'#dc2626' }}>FAIL {c.fail}%</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* RADAR + OFFICIAL LINKS */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem', marginBottom:'2rem' }}>
              <div style={{ background:'#ffffff', border:'1px solid #dde3ec', padding:'1.5rem' }}>
                <div style={{ fontFamily:mono, fontSize:'9px', color:'#1d4ed8', letterSpacing:'3px', marginBottom:'1rem' }}>// COMPLIANCE RADAR — UK SME AVERAGE</div>
                <div style={{ display:'flex', justifyContent:'center' }}>
                  <RadarChart size={220} data={CE_STATS.map(c => ({ label:c.control.split(' ')[0], value:c.pass }))} />
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div style={{ background:'#f0f7ff', border:'1px solid #bfdbfe', padding:'1.5rem' }}>
                  <div style={{ fontFamily:display, fontSize:'1.1rem', letterSpacing:'2px', color:'#0f172a', marginBottom:'0.5rem' }}>NOT SURE WHERE YOU STAND?</div>
                  <p style={{ fontSize:'0.83rem', color:'#64748b', lineHeight:1.7, marginBottom:'1rem' }}>The free self-check takes 15 minutes and maps your answers directly against the CE v3.3 requirements. You'll know exactly which of these control areas need attention before you speak to an assessor.</p>
                  <Link to="/framework" style={{ display:'block', textAlign:'center', background:'#1d4ed8', color:'#fff', fontFamily:display, fontSize:'0.95rem', letterSpacing:'3px', padding:'0.75rem', textDecoration:'none', transition:'all 0.2s', clipPath:'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                    onMouseEnter={e => e.currentTarget.style.background='#1e40af'}
                    onMouseLeave={e => e.currentTarget.style.background='#1d4ed8'}
                  >START FREE SELF-CHECK →</Link>
                </div>
                <div style={{ background:'#ffffff', border:'1px solid #dde3ec', padding:'1.5rem' }}>
                  <div style={{ fontFamily:display, fontSize:'1.1rem', letterSpacing:'2px', color:'#0f172a', marginBottom:'0.5rem' }}>GAP REVIEW — £397</div>
                  <p style={{ fontSize:'0.83rem', color:'#64748b', lineHeight:1.7, marginBottom:'1rem' }}>A human-led review of your specific environment. Clear report. Prioritised action plan. Delivered within 48 hours.</p>
                  <Link to="/contact" style={{ display:'block', textAlign:'center', background:'transparent', color:'#1d4ed8', fontFamily:display, fontSize:'0.95rem', letterSpacing:'3px', padding:'0.75rem', textDecoration:'none', border:'1px solid #bfdbfe', transition:'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#eff6ff'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >BOOK NOW →</Link>
                </div>
              </div>
            </div>

            {/* OFFICIAL RESOURCES */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'#dde3ec' }}>
              {[
                { label:'NCSC Cyber Essentials', url:'https://www.ncsc.gov.uk/cyberessentials/overview', desc:'Official UK Government CE scheme overview' },
                { label:'IASME Consortium', url:'https://iasme.co.uk', desc:'CE certification body — apply here' },
                { label:'IASME Fee Schedule', url:'https://iasme.co.uk/cyber-essentials/fees/', desc:'Current certification pricing by organisation size' },
              ].map(l => (
                <a key={l.label} href={l.url} target="_blank" rel="noreferrer" style={{ background:'#ffffff', padding:'1.25rem', textDecoration:'none', display:'block', transition:'all 0.2s', borderTop:'3px solid transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background='#f8faff'; e.currentTarget.style.borderTopColor='#1d4ed8' }}
                  onMouseLeave={e => { e.currentTarget.style.background='#ffffff'; e.currentTarget.style.borderTopColor='transparent' }}
                >
                  <div style={{ fontSize:'0.85rem', color:'#0f172a', fontWeight:600, marginBottom:'0.2rem' }}>{l.label} ↗</div>
                  <div style={{ fontSize:'0.75rem', color:'#64748b' }}>{l.desc}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem', marginBottom:'2rem' }}>
              {/* THREAT FEED PREVIEW */}
              <div style={{ background:'#ffffff', border:'1px solid #dde3ec', overflow:'hidden' }}>
                <div style={{ background:'#f8faff', borderBottom:'1px solid #dde3ec', padding:'0.85rem 1.25rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontFamily:mono, fontSize:'9px', color:'#dc2626', letterSpacing:'3px' }}>// ACTIVE THREAT FEED</div>
                  <span style={{ fontFamily:mono, fontSize:'0.55rem', color:'#dc2626' }}>● LIVE</span>
                </div>
                {THREAT_FEED.slice(0,5).map((item,i) => (
                  <div key={i} style={{ padding:'0.75rem 1.25rem', borderBottom:'1px solid #f1f5f9', transition:'background 0.2s', cursor:'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f8faff'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >
                    <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.25rem', alignItems:'center' }}>
                      <span style={{ fontFamily:mono, fontSize:'0.55rem', color:'#94a3b8' }}>{item.time}</span>
                      <span style={{ fontFamily:mono, fontSize:'0.5rem', color:item.color, border:`1px solid ${item.color}40`, padding:'1px 5px' }}>{item.sev}</span>
                      <span style={{ fontFamily:mono, fontSize:'0.5rem', color:'#1d4ed8', border:'1px solid #bfdbfe', padding:'1px 5px' }}>{item.source}</span>
                    </div>
                    <div style={{ fontSize:'0.75rem', color:'#64748b', lineHeight:1.5 }}>{item.msg}</div>
                  </div>
                ))}
                <div style={{ padding:'0.75rem 1.25rem', borderTop:'1px solid #dde3ec' }}>
                  <button onClick={() => setTab('threats')} style={{ width:'100%', textAlign:'center', background:'transparent', border:'1px solid #dde3ec', color:'#64748b', fontFamily:mono, fontSize:'0.65rem', padding:'0.5rem', cursor:'pointer', transition:'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='#1d4ed8'; e.currentTarget.style.color='#1d4ed8' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='#dde3ec'; e.currentTarget.style.color='#64748b' }}
                  >VIEW ALL {THREAT_FEED.length} ALERTS →</button>
                </div>
              </div>

              {/* CE RADAR */}
              <div style={{ background:'#ffffff', border:'1px solid #dde3ec' }}>
                <div style={{ background:'#f8faff', borderBottom:'1px solid #dde3ec', padding:'0.85rem 1.25rem' }}>
                  <div style={{ fontFamily:mono, fontSize:'9px', color:'#1d4ed8', letterSpacing:'3px' }}>// UK SME CE COMPLIANCE RADAR</div>
                </div>
                <div style={{ padding:'1.5rem', display:'flex', justifyContent:'center' }}>
                  <RadarChart size={220} data={CE_STATS.map(c => ({ label:c.control.split(' ')[0], value:c.pass }))} />
                </div>
                <div style={{ padding:'0 1.25rem 1.25rem', fontFamily:mono, fontSize:'0.6rem', color:'#94a3b8', textAlign:'center' }}>
                  Average CE pass rates across UK SMEs — Source: IASME/NCSC 2025
                </div>
              </div>
            </div>

            {/* LAB SUMMARY + HEAT MAP */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }}>
              <div style={{ background:'#ffffff', border:'1px solid #dde3ec' }}>
                <div style={{ background:'#f8faff', borderBottom:'1px solid #dde3ec', padding:'0.85rem 1.25rem' }}>
                  <div style={{ fontFamily:mono, fontSize:'9px', color:'#dc2626', letterSpacing:'3px' }}>// LAB ENGAGEMENT SUMMARY</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'1px', background:'#dde3ec' }}>
                  {LAB_SUMMARY.map(lab => (
                    <div key={lab.id} style={{ background:'#ffffff', padding:'0.85rem 1.25rem', display:'flex', alignItems:'center', gap:'1rem', transition:'background 0.2s', cursor:'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background='#f8faff'}
                      onMouseLeave={e => e.currentTarget.style.background='#ffffff'}
                    >
                      <div style={{ fontFamily:mono, fontSize:'0.6rem', color:'#94a3b8', flexShrink:0, minWidth:'50px' }}>{lab.id}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:'0.78rem', color:'#0f172a', fontWeight:600 }}>{lab.name}</div>
                        <div style={{ fontFamily:mono, fontSize:'0.55rem', color:lab.color, marginTop:'0.15rem' }}>{lab.status}</div>
                      </div>
                      <div style={{ display:'flex', gap:'0.75rem', flexShrink:0 }}>
                        {[['FINDINGS',lab.findings,lab.color],['CRITICAL',lab.critical,'#dc2626'],['CVSS',lab.cvss,'#dc2626']].map(([l,v,c]) => (
                          <div key={l} style={{ textAlign:'center' }}>
                            <div style={{ fontFamily:display, fontSize:'1rem', color:c }}>{v}</div>
                            <div style={{ fontFamily:mono, fontSize:'0.48rem', color:'#94a3b8' }}>{l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding:'0.75rem 1.25rem', borderTop:'1px solid #dde3ec' }}>
                  <Link to="/lab" style={{ display:'block', textAlign:'center', background:'transparent', border:'1px solid #dde3ec', color:'#64748b', fontFamily:mono, fontSize:'0.65rem', padding:'0.5rem', textDecoration:'none', transition:'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='#dc2626'; e.currentTarget.style.color='#dc2626' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='#dde3ec'; e.currentTarget.style.color='#64748b' }}
                  >VIEW FULL LAB →</Link>
                </div>
              </div>

              <div style={{ background:'#ffffff', border:'1px solid #dde3ec' }}>
                <div style={{ background:'#f8faff', borderBottom:'1px solid #dde3ec', padding:'0.85rem 1.25rem' }}>
                  <div style={{ fontFamily:mono, fontSize:'9px', color:'#dc2626', letterSpacing:'3px' }}>// LAB-01 SERVICE RISK HEAT MAP</div>
                </div>
                <div style={{ padding:'1.25rem' }}>
                  <RiskHeatMap />
                  <div style={{ marginTop:'1rem', display:'flex', gap:'0.5rem', justifyContent:'center', flexWrap:'wrap' }}>
                    {[['90+','CRITICAL','#dc2626'],['75-89','HIGH','#d97706'],['50-74','MEDIUM','#2563eb'],['<50','LOW','#16a34a']].map(([range,label,c]) => (
                      <div key={label} style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
                        <div style={{ width:8, height:8, borderRadius:'2px', background:c }} />
                        <span style={{ fontFamily:mono, fontSize:'0.55rem', color:'#94a3b8' }}>{range} {label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── THREAT FEED ── */}
        {tab === 'threats' && (
          <div>
            <div style={{ fontFamily:mono, fontSize:'9px', color:'#dc2626', letterSpacing:'3px', marginBottom:'1.5rem' }}>// LIVE THREAT INTELLIGENCE — NCSC · CISA · IASME · ICO</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'#dde3ec', marginBottom:'2rem' }}>
              {[['CRITICAL',THREAT_FEED.filter(t=>t.sev==='CRITICAL').length,'#dc2626'],['HIGH',THREAT_FEED.filter(t=>t.sev==='HIGH').length,'#d97706'],['MEDIUM',THREAT_FEED.filter(t=>t.sev==='MEDIUM').length,'#2563eb']].map(([sev,count,c]) => (
                <div key={sev} style={{ background:'#ffffff', padding:'1.25rem', textAlign:'center' }}>
                  <div style={{ fontFamily:display, fontSize:'2rem', color:c }}>{count}</div>
                  <div style={{ fontFamily:mono, fontSize:'0.6rem', color:c, letterSpacing:'2px', marginTop:'0.2rem' }}>{sev}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'1px', background:'#dde3ec', marginBottom:'2rem' }}>
              {THREAT_FEED.map((item,i) => (
                <div key={i} style={{ background: activeFeed===i?'#f8faff':'#ffffff', padding:'1.25rem 1.5rem', cursor:'pointer', transition:'background 0.2s', borderLeft:`3px solid ${activeFeed===i?sevColor(item.sev):'transparent'}` }}
                  onClick={() => setActiveFeed(activeFeed===i?null:i)}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.4rem', flexWrap:'wrap' }}>
                    <span style={{ fontFamily:mono, fontSize:'0.62rem', color:'#94a3b8' }}>{item.time}</span>
                    <span style={{ fontFamily:mono, fontSize:'0.55rem', color:item.color, border:`1px solid ${item.color}40`, padding:'1px 7px' }}>{item.sev}</span>
                    <span style={{ fontFamily:mono, fontSize:'0.55rem', color:'#1d4ed8', border:'1px solid #bfdbfe', padding:'1px 7px' }}>{item.source}</span>
                  </div>
                  <div style={{ fontSize:'0.83rem', color: activeFeed===i?'#0f172a':'#64748b', lineHeight:1.65 }}>{item.msg}</div>
                  {activeFeed===i && (
                    <div style={{ marginTop:'1rem', padding:'0.85rem', background:'#f0f7ff', border:'1px solid #bfdbfe', fontFamily:mono, fontSize:'0.65rem', color:'#64748b', lineHeight:1.7 }}>
                      <div style={{ color:item.color, marginBottom:'0.35rem' }}>// RECOMMENDED ACTION</div>
                      {item.sev==='CRITICAL' && 'IMMEDIATE: Apply relevant patches, check CISA KEV, restrict access, verify no compromise indicators.'}
                      {item.sev==='HIGH' && 'URGENT: Review affected systems within 24 hours. Apply available patches. Enable monitoring for indicators of compromise.'}
                      {item.sev==='MEDIUM' && 'MONITOR: Review within 7 days. Check vendor advisories. Update configurations as recommended.'}
                      <div style={{ marginTop:'0.75rem', display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                        <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog" target="_blank" rel="noreferrer" style={{ color:'#1d4ed8', textDecoration:'none', fontSize:'0.6rem' }}>CISA KEV ↗</a>
                        <a href="https://www.ncsc.gov.uk" target="_blank" rel="noreferrer" style={{ color:'#1d4ed8', textDecoration:'none', fontSize:'0.6rem' }}>NCSC.GOV.UK ↗</a>
                        <Link to="/vulnerabilities" style={{ color:'#1d4ed8', textDecoration:'none', fontSize:'0.6rem' }}>VULN DATABASE ↗</Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTOR RISK ── */}
        {tab === 'sectors' && (
          <div>
            <div style={{ fontFamily:mono, fontSize:'9px', color:'#1d4ed8', letterSpacing:'3px', marginBottom:'0.5rem' }}>// UK SECTOR CYBER RISK INDEX — 2025/2026</div>
            <p style={{ fontFamily:serif, fontSize:'1rem', fontStyle:'italic', color:'#64748b', marginBottom:'1.75rem', maxWidth:'640px', lineHeight:1.7 }}>
              Risk scores are based on reported incident frequency, known vulnerability exposure, and CE certification rates within each sector. Click your sector to see what it means for your CE journey.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'2rem', marginBottom:'2rem' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'1px', background:'#dde3ec' }}>
                {UK_SECTORS.map((s,i) => {
                  const c = s.risk>=85?'#dc2626':s.risk>=70?'#d97706':'#2563eb'
                  const isActive = activeSector === s.sector
                  return (
                    <div key={s.sector} style={{ background: isActive?'#f0f7ff':'#ffffff', padding:'1rem 1.5rem', transition:'background 0.2s', cursor:'pointer', borderLeft:`3px solid ${isActive?c:'transparent'}` }}
                      onClick={() => setActiveSector(activeSector===s.sector?null:s.sector)}
                    >
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.4rem', alignItems:'center' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                          <span style={{ fontFamily:mono, fontSize:'0.55rem', color:'#94a3b8' }}>#{i+1}</span>
                          <span style={{ fontSize:'0.88rem', color:'#0f172a', fontWeight:600 }}>{s.sector}</span>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                          <span style={{ fontFamily:mono, fontSize:'0.6rem', color:'#d97706' }}>{s.trend}</span>
                          <span style={{ fontFamily:display, fontSize:'1.1rem', color:c }}>{s.risk}</span>
                        </div>
                      </div>
                      <div style={{ height:'5px', background:'#edf0f5', borderRadius:'3px', overflow:'hidden', marginBottom:'0.3rem' }}>
                        <div style={{ height:'100%', background:c, borderRadius:'3px', width:`${s.risk}%` }} />
                      </div>
                      <div style={{ fontFamily:mono, fontSize:'0.55rem', color:'#94a3b8' }}>{s.incidents} incidents reported this year</div>
                      {isActive && (
                        <div style={{ marginTop:'1rem', padding:'1rem', background:'#ffffff', border:'1px solid #bfdbfe' }}>
                          <div style={{ fontFamily:mono, fontSize:'0.6rem', color:'#1d4ed8', letterSpacing:'2px', marginBottom:'0.5rem' }}>WHAT THIS MEANS FOR YOUR BUSINESS</div>
                          <p style={{ fontSize:'0.8rem', color:'#334155', lineHeight:1.7, marginBottom:'0.75rem' }}>
                            {s.sector} is currently ranked #{i+1} in the UK Sector Cyber Risk Index with a risk score of {s.risk}/100. With {s.incidents} incidents reported this year and a {s.trend} year-on-year increase, this sector is seeing elevated attacker interest.
                          </p>
                          <p style={{ fontSize:'0.8rem', color:'#334155', lineHeight:1.7, marginBottom:'1rem' }}>
                            Cyber Essentials certification reduces your exposure to the most common attack vectors. Most {s.sector.toLowerCase()} SMEs fail CE first-time on User Access Control and Update Management.
                          </p>
                          <Link to="/contact" style={{ fontFamily:mono, fontSize:'0.65rem', color:'#1d4ed8', border:'1px solid #bfdbfe', padding:'0.4rem 0.85rem', textDecoration:'none', background:'#eff6ff' }}>
                            BOOK A GAP REVIEW →
                          </Link>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div style={{ background:'#ffffff', border:'1px solid #dde3ec', padding:'1.5rem' }}>
                  <div style={{ fontFamily:mono, fontSize:'9px', color:'#dc2626', letterSpacing:'3px', marginBottom:'1rem' }}>// UK BREACH STATISTICS 2025</div>
                  {[
                    { label:'Businesses experienced a breach', val:'50%', c:'#dc2626' },
                    { label:'SMEs targeted specifically', val:'43%', c:'#d97706' },
                    { label:'Had a formal incident response plan', val:'22%', c:'#d97706' },
                    { label:'Were CE certified', val:'18%', c:'#1d4ed8' },
                    { label:'Paid a ransomware demand', val:'39%', c:'#dc2626' },
                  ].map(s => (
                    <div key={s.label} style={{ display:'flex', justifyContent:'space-between', padding:'0.45rem 0', borderBottom:'1px solid #f1f5f9', gap:'1rem', alignItems:'center' }}>
                      <span style={{ fontSize:'0.75rem', color:'#64748b', lineHeight:1.4 }}>{s.label}</span>
                      <span style={{ fontFamily:display, fontSize:'1rem', color:s.c, flexShrink:0 }}>{s.val}</span>
                    </div>
                  ))}
                  <div style={{ marginTop:'0.75rem', fontFamily:mono, fontSize:'0.55rem', color:'#94a3b8' }}>Source: DSIT Cyber Breach Survey 2025</div>
                </div>

                <div style={{ background:'#f0f7ff', border:'1px solid #bfdbfe', padding:'1.5rem' }}>
                  <div style={{ fontFamily:display, fontSize:'1rem', letterSpacing:'2px', color:'#0f172a', marginBottom:'0.5rem' }}>IS YOUR SECTOR AT RISK?</div>
                  <p style={{ fontSize:'0.8rem', color:'#64748b', lineHeight:1.7, marginBottom:'1rem' }}>Click any sector in the table to see what the risk data means for your specific business and Cyber Essentials journey.</p>
                  <Link to="/framework" style={{ display:'block', textAlign:'center', background:'#1d4ed8', color:'#fff', fontFamily:display, fontSize:'0.9rem', letterSpacing:'3px', padding:'0.65rem', textDecoration:'none', transition:'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#1e40af'}
                    onMouseLeave={e => e.currentTarget.style.background='#1d4ed8'}
                  >START FREE SELF-CHECK →</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── LAB INTEL ── */}
        {tab === 'labs' && (
          <div>
            <div style={{ fontFamily:mono, fontSize:'9px', color:'#dc2626', letterSpacing:'3px', marginBottom:'1.5rem' }}>// LAB ENGAGEMENT INTELLIGENCE</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'1px', background:'#dde3ec', marginBottom:'2rem' }}>
              {LAB_SUMMARY.map(lab => (
                <div key={lab.id} style={{ background:'#ffffff', padding:'1.5rem', transition:'all 0.2s', borderTop:'3px solid transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background='#f8faff'; e.currentTarget.style.borderTopColor=lab.color }}
                  onMouseLeave={e => { e.currentTarget.style.background='#ffffff'; e.currentTarget.style.borderTopColor='transparent' }}
                >
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem' }}>
                    <span style={{ fontFamily:mono, fontSize:'0.6rem', color:'#94a3b8' }}>{lab.id}</span>
                    <span style={{ fontFamily:mono, fontSize:'0.55rem', color:lab.color, border:`1px solid ${lab.color}40`, padding:'1px 6px' }}>{lab.status}</span>
                  </div>
                  <div style={{ fontFamily:display, fontSize:'1.1rem', letterSpacing:'1px', color:'#0f172a', marginBottom:'1rem' }}>{lab.name}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.5rem' }}>
                    {[['FINDINGS',lab.findings,lab.color],['CRITICAL',lab.critical,'#dc2626'],['CVSS',lab.cvss,'#dc2626']].map(([l,v,c]) => (
                      <div key={l} style={{ background:'#f8faff', padding:'0.65rem', textAlign:'center', border:'1px solid #dde3ec' }}>
                        <div style={{ fontFamily:display, fontSize:'1.2rem', color:c, lineHeight:1 }}>{v}</div>
                        <div style={{ fontFamily:mono, fontSize:'0.48rem', color:'#94a3b8', marginTop:'0.2rem' }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center' }}>
              <Link to="/lab" style={{ background:'#dc2626', color:'#fff', fontFamily:display, fontSize:'1rem', letterSpacing:'3px', padding:'1rem 2.5rem', textDecoration:'none', clipPath:'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))', transition:'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='#b91c1c'}
                onMouseLeave={e => e.currentTarget.style.background='#dc2626'}
              >VIEW FULL LAB DOCUMENTATION →</Link>
            </div>
          </div>
        )}

        {/* ── NETWORK VIZ ── */}
        {tab === 'network' && (
          <div>
            <div style={{ fontFamily:mono, fontSize:'9px', color:'#dc2626', letterSpacing:'3px', marginBottom:'1.5rem' }}>// LIVE NETWORK TRAFFIC VISUALISATION — LAB-01</div>
            <div style={{ background:'#ffffff', border:'1px solid #dde3ec', overflow:'hidden', marginBottom:'2rem' }}>
              <div style={{ background:'#0f172a', borderBottom:'1px solid #1e293b', padding:'0.75rem 1.25rem', display:'flex', justifyContent:'space-between' }}>
                <div style={{ fontFamily:mono, fontSize:'0.62rem', color:'#b8d468' }}>
                  <span style={{ color:'#f87171' }}>root@kali</span><span style={{ color:'#64748b' }}>:~# </span>
                  tcpdump -i eth1 -n 'port 21 or port 445 or port 1524 or port 3306'
                </div>
                <span style={{ fontFamily:mono, fontSize:'0.55rem', color:'#10b981' }}>● CAPTURING</span>
              </div>
              <NetworkPackets />
              <div style={{ background:'#0f172a', padding:'0.75rem 1.25rem', fontFamily:mono, fontSize:'0.62rem', color:'#64748b', lineHeight:1.8, borderTop:'1px solid #1e293b' }}>
                {[
                  '09:47:22.341 IP 192.168.56.103.49821 > 192.168.56.105.21: Flags [S], seq 0',
                  '09:47:22.342 IP 192.168.56.105.21 > 192.168.56.103.49821: Flags [S.], 220 (vsFTPd 2.3.4)',
                  '09:47:22.401 IP 192.168.56.103.49821 > 192.168.56.105.21: USER backdoor:)',
                  '09:47:22.891 IP 192.168.56.103.49900 > 192.168.56.105.6200: Flags [S] <-- BACKDOOR TRIGGERED',
                  '09:47:22.892 IP 192.168.56.105.6200 > 192.168.56.103.49900: Flags [S.] uid=0(root)',
                ].map((line,i) => (
                  <div key={i} style={{ color: line.includes('BACKDOOR')||line.includes('uid=0') ? '#10b981' : line.includes('backdoor') ? '#f87171' : '#64748b' }}>{line}</div>
                ))}
              </div>
            </div>

            <div style={{ background:'#ffffff', border:'1px solid #dde3ec', padding:'2rem' }}>
              <div style={{ fontFamily:mono, fontSize:'9px', color:'#dc2626', letterSpacing:'3px', marginBottom:'1.5rem' }}>// LAB-01 NETWORK TOPOLOGY — 192.168.56.0/24</div>
              <svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%' }}>
                <rect x="250" y="110" width="200" height="40" rx="3" fill="#f8faff" stroke="#dde3ec" strokeWidth="1.5"/>
                <text x="350" y="126" textAnchor="middle" fill="#0f172a" fontFamily="monospace" fontSize="9" fontWeight="600">HOST-ONLY SWITCH</text>
                <text x="350" y="140" textAnchor="middle" fill="#94a3b8" fontFamily="monospace" fontSize="8">192.168.56.0/24</text>
                <line x1="350" y1="110" x2="350" y2="50" stroke="#dde3ec" strokeWidth="1" strokeDasharray="4,3"/>
                <line x1="295" y1="150" x2="120" y2="220" stroke="#dde3ec" strokeWidth="1" strokeDasharray="4,3"/>
                <line x1="350" y1="150" x2="350" y2="220" stroke="#dde3ec" strokeWidth="1" strokeDasharray="4,3"/>
                <line x1="405" y1="150" x2="580" y2="220" stroke="#dde3ec" strokeWidth="1" strokeDasharray="4,3"/>
                <rect x="275" y="15" width="150" height="42" rx="2" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5"/>
                <text x="350" y="32" textAnchor="middle" fill="#dc2626" fontFamily="monospace" fontSize="9" fontWeight="700">KALI LINUX</text>
                <text x="350" y="45" textAnchor="middle" fill="#ef4444" fontFamily="monospace" fontSize="8">.103 · ATTACKER</text>
                <rect x="45" y="220" width="150" height="42" rx="2" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.5"/>
                <text x="120" y="237" textAnchor="middle" fill="#2563eb" fontFamily="monospace" fontSize="9" fontWeight="700">WINDOWS 10</text>
                <text x="120" y="250" textAnchor="middle" fill="#3b82f6" fontFamily="monospace" fontSize="8">.102 · WORKSTATION</text>
                <rect x="275" y="220" width="150" height="42" rx="2" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5"/>
                <text x="350" y="237" textAnchor="middle" fill="#d97706" fontFamily="monospace" fontSize="9" fontWeight="700">UBUNTU SERVER</text>
                <text x="350" y="250" textAnchor="middle" fill="#b45309" fontFamily="monospace" fontSize="8">.104 · WEB+DVWA</text>
                <rect x="505" y="220" width="150" height="42" rx="2" fill="#faf5ff" stroke="#7c3aed" strokeWidth="1.5"/>
                <text x="580" y="237" textAnchor="middle" fill="#7c3aed" fontFamily="monospace" fontSize="9" fontWeight="700">METASPLOITABLE 2</text>
                <text x="580" y="250" textAnchor="middle" fill="#7c3aed" fontFamily="monospace" fontSize="8">.105 · TARGET</text>
              </svg>
            </div>
          </div>
        )}

        {/* ── ATTACK MAP ── */}
        {tab === 'map' && (
          <div>
            <div style={{ fontFamily:mono, fontSize:'9px', color:'#dc2626', letterSpacing:'3px', marginBottom:'1.5rem' }}>// LIVE GLOBAL CYBERATTACK MAP — KASPERSKY CYBERTHREAT INTELLIGENCE</div>
            <div style={{ background:'#ffffff', border:'1px solid #dde3ec', overflow:'hidden', marginBottom:'1.5rem' }}>
              <div style={{ background:'#f8faff', borderBottom:'1px solid #dde3ec', padding:'0.85rem 1.25rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#dc2626', display:'inline-block' }} />
                  <span style={{ fontFamily:mono, fontSize:'0.65rem', color:'#64748b' }}>LIVE — REAL-TIME CYBERATTACK VISUALISATION</span>
                </div>
                <a href="https://cybermap.kaspersky.com" target="_blank" rel="noreferrer" style={{ fontFamily:mono, fontSize:'0.6rem', color:'#1d4ed8', textDecoration:'none' }}>FULL SCREEN ↗</a>
              </div>
              <iframe src="https://cybermap.kaspersky.com/en/widget/dynamic/dark" style={{ width:'100%', height:'520px', border:'none', display:'block' }} title="Kaspersky Cyber Threat Map" loading="lazy" />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:'#dde3ec' }}>
              {[
                { label:'NCSC Threat Reports', url:'https://www.ncsc.gov.uk/section/about-this-website/ncsc-threat-reports' },
                { label:'CISA KEV Catalog', url:'https://www.cisa.gov/known-exploited-vulnerabilities-catalog' },
                { label:'Checkpoint ThreatCloud', url:'https://threatmap.checkpoint.com' },
                { label:'Fortinet Threat Map', url:'https://threatmap.fortiguard.com' },
              ].map(l => (
                <a key={l.label} href={l.url} target="_blank" rel="noreferrer" style={{ background:'#ffffff', padding:'1rem', textAlign:'center', display:'block', textDecoration:'none', fontFamily:mono, fontSize:'0.62rem', color:'#64748b', transition:'all 0.2s', borderTop:'2px solid transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background='#f8faff'; e.currentTarget.style.borderTopColor='#1d4ed8'; e.currentTarget.style.color='#1d4ed8' }}
                  onMouseLeave={e => { e.currentTarget.style.background='#ffffff'; e.currentTarget.style.borderTopColor='transparent'; e.currentTarget.style.color='#64748b' }}
                >{l.label} ↗</a>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div style={{ borderTop:'1px solid #dde3ec', padding:'1.5rem 1.5rem', textAlign:'center', background:'#ffffff' }}>
        <div style={{ fontFamily:mono, fontSize:'0.58rem', color:'#94a3b8', letterSpacing:'2px' }}>
          TANASIOM AEGIS INTELLIGENCE HUB · DATA: NCSC · CISA · IASME · DSIT BREACH SURVEY 2025 · KASPERSKY · ICO
        </div>
      </div>
    </div>
  )
}
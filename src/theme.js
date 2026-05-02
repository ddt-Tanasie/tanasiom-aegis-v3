// ═══════════════════════════════════════════════
// TANASIOM AEGIS — CENTRALISED DESIGN SYSTEM
// ═══════════════════════════════════════════════

export const colors = {
  // BACKGROUNDS
  bg:           '#050810',   // deep navy black
  bgAlt:        '#080c14',   // slightly lighter
  surface:      '#0d1117',   // card/panel bg
  surface2:     '#111820',   // elevated surface
  surfaceGlass: 'rgba(13,17,23,0.8)',

  // BORDERS
  border:       '#1e2a3a',
  borderLight:  '#152030',
  borderGlow:   'rgba(29,78,216,0.3)',

  // OLIVE ACCENTS
  olive:        '#8a9e5a',
  oliveBright:  '#b8d468',
  oliveDim:     '#4a5a2a',
  oliveFaint:   'rgba(138,158,90,0.08)',

  // BLUE ACCENTS
  blue:         '#1d4ed8',
  blueBright:   '#3b82f6',
  blueGlow:     'rgba(29,78,216,0.15)',
  blueFaint:    'rgba(59,130,246,0.06)',

  // RED ACCENTS
  red:          '#c0392b',
  redBright:    '#e74c3c',
  redDim:       '#7a1f16',
  redFaint:     'rgba(192,57,43,0.08)',

  // TEXT
  textBright:   '#e8f0ff',
  text:         '#c8d4e8',
  textDim:      '#6a7a9a',
  textGhost:    '#2a3a5a',

  // SPECIAL
  chrome:       'linear-gradient(90deg, #c8d4e8 0%, #ffffff 25%, #b8d468 45%, #3b82f6 65%, #ffffff 80%, #c8d4e8 100%)',
}

export const fonts = {
  display: "'Bebas Neue', sans-serif",
  serif:   "'Cormorant Garamond', serif",
  body:    "'Barlow Condensed', sans-serif",
  mono:    "'Share Tech Mono', monospace",
}

export const fx = {
  // GLASS MORPHISM
  glass: `
    background: rgba(13,17,23,0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(29,78,216,0.15);
  `,

  // LIQUID BLOBS
  blobOlive: `
    border-radius: 50%;
    background: radial-gradient(circle, rgba(138,158,90,0.12) 0%, transparent 70%);
    filter: blur(80px);
    pointer-events: none;
    animation: floatBlob1 14s ease-in-out infinite;
  `,
  blobBlue: `
    border-radius: 50%;
    background: radial-gradient(circle, rgba(29,78,216,0.1) 0%, transparent 70%);
    filter: blur(100px);
    pointer-events: none;
    animation: floatBlob2 18s ease-in-out infinite;
  `,
  blobRed: `
    border-radius: 50%;
    background: radial-gradient(circle, rgba(192,57,43,0.07) 0%, transparent 70%);
    filter: blur(80px);
    pointer-events: none;
    animation: floatBlob3 12s ease-in-out infinite;
  `,
}

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    background: #050810;
    color: #c8d4e8;
    font-family: 'Barlow Condensed', sans-serif;
    overflow-x: hidden;
    line-height: 1.6;
  }

  
  /* GRAIN TEXTURE */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9998;
  }

  /* LIQUID BLOB ANIMATIONS */
  @keyframes floatBlob1 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(50px,-40px) scale(1.06); }
    66%      { transform: translate(-30px,30px) scale(0.96); }
  }
  @keyframes floatBlob2 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(-60px,40px) scale(1.08); }
    66%      { transform: translate(40px,-50px) scale(0.94); }
  }
  @keyframes floatBlob3 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(30px,40px) scale(1.07); }
  }

  /* CHROME TEXT */
  @keyframes shimmer {
    0%   { background-position: -400% center; }
    100% { background-position: 400% center; }
  }
  .chrome-text {
    background: linear-gradient(90deg,
      #c8d4e8 0%, #ffffff 20%,
      #b8d468 38%, #3b82f6 55%,
      #ffffff 72%, #c8d4e8 100%
    );
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 6s linear infinite;
  }

  /* GLITCH */
  @keyframes glitchShift {
    0%  { transform: translate(0) skew(0deg); }
    20% { transform: translate(-3px,1px) skew(0.8deg); }
    40% { transform: translate(3px,-1px) skew(-0.8deg); }
    60% { transform: translate(-2px,1px); }
    80% { transform: translate(2px,-1px); }
    100%{ transform: translate(0) skew(0deg); }
  }

  /* PULSE */
  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.4; transform:scale(.8); }
  }

  /* BLINK */
  @keyframes blink {
    0%,100% { opacity:1; } 50% { opacity:0.5; }
  }

  /* FADE UP */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* SCAN SWEEP */
  @keyframes scanMove {
    0%   { top: -5%; }
    100% { top: 110%; }
  }

  /* BORDER GLOW */
  @keyframes borderGlow {
    0%,100% { box-shadow: 0 0 0px rgba(59,130,246,0); }
    50%      { box-shadow: 0 0 24px rgba(59,130,246,0.2); }
  }

  /* MILITARY GRID BG */
  .mil-grid {
    background-image:
      repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(30,42,58,0.3) 80px, rgba(30,42,58,0.3) 81px),
      repeating-linear-gradient(0deg,  transparent, transparent 80px, rgba(30,42,58,0.3) 80px, rgba(30,42,58,0.3) 81px);
  }

  /* DIAGONAL CUTS */
  .cut-bottom { clip-path: polygon(0 0, 100% 0, 100% calc(100% - 48px), 0 100%); }
  .cut-top    { clip-path: polygon(0 48px, 100% 0, 100% 100%, 0 100%); margin-top: -48px; }

  /* GLASS CARD */
  .glass {
    background: rgba(13,17,23,0.75);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(29,78,216,0.15);
  }

  /* BUTTONS */
  .btn-red {
    background: #c0392b;
    color: #fff;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    letter-spacing: 3px;
    padding: 0.85rem 2.25rem;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: all 0.2s;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }
  .btn-red:hover {
    background: #a93226;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(192,57,43,0.4);
  }

  .btn-blue {
    background: #1d4ed8;
    color: #fff;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    letter-spacing: 3px;
    padding: 0.85rem 2.25rem;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: all 0.2s;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }
  .btn-blue:hover {
    background: #1e40af;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(29,78,216,0.4);
  }

  .btn-ghost {
    background: transparent;
    color: #c8d4e8;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 2px;
    padding: 0.85rem 1.75rem;
    border: 1px solid #1e2a3a;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: all 0.2s;
  }
  .btn-ghost:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    box-shadow: 0 0 16px rgba(59,130,246,0.15);
  }

  /* CARD HOVER */
  .card-hover {
    transition: all 0.3s;
    border: 1px solid #1e2a3a;
  }
  .card-hover:hover {
    border-color: #1d4ed8;
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(29,78,216,0.12);
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #050810; }
  ::-webkit-scrollbar-thumb { background: #1e2a3a; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #1d4ed8; }
`

export const siteInfo = {
  name:       'Tanasiom Aegis',
  tagline:    'Cyber Essentials Readiness — UK SME Specialists',
  github:     'https://github.com/ddt-Tanasie/Tanasiom-Aegis-CE-Readiness-Framework',
  price:      '£397',
  slots:      '5',
  student:    'Dumitru Tanasie',
  studentId:  '22041369',
  course:     'BSc Computer Networking & Cyber Security',
  uni:        'London Metropolitan University',
  module:     'CS6P05',
  supervisor: 'Dr Subeksha Shrestha',
}
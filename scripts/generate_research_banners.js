const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const groups = [
  {
    id: 'data-academic-studies',
    name: 'Data and Academic Studies',
    fontSize: '52px',
    kicker: 'Empirical Research & Econometrics',
    desc: 'Econometric modeling, quantitative methodology, statistical analysis, and evidence-based academic research.',
    accent: '#6366f1',
    accentLight: '#818cf8',
    glow: 'rgba(99, 102, 241, 0.28)',
    secondaryGlow: 'rgba(14, 165, 233, 0.2)',
    gradient: 'linear-gradient(145deg, #050b1a 0%, #0d1636 50%, #060e24 100%)',
    pillBg: 'rgba(99, 102, 241, 0.16)',
    pillBorder: 'rgba(129, 140, 248, 0.45)',
    svgArt: `
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <path d="M20 200 Q 120 130, 200 170 T 380 40" stroke="rgba(99,102,241,0.3)" stroke-width="2.5" fill="none" stroke-dasharray="4 4"/>
        <path d="M20 220 Q 150 100, 240 140 T 380 70" stroke="rgba(14,165,233,0.35)" stroke-width="2" fill="none"/>
        <circle cx="120" cy="130" r="4" fill="#818cf8"/>
        <circle cx="200" cy="170" r="5" fill="#38bdf8"/>
        <circle cx="280" cy="95" r="4" fill="#818cf8"/>
        <circle cx="380" cy="40" r="6" fill="#6366f1"/>
        <line x1="20" y1="225" x2="380" y2="225" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      </svg>
    `
  },
  {
    id: 'sustainable-economics',
    name: 'Sustainable Economics',
    fontSize: '56px',
    kicker: 'Circular Economy & Climate Policy',
    desc: 'Circular economy frameworks, ESG metrics, climate mitigation finance, and sustainable growth paradigms.',
    accent: '#10b981',
    accentLight: '#34d399',
    glow: 'rgba(16, 185, 129, 0.28)',
    secondaryGlow: 'rgba(6, 182, 212, 0.18)',
    gradient: 'linear-gradient(145deg, #040f12 0%, #092324 50%, #05151a 100%)',
    pillBg: 'rgba(16, 185, 129, 0.16)',
    pillBorder: 'rgba(52, 211, 153, 0.45)',
    svgArt: `
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <circle cx="270" cy="120" r="95" stroke="rgba(16,185,129,0.22)" stroke-width="1.5"/>
        <circle cx="270" cy="120" r="68" stroke="rgba(52,211,153,0.28)" stroke-width="2" stroke-dasharray="5 5"/>
        <circle cx="270" cy="120" r="40" stroke="rgba(6,182,212,0.22)" stroke-width="1.5"/>
        <circle cx="338" cy="120" r="4" fill="#34d399"/>
      </svg>
    `
  },
  {
    id: 'artificial-intelligence-economies',
    name: 'Artificial Intelligence Economies',
    fontSize: '48px',
    kicker: 'Technology Frontiers & Automation',
    desc: 'AI-driven productivity shifts, labor market disruption, algorithmic finance, and high-tech capital dynamics.',
    accent: '#0ea5e9',
    accentLight: '#38bdf8',
    glow: 'rgba(14, 165, 233, 0.3)',
    secondaryGlow: 'rgba(99, 102, 241, 0.22)',
    gradient: 'linear-gradient(145deg, #04091a 0%, #07193b 50%, #041026 100%)',
    pillBg: 'rgba(14, 165, 233, 0.16)',
    pillBorder: 'rgba(56, 189, 248, 0.45)',
    svgArt: `
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <line x1="190" y1="60" x2="290" y2="90" stroke="rgba(56,189,248,0.3)" stroke-width="1.5"/>
        <line x1="290" y1="90" x2="340" y2="170" stroke="rgba(56,189,248,0.3)" stroke-width="1.5"/>
        <line x1="190" y1="60" x2="220" y2="160" stroke="rgba(56,189,248,0.25)" stroke-width="1.5"/>
        <line x1="220" y1="160" x2="340" y2="170" stroke="rgba(56,189,248,0.3)" stroke-width="1.5"/>
        <line x1="290" y1="90" x2="250" y2="200" stroke="rgba(99,102,241,0.25)" stroke-width="1.5"/>
        <circle cx="190" cy="60" r="5" fill="#38bdf8"/>
        <circle cx="290" cy="90" r="7" fill="#0ea5e9"/>
        <circle cx="340" cy="170" r="6" fill="#38bdf8"/>
        <circle cx="220" cy="160" r="4" fill="#818cf8"/>
        <circle cx="250" cy="200" r="5" fill="#6366f1"/>
      </svg>
    `
  },
  {
    id: 'asian-australian-economies',
    name: 'Asian-Australian Economies',
    fontSize: '48px',
    kicker: 'Asia-Pacific Trade & Supply Chains',
    desc: 'Indo-Pacific industrial corridors, regional comprehensive partnerships, commodity flows, and manufacturing powerhouses.',
    accent: '#0d9488',
    accentLight: '#2dd4bf',
    glow: 'rgba(13, 148, 136, 0.28)',
    secondaryGlow: 'rgba(245, 158, 11, 0.18)',
    gradient: 'linear-gradient(145deg, #030e14 0%, #061e24 50%, #04141a 100%)',
    pillBg: 'rgba(13, 148, 136, 0.16)',
    pillBorder: 'rgba(45, 212, 191, 0.45)',
    svgArt: `
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <path d="M80 150 Q 200 60, 360 110" stroke="rgba(45,212,191,0.35)" stroke-width="2" fill="none"/>
        <path d="M120 180 Q 240 90, 380 150" stroke="rgba(245,158,11,0.3)" stroke-width="1.5" stroke-dasharray="5 5" fill="none"/>
        <ellipse cx="280" cy="120" rx="80" ry="50" stroke="rgba(45,212,191,0.2)" stroke-width="1.5"/>
        <circle cx="200" cy="80" r="4" fill="#2dd4bf"/>
        <circle cx="360" cy="110" r="5" fill="#f59e0b"/>
      </svg>
    `
  },
  {
    id: 'african-economies',
    name: 'African Economies',
    fontSize: '58px',
    kicker: 'Development & Monetary Integration',
    desc: 'Regional monetary unions (BCEAO, CEMAC), AfCFTA trade expansion, resource sovereignty, and demographic dividends.',
    accent: '#d97706',
    accentLight: '#fbbf24',
    glow: 'rgba(217, 119, 6, 0.28)',
    secondaryGlow: 'rgba(225, 29, 72, 0.18)',
    gradient: 'linear-gradient(145deg, #120904 0%, #291507 50%, #170b04 100%)',
    pillBg: 'rgba(217, 119, 6, 0.16)',
    pillBorder: 'rgba(251, 191, 36, 0.45)',
    svgArt: `
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <circle cx="280" cy="120" r="60" stroke="rgba(251,191,36,0.3)" stroke-width="2"/>
        <path d="M280 40 L 280 200 M 200 120 L 360 120" stroke="rgba(251,191,36,0.18)" stroke-width="1"/>
        <path d="M220 170 Q 280 70, 340 180" stroke="rgba(245,158,11,0.35)" stroke-width="2" fill="none"/>
        <circle cx="280" cy="120" r="5" fill="#fbbf24"/>
      </svg>
    `
  },
  {
    id: 'european-economies',
    name: 'European Economies',
    fontSize: '56px',
    kicker: 'Eurozone Architecture & Single Market',
    desc: 'ECB monetary policy, single market dynamics, fiscal compacts, industrial competitiveness, and structural reforms.',
    accent: '#2563eb',
    accentLight: '#60a5fa',
    glow: 'rgba(37, 99, 235, 0.3)',
    secondaryGlow: 'rgba(234, 179, 8, 0.2)',
    gradient: 'linear-gradient(145deg, #050b1c 0%, #0a1b42 50%, #050e26 100%)',
    pillBg: 'rgba(37, 99, 235, 0.16)',
    pillBorder: 'rgba(96, 165, 250, 0.45)',
    svgArt: `
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <g transform="translate(280, 120)">
          ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
            const rad = deg * Math.PI / 180;
            const x = Math.round(Math.cos(rad) * 65);
            const y = Math.round(Math.sin(rad) * 65);
            return `<circle cx="${x}" cy="${y}" r="3" fill="#fbbf24" opacity="0.65"/>`;
          }).join('')}
          <circle cx="0" cy="0" r="82" stroke="rgba(96,165,250,0.2)" stroke-width="1.5" stroke-dasharray="4 4"/>
        </g>
      </svg>
    `
  },
  {
    id: 'middle-east-economies',
    name: 'Middle Eastern Economies',
    fontSize: '50px',
    kicker: 'Sovereign Capital & Energy Transition',
    desc: 'Sovereign wealth funds, post-oil industrial diversification, energy trade geopolitics, and regional integration.',
    accent: '#ca8a04',
    accentLight: '#fde047',
    glow: 'rgba(202, 138, 4, 0.28)',
    secondaryGlow: 'rgba(234, 88, 12, 0.2)',
    gradient: 'linear-gradient(145deg, #120f04 0%, #241d08 50%, #151105 100%)',
    pillBg: 'rgba(202, 138, 4, 0.16)',
    pillBorder: 'rgba(253, 224, 71, 0.45)',
    svgArt: `
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <rect x="225" y="65" width="105" height="105" rx="4" transform="rotate(45 277 117)" stroke="rgba(253,224,71,0.25)" stroke-width="2"/>
        <rect x="238" y="78" width="80" height="80" rx="4" transform="rotate(45 277 117)" stroke="rgba(234,88,12,0.3)" stroke-width="1.5" stroke-dasharray="4 4"/>
        <circle cx="277" cy="117" r="4.5" fill="#fde047"/>
      </svg>
    `
  },
  {
    id: 'latin-america-economies',
    name: 'Latin American Economies',
    fontSize: '50px',
    kicker: 'Commodity Cycles & Structural Policy',
    desc: 'Commodity price dynamics, inflation-targeting central banks, Mercosur/Pacific trade networks, and structural reform.',
    accent: '#e11d48',
    accentLight: '#fb7185',
    glow: 'rgba(225, 29, 72, 0.28)',
    secondaryGlow: 'rgba(16, 185, 129, 0.18)',
    gradient: 'linear-gradient(145deg, #14050a 0%, #290815 50%, #17060e 100%)',
    pillBg: 'rgba(225, 29, 72, 0.16)',
    pillBorder: 'rgba(251, 113, 133, 0.45)',
    svgArt: `
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <path d="M120 200 L 220 90 L 290 150 L 360 65" stroke="rgba(251,113,133,0.35)" stroke-width="2.5" fill="none"/>
        <path d="M100 220 L 220 110 L 290 170 L 380 75" stroke="rgba(16,185,129,0.25)" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/>
        <circle cx="220" cy="90" r="5" fill="#fb7185"/>
        <circle cx="290" cy="150" r="5" fill="#34d399"/>
        <circle cx="360" cy="65" r="5.5" fill="#fb7185"/>
      </svg>
    `
  },
  {
    id: 'american-economies',
    name: 'American Economies',
    fontSize: '58px',
    kicker: 'Macroeconomic Policy & Capital Markets',
    desc: 'Federal Reserve monetary policy, Wall Street capital flows, innovation clusters, and hemispheric economic partnerships.',
    accent: '#2563eb',
    accentLight: '#93c5fd',
    glow: 'rgba(37, 99, 235, 0.3)',
    secondaryGlow: 'rgba(239, 68, 68, 0.2)',
    gradient: 'linear-gradient(145deg, #07091a 0%, #0c183d 50%, #07102b 100%)',
    pillBg: 'rgba(37, 99, 235, 0.16)',
    pillBorder: 'rgba(147, 197, 253, 0.45)',
    svgArt: `
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <path d="M80 190 Q 200 120, 270 160 T 380 55" stroke="rgba(147,197,253,0.35)" stroke-width="2.5" fill="none"/>
        <path d="M80 210 Q 180 170, 250 190 T 380 90" stroke="rgba(239,68,68,0.3)" stroke-width="2" stroke-dasharray="6 6" fill="none"/>
        <circle cx="270" cy="160" r="5" fill="#93c5fd"/>
        <circle cx="380" cy="55" r="5.5" fill="#60a5fa"/>
      </svg>
    `
  },
  {
    id: 'economy-of-turkiye',
    name: 'Economy of Türkiye',
    fontSize: '58px',
    kicker: 'Macroeconomic Dynamics & Structural Policy',
    desc: 'CBRT monetary policy, disinflation trajectories, fiscal frameworks, industrial exports, and macroeconomic stability in Türkiye.',
    accent: '#dc2626',
    accentLight: '#f87171',
    glow: 'rgba(220, 38, 38, 0.3)',
    secondaryGlow: 'rgba(245, 158, 11, 0.22)',
    gradient: 'linear-gradient(145deg, #140407 0%, #290812 50%, #15050a 100%)',
    pillBg: 'rgba(220, 38, 38, 0.16)',
    pillBorder: 'rgba(248, 113, 113, 0.45)',
    svgArt: `
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <path d="M 285 55 A 65 65 0 1 0 340 175 A 54 54 0 1 1 285 55 Z" stroke="rgba(248,113,113,0.3)" stroke-width="1.75" fill="none"/>
        <circle cx="345" cy="115" r="4" fill="#f87171" opacity="0.85"/>
        <path d="M40 210 Q 150 140, 240 170 T 380 70" stroke="rgba(245,158,11,0.35)" stroke-width="2" fill="none"/>
        <circle cx="240" cy="170" r="4.5" fill="#fbbf24"/>
        <circle cx="380" cy="70" r="5" fill="#f87171"/>
      </svg>
    `
  }
];

function buildHtml(group, logoB64) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        width: 1000px;
        height: 380px;
        background: #030712;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .card {
        width: 1000px;
        height: 380px;
        position: relative;
        background: 
          radial-gradient(circle at 82% 35%, ${group.glow} 0%, transparent 50%),
          radial-gradient(circle at 18% 75%, ${group.secondaryGlow} 0%, transparent 45%),
          ${group.gradient};
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 28px 48px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
      }
      .card::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: 
          radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.07) 1px, transparent 0);
        background-size: 28px 28px;
        pointer-events: none;
      }

      .top-strip {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent 5%, ${group.accentLight} 35%, ${group.accent} 70%, transparent 95%);
      }

      .bg-art-container {
        position: absolute;
        right: 20px;
        bottom: 10px;
        width: 360px;
        height: 240px;
        pointer-events: none;
        opacity: 0.85;
      }

      .corner { position: absolute; width: 12px; height: 12px; border: 1.5px solid rgba(255, 255, 255, 0.25); }
      .corner-tl { top: 14px; left: 14px; border-right: none; border-bottom: none; }
      .corner-tr { top: 14px; right: 14px; border-left: none; border-bottom: none; }
      .corner-bl { bottom: 14px; left: 14px; border-right: none; border-top: none; }
      .corner-br { bottom: 14px; right: 14px; border-left: none; border-top: none; }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        z-index: 2;
      }
      .brand-box {
        display: flex;
        align-items: center;
        gap: 14px;
        background: rgba(255, 255, 255, 0.04);
        padding: 6px 16px 6px 8px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.09);
        backdrop-filter: blur(12px);
      }
      .brand-box img {
        width: 38px;
        height: 38px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      }
      .brand-text {
        display: flex;
        align-items: center;
      }
      .brand-title {
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        color: #f8fafc;
      }

      .badge-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .pill {
        padding: 5px 14px;
        border-radius: 999px;
        font-size: 10.5px;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-transform: uppercase;
      }
      .pill-primary {
        background: ${group.pillBg};
        color: ${group.accentLight};
        border: 1px solid ${group.pillBorder};
      }
      .pill-secondary {
        background: rgba(255, 255, 255, 0.05);
        color: #cbd5e1;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .main-content {
        position: relative;
        z-index: 2;
        margin: auto 0;
        max-width: 820px;
        display: flex;
        flex-direction: column;
      }
      .kicker {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 11.5px;
        font-weight: 700;
        letter-spacing: 2.2px;
        text-transform: uppercase;
        color: ${group.accentLight};
        margin-bottom: 14px;
        position: relative;
        z-index: 3;
      }
      .kicker::before {
        content: '';
        width: 16px;
        height: 2px;
        background: ${group.accentLight};
      }

      .headline-script {
        font-family: 'Great Vibes', cursive;
        font-size: ${group.fontSize};
        line-height: 1.05;
        color: #ffffff;
        text-shadow: 0 4px 24px ${group.glow};
        margin-bottom: 6px;
        letter-spacing: 0.5px;
        position: relative;
        z-index: 2;
      }

      .desc-text {
        font-size: 15px;
        line-height: 1.5;
        color: #cbd5e1;
        max-width: 660px;
        font-weight: 400;
        position: relative;
        z-index: 2;
      }

      .footer-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        z-index: 2;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding-top: 12px;
      }
      .footer-meta {
        display: flex;
        align-items: center;
        gap: 18px;
        font-size: 11px;
        color: #64748b;
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }
      .footer-meta span.active {
        color: #94a3b8;
      }
      .footer-brand {
        font-size: 11px;
        color: #64748b;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="top-strip"></div>
      <div class="corner corner-tl"></div>
      <div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div>
      <div class="corner corner-br"></div>
      
      <div class="bg-art-container">
        ${group.svgArt}
      </div>

      <div class="header">
        <div class="brand-box">
          <img src="data:image/jpeg;base64,${logoB64}" alt="TEDU ERU">
          <div class="brand-text">
            <span class="brand-title">Economics Research Union</span>
          </div>
        </div>
        <div class="badge-group">
          <span class="pill pill-secondary">ERU Blog</span>
          <span class="pill pill-primary">Research Group</span>
        </div>
      </div>

      <div class="main-content">
        <div class="kicker">${group.kicker}</div>
        <h1 class="headline-script">${group.name}</h1>
        <p class="desc-text">${group.desc}</p>
      </div>

      <div class="footer-bar">
        <div class="footer-meta">
          <span class="active">tedueru.github.io/blog</span>
          <span>&bull;</span>
          <span>Academic Inquiries</span>
          <span>&bull;</span>
          <span>EST. 2024</span>
        </div>
        <div class="footer-brand">TEDU ERU &bull; WORKING GROUPS</div>
      </div>
    </div>
  </body>
  </html>
  `;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1000, height: 380 }, deviceScaleFactor: 2 });
  
  const logoB64 = fs.readFileSync('logo.jpg').toString('base64');
  const outDir = path.resolve('assets/research-groups');
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Re-generating slim banners without code IDs...`);

  for (const group of groups) {
    const html = buildHtml(group, logoB64);
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    const jpgPath = path.join(outDir, `${group.id}.jpg`);
    await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 95 });
    const renderedHeadline = await page.innerText('.headline-script');
    console.log(`✓ Generated ${group.id}.jpg with headline: "${renderedHeadline}"`);

    if (group.id === 'latin-america-economies') {
      const aliasPath = path.join(outDir, 'latin-american-economies.jpg');
      await page.screenshot({ path: aliasPath, type: 'jpeg', quality: 95 });
      console.log(`✓ Also generated alias latin-american-economies.jpg`);
    }
    if (group.id === 'middle-east-economies') {
      const aliasPath = path.join(outDir, 'middle-eastern-economies.jpg');
      await page.screenshot({ path: aliasPath, type: 'jpeg', quality: 95 });
      console.log(`✓ Also generated alias middle-eastern-economies.jpg`);
    }
  }

  await browser.close();
  console.log('Finished updating all 9 banners without codes!');
})();

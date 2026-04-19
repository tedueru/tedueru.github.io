const fs = require('fs');
const path = require('path');

const root = process.cwd();
const failures = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function readJpegDimensions(file) {
  const buffer = fs.readFileSync(path.join(root, file));

  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    throw new Error('not a JPEG file');
  }

  let offset = 2;
  const sofMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);

  while (offset < buffer.length - 9) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    if (sofMarkers.has(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }

    const segmentLength = buffer.readUInt16BE(offset + 2);
    if (!segmentLength) {
      break;
    }
    offset += segmentLength + 2;
  }

  throw new Error('JPEG dimensions could not be read');
}

function expectIncludes(file, snippets) {
  const content = read(file);
  for (const snippet of snippets) {
    if (!content.includes(snippet)) {
      failures.push(`${file}: missing ${snippet}`);
    }
  }
  return content;
}

function expectOrder(file, snippets) {
  const content = read(file);
  let lastIndex = -1;

  for (const snippet of snippets) {
    const index = content.indexOf(snippet);
    if (index === -1) {
      failures.push(`${file}: missing ${snippet}`);
      return;
    }
    if (index < lastIndex) {
      failures.push(`${file}: wrong order around ${snippet}`);
      return;
    }
    lastIndex = index;
  }
}

expectIncludes('index.html', ['hero-shell', 'spotlight-panel', 'footer-top--home']);
expectIncludes('blog.html', ['medium-link']);
expectIncludes('contact.html', ['contact-info-visual', 'contact-brand-badge', 'contact-visual-frame']);
expectIncludes('team.html', [
  'President',
  'Arda Akgül',
  'Kübra Yaşar',
  'id="advisory-board"',
  'Advisory Board',
  'Kerem Yürekli',
  'Nejat Yılmaz',
  'Gökçe Başaran',
  'Mustafa Boydaş',
  'Orkun Apaydın',
  'The Advisory Board supports the executive team on strategy, continuity, and execution across ERU\'s projects and operations.',
]);

const teamContent = read('team.html');
if (teamContent.includes('Chairperson of the Board')) {
  failures.push('team.html: still contains Chairperson of the Board');
}
if (teamContent.includes('Audit Board')) {
  failures.push('team.html: still contains Audit Board section');
}
if (teamContent.includes('Akgul') || teamContent.includes('Yasar')) {
  failures.push('team.html: Turkish characters missing in member names');
}
const nejatMatches = teamContent.match(/Nejat Yılmaz/g) || [];
if (nejatMatches.length < 2) {
  failures.push('team.html: Nejat Yılmaz should appear in both founder and advisory sections');
}

for (const navFile of ['index.html', 'events.html', 'fieldtalks.html', 'team.html']) {
  expectIncludes(navFile, ['href="team.html#advisory-board"']);
}

expectIncludes('erumag.html', [
  'page-header-split',
  'Our Issues',
  'covers/erumag-4-cover.jpg',
  'issue-card--rich',
]);

for (const issueFile of ['erumag-1.html', 'erumag-2.html', 'erumag-3.html', 'erumag-4.html']) {
  expectIncludes(issueFile, ['page-header-split', 'page-header-cover']);
}

expectIncludes('fieldtalks.html', [
  'SK42iFAkiTc',
  'aRMS2e9ayp8',
  'fZozYKE4zSo',
  '1wu4VIDwBP0',
  'Dijital Dönüşüm Çağında Büyük Güç Rekabeti',
  'Asst. Prof. Arda Gitmez',
  'Assoc. Prof. Dr. Emre Demir',
]);

expectOrder('fieldtalks.html', ['SK42iFAkiTc', 'aRMS2e9ayp8', 'fZozYKE4zSo', '1wu4VIDwBP0']);
const fieldtalksContent = read('fieldtalks.html');
if (fieldtalksContent.includes('Dr. Öğr. Üyesi') || fieldtalksContent.includes('Doç. Dr.')) {
  failures.push('fieldtalks.html: Turkish academic titles remain in English page content');
}

const greentalksContent = read('greentalks.html');
if (greentalksContent.includes('1wu4VIDwBP0')) {
  failures.push('greentalks.html: still contains FieldTalks video 1wu4VIDwBP0');
}
if (greentalksContent.includes('Doç. Dr.')) {
  failures.push('greentalks.html: Turkish academic titles remain in English page content');
}
if (!greentalksContent.includes('Assoc. Prof. Dr. Emre Demir')) {
  failures.push('greentalks.html: missing English academic title for Emre Demir');
}

expectIncludes('events.html', [
  'ig_events_full/event_36.jpg',
  'ig_events_full/event_35.jpg',
  'ig_events_full/event_34.webp',
  'ig_events_full/event_33.jpg',
  'Political Economy, Institutions, and Technology',
  'Akıllı Üretim Sistemleri ve Küresel Dönüşümler',
  'IBKI Conference at METU',
  'Toward COP31: Youth for Energy Transition and Climate Change',
  'event-poster',
]);
expectOrder('events.html', ['event_36.jpg', 'event_35.jpg', 'event_34.webp', 'event_33.jpg']);

const styleContent = read('style.css');
if (/\.event-poster img\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/i.test(styleContent)) {
  failures.push('style.css: .event-poster img still forces square event posters');
}

for (const posterFile of ['ig_events_full/event_35.jpg', 'ig_events_full/event_36.jpg']) {
  try {
    const { width, height } = readJpegDimensions(posterFile);
    if (height <= width) {
      failures.push(`${posterFile}: expected portrait poster, found ${width}x${height}`);
    }
  } catch (error) {
    failures.push(`${posterFile}: ${error.message}`);
  }
}

if (failures.length > 0) {
  console.error('Content refresh smoke test failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Content refresh smoke test passed.');

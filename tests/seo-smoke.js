const fs = require('fs');
const path = require('path');

const root = process.cwd();
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith('.html'));
const requiredFiles = ['robots.txt', 'sitemap.xml', 'llms.txt'];
const failures = [];

const requiredHeadSnippets = [
  '<meta name="description"',
  '<link rel="canonical"',
  'property="og:title"',
  'property="og:description"',
  'property="og:type"',
  'property="og:url"',
  'property="og:image"',
  'name="twitter:card"',
  'name="twitter:title"',
  'name="twitter:description"',
  'name="twitter:image"',
  'application/ld+json',
];

for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');

  for (const snippet of requiredHeadSnippets) {
    if (!content.includes(snippet)) {
      failures.push(`${file}: missing ${snippet}`);
    }
  }

  if (content.includes('href="#"')) {
    failures.push(`${file}: contains href="#" placeholder links`);
  }

  if (content.includes('onsubmit="event.preventDefault')) {
    failures.push(`${file}: contains fake contact form submit handler`);
  }

  const targetBlankTags = content.match(/<a\b[^>]*target="_blank"[^>]*>/g) || [];
  for (const tag of targetBlankTags) {
    if (!/rel="[^"]*noopener[^"]*noreferrer[^"]*"/.test(tag)) {
      failures.push(`${file}: target="_blank" link missing rel="noopener noreferrer"`);
      break;
    }
  }
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    failures.push(`missing required root file: ${file}`);
  }
}

if (failures.length > 0) {
  console.error('SEO smoke test failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`SEO smoke test passed for ${htmlFiles.length} HTML files.`);

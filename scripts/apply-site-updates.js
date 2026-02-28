const fs = require('fs');
const path = require('path');

const root = process.cwd();
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith('.html'));

const descriptions = {
  'index.html': 'TED University Economics Research Union is a student-led platform for economic research, ERUMAG publications, GreenTalks, FieldTalks, and campus events.',
  'about.html': 'Learn about the mission, vision, and academic purpose of TED University Economics Research Union.',
  'events.html': 'Follow TEDU ERU events, seminars, workshops, and publication updates from the Economics Research Union.',
  'erumag.html': 'Explore ERUMAG, the flagship TEDU ERU publication featuring student-written economic analysis, interviews, and issue archives.',
  'blog.html': 'Read TEDU ERU interviews, articles, and economic commentary from the Economics Research Union blog.',
  'greentalks.html': 'Browse GreenTalks episodes and seminars on sustainability, environmental economics, climate policy, and the green transition.',
  'fieldtalks.html': 'Browse FieldTalks episodes and seminars featuring economists, policy discussions, and real-world economic analysis.',
  'team.html': 'Meet the TED University Economics Research Union board members, editors, and student leaders.',
  'contact.html': 'Contact TED University Economics Research Union about collaborations, publications, events, and student involvement.',
  'article-basci.html': 'Interview with Prof. Dr. Erdem Basci on inflation, uncertainty, AI, monetary policy, and emerging economies.',
  'article-bceao.html': 'An analysis of the BCEAO, the West African monetary union, and its parallels with the Eurozone.',
  'article-dincer.html': 'Interview with Prof. Dr. Nazire Nergiz Dincer on economics, sustainability, circularity, and academic life.',
  'article-openai.html': 'An analysis of how AI infrastructure demand can reshape semiconductor supply and consumer electronics prices.',
  'article-podcasts.html': 'A guide to TEDU ERU podcast episodes across GreenTalks and FieldTalks on Spotify and YouTube.',
  'article-serbest.html': 'A critical look at free markets, monopoly power, and why markets are not always as open as they appear.',
  'article-syria.html': 'An analysis of energy investments, renewable potential, and policy direction in Syria under the new government.',
  'erumag-1.html': 'Read ERUMAG Issue 1, the inaugural TEDU ERU issue introducing the publication and its analytical voice.',
  'erumag-2.html': 'Read ERUMAG Issue 2 on fertility rates, demographic economics, and long-run policy questions.',
  'erumag-3.html': 'Read ERUMAG Issue 3 on artificial intelligence, inflation, uncertainty, and macroeconomic change.',
  'erumag-4.html': 'Read ERUMAG Issue 4 on consumerism, changing behavior, and contemporary economic questions.',
};

const schemaTypes = {
  'index.html': 'home',
  'about.html': 'about',
  'contact.html': 'contact',
  'team.html': 'team',
  'blog.html': 'collection',
  'erumag.html': 'collection',
  'greentalks.html': 'collection',
  'fieldtalks.html': 'collection',
  'events.html': 'collection',
  'article-basci.html': 'article',
  'article-bceao.html': 'article',
  'article-dincer.html': 'article',
  'article-openai.html': 'article',
  'article-podcasts.html': 'article',
  'article-serbest.html': 'article',
  'article-syria.html': 'article',
  'erumag-1.html': 'issue',
  'erumag-2.html': 'issue',
  'erumag-3.html': 'issue',
  'erumag-4.html': 'issue',
};

const dates = {
  'article-basci.html': '2025-11-28',
  'article-bceao.html': '2026-01-19',
  'article-dincer.html': '2026-01-14',
  'article-openai.html': '2025-11-28',
  'article-podcasts.html': '2025-10-07',
  'article-serbest.html': '2025-10-12',
  'article-syria.html': '2025-10-12',
  'erumag-1.html': '2025-01-15',
  'erumag-2.html': '2025-05-15',
  'erumag-3.html': '2025-11-28',
  'erumag-4.html': '2026-01-14',
};

const authors = {
  'article-basci.html': ['Mustafa Boydas', 'Arda Akgul'],
  'article-bceao.html': ['Mustafa Boydas', 'Arda Akgul'],
  'article-dincer.html': ['Mustafa Boydas', 'Arda Akgul'],
  'article-openai.html': ['Yusuf Arda Arslanoglu'],
  'article-podcasts.html': ['TEDU ERU Editorial Team'],
  'article-serbest.html': ['TEDU ERU Editorial Team'],
  'article-syria.html': ['TEDU ERU Editorial Team'],
};

const sameAs = [
  'https://www.linkedin.com/company/tedueru',
  'https://www.youtube.com/@TEDUERU',
  'https://www.instagram.com/erutedu/',
];

function getPathname(file) {
  return file === 'index.html' ? 'index.html' : file;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildSchema(file, title, description, image) {
  const kind = schemaTypes[file] || 'webpage';
  const url = getPathname(file);

  if (kind === 'home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: 'TED University Economics Research Union',
          alternateName: 'TEDU ERU',
          url,
          logo: 'logo.jpg',
          sameAs,
          email: 'eru@tedu.edu.tr',
        },
        {
          '@type': 'WebSite',
          name: 'TED University Economics Research Union',
          url,
          publisher: {
            '@type': 'Organization',
            name: 'TED University Economics Research Union',
          },
        },
      ],
    };
  }

  if (kind === 'about') {
    return {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: title,
      description,
      url,
      about: {
        '@type': 'Organization',
        name: 'TED University Economics Research Union',
      },
    };
  }

  if (kind === 'contact') {
    return {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: title,
      description,
      url,
      about: {
        '@type': 'Organization',
        name: 'TED University Economics Research Union',
        email: 'eru@tedu.edu.tr',
      },
    };
  }

  if (kind === 'team') {
    return {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: title,
      description,
      url,
      about: {
        '@type': 'Organization',
        name: 'TED University Economics Research Union',
      },
    };
  }

  if (kind === 'collection') {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url,
      isPartOf: {
        '@type': 'WebSite',
        name: 'TED University Economics Research Union',
      },
    };
  }

  if (kind === 'issue') {
    return {
      '@context': 'https://schema.org',
      '@type': 'PublicationIssue',
      name: title,
      description,
      url,
      image,
      datePublished: dates[file],
      isPartOf: {
        '@type': 'Periodical',
        name: 'ERUMAG',
      },
      publisher: {
        '@type': 'Organization',
        name: 'TED University Economics Research Union',
      },
    };
  }

  if (kind === 'article') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url,
      image,
      datePublished: dates[file],
        author: (authors[file] || ['TEDU ERU Editorial Team']).map((name) => ({
            '@type': 'Person',
            name,
        })),
        publisher: {
            '@type': 'Organization',
            name: 'TED University Economics Research Union',
            logo: {
                '@type': 'ImageObject',
                url: 'logo.jpg',
            },
        },
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
  };
}

function buildMetaBlock(file, title, description, image) {
  const url = getPathname(file);
  const ogType = schemaTypes[file] === 'article' || schemaTypes[file] === 'issue' ? 'article' : 'website';
  const schema = JSON.stringify(buildSchema(file, title, description, image), null, 4);

  return [
    `    <meta name="description" content="${escapeHtml(description)}">`,
    `    <link rel="canonical" href="${url}">`,
    '    <meta name="robots" content="index,follow">',
    `    <meta property="og:title" content="${escapeHtml(title)}">`,
    `    <meta property="og:description" content="${escapeHtml(description)}">`,
    `    <meta property="og:type" content="${ogType}">`,
    `    <meta property="og:url" content="${url}">`,
    `    <meta property="og:image" content="${image}">`,
    `    <meta name="twitter:card" content="summary_large_image">`,
    `    <meta name="twitter:title" content="${escapeHtml(title)}">`,
    `    <meta name="twitter:description" content="${escapeHtml(description)}">`,
    `    <meta name="twitter:image" content="${image}">`,
    '    <script type="application/ld+json">',
    schema
      .split('\n')
      .map((line) => `    ${line}`)
      .join('\n'),
    '    </script>',
  ].join('\n');
}

function getImage(content) {
  const matches = [...content.matchAll(/<img\s+[^>]*src="([^"]+)"[^>]*>/g)];
  const image = matches.find((match) => !match[1].includes('logo.jpg'));
  return image ? image[1] : 'logo.jpg';
}

for (const file of htmlFiles) {
  const fullPath = path.join(root, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);

  if (!titleMatch) {
    throw new Error(`Missing title in ${file}`);
  }

  const title = titleMatch[1];
  const description = descriptions[file] || `${title} from TED University Economics Research Union.`;
  const image = getImage(content);
  const metaBlock = buildMetaBlock(file, title, description, image);

  const preconnectIndex = content.indexOf('<link rel="preconnect"', 0);
  const titleEndIndex = content.indexOf('</title>');
  if (preconnectIndex === -1 || titleEndIndex === -1) {
    throw new Error(`Unexpected head structure in ${file}`);
  }

  const beforeMeta = content.slice(0, titleEndIndex + '</title>'.length);
  const afterMeta = content.slice(preconnectIndex);
  content = `${beforeMeta}\n${metaBlock}\n${afterMeta}`;

  content = content.replace(
    /<a href="#" class="social-btn" aria-label="LinkedIn">/g,
    '<a href="https://www.linkedin.com/company/tedueru" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="LinkedIn">'
  );
  content = content.replace(
    /<a href="#" class="social-btn" aria-label="Instagram">/g,
    '<a href="https://www.instagram.com/erutedu/" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Instagram">'
  );
  content = content.replace(
    /<a href="#" class="social-btn" aria-label="Twitter"><i data-lucide="twitter"><\/i><\/a>/g,
    '<a href="https://www.youtube.com/@TEDUERU" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="YouTube"><i data-lucide="youtube"></i></a>'
  );
  content = content.replace(
    /<div class="footer-links">[\s\S]*?<\/div>/g,
    '<div class="footer-links"><a href="about.html">About</a><a href="contact.html">Contact</a></div>'
  );
  content = content.replace(
    /<a href="#" class="btn btn-primary"><i data-lucide="linkedin" style="width:18px;height:18px;"><\/i>\s*LinkedIn<\/a>/g,
    '<a href="https://www.linkedin.com/company/tedueru" target="_blank" rel="noopener noreferrer" class="btn btn-primary"><i data-lucide="linkedin" style="width:18px;height:18px;"></i> LinkedIn</a>'
  );
  content = content.replace(
    /<a href="#" class="btn btn-ghost"><i data-lucide="instagram" style="width:18px;height:18px;"><\/i>\s*Instagram<\/a>/g,
    '<a href="https://www.instagram.com/erutedu/" target="_blank" rel="noopener noreferrer" class="btn btn-ghost"><i data-lucide="instagram" style="width:18px;height:18px;"></i> Instagram</a>'
  );

  content = content.replace(/<a\b([^>]*?)target="_blank"(?![^>]*\brel=)([^>]*)>/g, '<a$1target="_blank" rel="noopener noreferrer"$2>');
  content = content.replace(/<img((?:(?!loading=)[^>])*)src="(https?:\/\/[^"]+)"([^>]*)>/g, '<img$1src="$2" loading="lazy"$3>');

  fs.writeFileSync(fullPath, content, 'utf8');
}

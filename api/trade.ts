import fs from 'fs';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';

interface MarketMeta {
  title: string;
  description: string;
  image: string;
}

const RAW_BASE =
  'https://raw.githubusercontent.com/overlay-market/overlay-interface-v2/main/src/assets/images/markets-full-logos';

function loadMarketLogos(): Record<string, string> {
  const filePath = path.join(process.cwd(), 'src', 'constants', 'markets.ts');
  const source = fs.readFileSync(filePath, 'utf8');

  const imports: Record<string, string> = {};
  const importRegex = /import\s+(\w+)\s+from\s+"..\/assets\/images\/markets-full-logos\/([^\"]+)";/g;
  let match;
  while ((match = importRegex.exec(source))) {
    imports[match[1]] = match[2];
  }

  const logos: Record<string, string> = {};
  const section = source.match(/export const MARKETS_FULL_LOGOS[^]*?};/);
  if (section) {
    const logoRegex = /"([^\"]+)":\s*(\w+),/g;
    let m;
    while ((m = logoRegex.exec(section[0]))) {
      const encoded = m[1];
      const varName = m[2];
      const file = imports[varName];
      if (file) logos[encoded] = `${RAW_BASE}/${file}`;
    }
  }
  return logos;
}

const MARKET_LOGOS = loadMarketLogos();
const DEFAULT_LOGO = `${RAW_BASE}/dafault-logo.webp`;

function getMarketMeta(encodedMarket?: string): MarketMeta {
  const marketKey = encodedMarket ?? '';
  const title = marketKey ? decodeURIComponent(marketKey) : 'Overlay Markets';
  const image = MARKET_LOGOS[marketKey] ?? DEFAULT_LOGO;
  const description = `Trade ${title} on Overlay Markets`;
  return { title, description, image };
}

function readTemplate() {
  const distPath = path.join(process.cwd(), 'dist', 'index.html');
  const srcPath = path.join(process.cwd(), 'index.html');
  const templatePath = fs.existsSync(distPath) ? distPath : srcPath;
  return fs.readFileSync(templatePath, 'utf8');
}

export default function handler(
  req: IncomingMessage & { query?: Record<string, unknown> },
  res: ServerResponse
) {
  const query = (req as any).query || {};
  const market = typeof query.market === 'string' ? (query.market as string) : undefined;
  const { title, description, image } = getMarketMeta(market);

  const headTags = `\n    <meta property="og:title" content="${title}" />\n    <meta property="og:image" content="${image}" />\n    <meta name="description" content="${description}" />\n    <meta property="og:description" content="${description}" />\n  `;

  const template = readTemplate();
  const html = template.replace('</head>', `${headTags}</head>`);

  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 200;
  (res as any).send ? (res as any).send(html) : res.end(html);
}

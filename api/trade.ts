import fs from 'fs';
import path from 'path';
import { getMarketMeta } from './getMarketMeta';
import type { IncomingMessage, ServerResponse } from 'http';

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

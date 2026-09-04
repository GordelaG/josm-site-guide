import { NextRequest } from 'next/server';
import { getAirportsOnce } from '../../lib/airports-service';
import { Airport, AirportUpdate } from '../../types/airport';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = `${protocol}://${host}`;

  const airports = await getAirportsOnce();

  // Aggregate and sort all updates
  const items: Array<{ airport: Airport; update: AirportUpdate }> = [];
  airports.forEach((ap) => {
    if (ap.updatesHistory && ap.updatesHistory.length > 0) {
      ap.updatesHistory.forEach((upd) => {
        items.push({ airport: ap, update: upd });
      });
    }
  });

  items.sort((a, b) => new Date(b.update.date).getTime() - new Date(a.update.date).getTime());

  const rssItems = items
    .map(({ airport, update }) => {
      const pubDate = new Date(update.date || Date.now()).toUTCString();
      const postUrl = `${baseUrl}/atualizacoes#update-${airport.icao}`;
      const guid = `${airport.icao}-${update.version}-${new Date(update.date).getTime()}`;
      const title = `[${airport.icao} ${update.version}] ${update.title}`;
      const author = update.author || 'VATBRZ Operações';
      const toAbsoluteUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('data:')) return url;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
      };

      const beforeImg = toAbsoluteUrl(update.beforeImageUrl);
      const afterImg = toAbsoluteUrl(update.afterImageUrl || update.imageUrl);
      const isValidHttpUrl = (url: string) => url.startsWith('http://') || url.startsWith('https://');

      // Convert any internal newlines in update.description to <br />
      const formattedDesc = (update.description || '').replace(/\r?\n/g, '<br />\n');

      // Discord-compatible format with explicit <br /> tags for Readybot and RSS parsers
      const discordDescription = `${formattedDesc}<br /><br />\n\n` +
        `✨ **Comparativo Interativo do Solo:**<br />\n` +
        `Veja as alterações detalhadas com o slider interativo no portal:<br />\n` +
        `👉 **[Clique aqui para conferir o comparativo no site](${postUrl})**<br /><br />\n\n` +
        `📍 **Aeródromo:** ${airport.name} (${airport.icao})<br />\n` +
        `🏷️ **Versão:** ${update.version}<br />\n` +
        `👤 **Autor:** ${author}`;

      return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="false">${escapeXml(guid)}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[${author}]]></dc:creator>
      <category><![CDATA[${airport.name} (${airport.icao})]]></category>
      <description><![CDATA[${discordDescription}]]></description>
      <content:encoded><![CDATA[${discordDescription}]]></content:encoded>
      ${isValidHttpUrl(afterImg) ? `<enclosure url="${escapeXml(afterImg)}" length="0" type="image/jpeg" />\n      <media:content url="${escapeXml(afterImg)}" medium="image" />` : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/" 
  xmlns:media="http://search.yahoo.com/mrss/" 
  xmlns:atom="http://www.w3.org/2005/Atom" 
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>VATBRZ Operações - Atualizações de Cenários</title>
    <link>${baseUrl}/atualizacoes</link>
    <description>Feed oficial de notas de versão, comparativos de solo EuroScope e atualizações dos aeródromos da VATBRZ.</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>https://cdn-icons-png.flaticon.com/512/3125/3125713.png</url>
      <title>VATBRZ Operações</title>
      <link>${baseUrl}/atualizacoes</link>
    </image>
${rssItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=120, stale-while-revalidate=60',
    },
  });
}

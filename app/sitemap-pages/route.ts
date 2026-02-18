import { getPagesSitemapEntries, buildSitemapXml } from '@/lib/sitemap-data'

export const revalidate = 3600

export async function GET() {
  const entries = await getPagesSitemapEntries()
  const xml = buildSitemapXml(entries)
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  })
}

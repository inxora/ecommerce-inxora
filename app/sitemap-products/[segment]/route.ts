import { getProductSitemapSegment, buildSitemapXml } from '@/lib/sitemap-data'

export const revalidate = 3600

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ segment: string }> }
) {
  const { segment } = await params
  const segmentNum = parseInt(segment, 10)
  if (Number.isNaN(segmentNum) || segmentNum < 1) {
    return new Response('Not Found', { status: 404 })
  }
  const entries = await getProductSitemapSegment(segmentNum)
  if (entries.length === 0) {
    return new Response('Not Found', { status: 404 })
  }
  const xml = buildSitemapXml(entries)
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  })
}

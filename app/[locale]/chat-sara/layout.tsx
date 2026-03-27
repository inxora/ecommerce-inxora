import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'chatSara' })
  return {
    title: t('meta.shareTitle'),
    description: t('meta.shareDescription'),
  }
}

export default function ChatSaraShareLayout({ children }: { children: React.ReactNode }) {
  return children
}

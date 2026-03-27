import type { TermsDocument } from '../terms-y-condiciones/types'
import { privacyDocumentEs } from './es'
import { privacyDocumentEn } from './en'
import { privacyDocumentPt } from './pt'

const byLocale: Record<string, TermsDocument> = {
  es: privacyDocumentEs,
  en: privacyDocumentEn,
  pt: privacyDocumentPt,
}

export type { PrivacyDocument, PrivacySection, PrivacySubsection } from './types'

export function getPrivacyDocument(locale: string): TermsDocument {
  return byLocale[locale] ?? privacyDocumentEs
}

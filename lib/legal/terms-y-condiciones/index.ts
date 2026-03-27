import type { TermsDocument } from './types'
import { termsDocumentEs } from './es'
import { termsDocumentEn } from './en'
import { termsDocumentPt } from './pt'

const byLocale: Record<string, TermsDocument> = {
  es: termsDocumentEs,
  en: termsDocumentEn,
  pt: termsDocumentPt,
}

export type { TermsDocument, TermsSection, TermsSubsection } from './types'

export function getTermsDocument(locale: string): TermsDocument {
  return byLocale[locale] ?? termsDocumentEs
}

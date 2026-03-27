export type TermsSubsection = {
  label: string
  title: string
  paragraphs: string[]
}

export type TermsSection =
  | {
      number: string
      title: string
      paragraphs: string[]
      subsections?: undefined
    }
  | {
      number: string
      title: string
      paragraphs?: undefined
      subsections: TermsSubsection[]
    }

export type TermsDocument = {
  meta: {
    title: string
    description: string
  }
  heading: string
  sections: TermsSection[]
}

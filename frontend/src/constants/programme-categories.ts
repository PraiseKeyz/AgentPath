export const programmeCategories = [
  'Cloud Engineering',
  'AI and Machine Learning',
  'Software Development',
  'Compliance',
] as const

export type ProgrammeCategory = (typeof programmeCategories)[number]

export const categoryKeywords: Record<ProgrammeCategory, string[]> = {
  'Cloud Engineering': ['cloud', 'aws', 'devops', 'engineering'],
  'AI and Machine Learning': ['ai', 'machine', 'learning', 'ml', 'data'],
  'Software Development': ['software', 'front', 'web', 'development', 'react'],
  Compliance: ['compliance', 'security', 'governance'],
}

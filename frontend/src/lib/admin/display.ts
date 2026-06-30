export function getRelationshipId(
  value: { id: number } | number | null | undefined,
): number | null {
  if (!value) return null
  if (typeof value === 'number') return value
  return value.id
}

export function getCourseIdFromModule(
  module: { course: { id: number } | number | null | undefined },
): number | null {
  return getRelationshipId(module.course)
}

export function getCourseIdFromLesson(
  lesson: { module: { course?: { id: number } | number | null | undefined } | number | null | undefined },
): number | null {
  if (!lesson.module || typeof lesson.module !== 'object') return null
  return getRelationshipId(lesson.module.course)
}

export function getCourseAdminHref(courseId: number | null) {
  return courseId ? `/admin/courses/${courseId}` : '/admin/courses'
}

export function getRelationshipLabel(
  value:
    | { title?: string | null; name?: string | null; email?: string | null }
    | number
    | null
    | undefined,
  fallback: string,
) {
  if (!value || typeof value !== 'object') return fallback
  if ('title' in value && value.title) return value.title
  if ('name' in value && value.name) return value.name
  if ('email' in value && value.email) return value.email
  return fallback
}

import type { LexicalContent } from '@upkora/shared'

import { lexicalToText } from '@/lib/admin/lexical'

export function getCourseDescriptionText(
  description?: LexicalContent | string | null,
): string {
  if (!description) return ''
  if (typeof description === 'string') return description.trim()
  return lexicalToText(description)
}

export function formatDashboardDate(value?: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
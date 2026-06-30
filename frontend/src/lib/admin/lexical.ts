import type { LexicalContent } from '@upkora/shared'

export function lexicalToText(content?: LexicalContent | null): string {
  if (!content?.root?.children) return ''

  const parts: string[] = []

  for (const node of content.root.children) {
    if (typeof node !== 'object' || node === null) continue

    const children = 'children' in node ? node.children : undefined
    if (!Array.isArray(children)) continue

    for (const child of children) {
      if (
        typeof child === 'object' &&
        child !== null &&
        'text' in child &&
        typeof child.text === 'string'
      ) {
        parts.push(child.text)
      }
    }
  }

  return parts.join('\n').trim()
}
import type { LexicalContent } from '@upkora/shared'

const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8

type LexicalNode = {
  type: string
  version: number
  [key: string]: unknown
}

function createTextNode(text: string, format = 0): LexicalNode {
  return {
    type: 'text',
    version: 1,
    text,
    format,
    detail: 0,
    mode: 'normal',
    style: '',
  }
}

function createParagraph(children: LexicalNode[]): LexicalNode {
  return {
    type: 'paragraph',
    version: 1,
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    textStyle: '',
  }
}

function wrapTextWithFormat(text: string, element: HTMLElement): LexicalNode {
  let format = 0
  let current: HTMLElement | null = element

  while (current) {
    const tag = current.tagName.toLowerCase()
    if (tag === 'strong' || tag === 'b') format |= IS_BOLD
    if (tag === 'em' || tag === 'i') format |= IS_ITALIC
    if (tag === 'u') format |= IS_UNDERLINE
    if (tag === 's' || tag === 'strike' || tag === 'del') format |= IS_STRIKETHROUGH
    current = current.parentElement
  }

  return createTextNode(text, format)
}

function isEmptyHtml(html: string) {
  const trimmed = html.trim()
  return !trimmed || trimmed === '<p></p>' || trimmed === '<p><br></p>'
}

function inlineNodesFromElement(element: HTMLElement): LexicalNode[] {
  const nodes: LexicalNode[] = []

  element.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? ''
      if (text) nodes.push(createTextNode(text))
      return
    }

    if (child.nodeType !== Node.ELEMENT_NODE) return

    const el = child as HTMLElement
    const tag = el.tagName.toLowerCase()

    if (tag === 'br') return

    if (tag === 'a') {
      const href = el.getAttribute('href') ?? ''
      const linkChildren = inlineNodesFromElement(el)
      if (href && linkChildren.length > 0) {
        nodes.push({
          type: 'link',
          version: 3,
          fields: {
            linkType: 'custom',
            newTab: el.getAttribute('target') === '_blank',
            url: href,
          },
          children: linkChildren,
        })
      }
      return
    }

    if (['strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'span', 'code'].includes(tag)) {
      el.childNodes.forEach((nested) => {
        if (nested.nodeType === Node.TEXT_NODE) {
          const text = nested.textContent ?? ''
          if (text) nodes.push(wrapTextWithFormat(text, el))
          return
        }

        if (nested.nodeType === Node.ELEMENT_NODE) {
          nodes.push(...inlineNodesFromElement(nested as HTMLElement))
        }
      })
      return
    }

    nodes.push(...inlineNodesFromElement(el))
  })

  return nodes
}

function blockNodesFromElement(element: HTMLElement): LexicalNode[] {
  const nodes: LexicalNode[] = []

  element.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.trim() ?? ''
      if (text) nodes.push(createParagraph([createTextNode(text)]))
      return
    }

    if (child.nodeType !== Node.ELEMENT_NODE) return

    const el = child as HTMLElement
    const tag = el.tagName.toLowerCase()

    if (tag === 'p') {
      const children = inlineNodesFromElement(el)
      nodes.push(createParagraph(children.length > 0 ? children : [createTextNode('')]))
      return
    }

    if (/^h[1-6]$/.test(tag)) {
      const children = inlineNodesFromElement(el)
      nodes.push({
        type: 'heading',
        version: 1,
        tag,
        children: children.length > 0 ? children : [createTextNode('')],
        direction: 'ltr',
        format: '',
        indent: 0,
      })
      return
    }

    if (tag === 'blockquote') {
      const children = blockNodesFromElement(el)
      nodes.push({
        type: 'quote',
        version: 1,
        children: children.length > 0 ? children : [createParagraph([createTextNode('')])],
        direction: 'ltr',
        format: '',
        indent: 0,
      })
      return
    }

    if (tag === 'ul' || tag === 'ol') {
      const listItems: LexicalNode[] = []
      el.querySelectorAll(':scope > li').forEach((item, index) => {
        const paragraphChildren = inlineNodesFromElement(item as HTMLElement)
        listItems.push({
          type: 'listitem',
          version: 1,
          value: index + 1,
          children: [
            createParagraph(paragraphChildren.length > 0 ? paragraphChildren : [createTextNode('')]),
          ],
        })
      })

      nodes.push({
        type: 'list',
        version: 1,
        listType: tag === 'ol' ? 'number' : 'bullet',
        tag,
        start: 1,
        children: listItems,
      })
      return
    }

    if (tag === 'pre') {
      const code = el.textContent ?? ''
      nodes.push(createParagraph([createTextNode(code)]))
      return
    }

    nodes.push(...blockNodesFromElement(el))
  })

  return nodes
}

export function htmlToLexical(html: string): LexicalContent | null {
  if (typeof document === 'undefined' || isEmptyHtml(html)) return null

  const parsed = new DOMParser().parseFromString(html, 'text/html')
  const children = blockNodesFromElement(parsed.body)

  if (children.length === 0) return null

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function textNodeToHtml(node: LexicalNode): string {
  const text = typeof node.text === 'string' ? node.text : ''
  const format = typeof node.format === 'number' ? node.format : 0
  let html = escapeHtml(text)

  if (format & IS_BOLD) html = `<strong>${html}</strong>`
  if (format & IS_ITALIC) html = `<em>${html}</em>`
  if (format & IS_UNDERLINE) html = `<u>${html}</u>`
  if (format & IS_STRIKETHROUGH) html = `<s>${html}</s>`

  return html
}

function inlineNodesToHtml(nodes: unknown[]): string {
  return nodes
    .map((node) => {
      if (typeof node !== 'object' || node === null) return ''
      const lexicalNode = node as LexicalNode

      if (lexicalNode.type === 'text') return textNodeToHtml(lexicalNode)

      if (lexicalNode.type === 'link') {
        const fields =
          typeof lexicalNode.fields === 'object' && lexicalNode.fields !== null
            ? (lexicalNode.fields as { url?: string; newTab?: boolean })
            : {}
        const href = fields.url ?? '#'
        const children = Array.isArray(lexicalNode.children) ? lexicalNode.children : []
        const target = fields.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
        return `<a href="${escapeHtml(href)}"${target}>${inlineNodesToHtml(children)}</a>`
      }

      if (Array.isArray(lexicalNode.children)) {
        return inlineNodesToHtml(lexicalNode.children)
      }

      return ''
    })
    .join('')
}

function blockNodesToHtml(nodes: unknown[]): string {
  return nodes
    .map((node) => {
      if (typeof node !== 'object' || node === null) return ''
      const lexicalNode = node as LexicalNode
      const children = Array.isArray(lexicalNode.children) ? lexicalNode.children : []

      if (lexicalNode.type === 'paragraph') {
        const inner = inlineNodesToHtml(children)
        return inner ? `<p>${inner}</p>` : '<p></p>'
      }

      if (lexicalNode.type === 'heading') {
        const tag = typeof lexicalNode.tag === 'string' ? lexicalNode.tag : 'h2'
        return `<${tag}>${inlineNodesToHtml(children)}</${tag}>`
      }

      if (lexicalNode.type === 'quote') {
        return `<blockquote>${blockNodesToHtml(children)}</blockquote>`
      }

      if (lexicalNode.type === 'list') {
        const tag = lexicalNode.tag === 'ol' || lexicalNode.listType === 'number' ? 'ol' : 'ul'
        const items = children
          .map((item) => {
            if (typeof item !== 'object' || item === null) return ''
            const listItem = item as LexicalNode
            const itemChildren = Array.isArray(listItem.children) ? listItem.children : []
            return `<li>${blockNodesToHtml(itemChildren).replace(/^<p>|<\/p>$/g, '')}</li>`
          })
          .join('')
        return `<${tag}>${items}</${tag}>`
      }

      if (lexicalNode.type === 'listitem') {
        return `<li>${blockNodesToHtml(children)}</li>`
      }

      if (Array.isArray(lexicalNode.children)) {
        return blockNodesToHtml(lexicalNode.children)
      }

      return ''
    })
    .join('')
}

export function lexicalToHtml(content?: LexicalContent | null): string {
  if (!content?.root?.children?.length) return ''
  return blockNodesToHtml(content.root.children)
}

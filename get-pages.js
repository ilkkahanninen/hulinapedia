import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import marked from 'marked'

const pagePath = 'content/pages'
const readDir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

const createInternalLink = title => {
  const url = title.toLowerCase().replace(/\s/g, '_')
  return `[${title}](${url})`
}

export const getPages = async () => {
  const files = (await readDir(pagePath))

  const renderer = new marked.Renderer()

  renderer.image = (href, title, text) => {
    const url = href.includes('://') ? href : `/images/${href}`
    return `<img src="${url}" title="${title}" alt="${text}">`
  }

  renderer.link = (href, title, text) => {
    if (href.includes('://')) {
      return `<a href="${href}" target="_blank">${text}</a>`
    } else if (files.includes(href)) {
      return `<a href="/sivu/${href}">${text}</a>`
    }
    return `<a href="/sivu/${href}" class="missing-target">${text}</a>`
  }

  marked.setOptions({
    renderer,
  })

  return Promise.all(
    files.map(async fileName => {
      const content = (await readFile(path.join(pagePath, fileName)))
        .toString()
        .replace(/\[\[Category:.*?\]\]/g, '') // Remove category links for now
        .replace(/\[\[(.*?)\]\]/g, (match, text) => createInternalLink(text)) // support for mediawiki style internal links
      const titleMatch = content.match(/#+\s*(.*)$/m)
      const imageMatch = content.match(/!\[.*?]\((.*?)\)/)

      return {
        slug: fileName,
        title: titleMatch ? titleMatch[1] : fileName,
        image: imageMatch && imageMatch[1],
        content: marked(content),
      }
    }),
  )
}

getPages()

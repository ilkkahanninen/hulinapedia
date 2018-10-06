import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import marked from 'marked'
import * as yamlFront from 'yaml-front-matter'
import { sluginize } from './utils/sluginize'

const pagePath = 'content/pages'
const readDir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

const createInternalLink = title => {
  const url = title.toLowerCase().replace(/\s/g, '_')
  return `[${title}](${url})`
}

const ensureList = items => {
  if (!items) {
    return []
  }
  if (Array.isArray(items)) {
    return items
  }
  return [items]
}

export const getPages = async () => {
  const files = await readDir(pagePath)

  const renderer = new marked.Renderer()

  renderer.image = (href, title, text) => {
    const url = href.includes('://') ? href : `/images/${href}`
    return `<img src="${url}" title="${text}" alt="${text}">`
  }

  renderer.link = (href, title, text) => {
    if (href.includes('://')) {
      return `<a href="${href}" target="_blank">${text}</a>`
    } else if (files.includes(href)) {
      return `<a href="/sivu/${sluginize(href)}">${text}</a>`
    }
    return `<a href="/sivu/${sluginize(
      href,
    )}" class="missing-target">${text}</a>`
  }

  marked.setOptions({
    renderer,
  })

  return Promise.all(
    files.map(async fileName => {
      const source = (await readFile(path.join(pagePath, fileName))).toString()
      const { __content, ...header } = yamlFront.loadFront(source)
      const content = __content
        .replace(/\[\[Category:.*?\]\]/g, '') // Remove category links for now
        .replace(/\[\[(.*?)\]\]/g, (match, text) => createInternalLink(text)) // support for mediawiki style internal links
      const titleMatch = content.match(/#+\s*(.*)$/m)
      const imageMatch = content.match(/!\[.*?]\((.*?)\)/)
      const description = content
        .split('\n')
        .slice(1)
        .find(n => n)

      return {
        slug: sluginize(fileName),
        file: fileName,
        title: titleMatch ? titleMatch[1] : fileName,
        image: imageMatch && imageMatch[1],
        content: marked(content),
        description,
        categories: ensureList(header.category),
      }
    }),
  )
}

getPages()

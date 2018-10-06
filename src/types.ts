export interface PageData {
  slug: string
  file: string
  title: string
  content: string
  description: string
  categories: string[]
  image?: string
}

export interface MinimalPageData {
  slug: string
  title: string
}

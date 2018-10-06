import React from 'react'
import { withRouteData, Link } from 'react-static'
import { sort } from 'ramda'
import { MinimalPageData } from '../types'

interface CategoryEntry {
  category: string
  pages: MinimalPageData[]

}

interface Props {
  categories: CategoryEntry[]
}

const sortCategories = sort((a: CategoryEntry, b: CategoryEntry) =>
  a.category.localeCompare(b.category, 'fi'),
)

const sortPages = sort((a: MinimalPageData, b: MinimalPageData) =>
  a.title.localeCompare(b.title, 'fi'),
)

export default withRouteData(({ categories }: Props) => {
  return (
    <div>
      <h1>Sivut kategorioittain</h1>
      {sortCategories(categories).map(({ category, pages }) =>
        <div key={category}>
          <h2>{category}</h2>
          <ul>
            {sortPages(pages).map(page => (
              <li key={page.slug}>
                <Link to={`/sivu/${page.slug}`}>{page.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
})

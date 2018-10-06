import React from 'react'
import { withRouteData, Link } from 'react-static'
import { groupBy, keys, sort } from 'ramda'
import { MinimalPageData } from '../types'

interface Props {
  pages: MinimalPageData[]
}

const byFirstLetter = groupBy((page: MinimalPageData) => {
  const letter = page.title.slice(0, 1).toUpperCase()
  return letter.match(/[\wÄÖÅ]/) ? letter : '#'
})

const sortStrings = sort((a: string, b: string) => a.localeCompare(b, 'fi'))

const sortPages = sort((a: MinimalPageData, b: MinimalPageData) =>
  a.title.localeCompare(b.title, 'fi'),
)

export default withRouteData(({ pages }: Props) => {
  const groupedPages = byFirstLetter(pages)
  const letters = keys(groupedPages).map(letter => letter.toString())
  const sortedLetters = sortStrings(letters)

  return (
    <div>
      <h1>Tervetuloa Hulinapedian arkistoon</h1>
      {sortedLetters.map(letter => (
        <div key={letter}>
          <h2>{letter}</h2>
          <ul>
            {sortPages(groupedPages[letter]).map(page => (
              <li key={page.slug}>
                <Link to={`/sivu/${page.slug}`}>{page.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
})

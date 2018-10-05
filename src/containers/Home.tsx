import React from 'react'
import { withRouteData, Link } from 'react-static'
import { groupBy, keys, sort } from 'ramda'
import { PageData } from '../types'

interface Props {
  pages: PageData[]
}

const byFirstLetter = groupBy((page: PageData) => {
  const letter = page.title.slice(0, 1).toUpperCase()
  return letter.match(/[\wÄÖÅ]/) ? letter : '#'
})

const sortStrings = sort((a: string, b: string) => a.localeCompare(b, 'fi'))

const sortPages = sort((a: PageData, b: PageData) =>
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
        <div>
          <h2 key={letter}>{letter}</h2>
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

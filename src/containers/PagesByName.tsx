import React from 'react'
import { withRouteData, Link } from 'react-static'
import { groupBy, keys, sort } from 'ramda'
import { MinimalPageData } from '../types'
import { Helmet } from 'react-helmet'

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

const netlifyIdentifyJS = `
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
`

export default withRouteData(({ pages }: Props) => {
  const groupedPages = byFirstLetter(pages)
  const letters = keys(groupedPages).map(letter => letter.toString())
  const sortedLetters = sortStrings(letters)

  return (
    <div>
      <Helmet>
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js" />
      </Helmet>
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
      <script
        dangerouslySetInnerHTML={{
          __html: netlifyIdentifyJS,
        }}
      />
    </div>
  )
})

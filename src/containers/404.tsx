import React from 'react'
import { withRouteData } from 'react-static'
import * as R from 'ramda'

const getPageId = R.pipe(
  R.split('/'),
  R.last,
)

const capitalize = (str: string) => str.slice(0, 1).toUpperCase() + str.slice(1)

export default withRouteData(({ match }: { match: { url: string } }) => {
  const id = getPageId(match.url)
  const slug = id.replace(/\s/g, '_').toLowerCase()
  const title = capitalize(id.replace(/_/g, ' '))
  const body = `%23%20${title}`

  return (
    <div>
      <h1>{title}</h1>
      <p className="error">
        Tätä sivua ei vielä ole, mutta ehkä vielä joku päivä tämäkin on.
      </p>
      <hr />
      <a
        href={`https://github.com/ilkkahanninen/hulinapedia/new/master/content/pages/${slug}?filename=${slug}&value=${body}`}
      >
        Luo uusi sivu GitHubissa
      </a>
    </div>
  )
})

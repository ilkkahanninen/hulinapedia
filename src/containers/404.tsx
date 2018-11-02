import React from 'react'
import { withRouteData, Redirect } from 'react-static'
import * as R from 'ramda'
import { sluginize } from '../../utils/sluginize'

const getPageId = R.pipe(
  R.split('/'),
  R.last,
)

const capitalize = (str: string) => str.slice(0, 1).toUpperCase() + str.slice(1)

export default withRouteData(({ match }: { match: { url: string } }) => {
  const id = getPageId(match.url)
  const slug = sluginize(id)

  if (slug !== id) {
    return <Redirect to={`/sivu/${slug}`} />
  }

  const title = capitalize(id.replace(/_/g, ' '))

  return (
    <div>
      <h1>{title}?</h1>
      <p className="error">
        Tätä sivua ei vielä ole, mutta ehkä vielä joku päivä tämäkin on.
      </p>
      <hr />
      <a href="https://pedia.hulina.org/admin/#/collections/page/new">
        Luo uusi sivu
      </a>
    </div>
  )
})

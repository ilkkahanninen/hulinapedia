import React from 'react'
import { withRouteData } from 'react-static'
import convert from 'htmr'
import { PageData } from '../types'
import { PageMeta } from '../components/PageMeta'

interface Props {
  page: PageData
}

export default withRouteData(({ page }: Props) => (
  <div>
    <PageMeta title={page.title} />
    {convert(page.content)}
    <hr />
    <a
      href={`https://github.com/ilkkahanninen/hulinapedia/edit/master/content/pages/${
        page.slug
      }`}
    >
      Muokkaa sivua GitHubissa
    </a>
  </div>
))

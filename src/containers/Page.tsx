import React from 'react'
import { withRouteData } from 'react-static'
import convert from 'htmr'
import { PageData } from '../types'
import { PageMeta } from '../components/PageMeta'

interface Props {
  page: PageData
}

export default withRouteData(({ page }: Props) => (console.log('page', page),
  <div>
    <PageMeta
      title={page.title}
      image={page.image}
      description={page.description}
    />
    {convert(page.content)}
    <hr />
    <a
      href={`https://github.com/ilkkahanninen/hulinapedia/edit/master/content/pages/${
        page.file
      }`}
    >
      Muokkaa sivua GitHubissa
    </a>
  </div>
))

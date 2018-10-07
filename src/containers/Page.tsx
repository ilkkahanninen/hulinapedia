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
    <PageMeta
      title={page.title}
      image={page.image}
      description={page.description}
    />
    <h1>{page.title}</h1>
    {convert(page.content)}
    <hr />
    <a
      href={`https://hulinapedia.netlify.com/admin/#/collections/page/entries/${
        page.file
      }`}
    >
      Muokkaa sivua
    </a>
  </div>
))

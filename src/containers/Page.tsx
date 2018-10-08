import React from 'react'
import { withRouteData, Link } from 'react-static'
import convert from 'htmr'
import { PageData } from '../types'
import { PageMeta } from '../components/PageMeta'

interface Props {
  page: PageData
}

const ALink: React.SFC<React.LinkHTMLAttributes<{}>> = ({ href, children }) => (
  <Link to={href}>{children}</Link>
)

const transform = {
  a: ALink,
}

export default withRouteData(({ page }: Props) => (
  <div>
    <PageMeta
      title={page.title}
      image={page.image}
      description={page.description}
      route={`/sivu/${page.slug}`}
    />
    <h1>{page.title}</h1>
    {convert(page.content, { transform })}
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

import * as React from 'react'
import Helmet from 'react-helmet'

interface Props {
  title?: string
  image?: string
}

export const PageMeta: React.SFC<Props> = ({ title }) => (
  <Helmet>
    <title>Hulinapedia{title ? ` – ${title}` : ''}</title>
  </Helmet>
)
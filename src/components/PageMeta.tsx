import * as React from 'react'
import { Head } from 'react-static'

interface Props {
  title?: string
  description?: string
  image?: string
  route?: string
}

export const PageMeta: React.SFC<Props> = ({
  title,
  image,
  description,
  route,
}) => {
  const fullTitle = `Hulinapedia${title ? ` – ${title}` : ''}`
  const descr = description || 'Hulinan virallinen sala-arkisto'
  const imageSrc = `https://pedia.hulina.org/images/${image ||
    'hulina-opengraph.png'}`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={descr} />
      <meta property="og:site_name" content="Hulinapedia" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={descr} />
      <meta property="og:image" content={imageSrc} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`https://pedia.hulina.org${route}/`}
      />
      <meta property="og:locale" content="fi_FI" />
    </Head>
  )
}

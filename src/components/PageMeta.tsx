import * as React from 'react'
import Helmet from 'react-helmet'

interface Props {
  title?: string
  description?: string
  image?: string
}

export const PageMeta: React.SFC<Props> = ({ title, image, description }) => {
  const fullTitle = `Hulinapedia${title ? ` – ${title}` : ''}`
  const descr = description || 'Hulinan virallinen sala-arkisto'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={descr} />

      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={descr} />
      {image && (
        <meta
          property="og:image"
          content={`https://hulinapedia.netlify.com/images/${image}`}
        />
      )}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://hulinapedia.netlify.com" />
      <meta property="og:title" content={title} />
      <meta property="og:locale" content="fi_FI" />

      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={descr} />
      {image && (
        <meta
          property="twitter:image"
          content={`https://hulinapedia.netlify.com/images/${image}`}
        />
      )}
    </Helmet>
  )
}

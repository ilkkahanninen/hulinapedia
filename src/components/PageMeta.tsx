import * as React from 'react'
import { Head } from 'react-static'

interface Props {
  title?: string
  description?: string
  image?: string
}

export const PageMeta: React.SFC<Props> = ({ title, image, description }) => {
  const fullTitle = `Hulinapedia${title ? ` – ${title}` : ''}`
  const descr = description || 'Hulinan virallinen sala-arkisto'
  const imageSrc = `https://hulinapedia.netlify.com/images/${image ||
    'hulina-opengraph.png'}`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={descr} />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={descr} />
      <meta property="og:image" content={imageSrc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://hulinapedia.netlify.com" />
      <meta property="og:title" content={title} />
      <meta property="og:locale" content="fi_FI" />
    </Head>
  )
}

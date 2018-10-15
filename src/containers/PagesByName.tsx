import React from 'react'
import { withRouteData, Link } from 'react-static'
import { MinimalPageData } from '../types'
import { Helmet } from 'react-helmet'

interface Props {
  pages: Array<{ letter: string; pages: MinimalPageData[] }>
}

const netlifyIdentifyJS = `
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
`

export default withRouteData(({ pages }: Props) => (
  <div>
    <Helmet>
      <script src="https://identity.netlify.com/v1/netlify-identity-widget.js" />
    </Helmet>
    <h1>Hakemisto</h1>
    {pages.map(({ letter, pages: pagesList }) => (
      <div key={letter}>
        <h2>{letter}</h2>
        <ul>
          {pagesList.map(page => (
            <li key={page.slug}>
              <Link to={`/sivu/${page.slug}`}>{page.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
    <script
      dangerouslySetInnerHTML={{
        __html: netlifyIdentifyJS,
      }}
    />
  </div>
))

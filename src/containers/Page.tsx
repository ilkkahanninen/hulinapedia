import React from 'react'
import { withRouteData } from 'react-static'
import convert from 'htmr'
import { PageData } from '../types'
import { PageMeta } from "../components/PageMeta";

interface Props {
  page: PageData
}

export default withRouteData(({ page }: Props) => (
  <div>
    <PageMeta title={page.title} />
    {convert(page.content)}
  </div>
))

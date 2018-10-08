import React from 'react'
import { reloadRoutes } from 'react-static/node'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import path from 'path'
import chokidar from 'chokidar'
import * as R from 'ramda'
import { getPages } from './get-pages'

// Paths Aliases defined through tsconfig.json
const typescriptWebpackPaths = require('./webpack.config.js')

chokidar.watch('content').on('all', () => reloadRoutes())

const getCategories = R.pipe(
  R.pluck('categories'),
  R.unnest,
  R.uniq,
)

const minimalPageData = R.pick(['slug', 'title'])

export default {
  siteRoot: 'https://hulinapedia.netlify.com/',
  entry: path.join(__dirname, 'src', 'index.tsx'),
  getSiteData: () => ({}),
  getRoutes: async () => {
    const pages = await getPages()
    const pageList = pages.map(minimalPageData)
    const categories = getCategories(pages)

    return [
      {
        path: '/',
        component: 'src/containers/PagesByName',
        getData: () => ({
          pages: pageList,
        }),
      },
      {
        path: '/kategoriat',
        component: 'src/containers/PagesByCategory',
        getData: () => ({
          categories: R.zipWith(
            category => ({
              category,
              pages: pages
                .filter(page => page.categories.includes(category))
                .map(minimalPageData),
            }),
            categories,
            categories,
          ),
        }),
      },
      ...pages.map(page => ({
        path: `/sivu/${page.slug}`,
        component: 'src/containers/Page',
        getData: () => ({ page }),
      })),
      {
        is404: true,
        component: 'src/containers/404',
      },
    ]
  },
  renderToHtml: async (render, Component) =>
    render(<Component />).replace(/\sdata-react-helmet="true"/g, ''),
  webpack: (config, { defaultLoaders }) => {
    // Add .ts and .tsx extension to resolver
    config.resolve.extensions.push('.ts', '.tsx')

    // Add TypeScript Path Mappings (from tsconfig via webpack.config.js)
    // to react-statics alias resolution
    config.resolve.alias = typescriptWebpackPaths.resolve.alias

    // We replace the existing JS rule with one, that allows us to use
    // both TypeScript and JavaScript interchangeably
    config.module.rules = [
      {
        oneOf: [
          {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: defaultLoaders.jsLoader.exclude, // as std jsLoader exclude
            use: [
              {
                loader: 'babel-loader',
              },
              {
                loader: require.resolve('ts-loader'),
                options: {
                  transpileOnly: true,
                },
              },
            ],
          },
          defaultLoaders.cssLoader,
          defaultLoaders.fileLoader,
        ],
      },
    ]

    config.plugins.push(new ExtractTextPlugin('styles.css'))

    return config
  },
}

import 'full-icu'
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
const stringCompare = new Intl.Collator('fi-FI').compare

export default {
  siteRoot: 'https://pedia.hulina.org/',
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
        priority: 1,
        getData: () => {
          const byFirstLetter = R.groupBy(page => {
            const letter = page.title.slice(0, 1).toUpperCase()
            return letter.match(/[\wÄÖÅ]/) ? letter : '#'
          })

          const sortStrings = R.sort(stringCompare)

          const sortPages = R.sort((a, b) => stringCompare(a.title, b.title))

          const groupedPages = byFirstLetter(pageList)
          const letters = R.keys(groupedPages).map(letter => letter.toString())
          const sortedLetters = sortStrings(letters)

          return {
            pages: sortedLetters.map(letter => ({
              letter,
              pages: sortPages(groupedPages[letter]),
            })),
          }
        },
      },
      {
        path: '/kategoriat',
        component: 'src/containers/PagesByCategory',
        priority: 1,
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

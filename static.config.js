import { reloadRoutes } from 'react-static/node'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import path from 'path'
import chokidar from 'chokidar'
import { getPages } from './get-pages'

// Paths Aliases defined through tsconfig.json
const typescriptWebpackPaths = require('./webpack.config.js')

chokidar.watch('content').on('all', () => reloadRoutes())

export default {
  entry: path.join(__dirname, 'src', 'index.tsx'),
  getSiteData: () => ({
    title: 'Hulinapedia',
  }),
  getRoutes: async () => {
    const pages = await getPages()
    return [
      {
        path: '/',
        component: 'src/containers/Home',
        getData: () => ({ pages }),
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

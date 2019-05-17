const { distPath, appEntryFilePath, resolveModulesPathsArray } = require('./paths')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    index: [appEntryFilePath],
  },

  output: {
    path: distPath,
    filename: '[name].js',
    libraryTarget: 'umd',
  },

  resolve: {
    extensions: ['.js', '.sass', '.json', '.ts', '.tsx'],
    modules: resolveModulesPathsArray,
  },

  plugins: [new CleanWebpackPlugin()],

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /(node_module|dist)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
          {
            loader: 'ts-loader',
          },
          {
            // You should write this line
            // loader: '@stav/babel-plugin-module-resolver-loader',
            // I write this line because I created this example before publishing to npm
            loader: path.resolve('../src/index.js'),
            options: {
              // all those options will go directly to babel-plugin-module-resolver plugin.
              // Read babel-plugin-module-resolver DOCS to see all options:
              // https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md
              root: resolveModulesPathsArray,
              extensions: ['.js', '.jsx', '.d.ts', '.ts', '.tsx'],
            },
          },
        ],
      },
    ],
  },
}

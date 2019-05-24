const CleanWebpackPlugin = require('clean-webpack-plugin')
const { distPath, appEntryFilePath, resolveModulesPathsArray, eslintRcPath } = require('./paths')

module.exports = (env, argv) => {
  const isDevelopmentMode = argv.mode === 'development'
  return {
    devtool: isDevelopmentMode ? 'source-map' : 'none',

    entry: {
      index: [appEntryFilePath],
    },

    target: 'node',

    externals: {
      '@babel/core': '@babel/core',
      '@babel/parser': '@babel/parser',
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
              loader: 'eslint-loader',
              options: {
                failOnError: true,
                failOnWarning: isDevelopmentMode,
                configFile: eslintRcPath,
              },
            },
          ],
        },
      ],
    },
  }
}

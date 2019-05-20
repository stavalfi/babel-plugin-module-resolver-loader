const core = require('@babel/core')
const parser = require('@babel/parser')
const { getOptions } = require('loader-utils')

module.exports = function(source) {
  const callback = this.async()

  const options = getOptions(this)

  const ast = parser.parse(source, {
    sourceFilename: this.resourcePath,
    babelrc: false,
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  core.transformFromAst(
    ast,
    source,
    {
      filename: this.resourcePath,
      babelrc: false,
      plugins: [['module-resolver', options]],
    },
    (error, { code, map }) => {
      console.log(options)
      console.log('code: ', code)
      return error ? callback(error) : callback(null, code, map)
    },
  )
}

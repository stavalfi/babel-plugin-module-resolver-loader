const core = require('@babel/core')
const parser = require('@babel/parser')
const { getOptions } = require('loader-utils')

module.exports = function(source, map) {
  const callback = this.async()

  const options = getOptions(this)

  const ast = parser.parse(source, {
    sourceFilename: this.resourcePath,
    babelrc: false,
    sourceType: 'module',
    plugins: [
      'jsx',
      'typescript',
      'classProperties',
      'asyncGenerators',
      'bigInt',
      'classPrivateProperties',
      'classPrivateMethods',
      'decorators-legacy',
      'doExpressions',
      'dynamicImport',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'functionBind',
      'functionSent',
      'importMeta',
      'logicalAssignment',
      'nullishCoalescingOperator',
      'numericSeparator',
      'objectRestSpread',
      'optionalCatchBinding',
      'optionalChaining',
      'partialApplication',
      [
        'pipelineOperator',
        {
          proposal: 'smart',
        },
      ],
      'throwExpressions',
    ],
  })

  core.transformFromAst(
    ast,
    source,
    {
      filename: this.resourcePath,
      babelrc: false,
      retainLines: true,
      inputSourceMap: map,
      plugins: [['module-resolver', options]],
    },
    (error, { code, map }) => (error ? callback(error) : callback(null, code, map)),
  )
}

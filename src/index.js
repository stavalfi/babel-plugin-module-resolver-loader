const core = require('@babel/core')
const parser = require('@babel/parser')
const { getOptions } = require('loader-utils')
const recast = require('recast')

module.exports = function(source, map) {
  const callback = this.async()
  const options = getOptions(this)

  // I'm using recast parser to preserve the way the code looks
  // without removing/changing comments locations.
  // Reason: https://github.com/stavalfi/babel-plugin-module-resolver-loader/issues/4
  const ast = recast.parse(source, {
    inputSourceMap: map,
    parser: {
      parse: source1 =>
        parser.parse(source1, {
          sourceFilename: this.resourcePath,
          babelrc: false,
          sourceType: 'module',
          plugins: ['jsx', 'typescript'],
        }),
    },
  })

  core
    .transformAsync('', {
      ast: true,
      filename: this.resourcePath,
      code: false,
      configFile: false,
      plugins: [
        // For some reason, recast doesn't work with transformFromAst.
        // Use this hack instead.
        [setAst, { ast }],
      ].concat([['module-resolver', options]]),
    })
    .then(output => {
      const { code, map } = recast.print(output.ast)
      callback(null, code, map)
    })
    .catch(callback)
}

function setAst(babel, { ast }) {
  return {
    visitor: {
      Program(path) {
        path.replaceWith(ast.program)
      },
    },
  }
}

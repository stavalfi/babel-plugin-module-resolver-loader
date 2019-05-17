const path = require('path')

const rootPath = path.resolve(__dirname)
const srcPath = path.resolve(rootPath, 'src')
const appEntryFilePath = path.resolve(srcPath, 'index.js')
const distPath = path.join(rootPath, 'dist')
const eslintRcPath = path.join(rootPath, '.eslintrc')
const nodeModulesPath = path.resolve(rootPath, 'node_modules')
const resolveModulesPathsArray = [srcPath, nodeModulesPath]

module.exports = {
  rootPath,
  srcPath,
  nodeModulesPath,
  eslintRcPath,
  distPath,
  appEntryFilePath,
  resolveModulesPathsArray,
}

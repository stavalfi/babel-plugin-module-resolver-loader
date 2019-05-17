const path = require('path')

const rootPath = path.resolve(__dirname)
const tsconfigPath = path.resolve(rootPath, 'tsconfig.json')
const tsconfigTestPath = path.resolve(rootPath, 'tsconfig.test.json')
const mainNodeModulesPath = path.resolve(rootPath, '..', '..', 'node_modules')
const srcPath = path.resolve(rootPath, 'src')
const typesDtsPath = path.resolve(srcPath, 'index.d.ts')
const appEntryFilePath = path.resolve(srcPath, 'index.ts')
const distPath = path.join(rootPath, 'dist')
const eslintRcPath = path.join(rootPath, '.eslintrc')
const nodeModulesPath = path.resolve(rootPath, 'node_modules')
const componentsPath = path.resolve(srcPath, 'components')
const resolveModulesPathsArray = [srcPath, nodeModulesPath, mainNodeModulesPath]
module.exports = {
  rootPath,
  tsconfigPath,
  tsconfigTestPath,
  srcPath,
  componentsPath,
  nodeModulesPath,
  mainNodeModulesPath,
  eslintRcPath,
  distPath,
  appEntryFilePath,
  typesDtsPath,
  resolveModulesPathsArray,
}

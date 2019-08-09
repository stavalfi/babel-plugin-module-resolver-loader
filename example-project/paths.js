const path = require('path')

const rootPath = path.resolve(__dirname)
const tsconfigPath = path.resolve(rootPath, 'tsconfig.json')
const tsconfigTestPath = path.resolve(rootPath, 'tsconfig.test.json')
const mainNodeModulesPath = path.resolve(rootPath, 'node_modules')
const srcPath = path.resolve(rootPath, 'src')
const typesDtsPath = path.resolve(srcPath, 'index.d.ts')
const appEntryFilePath = path.resolve(srcPath, 'index.tsx')
const distPath = path.join(rootPath, 'dist')
const eslintRcPath = path.join(rootPath, '.eslintrc')
const componentsPath = path.resolve(srcPath, 'components')
module.exports = {
  rootPath,
  tsconfigPath,
  tsconfigTestPath,
  srcPath,
  componentsPath,
  mainNodeModulesPath,
  eslintRcPath,
  distPath,
  appEntryFilePath,
  typesDtsPath,
}

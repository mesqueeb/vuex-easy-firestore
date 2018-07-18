// npm i -D babel-core babel-plugin-external-helpers babel-plugin-transform-object-rest-spread babel-preset-env rollup rollup-plugin-babel rollup-plugin-commonjs rollup-plugin-node-resolve rollup-plugin-terser
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'

// ------------------------------------------------------------------------------------------
// formats
// ------------------------------------------------------------------------------------------
// cjs – CommonJS, suitable for Node and Browserify/Webpack
// es – Keep the bundle as an ES module file
// iife – A self-executing function, suitable for inclusion as a <script> tag. (If you want to create a bundle for your application, you probably want to use this, because it leads to smaller file sizes.)
// umd – Universal Module Definition, works as amd, cjs and iife all in one

// ------------------------------------------------------------------------------------------
// setup
// ------------------------------------------------------------------------------------------
const indexFileName = 'index'
const formats = ['cjs', 'es']
const exportFolder = 'dist'
const extraBuildFileNames = ['../test/helpers/index']
const extraBuildFormats = ['cjs']
const extraExportFolder = ''
const minify = false
const sourcemap = false
const _plugins = [
  // resolve({only: ['deepmerge']}),
  babel({
    exclude: 'node_modules/**' // only transpile our source code
  }),
  commonjs()
]
// ------------------------------------------------------------------------------------------
const pkg = require('../package.json')
const name = pkg.name
const className = name.replace(/(^\w|-\w)/g, c => c.replace('-', '').toUpperCase())
const external = Object.keys(pkg.dependencies || [])
  // .filter(p => p !== 'deepmerge')

// ------------------------------------------------------------------------------------------
// build helpers
// ------------------------------------------------------------------------------------------
function output (targetFileName, ext, format) {
  let _exportFolder = extraBuildFileNames.includes(targetFileName)
    ? extraExportFolder
    : exportFolder
  if (_exportFolder) _exportFolder = _exportFolder + '/'
  targetFileName = targetFileName.replace(/^\.\.\//, '')
  return {
    name: className,
    sourcemap,
    exports: 'named',
    file: `${_exportFolder}${targetFileName}.${ext}`,
    format
  }
}
function buildTemplate (targetFileName, format, minified = false) {
  const plugins = (minified)
    ? _plugins.concat(terser())
    : _plugins
  const ext = (minified)
    ? `${format}.min.js`
    : `${format}.js`
  return {
    input: `src/${targetFileName}.js`,
    output: output(targetFileName, ext, format),
    plugins,
    external
  }
}

// ------------------------------------------------------------------------------------------
// builds
// ------------------------------------------------------------------------------------------
const files = [indexFileName].concat(extraBuildFileNames)
const builds = files.reduce((carry, file) => {
  formats.forEach(format => {
    if (extraBuildFileNames.includes(file) && !extraBuildFormats.includes(format)) return
    carry.push(buildTemplate(file, format))
    if (minify) carry.push(buildTemplate(file, format, true))
  })
  return carry
}, [])

export default builds

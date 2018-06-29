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
const pkg = require('../package.json')
const name = pkg.name
const className = name.replace(/(^\w|-\w)/g, c => c.replace('-', '').toUpperCase())
const external = Object.keys(pkg.dependencies || [])
  .filter(p => p !== 'deepmerge')
const _plugins = [
  resolve({only: ['deepmerge']}),
  babel({
    exclude: 'node_modules/**', // only transpile our source code
  }),
  commonjs(),
]

// ------------------------------------------------------------------------------------------
// build helpers
// ------------------------------------------------------------------------------------------
function output (ext, format) {
  return {
    name: className,
    sourcemap: true,
    file: `dist/index.${ext}`,
    format
  }
}
function buildTemplate (format, minified = false) {
  const plugins = (minified)
    ? _plugins.concat(terser())
    : _plugins
  const ext = (minified)
    ? `${format}.min.js`
    : `${format}.js`
  return {
    input: `src/index.js`,
    output: output(ext, format),
    plugins,
    external
  }
}

// ------------------------------------------------------------------------------------------
// builds
// ------------------------------------------------------------------------------------------
const formats = ['umd', 'cjs', 'es', 'iife']
const regBuilds = formats.map(format => buildTemplate(format))
const minBuilds = formats.map(format => buildTemplate(format, true))
const result = regBuilds.concat(minBuilds)

export default result

module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.ts',
      'dist/**/*.js'
    ],
    tests: [
      'test/**/*.js'
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    compilers: {
      'test/helpers/index.cjs.js': wallaby.compilers.babel({
        presets: ['@babel/env', '@ava/babel-preset-stage-4'],
        plugins: ['babel-plugin-transform-object-rest-spread']
      }),
      '**/*.+(js|ts)': wallaby.compilers.typeScript({allowJs: true, outDir: './bin'}),
    },
    preprocessors: {
      '**/*.jsts': file => file.changeExt('js').content
    },
    testFramework: 'ava',
    debug: true
  }
}

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
    // compilers: {
    //   '**/*.+(js|ts)': wallaby.compilers.typeScript({allowJs: true, outDir: './bin'}),
    // },
    // preprocessors: {
    //   '**/*.jsts': file => file.changeExt('js').content
    // },
    compilers: {
      '**/*.js': wallaby.compilers.babel({
        presets: ['@babel/env', '@ava/babel-preset-stage-4']
      }),
    },
    preprocessors: {
      '**/*.js': file => require('@babel/core').transform(
        file.content,
        {
          sourceMap: true, compact: false, filename: file.path,
          presets: ['@babel/env', '@ava/babel-preset-stage-4']
        })
    },
    testFramework: 'ava',
    debug: true
  }
}

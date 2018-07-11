module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.js',
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
      '+(src|test)/**/*.js': wallaby.compilers.babel({
        presets: ['env', '@ava/babel-preset-stage-4'],
        plugins: ['babel-plugin-transform-object-rest-spread']
      })
    },
    testFramework: 'ava',
    debug: true
  }
}

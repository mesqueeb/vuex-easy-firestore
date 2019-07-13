
module.exports = {
  title: 'Vuex Easy Firestore 🔥',
  description: 'Easy coupling of firestore and vuex. 2-way sync with 0 boilerplate!',
  base: '/vuex-easy-firestore/',
  plugins: [['@vuepress/google-analytics', {ga: 'UA-92965499-3'}]],
  themeConfig: {
    sidebarDepth: 1,
    displayAllHeaders: true,
    sidebar: [
      ['/setup', 'Installation & setup'],
      '/add-and-manage-data',
      '/query-data',
      '/firestore-fields-and-functions',
      '/hooks',
      '/extra-features',
      ['/faq', 'FAQ'],
      '/config-example',
      '/feedback',
    ],
    nav: [
      { text: 'Changelog', link: 'https://github.com/mesqueeb/vuex-easy-firestore/releases' },
    ],
    repo: 'mesqueeb/vuex-easy-firestore',
    repoLabel: 'Github',
    docsDir: 'docs',
    docsBranch: 'dev',
    editLinks: true,
  }
}

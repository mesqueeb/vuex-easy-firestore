# VuexEasyFirestore

Easy coupling of firestore and a vuex module. 2-way sync with 0 boilerplate!

<WIP> This is a work in progress but is fully functional.

## Beta version usable!

What it does:

- Setup logic to connect vuex module with firebase collection.
- Handy actions for the CRUD logic of your firebase collection.

Todo:

- Better documentation

### Table of contents

<!-- TOC -->

- [Motivation](#motivation)
- [Installation](#installation)
- [Setup](#setup)
    - [Config options](#config-options)
- [Usage](#usage)
    - [Automatic 2-way sync](#automatic-2-way-sync)
    - [Editing](#editing)
    - [Fetching](#fetching)
    - [Custom state/getters/mutations/actions](#custom-stategettersmutationsactions)
- [Feedback](#feedback)

<!-- /TOC -->

## Motivation

Get all the firebase boilerplate installed for you in one vuex module.

## Installation

```bash
npm i --save vuex-easy-firestore
```

## Setup
The configuration as seen below is how you set up vuex-easy-firestore. This is to be repeated for each firestore collection you want to sync.

```js
import createEasyFirestore from 'vuex-easy-firestore'
const config = {
  // Your configuration!
  moduleNameSpace: 'user/favourites',
    // this is the vuex module path that will be created
  docsStateProp: 'docs',
    // this is the state property where your docs will end up inside the module
  firestorePath: 'users/{userId}/favourites',
    // this is the firestore collection path to your documents. You can use `{userId}` which will be replaced with `Firebase.auth().uid`
  firestoreRefType: 'collection', // or 'doc'
    // depending if what you want to sync is a whole collection or a single doc
  vuexUserPath: '',
    // the path where your firebase user gets saved in vuex. Required to be able to have reactivity after login.
  // SEE `src/module/defaultConfig` for more!
}
// do the magic 🧙🏻‍♂️
const easyFirestore = createEasyFirestore(config)
// and include as plugin in your vuex store:
store: {
  // ... your store
  plugins: [easyFirestore]
}
```

### Config options

About the config file, better documentation will follow. For now see [src/module/defaultConfig](https://github.com/mesqueeb/VuexEasyFirestore/blob/master/src/module/defaultConfig.js) for a list with all possibilities.

You can also add other state/getters/mutations/actions to the module that will be generated. See [Custom state/getters/mutations/actions](#custom-stategettersmutationsactions) for details.

## Usage

### Automatic 2-way sync

You need to dispatch the following action once to open the channel to your firestore.

```js
dispatch('user/favourites/openDBChannel')
  .then(console.log)
  .catch(console.error)
```

Doesn't require any callback. The results will be saved in your vuex store at the path you have set:<br>
`moduleNameSpace` + `docsStateProp` which is in this example 'user/favourites/docs'.

To automatically edit your vuex store & have firebase always in sync you just need to use the actions that were set up for you:

### Editing

With these 4 actions below you can edit the docs in your vuex module.
Anything you change will be automaticall changed in firestore as well!

```js
dispatch('user/favourites/set', doc) // will dispatch `patch` OR `insert` automatically
dispatch('user/favourites/patch', doc)
dispatch('user/favourites/insert', doc)
dispatch('user/favourites/delete', id)
```

With just the commands above you have complete in-sync vuex store & firestore!

You can also access the `set` action through `store.set(path, doc)`. So for the example above that would be: `store.set('user/favourites', doc)`.

For this shortcut usage, add the npm module 'vuex-easy-access' and check its [documentation](https://github.com/mesqueeb/VuexEasyAccess)!

### Fetching

Say that you have a default filter set on the documents you are syncing when you `openDBChannel` (see above). And at some points you want to get extra documents with other filters. (eg. archived posts) In this case you can use the fetch action to retrieve documents from the same firestore path your module is synced to:

```js
// Fetch docs
// @params {array} whereFilters an array of arrays with the filters you want. eg. `[['field', '==', false], ...]`
// @params {array} orderBy the params of the firebase collection().orderBy() eg. `['created_date']`
// @returns the docs
dispatch('user/favourites/fetch', {whereFilters = [], orderBy = []})
  .then(console.log)
  // you have to manually write the logic for what you want to do with the fetched documents.
  .catch(console.error)
```

### Custom state/getters/mutations/actions

You can add other stuff in your firestore module as you normally would by adding it in your config file.
```js
const vuexEasyFirestoreConfig = {
  // your config...
  state: {}, // extra state properties
  getters: {}, // extra getters
  mutations: {}, // extra mutations
  actions: {}, // extra actions
}
```

## Feedback

Do you have questions, comments, suggestions or feedback? Or any feature that's missing that you'd love to have? Feel free to open an issue! ♥

Also check out the sister vuex-plugin [Vuex Easy Access](https://github.com/mesqueeb/VuexEasyAccess)!

--

Happy Vuexing!<br>
-Luca Ban
# VuexEasyFirestore

Easy coupling of firestore and a vuex module. 2-way sync with 0 boilerplate!

WIP

## First alpha works!
Includes:

- Setup logic to connect vuex module with firebase collection.
- Handy actions for the CRUD logic of your firebase collection.

Todo:

- Refinements
- Documentation

### Table of contents

<!-- TOC -->

- [Motivation](#motivation)
- [Setup](#setup)
- [Usage](#usage)
    - [Automatic 2-way sync](#automatic-2-way-sync)
    - [Editing](#editing)
    - [Fetching](#fetching)
    - [Custom state/getters/mutations/actions](#custom-stategettersmutationsactions)

<!-- /TOC -->

## Motivation

Get all the firebase boilerplate installed for you in one vuex module.

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
  // SEE `src/module/defaultConfig` for more!
}
// do the magic 🧙🏻‍♂️
const easyFirestore = createEasyFirestore(config)
// and include as module in your vuex store:
store: {
  // ... your store
  plugins: [easyFirestore]
}
```

### Config options

About the config file, better documentation will follow. For now see `src/module/defaultConfig` for all possibilities.

You can also add other state/getters/mutations/actions to the module that will be generated. See [Custom state/getters/mutations/actions](#custom-stategettersmutationsactions) for details.

## Usage

### Automatic 2-way sync

You need to dispatch the following action once to open the channel to your firestore.

```js
dispatch('user/favourites/openDBChannel')
  .then(console.log)
  .catch(console.error)
```

To automatically edit your vuex store & have firebase always in sync you just need to use the actions that were set up for you.

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

### Fetching
```js
// Fetch docs
// @params {array} whereFilters an array of arrays with the filters you want. eg. `[['field', '==', false], ...]`
// @params {array} orderBy the params of the firebase collection().orderBy() eg. `['created_date']`
// @returns the docs
dispatch('user/favourites/fetch', {whereFilters = [], orderBy = []})
```

You only ever need to use the 5 actions above. You can look at `src/module/actions` for what's more under the hood.

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

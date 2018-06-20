# VuexEasyFirestore

Easy coupling of firestore and a vuex module. 2-way sync with 0 boilerplate!

WIP

## First alpha works!
Includes:

- Setup logic to connect vuex module with firebase collection.
- Handy actions for the CRUD logic of your firebase collection.

Todo:

- Auto sync with watchers
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
import autoFirestore from 'vuex-easy-firestore'
const config = {
  // Your configuration!
  // SEE `module/defaultConfig` for examples
}
// do the magic 🧙🏻‍♂️
const firestore = autoFirestore(config)
// and include as module in your vuex store:
store: {
  modules: {
    firestore
  }
}
```

### Config options

About the config file, better documentation will follow. For now see `module/defaultConfig`

<!-- - `vuexstorePath: ''` must be relative to rootState
- `firestorePath: ''` -->
<!-- - mapType: 'collection', // 'collection' only ('doc' not integrated yet) -->
  <!-- - type: '2way', // '2way' only ('1way' not yet integrated) -->
<!-- - `sync.where: []`
- `sync.orderBy: []`
- `sync.defaultValues: {}`
  You HAVE to set all fields you want to be reactive on beforehand!
  These values are only set when you have items who don't have the props defined in defaultValues upon retrieval
  These default values will be merged with a reverse Object.assign on retrieved documents
- `sync.added: syncHookFn`
- `sync.modified: syncHookFn`
- `sync.removed: syncHookFn` -->

<!-- synchookFn example:
```js
/**
 * A function executed during the 2 way sync when docs are added/modified/deleted. NEEDS TO EXECUTE FIRST PARAM! You can use this function to do a conditional check on the documents to decide if/when to execute the store update.
 *
 * @param {function} storeUpdateFn this is the function that will make changes to your vuex store. Takes no params.
 * @param {object} store the store for usage with `store.dispatch`, `store.commit`, `store.getters` etc.
 * @param {string} id the doc id returned in `change.doc.id` (see firestore documentation for more info)
 * @param {object} doc the doc returned in `change.doc.data()` (see firestore documentation for more info)
 * @param {string} source of the change. Can be 'local' or 'server'
 */
function syncHook (storeUpdateFn, store, id, doc, source, change) {
  // throw error if you want to stop the document in your store from being modified
  // do some stuff
  storeUpdateFn()
  // do some stuff
}
``` -->

<!-- - `fetch.docLimit: 50` // defaults to 50
- `insert.checkCondition (doc, storeRef) { return (params == 'something') }`
- `insert.fillables: []`
- `insert.guard: []`
- `patch.checkCondition (id, fields, storeRef) { return (params == 'something') }`
- `patch.fillables: []`
- `patch.guard: []`
- `delete.checkCondition (id, storeRef) { return (params == 'something') }` -->

## Usage

### Automatic 2-way sync

You need to dispatch the following action once to open the channel to your firestore.

```js
dispatch('firestore/openDBChannel')
  .then(console.log)
  .catch(console.error)
```

For now any changes need to be notified manually. See 'Editing' below.

Automatic 2 way sync is a WIP.

### Editing

The many actions you get for free:

```js
dispatch('firestore/patch', {id = '', ids = [], field = '', fields = []})
dispatch('firestore/delete', {id = '', ids = []})
dispatch('firestore/insert', {item = {}, items = []})
```

All changes through the functions above work with batches.

### Fetching
```js
// Fetch docs
// @params {array} whereFilters an array of arrays with the filters you want. eg. `[['field', '==', false], ...]`
// @params {array} orderBy the params of the firebase collection().orderBy() eg. `['created_date']`
// @returns the docs
dispatch('firestore/fetch', {whereFilters = [], orderBy = []})
```

See `module/actions` for a full list.

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

<!-- ## Build from source

```bash
npm run build
``` -->

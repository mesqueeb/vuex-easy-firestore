# Vuex Easy Firestore

In just 4 lines of code, get your vuex module in complete 2-way sync with firestore.

## What it does:

You literally only need to add these 4 lines to your vuex module and you'll have automatic sync with firestore!

```js
config: {
  firestorePath: 'users/{userId}/data',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'user',
  statePropName: 'docs',
  // the rest of your module here
}
```

and Alakazam! Now you have a vuex module called `user` with `state: {docs: {}}`.
All firestore documents in your collection will be added with the doc's id as key inside `docs` in your state.

Now you just update and add docs with `dispatch('user/set', newItem)` and forget about the rest!

Other features include hooks, fillables (limit props to sync), default values (add props on sync), a fetch function and much more...

### Table of contents

<!-- TOC -->

- [Motivation](#motivation)
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
    - [Automatic 2-way sync](#automatic-2-way-sync)
    - [Editing](#editing)
    - [Shortcut: set(path, doc)](#shortcut-setpath-doc)
    - [Fetching](#fetching)
    - [Sync directly to module state](#sync-directly-to-module-state)
- [Extra features](#extra-features)
    - [Filters](#filters)
    - [Fillables and guard](#fillables-and-guard)
    - [Hooks before insert/patch/delete](#hooks-before-insertpatchdelete)
    - [Hooks after changes on the server](#hooks-after-changes-on-the-server)
    - [defaultValues set after server retrieval](#defaultvalues-set-after-server-retrieval)
- [All config options](#all-config-options)
- [Feedback](#feedback)

<!-- /TOC -->

## Motivation

I didn't like writing an entire an API wrapper from scratch for firestore every single project. If only a vuex module could be in perfect sync with firestore without having to code all the boilerplate yourself...

And that's how Vuex Easy Firestore was born.

## Installation

```bash
npm i --save vuex-easy-firestore
```

## Setup

```js
import createEasyFirestore from 'vuex-easy-firestore'

const userModule = {
  firestorePath: 'users/{userId}/data',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'userData',
  statePropName: 'docs',
  // for more options see below
  // you can also add state/getters/mutations/actions
}

// do the magic 🧙🏻‍♂️
const easyFirestore = createEasyFirestore(userModule)

// and include as PLUGIN in your vuex store:
store: {
  // ... your store
  plugins: [easyFirestore]
}
```

## Usage

### Automatic 2-way sync

After Firebase finds a user through `onAuthStateChanged` you need to dispatch `openDBChannel` once to open the channel to your firestore:

```js
Firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // user is logged in
    store.dispatch('userData/openDBChannel')
      .then(console.log)
      .catch(console.error)
  }
})
```

This doesn't require any callback in particular; the results will be saved in your vuex store at the path you have set:<br>
`moduleName` + `statePropName` which is in this example 'userData/docs'.

To automatically edit your vuex store & have firebase always in sync you just need to use the actions that were set up for you:

### Editing

With these 4 actions below you can edit the docs in your vuex module.
Anything you change will be automaticall changed in firestore as well!

```js
dispatch('userData/set', doc) // will choose to dispatch either `patch` OR `insert` automatically
dispatch('userData/patch', doc)
dispatch('userData/insert', doc)
dispatch('userData/delete', id)
```

With just the commands above you have complete in-sync vuex store & firestore!

### Shortcut: set(path, doc)

You can also access the `set` action through a shortcut: `store.set(path, doc)`. Or with our path: `store.set('userData', doc)`.

For this shortcut usage, import the npm module '[vuex-easy-access](https://github.com/mesqueeb/VuexEasyAccess)' and just add `{vuexEasyFirestore: true}` in its options. Please check the relevant [documentation](https://github.com/mesqueeb/VuexEasyAccess#vuex-easy-firestore-integration-for-google-firebase)!

### Fetching

Say that you have a default filter set on the documents you are syncing when you `openDBChannel` (see [Filters](#filters)). And you want to fetch extra documents with other filters. (eg. archived posts) In this case you can use the fetch action to retrieve documents from the same firestore path your module is synced to:

```js
dispatch('user/favourites/fetch', {whereFilters = [], orderBy = []})
  .then(console.log)
  .catch(console.error)
```

- *whereFilters:* The same as firestore's `.where()`. An array of arrays with the filters you want. eg. `[['field', '==', false], ...]`
- *orderBy:* The same as firestore's `.orderBy()`. eg. `['created_date']`

You have to manually write the logic for what you want to do with the fetched documents.s

### Sync directly to module state

You can sync the doc(s) directly to the module state. This is not recommended for 'collections', because it will be harded to aggregate/count/filter your docs. However, this can be very usefull for syncing a single document.

You can do so like this:

```js
  firestorePath: 'users/{userId}/data/settings',
  firestoreRefType: 'doc',
  moduleName: 'user/settings',
  statePropName: '',
```

In this case however, you need to set up fillables to make sure only the actual settings are synced. A clean way of doing so would be like this:

```js
// a function returns an object with your state
initialState () {
  return {
    favouriteColour: '',
    favouriteNumber: null,
  }
}
// you export your vuex-easy-firestore powered module
// then import to your vuex store and add as plugin
export default {
  // the config from above
  firestorePath: 'users/{userId}/data/settings',
  firestoreRefType: 'doc',
  moduleName: 'user/settings',
  statePropName: '',
  // the state
  state: initialState(),
  // set fillables for vuex-easy-firestore
  sync: {
    fillables: Object.keys(initialState()),
  }
}
```

## Extra features

### Filters

The filters set in `sync: {}` are applied before the DB Channel is openend. They are only available for syncing 'collections'.

- *where:* The same as firestore's `.where()`. An array of arrays with the filters you want. eg. `[['field', '==', false], ...]`
- *orderBy:* The same as firestore's `.orderBy()`. eg. `['created_date']`

```js
{
  // your other config...
  sync: {
    where: [],
    orderBy: [],
  }
}
```

### Fillables and guard

- *Fillables:* Array of keys - the props which may be synced to the server. Any other props will not be synced!
- *Guard:* Array of keys - the props which should not be synced to the server. (the opposite of 'fillables')

```js
{
  // your other config...
  sync: {
    fillables: [],
    guard: [],
  },
}
```

### Hooks before insert/patch/delete

A function where you can check something or even change the doc before the store mutation occurs.
! Must return the `doc`. May return `false` to abort the mutation.

```js
{
  // your other config...
  insertHook: function (doc, store) { return doc },
  patchHook: function (doc, store) { return doc },
  deleteHook: function (id, store) { return id },
}
```

### Hooks after changes on the server

A function where you can check something or even change the doc before the store mutation occurs.
! Must return the `doc`. May return `false` to abort the mutation.

```js
{
  // your other config...
  onServer: {
    addedHook: function (doc, id, store, source, change) { return doc },
    modifiedHook: function (doc, id, store, source, change) { return doc },
    removedHook: function (doc, id, store, source, change) { return doc },
  }
}
```

### defaultValues set after server retrieval

`defaultValues` is an object with props that will be set on each doc that comes from the server. You HAVE to set the props you want to be reactive if some items in firestore don't have those props. The retrieved docs will be deep merged on top of these default values.

```js
{
  // your other config...
  onServer: {
    defaultValues: {},
  }
}
```

## All config options

Here is a list with all possible config options:

```js
const firestoreModule = {
  firestorePath: '', // The path to a collection or doc in firestore. You can use `{userId}` which will be replaced with the user Id.
  firestoreRefType: '', // `'collection'` or `'doc'`. Depending on your `firestorePath`.
  moduleName: '', // The module name. Can be nested, eg. `'user/items'`
  statePropName: '', // The name of the property where the docs or doc will be synced to. If left blank it will be synced on the state of the module. (Please see [Sync directly to module state](#sync-directly-to-module-state) for more info)

  // Related to the 2-way sync:
  sync: {
    where: [],
    orderBy: [],
    fillables: [],
    guard: [],
  },

  // HOOKS:
  insertHook: function (doc, store) { return doc },
  patchHook: function (doc, store) { return doc },
  deleteHook: function (id, store) { return id },

  // When items on the server side are changed:
  onServer: {
    defaultValues: {},
    // HOOKS for changes on SERVER:
    addedHook: function (doc, id, store, source, change) { return doc },
    modifiedHook: function (doc, id, store, source, change) { return doc },
    removedHook: function (doc, id, store, source, change) { return doc },
  },

  // When items are fetched through `dispatch('module/fetch', filters)`.
  fetch: {
    // The max amount of documents to be fetched. Defaults to 50.
    docLimit: 50,
  },

  // You can also add state/getters/mutations/actions:
  state: {}, // Custom state, will be added to the module.
  getters: {}, // Custom getters, will be added to the module.
  mutations: {}, // Custom mutations, will be added to the module.
  actions: {}, // Custom actions, will be added to the module.
}
```

## Feedback

Do you have questions, comments, suggestions or feedback? Or any feature that's missing that you'd love to have? Feel free to open an issue! ♥

Also check out the sister vuex-plugin [Vuex Easy Access](https://github.com/mesqueeb/VuexEasyAccess)!

--

Happy Vuexing!<br>
-Luca Ban
# Vuex Easy Firestore

In just 4 lines of code, get your vuex module in complete 2-way sync with firestore.

## What it does:

You literally only need to add these 4 lines to your vuex module and you'll have automatic sync with firestore!

```js
const firebaseModule = {
  firestorePath: 'users/{userId}/data',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'user',
  statePropName: 'docs',
  // the rest of your module here
}
// add firebaseModule as vuex plugin wrapped in vuex-easy-firestore
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
    - [Multiple modules with 2way sync](#multiple-modules-with-2way-sync)
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

const userDataModule = {
  firestorePath: 'users/{userId}/data',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'userData',
  statePropName: 'docs',
  // for more options see below
  // you can also add state/getters/mutations/actions
}

// do the magic 🧙🏻‍♂️
const easyFirestore = createEasyFirestore(userDataModule)

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
dispatch('userData/patch', doc) // doc needs 'id' prop
dispatch('userData/insert', doc)
dispatch('userData/delete', id)
```

With just the commands above you have complete in-sync vuex store & firestore!

Please note that when using 'collection' mode, the `doc` you set or patch will require a prop with `id`. Any docs retrieved from the server or added via insert will have the id automatically added as the document key but also as a prop on the actual item.

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

### Multiple modules with 2way sync

Of course you can have multiple vuex modules, all in sync with different firestore paths.

```js
const userDataModule = {/* config */}
const anotherModule = {/* config */}
const aThirdModule = {/* config */}
// make sure you choose a different moduleName and firestorePath each time!
const easyFirestores = createEasyFirestore([userDataModule, anotherModule, aThirdModule])
// and include as PLUGIN in your vuex store:
store: {
  // ... your store
  plugins: [easyFirestores]
}
```

### Sync directly to module state

You can sync the doc(s) directly to the module state. (This is not yet compatible for 'collections')

Say your have a vuex-easy-firestore module for `user` with the following settings:

```js
const userModule = {
  firestorePath: 'userSettings/{userId}',
  firestoreRefType: 'doc',
  moduleName: 'user',
  statePropName: 'settings',
  state: {
    settings: {ui: {mode: 'dark'}}
  }
}
```

To update the ui mode to 'light' you would have to do:

```js
dispatch('user/set', {ui: {mode: 'light'}})
```

This is kind of weird because the word "settings" is nowhere to be found... It just says `'user/set'`. It would be much clearer if we can set the settings with `dispatch('user/settings/set')`.

To do this we would have to separate the settings into a settings module. One way to do so is to make the moduleName `'user/settings'` instead of just `'user'`:

```js
const settingsModule = {
  firestorePath: 'userSettings/{userId}',
  firestoreRefType: 'doc',
  moduleName: 'user/settings',
  statePropName: 'settings',
  state: {
    settings: {ui: {mode: 'dark'}}
  }
}
```

But now we have another kind of weird problem! We would have to access settings by `state.user.settings.settings`! Also not very nice... So the best solution is to **sync the settings doc directly to the settings-module's state**.

You can do this like so:

```js
const settingsModule = {
  firestorePath: 'userSettings/{userId}',
  firestoreRefType: 'doc',
  moduleName: 'user/settings',
  statePropName: '', // Leave statePropName blank!
  state: {
    ui: {mode: 'dark'}
  }
}
```

Please note that if you have other state-props in settings that you don't want to be synced you have to add it to the `guard` array (see [guard config](#fillables-and-guard)).

```js
const settingsModule = {
  firestorePath: 'userSettings/{userId}',
  firestoreRefType: 'doc',
  moduleName: 'user/settings',
  statePropName: '',
  state: {
    ui: {mode: 'dark'},
    modalOpened: false,
  },
  sync: {
    guard: ['modalOpenend'] // will not be synced to firestore
  }
}
```

Syncing an entire 'collection' directly to state is not possible. It's being developed now.

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
  }
}
```

### Hooks before insert/patch/delete

A function where you can check something or even change the doc before the store mutation occurs.
! Must call `updateStore(doc)` to make the store mutation.
May choose not to call this to abort the mutation.

```js
{
  // your other config...
  sync: {
    insertHook: function (updateStore, doc, store) { updateStore(doc) },
    patchHook: function (updateStore, doc, store) { updateStore(doc) },
    deleteHook: function (updateStore, id, store) { updateStore(id) },
  }
}
```

### Hooks after changes on the server

Exactly the same as above, but for changes that have occured on the server. You also have some extra parameters to work with:

- *id:* the doc id returned in `change.doc.id` (see firestore documentation for more info)
- *doc:* the doc returned in `change.doc.data()` (see firestore documentation for more info)
- *source:* of the change. Can be 'local' or 'server'

```js
{
  // your other config...
  serverChange: {
    addedHook: function (updateStore, doc, id, store, source, change) { updateStore(doc) },
    modifiedHook: function (updateStore, doc, id, store, source, change) { updateStore(doc) },
    removedHook: function (updateStore, doc, id, store, source, change) { updateStore(doc) },
  }
}
```

### defaultValues set after server retrieval

`defaultValues` is an object with props that will be set on each doc that comes from the server. You HAVE to set the props you want to be reactive if some items in firestore don't have those props. The retrieved docs will be deep merged on top of these default values.

```js
{
  // your other config...
  serverChange: {
    defaultValues: {},
  }
}
```

## All config options

Here is a list with all possible config options:

```js
const firestoreModule = {
  firestorePath: '',
    // The path to a collection or doc in firestore. You can use `{userId}` which will be replaced with the user Id.
  firestoreRefType: '',
    // `'collection'` or `'doc'`. Depending on your `firestorePath`.
  moduleName: '',
    // The module name. Can be nested, eg. `'user/items'`
  statePropName: '',
    // The name of the property where the docs or doc will be synced to. If left blank it will be synced on the state of the module. (Please see [Sync directly to module state](#sync-directly-to-module-state) for more info)

  // Related to the 2-way sync:
  sync: {
    where: [],
    orderBy: [],
    fillables: [],
    guard: [],
    // HOOKS for local changes:
    insertHook: function (updateStore, doc, store) { return updateStore(doc) },
    patchHook: function (updateStore, doc, store) { return updateStore(doc) },
    deleteHook: function (updateStore, id, store) { return updateStore(id) },
  },

  // When items on the server side are changed:
  serverChange: {
    defaultValues: {},
    // HOOKS for changes on SERVER:
    addedHook: function (updateStore, doc, id, store, source, change) { return updateStore(doc) },
    modifiedHook: function (updateStore, doc, id, store, source, change) { return updateStore(doc) },
    removedHook: function (updateStore, doc, id, store, source, change) { return updateStore(doc) },
  },

  // When items are fetched through `dispatch('module/fetch', filters)`.
  fetch: {
    // The max amount of documents to be fetched. Defaults to 50.
    docLimit: 50,
  },

  // You can also add custom state/getters/mutations/actions. These will be added to your module.
  state: {},
  getters: {},
  mutations: {},
  actions: {},
}
```

## Feedback

Do you have questions, comments, suggestions or feedback? Or any feature that's missing that you'd love to have? Feel free to open an issue! ♥

Also check out the sister vuex-plugin [Vuex Easy Access](https://github.com/mesqueeb/VuexEasyAccess)!

--

Happy Vuexing!<br>
-Luca Ban
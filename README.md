# Vuex Easy Firestore 🔥

In just 4 lines of code, get your vuex module in complete 2-way sync with firestore.

## What it does:

You literally only need to add these 4 lines to your vuex module and you'll have automatic sync with firestore!

```js
const userModule = {
  firestorePath: 'users/{userId}/data',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'user',
  statePropName: 'docs',
  // the rest of your module here
}
// add userModule as vuex plugin wrapped in vuex-easy-firestore
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
        - [Editing in 'collection' mode](#editing-in-collection-mode)
        - [Editing in 'doc' mode](#editing-in-doc-mode)
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
// Be sure to initialise Firebase first
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

With these 6 actions below you can edit the docs in your vuex module.
Any updates with these actions and your firestore stays in sync!

```js
dispatch('moduleName/set', doc) // will choose to dispatch either `patch` OR `insert` automatically
dispatch('moduleName/patch', doc) // doc needs an 'id' prop
dispatch('moduleName/insert', doc)
dispatch('moduleName/delete', id)
```

The sync is fully robust and automatically makes api call "batches" per 1000 ms, so you can loop through things, make a lot of edits here and there and the **api calls are automatically optimised!** (it even stacks until the max batch limit of 500 and splits up the calls so it won't go over this limit)

In cases you don't want to loop through items you can also use the special batch actions below. The main difference is you will have separate hooks (see [hooks](#hooks-before-insertpatchdelete)), and batches are optimised to update the vuex store first for all changes and the syncs to firestore last.

```js
dispatch('moduleName/insertBatch', docs) // an array of docs
dispatch('moduleName/patchBatch', {doc: {}, ids: []}) // `doc` is an object with the fields to patch, `ids` is an array
dispatch('moduleName/deleteBatch', ids) // an array of ids
```

#### Editing in 'collection' mode

In 'collection' mode (`firestoreRefType: 'collection'` in the config object), you can use the 4 actions like you see them above. Plus some extra:

There are two ways you can give a payload to `set patch` or `insert`:

```js
const id = '123'
// Add the `id` as a prop to the item you want to set/update:
dispatch('moduleName/set', {id, name: 'my new name'})
// Or use the `id` as [key] and the item as its value:
dispatch('moduleName/set', {[id]: {name: 'my new name'}})

// Please note that only the `name` will be updated, and other fields are left alone!
```

There are two ways to delete things: the whole item **or just a sub-property!**

```js
// Delete the whole item:
dispatch('moduleName/delete', id)
// Delete a sub-property of an item:
dispatch('moduleName/delete', `${id}.tags.water`)

// the items looks like:
{
  id: '123',
  tags: {
    fire: true,
    water: true, // only `water` will be deleted from the item!
  }
}
```

In the above example you can see that you can delete a sub-property by passing a string and separate sub-props with `.`

#### Editing in 'doc' mode

In 'doc' mode (`firestoreRefType: 'doc'` in the config object), you can use the following actions:

```js
dispatch('moduleName/set', {name: 'my new name'}) // same as `patch`
dispatch('moduleName/patch', {status: 'awesome'})
// Only the props you pass will be updated.
dispatch('moduleName/delete', 'status') // pass a prop-name
// Only the propName (string) you pass will be deleted
```

And yes, just like in 'collection' mode, you can pass a prop-name with sub-props like so:

```js
dispatch('moduleName/delete', 'settings.banned')

// the doc looks like:
{
  userName: 'Satoshi',
  settings: {
    showStatus: true,
    banned: true, // only `banned` will be deleted from the item!
  }
}
```

### Shortcut: set(path, doc)

Inside Vue component templates you can also access the `set` action through a shortcut: `$store.set(path, doc)`. Or with our path: `$store.set('userData', doc)`.

For this shortcut usage, import the npm module '[vuex-easy-access](https://github.com/mesqueeb/VuexEasyAccess)' and just add `{vuexEasyFirestore: true}` in its options. Please check the relevant [documentation](https://github.com/mesqueeb/VuexEasyAccess#vuex-easy-firestore-integration-for-google-firebase)!

Please note that it is important to pass the 'vuex-easy-firestore' plugin first, and the 'vuex-easy-access' plugin second for it to work properly.

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

You can sync the doc(s) directly to the module state as well! Syncing directly to the state means that the doc(s) will not be added to the `statePropName` you can define, but instead be added directly to the `state` of the module.

This can be useful to prevent cases where you have: `items/items` where the first is the module and the second is the stateProp that holds all docs. You can simple leave the `statePropName` blank (set to empty string) and the docs will be synced to the state directly!

#### A more in depth example:

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

To update the ui mode to 'light' and have it patch automatically through Vuex Easy Firestore, you would have to use the `set` actions on the `user` module like so: `dispatch('user/set', {ui: {mode: 'light'}})`

This is kind of weird because the word "settings" is nowhere to be found... It just says `'user/set'`. It would be much clearer if we can set the settings with `dispatch('user/settings/set')`.

To do this we would have to separate the settings into a settings module. But if we change the `moduleName` to 'user/settings' we don't want to set a `statePropName` to 'settings' as well! Otherwise we'd have to access it by `user/settings.settings`... Kinda weird huh.

So the best solution is to **sync the settings doc directly to the settings-module's state**. You can do this like so:

```js
const settingsModule = {
  // ...
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
  // ...
  sync: {
    guard: ['modalOpenend'] // will not be synced to firestore
  },
  state: {
    ui: {mode: 'dark'},
    modalOpened: false
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
  }
}
```

### Hooks before insert/patch/delete

A function where you can check something or even change the doc before the store mutation occurs.
! **Must call `updateStore(doc)` to make the store mutation.**
But you may choose not to call this to abort the mutation.

```js
{
  // your other config...
  sync: {
    insertHook: function (updateStore, doc, store) { updateStore(doc) },
    patchHook: function (updateStore, doc, store) { updateStore(doc) },
    deleteHook: function (updateStore, id, store) { updateStore(id) },
    // Batches have separate hooks!
    insertBatchHook: function (updateStore, doc, store) { updateStore(doc) },
    patchBatchHook: function (updateStore, doc, ids, store) { updateStore(doc, ids) },
    deleteBatchHook: function (updateStore, ids, store) { updateStore(ids) },
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
    // for batches
    insertBatchHook: function (updateStore, docs, store) { return updateStore(docs) },
    patchBatchHook: function (updateStore, doc, ids, store) { return updateStore(doc, ids) },
    deleteBatchHook: function (updateStore, ids, store) { return updateStore(ids) },
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

Planned future features:

- Make a blog post
- Add promise resolve callback possible on batch api calls
  - Probably have to extract all batch call logic into a custom class
- Improve setting nested props of items with ID's
  - Already possible with [Vuex Easy Access](https://github.com/mesqueeb/VuexEasyAccess), but need to think about how this library can handle it.
  - Maybe something like `set('items/${id}.field', newVal)`
- Maybe add possibility to force full patch on docs: `dispatch('module/fullPatch')`
- Improve error handling
  - Warn about wrong config props
  - Warn when there is a `_conf` state prop
- Improve tests: test different configurations
- Improve tests: use a firestore mock
  - [expect-firestore](https://github.com/GitbookIO/expect-firestore)
  - [mock-cloud-firestore](https://github.com/rmmmp/mock-cloud-firestore)
  - [firebase-mock](https://github.com/soumak77/firebase-mock/blob/master/tutorials/client/firestore.md)
- Improve under the hood syntax (`_dbConf` instead of `_conf`)
- Action to duplicate item(s)
- Improve 'patching' documentation for loaders/spinners

Also be sure to check out the sister vuex-plugin [Vuex Easy Access](https://github.com/mesqueeb/VuexEasyAccess)!

--

Happy Vuexing!<br>
-Luca Ban
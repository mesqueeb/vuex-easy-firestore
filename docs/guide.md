# Guide

## Basic usage

Basically with just 4 actions (set, patch, insert, delete) you can make changes to your vuex store and **everything will automatically stay up to date with your firestore!**

There are two ways to use vuex-easy-firestore, in 'collection' or 'doc' mode. You can only choose one because this points to the path you sync your vuex module to:

**Collection mode**
- `firestoreRefType: 'collection'`
- `firestorePath` should be a firestore collection
- Use when working with multiple documents, all docs will automatically be retrieved and sync when making changes.
- eg. when a user has multiple "items" like a to-do list

**Doc mode**
- `firestoreRefType: 'doc'`
- `firestorePath` should be a single firestore document
- Use when working with a single doc.
- eg. the "settings" or "config" of a user.

Depending on which mode there are some small changes, but the syntax is mostly the same.

The sync is fully robust and **automatically groups any api calls per 1000 ms**. You don't have to worry about optimising/limiting the api calls, it's all done automatically! (Only one api call per 1000ms will be made for a maximum of 500 changes, if there are more changes queued it will automatically be split over 2 api calls).

## 'collection' mode

Opening [the DB channel](setup.html#open-db-channel) will retrieve all docs in your collection and add them to the vuex-module.

Then with these 4 actions: set, patch, insert and delete, you can edit **single docs** of your collection. These actions make sure Firestore will stay in sync.

```js
dispatch('moduleName/set', doc)
// 'set' will choose to dispatch either `patch` OR `insert` automatically

dispatch('moduleName/patch', doc) // doc needs an 'id' prop
dispatch('moduleName/insert', doc)
dispatch('moduleName/delete', id)
```

**Inserting will automatically add an ID**, but for patching you will need to add the `id` to the payload. There are two ways you can do this:

```js
const id = '123'
// Add the `id` as a prop to the item you want to set/update:
dispatch('moduleName/set', {id, name: 'my new name'})
// OR use the `id` as [key] and the item as its value:
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

For batch actions see [here](#batch-updates-inserts-deletions).

### Auto-generated fields

When working with collections, each document insert or update will automatically receive these fields:

- `created_at` / `updated_at` both use: `Firebase.firestore.FieldValue.serverTimestamp()`
- `created_by` / `updated_by` will automatically fill in the userId

You can disable these fields by adding them to your `guard` config. See the [related documentation on guard](extra-features.html#fillables-and-guard).

### Manually assigning doc IDs

You can, **but do not need to**, assign doc IDs manually.

Every insert will automatically generate an ID and return a promise resolving in the ID of the doc added to the store and Firestore.

This is how you can use the auto-generated ID:

```js
const id = await dispatch('moduleName/insert', newDoc) // returns id
// mind the await!
```

**When assigning ID's manually** the recommended way to do so is:

```js
// assign manually
const id = getters['moduleName/dbRef'].doc().id
const newDoc = {id, /* and other fields */}
dispatch('moduleName/insert', newDoc)
```

As you can see in the example above, each vuex-easy-firestore module has a getter called `dbRef` with the reference of your `firestorePath`. So when you add `.doc().id` to that reference you will "create" a new ID, just how Firestore would do it. This way you can do whatever you want with the ID before / after the insert.

Please note you can also access the ID (even if you don't manually pass it) in the [hooks](extra-features.html#hooks-before-insert-patch-delete).

## 'doc' mode

In 'doc' mode all changes will take effect on the single document you have passed in the firestorePath.

You will be able to use these actions:

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

### Auto-generated fields

When working with a single doc, your document updates will automatically receive these fields:

- `updated_at` uses: `Firebase.firestore.FieldValue.serverTimestamp()`
- `updated_by` will automatically fill in the userId

## Shortcut: set(path, doc)

Inside Vue component templates you can also access the `set` action through a shortcut: `$store.set(path, doc)`. Or with our path: `$store.set('userData', doc)`.

For this shortcut usage, import the npm module 'vuex-easy-access' and just add `{vuexEasyFirestore: true}` in its options. Please also check the relevant documentation [on the vuex-easy-access repository](https://mesqueeb.github.io/vuex-easy-access/advanced.html#firestore-integration-for-google-firebase)!

Please note that **it is important to pass the 'vuex-easy-firestore' plugin first**, and the 'vuex-easy-access' plugin second for it to work properly.

## Multiple modules with 2-way sync

Of course you can have multiple vuex modules, all in sync with different firestore paths.

```js
const userDataModule = {/* config */}
const anotherModule = {/* config */}
const aThirdModule = {/* config */}
// make sure you choose a different moduleName and firestorePath each time!
const easyFirestores = createEasyFirestore([userDataModule, anotherModule, aThirdModule], {logging: true})
// and include as PLUGIN in your vuex store:
store: {
  // ... your store
  plugins: [easyFirestores]
}
```

Passing `{logging: true}` as second param will enable console.logging on each api call. This is recommended for debugging initially, but could be disabled on production.

## Sync directly to module state

You can sync the doc(s) directly to the module state as well! Syncing directly to the state means that the doc(s) will not be added to the `statePropName` you can define, but instead be added directly to the `state` of the module.

This can be useful to prevent cases where you have: `items/items` where the first is the module and the second is the stateProp that holds all docs. You can simple leave the `statePropName` blank (set to empty string) and the docs will be synced to the state directly!

### A more in depth example:

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

Please note that if you have other state-props in settings that you don't want to be synced you have to add it to the `guard` array (see [guard config](extra-features.html#fillables-and-guard)).

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

## Batch updates/inserts/deletions

> Only for 'collection' mode.

In cases you don't want to loop through items you can also use the special batch actions below. The main difference is you will have separate hooks (see [hooks](extra-features.html#hooks-before-insert-patch-delete)), and batches are optimised to update the vuex store first for all changes and the syncs to firestore last.

```js
dispatch('moduleName/insertBatch', docs) // an array of docs
dispatch('moduleName/patchBatch', {doc: {}, ids: []}) // `doc` is an object with the fields to patch, `ids` is an array
dispatch('moduleName/deleteBatch', ids) // an array of ids
```

> All batch actions will return a promise resolving to an array of the edited / added ids.

## Fetching docs (with different filters)

> Only for 'collection' mode.

Say that you have a default filter set on the documents you are syncing when you `openDBChannel` (see [Filters](extra-features.html#filters)). And you want to fetch extra documents with other filters. (eg. archived posts) In this case you can use the fetch actions to retrieve documents from the same firestore path your module is synced to:

- `dispatch('fetch')` for manual handling the fetched docs
- `dispatch('fetchAndAdd')` for fetching and automatically adding the docs to the module like your other docs

You can have two extra parameters:

- *whereFilters:* The same as firestore's `.where()`. An array of arrays with the filters you want. eg. `[['field', '==', false], ...]`
- *orderBy:* The same as firestore's `.orderBy()`. eg. `['created_date']`

### Usage example `fetchAndAdd`:

```js
dispatch('pokemonBox/fetchAndAdd', {whereFilters: [['freed', '==', true]], orderBy: ['freedDate']})
  .then(querySnapshot => {
    if (querySnapshot.done === true) {
      // `{done: true}` is returned when everything is already fetched and there are 0 docs:
      return '0 docs left to retrieve'
    }
    // Nothing more needs to be done. Docs are automatically added to `pokemonBox` and can be patched, deleted, etc.
    // docs will also receive `defaultValues` you have set up. (see "defaultValues set after server retrieval" under Extra features)
  })
  .catch(console.error)
```

Using the `fetchAndAdd` method means your documents will be added to your vuex-module (at `moduleName`) in the `statePropName` you have set in your config. Then can thus also just be used with all other actions like `set`, `patch`, `insert` and `delete`.

### Usage example `fetch`:

```js
dispatch('pokemonBox/fetch', {whereFilters: [['freed', '==', true]], orderBy: ['freedDate']})
  .then(querySnapshot => {
    if (querySnapshot.done === true) {
      // `{done: true}` is returned when everything is already fetched and there are 0 docs:
      return '0 docs left to retrieve'
    }
    // here you can the Firestore `querySnapshot` which is returned
    querySnapshot.forEach(doc => {
      // you have to manually add the doc with `fetch`
      const fetchedDoc = doc.data()
      fetchedDoc.id = doc.id
      commit('pokemonBox/INSERT_DOC', fetchedDoc)
      // also don't forget that in this case `defaultValues` will not be applied
    })
  })
  .catch(console.error)
```

The `querySnapshot` that is returned is the same querySnapshot as the Firestore one. Please read the [Firestore documentation on querySnapshot](https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot) to know what you can do with these. Only when all documents were already fetched (and the result is 0 docs) vuex-easy-firestore will return `{done: true}` instead. Please see the examples here above.

### A note on fetch limit:

The fetch limit defaults to 50 docs. If you watch to fetch *the next 50 docs* you just need to call the `fetch` or `fetchAndAdd` action again, and it will automatically retrieve the next docs! See the example below:

```js
function fetchFreedPokemon () {
  dispatch('pokemonBox/fetchAndAdd', {whereFilters: [['freed', '==', true]], orderBy: ['freedDate']})
}
// call once to fetch the first 50:
fetchFreedPokemon()
// then just call again to fetch the next 50!
fetchFreedPokemon()
// and so on...
```

You can change the default fetch limit like so:

```js
{
  // your other vuex-easy-fire config
  fetch: {
    // The max amount of documents to be fetched. Defaults to 50.
    docLimit: 50,
  },
}
```

## Duplicating docs

> Only for 'collection' mode.

You can duplicate a document really simply by dispatching 'duplicate' and passing the id of the target document.

```js
// let's duplicate Bulbasaur who has the id '001'
dispatch('pokemonBox/duplicate', '001')
```

This will create a copy of Bulbasaur (and all its props) with a random new ID. The duplicated doc will automatically be added to your vuex module and synced as well.

If you need to know which new ID was generated for the duplicate, you can retrieve it from the action:

```js
const idMap = await dispatch('pokemonBox/duplicate', '001')
// mind the await!
// idMap will look like this:
{'001': dupeId}
// dupeId will be a string with the ID of the duplicate!
```

In the example above, if Bulbasaur ('001') was duplicated and the new document has random ID `'123abc'` the `idMap` will be `{'001': '123abc'}`.

### Duplicate batch

This is how you duplicate a batch of documents:

```js
const idMap = await dispatch('pokemonBox/duplicateBatch', ['001', '004', '007'])
// idMap will look like this:
{
  '001': 'some-random-new-ID-1',
  '004': 'some-random-new-ID-2',
  '007': 'some-random-new-ID-3',
}
```

This way you can use the result if you need to do extra things to your duplicated docs and you will know for each ID which new ID was used to make a duplication.

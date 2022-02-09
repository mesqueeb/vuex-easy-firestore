# Add and manage data

## Basic usage

With just 4 actions (set, patch, insert, delete) you can make changes to your vuex store and **everything will automatically stay up to date with your firestore!**

There are two ways to use vuex-easy-firestore, in 'collection' or 'doc' mode. You can only choose one because this points to the path you sync your vuex module to:

**Collection mode**

- `firestoreRefType: 'collection'`
- `firestorePath` should be a firestore collection
- Use when working with multiple documents, all docs will automatically be retrieved and sync when making changes.
  <br>eg. when a user has multiple "items" like a to-do list

**Doc mode**

- `firestoreRefType: 'doc'`
- `firestorePath` should be a single firestore document
- Use when working with a single doc.
  <br>eg. the "settings" or "config" of a user.

Whether a vuex module is set to 'doc' or 'collection' mode, will have small changes in the actions you can do, but the syntax is mostly the same.

The sync is fully robust and **automatically groups any api calls per 1000 ms**. That means, no matter how many patches you make, only one api call per 1000ms will be made for a maximum of 500 changes. You don't have to worry about optimising/limiting your api calls, it's all done automatically! (> 500 changes will be automatically split over 2 api calls) You can also [customise this debounce duration](extra-features.html#custom-sync-debounce-duration) to eg. 500 or 2000ms.

> If you still are confused how to set up your database structure when it comes to **documents vs collections**, I highly recommend to check [this guide from Firebase](https://firebase.google.com/docs/firestore/manage-data/structure-data) itself.

## 'collection' mode

In 'collection' mode, documents that are added to your module will be added in an object under the property you can choose with the `statePropName` option.

Example Vuex module:

```js
const myModule = {
  firestorePath: 'myDocs',
  firestoreRefType: 'collection',
  moduleName: 'myModule',
  statePropName: 'data',
  namespaced: true, // automatically added
}
```

With the setup above when documents are added they will appear in the state of the module `myModule` under the prop called `data`.

Then with these 4 actions: set, patch, insert and delete, you can edit **single docs** of your collection. These actions make sure Firestore will stay in sync.

```js
dispatch('myModule/set', doc)
// 'set' will choose to dispatch either `patch` OR `insert` automatically

dispatch('myModule/patch', doc) // doc needs an 'id' prop
dispatch('myModule/insert', doc)
dispatch('myModule/delete', id)
```

### Insert example

```js
dispatch('myModule/set', { title: 'Hello Firestore 🔥' })
// or
dispatch('myModule/insert', { title: 'Hello Firestore 🔥' })
```

1. The object above has just one field: `title`
2. Since there is no `id` field, the object will be **inserted** as new document
3. The document will **automatically get a new ID**
4. The document will appear in Vuex like so:

```js
// in the module called "myModule"
state: {
  data: {
    'abc123': {title: 'Hello Firestore 🔥', id: 'abc123'}
  }
}
```

5. The document will also be inserted in Firestore at the firestorePath `myDocs`.

### Patch example

If you specify the `id` you can modify any data of existing documents.

```js
const id = 'abc123'
dispatch('myModule/set', { id, title: 'Hello Universe 💫 🛰', newField: 1 })
// or
dispatch('myModule/patch', { id, title: 'Hello Universe 💫 🛰', newField: 1 })
```

As you can see in the example above, with the `patch` action (or `set` with `id` field) you can modify and/or add new fields.

You can also patch **nested fields** like so:

```js
dispatch('myModule/patch', { id, tags: { water: true } })
```

Any other fields inside `tags` will be left alone and only `water` will be updated (or added as new prop).

### Delete example

There are two ways to delete things: (1) the whole document or (2) **just a field!** (A field meaning "a property" of that document)

```js
const id = 'abc123'
// Delete the whole document:
dispatch('myModule/delete', id)
// Delete a field of a document:
dispatch('myModule/delete', `${id}.tags.water`)

// the document looks like:
{
  id: 'abc123',
  tags: {
    fire: true,
    water: true, // only `water` will be deleted in this example!
  }
}
```

In the above example you can see that you can delete a field (or property) by passing a string and separate sub-props with `.` (See [here](firestore-fields-and-functions.html#delete-fields) for more info on deleting fields)

### Auto-generated fields

When working with collections, each document insert or update will automatically receive these fields:

- `created_at` / `updated_at` both use: `new Date()`
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
const id = doc(getters['moduleName/dbRef']).id
const newDoc = { id /* and other fields */ }
dispatch('moduleName/insert', newDoc)
```

As you can see in the example above, each vuex-easy-firestore module has a getter called `dbRef` with the reference of your `firestorePath`. So when you add `.doc().id` to that reference you will "create" a new ID, just how Firestore would do it. This way you can do whatever you want with the ID before / after the insert.

Please note you can also access the ID (even if you don't manually pass it) in the [hooks](hooks.html#hooks).

## 'doc' mode

In 'doc' mode all changes will take effect on the single document you have passed in the firestorePath.

You will be able to use these actions:

```js
dispatch('moduleName/set', { name: 'my new name' }) // same as `patch`
dispatch('moduleName/patch', { status: 'awesome' })
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

- `updated_at` uses: `new Date()`
- `updated_by` will automatically fill in the userId

Just as with 'collection' mode, you can disable these fields by adding them to your `guard` config. See the [related documentation on guard](extra-features.html#fillables-and-guard).

## Batch updates/inserts/deletions

> Only for 'collection' mode.

Since Vuex Easy Firestore automatically batches any patch, insert or deletion you make, **you do not need a separate action for large batches**.

Yet there are separate "batch actions" and the difference between regular actions is:

- batch actions use different [hooks](hooks.html#hooks) that are only called once for the entire batch
- `patchBatch` is used to update props with the same content to an array of IDs

```js
dispatch('moduleName/insertBatch', docs)
// pass an array of docs

dispatch('moduleName/patchBatch', { doc: {}, ids: [] })
// `doc` is an object with the fields to patch, `ids` is an array

dispatch('moduleName/deleteBatch', ids)
// pass an array of ids
```

> All batch actions will return a promise resolving to an array of the edited / added ids.

In case you need to use `patchBatch` but have different content for each document you want to update, please use the regular `patch` action.

## Duplicating docs

> Only for 'collection' mode.

You can duplicate a document really simply by dispatching 'duplicate' and passing the id of the target document.
In the example we will add a document and duplicate it afterwards, so we have 2 documents that look exactly like each other.

```js
const newBulbasaur = { id: '001', name: Bulbasaur, types: { grass: true, poison: true } }
dispatch('pokemonBox/insert', newBulbasaur)

// Bulbasaur is added with the id '001'.
// In another part of your app, you can now duplicate this document like so:

dispatch('pokemonBox/duplicate', '001')
```

You have to pass the doc ID of an existing doc in your 'collection'. The document also has to be loaded in the Vuex module, so you will have to make sure you either (1) added the document locally or (2) [retrieved the document](query-data.html#read-data) from Firestore first.

In our example above we have copied the Bulbasaur document with all its props and added a **duplicate doc with a new random ID**. The duplicated doc will automatically be added to your Vuex module and synced to Firestore as well.

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

# Extra features

## Filters

The filters set in `sync: {}` are applied before the DB Channel is openend. They are only available for syncing 'collections'.

- *where:* The same as firestore's `.where()`. An array of arrays with the filters you want. eg. `[['field', '==', false], ...]`
- *orderBy:* The same as firestore's `.orderBy()`. eg. `['created_date']`

```js
{
  // your other vuex-easy-fire config...
  sync: {
    where: [], // an array of arrays
    orderBy: [],
  }
}
```

You can also use `'{userId}'` as third param for a where filter. Eg.:

```js
where: [
  ['created_by', '==', '{userId}']
]
```

## Variables for firestorePath or filters

Besides `'{userId}'` in your `firestorePath` in the config or in where filters, you can also use **any variable** in the `firestorePath` or the `where` filter.

```js
// your vuex module
SpecificGroupUserModule: {
  moduleName: 'groupUserData',
  firestorePath: 'groups/{groupId}/users/{userId}'
}
// Just pass the groupId as a parameter to openDBChannel!
dispatch('groupUserData/openDBChannel', {groupId: 'group-A'})
```

**Use case:** This is especially useful if you need to first retrieve the `groupId` from a userModule which is also synced. You can do so by using the Promise returned from `openDBChannel` on for example a userModule:

```js
store.dispatch('userModule/openDBChannel')
  .then(_ => {
    // in this example every user hase a groupId saved like so:
    const userGroupId = store.state.user.groupId
    store.dispatch('groupUserData/openDBChannel', {groupId: userGroupId})
  })
```

## Fillables and guard

- *Fillables:* Array of keys - the props which may be synced to the server. Any other props will not be synced!
- *Guard:* Array of keys - the props which should not be synced to the server. (the opposite of 'fillables')

```js
{
  // your other vuex-easy-fire config...
  sync: {
    fillables: [],
    guard: [],
  }
}
```

## Hooks before insert/patch/delete

A function where you can check something or even change the doc before the store mutation occurs.
! **Must call `updateStore(doc)` to make the store mutation.**
But you may choose not to call this to abort the mutation.

```js
{
  // your other vuex-easy-fire config...
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

## Hooks after changes on the server

Exactly the same as above, but for changes that have occured on the server. You also have some extra parameters to work with:

- *id:* the doc id returned in `change.doc.id` (see firestore documentation for more info)
- *doc:* the doc returned in `change.doc.data()` (see firestore documentation for more info)
- *source:* of the change. Can be 'local' or 'server'

```js
{
  // your other vuex-easy-fire config...
  serverChange: {
    addedHook: function (updateStore, doc, id, store, source, change) { updateStore(doc) },
    modifiedHook: function (updateStore, doc, id, store, source, change) { updateStore(doc) },
    removedHook: function (updateStore, doc, id, store, source, change) { updateStore(doc) },
  }
}
```

## defaultValues set after server retrieval

If you create a `defaultValues` object, then each document from the server will be merged onto those default values!

**Use case 1: Firestore Timestamp conversion**<br>
Automatically convert Firestore Timestamps into `new Date()` objects! Do this by setting `'%convertTimestamp%'` as the value of a `defaultValues` prop. (see example below).

**Use case 2: Reactivity**<br>
With VueJS, if you need a prop on an item to be fully reactive with your vue templates, it needs to exist from the start. If some docs in your user's firestore doesn't have all props (because you added new functionality to your app at later dates), the *retrieved docs will have reactivity problems!*

However, if you add these props to `defaultValues` with some value (or just `'null'`), vuex-easy-firestore will automatically add those props to the doc *before* inserting it into vuex!

**Example:**
```js
const vuexModule = {
  // your other vuex-easy-firestore config...
  serverChange: {
    defaultValues: {
      defaultInt: 1,
      propAddedLater: null,
      date: '%convertTimestamp%',
    },
  }
}
// Now an example of what happens to the docs which are retrieved from the server:
const retrievedDoc = {
  defaultInt: 2,
  date: Timestamp // firestore Timestamp object
}
// This doc will be inserted into vuex like so:
const docToBeInserted = {
  defaultInt: 2, // stays 2
  propAddedLater: null, // receives propAddedLater prop with default val
  date: Timestamp.toDate() // will execute firestore's Timestamp.toDate()
}
// '%convertTimestamp%' works also with date strings:
const retrievedDoc = {date: '1990-06-22 17:35:00'} // date string
const docToBeInserted = {date: new Date('1990-06-22 17:35:00')} // converted to new Date
// in case the retrieved val is not present `null` will be added
const retrievedDoc = {}
const docToBeInserted = {date: null}
```

To learn more about Firestore's Timestamp format see [here](https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp).

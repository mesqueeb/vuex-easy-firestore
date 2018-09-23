# Extra features

## Filters

The filters set in `sync: {}` are applied before the DB Channel is openend. They are only available for syncing 'collections'.

- *where:* The same as firestore's `.where()`
- *orderBy:* The same as firestore's `.orderBy()`

```js
{
  // your other vuex-easy-fire config...
  sync: {
    where: [ // an array of arrays
      ['certain_field', '==', false] // example
    ],
    orderBy: [
      'created_date' // example
    ],
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

**Use case: Retrieve a variable from the user's Data**

Custom variables are especially useful if you need to first retrieve eg. a `groupId` from the user's data also on firestore. You can do so by waiting for the Promise to resolve after `openDBChannel` to retrieve the user's data (eg. another vuex-easy-firestore module called `userData`):

```js
// in this example the `userData` module will retrieve {userName: '', groupId: ''}
store.dispatch('userData/openDBChannel')
  .then(_ => {
    // Then we can get the groupId:
    const userGroupId = store.state.userData.groupId
    // Then we can pass it as variable to the next openDBChannel:
    store.dispatch('groupUserData/openDBChannel', {groupId: userGroupId})
  })
```

## Fillables and guard

You can prevent props on your docs in 'collection' mode (or on your single doc in 'doc' mode) to be synced to the firestore server. For this you should use either `fillables` **or** `guard`:

- *Fillables:* Array of keys - the props which may be synced to the server. Any other props will not be synced! All props will be synced if left blank.
- *Guard:* Array of keys - the props which should not be synced to the server. (the opposite of 'fillables')

```js
{
  // your other vuex-easy-fire config...
  sync: {
    fillables: [], // array of  keys
    guard: [], // array of keys
  }
}
```

**Example fillables:**

```js
// settings:
fillables: ['name', 'age']

// insert new doc:
const newUser = {name: 'Ash', age: 10, email: 'ash@pokemon.com'}
dispatch('user/set', newUser)

// object which will be added to Vuex `user` module:
{name: 'Ash', age: 10, email: 'ash@pokemon.com'}

// object which will be synced to firestore:
{name: 'Ash', age: 10}
```

**Example guard:**

If you have only one prop you do not want to sync to firestore you can set `guard` instead of `fillables`.

```js
// the same example as above can also be achieved by doing:
guard: ['email']
```

## Hooks before insert/patch/delete

A function where you can check something or even change the doc (the doc object) before the store mutation occurs.

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

::: warning You must call `updateStore(doc)` to make the store mutation.
But you may choose not to call this to abort the mutation.
:::

## Hooks after changes on the server

Exactly the same as above, but for changes that have occured on the server. You also have some extra parameters to work with:

- *id:* the doc id returned in `change.doc.id` (see firestore documentation for more info)
- *doc:* the doc returned in `change.doc.data()` (see firestore documentation for more info)
- *source:* of the change. Can be either `'local'` or `'server'`

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

If you create a `defaultValues` object, then each document from the server will receive those default values!

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
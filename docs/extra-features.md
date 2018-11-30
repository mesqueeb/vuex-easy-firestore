# Extra features

## Filters

> Only for 'collection' mode.

Just as in Firestore's [onSnapshot](https://firebase.google.com/docs/firestore/query-data/listen) listener, you can set `where` and `orderBy` filters to filter which docs are retrieved and synced.

- *where:* arrays of `parameters` that get passed on to firestore's `.where(...parameters)`
- *orderBy:* a single `array` that gets passed on to firestore's `.orderBy(...array)`

### Usage:

```js
const where = [ // an array of arrays
  ['certain_field', '==', false],
  ['another_field', '==', true],
]
const orderBy = ['created_date'] // or more params

// Add to openDBChannel:
store.dispatch('myModule/openDBChannel', {where, orderBy}) // like this

// OR
// Add to your vuex-easy-fire module in the config
myModule = {
  // your other vuex-easy-fire config...
  sync: {
    where,
    orderBy
  }
}
```

You can also use all kind of variables like `'{userId}'` like so:

```js
store.dispatch('myModule/openDBChannel', {
  where: [
    ['created_by', '==', '{userId}'],
    ['some field', '==', '{pathVar}']
  ],
  pathVar: 'value'
})
```

What happens here above is:
- `{userId}` will be automatically replaced with the authenticated user
- `{pathVar}` is a custom variable that will be replaced with `'value'`

For more information on custom variables, see the next chapter:

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

- *Fillables:* Array of keys - the props which **may be synced** to the server.
  - 0 fillables = all props are synced
  - 1 or more fillables = only those props are synced (any prop not in fillables is not synced)
- *Guard:* Array of keys - the props which **should not be synced** to the server.
  - adding any prop here will prevent it from being synced

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

A function where you can check something or even change the doc (the doc object) before the store mutation occurs. The `doc` passed in these hooks will also have an `id` field which is the id with which it will be added to the store and to Firestore.

Please make sure to check the overview of [execution timings of hooks](#execution-timings-of-hooks).

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
But you may choose not to call this to abort the mutation. If you do not call `updateStore(doc)` nothing will happen.
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

Please make sure to check the overview of execution timings of hooks, in the next chapter:

## Execution timings of hooks

Notice that the `created_at` and `updated_at` fields mentioned below is used by default, but can be disabled. To disable just add them to your [guard config](#fillables-and-guard).

**Collection mode hooks**

<table>
  <tr>
    <th>change type</th>
    <th colspan="2">local</th>
    <th>server</th>
  </tr>
  <tr>
    <td>insertion</td>
    <td>
      <b>without <code>created_at</code></b>
      <ol>
        <li><code>sync.insertHook</code></li>
      </ol>
    </td>
    <td>
      <b>with <code>created_at</code></b>
      <ol>
        <li><code>sync.insertHook</code></li>
        <li><code>serverChange.modifiedHook</code></li>
      </ol>
    </td>
    <td><code>serverChange.addedHook</code></td>
  </tr>
  <tr>
    <td>modification</td>
    <td>
      <b>without <code>updated_at</code></b>
      <ol>
        <li><code>sync.patchHook</code></li>
      </ol>
    </td>
    <td>
      <b>with <code>updated_at</code></b>
      <ol>
        <li><code>sync.patchHook</code></li>
        <li><code>serverChange.modifiedHook</code></li>
      </ol>
    </td>
    <td><code>serverChange.modifiedHook</code></td>
  </tr>
  <tr>
    <td>deletion</td>
    <td colspan="2">
      <ol>
        <li><code>sync.deleteHook</code></li>
        <li><code>serverChange.removedHook</code></li>
      </ol>
    </td>
    <td><code>serverChange.removedHook</code></td>
  </tr>
  <tr>
    <td>after <code>openDBChannel</code></td>
    <td colspan="3"><code>serverChange.addedHook</code> is executed once for each doc</td>
  </tr>
</table>

**Doc mode hooks**

<table>
  <tr>
    <th>change type</th>
    <th colspan="2">local</th>
    <th>server</th>
  </tr>
  <tr>
    <td>modification</td>
    <td>
      <b>without <code>updated_at</code></b>
      <ol>
        <li><code>sync.patchHook</code></li>
      </ol>
    </td>
    <td>
      <b>with <code>updated_at</code></b>
      <ol>
        <li><code>sync.patchHook</code></li>
        <li><code>serverChange.modifiedHook</code></li>
      </ol>
    </td>
    <td><code>serverChange.modifiedHook</code></td>
  </tr>
  <tr>
    <td>after <code>openDBChannel</code></td>
    <td colspan="3"><code>serverChange.modifiedHook</code> is executed once</td>
  </tr>
</table>

### Note about the serverChange hooks executing on local changes

I have done my best to limit the hooks to only be executed on the proper events. The server hooks are executed during Firestore's [onSnapshot events](https://firebase.google.com/docs/firestore/query-data/listen).

The reason for `updated_at` to trigger `serverChange.modifiedHook` even on just a local change, is because `updated_at` uses Firestore's `firebase.firestore.FieldValue.serverTimestamp()` which is replaced by a timestamp on the server and therefor there is a "server change".

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

## Pass Firebase dependency

Vuex Easy Firestore will automatically use Firebase as a peer dependency to access `Firebase.auth()` etc. If you want to pass a Firebase instance you have instantiated yourself you can do so like this:

```js
// make sure you import at least auth and firestore as well:
import * as Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import createEasyFirestore from 'vuex-easy-firestore'
const easyFirestore = createEasyFirestore(
  userDataModule,
  {logging: true, FirebaseDependency: Firebase} // pass Firebase like this. Mind the Capital F!
)
```

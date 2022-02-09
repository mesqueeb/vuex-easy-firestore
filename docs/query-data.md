# Read data

The prime philosophy of Vuex Easy Firestore is to be able to have a vuex module (or several) which are all in sync with Firestore. When your app is openend there are two ways you can get data from Firestore and have it added to your vuex modules:

- get realtime updates
- fetch the document(s) once

To have a better understanding of the difference I will give some examples:

## Realtime updates vs single fetch

Realtime updates are powered by Firestore's [onSnapshot](https://firebase.google.com/docs/firestore/query-data/listen) listener. This means that if data on the server is changed, the changes are pushed to all clients that have your application open.

With Vuex easy firestore using _realtime updates_ will effectively make **a 2-way sync between your firestore collection or doc and your vuex module**.

Fetching the document(s) once is when you want to retrieve the document(s) once, when your application or a page is opened, but do not require to have the data to be live updated when the server data changes.

Both with _realtime updates_ and with _fetching docs_ you can use `where` clauses to specify which docs you want to retrieve (just like Firestore). In some modules you might initially open a channel for _realtime updates_ with a certain `where` clause, and later when the user requests other docs do an additional `fetch` with another `where` clause.

## Realtime updates: openDBChannel

If you want to get _realtime updates_, you need to dispatch the `openDBChannel` action. Eg.

```js
dispatch('moduleName/openDBChannel')
```

`openDBChannel` relies on the Firestore [onSnapshot](https://firebase.google.com/docs/firestore/query-data/listen) function to get notified of remote changes. The doc(s) are automatically added to/updated in your Vuex module under `moduleName/statePropName`.

Mind that:

- if the channel is opened on a document which does not exist yet at Firebase, the document gets automatically (re)created, unless you set `preventInitialDocInsertion` to `true`
- the action returns a promise which resolves when the state of the module has been populated with data (served either from cache or server), so you know you can start working with it
- when this promise is resolved, you get another one which lets you know when an error occurs

Just like the Firebase SDK, you can also use a [`where` clause](#where-orderby-clauses).

```js
dispatch('moduleName/openDBChannel')
  .then(({ streaming }) => {
    // the state has been populated with data, you may start working with it
    startDoingThings()

    // you must check that the channel keeps streaming and catch errors. Mind that
    // even while offline, the channel is considered as "streaming" and will remain
    // so until you close it or until an error occurs.
    streaming
      .then(() => {
        // this gets resolved when you close the channel yourself
      })
      .catch(error => {
        // an error occured and the channel has been closed, you should figure
        // out what happened and open a new channel.
        // Perhaps the user lost his `read` rights on the resource, or maybe the
        // document got deleted and it wasn't possible to recreate it (possibly
        // because `preventInitialDocInsertion` is `false`). Or some other error
        // from Firestore.
      })
  })
  .catch(error => {
    // Same as the other `catch` block above
  })
```

Sometimes the promise returned by the action might not be enough for you, because you need to know when the module has been populated with fresh data, not cached data. In that case, you need to pass an option when calling the action, which in turn will provide you with an additional promise. This, however, will also trigger your server hook listeners more frequently. Read [Firestore's documentation](https://firebase.google.com/docs/firestore/query-data/listen#events-metadata-changes) to know more about this.

```js
dispatch('moduleName/openDBChannel', {includeMetadataChanges: true})
  .then(({refreshed, streaming}) => {

    refreshed
     .then(() => {
       // the state has been populated with fresh data
     })
     .catch(error => {...})

    streaming
      .then(() => {...})
      .catch(error => {...})
  })
  .catch(error => {...})
```

Finally, if you open multiple channels on a same module with different clauses, you will need to use the `stop` method provided in the promise to handle their closing at your discretion:

```js
dispatch('moduleName/openDBChannel')
  .then(({streaming, stop}) => {

    stop().then(() => {
      // the channel has been closed
    })
  })
  .catch(error => {...})
```

### Close DB channel

In some cases you need to close the connection to Firestore (unsubscribe from Firestore's `onSnapshot` listener). Eg. when your user signs out. In this case, make sure you call `closeDBChannel` like so:

```js
dispatch('moduleName/closeDBChannel')
```

This will close the connection using Firestore's [unsubscribe function](https://firebase.google.com/docs/firestore/query-data/listen#detach_a_listener).

Please note that `closeDBChannel` does not mean it will not listen for "local" changes! This means that even with a closedDBChannel, you can continue to insert/patch/delete docs and they will still be synced to the server. However, changes on the server side will not be reflected to the app anymore.

`closeDBChannel` will not clear out the data in your current vuex module. You can also close the connection and completely clear out the module; removing all docs from your vuex module. (without deleting anything on the server, don't worry) In this case do:

```js
dispatch('moduleName/closeDBChannel', { clearModule: true })
```

## Fetching docs

If you want to fetch docs once (opposed to _realtime updates_) you can use the `fetchAndAdd` (or `fetchById`) action.

These actions are a wrapper around the Firestore `getDoc(collection(db, path))` and `getDoc(db, path)` functions.
(See 'Read data' in the [Firestore documentation](https://firebase.google.com/docs/firestore/query-data/get-data))

### Fetching in 'doc' mode

In 'doc' mode your `firestorePath` is the path to a single document. Therefor just calling `fetchAndAdd` will (1) retrieve the doc from Firestore and (2) add it to your Vuex module.

```js
dispatch('myDocModule/fetchAndAdd')
```

### Fetching in 'collection' mode

In 'collection' mode you can use these actions to fetch docs:

- `fetchById` retrieves a single doc and adds it to your module
- `fetchAndAdd` retrieves multiple docs and adds them to your module

Both these actions will (1) retrieve the doc(s) from Firestore and (2) add it to your Vuex module.

Let's see an example:

```js
const pokemonModule = {
  firestorePath: 'pokemon',
  firestoreRefType: 'collection',
  moduleName: 'pokemon',
  statePropName: 'data',
  // ...
}
```

You could retrieve a single Pokémon by ID like so:

```js
dispatch('pokemon/fetchById', '001')
```

Or you could retrieve all Pokémon like so:

```js
dispatch('pokemon/fetchAndAdd')
```

Of course, just like the Firebase SDK, you can also use a `where` clause to retrieve eg. all water Pokémon. (Read more on [where clauses](#where-orderby-clauses) down below)

```js
dispatch('pokemon/fetchAndAdd', { where: [['type', '==', 'water']] })
```

### a note on fetch limit

When doing `fetchAndAdd` there will be a limit that defaults to 50 docs. If you want to fetch _the next 50 docs_ you just need to call the `fetchAndAdd` action again, and it will automatically retrieve the next docs! See the example below:

```js
// call once to fetch the first 50:
dispatch('myModule/fetchAndAdd')
// then just call again to fetch the next 50!
dispatch('myModule/fetchAndAdd')
// and so on...
```

You can pass a custom fetch limit or disable the fetch limit by passing 0:

```js
// custom fetch limit:
dispatch('myModule/fetchAndAdd', { clauses: { limit: 1000 } })
// no fetch limit:
dispatch('myModule/fetchAndAdd', { clauses: { limit: 0 } })
```

The `fetchAndAdd` action will return a promise resolving in `{done: true}` if there are no more docs to be fetched. You can use this to check when to stop fetching like so:

```js
fetchAndAdd = async function () {
  let fetchResult = await store.dispatch('myModule/fetchAndAdd')
  if (fetchResult.done === true) return 'all done!'
  return 'retrieved 50 docs, call again to fetch the next!'
}
```

If you require to know **wether or not fetch was called at least once**, you can do so by looking at the the state prop called `state._sync.fetched` of your module. If this is an empty object, fetch was not yet triggered. If it has data inside you know fetch has been called at least once.

## Firestore authentication

In most cases your application will have many users, and your Firestore path will need to include the user ID of the user who is signed in. This can be done in Vuex Easy Firestore by using the `{userId}` wildcard like so:

```js
const myModule = {
  firestorePath: 'userDocs/{userId}/data',
  firestoreRefType: 'collection',
  moduleName: 'userData',
  statePropName: 'data',
  namespaced: true, // automatically added
}
```

Of course, you will need to wait for the user to sign in and only then dispatch either `openDBChannel` or `fetchAndAdd`. For this you can use Firebase's native `onAuthStateChanged` function:

```js
// Be sure to initialise Firebase first!
import { onAuthStateChanged } from 'firebase/firestore'
onAuthStateChanged((user) => {
  if (user) {
    // user is logged in so openDBChannel
    store.dispatch('userData/openDBChannel').catch(console.error)
    // or fetchAndAdd
    // store.dispatch('userData/fetchAndAdd')
  }
})
```

If you want to use the library without fetching documents, so without using `openDBChannel` and `fetchAndAdd`, you will notice that `{userId}` is not automatically replaced with the user id. This is because `openDBChannel` and `fetchAndAdd` both dispatch an action called `setUserId` that retrieves the current user id from Firebase authentication and places it in the firestorePath.

In this case you can manually dispatch `setUserId` like so:

```js
import { onAuthStateChanged } from 'firebase/firestore'
onAuthStateChanged((user) => {
  if (user) {
    // in case you do not use `openDBChannel` or `fetchAndAdd`
    store.dispatch('userData/setUserId')
  }
})
```

When required you can also manually pass a user id like so: `dispatch('userData/setUserId', id)`

## where / orderBy clauses

> Only for 'collection' mode.

Just like Firestore, you can use `where` and `orderBy` to clauses which docs are retrieved and synced.

- _where:_ arrays of "parameters" that get passed on to firestore's `.where(...parameters)`
- _orderBy:_ a single "array" that gets passed on to firestore's `.orderBy(...array)`

There are three ways to use where and orderBy. As per example we will define `where` and `orderBy` variables first, then show how you can use them:

```js
// an array of arrays
const where = [
  ['some_field', '==', false],
  ['another_field', '==', true],
]
// can have several parameters
const orderBy = ['created_at']
```

1. Pass together with openDBChannel:

```js
dispatch('myModule/openDBChannel', { clauses: { where, orderBy } })
```

2. Pass together with fetchAndAdd:

```js
dispatch('myModule/fetchAndAdd', { clauses: { where, orderBy } })
```

3. Define inside your vuex module, to set as default when for `openDBChannel`:

```js
const myModule = {
  firestorePath: 'myDocs',
  firestoreRefType: 'collection',
  moduleName: 'myModule',
  statePropName: 'data',
  namespaced: true, // automatically added
  sync: {
    where,
    orderBy,
  },
}
// Now you can do:
dispatch('myModule/openDBChannel')
// And it will use the where and orderBy as defined in your module
```

### a note on orderBy

Using `orderBy` works just like in Firebase: "the docs will be retrieved in that order".
Please note however, that your docs are saved inside an object in your Vuex module. **JavaScript object properties do not have an order.** (the prop-order might differ from browser to browser)

This means that even though you can retrieve your docs in a certain order, when showing them in a Vue component, you will need to manually sort the docs in the order you want. You can do this through a getter in your Vuex module. Eg.

```js
getters: {
  sortedDocs: (state, getters) => {
    return Object.values(state.data).sort() // your sort function
  }
}
```

### userId in where/orderBy

You can also use variables like `userId` (of the authenticated user) inside where clauses. Eg.

```js
store.dispatch('myModule/openDBChannel', {
  where: [['created_by', '==', '{userId}']],
})
```

`{userId}` will be automatically replaced with the authenticated user id.

Besides `userId` you can also use "custom variables". For more information on this, see the chapter on [variables for firestorePath or clauses](extra-features.html#variables-for-firestorepath-or-clauses).

### Example usage: openDBChannel and fetchAndAdd

Say you have an "notes" application that shows a user's notes when the app is opened, but only notes that are not "archived". Then later when the user opens the archive-page those notes are fetched and shown as well.

```js
// when the app is opened after user authentication:
store.dispatch('userNotes/openDBChannel', {
  where: [
    ['archived', '==', false],
    ['created_by', '==', '{userId}'],
  ],
})

// then when the archive-page is opened:
store.dispatch('userNotes/fetchAndAdd', {
  where: [
    ['archived', '==', true],
    ['created_by', '==', '{userId}'],
  ],
})
```

Both `openDBChannel` and `fetchAndAdd` will add the documents in the same Vuex module, so it is really easy to work with. You can then create some getters with just the archived or not-archived notes like so:

```js
getters: {
  notArchivedNotes: (state) => {
    return Object.values(state.data).filter(note => !note.archived)
  },
  archivedNotes: (state) => {
    return Object.values(state.data).filter(note => note.archived)
  }
}
```

## Automatic initial doc insertion

> Only for 'doc' mode

When your vuex-easy-firestore module has `firestoreRefType: 'doc'`, either with openDBChannel or fetchAndAdd it will try and find that single document in your Firestore, according to your `firestorePath`. However, sometimes there might be cases where this doc does not yet exist inside your Firestore. When this happens vuex-easy-firestore will automatically insert an initial doc for you.

In the example below we have a setup where one document per page is fetched and added when a page is opened. The `pageId` is retrieved from Vue router:

```js
// Vuex module
const myModule = {
  firestorePath: 'pages/{pageId}',
  firestoreRefType: 'doc',
  moduleName: 'openPage',
  statePropName: 'data',
  namespaced: true, // automatically added
}

// Vue component
export default {
  name: 'openPage',
  mounted () {
    const pageId = this.$router.params.id
    this.$store.dispatch('openPage/fetchAndAdd', { pageId })
  },
}
```

However, there might be cases where you want to prevent an initial doc to be added automatically. One example case might be when a user that visits the page doesn't have the permission to insert docs. In this case you can prevent the initial doc insert by vuex-easy-firestore entirely:

```js
// Vuex module
const myModule = {
  firestorePath: 'pages/{pageId}',
  firestoreRefType: 'doc',
  moduleName: 'openPage',
  statePropName: 'data',
  sync: {
    preventInitialDocInsertion: true,
  },
}

// Vue component
export default {
  name: 'openPage',
  mounted () {
    const pageId = this.$router.params.id
    this.$store.dispatch('openPage/fetchAndAdd', { pageId }).catch(error => {
      if (error === 'preventInitialDocInsertion') {
        // an initial doc insertion was prevented
      }
    })
  },
}
```

You can also disable initial doc insertion on the top level for all modules:

```js
const easyFirestore = createEasyFirestore([module1, module2], { preventInitialDocInsertion: true })

// include as PLUGIN in your vuex store:
const store = {
  // ... your store
  plugins: [easyFirestore],
}
```

## Multiple modules with 2-way sync

Of course you can have multiple vuex modules, all in sync with different firestore paths.

```js
const userDataModule = {
  /* config */
}
const anotherModule = {
  /* config */
}
const aThirdModule = {
  /* config */
}
// make sure you choose a different moduleName and firestorePath each time!
const easyFirestores = createEasyFirestore([userDataModule, anotherModule, aThirdModule], {
  logging: true,
})
// and include as PLUGIN in your vuex store:
store: {
  // ... your store
  plugins: [easyFirestores]
}
```

Do not forget you will have to dispatch openDBChannel or fetchAndAdd for each module you want to retrieve the doc(s) of:

```js
import { onAuthStateChanged } from 'firebase/firestore'
onAuthStateChanged((user) => {
  if (user) {
    store.dispatch('userDataModule/openDBChannel').catch(console.error)
    store.dispatch('anotherModule/openDBChannel').catch(console.error)
    store.dispatch('aThirdModule/openDBChannel').catch(console.error)
  }
})
```

## Sync directly to module state

In your vuex-easy-firestore modules you can -- instead of choosing `statePropName` where your docs will be added to -- choose to leave `statePropName` blank.

Leaving `statePropName` blank and syncing directly to the state means that the doc(s) will be added directly to the `state` of the module.

In most cases I would advise against this, because you might want to save other data in your module's state as well. Mixing your documents data with other data will give you a harder time when creating getters for that module!

It is usually much better to use the same `statePropName` (eg. `'data'`) for all modules. This makes writing getters etc. much easier.

## Manual fetch handling

> Only for 'collection' mode.

Besides `fetchAndAdd` there is also the `fetch` action. The difference is that with just `fetch` it will not add the documents to your vuex module, so you can handle the result yourself. `fetch` is useful because it will automatically use the Firestore path from your module.

```js
dispatch('myModule/fetch', { where: [['archived', '==', true]] })
  .then(querySnapshot => {
    if (querySnapshot.done === true) {
      // `{done: true}` is returned when everything is already fetched and there are 0 docs:
      console.log('finished fetching all docs')
      return
    }
    // do whatever you want with the `querySnapshot`
  })
  .catch(console.error)
```

The `querySnapshot` that is returned is the same querySnapshot as the Firestore one. Please read the [Firestore documentation on querySnapshot](https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot) to know what you can do with these. Only when all documents were already fetched (and the result is 0 docs) vuex-easy-firestore will return `{done: true}` instead.

Please note, just like [fetchAndAdd](#fetching-docs) explained above, `fetch` also has a default limit of 50 docs per retrieval. You can then continue calling fetch to retrieve the next set of docs or pass a custom limit or 0 to disable it.

```js
// custom fetch limit:
dispatch('myModule/fetch', { clauses: { limit: 1000 } })
// no fetch limit:
dispatch('myModule/fetch', { clauses: { limit: 0 } })
```

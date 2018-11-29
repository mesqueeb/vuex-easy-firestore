## Installation

```bash
npm i --save vuex-easy-firestore firebase
# or
yarn add vuex-easy-firestore firebase
```

Firebase is a peer dependency; It will use your existing version.

## Setup

It's super easy to set up and start using!

1. Add 4 lines of code to your vuex-module
2. Import the vuex-module wrapped in vuex-easy-firestore plugin
3. dispatch `openDBChannel` action

```js
import createEasyFirestore from 'vuex-easy-firestore'

const userDataModule = {
  firestorePath: 'users/{userId}/data',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'userData',
  statePropName: 'docs',
  // you can also add state/getters/mutations/actions
  // for other config like fillables see 'Extra features'
}

// do the magic 🧙🏻‍♂️
const easyFirestore = createEasyFirestore(userDataModule, {logging: true})

// include as PLUGIN in your vuex store:
store: {
  // ... your store
  plugins: [easyFirestore]
}

// open the DB channel
store.dispatch('userData/openDBChannel')
```

Now your `userData` module will automatically retrieve all docs from firestore and any mutations you make will be synced to Firestore! Please check the [guide](guide.html) for basic information how to properly use the actions/mutations.

### Dev logging

Passing `{logging: true}` as second param will enable console.logging on each api call. This is recommended for debugging initially, but could be disabled on production.

## Open DB channel

The first thing you need to do is open the connection to Firestore. You can do so by simply doing:

```js
dispatch('moduleName/openDBChannel').catch(console.error)
```

### Store the docs in vuex

`openDBChannel` will retrieve the data/docs from Firestore and doesn't require any callback in particular; **the results will automatically be added to your vuex module** as per your configuration.

In the example below, Firestore docs will be saved in vuex module `userData/docs`. You can also leave statePropName empty to save the docs directly to the vuex module's state.

```js
{
  moduleName: 'userData',
  statePropName: 'docs',
}
```

With vuex-easy-firestore modules you should be using the Vuex [actions](guide.html) that were set up for you, then Firestore will always be in sync!

### Example with user ID:

If your firestore path contains a user ID, you will need to wait for the user. After Firebase finds a user through `onAuthStateChanged` you can dispatch `openDBChannel` and it will automatically pickup the correct user ID.

```js
// Be sure to initialise Firebase first
Firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // user is logged in
    store.dispatch('userData/openDBChannel')
      .catch(console.error)
  }
})
```

### Under the hood

Vuex-easy-firestore uses Firestore's [onSnapshot](https://firebase.google.com/docs/firestore/query-data/listen) to retrieve the doc(s) from the server and has added logic to save those doc(s) in a vuex module. If you do not want to open an `onSnapshot` listener you can also use [fetch](guide.html#fetching-docs-with-different-filters) instead.

Also note that just like Firestore you can use `where` and `orderBy` filters (see [Filters](extra-features.html#filters)).

### Close DB channel

In most cases you never need to close the connection to Firestore. But if you do want to close it (unsubscribe from Firestore's `onSnapshot`) you can do so like this:

```js
dispatch('moduleName/closeDBChannel')
```

This will close the connection using Firestore's [unsubscribe function](https://firebase.google.com/docs/firestore/query-data/listen#detach_a_listener).

Please note, `closeDBChannel` **will not clear out the vuex-module.** This means that you can continue to insert/patch/delete docs and they will still be synced to the server. However, changes on the server side will not be reflected to the app anymore.

You can also close the connection and completely clear out the module; removing all docs from vuex. (without deleting anything on the server, don't worry) In this case do:

```js
dispatch('moduleName/closeDBChannel', {clearModule: true})
```

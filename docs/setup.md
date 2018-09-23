## Installation

```bash
npm i --save vuex-easy-firestore
```

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

The first thing you need to do is open the connection to Firestore. You can do so by just `dispatch('userData/openDBChannel')`.

**Example with user ID:**<br>
If your firestore path contains a user ID, you will need to wait for the user. After Firebase finds a user through `onAuthStateChanged` you can dispatch `openDBChannel` and it will automatically pickup the correct user ID.

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

**Store the docs in vuex:**<br>
`openDBChannel` doesn't require any callback in particular; the results will be saved in your vuex store at the path you have set.

In the example below Firestore docs will be saved in vuex module `userData/docs`. You can also leave statePropName empty to save the docs directly to the vuex module's state.

```js
{
  moduleName: 'userData',
  statePropName: 'docs',
}
```

To automatically edit your vuex store & have firebase always in sync you just need to use the [actions](guide.html) that were set up for you.

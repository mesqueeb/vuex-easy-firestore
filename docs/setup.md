## Installation

```bash
npm i --save vuex-easy-firestore firebase
# or
yarn add vuex-easy-firestore firebase
```

Firebase is a peer dependency; It will use your existing version.

## Setup

It's super easy to set up and start using! Below is a short example how to setup your vuex easy firestore module:

1. Add 4 lines of code to your vuex-module
2. Import the vuex-module wrapped in vuex-easy-firestore plugin
3. dispatch `openDBChannel` action


```js
import createEasyFirestore from 'vuex-easy-firestore'

const myModule = {
  firestorePath: 'myDocs',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'myModule',
  statePropName: 'data',
  // you can also add state/getters/mutations/actions
}

// do the magic 🧙🏻‍♂️
const easyFirestore = createEasyFirestore(myModule, {logging: true})

// include as PLUGIN in your vuex store:
store: {
  // ... your store
  plugins: [easyFirestore]
}

// open the DB channel
store.dispatch('myModule/openDBChannel')
```

By dispatching `openDBChannel` the library will automatically retrieve all docs from your Firestore collection called `myDocs` and save them in your state at `myModule.data`.

You can edit and add docs and all changes will be synced to Firestore! Please check "[add and manage data](add-and-manage-data.html)" for basic information how to use the actions that are prepared for you.

### Dev logging

Passing `{logging: true}` as second param will enable console.logging on each api call. This is recommended for debugging initially, but could be disabled on production.

## First steps

I made Vuex easy firestore to be as easy to use as possible! Nevertheless, there are many things you can configure so it can fit a wide variety of applications. Because of this, it might seem a little bit overwhelming in the beginning. Especially if you are still new to either Vuex or Firestore.

I advise everyone to first try a simple setup as shown above and jump straight to the "[add and manage data](add-and-manage-data.html)" section to see which actions you can use to add and edit documents. Once you were able to set up a simple configuration like this succesfully, go on to learn more about the ways you can [retrieve data](query-data.html#get-data.html) into your vuex modules; how to use the user id's [Firebase authentication](query-data.html#firestore-authentication); etc.

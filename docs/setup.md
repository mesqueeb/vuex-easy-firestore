## Installation

```bash
npm i --save vuex-easy-firestore firebase
# or
yarn add vuex-easy-firestore firebase
```

Firebase is a peer dependency; It will use your existing version.

::: warning Dependency Compatibility
This package is developed and only tested with:
- Firebase SDK >=9 (not in comp mode)
- Vuex 4
- Vue 3
:::

## Setup

Vuex Easy Firestore is all about adding just a few lines to each Vuex module to automatically have it sync with your Firestore. We'll take you through the next three steps:

1. Create a Firebase init file
2. Create a Vuex store init file
3. Create and export your vuex-easy-firestore modules

### 1. Create a Firebase init file

First we'll create a function that enables Firebase and Firestore and will attempt to enable offline persistence. You can read more on this in the [Firebase documentation](https://firebase.google.com/docs/firestore/manage-data/enable-offline).

```js
// ~config/firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'


function initFirebase () {
  return new Promise((resolve, reject) => {
    const firebaseApp = initializeApp(config);
    const firestoreDB = getFirestore(firebaseApp);
    enableIndexedDbPersistence(firestoreDB);
      .then(() => resolve(firebaseApp))
      .catch(err => {
        if (err.code === 'failed-precondition') {
          reject(err)
          // Multiple tabs open, persistence can only be
          // enabled in one tab at a a time.
        } else if (err.code === 'unimplemented') {
          reject(err)
          // The current browser does not support all of
          // the features required to enable persistence
        }
      })
  })
}

export { initFirebase }
```

### 2. Create a Vuex store init file

```js
// ~store/index.js
import { createApp } from 'vue'
import { createStore } from 'vuex'
import VuexEasyFirestore from 'vuex-easy-firestore'
const app = createApp({})

// import from step 1
import { initFirebase } from './config/firebase.js'
const firebaseApp = initFirebase().catch(error => {
    // take user to a page stating an error occurred
    // (might be a connection error, or the app is open in another tab)
  })

// import from step 3 (below)
import myModule from './modules/myModule.js'

// do the magic 🧙🏻‍♂️
const easyFirestore = VuexEasyFirestore(
  [myModule],
  {logging: true, FirebaseDependency: firebaseApp}
)

// include as PLUGIN in your vuex store
// please note that "myModule" should ONLY be passed via the plugin
const storeData = {
  plugins: [easyFirestore],
  // ... your other store data
}

// initialise Vuex
const store = new createStore(storeData)
// tell vue to use vuex
app.use(store)

export default store
```

It's very important that we take the user to an error page when something went wrong with the Firestore initialization.

When something went wrong and there was no data retrieved from cache or from the server, the user might still be able to see your app but without any data. **In this case it's important that we prevent the user from being able to use the app and start writing data**, because this could potentially overwrite data on the server.

Finally, passing `{logging: true}` as second param for `VuexEasyFirestore` will enable console.logging on each api call. This is recommended for debugging initially, but should be disabled on production.

### 3. Create and export your vuex-easy-firestore modules

```js
// ~store/modules/myModule.js

const myModule = {
  firestorePath: 'myDocs',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'myModule',
  statePropName: 'data',
  namespaced: true, // automatically added

  // this object is your store module (will be added as '/myModule')
  // you can also add state/getters/mutations/actions
  state: {},
  getters: {},
  mutations: {},
  actions: {},
}

export default myModule
```

## In a nutshell

Basically what Vuex Easy Firestore does is register your vuex-easy-firestore module to the store and give you a bunch of easy to use actions to retrieve and insert/modify/delete Firestore data.

For **retrieving data**, eg. just by doing `dispatch('myModule/openDBChannel')` the library will automatically retrieve all docs from your Firestore collection called `myDocs` and save them in your state at `myModule.data`.

For **editing data**, you can use `dispatch('myModule/set', {someProp: newVal})` or `dispatch('myModule/insert', {name: 'a new record'})` and all changes will be synced to Firestore!

## First steps

I made Vuex easy firestore to be as easy to use as possible! Nevertheless, there are many things you can configure so it can fit a wide variety of applications. Because of this, it might seem a little bit overwhelming in the beginning. Especially if you are still new to either Vuex or Firestore.

I advise everyone to first try a simple setup as shown above and jump straight to the "[add and manage data](add-and-manage-data.html)" section to see which actions you can use to add and edit documents. Once you were able to set up a simple configuration like this succesfully, go on to learn more about the ways you can [retrieve data](query-data.html#get-data) into your vuex modules; how to use the user id's [Firebase authentication](query-data.html#firestore-authentication); etc.

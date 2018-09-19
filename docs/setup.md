# Installation

```bash
npm i --save vuex-easy-firestore
```

# Setup

```js
import createEasyFirestore from 'vuex-easy-firestore'

const userDataModule = {
  firestorePath: 'users/{userId}/data',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'userData',
  statePropName: 'docs',
  // for more options see below
  // you can also add state/getters/mutations/actions
}

// do the magic 🧙🏻‍♂️
const easyFirestore = createEasyFirestore(userDataModule)

// and include as PLUGIN in your vuex store:
store: {
  // ... your store
  plugins: [easyFirestore]
}
```

# Frequently Asked Questions

## Firebase Error app/duplicate-service

This means that **your Vuex store is instantiated before you are able to initialise Firebase**. Sometimes when using a framework (like Quasar Framework) the standard setup would instantiate the Vuex store for you, so you'll have to adapt your code to prevent this.

Luckily, Vuex Easy Firestore has an easy solution for this as well. As you can read in the documentation, you can [manually pass your Firebase instance](extra-features.html#pass-firebase-dependency) to the library.

Below I will show a code sample of how you can successfully do so and prevent the Firebase error:

```js
// initialise Firebase
import { initializeApp } from 'firebase/app'

const firebaseApp = initializeApp(/* your firebase config */)

const easyFirestore = vuexEasyFirestore(
  [
    /*your modules*/
  ],
  { logging: true, FirebaseDependency: firebaseApp } // pass as 'FirebaseDependency'
)

// then instantiate your Vuex store
const Store = new Vuex.Store(/* your store with plugins: [easyFirestore] */)
```

Do you have questions, comments, suggestions or feedback? Or any feature that's missing that you'd love to have? Feel free to open an [issue](https://github.com/mesqueeb/vuex-easy-firestore/issues)! ♥

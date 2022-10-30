# Vuex Easy Firestore 🔥

In just 4 lines of code, get your vuex module in complete 2-way sync with firestore:

```js
const userModule = {
  firestorePath: 'users/{userId}/data',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'user',
  statePropName: 'docs',
  // the rest of your module here
}
// add userModule as vuex plugin wrapped in vuex-easy-firestore
```

and Alakazam! Now you have a vuex module called `user` with `state: {docs: {}}`.
All firestore documents in your collection will be added with the doc's id as key inside `docs` in your state.

Now you just update and add docs with `dispatch('user/set', newItem)` and forget about the rest!

Other features include hooks, fillables (limit props to sync), default values (add props on sync), a fetch function and much more...

[Installation and setup](https://mesqueeb.github.io/vuex-easy-firestore/setup.html#installation)　 →

# Motivation

I didn't like writing an entire an API wrapper from scratch for firestore every single project. If only a vuex module could be in perfect sync with firestore without having to code all the boilerplate yourself...

And that's how Vuex Easy Firestore was born.

# Documentation

See the all new documentation made with VuePress!

**[Full documentation](https://mesqueeb.github.io/vuex-easy-firestore)**

# Support

If you like what I built, you can say thanks by buying me a coffee! :)

<a href="https://www.buymeacoffee.com/mesqueeb" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

Thank you so much!! Every little bit helps.

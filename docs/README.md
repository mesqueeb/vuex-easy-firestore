---
home: true
# heroImage: /hero.png
actionText: Get Started →
actionLink: /setup
features:
- title: Simplicity First
  details: Minimal setup to auto sync a vuex-module with firestore.
- title: Powerful
  details: Easy to use features include filtering, hooks, default values & much more.
- title: Performant
  details: Automatic sync to firestore is optimised through batches to be fully performant.
footer: MIT Licensed | Copyright © 2018-present Luca Ban - Mesqueeb
---

# Overview

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

# Motivation

I didn't like writing an entire an API wrapper from scratch for firestore every single project. If only a vuex module could be in perfect sync with firestore without having to code all the boilerplate yourself...

And that's how Vuex Easy Firestore was born.

---
home: true
# heroImage: /hero.png
actionText: Get Started →
actionLink: /setup
features:
- title: Simplicity First
  details: Minimal setup to get a vuex-module synced with Firestore automatically.
- title: Powerful
  details: Easy to use features include filtering, hooks, automatic Firestore Timestamp conversion & much more.
- title: Performant
  details: Automatic 2-way sync is fully optimised through api call batches.
footer: MIT Licensed | Copyright © 2018-present Luca Ban - Mesqueeb
---

# Overview

In just 4 lines of code, get your vuex module in complete 2-way sync with firestore:

```js
const userDataModule = {
  firestorePath: 'users/{userId}/data',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'userData',
  statePropName: 'docs',
  // the rest of your module here
}
// add userDataModule as vuex plugin wrapped in vuex-easy-firestore
```

and Alakazam! Now you have a vuex module called `userData` with `state: {docs: {}}`.
All firestore documents in your collection will be added with the doc's id as key inside `docs` in your state.

Now you just update and add docs with `dispatch('userData/set', newItem)` and forget about the rest!

# Features

- Automatic 2-way sync between your Vuex module & Firestore
- [Timestamp conversion to Date()](extra-features.html#defaultvalues-set-after-server-retrieval)
- [Hooks](hooks.html#hooks) (before / after sync)
- [Fillables / guard](extra-features.html#fillables-and-guard) (limit fields which will sync)
- [Where / orderBy filters](guide.html#query-data-filters)

# Motivation

I didn't like writing an entire an API wrapper from scratch for firestore every single project. If only a vuex module could be in perfect sync with firestore without having to code all the boilerplate yourself...

And that's how Vuex Easy Firestore was born.

<div style="text-align: right; margin-bottom: 1rem"><a href="setup.html">Installation and setup</a>　→</div>

# Support

If you like what I built, you can say thanks by buying me a coffee! :)

<link href="https://fonts.googleapis.com/css?family=Cookie" rel="stylesheet"><a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/mesqueeb"><img src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg" alt="Buy me a coffee"><span style="margin-left:5px">Buy me a coffee</span></a>

Thank you so much!! Every little bit helps.

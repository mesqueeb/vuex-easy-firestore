# Extra features

## Variables for firestorePath or filters

Besides `'{userId}'` in your `firestorePath` in the config or in where filters, you can also use **any variable** in the `firestorePath` or the `where` filter.

```js
// your vuex module
SpecificGroupUserModule: {
  firestorePath: 'groups/{groupId}/users/{userId}',
  moduleName: 'groupUserData',
}
```

You can replace a path variable with the actual string by:

```js
// 1. Passing it as a parameter to openDBChannel
dispatch('groupUserData/openDBChannel', {groupId: 'group-A'})

// 2. Passing it as a parameter to fetchAndAdd
dispatch('groupUserData/fetchAndAdd', {groupId: 'group-A'})

// 3. Dispatching setPathVars
dispatch('groupUserData/setPathVars', {groupId: 'group-A'})
```

Always clear out your Vuex module before you change a path variable. You can do so by:

```js
dispatch('moduleName/closeDBChannel', {clearModule: true})
// or just
commit('moduleName/RESET_VUEX_EASY_FIRESTORE_STATE')
```

### Warning: Do not overuse path variables!

The original intend of Vuex Easy Firestore is to have _1 Firestore path_ in sync with _1 Vuex module_. Changing a path variable means that **each following patch/insert/deletion will use that path**.

Only the last path variable you passed to a module is kept! So you cannot add documents from several different paths (eg. you call `fetchAndAdd` three times with different path variables provided) and still expect to be able to modify all these docs.

### Use case: Retrieve a variable from the user's Data

Custom variables are useful however, if you need to first retrieve eg. a `groupId` from the user's data also on firestore. You can do so by waiting for the Promise to resolve after `openDBChannel` to retrieve the user's data (eg. another vuex-easy-firestore module called `userData`):

```js
// in this example the `userData` module will retrieve {userName: '', groupId: ''}
store.dispatch('userData/openDBChannel')
  .then(_ => {
    // Then we can get the groupId:
    const userGroupId = store.state.userData.groupId
    // Then we can pass it as variable to the next openDBChannel:
    store.dispatch('groupUserData/openDBChannel', {groupId: userGroupId})
  })
```

### Bad use case example

Do **not** use use a path variable as last param of a FirestorePath in 'doc' mode! Eg:

```js
// DO NOT DO THIS!
SpecificGroupUserModule: {
  firestorePath: 'pages/{pageId}',
  firestoreRefType: 'doc',
  moduleName: 'page',
}

// in your Vue file (DO NOT DO THIS!)
export default {
  created () {
    const pageId = this.$route.params.id
    this.$store.dispatch('page/fetchAndAdd', {pageId})
  },
  computed: {
    openDoc () {
      return this.$store.state.page
    }
  }
}
```

The above example shows a Vuex module linked to a single doc, but this path is changed every time the user opens a page and then the doc is retrieved. The reasons not to do this are:

- When opening a new page you will need to release the previous doc from memory every time, so when the user goes back you will be charged with a read every single time!
- Please see [this thread](https://github.com/mesqueeb/vuex-easy-firestore/issues/172) for problems when there's an internet interruption.

Instead, use 'collection' mode! This way you can keep the pages that were openend already and opening those pages again is much faster. That implementation would look like this:

```js
// MUCH BETTER:
SpecificGroupUserModule: {
  firestorePath: 'pages',
  firestoreRefType: 'collection',
  moduleName: 'pageData',
  statePropName: 'data',
}

// in your Vue file
export default {
  created () {
    const pageId = this.$route.params.id
    this.$store.dispatch('pages/fetchById', pageId)
  },
  computed: {
    openDoc () {
      const pageId = this.$route.params.id
      return this.$store.state.pages.data[pageId]
    }
  }
}
```

## Fillables and guard

You can prevent props on your docs to be synced to the firestore server. For this you should use either `fillables` **or** `guard`:

- *Fillables:* Array of keys - the props which **may be synced** to the server.
  - 0 fillables = all props are synced
  - 1 or more fillables = only those props are synced (any prop not in fillables is not synced)
- *Guard:* Array of keys - the props which **should not be synced** to the server.
  - adding any prop here will prevent it from being synced

```js
{
  // your other vuex-easy-fire config...
  sync: {
    fillables: [], // array of  keys
    guard: [], // array of keys
  }
}
```

### Example fillables

```js
// settings:
fillables: ['name', 'age']

// insert new doc:
const newUser = {name: 'Ash', age: 10, email: 'ash@pokemon.com'}
dispatch('user/set', newUser)

// object which will be added to Vuex `user` module:
{name: 'Ash', age: 10, email: 'ash@pokemon.com'}

// object which will be synced to firestore:
{name: 'Ash', age: 10}
```

### Example guard

If you have only one prop you do not want to sync to firestore you can set `guard` instead of `fillables`.

```js
// the same example as above can also be achieved by doing:
guard: ['email']
```

### Nested fillables/guard

In the example below we will prevent the nested field called `notAllowed` from being synced:

```js
const docToPatch = {nested: {allowed: true, notAllowed: true}}

// in your module config, either set the fillables like so:
fillables: ['nested.allowed']

// OR set your guard like so:
guard: ['nested.notAllowed']
```

### Wildcard fillables/guard

You can also use wildcards!

In this example you have a document with an object called `lists`. The lists each have an id as the key, and a nested property you want to prevent from being synced:

```js
const docToPatch = {
  lists: {
    'list-id1': {allowed: true, notAllowed: true},
    'list-id2': {allowed: true, notAllowed: true}
  }
}

// in your module config, either set the fillables like so:
fillables: ['lists.*.allowed']

// OR set your guard like so:
guard: ['lists.*.notAllowed']
```

## Default values

You can set up default values for your docs that will be added to the object on each insert.

**In 'doc' mode** this can just be done by adding those values to your module state. This is how's it's done regularly with Vuex.

**In 'collection' mode** the library takes care of applying these default values to each doc that's inserted. Default values should be set in your modules `sync` config:

```js
const pokemonBoxModule = {
  // your other vuex-easy-firestore config...
  sync: {
    defaultValues: {
      freed: false,
    },
  }
}

// Now, when you add a new pokemon, it will automatically have `freed`
dispatch('pokemonBox/insert', {name: 'Poliwag'})
// This will appear in your module like so:
// {name: 'Poliwag', freed: false}
```

Also, to make sure there are no vue reactivity issues, these default values are also applied to any doc that doesn't have them that's retrieved from the server.

## Firestore Timestamp conversion

Firestore works with special "[timestamp](https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp)" fields rather than with `new Date()`. The general rule is: **If you set or update a field to be `new Date()` it will be converted to a special Timestamp field on the server automatically.**

There is nothing you can do to prevent this, it's just how Firestore works. The problem is that next time a user opens your app and your documents are retrieved from the server, you will be getting Timestamps and have to call `timestamp.toDate()` on each of these fields!

**Luckily vuex-easy-firestore can do this for you!** This library has date fields for `created_at` and `updated_at` that are already automatically converted to regular dates upon server retrieval. So we can easily extend this function to include other fields you want to use `new Date()`.

You just have to specify the fields in a `convertTimestamps` object in your module config like so:

```js
const vuexModule = {
  // your other vuex-easy-firestore config...
  serverChange: {
    convertTimestamps: {
      created_at: '%convertTimestamp%', // default
      updated_at: '%convertTimestamp%', // default
      // define each field like so ↑ in an object here
    },
  }
}
```

The Timestamps of each of the fields defined like above will automatically trigger `Timestamp.toDate()` before being added to your vuex store!

Eg.

```js
dispatch('module/set', {timestampField: new Date()})
```

The above will be added as `new Date()` in vuex but as a _timestamp_ in Firestore.

## Pass Firebase dependency

Vuex Easy Firestore will automatically use Firebase as a peer dependency to access `Firebase.auth()` etc. If you want to pass a Firebase instance you have instantiated yourself you can do so like this:

```js
// make sure you import at least auth and firestore as well:
import * as Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import createEasyFirestore from 'vuex-easy-firestore'
const easyFirestore = createEasyFirestore(
  userDataModule,
  {logging: true, FirebaseDependency: Firebase} // pass Firebase like this. Mind the Capital F!
)
```

## Custom sync debounce duration

Vuex easy firestore only makes one api call per 1000ms, no matter how many patches you make. This default debounce duration of 1000ms can be modified per module like so:

```js
const vuexModule = {
  // your other vuex-easy-firestore config...
  sync: {
    debounceTimerMs: 2000
    // defaults to 1000
  }
}
```

## Shortcut: set(path, doc)

Inside Vue component templates there is a shortcut for `dispatch('module/set', newVal)`. If you enable support for my other library called 'vuex-easy-access' you will be able to just use `set('module', newVal)` instead!

For this shortcut usage, import the npm module 'vuex-easy-access' when you initialise your store and add it as plugin. Pass the 'vuex-easy-firestore' plugin first and **the 'vuex-easy-access' plugin second** for it to work properly.

Also add `{vuexEasyFirestore: true}` in the options when you initialise 'vuex-easy-access' like so:

```js
import vuexEasyAccess from 'vuex-easy-access'
const easyAccess = vuexEasyAccess({vuexEasyFirestore: true})

const store = {
  plugins: [easyFirestoreModules, easyAccess]
}
```

Please check the relevant documentation [on the vuex-easy-access repository](https://mesqueeb.github.io/vuex-easy-access/advanced.html#firestore-integration-for-google-firebase)!

### About 'vuex-easy-access'

Vuex easy access has a lot of different features to make working with your store extremely easy. The main purpose of that library is to be able to do any kind of mutation to your store directly from the templates without having to set up actions yourself. It is especially usefull when working with wildcards. Please see the [introduction on Vuex Easy Access here](https://mesqueeb.github.io/vuex-easy-access/).

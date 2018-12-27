# Extra features

## Variables for firestorePath or filters

Besides `'{userId}'` in your `firestorePath` in the config or in where filters, you can also use **any variable** in the `firestorePath` or the `where` filter.

```js
// your vuex module
SpecificGroupUserModule: {
  moduleName: 'groupUserData',
  firestorePath: 'groups/{groupId}/users/{userId}'
}
// Just pass the groupId as a parameter to openDBChannel!
dispatch('groupUserData/openDBChannel', {groupId: 'group-A'})
```

**Use case: Retrieve a variable from the user's Data**

Custom variables are especially useful if you need to first retrieve eg. a `groupId` from the user's data also on firestore. You can do so by waiting for the Promise to resolve after `openDBChannel` to retrieve the user's data (eg. another vuex-easy-firestore module called `userData`):

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

## Duplicating docs

> Only for 'collection' mode.

You can duplicate a document really simply by dispatching 'duplicate' and passing the id of the target document.

```js
// let's duplicate Bulbasaur who has the id '001'
dispatch('pokemonBox/duplicate', '001')
```

This will create a copy of Bulbasaur (and all its props) with a random new ID. The duplicated doc will automatically be added to your vuex module and synced as well.

If you need to know which new ID was generated for the duplicate, you can retrieve it from the action:

```js
const idMap = await dispatch('pokemonBox/duplicate', '001')
// mind the await!
// idMap will look like this:
{'001': dupeId}
// dupeId will be a string with the ID of the duplicate!
```

In the example above, if Bulbasaur ('001') was duplicated and the new document has random ID `'123abc'` the `idMap` will be `{'001': '123abc'}`.

### Duplicate batch

This is how you duplicate a batch of documents:

```js
const idMap = await dispatch('pokemonBox/duplicateBatch', ['001', '004', '007'])
// idMap will look like this:
{
  '001': 'some-random-new-ID-1',
  '004': 'some-random-new-ID-2',
  '007': 'some-random-new-ID-3',
}
```

This way you can use the result if you need to do extra things to your duplicated docs and you will know for each ID which new ID was used to make a duplication.

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

Firestore works with special "[timestamp](https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp)" fields rather than with `new Date()`. Vuex-easy-firestore also uses the timestamp fields for the auto-generated fields `created_at` and `updated_at` which are added to your docs.

In your app, if you want to use these timestamps as a `new Date()` object you have to call `timestamp.toDate()` on each of these fields. **Luckily we can do this for you!**

You just have to specify the fields in a `convertTimestamps` object in your module config like so:

```js
const vuexModule = {
  // your other vuex-easy-firestore config...
  serverChange: {
    convertTimestamps: {
      updated_at: '%convertTimestamp%'
      // define each field like so ↑ in an object here
    },
  }
}
```

Now the Timestamp on `updated_at` will automatically trigger `Timestamp.toDate()` before being added to your vuex store!

If you want to use Firestore _timestamps_ on a custom field, you can just go ahead and set the field to `new Date()`. This is because Firestore will automatically change this for you to a timestamp field on the server either way!
Eg.

```js
dispatch('module/set', {timestampField: new Date()})
```

The above will be added as `new Date()` in vuex but as a _timestamp_ in Firestore.

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

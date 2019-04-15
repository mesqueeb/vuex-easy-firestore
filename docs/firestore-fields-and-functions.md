# Firestore fields and functions

## arrayUnion and arrayRemove

Just like Firestore, Vuex Easy Firestore supports the usage of *arrayUnion* and *arrayRemove*. ([Firestore documentation](https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array))

```js
import { arrayUnion, arrayRemove } from 'vuex-easy-firestore'

store.dispatch('myDocModule/patch', {
  array1: arrayUnion('a new val'),
  array2: arrayRemove('some val'),
})
```

And as always, your vuex module & firestore will stay in sync!

## increment

Just like Firestore, Vuex Easy Firestore also supports the usage of *increment*. ([Firestore documentation](https://firebase.google.com/docs/reference/node/firebase.firestore.FieldValue.html#increment))

```js
import { increment } from 'vuex-easy-firestore'

store.dispatch('myDocModule/patch', {
  counter: increment(10)
})
```

It also doesn't matter how many times you call this function. See the example below where a counter is incremented by 30 with three seperate calls.

```js
function incrementBy10 () {
  store.dispatch('myDocModule/patch', {
    counter: increment(10)
  })
}
incrementBy10()
incrementBy10()
incrementBy10()
```

Vuex Easy Firestore takes care of updating your Vuex state and also groupes multiple calls to make only single patch every 1000ms (as it does with all patches, saving you some pennies 😉).

## Delete fields

Since document modifications are merged with the data on the server, you have to be specific if you want to delete a field entirely. In Firestore you can use `firebase.firestore.FieldValue.delete()` for this purpose. ([Firestore documentation](https://firebase.google.com/docs/firestore/manage-data/delete-data#fields))

In vuex-easy-firestore it will automatically delete fields when you use the `delete` action. However, there's a small difference between 'doc' mode and 'collection' mode:

```js
// in 'doc' mode:
store.dispatch('myDocModule/delete', 'field')
// is the same as
store.dispatch('myDocModule/patch', {field: firebase.firestore.FieldValue.delete()})

// in 'collection' mode:
const id = '001'
store.dispatch('myCollectionModule/delete', `${id}.field`)
// is the same as
store.dispatch('myCollectionModule/patch', {id, field: firebase.firestore.FieldValue.delete()})
```

Please note that you can also delete nested properties by using `.` in between the field names. Eg. `field.nestedField.veryDeepField`.

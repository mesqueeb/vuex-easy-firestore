# Firestore fields and functions

## arrayUnion and arrayRemove

Just like Firestore, Vuex Easy Firestore supports the usage of *arrayUnion* and *arrayRemove*. ([Firestore documentation](https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array))

```js
import { arrayUnion, arrayRemove } from 'vuex-easy-firestore'

store.patch('myModule/patch', {
  id: '001',
  array1: arrayUnion('a new val'),
  array2: arrayRemove('some val'),
})
```

And as always, your vuex module & firestore will stay in sync!

## Delete fields

Since document modifications are merged with the data on the server, you have to be specific if you want to delete a field entirely. In Firestore you can use `firebase.firestore.FieldValue.delete()` for this purpose. ([Firestore documentation](https://firebase.google.com/docs/firestore/manage-data/delete-data#fields))

In vuex-easy-firestore it will automatically delete fields when you use the `delete` action. However, there's a small difference between 'doc' mode and 'collection' mode:

```js
// in 'doc' mode:
store.dispatch('myModule/delete', 'field')
// is the same as
store.dispatch('myModule/patch', {field: firebase.firestore.FieldValue.delete()})

// in 'collection' mode:
const id = '001'
store.dispatch('myModule/delete', `${id}.field`)
// is the same as
store.dispatch('myModule/patch', {id, field: firebase.firestore.FieldValue.delete()})
```

Please note that you can also delete nested properties by using `.` in between the field names. Eg. `field.nestedField.veryDeepField`.

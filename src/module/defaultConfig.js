
/**
 * A function executed during the 2 way sync when docs are added/modified/deleted. NEEDS TO EXECUTE FIRST PARAM! You can use this function to do a conditional check on the documents to decide if/when to execute the store update.
 *
 * @param {function} storeUpdateFn this is the function that will make changes to your vuex store. Takes no params.
 * @param {object} store the store for usage with `store.dispatch`, `store.commit`, `store.getters` etc.
 * @param {string} id the doc id returned in `change.doc.id` (see firestore documentation for more info)
 * @param {object} doc the doc returned in `change.doc.data()` (see firestore documentation for more info)
 * @param {string} source of the change. Can be 'local' or 'server'
 */
function syncHook (storeUpdateFn, store, id, doc, source, change) {
  // throw error if you want to stop the document in your store from being modified
  // do some stuff
  storeUpdateFn()
  // do some stuff
}

export default {
  moduleNameSpace: 'firestore',
  // this is the vuex module path that will be created
  docsStateProp: '',
  // this is the state property where your docs will end up inside the module
  // when not set your doc's props will be set directly to your vuex module's state
  firestorePath: '',
  // this is the firestore collection path to your documents. You can use `{userId}` which will be replaced with `Firebase.auth().uid`
  firestoreRefType: 'collection', // or 'doc'
  // depending if what you want to sync is a whole collection or a single doc
  vuexUserPath: '',
  // the path where your firebase user gets saved in vuex. Required to be able to have reactivity after login.
  sync: {
    type: '2way',
    // '2way' only ('read only' not yet integrated)
    where: [], // only applicable on 'collection'
    orderBy: [], // only applicable on 'collection'
    defaultValues: {},
    // About defaultValues:
    // These are the default properties that will be set on each doc that's synced to the store or comes out of the store.
    // You HAVE to set all props you want to be reactive on beforehand!
    // These values are only set when you have items who don't have the props defined in defaultValues upon retrieval
    // The retrieved document will be deep merged on top of these default values
    added: syncHook,
    modified: syncHook,
    removed: syncHook,
    // see the syncHook function above to see what you can do
    // for firestoreRefType: 'doc' only use 'modified' syncHook
  },
  fetch: {
    docLimit: 50, // defaults to 50
  },
  insert: {
    checkCondition: null,
    // A function where you can check something and force stopping the operation if you return `false`
    // Eg. checkCondition (doc, docs) { return (doc.something != 'something') },
    fillables: [],
    guard: [],
  },
  patch: {
    checkCondition: null,
    // A function where you can check something and force stopping the operation if you return `false`
    // Eg. checkCondition (id, fields, docs) { return (doc.something != 'something') },
    fillables: [],
    guard: [],
  },
  delete: {
    checkCondition: null,
    // A function where you can check something and force stopping the operation if you return `false`
    // Eg. checkCondition (id, docs) { return (doc.something != 'something') },
  }
}

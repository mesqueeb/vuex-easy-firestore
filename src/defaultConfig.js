export default {
  vuexstorePath: '', // must be relative to rootState
  firestorePath: '',
  mapType: 'collection', // 'collection' only ('doc' not integrated yet)
  sync: {
    type: '2way', // '2way' only ('1way' not yet integrated)
    where: [],
    orderBy: [],
    // You HAVE to set all fields you want to be reactive on beforehand!
    // These values are only set when you have items who don't have the props defined in defaultValues upon retrieval
    // These default values will be merged with a reverse Object.assign on retrieved documents
    defaultValues: {},
    added: {
      before: _ => _,
      after: _ => _,
    },
    modified: {
      before: _ => _,
      after: _ => _,
    },
    removed: {
      before: _ => _,
      after: _ => _,
    },
  },
  fetch: {
    docLimit: 50, // defaults to 50
  },
  insert: {
    // checkCondition (value, storeRef) { return (params == 'something') },
    checkCondition: null,
    fillables: [],
    guard: [],
  },
  patch: {
    // checkCondition (id, fields, storeRef) { return (params == 'something') },
    checkCondition: null,
    fillables: [],
    guard: [],
  },
  delete: {
    // checkCondition (id, storeRef) { return (params == 'something') },
    checkCondition: null,
  }
}

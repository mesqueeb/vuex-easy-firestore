const fillables = [
  'id',
  'parent_id',
  'depth',
  'children_order', 'show_children',
  'summary', 'description', 'toggle',
  'tags',
  'due_date',
  'planned_time', 'used_time', 'completion_rate',
  'calId', 'calendarId', 'start', 'end',
  'recurrence', 'recurrenceSetting',
  'done', 'done_date_full', 'done_date', 'done_hour', 'completion_memo', 'archived',
  'parents_bodies',
  'deleted', 'deleted_at',
  'created_by', 'created_at', 'updated_at'
]
const defaultValues = {
  children_order: [],
  tags: {},
  toggle: '',
  show_children: true,
  done: false,
  archived: false,
  deleted: false,
  planned_time: 0,
  used_time: 0
}
const userId = store.getters['user/id']
export default {
  vuexstorePath: 'nodes', // must be relative to rootState
  firestorePath: `userItems/${userId}/items`,
  mapType: 'collection', // 'collection' only ('doc' not integrated yet)
  sync: {
    type: '2way', // '2way' only ('1way' not yet integrated)
    where: [['archived', '==', false], ['deleted', '==', false]],
    orderBy: ['depth'],
    // You HAVE to set all fields you want to be reactive on beforehand!
    // These values are only set when you have items who don't have the props defined in defaultValues upon retrieval
    // These default values will be merged with a reverse Object.assign on retrieved documents
    defaultValues, // object
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
    checkCondition (value, storeRef) { return true },
    // checkCondition (value, storeRef) { if (~~~) { return true } },
    fillables,
    guard: [],
  },
  patch: {
    checkCondition (id, fields, storeRef) {
      return (!id.toString().includes('tempItem'))
    },
    fillables,
    guard: [],
  },
  delete: {
    checkCondition (id, storeRef) {
      return (!id.toString().includes('tempItem'))
    },
  }
}

import store from '../index'
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
// const userId = store.getters['user/id']
export default {
  vuexstorePath: 'nodes', // must be relative to rootState
  firestorePath: 'userItems/${userId}/items',
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
      before: async (id, doc, store, source, change) => {
        const tempId = doc.id
        doc.id = id
        if (store.state.tempIdsToReplace.includes(tempId)) {
          store.dispatch('replaceTempItem', {item: doc, tempId})
          store.state.tempIdsToReplace = store.state.tempIdsToReplace
            .filter(_tempId => _tempId !== tempId)
          console.log(`Took ${tempId} out of the tempIdsToReplace.`)
          throw false
        }
      },
      after: (id, doc, store, source, change, response) => {
        if (response === false) return
        const item = doc
        if (item.parent_id && !store.state.nodes[item.parent_id]) {
          store.state.orphans.push(item)
        }
        if (!item.archived && dateIsBeforeToday(item.done_date)) {
          console.log('archiving this item: ', item.id, item)
          // Update done date to adjust other related fields:
          store.commit('updateDoneDate', {id: item.id, date: item.done_date_full})
          store.dispatch('patch', {id: item.id, fields: ['archived']})
          if (item.parent_id) {
            store.state.nodes[item.parent_id].children_order =
              store.state.nodes[item.parent_id].children_order
              .filter(childId => childId !== item.id)
            // Patch and recalculate
            store.dispatch('patch', {id: item.parent_id, field: 'children_order'})
          }
        }
      }
    },
    removed: {
      after: (id, doc, store, source, change) => {
        delete window.cachedItems[id]
      }
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

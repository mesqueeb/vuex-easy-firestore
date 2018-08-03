import copyObj from './copyObj'
import flattenToPaths from './objectFlattenToPaths'
import { isObject } from 'is-what'
import Firebase from 'firebase/app'
import 'firebase/firestore'

/**
 * Grab until the api limit (500), put the rest back in the syncStack.
 *
 * @param {string} syncStackProp the prop of _sync.syncStack[syncStackProp]
 * @param {number} count the current count
 * @param {number} maxCount the max count of the batch
 * @param {object} state the store's state, will be edited!
 * @returns {array} the targets for the batch. Add this array length to the count
 */
export function grabUntilApiLimit (syncStackProp, count, maxCount, state) {
  let targets = copyObj(state._sync.syncStack[syncStackProp])
  // Check if there are more than maxCount batch items already
  if (count >= maxCount) {
    // already at maxCount or more, leave items in syncstack, and don't add anything to batch
    targets = []
  } else {
    // Convert to array if targets is an object (eg. updates)
    const targetIsObject = isObject(targets)
    if (targetIsObject) {
      targets = Object.values(targets)
    }
    // Batch supports only until maxCount items
    const grabCount = maxCount - count
    const targetsOK = targets.slice(0, grabCount)
    let targetsLeft = targets.slice(grabCount)
    // Put back the remaining items over maxCount
    if (targetIsObject) {
      targetsLeft = Object.values(targetsLeft)
        .reduce((carry, update) => {
          const id = update.id
          carry[id] = update
          return carry
        }, {})
    }
    state._sync.syncStack[syncStackProp] = targetsLeft
    // Define the items we'll add below
    targets = targetsOK
  }
  return targets
}

/**
 * Create a Firebase batch from a syncStack to be passed inside the state param.
 *
 * @export
 * @param {object} state The state which should have this prop: `_sync.syncStack[syncStackProp]`. syncStackProp can be 'updates', 'propDeletions', 'deletions', 'inserts'.
 * @param {object} dbRef The Firestore dbRef of the 'doc' or 'collection'
 * @param {Bool} collectionMode Very important: is the firebase dbRef a 'collection' or 'doc'?
 * @param {string} userId for `created_by`
 * @param {number} batchMaxCount The max count of the batch. Defaults to 500 as per Firestore documentation.
 * @returns {object} A Firebase firestore batch object.
 */
export function makeBatchFromSyncstack (state, dbRef, collectionMode, userId, batchMaxCount = 500) {
  const batch = Firebase.firestore().batch()
  const log = {}
  let count = 0
  // Add 'updates' to batch
  const updates = grabUntilApiLimit('updates', count, batchMaxCount, state)
  log['updates: '] = updates
  count = count + updates.length
  // Add to batch
  updates.forEach(item => {
    const id = item.id
    const docRef = (collectionMode) ? dbRef.doc(id) : dbRef
    const itemToUpdate = flattenToPaths(item)
    itemToUpdate.updated_at = Firebase.firestore.FieldValue.serverTimestamp()
    batch.update(docRef, itemToUpdate)
  })
  // Add 'propDeletions' to batch
  const propDeletions = grabUntilApiLimit('propDeletions', count, batchMaxCount, state)
  log['prop deletions: '] = propDeletions
  count = count + propDeletions.length
  // Add to batch
  propDeletions.forEach(path => {
    let docRef = dbRef
    if (collectionMode) {
      const id = path.substring(0, path.indexOf('.'))
      path = path.substring(path.indexOf('.') + 1)
      docRef = dbRef.doc(id)
    }
    const updateObj = {}
    updateObj[path] = Firebase.firestore.FieldValue.delete()
    updateObj.updated_at = Firebase.firestore.FieldValue.serverTimestamp()
    batch.update(docRef, updateObj)
  })
  // Add 'deletions' to batch
  const deletions = grabUntilApiLimit('deletions', count, batchMaxCount, state)
  log['deletions: '] = deletions
  count = count + deletions.length
  // Add to batch
  deletions.forEach(id => {
    const docRef = dbRef.doc(id)
    batch.delete(docRef)
  })
  // Add 'inserts' to batch
  const inserts = grabUntilApiLimit('inserts', count, batchMaxCount, state)
  log['inserts: '] = inserts
  count = count + inserts.length
  // Add to batch
  inserts.forEach(item => {
    item.created_at = Firebase.firestore.FieldValue.serverTimestamp()
    item.created_by = userId
    const newRef = dbRef.doc(item.id)
    batch.set(newRef, item)
  })
  // log the batch contents
  console.group('Created a firestore batch with:')
  Object.keys(log).forEach(key => {
    console.log(key, log[key])
  })
  console.groupEnd()
  //
  return batch
}

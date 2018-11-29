import { isPlainObject, isAnyObject } from 'is-what'
import { IPluginState, AnyObject } from '../declarations'

/**
 * Grab until the api limit (500), put the rest back in the syncStack.
 *
 * @param {string} syncStackProp the prop of _sync.syncStack[syncStackProp]
 * @param {number} count the current count
 * @param {number} maxCount the max count of the batch
 * @param {object} state the store's state, will be edited!
 * @returns {any[]} the targets for the batch. Add this array length to the count
 */
export function grabUntilApiLimit (
  syncStackProp: string,
  count: number,
  maxCount: number,
  state: IPluginState
): any[] {
  let targets = state._sync.syncStack[syncStackProp]
  // Check if there are more than maxCount batch items already
  if (count >= maxCount) {
    // already at maxCount or more, leave items in syncstack, and don't add anything to batch
    targets = []
  } else {
    // Convert to array if targets is an object (eg. updates)
    const targetIsObject = isPlainObject(targets)
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
        .reduce((carry, update: AnyObject) => {
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
 * @param {IPluginState} state The state which should have `_sync.syncStack`, `_sync.userId`, `state._conf.firestorePath`
 * @param {AnyObject} getters The getters which should have `dbRef`, `storeRef`, `collectionMode` and `firestorePathComplete`
 * @param {any} Firebase dependency injection for Firebase & Firestore
 * @param {number} [batchMaxCount=500] The max count of the batch. Defaults to 500 as per Firestore documentation.
 * @returns {*} A Firebase firestore batch object.
 */
export function makeBatchFromSyncstack (
  state: IPluginState,
  getters: AnyObject,
  Firebase: any,
  batchMaxCount: number = 500,
): any {
  // get state & getter variables
  const firestorePath = state._conf.firestorePath
  const firestorePathComplete = getters.firestorePathComplete
  const dbRef = getters.dbRef
  const collectionMode = getters.collectionMode
  // make batch
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
    if (state._conf.sync.guard.includes('id')) delete item.id
    // @ts-ignore
    batch.update(docRef, item)
  })
  // Add 'propDeletions' to batch
  const propDeletions = grabUntilApiLimit('propDeletions', count, batchMaxCount, state)
  log['prop deletions: '] = propDeletions
  count = count + propDeletions.length
  // Add to batch
  propDeletions.forEach(item => {
    const id = item.id
    const docRef = (collectionMode) ? dbRef.doc(id) : dbRef
    if (state._conf.sync.guard.includes('id')) delete item.id
    // @ts-ignore
    batch.update(docRef, item)
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
    const newRef = dbRef.doc(item.id)
    batch.set(newRef, item)
  })
  // log the batch contents
  if (state._conf.logging) {
    console.group('[vuex-easy-firestore] api call batch:')
    console.log(`%cFirestore PATH: ${firestorePathComplete} [${firestorePath}]`, 'color: grey')
    Object.keys(log).forEach(key => {
      console.log(key, log[key])
    })
    console.groupEnd()
  }
  return batch
}

/**
 * Get the matches of path variables: eg. return ['groupId'] if pathPiece is '{groupId}'
 *
 * @export
 * @param {string} pathPiece eg. 'groups' or '{groupId}'
 * @returns {string[]} returns ['groupId'] in case of '{groupId}'
 */
export function getPathVarMatches (pathPiece: string): string[] {
  const matches = pathPiece.match(/\{([a-z]+)\}/gi)
  if (!matches) return []
  return matches.map(key => trimAccolades(key))
}

/**
 * Get the variable name of a piece of path: eg. return 'groupId' if pathPiece is '{groupId}'
 *
 * @export
 * @param {string} pathPiece eg. '{groupId}'
 * @returns {string} returns 'groupId' in case of '{groupId}'
 */
export function trimAccolades (pathPiece: string): string {
  return pathPiece.slice(1, -1)
}

function stringifyParams (params: any[]): string {
  return params.map(param => {
    if (isAnyObject(param) && !isPlainObject(param)) {
      // @ts-ignore
      return String(param.constructor.name) + String(param.id)
    }
    return String(param)
  }).join()
}

/**
 * Gets an object with {whereFilters, orderBy} filters and returns a unique identifier for that
 *
 * @export
 * @param {AnyObject} [whereOrderBy={}] whereOrderBy {whereFilters, orderBy}
 * @returns {string}
 */
export function createFetchIdentifier (whereOrderBy: AnyObject = {}): string {
  let identifier = ''
  if ('whereFilters' in whereOrderBy) {
    identifier += '[where]' + whereOrderBy.whereFilters.map(where => stringifyParams(where)).join()
  }
  if ('orderBy' in whereOrderBy) {
    identifier += '[orderBy]' + stringifyParams(whereOrderBy.orderBy)
  }
  return identifier
}

import copyObj from './copyObj'

/**
 * Grab until the api limit (500), put the rest back in the syncStack.
 *
 * @export
 * @param {string} syncStackProp the prop of _sync.syncStack[syncStackProp]
 * @param {number} count the current count
 * @param {object} state the store's state, will be edited!
 */
export function grabUntilApiLimit (syncStackProp, count, state) {
  let targets = copyObj(state._sync.syncStack[syncStackProp])
  // Check if there are more than 500 batch items already
  if (count >= 500) {
    // already at 500 or more, leave items in syncstack, and don't add anything to batch
    targets = []
  } else {
    // Batch supports only until 500 items
    const targetsAmount = 500 - count
    const targetsOK = targets.slice(0, targetsAmount)
    const targetsLeft = targets.slice(targetsAmount)
    // Put back the remaining items over 500
    state._sync.syncStack[syncStackProp] = targetsLeft
    // Define the items we'll add below
    targets = targetsOK
  }
  return targets
}

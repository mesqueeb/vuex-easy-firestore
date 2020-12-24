const errorMessages = {
  'user-auth': `
    Error trying to set userId.
    Please double check if you have correctly authenticated the user with firebase Auth before calling \`openDBChannel\` or \`fetchAndAdd\`.

    If you still get this error, try passing your firebase instance to the plugin as described in the documentation:
    https://mesqueeb.github.io/vuex-easy-firestore/extra-features.html#pass-firebase-dependency
  `,
  'delete-missing-id': `
    Missing id of the doc you want to delete!
    Correct usage:
      dispatch('delete', id)
  `,
  'delete-missing-path': `
    Missing path to the prop you want to delete!
    Correct usage:
      dispatch('delete', 'path.to.prop')

    Use \`.\` for sub props!
  `,
  'missing-id': `
    This action requires an id to be passed!
  `,
  'patch-missing-id': `
    Missing an id of the doc you want to patch!
    Correct usage:

    // pass \`id\` as a prop:
    dispatch('module/set', {id: '123', name: 'best item name'})
    // or
    dispatch('module/patch', {id: '123', name: 'best item name'})
  `,
  'missing-path-variables': `
    A path variable was passed without defining it!
    In VuexEasyFirestore you can create paths with variables:
    eg: \`groups/{groupId}/user/{userId}\`

    \`userId\` is automatically replaced with the userId of the firebase user.
    \`groupId\` or any other variable that needs to be set after authentication needs to be passed upon the \`openDBChannel\` action.

    // (in module config) Example path:
    firestorePath: 'groups/{groupId}/user/{userId}'

    // Then before openDBChannel:
    // retrieve the value
    const groupId = someIdRetrievedAfterSignin
    // pass as argument into openDBChannel:
    dispatch('moduleName/openDBChannel', {groupId})
  `,
  'patch-no-ref': `
    Something went wrong during the PATCH mutation:
    The document it's trying to patch does not exist.
  `,
  'only-in-collection-mode': `
    The action you dispatched can only be used in 'collection' mode.
  `,
  'initial-doc-failed': `
    Initial doc insertion failed. Further \`set\` or \`patch\` actions will also fail. Requires an internet connection when the initial doc is inserted. Check the error returned by firebase:
  `,
  'sync-error': `
    Something went wrong while trying to synchronise data to Cloud Firestore.
    The data is kept in queue, so that it will try to sync again upon the next 'set' or 'patch' action.
  `,
}

/**
 * execute Error() based on an error id string
 *
 * @export
 * @param {string} errorId the error id
 * @param {any} [error] an actual error from an async request or something
 * @returns {string} the error id
 */
export default function (errorId: string, error?: any): string {
  const logData = errorMessages[errorId] || errorId
  console.error(`[vuex-easy-firestore] Error! ${logData}`)
  if (error) console.error(error)
  return errorId
}

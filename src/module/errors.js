
const errorMessages = {
  actionsDeleteMissingId: `
    Missing Id of the Doc you want to delete!
    Correct usage:
      dispatch('delete', id)
  `,
  actionsDeleteMissingPath: `
    Missing path to the prop you want to delete!
    Correct usage:
      dispatch('delete', 'path.to.prop')

    Use \`.\` for sub props!
  `,
  missingId: `
    Missing an id! Correct usage:

    // \`id\` as prop of item:
    dispatch('module/set', {id: '123', name: 'best item name'})

    // or object with only 1 prop, which is the \`id\` as key, and item as its value:
    dispatch('module/set', {'123': {name: 'best item name'}})
  `,
  missingPathVarKey: `
    A path variable was passed without defining it!
    In VuexEasyFirestore you can create paths with variables:
    eg: \`groups/{groupId}/user/{userId}\`

    \`userId\` is automatically replaces with the userId of the firebase user.
    \`groupId\` or any other variable that needs to be set after authentication needs to be passed upon the \`openDBChannel\` action.

    // (in module config) Example path:
    firestorePath: 'groups/{groupId}/user/{userId}'

    // Then before openDBChannel:
    // retrieve the value
    const groupId = someIdRetrievedAfterSignin
    // pass as argument into openDBChannel:
    dispatch('moduleName/openDBChannel', {groupId})
  `,
  patchNoRef: `
    Something went wrong during the PATCH mutation:
    The document it's trying to patch does not exist.
  `,
}

export default function (error) {
  Error('[vuex-easy-firestore] Error!', errorMessages[error])
  return error
}

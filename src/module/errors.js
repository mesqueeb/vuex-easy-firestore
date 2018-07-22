
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
}

export default function (error) {
  console.error('[vuex-easy-firestore] Error!', errorMessages[error])
  return error
}

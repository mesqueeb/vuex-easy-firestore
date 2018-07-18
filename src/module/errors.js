
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
  `
}

export default function (error) {
  console.error('[vuex-easy-firestore] Error!' + errorMessages[error])
  return error
}


export default {
  _sync: {
    signedIn: false,
    userId: null,
    patching: false,
    syncStack: {
      inserts: [],
      updates: {},
      deletions: [],
      propDeletions: [],
      debounceTimer: null,
    },
    fetched: [],
    stopPatchingTimeout: null
  }
}

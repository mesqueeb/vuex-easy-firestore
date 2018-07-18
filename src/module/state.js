
export default {
  _sync: {
    signedIn: false,
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

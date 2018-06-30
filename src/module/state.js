
export default {
  _sync: {
    signedIn: false,
    patching: false,
    syncStack: {
      updates: {},
      deletions: [],
      inserts: [],
      debounceTimer: null
    },
    fetched: [],
    stopPatchingTimeout: null
  }
}


export default {
  // user: null,
  syncStack: {
    updates: {},
    deletions: [],
    inserts: [],
    debounceTimer: null
  },
  retrievedFetchRefs: [],
  nextFetchRef: null,
  patching: false,
  doneFetching: false,
  stopPatchingTimeout: null,
}

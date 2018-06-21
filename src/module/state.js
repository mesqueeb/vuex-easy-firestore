import defaultConfig from './defaultConfig'

const state = {
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

export default function (userState = {}, userConfig = {}) {
  const docsStateProp = {}
  docsStateProp[userConfig.docsStateProp] = {}
  return Object.assign({}, state, defaultConfig, userState, userConfig, docsStateProp)
}

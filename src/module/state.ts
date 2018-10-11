import { AnyObject } from '../declarations'

export type IState = {
  _sync: {
    signedIn: boolean
    userId: any
    pathVariables: AnyObject
    patching: boolean
    syncStack: {
      inserts: any[]
      updates: AnyObject
      deletions: any[]
      propDeletions: any[]
      debounceTimer: any
    }
    fetched: AnyObject
    stopPatchingTimeout: any
  }
  [key: string]: any
}
/**
 * a function returning the state object
 *
 * @export
 * @returns {IState} the state object
 */
export default function (): IState {
  return {
    _sync: {
      signedIn: false,
      userId: null,
      pathVariables: {},
      patching: false,
      syncStack: {
        inserts: [],
        updates: {},
        deletions: [],
        propDeletions: [],
        debounceTimer: null,
      },
      fetched: {},
      stopPatchingTimeout: null
    }
  }
}

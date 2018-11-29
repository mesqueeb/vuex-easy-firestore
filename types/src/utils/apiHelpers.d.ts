import { IPluginState, AnyObject } from '../declarations';
/**
 * Grab until the api limit (500), put the rest back in the syncStack.
 *
 * @param {string} syncStackProp the prop of _sync.syncStack[syncStackProp]
 * @param {number} count the current count
 * @param {number} maxCount the max count of the batch
 * @param {object} state the store's state, will be edited!
 * @returns {any[]} the targets for the batch. Add this array length to the count
 */
export declare function grabUntilApiLimit(syncStackProp: string, count: number, maxCount: number, state: IPluginState): any[];
/**
 * Create a Firebase batch from a syncStack to be passed inside the state param.
 *
 * @export
 * @param {IPluginState} state The state which should have `_sync.syncStack`, `_sync.userId`, `state._conf.firestorePath`
 * @param {AnyObject} getters The getters which should have `dbRef`, `storeRef`, `collectionMode` and `firestorePathComplete`
 * @param {any} Firebase dependency injection for Firebase & Firestore
 * @param {number} [batchMaxCount=500] The max count of the batch. Defaults to 500 as per Firestore documentation.
 * @returns {*} A Firebase firestore batch object.
 */
export declare function makeBatchFromSyncstack(state: IPluginState, getters: AnyObject, Firebase: any, batchMaxCount?: number): any;
/**
 * Get the matches of path variables: eg. return ['groupId'] if pathPiece is '{groupId}'
 *
 * @export
 * @param {string} pathPiece eg. 'groups' or '{groupId}'
 * @returns {string[]} returns ['groupId'] in case of '{groupId}'
 */
export declare function getPathVarMatches(pathPiece: string): string[];
/**
 * Get the variable name of a piece of path: eg. return 'groupId' if pathPiece is '{groupId}'
 *
 * @export
 * @param {string} pathPiece eg. '{groupId}'
 * @returns {string} returns 'groupId' in case of '{groupId}'
 */
export declare function trimAccolades(pathPiece: string): string;
/**
 * Gets an object with {whereFilters, orderBy} filters and returns a unique identifier for that
 *
 * @export
 * @param {AnyObject} [whereOrderBy={}] whereOrderBy {whereFilters, orderBy}
 * @returns {string}
 */
export declare function createFetchIdentifier(whereOrderBy?: AnyObject): string;

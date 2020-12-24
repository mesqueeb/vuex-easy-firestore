import { IPluginState, AnyObject } from '../declarations';
/**
 * Grab until the api limit (500), put the rest back in the syncStack. State will get modified!
 *
 * @param {string} syncStackProp the prop of _sync.syncStack[syncStackProp]
 * @param {number} count the current count
 * @param {number} maxCount the max count of the batch
 * @param {object} state the store's state, will get modified!
 * @returns {any[]} the targets for the batch. Add this array length to the count
 */
export declare function grabUntilApiLimit(syncStackProp: string, count: number, maxCount: number, state: IPluginState): any[];
/**
 * Create a firebase batch from a syncStack to be passed inside the state param.
 *
 * @export
 * @param {IPluginState} state The state will get modified!
 * @param {AnyObject} getters The getters which should have `dbRef`, `storeRef`, `collectionMode` and `firestorePathComplete`
 * @param {any} firebaseBatch a firestore.batch() instance
 * @param {number} [batchMaxCount=500] The max count of the batch. Defaults to 500 as per Firestore documentation.
 * @returns {*} A firebase firestore batch object.
 */
export declare function makeBatchFromSyncstack(state: IPluginState, getters: AnyObject, firebaseBatch: any, batchMaxCount?: number): any;
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
 * Gets an object with {where, orderBy} clauses and returns a unique identifier for that
 *
 * @export
 * @param {AnyObject} [whereOrderBy={}] whereOrderBy {where, orderBy, pathVariables}
 * @returns {string}
 */
export declare function createFetchIdentifier(whereOrderBy?: AnyObject): string;

import { isObject, isFunction, isString, isDate, isAnyObject, isArray, isNumber } from 'is-what';
import { getDeepRef, getKeysFromPath } from 'vuex-easy-access';
import merge from 'merge-anything';
import findAndReplace from 'find-and-replace-anything';
import * as Firebase from 'firebase/app';

require('@firebase/firestore');

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require('@firebase/auth');

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var defaultConfig = {
    firestorePath: '',
    // The path to a collection or doc in firestore. You can use `{userId}` which will be replaced with the user Id.
    firestoreRefType: '',
    // `'collection'` or `'doc'`. Depending on your `firestorePath`.
    moduleName: '',
    // The module name. Can be nested, eg. `'user/items'`
    statePropName: '',
    // The name of the property where the docs or doc will be synced to. If left blank it will be synced on the state of the module.
    logging: false,
    // Related to the 2-way sync:
    sync: {
        where: [],
        orderBy: [],
        fillables: [],
        guard: [],
        // HOOKS for local changes:
        insertHook: function (updateStore, doc, store) { return updateStore(doc); },
        patchHook: function (updateStore, doc, store) { return updateStore(doc); },
        deleteHook: function (updateStore, id, store) { return updateStore(id); },
        // HOOKS for local batch changes:
        insertBatchHook: function (updateStore, docs, store) { return updateStore(docs); },
        patchBatchHook: function (updateStore, doc, ids, store) { return updateStore(doc, ids); },
        deleteBatchHook: function (updateStore, ids, store) { return updateStore(ids); },
    },
    // When items on the server side are changed:
    serverChange: {
        defaultValues: {},
        // HOOKS for changes on SERVER:
        addedHook: function (updateStore, doc, id, store, source, change) { return updateStore(doc); },
        modifiedHook: function (updateStore, doc, id, store, source, change) { return updateStore(doc); },
        removedHook: function (updateStore, doc, id, store, source, change) { return updateStore(doc); },
    },
    // When items are fetched through `dispatch('module/fetch', filters)`.
    fetch: {
        // The max amount of documents to be fetched. Defaults to 50.
        docLimit: 50,
    }
};

/**
 * a function returning the state object
 *
 * @export
 * @returns {IState} the state object
 */
function pluginState () {
    return {
        _sync: {
            signedIn: false,
            userId: null,
            unsubscribe: null,
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
    };
}

/**
 * execute Error() based on an error id string
 *
 * @export
 * @param {string} error the error id
 * @returns {string} the error id
 */
function error (error) {
    return error;
}

/**
 * a function returning the mutations object
 *
 * @export
 * @param {object} userState
 * @returns {AnyObject} the mutations object
 */
function pluginMutations (userState) {
    return {
        SET_PATHVARS: function (state, pathVars) {
            var self = this;
            Object.keys(pathVars).forEach(function (key) {
                var pathPiece = pathVars[key];
                self._vm.$set(state._sync.pathVariables, key, pathPiece);
                var path = state._conf.firestorePath.replace("{" + key + "}", "" + pathPiece);
                state._conf.firestorePath = path;
            });
        },
        RESET_VUEX_EASY_FIRESTORE_STATE: function (state) {
            var self = this;
            var _sync = merge(state._sync, {
                unsubscribe: null,
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
            });
            var newState = merge(userState, { _sync: _sync });
            if (state._conf.statePropName) {
                Object.keys(newState).forEach(function (key) {
                    self._vm.$set(state, key, newState[key]);
                });
                return self._vm.$set(state, state._conf.statePropName, {});
            }
            state = newState;
        },
        resetSyncStack: function (state) {
            state._sync.syncStack = {
                updates: {},
                deletions: [],
                inserts: [],
                debounceTimer: null
            };
        },
        INSERT_DOC: function (state, doc) {
            if (state._conf.firestoreRefType.toLowerCase() !== 'collection')
                return;
            if (state._conf.statePropName) {
                this._vm.$set(state[state._conf.statePropName], doc.id, doc);
            }
            else {
                this._vm.$set(state, doc.id, doc);
            }
        },
        PATCH_DOC: function (state, doc) {
            var _this = this;
            // Get the state prop ref
            var ref = (state._conf.statePropName)
                ? state[state._conf.statePropName]
                : state;
            if (state._conf.firestoreRefType.toLowerCase() === 'collection') {
                ref = ref[doc.id];
            }
            if (!ref)
                return error('patchNoRef');
            return Object.keys(doc).forEach(function (key) {
                // Merge if exists
                var newVal = (isObject(ref[key]) && isObject(doc[key]))
                    ? merge(ref[key], doc[key])
                    : doc[key];
                _this._vm.$set(ref, key, newVal);
            });
        },
        DELETE_DOC: function (state, id) {
            if (state._conf.firestoreRefType.toLowerCase() !== 'collection')
                return;
            if (state._conf.statePropName) {
                this._vm.$delete(state[state._conf.statePropName], id);
            }
            else {
                this._vm.$delete(state, id);
            }
        },
        DELETE_PROP: function (state, path) {
            var searchTarget = (state._conf.statePropName)
                ? state[state._conf.statePropName]
                : state;
            var propArr = path.split('.');
            var target = propArr.pop();
            if (!propArr.length) {
                return this._vm.$delete(searchTarget, target);
            }
            var ref = getDeepRef(searchTarget, propArr.join('.'));
            return this._vm.$delete(ref, target);
        }
    };
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/**
 * convert to new Date() if defaultValue == '%convertTimestamp%'
 *
 * @param {*} originVal
 * @param {*} targetVal
 * @returns {Date}
 */
function convertTimestamps(originVal, targetVal) {
    if (originVal === '%convertTimestamp%') {
        // firestore timestamps
        // @ts-ignore
        if (isAnyObject(targetVal) && !isObject(targetVal) && isFunction(targetVal.toDate)) {
            // @ts-ignore
            return targetVal.toDate();
        }
        // strings
        if (isString(targetVal) && isDate(new Date(targetVal))) {
            return new Date(targetVal);
        }
    }
    return targetVal;
}
/**
 * Merge an object onto defaultValues
 *
 * @export
 * @param {object} obj
 * @param {object} defaultValues
 * @returns {AnyObject} the new object
 */
function setDefaultValues (obj, defaultValues) {
    if (!isObject(defaultValues))
        console.error('[vuex-easy-firestore] Trying to merge target:', obj, 'onto a non-object (defaultValues):', defaultValues);
    if (!isObject(obj))
        console.error('[vuex-easy-firestore] Trying to merge a non-object:', obj, 'onto the defaultValues:', defaultValues);
    var result = merge({ extensions: [convertTimestamps] }, defaultValues, obj);
    return findAndReplace(result, '%convertTimestamp%', null, { onlyPlainObjects: true });
}

/**
 * Debounce helper
 *
 * let wait = startDebounce(1000)
 * wait.done.then(_ => handle())
 * wait.refresh() // to refresh
 *
 * @export
 * @param {number} ms
 * @returns {{done: any, refresh: () => {}}}
 * @author Adam Dorling
 * @contact https://codepen.io/naito
 */
function startDebounce (ms) {
    var startTime = Date.now();
    var done = new Promise(function (resolve, reject) {
        var interval = setInterval(function (_) {
            var now = Date.now();
            var deltaT = now - startTime;
            if (deltaT >= ms) {
                clearInterval(interval);
                resolve(true);
            }
        }, 10);
    });
    var refresh = function () { return (startTime = Date.now()); };
    return { done: done, refresh: refresh };
}

function retrievePaths(object, path, result) {
    if (!isObject(object) ||
        !Object.keys(object).length ||
        object.methodName === 'FieldValue.serverTimestamp') {
        if (!path)
            return object;
        result[path] = object;
        return result;
    }
    return Object.keys(object).reduce(function (carry, key) {
        var pathUntilNow = (path)
            ? path + '.'
            : '';
        var newPath = pathUntilNow + key;
        var extra = retrievePaths(object[key], newPath, result);
        return Object.assign(carry, extra);
    }, {});
}
/**
 * Flattens an object from {a: {b: {c: 'd'}}} to {'a.b.c': 'd'}
 *
 * @export
 * @param {object} object the object to flatten
 * @returns {AnyObject} the flattened object
 */
function flattenToPaths (object) {
    var result = {};
    return retrievePaths(object, null, result);
}

/**
 * Grab until the api limit (500), put the rest back in the syncStack.
 *
 * @param {string} syncStackProp the prop of _sync.syncStack[syncStackProp]
 * @param {number} count the current count
 * @param {number} maxCount the max count of the batch
 * @param {object} state the store's state, will be edited!
 * @returns {any[]} the targets for the batch. Add this array length to the count
 */
function grabUntilApiLimit(syncStackProp, count, maxCount, state) {
    var targets = state._sync.syncStack[syncStackProp];
    // Check if there are more than maxCount batch items already
    if (count >= maxCount) {
        // already at maxCount or more, leave items in syncstack, and don't add anything to batch
        targets = [];
    }
    else {
        // Convert to array if targets is an object (eg. updates)
        var targetIsObject = isObject(targets);
        if (targetIsObject) {
            targets = Object.values(targets);
        }
        // Batch supports only until maxCount items
        var grabCount = maxCount - count;
        var targetsOK = targets.slice(0, grabCount);
        var targetsLeft = targets.slice(grabCount);
        // Put back the remaining items over maxCount
        if (targetIsObject) {
            targetsLeft = Object.values(targetsLeft)
                .reduce(function (carry, update) {
                var id = update.id;
                carry[id] = update;
                return carry;
            }, {});
        }
        state._sync.syncStack[syncStackProp] = targetsLeft;
        // Define the items we'll add below
        targets = targetsOK;
    }
    return targets;
}
/**
 * Create a Firebase batch from a syncStack to be passed inside the state param.
 *
 * @export
 * @param {IPluginState} state The state which should have this prop: `_sync.syncStack[syncStackProp]`. syncStackProp can be 'updates', 'propDeletions', 'deletions', 'inserts'.
 * @param {AnyObject} dbRef The Firestore dbRef of the 'doc' or 'collection'
 * @param {boolean} collectionMode Very important: is the firebase dbRef a 'collection' or 'doc'?
 * @param {string} userId for `created_by` / `updated_by`
 * @param {any} Firebase dependency injection for Firebase & Firestore
 * @param {number} [batchMaxCount=500] The max count of the batch. Defaults to 500 as per Firestore documentation.
 * @returns {*} A Firebase firestore batch object.
 */
function makeBatchFromSyncstack(state, dbRef, collectionMode, userId, Firebase$$1, batchMaxCount) {
    if (batchMaxCount === void 0) { batchMaxCount = 500; }
    var batch = Firebase$$1.firestore().batch();
    var log = {};
    var count = 0;
    // Add 'updates' to batch
    var updates = grabUntilApiLimit('updates', count, batchMaxCount, state);
    log['updates: '] = updates;
    count = count + updates.length;
    // Add to batch
    updates.forEach(function (item) {
        var id = item.id;
        var docRef = (collectionMode) ? dbRef.doc(id) : dbRef;
        var itemToUpdate = flattenToPaths(item);
        itemToUpdate.updated_at = Firebase$$1.firestore.FieldValue.serverTimestamp();
        itemToUpdate.updated_by = userId;
        batch.update(docRef, itemToUpdate);
    });
    // Add 'propDeletions' to batch
    var propDeletions = grabUntilApiLimit('propDeletions', count, batchMaxCount, state);
    log['prop deletions: '] = propDeletions;
    count = count + propDeletions.length;
    // Add to batch
    propDeletions.forEach(function (path) {
        var docRef = dbRef;
        if (collectionMode) {
            var id = path.substring(0, path.indexOf('.'));
            path = path.substring(path.indexOf('.') + 1);
            docRef = dbRef.doc(id);
        }
        var updateObj = {};
        updateObj[path] = Firebase$$1.firestore.FieldValue.delete();
        updateObj.updated_at = Firebase$$1.firestore.FieldValue.serverTimestamp();
        updateObj.updated_by = userId;
        // @ts-ignore
        batch.update(docRef, updateObj);
    });
    // Add 'deletions' to batch
    var deletions = grabUntilApiLimit('deletions', count, batchMaxCount, state);
    log['deletions: '] = deletions;
    count = count + deletions.length;
    // Add to batch
    deletions.forEach(function (id) {
        var docRef = dbRef.doc(id);
        batch.delete(docRef);
    });
    // Add 'inserts' to batch
    var inserts = grabUntilApiLimit('inserts', count, batchMaxCount, state);
    log['inserts: '] = inserts;
    count = count + inserts.length;
    // Add to batch
    inserts.forEach(function (item) {
        item.created_at = Firebase$$1.firestore.FieldValue.serverTimestamp();
        item.created_by = userId;
        var newRef = dbRef.doc(item.id);
        batch.set(newRef, item);
    });
    // log the batch contents
    if (state._conf.logging) {
        console.group('[vuex-easy-firestore] api call batch:');
        console.log("%cFirestore PATH: " + state._conf.firestorePath, 'color: grey');
        Object.keys(log).forEach(function (key) {
            console.log(key, log[key]);
        });
        console.groupEnd();
    }
    return batch;
}
/**
 * Check if the string starts and ends with '{' and '}' to swap out for variable value saved in state.
 *
 * @export
 * @param {string} pathPiece eg. 'groups' or '{groupId}'
 * @returns {boolean}
 */
function isPathVar(pathPiece) {
    return (pathPiece[0] === '{' && pathPiece[pathPiece.length - 1] === '}');
}
/**
 * Get the variable name of a piece of path: eg. return 'groupId' if pathPiece is '{groupId}'
 *
 * @export
 * @param {string} pathPiece eg. 'groups' or '{groupId}'
 * @returns {string} returns 'groupId' in case of '{groupId}'
 */
function pathVarKey(pathPiece) {
    return (isPathVar(pathPiece))
        ? pathPiece.slice(1, -1)
        : pathPiece;
}

/**
 * gets an ID from a single piece of payload.
 *
 * @export
 * @param {(object | string)} payloadPiece
 * @param {object} [conf] (optional - for error handling) the vuex-easy-access config
 * @param {string} [path] (optional - for error handling) the path called
 * @param {(object | any[] | string)} [fullPayload] (optional - for error handling) the full payload on which each was `getId()` called
 * @returns {string} the id
 */
function getId(payloadPiece, conf, path, fullPayload) {
    if (isObject(payloadPiece)) {
        if (isObject(payloadPiece) && payloadPiece.id)
            return payloadPiece.id;
        if (Object.keys(payloadPiece).length === 1)
            return Object.keys(payloadPiece)[0];
    }
    if (isString(payloadPiece))
        return payloadPiece;
    return '';
}
/**
 * Returns a value of a payload piece. Eg. {[id]: 'val'} will return 'val'
 *
 * @param {*} payloadPiece
 * @returns {*} the value
 */
function getValueFromPayloadPiece(payloadPiece) {
    if (isObject(payloadPiece) &&
        !payloadPiece.id &&
        Object.keys(payloadPiece).length === 1) {
        return Object.values(payloadPiece)[0];
    }
    return payloadPiece;
}

/**
 * A function returning the actions object
 *
 * @export
 * @param {*} Firebase The Firebase dependency
 * @returns {AnyObject} the actions object
 */
function pluginActions (Firebase$$1) {
    return {
        duplicate: function (_a, id) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            if (!getters.collectionMode)
                return;
            var doc = merge(getters.storeRef[id], { id: null });
            return dispatch('insert', doc);
        },
        patchDoc: function (_a, _b) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            var _c = _b === void 0 ? { ids: [], doc: {} } : _b, _d = _c.id, id = _d === void 0 ? '' : _d, _e = _c.ids, ids = _e === void 0 ? [] : _e, doc = _c.doc;
            // 0. payload correction (only arrays)
            if (!isArray(ids))
                return console.error('[vuex-easy-firestore] ids needs to be an array');
            if (id)
                ids.push(id);
            if (doc.id)
                delete doc.id;
            // 1. Prepare for patching
            var syncStackItems = getters.prepareForPatch(ids, doc);
            // 2. Push to syncStack
            Object.keys(syncStackItems).forEach(function (id) {
                var newVal = (!state._sync.syncStack.updates[id])
                    ? syncStackItems[id]
                    : merge(state._sync.syncStack.updates[id], syncStackItems[id]);
                state._sync.syncStack.updates[id] = newVal;
            });
            // 3. Create or refresh debounce
            return dispatch('handleSyncStackDebounce');
        },
        deleteDoc: function (_a, ids) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            if (ids === void 0) { ids = []; }
            // 0. payload correction (only arrays)
            if (!isArray(ids))
                ids = [ids];
            // 1. Prepare for patching
            // 2. Push to syncStack
            var deletions = state._sync.syncStack.deletions.concat(ids);
            state._sync.syncStack.deletions = deletions;
            if (!state._sync.syncStack.deletions.length)
                return;
            // 3. Create or refresh debounce
            return dispatch('handleSyncStackDebounce');
        },
        deleteProp: function (_a, path) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            // 1. Prepare for patching
            // 2. Push to syncStack
            state._sync.syncStack.propDeletions.push(path);
            if (!state._sync.syncStack.propDeletions.length)
                return;
            // 3. Create or refresh debounce
            return dispatch('handleSyncStackDebounce');
        },
        insertDoc: function (_a, docs) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            if (docs === void 0) { docs = []; }
            // 0. payload correction (only arrays)
            if (!isArray(docs))
                docs = [docs];
            // 1. Prepare for patching
            var syncStack = getters.prepareForInsert(docs);
            // 2. Push to syncStack
            var inserts = state._sync.syncStack.inserts.concat(syncStack);
            state._sync.syncStack.inserts = inserts;
            // 3. Create or refresh debounce
            dispatch('handleSyncStackDebounce');
            return docs.map(function (d) { return d.id; });
        },
        insertInitialDoc: function (_a) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            // 0. only docMode
            if (getters.collectionMode)
                return;
            // 1. Prepare for insert
            var initialDoc = (getters.storeRef) ? getters.storeRef : {};
            var doc = getters.prepareInitialDocForInsert(initialDoc);
            // 2. insert
            return getters.dbRef.set(doc);
        },
        handleSyncStackDebounce: function (_a) {
            var state = _a.state, commit = _a.commit, dispatch = _a.dispatch, getters = _a.getters;
            if (!getters.signedIn)
                return false;
            if (!state._sync.syncStack.debounceTimer) {
                var debounceTimer = startDebounce(1000);
                debounceTimer.done.then(function (_) { return dispatch('batchSync'); });
                state._sync.syncStack.debounceTimer = debounceTimer;
            }
            state._sync.syncStack.debounceTimer.refresh();
        },
        batchSync: function (_a) {
            var getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch, state = _a.state;
            var collectionMode = getters.collectionMode;
            var dbRef = getters.dbRef;
            var userId = state._sync.userId;
            var batch = makeBatchFromSyncstack(state, dbRef, collectionMode, userId, Firebase$$1);
            dispatch('_startPatching');
            state._sync.syncStack.debounceTimer = null;
            return new Promise(function (resolve, reject) {
                batch.commit().then(function (res) {
                    var remainingSyncStack = Object.keys(state._sync.syncStack.updates).length +
                        state._sync.syncStack.deletions.length +
                        state._sync.syncStack.inserts.length +
                        state._sync.syncStack.propDeletions.length;
                    if (remainingSyncStack) {
                        dispatch('batchSync');
                    }
                    dispatch('_stopPatching');
                    return resolve();
                }).catch(function (error$$1) {
                    state._sync.patching = 'error';
                    state._sync.syncStack.debounceTimer = null;
                    console.error('Error during synchronisation ↓');
                    return reject(error$$1);
                });
            });
        },
        fetch: function (_a, _b
        // whereFilters: [['archived', '==', true]]
        // orderBy: ['done_date', 'desc']
        ) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            var _c = _b === void 0 ? { whereFilters: [], orderBy: [] } : _b
            // whereFilters: [['archived', '==', true]]
            // orderBy: ['done_date', 'desc']
            , _d = _c.whereFilters, whereFilters = _d === void 0 ? [] : _d, _e = _c.orderBy, orderBy = _e === void 0 ? [] : _e;
            return new Promise(function (resolve, reject) {
                if (state._conf.logging)
                    console.log('[vuex-easy-firestore] Fetch starting');
                if (!getters.signedIn)
                    return resolve();
                var identifier = JSON.stringify({ whereFilters: whereFilters, orderBy: orderBy });
                var fetched = state._sync.fetched[identifier];
                // We've never fetched this before:
                if (!fetched) {
                    var ref_1 = getters.dbRef;
                    // apply where filters and orderBy
                    whereFilters.forEach(function (paramsArr) {
                        ref_1 = ref_1.where.apply(ref_1, paramsArr);
                    });
                    if (orderBy.length) {
                        ref_1 = ref_1.orderBy.apply(ref_1, orderBy);
                    }
                    state._sync.fetched[identifier] = {
                        ref: ref_1,
                        done: false,
                        retrievedFetchRefs: [],
                        nextFetchRef: null
                    };
                }
                var fRequest = state._sync.fetched[identifier];
                // We're already done fetching everything:
                if (fRequest.done) {
                    if (state._conf.logging)
                        console.log('[vuex-easy-firestore] done fetching');
                    return resolve({ done: true });
                }
                // attach fetch filters
                var fRef = state._sync.fetched[identifier].ref;
                if (fRequest.nextFetchRef) {
                    // get next ref if saved in state
                    fRef = state._sync.fetched[identifier].nextFetchRef;
                }
                fRef = fRef.limit(state._conf.fetch.docLimit);
                // Stop if all records already fetched
                if (fRequest.retrievedFetchRefs.includes(fRef)) {
                    console.error('[vuex-easy-firestore] Already retrieved this part.');
                    return resolve();
                }
                // make fetch request
                fRef.get().then(function (querySnapshot) {
                    var docs = querySnapshot.docs;
                    if (docs.length === 0) {
                        state._sync.fetched[identifier].done = true;
                        querySnapshot.done = true;
                        return resolve(querySnapshot);
                    }
                    if (docs.length < state._conf.fetch.docLimit) {
                        state._sync.fetched[identifier].done = true;
                    }
                    state._sync.fetched[identifier].retrievedFetchRefs.push(fRef);
                    // Get the last visible document
                    resolve(querySnapshot);
                    var lastVisible = docs[docs.length - 1];
                    // get the next records.
                    var next = fRef.startAfter(lastVisible);
                    state._sync.fetched[identifier].nextFetchRef = next;
                }).catch(function (error$$1) {
                    console.error('[vuex-easy-firestore]', error$$1);
                    return reject(error$$1);
                });
            });
        },
        fetchAndAdd: function (_a, _b
        // whereFilters: [['archived', '==', true]]
        // orderBy: ['done_date', 'desc']
        ) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            var _c = _b === void 0 ? { whereFilters: [], orderBy: [] } : _b
            // whereFilters: [['archived', '==', true]]
            // orderBy: ['done_date', 'desc']
            , _d = _c.whereFilters, whereFilters = _d === void 0 ? [] : _d, _e = _c.orderBy, orderBy = _e === void 0 ? [] : _e;
            return dispatch('fetch', { whereFilters: whereFilters, orderBy: orderBy })
                .then(function (querySnapshot) {
                if (querySnapshot.done === true)
                    return querySnapshot;
                if (isFunction(querySnapshot.forEach)) {
                    querySnapshot.forEach(function (_doc) {
                        var id = _doc.id;
                        var doc = setDefaultValues(_doc.data(), state._conf.serverChange.defaultValues);
                        doc.id = id;
                        commit('INSERT_DOC', doc);
                    });
                }
            });
        },
        serverUpdate: function (_a, _b) {
            var commit = _a.commit;
            var change = _b.change, id = _b.id, _c = _b.doc, doc = _c === void 0 ? {} : _c;
            doc.id = id;
            switch (change) {
                case 'added':
                    commit('INSERT_DOC', doc);
                    break;
                case 'removed':
                    commit('DELETE_DOC', id);
                    break;
                default:
                    commit('PATCH_DOC', doc);
                    break;
            }
        },
        openDBChannel: function (_a, pathVariables) {
            var getters = _a.getters, state = _a.state, commit = _a.commit, dispatch = _a.dispatch;
            var store = this;
            // set state for pathVariables
            if (pathVariables && isObject(pathVariables))
                commit('SET_PATHVARS', pathVariables);
            // get userId
            var userId = null;
            if (Firebase$$1.auth().currentUser) {
                state._sync.signedIn = true;
                userId = Firebase$$1.auth().currentUser.uid;
                state._sync.userId = userId;
            }
            // getters.dbRef should already have pathVariables swapped out
            var dbRef = getters.dbRef;
            // apply where filters and orderBy
            if (getters.collectionMode) {
                state._conf.sync.where.forEach(function (paramsArr) {
                    paramsArr.forEach(function (param, paramIndex) {
                        if (isPathVar(param)) {
                            var _pathVarKey = pathVarKey(param);
                            if (_pathVarKey === 'userId') {
                                paramsArr[paramIndex] = userId;
                                return;
                            }
                            if (!Object.keys(state._sync.pathVariables).includes(_pathVarKey)) {
                                return error('missingPathVarKey');
                            }
                            var varVal = state._sync.pathVariables[_pathVarKey];
                            paramsArr[paramIndex] = varVal;
                        }
                    });
                    dbRef = dbRef.where.apply(dbRef, paramsArr);
                });
                if (state._conf.sync.orderBy.length) {
                    dbRef = dbRef.orderBy.apply(dbRef, state._conf.sync.orderBy);
                }
            }
            // define handleDoc()
            function handleDoc(_changeType, id, doc, source) {
                if (_changeType === void 0) { _changeType = 'modified'; }
                // define storeUpdateFn()
                function storeUpdateFn(_doc) {
                    return dispatch('serverUpdate', { change: _changeType, id: id, doc: _doc });
                }
                // get user set sync hook function
                var syncHookFn = state._conf.serverChange[_changeType + 'Hook'];
                if (syncHookFn) {
                    syncHookFn(storeUpdateFn, doc, id, store, source, _changeType);
                }
                else {
                    storeUpdateFn(doc);
                }
            }
            // make a promise
            return new Promise(function (resolve, reject) {
                var unsubscribe = dbRef.onSnapshot(function (querySnapshot) {
                    var source = querySnapshot.metadata.hasPendingWrites ? 'local' : 'server';
                    if (!getters.collectionMode) {
                        if (!querySnapshot.data()) {
                            // No initial doc found in docMode
                            if (state._conf.logging)
                                console.log('[vuex-easy-firestore] inserting initial doc');
                            dispatch('insertInitialDoc');
                            return resolve();
                        }
                        var doc = setDefaultValues(querySnapshot.data(), state._conf.serverChange.defaultValues);
                        var id = state._conf.firestorePath.split('/').pop();
                        doc.id = id;
                        if (source === 'local')
                            return resolve();
                        handleDoc(null, id, doc, source);
                        return resolve();
                    }
                    querySnapshot.docChanges().forEach(function (change) {
                        var changeType = change.type;
                        // Don't do anything for local modifications & removals
                        if (source === 'local' &&
                            (changeType === 'modified' || changeType === 'removed')) {
                            return resolve();
                        }
                        var id = change.doc.id;
                        var doc = (changeType === 'added')
                            ? setDefaultValues(change.doc.data(), state._conf.serverChange.defaultValues)
                            : change.doc.data();
                        handleDoc(changeType, id, doc, source);
                    });
                    return resolve();
                }, function (error$$1) {
                    state._sync.patching = 'error';
                    return reject(error$$1);
                });
                state._sync.unsubscribe = unsubscribe;
            });
        },
        closeDBChannel: function (_a, _b) {
            var getters = _a.getters, state = _a.state, commit = _a.commit, dispatch = _a.dispatch;
            var _c = (_b === void 0 ? { clearModule: false } : _b).clearModule, clearModule = _c === void 0 ? false : _c;
            if (clearModule) {
                commit('RESET_VUEX_EASY_FIRESTORE_STATE');
            }
            if (isFunction(state._sync.unsubscribe))
                return state._sync.unsubscribe();
        },
        set: function (_a, doc) {
            var commit = _a.commit, dispatch = _a.dispatch, getters = _a.getters, state = _a.state;
            if (!doc)
                return;
            if (!getters.collectionMode) {
                return dispatch('patch', doc);
            }
            var id = getId(doc);
            if (!id ||
                (!state._conf.statePropName && !state[id]) ||
                (state._conf.statePropName && !state[state._conf.statePropName][id])) {
                return dispatch('insert', doc);
            }
            return dispatch('patch', doc);
        },
        insert: function (_a, doc) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            var store = this;
            if (!getters.signedIn)
                return 'auth/invalid-user-token';
            if (!doc)
                return;
            var newDoc = getValueFromPayloadPiece(doc);
            if (!newDoc.id)
                newDoc.id = getters.dbRef.doc().id;
            // define the store update
            function storeUpdateFn(_doc) {
                commit('INSERT_DOC', _doc);
                return dispatch('insertDoc', _doc);
            }
            // check for hooks
            if (state._conf.sync.insertHook) {
                return state._conf.sync.insertHook(storeUpdateFn, newDoc, store);
            }
            return storeUpdateFn(newDoc);
        },
        insertBatch: function (_a, docs) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            var store = this;
            if (!getters.signedIn)
                return 'auth/invalid-user-token';
            if (!isArray(docs) || !docs.length)
                return;
            var newDocs = docs.reduce(function (carry, _doc) {
                var newDoc = getValueFromPayloadPiece(_doc);
                if (!newDoc.id)
                    newDoc.id = getters.dbRef.doc().id;
                carry.push(newDoc);
                return carry;
            }, []);
            // define the store update
            function storeUpdateFn(_docs) {
                _docs.forEach(function (_doc) {
                    commit('INSERT_DOC', _doc);
                });
                return dispatch('insertDoc', _docs);
            }
            // check for hooks
            if (state._conf.sync.insertBatchHook) {
                return state._conf.sync.insertBatchHook(storeUpdateFn, newDocs, store);
            }
            return storeUpdateFn(newDocs);
        },
        patch: function (_a, doc) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            var store = this;
            if (!doc)
                return;
            var id = (getters.collectionMode) ? getId(doc) : undefined;
            var value = (getters.collectionMode) ? getValueFromPayloadPiece(doc) : doc;
            if (!id && getters.collectionMode)
                return;
            // add id to value
            if (!value.id)
                value.id = id;
            // define the store update
            function storeUpdateFn(_val) {
                commit('PATCH_DOC', _val);
                return dispatch('patchDoc', { id: id, doc: _val });
            }
            // check for hooks
            if (state._conf.sync.patchHook) {
                return state._conf.sync.patchHook(storeUpdateFn, value, store);
            }
            return storeUpdateFn(value);
        },
        patchBatch: function (_a, _b) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            var doc = _b.doc, _c = _b.ids, ids = _c === void 0 ? [] : _c;
            var store = this;
            if (!doc)
                return;
            // define the store update
            function storeUpdateFn(_doc, _ids) {
                _ids.forEach(function (_id) {
                    commit('PATCH_DOC', __assign({ id: _id }, _doc));
                });
                return dispatch('patchDoc', { ids: _ids, doc: _doc });
            }
            // check for hooks
            if (state._conf.sync.patchBatchHook) {
                return state._conf.sync.patchBatchHook(storeUpdateFn, doc, ids, store);
            }
            return storeUpdateFn(doc, ids);
        },
        delete: function (_a, id) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            if (!id)
                return;
            var store = this;
            function storeUpdateFn(_id) {
                // id is a path
                var pathDelete = (_id.includes('.') || !getters.collectionMode);
                if (pathDelete) {
                    var path = _id;
                    if (!path)
                        return error('actionsDeleteMissingPath');
                    commit('DELETE_PROP', path);
                    return dispatch('deleteProp', path);
                }
                if (!_id)
                    return error('actionsDeleteMissingId');
                commit('DELETE_DOC', _id);
                return dispatch('deleteDoc', _id);
            }
            // check for hooks
            if (state._conf.sync.deleteHook) {
                return state._conf.sync.deleteHook(storeUpdateFn, id, store);
            }
            return storeUpdateFn(id);
        },
        deleteBatch: function (_a, ids) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            if (!isArray(ids))
                return;
            if (!ids.length)
                return;
            var store = this;
            // define the store update
            function storeUpdateFn(_ids) {
                _ids.forEach(function (_id) {
                    // id is a path
                    var pathDelete = (_id.includes('.') || !getters.collectionMode);
                    if (pathDelete) {
                        var path = _id;
                        if (!path)
                            return error('actionsDeleteMissingPath');
                        commit('DELETE_PROP', path);
                        return dispatch('deleteProp', path);
                    }
                    if (!_id)
                        return error('actionsDeleteMissingId');
                    commit('DELETE_DOC', _id);
                    return dispatch('deleteDoc', _id);
                });
            }
            // check for hooks
            if (state._conf.sync.deleteBatchHook) {
                return state._conf.sync.deleteBatchHook(storeUpdateFn, ids, store);
            }
            return storeUpdateFn(ids);
        },
        _stopPatching: function (_a) {
            var state = _a.state, commit = _a.commit;
            if (state._sync.stopPatchingTimeout) {
                clearTimeout(state._sync.stopPatchingTimeout);
            }
            state._sync.stopPatchingTimeout = setTimeout(function (_) { state._sync.patching = false; }, 300);
        },
        _startPatching: function (_a) {
            var state = _a.state, commit = _a.commit;
            if (state._sync.stopPatchingTimeout) {
                clearTimeout(state._sync.stopPatchingTimeout);
            }
            state._sync.patching = true;
        }
    };
}

/**
 * Checks all props of an object and deletes guarded and non-fillables.
 *
 * @export
 * @param {object} obj the target object to check
 * @param {string[]} [fillables=[]] an array of strings, with the props which should be allowed on returned object
 * @param {string[]} [guard=[]] an array of strings, with the props which should NOT be allowed on returned object
 * @returns {AnyObject} the cleaned object after deleting guard and non-fillables
 */
function checkFillables (obj, fillables, guard) {
    if (fillables === void 0) { fillables = []; }
    if (guard === void 0) { guard = []; }
    if (!isObject(obj))
        return obj;
    return Object.keys(obj).reduce(function (carry, key) {
        // check fillables
        if (fillables.length && !fillables.includes(key)) {
            return carry;
        }
        // check guard
        guard.push('_conf');
        guard.push('_sync');
        if (guard.includes(key)) {
            return carry;
        }
        carry[key] = obj[key];
        return carry;
    }, {});
}

/**
 * A function returning the getters object
 *
 * @export
 * @param {*} Firebase The Firebase dependency
 * @returns {AnyObject} the getters object
 */
function pluginGetters (Firebase$$1) {
    return {
        signedIn: function (state, getters, rootState, rootGetters) {
            var requireUser = state._conf.firestorePath.includes('{userId}');
            if (!requireUser)
                return true;
            return state._sync.signedIn;
        },
        dbRef: function (state, getters, rootState, rootGetters) {
            var path;
            // check for userId replacement
            var requireUser = state._conf.firestorePath.includes('{userId}');
            if (requireUser) {
                if (!getters.signedIn)
                    return false;
                if (!Firebase$$1.auth().currentUser)
                    return false;
                var userId = Firebase$$1.auth().currentUser.uid;
                path = state._conf.firestorePath.replace('{userId}', userId);
            }
            else {
                path = state._conf.firestorePath;
            }
            return (getters.collectionMode)
                ? Firebase$$1.firestore().collection(path)
                : Firebase$$1.firestore().doc(path);
        },
        storeRef: function (state, getters, rootState) {
            var path = (state._conf.statePropName)
                ? state._conf.moduleName + "/" + state._conf.statePropName
                : state._conf.moduleName;
            return getDeepRef(rootState, path);
        },
        collectionMode: function (state, getters, rootState) {
            return (state._conf.firestoreRefType.toLowerCase() === 'collection');
        },
        prepareForPatch: function (state, getters, rootState, rootGetters) {
            return function (ids, doc) {
                if (ids === void 0) { ids = []; }
                if (doc === void 0) { doc = {}; }
                // get relevant data from the storeRef
                var collectionMode = getters.collectionMode;
                if (!collectionMode)
                    ids.push('singleDoc');
                // returns {object} -> {id: data}
                return ids.reduce(function (carry, id) {
                    var patchData = {};
                    // retrieve full object
                    if (!Object.keys(doc).length) {
                        patchData = (collectionMode)
                            ? getters.storeRef[id]
                            : getters.storeRef;
                    }
                    else {
                        patchData = doc;
                    }
                    var cleanedPatchData = checkFillables(patchData, state._conf.sync.fillables, state._conf.sync.guard);
                    cleanedPatchData.id = id;
                    carry[id] = cleanedPatchData;
                    return carry;
                }, {});
            };
        },
        prepareForInsert: function (state, getters, rootState, rootGetters) {
            return function (items) {
                if (items === void 0) { items = []; }
                return items.reduce(function (carry, item) {
                    item = checkFillables(item, state._conf.sync.fillables, state._conf.sync.guard);
                    carry.push(item);
                    return carry;
                }, []);
            };
        },
        prepareInitialDocForInsert: function (state, getters, rootState, rootGetters) {
            return function (doc) {
                doc = checkFillables(doc, state._conf.sync.fillables, state._conf.sync.guard);
                return doc;
            };
        }
    };
}

/**
 * Check the config for type errors for non-TypeScript users
 *
 * @export
 * @param {IEasyFirestoreModule} config
 * @returns {boolean} true if no errors, false if errors
 */
function errorCheck (config) {
    var errors = [];
    var reqProps = ['firestorePath', 'moduleName'];
    reqProps.forEach(function (prop) {
        if (!config[prop]) {
            errors.push("Missing `" + prop + "` in your module!");
        }
    });
    if (/(\.|\/)/.test(config.statePropName)) {
        errors.push("statePropName must only include letters from [a-z]");
    }
    if (/\./.test(config.moduleName)) {
        errors.push("moduleName must only include letters from [a-z] and forward slashes '/'");
    }
    var syncProps = ['where', 'orderBy', 'fillables', 'guard', 'insertHook', 'patchHook', 'deleteHook', 'insertBatchHook', 'patchBatchHook', 'deleteBatchHook'];
    syncProps.forEach(function (prop) {
        if (config[prop]) {
            errors.push("We found `" + prop + "` on your module, are you sure this shouldn't be inside a prop called `sync`?");
        }
    });
    var serverChangeProps = ['modifiedHook', 'defaultValues', 'addedHook', 'removedHook'];
    serverChangeProps.forEach(function (prop) {
        if (config[prop]) {
            errors.push("We found `" + prop + "` on your module, are you sure this shouldn't be inside a prop called `serverChange`?");
        }
    });
    var fetchProps = ['docLimit'];
    fetchProps.forEach(function (prop) {
        if (config[prop]) {
            errors.push("We found `" + prop + "` on your module, are you sure this shouldn't be inside a prop called `fetch`?");
        }
    });
    var numberProps = ['docLimit'];
    numberProps.forEach(function (prop) {
        var _prop = config.fetch[prop];
        if (!isNumber(_prop))
            errors.push("`" + prop + "` should be a Number, but is not.");
    });
    var functionProps = ['insertHook', 'patchHook', 'deleteHook', 'insertBatchHook', 'patchBatchHook', 'deleteBatchHook', 'addedHook', 'modifiedHook', 'removedHook'];
    functionProps.forEach(function (prop) {
        var _prop = (syncProps.includes(prop))
            ? config.sync[prop]
            : config.serverChange[prop];
        if (!isFunction(_prop))
            errors.push("`" + prop + "` should be a Function, but is not.");
    });
    var objectProps = ['sync', 'serverChange', 'defaultValues', 'fetch'];
    objectProps.forEach(function (prop) {
        var _prop = (prop === 'defaultValues')
            ? config.serverChange[prop]
            : config[prop];
        if (!isObject(_prop))
            errors.push("`" + prop + "` should be an Object, but is not.");
    });
    var stringProps = ['firestorePath', 'firestoreRefType', 'moduleName', 'statePropName'];
    stringProps.forEach(function (prop) {
        var _prop = config[prop];
        if (!isString(_prop))
            errors.push("`" + prop + "` should be a String, but is not.");
    });
    var arrayProps = ['where', 'orderBy', 'fillables', 'guard'];
    arrayProps.forEach(function (prop) {
        var _prop = config.sync[prop];
        if (!isArray(_prop))
            errors.push("`" + prop + "` should be an Array, but is not.");
    });
    if (errors.length) {
        console.group('[vuex-easy-firestore] ERRORS:');
        console.error("Module: " + config.moduleName);
        errors.forEach(function (e) { return console.error(' - ', e); });
        console.groupEnd();
        return false;
    }
    return true;
}

/**
 * A function that returns a vuex module object with seamless 2-way sync for firestore.
 *
 * @param {IEasyFirestoreModule} userConfig Takes a config object per module
 * @param {*} FirebaseDependency The Firebase dependency (non-instanciated), defaults to the Firebase peer dependency if left blank.
 * @returns {IStore} the module ready to be included in your vuex store
 */
function iniModule (userConfig, FirebaseDependency) {
    var conf = merge({ state: {}, mutations: {}, actions: {}, getters: {} }, defaultConfig, userConfig);
    if (!errorCheck(conf))
        return;
    var userState = conf.state;
    var userMutations = conf.mutations;
    var userActions = conf.actions;
    var userGetters = conf.getters;
    delete conf.state;
    delete conf.mutations;
    delete conf.actions;
    delete conf.getters;
    var docContainer = {};
    if (conf.statePropName)
        docContainer[conf.statePropName] = {};
    return {
        namespaced: true,
        state: merge(pluginState(), userState, docContainer, { _conf: conf }),
        mutations: merge(userMutations, pluginMutations(merge(userState, { _conf: conf }))),
        actions: merge(userActions, pluginActions(FirebaseDependency)),
        getters: merge(userGetters, pluginGetters(FirebaseDependency))
    };
}

// Firebase
/**
 * Create vuex-easy-firestore modules. Add as single plugin to Vuex Store.
 *
 * @export
 * @param {(IEasyFirestoreModule | IEasyFirestoreModule[])} easyFirestoreModule A vuex-easy-firestore module (or array of modules) with proper configuration as per the documentation.
 * @param {{logging?: boolean, FirebaseDependency?: any}} extraConfig An object with `logging` and `FirebaseDependency` props. `logging` enables console logs for debugging. `FirebaseDependency` is the non-instanciated Firebase class you can pass. (defaults to the Firebase peer dependency)
 * @returns {*}
 */
function index (easyFirestoreModule, _a) {
    var _b = _a === void 0 ? {
        logging: false,
        FirebaseDependency: Firebase
    } : _a, _c = _b.logging, logging = _c === void 0 ? false : _c, _d = _b.FirebaseDependency, FirebaseDependency = _d === void 0 ? Firebase : _d;
    return function (store) {
        // Get an array of config files
        if (!isArray(easyFirestoreModule))
            easyFirestoreModule = [easyFirestoreModule];
        // Create a module for each config file
        easyFirestoreModule.forEach(function (config) {
            config.logging = logging;
            var moduleName = getKeysFromPath(config.moduleName);
            store.registerModule(moduleName, iniModule(config, FirebaseDependency));
        });
    };
}

export default index;

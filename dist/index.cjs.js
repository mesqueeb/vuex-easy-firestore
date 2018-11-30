'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isWhat = require('is-what');
var Firebase = require('firebase');
var vuexEasyAccess = require('vuex-easy-access');
var merge = _interopDefault(require('merge-anything'));
var findAndReplaceAnything = require('find-and-replace-anything');
var Firebase$1 = require('firebase/app');

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
                propDeletions: {},
                deletions: [],
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

var ArrayUnion = /** @class */ (function () {
    function ArrayUnion(payload) {
        this.name = 'ArrayUnion';
        this.payload = payload;
    }
    ArrayUnion.prototype.executeOn = function (array) {
        if (!array.includes(this.payload)) {
            array.push(this.payload);
        }
        return array;
    };
    ArrayUnion.prototype.getFirestoreFieldValue = function () {
        return Firebase.firestore.FieldValue.arrayUnion(this.payload);
    };
    return ArrayUnion;
}());
var ArrayRemove = /** @class */ (function () {
    function ArrayRemove(payload) {
        this.name = 'ArrayRemove';
        this.payload = payload;
    }
    ArrayRemove.prototype.executeOn = function (array) {
        var index = array.indexOf(this.payload);
        if (index > -1) {
            array.splice(index, 1);
        }
        return array;
    };
    ArrayRemove.prototype.getFirestoreFieldValue = function () {
        return Firebase.firestore.FieldValue.arrayRemove(this.payload);
    };
    return ArrayRemove;
}());
function arrayUnion(payload) {
    return new ArrayUnion(payload);
}
function arrayRemove(payload) {
    return new ArrayRemove(payload);
}
function isArrayHelper(value) {
    // this is bugged in vuex actions, I DONT KNOW WHY
    // return (
    //   value instanceof ArrayUnion ||
    //   value instanceof ArrayRemove
    // )
    return (isWhat.isAnyObject(value) &&
        !isWhat.isPlainObject(value) &&
        // @ts-ignore
        (value.constructor.name === 'ArrayUnion' || value.constructor.name === 'ArrayRemove'));
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
            });
        },
        SET_SYNCFILTERS: function (state, _a) {
            var where = _a.where, orderBy = _a.orderBy;
            if (where && isWhat.isArray(where))
                state._conf.sync.where = where;
            if (orderBy && isWhat.isArray(orderBy))
                state._conf.sync.orderBy = orderBy;
        },
        RESET_VUEX_EASY_FIRESTORE_STATE: function (state) {
            var self = this;
            var _sync = merge(state._sync, {
                // make null once to be able to overwrite with empty object
                pathVariables: null,
                syncStack: { updates: null, propDeletions: null },
                fetched: null,
            }, {
                unsubscribe: null,
                pathVariables: {},
                patching: false,
                syncStack: {
                    inserts: [],
                    updates: {},
                    propDeletions: {},
                    deletions: [],
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
            Object.keys(state).forEach(function (key) {
                if (Object.keys(newState).includes(key)) {
                    self._vm.$set(state, key, newState[key]);
                    return;
                }
                self._vm.$delete(state, key);
            });
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
        PATCH_DOC: function (state, patches) {
            var _this = this;
            // Get the state prop ref
            var ref = (state._conf.statePropName)
                ? state[state._conf.statePropName]
                : state;
            if (state._conf.firestoreRefType.toLowerCase() === 'collection') {
                ref = ref[patches.id];
            }
            if (!ref)
                return error('patchNoRef');
            return Object.keys(patches).forEach(function (key) {
                var newVal = patches[key];
                // Array unions and deletions
                if (isWhat.isArray(ref[key]) && isArrayHelper(patches[key])) {
                    newVal = patches[key].executeOn(ref[key]);
                }
                // Merge if exists
                function arrayHelpers(originVal, newVal) {
                    if (isWhat.isArray(originVal) && isArrayHelper(newVal)) {
                        newVal = newVal.executeOn(originVal);
                    }
                    return newVal; // always return newVal as fallback!!
                }
                if (isWhat.isPlainObject(ref[key]) && isWhat.isPlainObject(patches[key])) {
                    newVal = merge({ extensions: [arrayHelpers] }, ref[key], patches[key]);
                }
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
            var ref = vuexEasyAccess.getDeepRef(searchTarget, propArr.join('.'));
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

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

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
        if (isWhat.isAnyObject(targetVal) && !isWhat.isPlainObject(targetVal) && isWhat.isFunction(targetVal.toDate)) {
            // @ts-ignore
            return targetVal.toDate();
        }
        // strings
        if (isWhat.isString(targetVal) && isWhat.isDate(new Date(targetVal))) {
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
    if (!isWhat.isPlainObject(defaultValues))
        console.error('[vuex-easy-firestore] Trying to merge target:', obj, 'onto a non-object (defaultValues):', defaultValues);
    if (!isWhat.isPlainObject(obj))
        console.error('[vuex-easy-firestore] Trying to merge a non-object:', obj, 'onto the defaultValues:', defaultValues);
    var result = merge({ extensions: [convertTimestamps] }, defaultValues, obj);
    return findAndReplaceAnything.findAndReplace(result, '%convertTimestamp%', null, { onlyPlainObjects: true });
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
        var targetIsObject = isWhat.isPlainObject(targets);
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
 * @param {IPluginState} state The state which should have `_sync.syncStack`, `_sync.userId`, `state._conf.firestorePath`
 * @param {AnyObject} getters The getters which should have `dbRef`, `storeRef`, `collectionMode` and `firestorePathComplete`
 * @param {any} Firebase dependency injection for Firebase & Firestore
 * @param {number} [batchMaxCount=500] The max count of the batch. Defaults to 500 as per Firestore documentation.
 * @returns {*} A Firebase firestore batch object.
 */
function makeBatchFromSyncstack(state, getters, Firebase$$1, batchMaxCount) {
    if (batchMaxCount === void 0) { batchMaxCount = 500; }
    // get state & getter variables
    var firestorePath = state._conf.firestorePath;
    var firestorePathComplete = getters.firestorePathComplete;
    var dbRef = getters.dbRef;
    var collectionMode = getters.collectionMode;
    // make batch
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
        if (state._conf.sync.guard.includes('id'))
            delete item.id;
        // @ts-ignore
        batch.update(docRef, item);
    });
    // Add 'propDeletions' to batch
    var propDeletions = grabUntilApiLimit('propDeletions', count, batchMaxCount, state);
    log['prop deletions: '] = propDeletions;
    count = count + propDeletions.length;
    // Add to batch
    propDeletions.forEach(function (item) {
        var id = item.id;
        var docRef = (collectionMode) ? dbRef.doc(id) : dbRef;
        if (state._conf.sync.guard.includes('id'))
            delete item.id;
        // @ts-ignore
        batch.update(docRef, item);
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
        var newRef = dbRef.doc(item.id);
        batch.set(newRef, item);
    });
    // log the batch contents
    if (state._conf.logging) {
        console.group('[vuex-easy-firestore] api call batch:');
        console.log("%cFirestore PATH: " + firestorePathComplete + " [" + firestorePath + "]", 'color: grey');
        Object.keys(log).forEach(function (key) {
            console.log(key, log[key]);
        });
        console.groupEnd();
    }
    return batch;
}
/**
 * Get the matches of path variables: eg. return ['groupId'] if pathPiece is '{groupId}'
 *
 * @export
 * @param {string} pathPiece eg. 'groups' or '{groupId}'
 * @returns {string[]} returns ['groupId'] in case of '{groupId}'
 */
function getPathVarMatches(pathPiece) {
    var matches = pathPiece.match(/\{([a-z]+)\}/gi);
    if (!matches)
        return [];
    return matches.map(function (key) { return trimAccolades(key); });
}
/**
 * Get the variable name of a piece of path: eg. return 'groupId' if pathPiece is '{groupId}'
 *
 * @export
 * @param {string} pathPiece eg. '{groupId}'
 * @returns {string} returns 'groupId' in case of '{groupId}'
 */
function trimAccolades(pathPiece) {
    return pathPiece.slice(1, -1);
}
function stringifyParams(params) {
    return params.map(function (param) {
        if (isWhat.isAnyObject(param) && !isWhat.isPlainObject(param)) {
            // @ts-ignore
            return String(param.constructor.name) + String(param.id);
        }
        return String(param);
    }).join();
}
/**
 * Gets an object with {whereFilters, orderBy} filters and returns a unique identifier for that
 *
 * @export
 * @param {AnyObject} [whereOrderBy={}] whereOrderBy {whereFilters, orderBy}
 * @returns {string}
 */
function createFetchIdentifier(whereOrderBy) {
    if (whereOrderBy === void 0) { whereOrderBy = {}; }
    var identifier = '';
    if ('whereFilters' in whereOrderBy) {
        identifier += '[where]' + whereOrderBy.whereFilters.map(function (where) { return stringifyParams(where); }).join();
    }
    if ('orderBy' in whereOrderBy) {
        identifier += '[orderBy]' + stringifyParams(whereOrderBy.orderBy);
    }
    return identifier;
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
    if (isWhat.isString(payloadPiece))
        return payloadPiece;
    if (isWhat.isPlainObject(payloadPiece)) {
        if ('id' in payloadPiece)
            return payloadPiece.id;
        var keys = Object.keys(payloadPiece);
        if (keys.length === 1)
            return keys[0];
    }
    return '';
}
/**
 * Returns a value of a payload piece. Eg. {[id]: 'val'} will return 'val'
 *
 * @param {*} payloadPiece
 * @returns {*} the value
 */
function getValueFromPayloadPiece(payloadPiece) {
    if (isWhat.isPlainObject(payloadPiece) &&
        !payloadPiece.id &&
        Object.keys(payloadPiece).length === 1 &&
        isWhat.isPlainObject(payloadPiece[Object.keys(payloadPiece)[0]])) {
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
    var _this = this;
    return {
        duplicate: function (_a, id) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            return __awaiter(_this, void 0, void 0, function () {
                var _b, doc, dId, idMap;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!getters.collectionMode)
                                return [2 /*return*/, console.error('[vuex-easy-firestore] You can only duplicate in \'collection\' mode.')];
                            if (!id)
                                return [2 /*return*/, {}];
                            doc = merge(getters.storeRef[id], { id: null });
                            return [4 /*yield*/, dispatch('insert', doc)];
                        case 1:
                            dId = _c.sent();
                            idMap = (_b = {}, _b[id] = dId, _b);
                            return [2 /*return*/, idMap];
                    }
                });
            });
        },
        duplicateBatch: function (_a, ids) {
            var _this = this;
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            if (ids === void 0) { ids = []; }
            if (!getters.collectionMode)
                return console.error('[vuex-easy-firestore] You can only duplicate in \'collection\' mode.');
            if (!isWhat.isArray(ids) || !ids.length)
                return {};
            var idsMap = ids.reduce(function (carry, id) { return __awaiter(_this, void 0, void 0, function () {
                var idMap;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, dispatch('duplicate', id)];
                        case 1:
                            idMap = _a.sent();
                            return [4 /*yield*/, carry];
                        case 2:
                            carry = _a.sent();
                            return [2 /*return*/, Object.assign(carry, idMap)];
                    }
                });
            }); }, {});
            return idsMap;
        },
        patchDoc: function (_a, _b) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            var _c = _b === void 0 ? { ids: [], doc: {} } : _b, _d = _c.id, id = _d === void 0 ? '' : _d, _e = _c.ids, ids = _e === void 0 ? [] : _e, doc = _c.doc;
            // 0. payload correction (only arrays)
            if (!isWhat.isArray(ids))
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
            if (!isWhat.isArray(ids))
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
            var syncStackItem = getters.prepareForPropDeletion(path);
            // 2. Push to syncStack
            Object.keys(syncStackItem).forEach(function (id) {
                var newVal = (!state._sync.syncStack.propDeletions[id])
                    ? syncStackItem[id]
                    : merge(state._sync.syncStack.propDeletions[id], syncStackItem[id]);
                state._sync.syncStack.propDeletions[id] = newVal;
            });
            // 3. Create or refresh debounce
            return dispatch('handleSyncStackDebounce');
        },
        insertDoc: function (_a, docs) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            if (docs === void 0) { docs = []; }
            // 0. payload correction (only arrays)
            if (!isWhat.isArray(docs))
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
            var batch = makeBatchFromSyncstack(state, getters, Firebase$$1);
            dispatch('_startPatching');
            state._sync.syncStack.debounceTimer = null;
            return new Promise(function (resolve, reject) {
                batch.commit().then(function (_) {
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
                var identifier = createFetchIdentifier({ whereFilters: whereFilters, orderBy: orderBy });
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
                if (isWhat.isFunction(querySnapshot.forEach)) {
                    querySnapshot.forEach(function (_doc) {
                        var id = _doc.id;
                        var doc = setDefaultValues(_doc.data(), state._conf.serverChange.defaultValues);
                        doc.id = id;
                        commit('INSERT_DOC', doc);
                    });
                }
                return querySnapshot;
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
            if (pathVariables && isWhat.isPlainObject(pathVariables)) {
                commit('SET_SYNCFILTERS', pathVariables);
                delete pathVariables.where;
                delete pathVariables.orderBy;
                commit('SET_PATHVARS', pathVariables);
            }
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
                getters.whereFilters.forEach(function (whereParams) {
                    dbRef = dbRef.where.apply(dbRef, whereParams);
                });
                if (state._conf.sync.orderBy.length) {
                    dbRef = dbRef.orderBy.apply(dbRef, state._conf.sync.orderBy);
                }
            }
            // define handleDoc()
            function handleDoc(_changeType, id, doc, source) {
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
                // log
                if (state._conf.logging) {
                    console.log("%c openDBChannel for Firestore PATH: " + getters.firestorePathComplete + " [" + state._conf.firestorePath + "]", 'color: blue');
                }
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
                        if (source === 'local')
                            return resolve();
                        var doc = setDefaultValues(querySnapshot.data(), state._conf.serverChange.defaultValues);
                        var id = getters.firestorePathComplete.split('/').pop();
                        doc.id = id;
                        handleDoc('modified', id, doc, source);
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
            if (isWhat.isFunction(state._sync.unsubscribe))
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
            var newDoc = doc;
            if (!newDoc.id)
                newDoc.id = getters.dbRef.doc().id;
            // define the store update
            function storeUpdateFn(_doc) {
                commit('INSERT_DOC', _doc);
                return dispatch('insertDoc', _doc);
            }
            // check for hooks
            if (state._conf.sync.insertHook) {
                state._conf.sync.insertHook(storeUpdateFn, newDoc, store);
                return newDoc.id;
            }
            storeUpdateFn(newDoc);
            return newDoc.id;
        },
        insertBatch: function (_a, docs) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            var store = this;
            if (!getters.signedIn)
                return 'auth/invalid-user-token';
            if (!isWhat.isArray(docs) || !docs.length)
                return [];
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
                state._conf.sync.insertBatchHook(storeUpdateFn, newDocs, store);
                return newDocs.map(function (_doc) { return _doc.id; });
            }
            storeUpdateFn(newDocs);
            return newDocs.map(function (_doc) { return _doc.id; });
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
                state._conf.sync.patchHook(storeUpdateFn, value, store);
                return id;
            }
            storeUpdateFn(value);
            return id;
        },
        patchBatch: function (_a, _b) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            var doc = _b.doc, _c = _b.ids, ids = _c === void 0 ? [] : _c;
            var store = this;
            if (!doc)
                return [];
            if (!isWhat.isArray(ids) || !ids.length)
                return [];
            // define the store update
            function storeUpdateFn(_doc, _ids) {
                _ids.forEach(function (_id) {
                    commit('PATCH_DOC', __assign({ id: _id }, _doc));
                });
                return dispatch('patchDoc', { ids: _ids, doc: _doc });
            }
            // check for hooks
            if (state._conf.sync.patchBatchHook) {
                state._conf.sync.patchBatchHook(storeUpdateFn, doc, ids, store);
                return ids;
            }
            storeUpdateFn(doc, ids);
            return ids;
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
                state._conf.sync.deleteHook(storeUpdateFn, id, store);
                return id;
            }
            storeUpdateFn(id);
            return id;
        },
        deleteBatch: function (_a, ids) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            if (!isWhat.isArray(ids) || !ids.length)
                return [];
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
                state._conf.sync.deleteBatchHook(storeUpdateFn, ids, store);
                return ids;
            }
            storeUpdateFn(ids);
            return ids;
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

function retrievePaths(object, path, result) {
    if (!isWhat.isPlainObject(object) ||
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
    if (!isWhat.isPlainObject(obj))
        return obj;
    return Object.keys(obj).reduce(function (carry, key) {
        // check fillables
        if (fillables.length && !fillables.includes(key)) {
            return carry;
        }
        // check guard
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
        firestorePathComplete: function (state, getters) {
            var path = state._conf.firestorePath;
            var requireUser = path.includes('{userId}');
            if (requireUser) {
                if (!getters.signedIn)
                    return path;
                if (!Firebase$$1.auth().currentUser)
                    return path;
                var userId = Firebase$$1.auth().currentUser.uid;
                path = path.replace('{userId}', userId);
            }
            Object.keys(state._sync.pathVariables).forEach(function (key) {
                var pathPiece = state._sync.pathVariables[key];
                path = path.replace("{" + key + "}", "" + pathPiece);
            });
            return path;
        },
        signedIn: function (state, getters, rootState, rootGetters) {
            var requireUser = state._conf.firestorePath.includes('{userId}');
            if (!requireUser)
                return true;
            return state._sync.signedIn;
        },
        dbRef: function (state, getters, rootState, rootGetters) {
            var path = getters.firestorePathComplete;
            return (getters.collectionMode)
                ? Firebase$$1.firestore().collection(path)
                : Firebase$$1.firestore().doc(path);
        },
        storeRef: function (state, getters, rootState) {
            var path = (state._conf.statePropName)
                ? state._conf.moduleName + "/" + state._conf.statePropName
                : state._conf.moduleName;
            return vuexEasyAccess.getDeepRef(rootState, path);
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
                    // retrieve full object in case there's an empty doc passed
                    if (!Object.keys(doc).length) {
                        patchData = (collectionMode)
                            ? getters.storeRef[id]
                            : getters.storeRef;
                    }
                    else {
                        patchData = doc;
                    }
                    // set default fields
                    patchData.updated_at = Firebase$$1.firestore.FieldValue.serverTimestamp();
                    patchData.updated_by = state._sync.userId;
                    // replace arrayUnion and arrayRemove
                    function checkFn(foundVal) {
                        if (isArrayHelper(foundVal)) {
                            return foundVal.getFirestoreFieldValue();
                        }
                        return foundVal;
                    }
                    patchData = findAndReplaceAnything.findAndReplaceIf(patchData, checkFn);
                    // add fillable and guard defaults
                    var fillables = state._conf.sync.fillables;
                    if (fillables.length)
                        fillables = fillables.concat(['updated_at', 'updated_by']);
                    var guard = state._conf.sync.guard.concat(['_conf', '_sync']);
                    // clean up item
                    var cleanedPatchData = checkFillables(patchData, fillables, guard);
                    var itemToUpdate = flattenToPaths(cleanedPatchData);
                    // add id (required to get ref later at apiHelpers.ts)
                    itemToUpdate.id = id;
                    carry[id] = itemToUpdate;
                    return carry;
                }, {});
            };
        },
        prepareForPropDeletion: function (state, getters, rootState, rootGetters) {
            return function (path) {
                if (path === void 0) { path = ''; }
                var _a;
                var collectionMode = getters.collectionMode;
                var patchData = {};
                // set default fields
                patchData.updated_at = Firebase$$1.firestore.FieldValue.serverTimestamp();
                patchData.updated_by = state._sync.userId;
                // add fillable and guard defaults
                var fillables = state._conf.sync.fillables;
                if (fillables.length)
                    fillables = fillables.concat(['updated_at', 'updated_by']);
                var guard = state._conf.sync.guard.concat(['_conf', '_sync']);
                // clean up item
                var cleanedPatchData = checkFillables(patchData, fillables, guard);
                // add id (required to get ref later at apiHelpers.ts)
                var id, cleanedPath;
                if (collectionMode) {
                    id = path.substring(0, path.indexOf('.'));
                    cleanedPath = path.substring(path.indexOf('.') + 1);
                }
                else {
                    id = 'singleDoc';
                    cleanedPath = path;
                }
                cleanedPatchData[cleanedPath] = Firebase$$1.firestore.FieldValue.delete();
                cleanedPatchData.id = id;
                return _a = {}, _a[id] = cleanedPatchData, _a;
            };
        },
        prepareForInsert: function (state, getters, rootState, rootGetters) {
            return function (items) {
                if (items === void 0) { items = []; }
                // add fillable and guard defaults
                var fillables = state._conf.sync.fillables;
                if (fillables.length)
                    fillables = fillables.concat(['id', 'created_at', 'created_by']);
                var guard = state._conf.sync.guard.concat(['_conf', '_sync']);
                return items.reduce(function (carry, item) {
                    // set default fields
                    item.created_at = Firebase$$1.firestore.FieldValue.serverTimestamp();
                    item.created_by = state._sync.userId;
                    // clean up item
                    item = checkFillables(item, fillables, guard);
                    carry.push(item);
                    return carry;
                }, []);
            };
        },
        prepareInitialDocForInsert: function (state, getters, rootState, rootGetters) {
            return function (doc) {
                // add fillable and guard defaults
                var fillables = state._conf.sync.fillables;
                if (fillables.length)
                    fillables = fillables.concat(['id', 'created_at', 'created_by']);
                var guard = state._conf.sync.guard.concat(['_conf', '_sync']);
                // set default fields
                doc.created_at = Firebase$$1.firestore.FieldValue.serverTimestamp();
                doc.created_by = state._sync.userId;
                // clean up item
                doc = checkFillables(doc, fillables, guard);
                return doc;
            };
        },
        whereFilters: function (state, getters) {
            var whereArrays = state._conf.sync.where;
            return whereArrays.map(function (whereClause) {
                return whereClause.map(function (param) {
                    if (!isWhat.isString(param))
                        return param;
                    var cleanedParam = param;
                    getPathVarMatches(param).forEach(function (key) {
                        var keyRegEx = new RegExp("{" + key + "}", 'g');
                        if (key === 'userId') {
                            cleanedParam = cleanedParam.replace(keyRegEx, state._sync.userId);
                            return;
                        }
                        if (!Object.keys(state._sync.pathVariables).includes(key)) {
                            return error('missingPathVarKey');
                        }
                        var varVal = state._sync.pathVariables[key];
                        // if path is only a param we need to just assign to avoid stringification
                        if (param === "{" + key + "}") {
                            cleanedParam = varVal;
                            return;
                        }
                        cleanedParam = cleanedParam.replace(keyRegEx, varVal);
                    });
                    return cleanedParam;
                });
            });
        },
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
        if (!isWhat.isNumber(_prop))
            errors.push("`" + prop + "` should be a Number, but is not.");
    });
    var functionProps = ['insertHook', 'patchHook', 'deleteHook', 'insertBatchHook', 'patchBatchHook', 'deleteBatchHook', 'addedHook', 'modifiedHook', 'removedHook'];
    functionProps.forEach(function (prop) {
        var _prop = (syncProps.includes(prop))
            ? config.sync[prop]
            : config.serverChange[prop];
        if (!isWhat.isFunction(_prop))
            errors.push("`" + prop + "` should be a Function, but is not.");
    });
    var objectProps = ['sync', 'serverChange', 'defaultValues', 'fetch'];
    objectProps.forEach(function (prop) {
        var _prop = (prop === 'defaultValues')
            ? config.serverChange[prop]
            : config[prop];
        if (!isWhat.isPlainObject(_prop))
            errors.push("`" + prop + "` should be an Object, but is not.");
    });
    var stringProps = ['firestorePath', 'firestoreRefType', 'moduleName', 'statePropName'];
    stringProps.forEach(function (prop) {
        var _prop = config[prop];
        if (!isWhat.isString(_prop))
            errors.push("`" + prop + "` should be a String, but is not.");
    });
    var arrayProps = ['where', 'orderBy', 'fillables', 'guard'];
    arrayProps.forEach(function (prop) {
        var _prop = config.sync[prop];
        if (!isWhat.isArray(_prop))
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
function vuexEasyFirestore(easyFirestoreModule, _a) {
    var _b = _a === void 0 ? {
        logging: false,
        FirebaseDependency: Firebase$1
    } : _a, _c = _b.logging, logging = _c === void 0 ? false : _c, _d = _b.FirebaseDependency, FirebaseDependency = _d === void 0 ? Firebase$1 : _d;
    return function (store) {
        // Get an array of config files
        if (!isWhat.isArray(easyFirestoreModule))
            easyFirestoreModule = [easyFirestoreModule];
        // Create a module for each config file
        easyFirestoreModule.forEach(function (config) {
            config.logging = logging;
            var moduleName = vuexEasyAccess.getKeysFromPath(config.moduleName);
            store.registerModule(moduleName, iniModule(config, FirebaseDependency));
        });
    };
}

exports.vuexEasyFirestore = vuexEasyFirestore;
exports.arrayUnion = arrayUnion;
exports.arrayRemove = arrayRemove;
exports.default = vuexEasyFirestore;

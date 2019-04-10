'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(require('vue'));
var Vuex = _interopDefault(require('vuex'));
var createEasyAccess = require('vuex-easy-access');
var createEasyAccess__default = _interopDefault(createEasyAccess);
var Firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');
var isWhat = require('is-what');
var copy = _interopDefault(require('copy-anything'));
var merge = _interopDefault(require('merge-anything'));
var flatten = _interopDefault(require('flatten-anything'));
var compareAnything = require('compare-anything');
var findAndReplaceAnything = require('find-and-replace-anything');
var filter = _interopDefault(require('filter-anything'));

function initialState() {
    return {
        playerName: 'Satoshi',
        pokemon: {},
        stats: {
            pokemonCount: 0,
            freedCount: 0,
        }
    };
}
var pokemonBox = {
    // easy firestore config
    firestorePath: 'pokemonBoxes/Satoshi/pokemon',
    firestoreRefType: 'collection',
    moduleName: 'pokemonBox',
    statePropName: 'pokemon',
    // Sync:
    sync: {
        where: [['id', '==', '{pokeId}']],
        orderBy: [],
        fillables: [
            'fillable',
            'name',
            'id',
            'type',
            'freed',
            'nested',
            'addedBeforeInsert',
            'addedBeforePatch',
            'arr1',
            'arr2',
            'guarded',
            'defaultVal',
            'nestedDefaultVal'
        ],
        guard: ['guarded'],
        defaultValues: {
            defaultVal: true,
            nestedDefaultVal: {
                types: 'moon'
            },
        },
        // HOOKS for local changes:
        insertHook: function (updateStore, doc, store) {
            doc.addedBeforeInsert = true;
            return updateStore(doc);
        },
        patchHook: function (updateStore, doc, store) {
            doc.addedBeforePatch = true;
            return updateStore(doc);
        },
        deleteHook: function (updateStore, id, store) {
            if (id === 'stopBeforeDelete')
                return;
            return updateStore(id);
        }
    },
    // module
    state: initialState(),
    mutations: createEasyAccess.defaultMutations(initialState()),
    actions: {},
    getters: {},
};

function initialState$1() {
    return {
        name: 'Satoshi',
        pokemonBelt: [],
        items: [],
        multipleFastEdits: null,
    };
}
var mainCharacter = {
    // easy firestore config
    firestorePath: 'playerCharacters/Satoshi',
    firestoreRefType: 'doc',
    moduleName: 'mainCharacter',
    statePropName: '',
    // module
    state: initialState$1(),
    mutations: createEasyAccess.defaultMutations(initialState$1()),
    actions: {},
    getters: {},
};

function initialState$2() {
    return {
        playerName: 'Satoshi',
        pokemon: {},
        stats: {
            pokemonCount: 0,
            freedCount: 0,
        }
    };
}
var pokemonBoxVEA = {
    // easy firestore config
    firestorePath: 'pokemonBoxesVEA/Satoshi/pokemon',
    firestoreRefType: 'collection',
    moduleName: 'pokemonBoxVEA',
    statePropName: 'pokemon',
    // Sync:
    sync: {
        where: [['id', '==', '{pokeId}']],
        orderBy: [],
        fillables: [
            'fillable',
            'name',
            'id',
            'type',
            'freed',
            'nested',
            'addedBeforeInsert',
            'addedBeforePatch',
            'arr1',
            'arr2',
            'guarded',
            'defaultVal',
            'nestedDefaultVal'
        ],
        guard: ['guarded'],
        defaultValues: {
            defaultVal: true,
            nestedDefaultVal: {
                types: 'moon'
            },
        },
        // HOOKS for local changes:
        insertHook: function (updateStore, doc, store) {
            doc.addedBeforeInsert = true;
            return updateStore(doc);
        },
        patchHook: function (updateStore, doc, store) {
            doc.addedBeforePatch = true;
            return updateStore(doc);
        },
        deleteHook: function (updateStore, id, store) {
            if (id === 'stopBeforeDelete')
                return;
            return updateStore(id);
        }
    },
    // module
    state: initialState$2(),
    mutations: createEasyAccess.defaultMutations(initialState$2()),
    actions: {},
    getters: {},
};

function initialState$3() {
    return {
        name: 'Satoshi',
        pokemonBelt: [],
        items: [],
        multipleFastEdits: null,
    };
}
var mainCharacterVEA = {
    // easy firestore config
    firestorePath: 'playerCharactersVEA/Satoshi',
    firestoreRefType: 'doc',
    moduleName: 'mainCharacterVEA',
    statePropName: '',
    // module
    state: initialState$3(),
    mutations: createEasyAccess.defaultMutations(initialState$3()),
    actions: {},
    getters: {},
};

function initialState$4() {
    return {
        name: 'Satoshi',
        pokemonBelt: [],
        items: []
    };
}
var testPathVar = {
    // easy firestore config
    firestorePath: 'coll/{name}',
    firestoreRefType: 'doc',
    moduleName: 'testPathVar',
    statePropName: '',
    // module
    state: initialState$4(),
    mutations: createEasyAccess.defaultMutations(initialState$4()),
    actions: {},
    getters: {},
};

function initialState$5() {
    return {
        name: 'Satoshi',
        pokemonBelt: [],
        items: []
    };
}
var testMutations1 = {
    // easy firestore config
    firestorePath: 'coll/{name}',
    firestoreRefType: 'doc',
    moduleName: 'testMutationsNoStateProp',
    statePropName: '',
    // module
    state: initialState$5(),
    mutations: createEasyAccess.defaultMutations(initialState$5()),
    actions: {},
    getters: {},
};

function initialState$6() {
    return {
        name: 'Satoshi',
        pokemonBelt: [],
        items: []
    };
}
var testMutations2 = {
    // easy firestore config
    firestorePath: 'coll/{name}',
    firestoreRefType: 'collection',
    moduleName: 'testMutationsWithStateProp',
    statePropName: 'putItHere',
    // module
    state: initialState$6(),
    mutations: createEasyAccess.defaultMutations(initialState$6()),
    actions: {},
    getters: {},
};

function initialState$7() {
    return {
        nested: {
            fillables: {
                yes: 0,
                no: 0,
            },
        }
    };
}
var testNestedFillables = {
    // easy firestore config
    firestorePath: 'configTests/nestedFillables',
    firestoreRefType: 'doc',
    moduleName: 'nestedFillables',
    statePropName: '',
    sync: {
        fillables: ['nested.fillables.yes'],
    },
    // module
    state: initialState$7(),
    mutations: createEasyAccess.defaultMutations(initialState$7()),
    actions: {},
    getters: {},
};

function initialState$8() {
    return {
        nested: {
            guard: true,
        }
    };
}
var testNestedGuard = {
    // easy firestore config
    firestorePath: 'configTests/nestedGuard',
    firestoreRefType: 'doc',
    moduleName: 'nestedGuard',
    statePropName: '',
    sync: {
        guard: ['nested.guard'],
    },
    // module
    state: initialState$8(),
    mutations: createEasyAccess.defaultMutations(initialState$8()),
    actions: {},
    getters: {},
};

function initialState$9() {
    return {
        iniProp: true,
    };
}
var initialDoc = {
    // easy firestore config
    firestorePath: 'docs/{randomId}',
    firestoreRefType: 'doc',
    moduleName: 'initialDoc',
    statePropName: '',
    // module
    state: initialState$9(),
    mutations: createEasyAccess.defaultMutations(initialState$9()),
    actions: {},
    getters: {},
};

function initialState$a() {
    return {
        iniProp: true,
    };
}
var preventInitialDoc = {
    // easy firestore config
    firestorePath: 'docs/{randomId}',
    firestoreRefType: 'doc',
    moduleName: 'preventInitialDoc',
    statePropName: '',
    sync: {
        preventInitialDocInsertion: true,
    },
    // module
    state: initialState$a(),
    mutations: createEasyAccess.defaultMutations(initialState$a()),
    actions: {},
    getters: {},
};

function initialState$b() {
    return {
        iniProp: true,
        defaultPropsNotToBeDeleted: true
    };
}
var serverHooks = {
    // easy firestore config
    firestorePath: 'configTests/serverHooks',
    firestoreRefType: 'doc',
    moduleName: 'serverHooks',
    statePropName: '',
    // module
    state: initialState$b(),
    mutations: createEasyAccess.defaultMutations(initialState$b()),
    actions: {},
    getters: {},
    sync: {
        guard: ['created_by', 'created_at', 'updated_by', 'updated_at']
    }
};

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

var user = {
    firestorePath: 'user/{userId}',
    firestoreRefType: 'doc',
    moduleName: 'user',
    statePropName: '',
    actions: {
        loginWithEmail: function (_a, userNr) {
            var dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                var userEmail;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (userNr === 1)
                                userEmail = 'test@test.com';
                            if (userNr === 2)
                                userEmail = 'test2@test.com';
                            return [4 /*yield*/, Firebase.auth()
                                    .signInWithEmailAndPassword(userEmail, 'test1234')];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        logout: function (_a) {
            var dispatch = _a.dispatch, state = _a.state;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Firebase.auth().signOut()];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, dispatch('closeDBChannel', { clearModule: true })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
    },
    // module
    state: {},
    mutations: {},
    getters: {},
};

function initialState$c() {
    return {
        defaultVal1: true,
        nestedDefaultVal: {
            type1: 'sun'
        },
    };
}
var defaultValuesSetupColNOProp = {
    // easy firestore config
    firestorePath: 'configTests/defaultValuesSetupColNOProp',
    firestoreRefType: 'collection',
    moduleName: 'defaultValuesSetupColNOProp',
    statePropName: '',
    sync: {
        defaultValues: {
            defaultVal: true,
            nestedDefaultVal: {
                type: 'moon'
            },
        },
    },
    // module
    state: initialState$c(),
    mutations: createEasyAccess.defaultMutations(initialState$c()),
    actions: {},
    getters: {},
};

function initialState$d() {
    return {
        NOT: false,
        prop: {
            defaultVal1: true,
            nestedDefaultVal: {
                type1: 'sun'
            },
        }
    };
}
var defaultValuesSetupColProp = {
    // easy firestore config
    firestorePath: 'configTests/defaultValuesSetupColProp',
    firestoreRefType: 'collection',
    moduleName: 'defaultValuesSetupColProp',
    statePropName: 'prop',
    sync: {
        defaultValues: {
            defaultVal: true,
            nestedDefaultVal: {
                type: 'moon'
            },
        },
    },
    // module
    state: initialState$d(),
    mutations: createEasyAccess.defaultMutations(initialState$d()),
    actions: {},
    getters: {},
};

function initialState$e() {
    return {
        defaultVal1: true,
        nestedDefaultVal: {
            type1: 'sun'
        },
    };
}
var defaultValuesSetupDocNOProp = {
    // easy firestore config
    firestorePath: 'configTests/defaultValuesSetupDocNOProp',
    firestoreRefType: 'doc',
    moduleName: 'defaultValuesSetupDocNOProp',
    statePropName: '',
    sync: {
        defaultValues: {
            defaultVal2: true,
            nestedDefaultVal: {
                type2: 'moon'
            },
        },
    },
    // module
    state: initialState$e(),
    mutations: createEasyAccess.defaultMutations(initialState$e()),
    actions: {},
    getters: {},
};

function initialState$f() {
    return {
        NOT: false,
        prop: {
            defaultVal1: true,
            nestedDefaultVal: {
                type1: 'sun'
            },
        }
    };
}
var defaultValuesSetupDocProp = {
    // easy firestore config
    firestorePath: 'configTests/defaultValuesSetupDocProp',
    firestoreRefType: 'doc',
    moduleName: 'defaultValuesSetupDocProp',
    statePropName: 'prop',
    sync: {
        defaultValues: {
            defaultVal2: true,
            nestedDefaultVal: {
                type2: 'moon'
            },
        },
    },
    // module
    state: initialState$f(),
    mutations: createEasyAccess.defaultMutations(initialState$f()),
    actions: {},
    getters: {},
};

function initialState$g() {
    return {};
}
var multipleOpenDBChannels = {
    // easy firestore config
    firestorePath: 'coll/{name}/data',
    firestoreRefType: 'collection',
    moduleName: 'multipleOpenDBChannels',
    statePropName: '',
    // module
    state: initialState$g(),
    mutations: createEasyAccess.defaultMutations(initialState$g()),
    actions: {},
    getters: {},
};

function initialState$h() {
    return {};
}
var docModeWithPathVar = {
    // easy firestore config
    firestorePath: 'playerCharacters/{name}',
    firestoreRefType: 'doc',
    moduleName: 'docModeWithPathVar',
    statePropName: '',
    // module
    state: initialState$h(),
    mutations: createEasyAccess.defaultMutations(initialState$h()),
    actions: {},
    getters: {},
};

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
        defaultValues: {},
        preventInitialDocInsertion: false,
        debounceTimerMs: 1000,
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
        convertTimestamps: {},
        // HOOKS for changes on SERVER:
        addedHook: function (updateStore, doc, id, store) { return updateStore(doc); },
        modifiedHook: function (updateStore, doc, id, store) { return updateStore(doc); },
        removedHook: function (updateStore, doc, id, store) { return updateStore(doc); },
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
            unsubscribe: {},
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

var _BaseFirebase = Firebase;
function setBaseFirebase(firebaseDependency) {
    _BaseFirebase = firebaseDependency;
}
var ArrayUnion = /** @class */ (function () {
    function ArrayUnion() {
        var payload = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            payload[_i] = arguments[_i];
        }
        this.isArrayHelper = true;
        this.payload = payload;
    }
    ArrayUnion.prototype.executeOn = function (array) {
        this.payload.forEach(function (item) {
            if (!array.includes(item)) {
                array.push(item);
            }
        });
        return array;
    };
    ArrayUnion.prototype.getFirestoreFieldValue = function () {
        var _a;
        return (_a = _BaseFirebase.firestore.FieldValue).arrayUnion.apply(_a, this.payload);
    };
    return ArrayUnion;
}());
var ArrayRemove = /** @class */ (function () {
    function ArrayRemove() {
        var payload = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            payload[_i] = arguments[_i];
        }
        this.isArrayHelper = true;
        this.payload = payload;
    }
    ArrayRemove.prototype.executeOn = function (array) {
        this.payload.forEach(function (item) {
            var index = array.indexOf(item);
            if (index > -1) {
                array.splice(index, 1);
            }
        });
        return array;
    };
    ArrayRemove.prototype.getFirestoreFieldValue = function () {
        var _a;
        return (_a = _BaseFirebase.firestore.FieldValue).arrayRemove.apply(_a, this.payload);
    };
    return ArrayRemove;
}());
function isArrayHelper(value) {
    // this is bugged in vuex actions, I DONT KNOW WHY
    // return (
    //   value instanceof ArrayUnion ||
    //   value instanceof ArrayRemove
    // )
    return (isWhat.isAnyObject(value) &&
        !isWhat.isPlainObject(value) &&
        // @ts-ignore
        value.isArrayHelper === true);
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
        SET_USER_ID: function (state, userId) {
            if (!userId) {
                state._sync.signedIn = false;
                state._sync.userId = null;
            }
            else {
                state._sync.signedIn = true;
                state._sync.userId = userId;
            }
        },
        CLEAR_USER: function (state) {
            state._sync.signedIn = false;
            state._sync.userId = null;
        },
        RESET_VUEX_EASY_FIRESTORE_STATE: function (state) {
            // unsubscribe all DBChannel listeners:
            Object.keys(state._sync.unsubscribe).forEach(function (unsubscribe) {
                if (isWhat.isFunction(unsubscribe))
                    unsubscribe();
            });
            var self = this;
            var _sync = merge(state._sync, {
                // make null once to be able to overwrite with empty object
                unsubscribe: null,
                pathVariables: null,
                syncStack: { updates: null, propDeletions: null },
                fetched: null,
            }, {
                unsubscribe: {},
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
            var docContainer = (state._conf.statePropName)
                ? state[state._conf.statePropName]
                : state;
            Object.keys(newState).forEach(function (key) {
                self._vm.$set(state, key, newState[key]);
            });
            Object.keys(docContainer).forEach(function (key) {
                if (Object.keys(newState).includes(key))
                    return;
                self._vm.$delete(docContainer, key);
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
            var ref = createEasyAccess.getDeepRef(searchTarget, propArr.join('.'));
            return this._vm.$delete(ref, target);
        }
    };
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
function makeBatchFromSyncstack(state, getters, Firebase, batchMaxCount) {
    if (batchMaxCount === void 0) { batchMaxCount = 500; }
    // get state & getter variables
    var firestorePath = state._conf.firestorePath;
    var firestorePathComplete = getters.firestorePathComplete;
    var dbRef = getters.dbRef;
    var collectionMode = getters.collectionMode;
    // make batch
    var batch = Firebase.firestore().batch();
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
 * Gets an object with {where, orderBy} filters and returns a unique identifier for that
 *
 * @export
 * @param {AnyObject} [whereOrderBy={}] whereOrderBy {where, orderBy, pathVariables}
 * @returns {string}
 */
function createFetchIdentifier(whereOrderBy) {
    if (whereOrderBy === void 0) { whereOrderBy = {}; }
    var identifier = '';
    if ('where' in whereOrderBy) {
        identifier += '[where]' + whereOrderBy.where.map(function (where) { return stringifyParams(where); }).join();
    }
    if ('orderBy' in whereOrderBy) {
        identifier += '[orderBy]' + stringifyParams(whereOrderBy.orderBy);
    }
    if ('pathVariables' in whereOrderBy) {
        delete whereOrderBy.pathVariables.where;
        delete whereOrderBy.pathVariables.orderBy;
        identifier += '[pathVariables]' + JSON.stringify(whereOrderBy.pathVariables);
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
function pluginActions (Firebase) {
    var _this = this;
    return {
        setUserId: function (_a, userId) {
            var commit = _a.commit, getters = _a.getters;
            if (userId === undefined)
                userId = null;
            // undefined cannot be synced to firestore
            if (!userId && Firebase.auth().currentUser) {
                userId = Firebase.auth().currentUser.uid;
            }
            commit('SET_USER_ID', userId);
            if (getters.firestorePathComplete.includes('{userId}')) {
                var error_1 = '[vuex-easy-firestore] error trying to set userId.\n Try doing \`dispatch(\'module/setUserId\', userId)\ before openDBChannel or fetchAndAdd.`';
                console.error(error_1);
                throw error_1;
            }
        },
        clearUser: function (_a) {
            var commit = _a.commit;
            commit('CLEAR_USER');
        },
        setPathVars: function (_a, pathVars) {
            var commit = _a.commit;
            commit('SET_PATHVARS', pathVars);
        },
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
            // EXTRA: check if doc is being inserted if so
            state._sync.syncStack.inserts.forEach(function (newDoc, newDocIndex) {
                // get the index of the id that is also in the insert stack
                var indexIdInInsert = ids.indexOf(newDoc.id);
                if (indexIdInInsert === -1)
                    return;
                // the doc trying to be synced is also in insert
                // prepare the doc as new doc:
                var patchDoc = getters.prepareForInsert([doc])[0];
                // replace insert sync stack with merged item:
                state._sync.syncStack.inserts[newDocIndex] = merge(newDoc, patchDoc);
                // empty out the id that was to be patched:
                ids.splice(indexIdInInsert, 1);
            });
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
            var initialDocPrepared = getters.prepareInitialDocForInsert(initialDoc);
            // 2. Create a reference to the SF doc.
            var initialDocRef = getters.dbRef;
            return Firebase.firestore().runTransaction(function (transaction) {
                // This code may get re-run multiple times if there are conflicts.
                return transaction.get(initialDocRef)
                    .then(function (foundInitialDoc) {
                    if (!foundInitialDoc.exists) {
                        transaction.set(initialDocRef, initialDocPrepared);
                    }
                });
            }).then(function () {
                if (state._conf.logging) {
                    console.log('[vuex-easy-firestore] Initial doc succesfully inserted.');
                }
            }).catch(function (error) {
                console.error('[vuex-easy-firestore] Initial doc succesfully insertion failed. Further `set` or `patch` actions will also fail. Requires an internet connection when the initial doc is inserted. Please connect to the internet and refresh the page.', error);
            });
        },
        handleSyncStackDebounce: function (_a) {
            var state = _a.state, commit = _a.commit, dispatch = _a.dispatch, getters = _a.getters;
            if (!getters.signedIn)
                return false;
            if (!state._sync.syncStack.debounceTimer) {
                var ms = state._conf.sync.debounceTimerMs;
                var debounceTimer = startDebounce(ms);
                debounceTimer.done.then(function (_) { return dispatch('batchSync'); });
                state._sync.syncStack.debounceTimer = debounceTimer;
            }
            state._sync.syncStack.debounceTimer.refresh();
        },
        batchSync: function (_a) {
            var getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch, state = _a.state;
            var batch = makeBatchFromSyncstack(state, getters, Firebase);
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
                }).catch(function (error) {
                    state._sync.patching = 'error';
                    state._sync.syncStack.debounceTimer = null;
                    console.error('Error during synchronisation ↓');
                    return reject(error);
                });
            });
        },
        fetch: function (_a, pathVariables
        // where: [['archived', '==', true]]
        // orderBy: ['done_date', 'desc']
        ) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            if (pathVariables === void 0) { pathVariables = { where: [], whereFilters: [], orderBy: [] }; }
            dispatch('setUserId');
            var where = pathVariables.where, whereFilters = pathVariables.whereFilters, orderBy = pathVariables.orderBy;
            if (!isWhat.isArray(where))
                where = [];
            if (!isWhat.isArray(orderBy))
                orderBy = [];
            if (isWhat.isArray(whereFilters) && whereFilters.length)
                where = whereFilters; // depreciated
            if (pathVariables && isWhat.isPlainObject(pathVariables)) {
                commit('SET_PATHVARS', pathVariables);
            }
            return new Promise(function (resolve, reject) {
                // log
                if (state._conf.logging) {
                    console.log("%c fetch for Firestore PATH: " + getters.firestorePathComplete + " [" + state._conf.firestorePath + "]", 'color: lightcoral');
                }
                if (!getters.signedIn)
                    return resolve();
                var identifier = createFetchIdentifier({ where: where, orderBy: orderBy });
                var fetched = state._sync.fetched[identifier];
                // We've never fetched this before:
                if (!fetched) {
                    var ref_1 = getters.dbRef;
                    // apply where filters and orderBy
                    getters.getWhereArrays(where).forEach(function (paramsArr) {
                        ref_1 = ref_1.where.apply(ref_1, paramsArr);
                    });
                    if (orderBy.length)
                        ref_1 = ref_1.orderBy.apply(ref_1, orderBy);
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
                // add doc limit
                var limit = (isWhat.isNumber(pathVariables.limit))
                    ? pathVariables.limit
                    : state._conf.fetch.docLimit;
                if (limit > 0)
                    fRef = fRef.limit(limit);
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
                    if (docs.length < limit) {
                        state._sync.fetched[identifier].done = true;
                    }
                    state._sync.fetched[identifier].retrievedFetchRefs.push(fRef);
                    // Get the last visible document
                    resolve(querySnapshot);
                    var lastVisible = docs[docs.length - 1];
                    // set the reference for the next records.
                    var next = fRef.startAfter(lastVisible);
                    state._sync.fetched[identifier].nextFetchRef = next;
                }).catch(function (error) {
                    console.error('[vuex-easy-firestore]', error);
                    return reject(error);
                });
            });
        },
        fetchAndAdd: function (_a, pathVariables
        // where: [['archived', '==', true]]
        // orderBy: ['done_date', 'desc']
        ) {
            var _this = this;
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            if (pathVariables === void 0) { pathVariables = { where: [], whereFilters: [], orderBy: [] }; }
            if (pathVariables && isWhat.isPlainObject(pathVariables)) {
                commit('SET_PATHVARS', pathVariables);
            }
            // 'doc' mode:
            if (!getters.collectionMode) {
                dispatch('setUserId');
                if (state._conf.logging) {
                    console.log("%c fetch for Firestore PATH: " + getters.firestorePathComplete + " [" + state._conf.firestorePath + "]", 'color: lightcoral');
                }
                return getters.dbRef.get().then(function (_doc) { return __awaiter(_this, void 0, void 0, function () {
                    var id, doc;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!!_doc.exists) return [3 /*break*/, 2];
                                // No initial doc found in docMode
                                if (state._conf.sync.preventInitialDocInsertion)
                                    throw 'preventInitialDocInsertion';
                                if (state._conf.logging)
                                    console.log('[vuex-easy-firestore] inserting initial doc');
                                return [4 /*yield*/, dispatch('insertInitialDoc')];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, _doc];
                            case 2:
                                id = getters.docModeId;
                                doc = getters.cleanUpRetrievedDoc(_doc.data(), id);
                                dispatch('applyHooksAndUpdateState', { change: 'modified', id: id, doc: doc });
                                return [2 /*return*/, doc];
                        }
                    });
                }); }).catch(function (error) {
                    console.error('[vuex-easy-firestore]', error);
                    return error;
                });
            }
            // 'collection' mode:
            return dispatch('fetch', pathVariables)
                .then(function (querySnapshot) {
                if (querySnapshot.done === true)
                    return querySnapshot;
                if (isWhat.isFunction(querySnapshot.forEach)) {
                    querySnapshot.forEach(function (_doc) {
                        var id = _doc.id;
                        var doc = getters.cleanUpRetrievedDoc(_doc.data(), id);
                        dispatch('applyHooksAndUpdateState', { change: 'added', id: id, doc: doc });
                    });
                }
                return querySnapshot;
            });
        },
        applyHooksAndUpdateState: function (// this is only on server retrievals
        _a, _b) {
            var getters = _a.getters, state = _a.state, commit = _a.commit, dispatch = _a.dispatch;
            var change = _b.change, id = _b.id, _c = _b.doc, doc = _c === void 0 ? {} : _c;
            var store = this;
            // define storeUpdateFn()
            function storeUpdateFn(_doc) {
                switch (change) {
                    case 'added':
                        commit('INSERT_DOC', _doc);
                        break;
                    case 'removed':
                        commit('DELETE_DOC', id);
                        break;
                    default:
                        dispatch('deleteMissingProps', _doc);
                        commit('PATCH_DOC', _doc);
                        break;
                }
            }
            // get user set sync hook function
            var syncHookFn = state._conf.serverChange[change + 'Hook'];
            if (isWhat.isFunction(syncHookFn)) {
                syncHookFn(storeUpdateFn, doc, id, store, 'server', change);
            }
            else {
                storeUpdateFn(doc);
            }
        },
        deleteMissingProps: function (_a, doc) {
            var getters = _a.getters, commit = _a.commit;
            var defaultValues = getters.defaultValues;
            var searchTarget = (getters.collectionMode)
                ? getters.storeRef[doc.id]
                : getters.storeRef;
            var compareInfo = compareAnything.compareObjectProps(flatten(doc), // presentIn 0
            flatten(defaultValues), // presentIn 1
            flatten(searchTarget) // presentIn 2
            );
            Object.keys(compareInfo.presentIn).forEach(function (prop) {
                // don't worry about props not in fillables
                if (getters.fillables.length && !getters.fillables.includes(prop)) {
                    return;
                }
                // don't worry about props in guard
                if (getters.guard.includes(prop))
                    return;
                // don't worry about props starting with _sync or _conf
                if (prop.split('.')[0] === '_sync' || prop.split('.')[0] === '_conf')
                    return;
                // where is the prop present?
                var presence = compareInfo.presentIn[prop];
                var propNotInDoc = (!presence.includes(0));
                var propNotInDefaultValues = (!presence.includes(1));
                // delete props that are not present in the doc and default values
                if (propNotInDoc && propNotInDefaultValues) {
                    var path = (getters.collectionMode)
                        ? doc.id + "." + prop
                        : prop;
                    return commit('DELETE_PROP', path);
                }
            });
        },
        openDBChannel: function (_a, pathVariables) {
            var _this = this;
            var getters = _a.getters, state = _a.state, commit = _a.commit, dispatch = _a.dispatch;
            dispatch('setUserId');
            // `first` makes sure that local changes made during offline are reflected as server changes which the app is refreshed during offline mode
            var first = true;
            // set state for pathVariables
            if (pathVariables && isWhat.isPlainObject(pathVariables)) {
                commit('SET_SYNCFILTERS', pathVariables);
                delete pathVariables.where;
                delete pathVariables.orderBy;
                commit('SET_PATHVARS', pathVariables);
            }
            var identifier = createFetchIdentifier({
                where: state._conf.sync.where,
                orderBy: state._conf.sync.orderBy,
                pathVariables: state._sync.pathVariables
            });
            if (isWhat.isFunction(state._sync.unsubscribe[identifier])) {
                var channelAlreadyOpenError_1 = "openDBChannel was already called for these filters and pathvariables. Identifier: " + identifier;
                if (state._conf.logging) {
                    console.log(channelAlreadyOpenError_1);
                }
                return new Promise(function (resolve, reject) { reject(channelAlreadyOpenError_1); });
            }
            // getters.dbRef should already have pathVariables swapped out
            var dbRef = getters.dbRef;
            // apply where filters and orderBy
            if (getters.collectionMode) {
                getters.getWhereArrays().forEach(function (whereParams) {
                    dbRef = dbRef.where.apply(dbRef, whereParams);
                });
                if (state._conf.sync.orderBy.length) {
                    dbRef = dbRef.orderBy.apply(dbRef, state._conf.sync.orderBy);
                }
            }
            // make a promise
            return new Promise(function (resolve, reject) {
                // log
                if (state._conf.logging) {
                    console.log("%c openDBChannel for Firestore PATH: " + getters.firestorePathComplete + " [" + state._conf.firestorePath + "]", 'color: lightcoral');
                }
                var unsubscribe = dbRef.onSnapshot(function (querySnapshot) { return __awaiter(_this, void 0, void 0, function () {
                    var source, id, doc;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                source = querySnapshot.metadata.hasPendingWrites ? 'local' : 'server';
                                if (!!getters.collectionMode) return [3 /*break*/, 3];
                                if (!!querySnapshot.data()) return [3 /*break*/, 2];
                                // No initial doc found in docMode
                                if (state._conf.sync.preventInitialDocInsertion)
                                    return [2 /*return*/, reject('preventInitialDocInsertion')];
                                if (state._conf.logging)
                                    console.log('[vuex-easy-firestore] inserting initial doc');
                                return [4 /*yield*/, dispatch('insertInitialDoc')];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, resolve()];
                            case 2:
                                if (source === 'local' && !first)
                                    return [2 /*return*/, resolve()];
                                id = getters.docModeId;
                                doc = getters.cleanUpRetrievedDoc(querySnapshot.data(), id);
                                dispatch('applyHooksAndUpdateState', { change: 'modified', id: id, doc: doc });
                                first = false;
                                return [2 /*return*/, resolve()];
                            case 3:
                                // 'collection' mode:
                                querySnapshot.docChanges().forEach(function (change) {
                                    var changeType = change.type;
                                    // Don't do anything for local modifications & removals
                                    if (source === 'local' && !first)
                                        return resolve();
                                    var id = change.doc.id;
                                    var doc = getters.cleanUpRetrievedDoc(change.doc.data(), id);
                                    dispatch('applyHooksAndUpdateState', { change: changeType, id: id, doc: doc });
                                });
                                first = false;
                                return [2 /*return*/, resolve()];
                        }
                    });
                }); }, function (error) {
                    state._sync.patching = 'error';
                    return reject(error);
                });
                state._sync.unsubscribe[identifier] = unsubscribe;
            });
        },
        closeDBChannel: function (_a, _b) {
            var getters = _a.getters, state = _a.state, commit = _a.commit, dispatch = _a.dispatch;
            var _c = (_b === void 0 ? { clearModule: false } : _b).clearModule, clearModule = _c === void 0 ? false : _c;
            var identifier = createFetchIdentifier({
                where: state._conf.sync.where,
                orderBy: state._conf.sync.orderBy,
                pathVariables: state._sync.pathVariables
            });
            var unsubscribeDBChannel = state._sync.unsubscribe[identifier];
            if (isWhat.isFunction(unsubscribeDBChannel)) {
                unsubscribeDBChannel();
                state._sync.unsubscribe[identifier] = null;
            }
            if (clearModule) {
                commit('RESET_VUEX_EASY_FIRESTORE_STATE');
            }
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
            // check payload
            if (!doc)
                return;
            // check userId
            dispatch('setUserId');
            var newDoc = doc;
            if (!newDoc.id)
                newDoc.id = getters.dbRef.doc().id;
            // apply default values
            var newDocWithDefaults = setDefaultValues(newDoc, state._conf.sync.defaultValues);
            // define the store update
            function storeUpdateFn(_doc) {
                commit('INSERT_DOC', _doc);
                return dispatch('insertDoc', _doc);
            }
            // check for hooks
            if (state._conf.sync.insertHook) {
                state._conf.sync.insertHook(storeUpdateFn, newDocWithDefaults, store);
                return newDocWithDefaults.id;
            }
            storeUpdateFn(newDocWithDefaults);
            return newDocWithDefaults.id;
        },
        insertBatch: function (_a, docs) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            var store = this;
            // check payload
            if (!isWhat.isArray(docs) || !docs.length)
                return [];
            // check userId
            dispatch('setUserId');
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
            // check payload
            if (!doc)
                return;
            var id = (getters.collectionMode) ? getId(doc) : getters.docModeId;
            var value = (getters.collectionMode) ? getValueFromPayloadPiece(doc) : doc;
            if (!id && getters.collectionMode)
                return;
            // check userId
            dispatch('setUserId');
            // add id to value
            if (!value.id)
                value.id = id;
            // define the store update
            function storeUpdateFn(_val) {
                commit('PATCH_DOC', _val);
                return dispatch('patchDoc', { id: id, doc: copy(_val) });
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
            // check payload
            if (!doc)
                return [];
            if (!isWhat.isArray(ids) || !ids.length)
                return [];
            // check userId
            dispatch('setUserId');
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
            var store = this;
            // check payload
            if (!id)
                return;
            // check userId
            dispatch('setUserId');
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
            var store = this;
            // check payload
            if (!isWhat.isArray(ids) || !ids.length)
                return [];
            // check userId
            dispatch('setUserId');
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

/**
 * A function returning the getters object
 *
 * @export
 * @param {*} Firebase The Firebase dependency
 * @returns {AnyObject} the getters object
 */
function pluginGetters (Firebase) {
    return {
        firestorePathComplete: function (state, getters) {
            var path = state._conf.firestorePath;
            Object.keys(state._sync.pathVariables).forEach(function (key) {
                var pathPiece = state._sync.pathVariables[key];
                path = path.replace("{" + key + "}", "" + pathPiece);
            });
            var requireUser = path.includes('{userId}');
            if (requireUser) {
                var userId = state._sync.userId;
                if (getters.signedIn &&
                    isWhat.isString(userId) &&
                    userId !== '' &&
                    userId !== '{userId}') {
                    path = path.replace('{userId}', userId);
                }
            }
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
                ? Firebase.firestore().collection(path)
                : Firebase.firestore().doc(path);
        },
        storeRef: function (state, getters, rootState) {
            var path = (state._conf.statePropName)
                ? state._conf.moduleName + "/" + state._conf.statePropName
                : state._conf.moduleName;
            return createEasyAccess.getDeepRef(rootState, path);
        },
        collectionMode: function (state, getters, rootState) {
            return (state._conf.firestoreRefType.toLowerCase() === 'collection');
        },
        docModeId: function (state, getters) {
            return getters.firestorePathComplete.split('/').pop();
        },
        fillables: function (state) {
            var fillables = state._conf.sync.fillables;
            if (!fillables.length)
                return fillables;
            return fillables
                .concat(['updated_at', 'updated_by', 'id', 'created_at', 'created_by']);
        },
        guard: function (state) {
            return state._conf.sync.guard.concat(['_conf', '_sync']);
        },
        defaultValues: function (state, getters) {
            return merge(state._conf.sync.defaultValues, state._conf.serverChange.defaultValues // depreciated
            );
        },
        cleanUpRetrievedDoc: function (state, getters, rootState, rootGetters) {
            return function (doc, id) {
                var defaultValues = merge(getters.defaultValues, state._conf.serverChange.convertTimestamps);
                var cleanDoc = setDefaultValues(doc, defaultValues);
                cleanDoc.id = id;
                return cleanDoc;
            };
        },
        prepareForPatch: function (state, getters, rootState, rootGetters) {
            return function (ids, doc) {
                if (ids === void 0) { ids = []; }
                if (doc === void 0) { doc = {}; }
                // get relevant data from the storeRef
                var collectionMode = getters.collectionMode;
                if (!collectionMode)
                    ids.push(getters.docModeId);
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
                    patchData.updated_at = new Date();
                    patchData.updated_by = state._sync.userId;
                    // replace arrayUnion and arrayRemove
                    function checkFn(foundVal) {
                        if (isArrayHelper(foundVal)) {
                            return foundVal.getFirestoreFieldValue();
                        }
                        return foundVal;
                    }
                    patchData = findAndReplaceAnything.findAndReplaceIf(patchData, checkFn);
                    // clean up item
                    var cleanedPatchData = filter(patchData, getters.fillables, getters.guard);
                    var itemToUpdate = flatten(cleanedPatchData);
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
                patchData.updated_at = new Date();
                patchData.updated_by = state._sync.userId;
                // add fillable and guard defaults
                // clean up item
                var cleanedPatchData = filter(patchData, getters.fillables, getters.guard);
                // add id (required to get ref later at apiHelpers.ts)
                var id, cleanedPath;
                if (collectionMode) {
                    id = path.substring(0, path.indexOf('.'));
                    cleanedPath = path.substring(path.indexOf('.') + 1);
                }
                else {
                    id = getters.docModeId;
                    cleanedPath = path;
                }
                cleanedPatchData[cleanedPath] = Firebase.firestore.FieldValue.delete();
                cleanedPatchData.id = id;
                return _a = {}, _a[id] = cleanedPatchData, _a;
            };
        },
        prepareForInsert: function (state, getters, rootState, rootGetters) {
            return function (items) {
                if (items === void 0) { items = []; }
                // add fillable and guard defaults
                return items.reduce(function (carry, item) {
                    // set default fields
                    item.created_at = new Date();
                    item.created_by = state._sync.userId;
                    // clean up item
                    item = filter(item, getters.fillables, getters.guard);
                    carry.push(item);
                    return carry;
                }, []);
            };
        },
        prepareInitialDocForInsert: function (state, getters, rootState, rootGetters) {
            return function (doc) {
                // add fillable and guard defaults
                // set default fields
                doc.created_at = new Date();
                doc.created_by = state._sync.userId;
                doc.id = getters.docModeId;
                // clean up item
                doc = filter(doc, getters.fillables, getters.guard);
                return doc;
            };
        },
        getWhereArrays: function (state, getters) { return function (whereArrays) {
            if (!isWhat.isArray(whereArrays))
                whereArrays = state._conf.sync.where;
            if (Firebase.auth().currentUser) {
                state._sync.signedIn = true;
                state._sync.userId = Firebase.auth().currentUser.uid;
            }
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
        }; },
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
    var syncProps = ['where', 'orderBy', 'fillables', 'guard', 'defaultValues', 'insertHook', 'patchHook', 'deleteHook', 'insertBatchHook', 'patchBatchHook', 'deleteBatchHook'];
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
            ? config.sync[prop]
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
    // prepare state._conf
    var conf = copy(merge({ state: {}, mutations: {}, actions: {}, getters: {} }, defaultConfig, userConfig));
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
    // prepare rest of state
    var docContainer = {};
    if (conf.statePropName)
        docContainer[conf.statePropName] = {};
    var restOfState = merge(userState, docContainer);
    // if 'doc' mode, set merge initial state onto default values
    if (conf.firestoreRefType === 'doc') {
        var defaultValsInState = (conf.statePropName)
            ? restOfState[conf.statePropName]
            : restOfState;
        conf.sync.defaultValues = copy(merge(defaultValsInState, conf.sync.defaultValues));
    }
    return {
        namespaced: true,
        state: merge(pluginState(), restOfState, { _conf: conf }),
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
        preventInitialDocInsertion: false,
        FirebaseDependency: Firebase
    } : _a, _c = _b.logging, logging = _c === void 0 ? false : _c, _d = _b.preventInitialDocInsertion, preventInitialDocInsertion = _d === void 0 ? false : _d, _e = _b.FirebaseDependency, FirebaseDependency = _e === void 0 ? Firebase : _e;
    if (FirebaseDependency)
        setBaseFirebase(FirebaseDependency);
    return function (store) {
        // Get an array of config files
        if (!isWhat.isArray(easyFirestoreModule))
            easyFirestoreModule = [easyFirestoreModule];
        // Create a module for each config file
        easyFirestoreModule.forEach(function (config) {
            config.logging = logging;
            if (config.sync && config.sync.preventInitialDocInsertion === undefined) {
                config.sync.preventInitialDocInsertion = preventInitialDocInsertion;
            }
            var moduleName = createEasyAccess.getKeysFromPath(config.moduleName);
            store.registerModule(moduleName, iniModule(config, FirebaseDependency));
        });
    };
}

var config = {
    apiKey: 'AIzaSyDivMlXIuHqDFsTCCqBDTVL0h29xbltcL8',
    authDomain: 'tests-firestore.firebaseapp.com',
    databaseURL: 'https://tests-firestore.firebaseio.com',
    projectId: 'tests-firestore',
};
Firebase.initializeApp(config);
var firestore = Firebase.firestore();

var easyAccess = createEasyAccess__default({ vuexEasyFirestore: true });
var easyFirestores = vuexEasyFirestore([
    pokemonBox,
    mainCharacter,
    pokemonBoxVEA,
    mainCharacterVEA,
    testPathVar,
    testMutations1,
    testMutations2,
    testNestedFillables,
    testNestedGuard,
    initialDoc,
    preventInitialDoc,
    serverHooks,
    user,
    defaultValuesSetupColNOProp,
    defaultValuesSetupColProp,
    defaultValuesSetupDocNOProp,
    defaultValuesSetupDocProp,
    multipleOpenDBChannels,
    docModeWithPathVar
], { logging: false, FirebaseDependency: Firebase });
var storeObj = {
    plugins: [easyFirestores, easyAccess]
};

Vue.use(Vuex);
var store = new Vuex.Store(storeObj);

var stores = /*#__PURE__*/Object.freeze({
  store: store
});

// import './firestore'

module.exports = stores;

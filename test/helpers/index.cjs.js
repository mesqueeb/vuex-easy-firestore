'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var app$1 = require('firebase/app');
var vue = require('vue');
var vuex = require('vuex');
var createEasyAccess = require('vuex-easy-access');
var createEasyAccess__default = _interopDefault(createEasyAccess);
var auth = require('firebase/auth');
var isWhat = require('is-what');
var copy = _interopDefault(require('copy-anything'));
var mergeAnything = require('merge-anything');
var flatten = require('flatten-anything');
var flatten__default = _interopDefault(flatten);
var pathToProp = _interopDefault(require('path-to-prop'));
var firestore = require('firebase/firestore');
var compareAnything = require('compare-anything');
var findAndReplaceAnything = require('find-and-replace-anything');
var filter = _interopDefault(require('filter-anything'));

var config = {
    apiKey: 'AIzaSyDivMlXIuHqDFsTCCqBDTVL0h29xbltcL8',
    authDomain: 'tests-firestore.firebaseapp.com',
    databaseURL: 'https://tests-firestore.firebaseio.com',
    projectId: 'tests-firestore',
};
var firebaseApp = app$1.initializeApp(config);

function initialState() {
    return {
        playerName: 'Satoshi',
        pokemon: {},
        stats: {
            pokemonCount: 0,
            freedCount: 0,
        },
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
            'nestedDefaultVal',
        ],
        guard: ['guarded'],
        defaultValues: {
            defaultVal: true,
            nestedDefaultVal: {
                types: 'moon',
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
        },
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
        stepCounter: 0,
    };
}
var mainCharacter = {
    // easy firestore config
    firestorePath: 'playerCharacters/Satoshi',
    firestoreRefType: 'doc',
    moduleName: 'mainCharacter',
    statePropName: null,
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
        },
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
            'nestedDefaultVal',
        ],
        guard: ['guarded'],
        defaultValues: {
            defaultVal: true,
            nestedDefaultVal: {
                types: 'moon',
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
        },
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
    statePropName: null,
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
        items: [],
    };
}
var testPathVar = {
    // easy firestore config
    firestorePath: 'coll/{name}',
    firestoreRefType: 'doc',
    moduleName: 'testPathVar',
    statePropName: null,
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
        items: [],
    };
}
var testPathVar2 = {
    // easy firestore config
    firestorePath: 'testPathVar2/{name}',
    firestoreRefType: 'doc',
    moduleName: 'testPathVar2',
    statePropName: null,
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
        items: [],
    };
}
var testMutations1 = {
    // easy firestore config
    firestorePath: 'coll/{name}',
    firestoreRefType: 'doc',
    moduleName: 'testMutationsNoStateProp',
    statePropName: null,
    // module
    state: initialState$6(),
    mutations: createEasyAccess.defaultMutations(initialState$6()),
    actions: {},
    getters: {},
};

function initialState$7() {
    return {
        name: 'Satoshi',
        pokemonBelt: [],
        items: [],
    };
}
var testMutations2 = {
    // easy firestore config
    firestorePath: 'coll/{name}',
    firestoreRefType: 'collection',
    moduleName: 'testMutationsWithStateProp',
    statePropName: 'putItHere',
    // module
    state: initialState$7(),
    mutations: createEasyAccess.defaultMutations(initialState$7()),
    actions: {},
    getters: {},
};

function initialState$8() {
    return {
        nested: {
            fillables: {
                yes: 0,
                no: 0,
            },
        },
    };
}
var testNestedFillables = {
    // easy firestore config
    firestorePath: 'configTests/nestedFillables',
    firestoreRefType: 'doc',
    moduleName: 'nestedFillables',
    statePropName: null,
    sync: {
        fillables: ['nested.fillables.yes'],
    },
    // module
    state: initialState$8(),
    mutations: createEasyAccess.defaultMutations(initialState$8()),
    actions: {},
    getters: {},
};

function initialState$9() {
    return {
        nested: {
            guard: true,
        },
    };
}
var testNestedGuard = {
    // easy firestore config
    firestorePath: 'configTests/nestedGuard',
    firestoreRefType: 'doc',
    moduleName: 'nestedGuard',
    statePropName: null,
    sync: {
        guard: ['nested.guard'],
    },
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
var initialDoc = {
    // easy firestore config
    firestorePath: 'docs/{randomId}',
    firestoreRefType: 'doc',
    moduleName: 'initialDoc',
    statePropName: null,
    // module
    state: initialState$a(),
    mutations: createEasyAccess.defaultMutations(initialState$a()),
    actions: {},
    getters: {},
};

function initialState$b() {
    return {
        iniProp: true,
    };
}
var preventInitialDoc = {
    // easy firestore config
    firestorePath: 'docs/{randomId}',
    firestoreRefType: 'doc',
    moduleName: 'preventInitialDoc',
    statePropName: null,
    sync: {
        preventInitialDocInsertion: true,
    },
    // module
    state: initialState$b(),
    mutations: createEasyAccess.defaultMutations(initialState$b()),
    actions: {},
    getters: {},
};

function initialState$c() {
    return {
        iniProp: true,
        defaultPropsNotToBeDeleted: true,
    };
}
var serverHooks = {
    // easy firestore config
    firestorePath: 'configTests/serverHooks',
    firestoreRefType: 'doc',
    moduleName: 'serverHooks',
    statePropName: null,
    // module
    state: initialState$c(),
    mutations: createEasyAccess.defaultMutations(initialState$c()),
    actions: {},
    getters: {},
    sync: {
        guard: ['created_by', 'created_at', 'updated_by', 'updated_at'],
    },
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var user = {
    firestorePath: 'user/{userId}',
    firestoreRefType: 'doc',
    moduleName: 'user',
    statePropName: null,
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
                            return [4 /*yield*/, auth.signInWithEmailAndPassword(auth.getAuth(firebaseApp), userEmail, 'test1234')];
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
                        case 0: return [4 /*yield*/, auth.getAuth(firebaseApp).signOut()];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
    },
    // module
    state: {},
    mutations: {},
    getters: {},
};

function initialState$d() {
    return {
        defaultVal1: true,
        nestedDefaultVal: {
            type1: 'sun',
        },
    };
}
var defaultValuesSetupColNOProp = {
    // easy firestore config
    firestorePath: 'configTests/defaultValuesSetupColNOProp',
    firestoreRefType: 'collection',
    moduleName: 'defaultValuesSetupColNOProp',
    statePropName: null,
    sync: {
        defaultValues: {
            defaultVal: true,
            nestedDefaultVal: {
                type: 'moon',
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
        NOT: false,
        prop: {
            defaultVal1: true,
            nestedDefaultVal: {
                type1: 'sun',
            },
        },
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
                type: 'moon',
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
        defaultVal1: true,
        nestedDefaultVal: {
            type1: 'sun',
        },
    };
}
var defaultValuesSetupDocNOProp = {
    // easy firestore config
    firestorePath: 'configTests/defaultValuesSetupDocNOProp',
    firestoreRefType: 'doc',
    moduleName: 'defaultValuesSetupDocNOProp',
    statePropName: null,
    sync: {
        defaultValues: {
            defaultVal2: true,
            nestedDefaultVal: {
                type2: 'moon',
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
    return {
        NOT: false,
        prop: {
            defaultVal1: true,
            nestedDefaultVal: {
                type1: 'sun',
            },
        },
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
                type2: 'moon',
            },
        },
    },
    // module
    state: initialState$g(),
    mutations: createEasyAccess.defaultMutations(initialState$g()),
    actions: {},
    getters: {},
};

function initialState$h() {
    return {};
}
var multipleOpenDBChannels = {
    // easy firestore config
    firestorePath: 'coll/{name}/data',
    firestoreRefType: 'collection',
    moduleName: 'multipleOpenDBChannels',
    statePropName: null,
    // module
    state: initialState$h(),
    mutations: createEasyAccess.defaultMutations(initialState$h()),
    actions: {},
    getters: {},
};

function initialState$i() {
    return {};
}
var docModeWithPathVar = {
    // easy firestore config
    firestorePath: 'playerCharacters/{name}',
    firestoreRefType: 'doc',
    moduleName: 'docModeWithPathVar',
    statePropName: null,
    // module
    state: initialState$i(),
    mutations: createEasyAccess.defaultMutations(initialState$i()),
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
    statePropName: null,
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
        insertHook: function (updateStore, doc, store) {
            return updateStore(doc);
        },
        patchHook: function (updateStore, doc, store) {
            return updateStore(doc);
        },
        deleteHook: function (updateStore, id, store) {
            return updateStore(id);
        },
        // HOOKS after local changes before sync:
        insertHookBeforeSync: function (updateFirestore, doc, store) {
            return updateFirestore(doc);
        },
        patchHookBeforeSync: function (updateFirestore, doc, store) {
            return updateFirestore(doc);
        },
        deleteHookBeforeSync: function (updateFirestore, id, store) {
            return updateFirestore(id);
        },
        // HOOKS for local batch changes:
        insertBatchHook: function (updateStore, docs, store) {
            return updateStore(docs);
        },
        patchBatchHook: function (updateStore, doc, ids, store) {
            return updateStore(doc, ids);
        },
        deleteBatchHook: function (updateStore, ids, store) {
            return updateStore(ids);
        },
    },
    // When items on the server side are changed:
    serverChange: {
        defaultValues: {},
        convertTimestamps: {},
        // HOOKS for changes on SERVER:
        addedHook: function (updateStore, doc, id, store) {
            return updateStore(doc);
        },
        modifiedHook: function (updateStore, doc, id, store) {
            return updateStore(doc);
        },
        removedHook: function (updateStore, doc, id, store) {
            return updateStore(doc);
        },
    },
    // When items are fetched through `dispatch('module/fetch', {clauses})`.
    fetch: {
        // The max amount of documents to be fetched. Defaults to 50.
        docLimit: 50,
    },
};

/**
 * a function returning the state object with ONLY the ._sync prop
 *
 * @export
 * @returns {IState} the state object
 */
function pluginState () {
    return {
        _sync: {
            signedIn: false,
            userId: null,
            streaming: {},
            unsubscribe: {},
            pathVariables: {},
            patching: false,
            syncStack: {
                inserts: [],
                updates: {},
                propDeletions: {},
                deletions: [],
                debounceTimer: null,
                resolves: [],
                rejects: [],
            },
            fetched: {},
            stopPatchingTimeout: null,
        },
    };
}

var errorMessages = {
    'user-auth': "\n    Error trying to set userId.\n    Please double check if you have correctly authenticated the user with firebase Auth before calling `openDBChannel` or `fetchAndAdd`.\n\n    If you still get this error, try passing your firebase instance to the plugin as described in the documentation:\n    https://mesqueeb.github.io/vuex-easy-firestore/extra-features.html#pass-firebase-dependency\n  ",
    'delete-missing-id': "\n    Missing id of the doc you want to delete!\n    Correct usage:\n      dispatch('delete', id)\n  ",
    'delete-missing-path': "\n    Missing path to the prop you want to delete!\n    Correct usage:\n      dispatch('delete', 'path.to.prop')\n\n    Use `.` for sub props!\n  ",
    'missing-id': "\n    This action requires an id to be passed!\n  ",
    'patch-missing-id': "\n    Missing an id of the doc you want to patch!\n    Correct usage:\n\n    // pass `id` as a prop:\n    dispatch('module/set', {id: '123', name: 'best item name'})\n    // or\n    dispatch('module/patch', {id: '123', name: 'best item name'})\n  ",
    'missing-path-variables': "\n    A path variable was passed without defining it!\n    In VuexEasyFirestore you can create paths with variables:\n    eg: `groups/{groupId}/user/{userId}`\n\n    `userId` is automatically replaced with the userId of the firebase user.\n    `groupId` or any other variable that needs to be set after authentication needs to be passed upon the `openDBChannel` action.\n\n    // (in module config) Example path:\n    firestorePath: 'groups/{groupId}/user/{userId}'\n\n    // Then before openDBChannel:\n    // retrieve the value\n    const groupId = someIdRetrievedAfterSignin\n    // pass as argument into openDBChannel:\n    dispatch('moduleName/openDBChannel', {groupId})\n  ",
    'patch-no-ref': "\n    Something went wrong during the PATCH mutation:\n    The document it's trying to patch does not exist.\n  ",
    'only-in-collection-mode': "\n    The action you dispatched can only be used in 'collection' mode.\n  ",
    'initial-doc-failed': "\n    Initial doc insertion failed. Further `set` or `patch` actions will also fail. Requires an internet connection when the initial doc is inserted. Check the error returned by firebase:\n  ",
    'sync-error': "\n    Something went wrong while trying to synchronise data to Cloud Firestore.\n    The data is kept in queue, so that it will try to sync again upon the next 'set' or 'patch' action.\n  ",
};
/**
 * execute Error() based on an error id string
 *
 * @export
 * @param {string} errorId the error id
 * @param {any} [error] an actual error from an async request or something
 * @returns {string} the error id
 */
function error (errorId, error) {
    var logData = errorMessages[errorId] || errorId;
    console.error("[vuex-easy-firestore] Error! " + logData);
    if (error)
        console.error(error);
    return errorId;
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol$1 = root.Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$4.call(value, 'callee') &&
    !propertyIsEnumerable$1.call(value, 'callee');
};

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag$1 = '[object Map]',
    numberTag$1 = '[object Number]',
    objectTag = '[object Object]',
    regexpTag$1 = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag$1 = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] =
typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag$1] =
typedArrayTags[setTag$1] = typedArrayTags[stringTag$1] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$5.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

  return value === proto;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$9.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$6.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$a.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$7.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

/* Built-in method references that are verified to be native. */
var Promise$1 = getNative(root, 'Promise');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$2 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise$1),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (Map && getTag(new Map) != mapTag$2) ||
    (Promise$1 && getTag(Promise$1.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag$2) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var getTag$1 = getTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    objectTag$2 = '[object Object]';

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$b.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag$1 : getTag$1(object),
      othTag = othIsArr ? arrayTag$1 : getTag$1(other);

  objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

  var objIsObj = objTag == objectTag$2,
      othIsObj = othTag == objectTag$2,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$8.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$8.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
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
            var index = isWhat.isAnyObject(item)
                ? array.findIndex(function (_item) { return isEqual(_item, item); })
                : array.indexOf(item);
            if (index === -1) {
                array.push(item);
            }
        });
        return array;
    };
    ArrayUnion.prototype.getFirestoreFieldValue = function () {
        return firestore.arrayUnion.apply(void 0, this.payload);
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
            var index = isWhat.isAnyObject(item)
                ? array.findIndex(function (_item) { return isEqual(_item, item); })
                : array.indexOf(item);
            if (index > -1) {
                array.splice(index, 1);
            }
        });
        return array;
    };
    ArrayRemove.prototype.getFirestoreFieldValue = function () {
        return firestore.arrayRemove.apply(void 0, this.payload);
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

function isIncrementHelper(payload) {
    // return payload instanceof Increment
    return (isWhat.isAnyObject(payload) &&
        !isWhat.isPlainObject(payload) &&
        // @ts-ignore
        payload.isIncrementHelper === true);
}

function convertHelpers(originVal, newVal) {
    if (isWhat.isArray(originVal) && isArrayHelper(newVal)) {
        newVal = newVal.executeOn(originVal);
    }
    if (isWhat.isNumber(originVal) && isIncrementHelper(newVal)) {
        newVal = newVal.executeOn(originVal);
    }
    return newVal; // always return newVal as fallback!!
}
/**
 * Creates the params needed to $set a target based on a nested.path
 *
 * @param {object} target
 * @param {string} path
 * @param {*} value
 * @returns {[object, string, any]}
 */
function getSetParams(target, path, value) {
    var _a;
    var pathParts = path.split('.');
    var prop = pathParts.pop();
    var pathParent = pathParts.join('.');
    var objectToSetPropTo = pathToProp(target, pathParent);
    if (!isWhat.isPlainObject(objectToSetPropTo)) {
        // the target doesn't have an object ready at this level to set the value to
        // so we need to step down a level and try again
        return getSetParams(target, pathParent, (_a = {}, _a[prop] = value, _a));
    }
    var valueToSet = value;
    return [objectToSetPropTo, prop, valueToSet];
}
/**
 * a function returning the mutations object
 *
 * @export
 * @param {object} userState
 * @returns {AnyObject} the mutations object
 */
function pluginMutations (userState) {
    var initialUserState = copy(userState);
    return {
        SET_PATHVARS: function (state, pathVars) {
            Object.keys(pathVars).forEach(function (key) {
                var pathPiece = pathVars[key];
                state._sync.pathVariables[key] = pathPiece;
            });
        },
        SET_SYNCCLAUSES: function (state, _a) {
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
            var _sync = pluginState()._sync;
            var newState = mergeAnything.merge(initialUserState, { _sync: _sync });
            var statePropName = state._conf.statePropName;
            var docContainer = statePropName ? state[statePropName] : state;
            Object.keys(newState).forEach(function (key) {
                state[key] = newState[key];
            });
            Object.keys(docContainer).forEach(function (key) {
                if (Object.keys(newState).includes(key))
                    return;
                delete docContainer[key];
            });
        },
        resetSyncStack: function (state) {
            var _sync = pluginState()._sync;
            var syncStack = _sync.syncStack;
            state._sync.syncStack = syncStack;
        },
        INSERT_DOC: function (state, doc) {
            if (state._conf.firestoreRefType.toLowerCase() !== 'collection')
                return;
            if (state._conf.statePropName) {
                state[state._conf.statePropName][doc.id] = doc;
            }
            else {
                state[doc.id] = doc;
            }
        },
        PATCH_DOC: function (state, patches) {
            // Get the state prop ref
            var ref = state._conf.statePropName ? state[state._conf.statePropName] : state;
            if (state._conf.firestoreRefType.toLowerCase() === 'collection') {
                ref = ref[patches.id];
            }
            if (!ref)
                return error('patch-no-ref');
            var patchesFlat = flatten.flattenObject(patches);
            for (var _i = 0, _a = Object.entries(patchesFlat); _i < _a.length; _i++) {
                var _b = _a[_i], path = _b[0], value = _b[1];
                var targetVal = pathToProp(ref, path);
                var newVal = convertHelpers(targetVal, value);
                // do not update anything if the values are the same
                // this is technically not required, because vue takes care of this as well:
                if (targetVal === newVal)
                    continue;
                // update just the nested value
                var setParams = getSetParams(ref, path, newVal);
                setParams[0][setParams[1]] = setParams[2];
            }
        },
        DELETE_DOC: function (state, id) {
            if (state._conf.firestoreRefType.toLowerCase() !== 'collection')
                return;
            if (state._conf.statePropName) {
                delete state[state._conf.statePropName][id];
            }
            else {
                delete state[id];
            }
            return state;
        },
        DELETE_PROP: function (state, path) {
            var searchTarget = state._conf.statePropName ? state[state._conf.statePropName] : state;
            var propArr = path.split('.');
            var target = propArr.pop();
            if (!propArr.length) {
                delete searchTarget[target];
                return searchTarget;
            }
            var ref = createEasyAccess.getDeepRef(searchTarget, propArr.join('.'));
            delete ref[target];
            return ref;
        },
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
        if (isWhat.isAnyObject(targetVal) &&
            !isWhat.isPlainObject(targetVal) &&
            // @ts-ignore
            isWhat.isFunction(targetVal.toDate)) {
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
    if (!isWhat.isPlainObject(defaultValues)) {
        console.error('[vuex-easy-firestore] Trying to merge target:', obj, 'onto a non-object (defaultValues):', defaultValues);
    }
    if (!isWhat.isPlainObject(obj)) {
        console.error('[vuex-easy-firestore] Trying to merge a non-object:', obj, 'onto the defaultValues:', defaultValues);
    }
    var result = mergeAnything.merge({ extensions: [convertTimestamps] }, defaultValues, obj);
    return findAndReplaceAnything.findAndReplace(result, '%convertTimestamp%', null, {
        onlyPlainObjects: true,
    });
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
 * Grab until the api limit (500), put the rest back in the syncStack. State will get modified!
 *
 * @param {string} syncStackProp the prop of _sync.syncStack[syncStackProp]
 * @param {number} count the current count
 * @param {number} maxCount the max count of the batch
 * @param {object} state the store's state, will get modified!
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
            targetsLeft = Object.values(targetsLeft).reduce(function (carry, update) {
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
 * Create a firebase batch from a syncStack to be passed inside the state param.
 *
 * @export
 * @param {IPluginState} state The state will get modified!
 * @param {AnyObject} getters The getters which should have `dbRef`, `storeRef`, `collectionMode` and `firestorePathComplete`
 * @param {any} firebaseBatch a firestore.batch() instance
 * @param {number} [batchMaxCount=500] The max count of the batch. Defaults to 500 as per Firestore documentation.
 * @returns {*} A firebase firestore batch object.
 */
function makeBatchFromSyncstack(state, getters, firebaseBatch, batchMaxCount) {
    if (batchMaxCount === void 0) { batchMaxCount = 500; }
    // get state & getter variables
    var _a = state._conf, firestorePath = _a.firestorePath, logging = _a.logging;
    var guard = state._conf.sync.guard;
    var firestorePathComplete = getters.firestorePathComplete, dbRef = getters.dbRef, collectionMode = getters.collectionMode;
    var batch = firebaseBatch;
    // make batch
    var log = {};
    var count = 0;
    // Add 'updates' to batch
    var updates = grabUntilApiLimit('updates', count, batchMaxCount, state);
    log['updates: '] = updates;
    count = count + updates.length;
    // Add to batch
    updates.forEach(function (item) {
        var id = item.id;
        var docRef = collectionMode ? firestore.doc(dbRef, id) : dbRef;
        // replace arrayUnion and arrayRemove
        var patchData = Object.entries(item).reduce(function (carry, _a) {
            var key = _a[0], data = _a[1];
            // replace arrayUnion and arrayRemove
            carry[key] = findAndReplaceAnything.findAndReplaceIf(data, function (foundVal) {
                if (isArrayHelper(foundVal)) {
                    return foundVal.getFirestoreFieldValue();
                }
                if (isIncrementHelper(foundVal)) {
                    return foundVal.getFirestoreFieldValue();
                }
                return foundVal;
            });
            return carry;
        }, {});
        // delete id if it's guarded
        if (guard.includes('id'))
            delete item.id;
        // @ts-ignore
        batch.update(docRef, patchData);
    });
    // Add 'propDeletions' to batch
    var propDeletions = grabUntilApiLimit('propDeletions', count, batchMaxCount, state);
    log['prop deletions: '] = propDeletions;
    count = count + propDeletions.length;
    // Add to batch
    propDeletions.forEach(function (item) {
        var id = item.id;
        var docRef = collectionMode ? firestore.doc(dbRef, id) : dbRef;
        // delete id if it's guarded
        if (guard.includes('id'))
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
        var docRef = firestore.doc(dbRef, id);
        batch.delete(docRef);
    });
    // Add 'inserts' to batch
    var inserts = grabUntilApiLimit('inserts', count, batchMaxCount, state);
    log['inserts: '] = inserts;
    count = count + inserts.length;
    // Add to batch
    inserts.forEach(function (item) {
        var newRef = firestore.doc(dbRef, item.id);
        batch.set(newRef, item);
    });
    // log the batch contents
    if (logging) {
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
    return params
        .map(function (param) {
        if (isWhat.isAnyObject(param) && !isWhat.isPlainObject(param)) {
            // @ts-ignore
            return String(param.constructor.name) + String(param.id);
        }
        return String(param);
    })
        .join();
}
/**
 * Gets an object with {where, orderBy} clauses and returns a unique identifier for that
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
 * @param {*} firebase The firebase dependency
 * @returns {AnyObject} the actions object
 */
function pluginActions (firestoreConfig) {
    var _this = this;
    var firebaseApp = firestoreConfig.FirebaseDependency, enablePersistence = firestoreConfig.enablePersistence, synchronizeTabs = firestoreConfig.synchronizeTabs;
    var auth$1 = auth.getAuth(firebaseApp);
    return {
        setUserId: function (_a, userId) {
            var commit = _a.commit, getters = _a.getters;
            if (userId === undefined)
                userId = null;
            // undefined cannot be synced to firestore
            if (!userId && auth$1.currentUser) {
                userId = auth$1.currentUser.uid;
            }
            commit('SET_USER_ID', userId);
            if (getters.firestorePathComplete.includes('{userId}'))
                return error('user-auth');
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
                var doc, dId, idMap;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!getters.collectionMode)
                                return [2 /*return*/, error('only-in-collection-mode')];
                            if (!id)
                                return [2 /*return*/, {}];
                            doc = mergeAnything.merge(getters.storeRef[id], { id: null });
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
                return error('only-in-collection-mode');
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
            var _c = _b === void 0 ? {
                ids: [],
                doc: {},
            } : _b, _d = _c.id, id = _d === void 0 ? '' : _d, _e = _c.ids, ids = _e === void 0 ? [] : _e, doc = _c.doc;
            // 0. payload correction (only arrays)
            if (!isWhat.isArray(ids))
                return error("`ids` prop passed to 'patch' needs to be an array");
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
                state._sync.syncStack.inserts[newDocIndex] = mergeAnything.merge(newDoc, patchDoc);
                // empty out the id that was to be patched:
                ids.splice(indexIdInInsert, 1);
            });
            // 1. Prepare for patching
            var syncStackItems = getters.prepareForPatch(ids, doc);
            // 2. Push to syncStack
            Object.entries(syncStackItems).forEach(function (_a) {
                var id = _a[0], patchData = _a[1];
                var newVal;
                if (!state._sync.syncStack.updates[id]) {
                    newVal = patchData;
                }
                else {
                    newVal = mergeAnything.merge(
                    // extension to update increment and array helpers
                    {
                        extensions: [
                            function (originVal, newVal) {
                                if (isArrayHelper(originVal)) {
                                    originVal.payload = originVal.payload.concat(newVal.payload);
                                    newVal = originVal;
                                }
                                if (isIncrementHelper(originVal)) {
                                    originVal.payload = originVal.payload + newVal.payload;
                                    newVal = originVal;
                                }
                                return newVal; // always return newVal as fallback!!
                            },
                        ],
                    }, state._sync.syncStack.updates[id], patchData);
                }
                state._sync.syncStack.updates[id] = newVal;
            });
            // 3. Create or refresh debounce & pass id to resolve
            return dispatch('handleSyncStackDebounce', id || ids);
        },
        deleteDoc: function (_a, payload) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            if (payload === void 0) { payload = []; }
            // 0. payload correction (only arrays)
            var ids = !isWhat.isArray(payload) ? [payload] : payload;
            // 1. Prepare for patching
            // 2. Push to syncStack
            var deletions = state._sync.syncStack.deletions.concat(ids);
            state._sync.syncStack.deletions = deletions;
            if (!state._sync.syncStack.deletions.length)
                return;
            // 3. Create or refresh debounce & pass id to resolve
            return dispatch('handleSyncStackDebounce', payload);
        },
        deleteProp: function (_a, path) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            // 1. Prepare for patching
            var syncStackItem = getters.prepareForPropDeletion(path);
            // 2. Push to syncStack
            Object.keys(syncStackItem).forEach(function (id) {
                var newVal = !state._sync.syncStack.propDeletions[id]
                    ? syncStackItem[id]
                    : mergeAnything.merge(state._sync.syncStack.propDeletions[id], syncStackItem[id]);
                state._sync.syncStack.propDeletions[id] = newVal;
            });
            // 3. Create or refresh debounce & pass id to resolve
            return dispatch('handleSyncStackDebounce', path);
        },
        insertDoc: function (_a, payload) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            if (payload === void 0) { payload = []; }
            // 0. payload correction (only arrays)
            var docs = !isWhat.isArray(payload) ? [payload] : payload;
            // 1. Prepare for patching
            var syncStack = getters.prepareForInsert(docs);
            // 2. Push to syncStack
            var inserts = state._sync.syncStack.inserts.concat(syncStack);
            state._sync.syncStack.inserts = inserts;
            // 3. Create or refresh debounce & pass id to resolve
            var payloadToResolve = isWhat.isArray(payload) ? payload.map(function (doc) { return doc.id; }) : payload.id;
            return dispatch('handleSyncStackDebounce', payloadToResolve);
        },
        insertInitialDoc: function (_a) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            // 0. only docMode
            if (getters.collectionMode)
                return;
            // 1. Prepare for insert
            var initialDoc = getters.storeRef ? getters.storeRef : {};
            var initialDocPrepared = getters.prepareInitialDocForInsert(initialDoc);
            // 2. Create a reference to the SF doc.
            return new Promise(function (resolve, reject) {
                firestore.setDoc(getters.dbRef, initialDocPrepared)
                    .then(function () {
                    if (state._conf.logging) {
                        var message = 'Initial doc succesfully inserted';
                        console.log("%c [vuex-easy-firestore] " + message + "; for Firestore PATH: " + getters.firestorePathComplete + " [" + state._conf.firestorePath + "]", 'color: SeaGreen');
                    }
                    resolve(true);
                })
                    .catch(function (error$1) {
                    error('initial-doc-failed', error$1);
                    reject(error$1);
                });
            });
        },
        handleSyncStackDebounce: function (_a, payloadToResolve) {
            var state = _a.state, commit = _a.commit, dispatch = _a.dispatch, getters = _a.getters;
            return new Promise(function (resolve, reject) {
                state._sync.syncStack.resolves.push(function () { return resolve(payloadToResolve); });
                state._sync.syncStack.rejects.push(reject);
                if (!getters.signedIn)
                    return false;
                if (!state._sync.syncStack.debounceTimer) {
                    var ms = state._conf.sync.debounceTimerMs;
                    var debounceTimer = startDebounce(ms);
                    state._sync.syncStack.debounceTimer = debounceTimer;
                    debounceTimer.done.then(function () {
                        dispatch('batchSync')
                            .then(function () { return dispatch('resolveSyncStack'); })
                            .catch(function (e) { return dispatch('rejectSyncStack', e); });
                    });
                }
                state._sync.syncStack.debounceTimer.refresh();
            });
        },
        resolveSyncStack: function (_a) {
            var state = _a.state;
            state._sync.syncStack.rejects = [];
            state._sync.syncStack.resolves.forEach(function (r) { return r(); });
        },
        rejectSyncStack: function (_a, error) {
            var state = _a.state;
            state._sync.syncStack.resolves = [];
            state._sync.syncStack.rejects.forEach(function (r) { return r(error); });
        },
        batchSync: function (_a) {
            var getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch, state = _a.state;
            var batch = makeBatchFromSyncstack(state, getters, firestore.writeBatch(firestore.getFirestore(firebaseApp)));
            dispatch('_startPatching');
            state._sync.syncStack.debounceTimer = null;
            return new Promise(function (resolve, reject) {
                batch
                    .commit()
                    .then(function (_) {
                    var remainingSyncStack = Object.keys(state._sync.syncStack.updates).length +
                        state._sync.syncStack.deletions.length +
                        state._sync.syncStack.inserts.length +
                        state._sync.syncStack.propDeletions.length;
                    if (remainingSyncStack) {
                        dispatch('batchSync');
                    }
                    dispatch('_stopPatching');
                    return resolve(true);
                })
                    .catch(function (error$1) {
                    state._sync.patching = 'error';
                    state._sync.syncStack.debounceTimer = null;
                    error('sync-error', error$1);
                    return reject(error$1);
                });
            });
        },
        fetch: function (_a, parameters) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            if (parameters === void 0) { parameters = { clauses: {}, pathVariables: {} }; }
            if (!isWhat.isPlainObject(parameters))
                parameters = {};
            /* COMPATIBILITY START
             * this ensures backward compatibility for people who passed pathVariables and
             * clauses directly at the root of the `parameters` object. Can be removed in
             * a later version
             */
            if (!parameters.clauses && !parameters.pathVariables) {
                var pathVariables_1 = Object.assign({}, parameters);
                // @ts-ignore
                delete pathVariables_1.where;
                // @ts-ignore
                delete pathVariables_1.orderBy;
                Object.entries(pathVariables_1).forEach(function (entry) {
                    if (typeof entry[1] === 'object') {
                        delete pathVariables_1[entry[0]];
                    }
                });
                parameters = Object.assign({}, { clauses: parameters, pathVariables: pathVariables_1 });
            }
            var defaultParameters = {
                clauses: {},
                pathVariables: {},
                includeMetadataChanges: false,
            };
            parameters = Object.assign(defaultParameters, parameters);
            /* COMPATIBILITY END */
            if (!getters.collectionMode)
                return error('only-in-collection-mode');
            dispatch('setUserId');
            var _b = parameters.clauses, where = _b.where, whereFilters = _b.whereFilters, orderBy = _b.orderBy;
            if (!isWhat.isArray(where))
                where = [];
            if (!isWhat.isArray(orderBy))
                orderBy = [];
            if (isWhat.isArray(whereFilters) && whereFilters.length)
                where = whereFilters; // deprecated
            commit('SET_PATHVARS', parameters.pathVariables);
            return new Promise(function (resolve, reject) {
                // log
                if (state._conf.logging) {
                    console.log("%c fetch for Firestore PATH: " + getters.firestorePathComplete + " [" + state._conf.firestorePath + "]", 'color: goldenrod');
                }
                if (!getters.signedIn)
                    return resolve(true);
                var identifier = createFetchIdentifier({
                    where: where,
                    orderBy: orderBy,
                    pathVariables: state._sync.pathVariables,
                });
                var fetched = state._sync.fetched[identifier];
                // We've never fetched this before:
                if (!fetched) {
                    var ref = getters.dbRef;
                    var query_1 = [];
                    // apply where clauses and orderBy
                    getters.getWhereArrays(where).forEach(function (paramsArr) {
                        query_1.push(firestore.where(paramsArr[0], paramsArr[1], paramsArr[2]));
                    });
                    if (orderBy.length)
                        query_1.push(firestore.orderBy(orderBy));
                    state._sync.fetched[identifier] = {
                        ref: firestore.query.apply(void 0, __spreadArrays([ref], query_1)),
                        done: false,
                        retrievedFetchRefs: [],
                        nextFetchRef: null,
                    };
                }
                var fRequest = state._sync.fetched[identifier];
                // We're already done fetching everything:
                if (fRequest.done) {
                    if (state._conf.logging)
                        console.log('[vuex-easy-firestore] done fetching');
                    return resolve({ done: true });
                }
                // attach fetch clauses
                var fRef = state._sync.fetched[identifier].ref;
                if (fRequest.nextFetchRef) {
                    // get next ref if saved in state
                    fRef = state._sync.fetched[identifier].nextFetchRef;
                }
                // add doc limit
                var limit = isWhat.isNumber(parameters.clauses.limit)
                    ? parameters.clauses.limit
                    : state._conf.fetch.docLimit;
                if (limit > 0)
                    fRef = firestore.query(fRef, firestore.limit(limit));
                // Stop if all records already fetched
                if (fRequest.retrievedFetchRefs.includes(fRef)) {
                    console.log('[vuex-easy-firestore] Already retrieved this part.');
                    return resolve(true);
                }
                // make fetch request
                fRef
                    .then(function (querySnapshot) {
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
                })
                    .catch(function (error$1) {
                    return reject(error(error$1));
                });
            });
        },
        // where: [['archived', '==', true]]
        // orderBy: ['done_date', 'desc']
        fetchAndAdd: function (_a, parameters) {
            var _this = this;
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            if (parameters === void 0) { parameters = { clauses: {}, pathVariables: {} }; }
            if (!isWhat.isPlainObject(parameters))
                parameters = {};
            /* COMPATIBILITY START
             * this ensures backward compatibility for people who passed pathVariables and
             * clauses directly at the root of the `parameters` object. Can be removed in
             * a later version
             */
            if (!parameters.clauses && !parameters.pathVariables) {
                var pathVariables_2 = Object.assign({}, parameters);
                // @ts-ignore
                delete pathVariables_2.where;
                // @ts-ignore
                delete pathVariables_2.orderBy;
                Object.entries(pathVariables_2).forEach(function (entry) {
                    if (typeof entry[1] === 'object') {
                        delete pathVariables_2[entry[0]];
                    }
                });
                parameters = Object.assign({}, { clauses: parameters, pathVariables: pathVariables_2 });
            }
            var defaultParameters = {
                clauses: {},
                pathVariables: {},
                includeMetadataChanges: false,
            };
            parameters = Object.assign(defaultParameters, parameters);
            /* COMPATIBILITY END */
            commit('SET_PATHVARS', parameters.pathVariables);
            // 'doc' mode:
            if (!getters.collectionMode) {
                dispatch('setUserId');
                if (state._conf.logging) {
                    console.log("%c fetch for Firestore PATH: " + getters.firestorePathComplete + " [" + state._conf.firestorePath + "]", 'color: goldenrod');
                }
                return firestore.getDoc(getters.dbRef)
                    .then(function (_doc) { return __awaiter(_this, void 0, void 0, function () {
                    var message, id, doc;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!!_doc.exists()) return [3 /*break*/, 2];
                                // No initial doc found in docMode
                                if (state._conf.sync.preventInitialDocInsertion)
                                    throw 'preventInitialDocInsertion';
                                if (state._conf.logging) {
                                    message = 'inserting initial doc';
                                    console.log("%c [vuex-easy-firestore] " + message + "; for Firestore PATH: " + getters.firestorePathComplete + " [" + state._conf.firestorePath + "]", 'color: MediumSeaGreen');
                                }
                                return [4 /*yield*/, dispatch('insertInitialDoc')
                                    // an error in await here is (somehow) caught in the catch down below
                                ];
                            case 1:
                                _a.sent();
                                // an error in await here is (somehow) caught in the catch down below
                                return [2 /*return*/, _doc];
                            case 2:
                                id = getters.docModeId;
                                doc = getters.cleanUpRetrievedDoc(_doc.data(), id);
                                dispatch('applyHooksAndUpdateState', {
                                    change: 'modified',
                                    id: id,
                                    doc: doc,
                                });
                                return [2 /*return*/, doc];
                        }
                    });
                }); })
                    .catch(function (error$1) {
                    error(error$1);
                    throw error$1;
                });
            }
            // 'collection' mode:
            return dispatch('fetch', parameters).then(function (querySnapshot) {
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
        fetchById: function (_a, id) {
            var dispatch = _a.dispatch, getters = _a.getters, state = _a.state;
            return __awaiter(this, void 0, void 0, function () {
                var ref, _doc, doc, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            if (!id)
                                throw 'missing-id';
                            if (!getters.collectionMode)
                                throw 'only-in-collection-mode';
                            ref = getters.dbRef;
                            return [4 /*yield*/, firestore.getDoc(ref)];
                        case 1:
                            _doc = _b.sent();
                            if (!_doc.exists()) {
                                if (state._conf.logging) {
                                    throw "Doc with id \"" + id + "\" not found!";
                                }
                            }
                            doc = getters.cleanUpRetrievedDoc(_doc.data(), id);
                            dispatch('applyHooksAndUpdateState', { change: 'added', id: id, doc: doc });
                            return [2 /*return*/, doc];
                        case 2:
                            e_1 = _b.sent();
                            error(e_1);
                            throw e_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        applyHooksAndUpdateState: function (
        // this is only on server retrievals
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
            var searchTarget = getters.collectionMode ? getters.storeRef[doc.id] : getters.storeRef;
            var compareInfo = compareAnything.compareObjectProps(flatten__default(doc), // presentIn 0
            flatten__default(defaultValues), // presentIn 1
            flatten__default(searchTarget) // presentIn 2
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
                var propNotInDoc = !presence.includes(0);
                var propNotInDefaultValues = !presence.includes(1);
                // delete props that are not present in the doc and default values
                if (propNotInDoc && propNotInDefaultValues) {
                    var path = getters.collectionMode ? doc.id + "." + prop : prop;
                    return commit('DELETE_PROP', path);
                }
            });
        },
        /* IMPORTANT NOTE: a `documentSnapshot`'s `fromCache` metadata is not what it
         * seems at all. Firestore can set it to `true` even if the data comes from the
         * server, and to `false` even if it comes from cache: it's actually a way to say
         * "Firestore is planning on making a fetch request as soon as possible as it's
         * likely (sometimes certain) that there is data to load". An honest name for
         * `fromCache` would be `hasPendingReads`.
         *
         * Our assumptions are the following:
         * 1) A local action triggers an immediate documentSnapshot with this metadata:
         * `fromCache == true | false && hasPendingWrites == true`
         * (`fromCache` being `true` only at initial load of we load from cache) and
         * another snapshot after Firestore saved the data with:
         * `fromCache == false && hasPendingWrites == false`
         * 2) A remote change triggers a documentSnapshot with this metadata:
         * `fromCache == false && hasPendingWrites == true | false`
         * (`hasPendingWrites` being true only if the are local changes still pending)
         * 3) In collection mode, the querySnapshot has its own `fromCache` metadata
         * which will be `true` if the data comes from cache at initial load or if
         * the snapshot is remote but is to be followed by other queued snapshots
         * 4) We don't expect the initial load from cache to be done in several
         * querySnapshots (TODO: check)
         *
         * Example 1: if our data is up-to-date and that a write request is made, the
         * first document snapshot will have:
         * `fromCache === false && hasPendingWrites === true`,
         * the 2nd snapshot will have:
         * `fromCache === false && hasPendingWrites === false`
         *
         * Example 2: if there are 150 documents to load at the same time, Firestore may
         * split them them in 3 (or whatever) batches, so we'll get three snapshots:
         * `fromCache === true && hasPendingWrites === false`
         * `fromCache === true && hasPendingWrites === false`
         * `fromCache === false && hasPendingWrites === false`
         * (`hasPendingWrites` maybe be `true` is we have a remotely-unsaved local
         * change while we receive the data)
         */
        openDBChannel: function (_a, parameters) {
            var _this = this;
            var getters = _a.getters, state = _a.state, commit = _a.commit, dispatch = _a.dispatch;
            if (parameters === void 0) { parameters = {
                clauses: {},
                pathVariables: {},
                debug: false,
            }; }
            /* COMPATIBILITY START
             * this ensures backward compatibility for people who passed pathVariables and
             * clauses directly at the root of the `parameters` object. Can be removed in
             * a later version
             */
            if (!isWhat.isPlainObject(parameters))
                parameters = {};
            if (!parameters.clauses && !parameters.pathVariables) {
                var pathVariables_3 = Object.assign({}, parameters || {});
                // @ts-ignore
                delete pathVariables_3.where;
                // @ts-ignore
                delete pathVariables_3.orderBy;
                Object.entries(pathVariables_3).forEach(function (entry) {
                    if (typeof entry[1] === 'object') {
                        delete pathVariables_3[entry[0]];
                    }
                });
                parameters = {
                    clauses: parameters,
                    pathVariables: pathVariables_3,
                    debug: parameters.debug,
                };
            }
            /* COMPATIBILITY END */
            var defaultParameters = {
                clauses: {},
                pathVariables: {},
                debug: false,
            };
            parameters = Object.assign(defaultParameters, parameters || {});
            // set data that will be used
            dispatch('setUserId');
            commit('SET_SYNCCLAUSES', parameters.clauses);
            commit('SET_PATHVARS', parameters.pathVariables);
            var identifier = createFetchIdentifier({
                where: state._conf.sync.where,
                orderBy: state._conf.sync.orderBy,
                pathVariables: state._sync.pathVariables,
            });
            // getters.dbRef should already have pathVariables swapped out
            var query = [];
            // apply where and orderBy clauses
            if (getters.collectionMode) {
                getters.getWhereArrays().forEach(function (whereParams) {
                    query.push(firestore.where(whereParams[0], whereParams[1], whereParams[2]));
                });
                if (state._conf.sync.orderBy.length) {
                    query.push(firestore.orderBy(state._conf.sync.orderBy));
                }
            }
            var dbRef = firestore.query.apply(void 0, __spreadArrays([getters.dbRef], query));
            // creates promises that can be resolved from outside their scope and that
            // can give their status
            var nicePromise = function () {
                var m = {
                    resolve: null,
                    reject: null,
                    isFulfilled: false,
                    isRejected: false,
                    isPending: true,
                };
                var p = new Promise(function (resolve, reject) {
                    m.resolve = resolve;
                    m.reject = reject;
                });
                Object.assign(p, m);
                // @ts-ignore
                p.then(function () { return (p.isFulfilled = true); })
                    // @ts-ignore
                    .catch(function () { return (p.isRejected = true); })
                    // @ts-ignore
                    .finally(function () { return (p.isPending = false); });
                return p;
            };
            var initialPromise = nicePromise(), refreshedPromise = nicePromise(), streamingPromise = nicePromise();
            var streamingStart = function () {
                // create a promise for the life of the snapshot that can be resolved from
                // outside its scope. This promise will be resolved when the user calls
                // closeDBChannel, or rejected if the stream is ended prematurely by the
                // error() callback
                state._sync.streaming[identifier] = streamingPromise;
                initialPromise.resolve({
                    refreshed: refreshedPromise,
                    streaming: streamingPromise,
                    stop: function () { return dispatch('closeDBChannel', { _identifier: identifier }); },
                });
            };
            var streamingStop = function (error) {
                // when this function is called by the error callback of onSnapshot, the
                // subscription will actually already have been cancelled
                unsubscribe();
                if (initialPromise.isPending) {
                    initialPromise.reject(error);
                }
                if (refreshedPromise.isPending) {
                    refreshedPromise.reject(error);
                }
                streamingPromise.reject(error);
                state._sync.patching = 'error';
                state._sync.unsubscribe[identifier] = null;
                state._sync.streaming[identifier] = null;
            };
            // if the channel was already open, just resolve:
            if (isWhat.isFunction(state._sync.unsubscribe[identifier])) {
                if (state._conf.logging) {
                    var channelAlreadyOpenError = "openDBChannel was already called for these clauses and pathvariables. Identifier: " + identifier;
                    console.log(channelAlreadyOpenError);
                }
                streamingStart();
                return initialPromise;
            }
            // const updateAllOpenTabsWithLocalPersistence = enablePersistence && synchronizeTabs
            /**
             * This function does not interact directly with the stream or the promises of
             * openDBChannel: instead, it returns an object which may be used (or not) by
             * the caller. Basically we'll use the response in doc mode only.
             *
             * In collection mode, the parameter is actually a `queryDocumentSnapshot`, which
             * has the same API as a `documentSnapshot`.
             */
            var processDocument = function (documentSnapshot, changeType) {
                // debug message
                if (parameters.debug) {
                    console.log("%c Document " + documentSnapshot.id + ": fromCache == " + (documentSnapshot.metadata.fromCache ? 'true' : 'false') + " && hasPendingWrites == " + (documentSnapshot.metadata.hasPendingWrites ? 'true' : 'false'), 'padding-left: 40px');
                }
                // the promise that this function returns always resolves with this object
                var promisePayload = {
                    initialize: false,
                    refresh: false,
                    stop: null,
                };
                var promise = Promise.resolve(promisePayload);
                // If the data is not up-to-date with the server yet.
                // This should happen only when we are loading from cache at initial load.
                if (documentSnapshot.metadata.fromCache) {
                    // If it's the very first snapshot, we are at the initial app load. If so, we'll
                    // use the data from cache to populate the state. Otherwise we can ignore it.
                    if (initialPromise.isPending) {
                        // pass the signal that the doc is ready to initialize
                        promisePayload.initialize = true;
                        // TODO: the capacity of hooks to "abort" the insertion makes little sense. It's
                        // a problem if they leave their promise pending. To be changed
                        // TODO: this is actually not useful when the store is persisted with Vuex-persist
                        promise = dispatch('applyHooksAndUpdateState', {
                            // TODO: for backward compatibility, we keep this as "modified" in doc mode
                            // but it would make sense in a future version to change to "added", as this is
                            // the initial load and the user may want to act on it differently
                            change: changeType || 'modified',
                            id: documentSnapshot.id,
                            doc: getters.cleanUpRetrievedDoc(documentSnapshot.data(), documentSnapshot.id),
                        }).then(function () { return promisePayload; });
                    }
                }
                // if the data is up-to-date with the server
                else {
                    // // do nothing on local changes
                    // const isLocalUpdate = documentSnapshot.metadata.hasPendingWrites
                    // if (isLocalUpdate && !updateAllOpenTabsWithLocalPersistence) return promise
                    // if (isLocalUpdate && updateAllOpenTabsWithLocalPersistence && document.hasFocus()) return promise
                    // if the remote document exists (this is always `true` when we are in
                    // collection mode)
                    if (documentSnapshot.exists()) {
                        // the doc will actually already be initialized at this point unless it couldn't
                        // be loaded from cache (no persistence, or never previously loaded)
                        promisePayload.initialize = true;
                        // also pass the signal that the doc has been refreshed
                        promisePayload.refresh = true;
                        var doc = getters.cleanUpRetrievedDoc(documentSnapshot.data(), documentSnapshot.id);
                        promise = dispatch('applyHooksAndUpdateState', {
                            // TODO: same as above, this remains for backward compatibilty but should be
                            // changed later by the commented line below
                            change: changeType || 'modified',
                            // if the document has not been loaded from cache before, this is an addition
                            //change: changeType || (initialPromise.isPending ? 'added' : 'modified'),
                            id: documentSnapshot.id,
                            doc: doc,
                        }).then(function () { return promisePayload; });
                    }
                    // the document doesn't exist yet (necessarily means we are in doc mode)
                    else {
                        // if the config allows to insert an initial document
                        if (!state._conf.sync.preventInitialDocInsertion) {
                            // a notification message in the console
                            if (state._conf.logging) {
                                var message = refreshedPromise.isPending
                                    ? 'inserting initial doc'
                                    : 'recreating doc after remote deletion';
                                console.log("%c [vuex-easy-firestore] " + message + "; for Firestore PATH: " + getters.firestorePathComplete + " [" + state._conf.firestorePath + "]", 'color: MediumSeaGreen');
                            }
                            // try to insert the doc
                            promise = dispatch('insertInitialDoc')
                                .then(function () {
                                promisePayload.initialize = true;
                                promisePayload.refresh = true;
                                return promisePayload;
                            })
                                .catch(function (error) {
                                // we close the stream ourselves. Firestore does not, as it leaves the
                                // stream open as long as the user has read rights on the document, even
                                // if it does not exist. But since the dev enabled `insertInitialDoc`,
                                // it makes some sense to close as we can assume the user should have had
                                // write rights
                                promisePayload.stop = error;
                                return promisePayload;
                            });
                        }
                        // we are not allowed to (re)create the doc: close the stream and reject
                        else {
                            promisePayload.stop = 'preventInitialDocInsertion';
                        }
                    }
                }
                return promise;
            };
            // log the fact that we'll now try to open the stream
            if (state._conf.logging) {
                console.log("%c openDBChannel for Firestore PATH: " + getters.firestorePathComplete + " [" + state._conf.firestorePath + "]", 'color: goldenrod');
            }
            // open the stream
            var unsubscribe = firestore.onSnapshot(dbRef, 
            // this lets us know when our data is up-to-date with the server
            { includeMetadataChanges: true }, 
            // the parameter is either a querySnapshot (collection mode) or a
            // documentSnapshot (doc mode)
            /**
             * @param {QuerySnapshot | DocumentSnapshot} snapshot
             */
            function (snapshot) { return __awaiter(_this, void 0, void 0, function () {
                var querySnapshot, docChanges, promises_1, documentSnapshot, resp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!getters.collectionMode) return [3 /*break*/, 2];
                            querySnapshot = snapshot;
                            docChanges = querySnapshot.docChanges({
                                includeMetadataChanges: true,
                            }), promises_1 = new Array(docChanges.length);
                            // debug messages
                            if (parameters.debug) {
                                console.log("%c QUERY SNAPSHOT received for `" + state._conf.moduleName + "`", 'font-weight: bold');
                                console.log("%c fromCache == " + (querySnapshot.metadata.fromCache ? 'true' : 'false') + " && hasPendingWrites == " + (querySnapshot.metadata.hasPendingWrites ? 'true' : 'false'), 'padding-left: 20px; font-style: italic');
                                console.log(docChanges.length
                                    ? "%c " + docChanges.length + " changed document snapshots included:"
                                    : "%c No changed document snapshots included.", 'padding-left: 20px; ');
                            }
                            // process doc changes
                            docChanges.forEach(function (change, i) {
                                promises_1[i] = processDocument(change.doc, change.type);
                            });
                            return [4 /*yield*/, Promise.all(promises_1)
                                // no matter where the data came from, we can resolve the initial promise
                            ];
                        case 1:
                            _a.sent();
                            // no matter where the data came from, we can resolve the initial promise
                            if (initialPromise.isPending) {
                                streamingStart();
                            }
                            // if all the data is up-to-date with the server
                            if (!querySnapshot.metadata.fromCache) {
                                // if it's the first time it's refreshed
                                if (refreshedPromise.isPending && querySnapshot.metadata.fromCache === false) {
                                    refreshedPromise.resolve();
                                }
                            }
                            return [3 /*break*/, 4];
                        case 2:
                            documentSnapshot = snapshot;
                            // debug messages
                            if (parameters.debug) {
                                console.log("%c DOCUMENT SNAPSHOT received for `" + state._conf.moduleName + "`", 'font-weight: bold');
                            }
                            return [4 /*yield*/, processDocument(documentSnapshot)];
                        case 3:
                            resp = _a.sent();
                            if (resp.initialize && initialPromise.isPending) {
                                streamingStart();
                            }
                            if (resp.refresh &&
                                refreshedPromise.isPending &&
                                documentSnapshot.metadata.fromCache === false) {
                                refreshedPromise.resolve();
                            }
                            if (resp.stop) {
                                streamingStop(resp.stop);
                            }
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); }, streamingStop);
            state._sync.unsubscribe[identifier] = unsubscribe;
            return initialPromise;
        },
        closeDBChannel: function (_a, _b) {
            var getters = _a.getters, state = _a.state, commit = _a.commit, dispatch = _a.dispatch;
            var _c = _b === void 0 ? { clearModule: false, _identifier: null } : _b, _d = _c.clearModule, clearModule = _d === void 0 ? false : _d, _e = _c._identifier, _identifier = _e === void 0 ? null : _e;
            var identifier = _identifier ||
                createFetchIdentifier({
                    where: state._conf.sync.where,
                    orderBy: state._conf.sync.orderBy,
                    pathVariables: state._sync.pathVariables,
                });
            var unsubscribeStream = state._sync.unsubscribe[identifier];
            if (isWhat.isFunction(unsubscribeStream)) {
                unsubscribeStream();
                state._sync.streaming[identifier].resolve();
                state._sync.streaming[identifier] = null;
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
                newDoc.id = firestore.doc(getters.dbRef).id;
            // apply default values
            var newDocWithDefaults = setDefaultValues(newDoc, state._conf.sync.defaultValues);
            // define the firestore update
            function firestoreUpdateFn(_doc) {
                return dispatch('insertDoc', _doc);
            }
            // define the store update
            function storeUpdateFn(_doc) {
                commit('INSERT_DOC', _doc);
                // check for a hook after local change before sync
                if (state._conf.sync.insertHookBeforeSync) {
                    return state._conf.sync.insertHookBeforeSync(firestoreUpdateFn, _doc, store);
                }
                return firestoreUpdateFn(_doc);
            }
            // check for a hook before local change
            if (state._conf.sync.insertHook) {
                return state._conf.sync.insertHook(storeUpdateFn, newDocWithDefaults, store);
            }
            return storeUpdateFn(newDocWithDefaults);
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
                    newDoc.id = firestore.doc(getters.dbRef).id;
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
            // check for a hook before local change
            if (state._conf.sync.insertBatchHook) {
                return state._conf.sync.insertBatchHook(storeUpdateFn, newDocs, store);
            }
            return storeUpdateFn(newDocs);
        },
        patch: function (_a, doc) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            var store = this;
            // check payload
            if (!doc)
                return;
            var id = getters.collectionMode ? getId(doc) : getters.docModeId;
            var value = getters.collectionMode ? getValueFromPayloadPiece(doc) : doc;
            if (!id && getters.collectionMode)
                return error('patch-missing-id');
            // check userId
            dispatch('setUserId');
            // add id to value
            if (!value.id)
                value.id = id;
            // define the firestore update
            function firestoreUpdateFn(_val) {
                return dispatch('patchDoc', { id: id, doc: copy(_val) });
            }
            // define the store update
            function storeUpdateFn(_val) {
                commit('PATCH_DOC', _val);
                // check for a hook after local change before sync
                if (state._conf.sync.patchHookBeforeSync) {
                    return state._conf.sync.patchHookBeforeSync(firestoreUpdateFn, _val, store);
                }
                return firestoreUpdateFn(_val);
            }
            // check for a hook before local change
            if (state._conf.sync.patchHook) {
                return state._conf.sync.patchHook(storeUpdateFn, value, store);
            }
            return storeUpdateFn(value);
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
            // check for a hook before local change
            if (state._conf.sync.patchBatchHook) {
                return state._conf.sync.patchBatchHook(storeUpdateFn, doc, ids, store);
            }
            return storeUpdateFn(doc, ids);
        },
        delete: function (_a, id) {
            var state = _a.state, getters = _a.getters, commit = _a.commit, dispatch = _a.dispatch;
            var store = this;
            // check payload
            if (!id)
                return;
            // check userId
            dispatch('setUserId');
            // define the firestore update
            function firestoreUpdateFnId(_id) {
                return dispatch('deleteDoc', _id);
            }
            function firestoreUpdateFnPath(_path) {
                return dispatch('deleteProp', _path);
            }
            // define the store update
            function storeUpdateFn(_id) {
                // id is a path
                var pathDelete = _id.includes('.') || !getters.collectionMode;
                if (pathDelete) {
                    var path = _id;
                    if (!path)
                        return error('delete-missing-path');
                    commit('DELETE_PROP', path);
                    // check for a hook after local change before sync
                    if (state._conf.sync.deleteHookBeforeSync) {
                        return state._conf.sync.deleteHookBeforeSync(firestoreUpdateFnPath, path, store);
                    }
                    return firestoreUpdateFnPath(path);
                }
                if (!_id)
                    return error('delete-missing-id');
                commit('DELETE_DOC', _id);
                // check for a hook after local change before sync
                if (state._conf.sync.deleteHookBeforeSync) {
                    return state._conf.sync.deleteHookBeforeSync(firestoreUpdateFnId, _id, store);
                }
                return firestoreUpdateFnId(_id);
            }
            // check for a hook before local change
            if (state._conf.sync.deleteHook) {
                return state._conf.sync.deleteHook(storeUpdateFn, id, store);
            }
            return storeUpdateFn(id);
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
                    var pathDelete = _id.includes('.') || !getters.collectionMode;
                    if (pathDelete) {
                        var path = _id;
                        if (!path)
                            return error('delete-missing-path');
                        commit('DELETE_PROP', path);
                        return dispatch('deleteProp', path);
                    }
                    if (!_id)
                        return error('delete-missing-id');
                    commit('DELETE_DOC', _id);
                    return dispatch('deleteDoc', _id);
                });
            }
            // check for a hook before local change
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
            state._sync.stopPatchingTimeout = setTimeout(function (_) {
                state._sync.patching = false;
            }, 300);
        },
        _startPatching: function (_a) {
            var state = _a.state, commit = _a.commit;
            if (state._sync.stopPatchingTimeout) {
                clearTimeout(state._sync.stopPatchingTimeout);
            }
            state._sync.patching = true;
        },
    };
}

/**
 * A function returning the getters object
 *
 * @export
 * @param {*} firebase The firebase dependency
 * @returns {AnyObject} the getters object
 */
function pluginGetters (firebaseApp) {
    var firestore$1 = firestore.getFirestore(firebaseApp);
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
                if (getters.signedIn && isWhat.isString(userId) && userId !== '' && userId !== '{userId}') {
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
            return getters.collectionMode
                ? firestore.collection(firestore$1, path)
                : firestore.doc(firestore$1, path);
        },
        storeRef: function (state, getters, rootState) {
            var path = state._conf.statePropName
                ? state._conf.moduleName + "/" + state._conf.statePropName
                : state._conf.moduleName;
            return createEasyAccess.getDeepRef(rootState, path);
        },
        collectionMode: function (state, getters, rootState) {
            return state._conf.firestoreRefType.toLowerCase() === 'collection';
        },
        docModeId: function (state, getters) {
            return getters.firestorePathComplete.split('/').pop();
        },
        fillables: function (state) {
            var fillables = state._conf.sync.fillables;
            if (!fillables.length)
                return fillables;
            return fillables.concat(['updated_at', 'updated_by', 'id', 'created_at', 'created_by']);
        },
        guard: function (state) {
            return state._conf.sync.guard.concat(['_conf', '_sync']);
        },
        defaultValues: function (state, getters) {
            return mergeAnything.merge(state._conf.sync.defaultValues, state._conf.serverChange.defaultValues // depreciated
            );
        },
        cleanUpRetrievedDoc: function (state, getters, rootState, rootGetters) { return function (doc, id) {
            var defaultValues = mergeAnything.merge(getters.defaultValues, state._conf.serverChange.convertTimestamps);
            var cleanDoc = setDefaultValues(doc, defaultValues);
            cleanDoc.id = id;
            return cleanDoc;
        }; },
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
                        patchData = collectionMode ? getters.storeRef[id] : getters.storeRef;
                    }
                    else {
                        patchData = doc;
                    }
                    // set default fields
                    patchData.updated_at = new Date();
                    patchData.updated_by = state._sync.userId;
                    // clean up item
                    var cleanedPatchData = filter(patchData, getters.fillables, getters.guard);
                    var itemToUpdate = flatten__default(cleanedPatchData);
                    // add id (required to get ref later at apiHelpers.ts)
                    // @ts-ignore
                    itemToUpdate.id = id;
                    carry[id] = itemToUpdate;
                    return carry;
                }, {});
            };
        },
        prepareForPropDeletion: function (state, getters, rootState, rootGetters) {
            return function (path) {
                var _a;
                if (path === void 0) { path = ''; }
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
                cleanedPatchData[cleanedPath] = firestore.deleteField();
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
        prepareInitialDocForInsert: function (state, getters, rootState, rootGetters) { return function (doc) {
            // add fillable and guard defaults
            // set default fields
            doc.created_at = new Date();
            doc.created_by = state._sync.userId;
            doc.id = getters.docModeId;
            // clean up item
            doc = filter(doc, getters.fillables, getters.guard);
            return doc;
        }; },
        getWhereArrays: function (state, getters) { return function (whereArrays) {
            if (!isWhat.isArray(whereArrays))
                whereArrays = state._conf.sync.where;
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
                            return error('missing-path-variables');
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
    if (config.statePropName !== null && !isWhat.isString(config.statePropName)) {
        errors.push('statePropName must be null or a string');
    }
    if (isWhat.isString(config.statePropName) && /(\.|\/)/.test(config.statePropName)) {
        errors.push("statePropName must be null or a string without special characters");
    }
    if (/\./.test(config.moduleName)) {
        errors.push("moduleName must only include letters from [a-z] and forward slashes '/'");
    }
    var syncProps = [
        'where',
        'orderBy',
        'fillables',
        'guard',
        'defaultValues',
        'insertHook',
        'patchHook',
        'deleteHook',
        'insertBatchHook',
        'patchBatchHook',
        'deleteBatchHook',
    ];
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
    var functionProps = [
        'insertHook',
        'patchHook',
        'deleteHook',
        'insertBatchHook',
        'patchBatchHook',
        'deleteBatchHook',
        'addedHook',
        'modifiedHook',
        'removedHook',
    ];
    functionProps.forEach(function (prop) {
        var _prop = syncProps.includes(prop) ? config.sync[prop] : config.serverChange[prop];
        if (!isWhat.isFunction(_prop))
            errors.push("`" + prop + "` should be a Function, but is not.");
    });
    var objectProps = ['sync', 'serverChange', 'defaultValues', 'fetch'];
    objectProps.forEach(function (prop) {
        var _prop = prop === 'defaultValues' ? config.sync[prop] : config[prop];
        if (!isWhat.isPlainObject(_prop))
            errors.push("`" + prop + "` should be an Object, but is not.");
    });
    var stringProps = ['firestorePath', 'firestoreRefType', 'moduleName'];
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
 * @param {*} FirebaseDependency The firebase dependency (non-instanciated), defaults to the firebase peer dependency if left blank.
 * @returns {IStore} the module ready to be included in your vuex store
 */
function iniModule (userConfig, firestoreConfig) {
    var FirebaseDependency = firestoreConfig.FirebaseDependency;
    // prepare state._conf
    var conf = copy(mergeAnything.merge({ state: {}, mutations: {}, actions: {}, getters: {} }, defaultConfig, userConfig));
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
    var restOfState = mergeAnything.merge(userState, docContainer);
    // if 'doc' mode, set merge initial state onto default values
    if (conf.firestoreRefType === 'doc') {
        var defaultValsInState = conf.statePropName ? restOfState[conf.statePropName] : restOfState;
        conf.sync.defaultValues = copy(mergeAnything.merge(defaultValsInState, conf.sync.defaultValues));
    }
    // Warn overloaded mutations / actions / getters
    var uKeys, pKeys;
    var pMutations = pluginMutations(mergeAnything.merge(userState, { _conf: conf }));
    var pActions = pluginActions(firestoreConfig);
    var pGetters = pluginGetters(FirebaseDependency);
    uKeys = Object.keys(userMutations);
    pKeys = Object.keys(pMutations);
    for (var _i = 0, uKeys_1 = uKeys; _i < uKeys_1.length; _i++) {
        var key = uKeys_1[_i];
        if (pKeys.includes(key)) {
            console.warn("[vuex-easy-firestore] Overloaded mutation: " + conf.moduleName + "/" + key);
        }
    }
    uKeys = Object.keys(userActions);
    pKeys = Object.keys(pActions);
    for (var _a = 0, uKeys_2 = uKeys; _a < uKeys_2.length; _a++) {
        var key = uKeys_2[_a];
        if (pKeys.includes(key)) {
            console.warn("[vuex-easy-firestore] Overloaded action: " + conf.moduleName + "/" + key);
        }
    }
    uKeys = Object.keys(userGetters);
    pKeys = Object.keys(pGetters);
    for (var _b = 0, uKeys_3 = uKeys; _b < uKeys_3.length; _b++) {
        var key = uKeys_3[_b];
        if (pKeys.includes(key)) {
            console.warn("[vuex-easy-firestore] Overloaded getter: " + conf.moduleName + "/" + key);
        }
    }
    return {
        namespaced: true,
        state: mergeAnything.merge(pluginState(), restOfState, { _conf: conf }),
        mutations: __assign(__assign({}, userMutations), pMutations),
        actions: __assign(__assign({}, userActions), pActions),
        getters: __assign(__assign({}, userGetters), pGetters),
    };
}

/**
 * Create vuex-easy-firestore modules. Add as single plugin to Vuex Store.
 *
 * @export
 * @param {(IEasyFirestoreModule | IEasyFirestoreModule[])} easyFirestoreModule A vuex-easy-firestore module (or array of modules) with proper configuration as per the documentation.
 * @param {{logging?: boolean, FirebaseDependency?: any}} extraConfig An object with `logging` and `FirebaseDependency` props. `logging` enables console logs for debugging. `FirebaseDependency` is the non-instanciated firebase class you can pass. (defaults to the firebase peer dependency)
 * @returns {*}
 */
function vuexEasyFirestore(easyFirestoreModule, _a) {
    var _b = _a === void 0 ? {
        logging: false,
        preventInitialDocInsertion: false,
        FirebaseDependency: null,
        enablePersistence: false,
        synchronizeTabs: false,
    } : _a, _c = _b.logging, logging = _c === void 0 ? false : _c, _d = _b.preventInitialDocInsertion, preventInitialDocInsertion = _d === void 0 ? false : _d, _e = _b.FirebaseDependency, FirebaseDependency = _e === void 0 ? null : _e, _f = _b.enablePersistence, enablePersistence = _f === void 0 ? false : _f, _g = _b.synchronizeTabs, synchronizeTabs = _g === void 0 ? false : _g;
    if (FirebaseDependency === null) {
        throw new Error('FirebaseDependency is required. Please pass in the value returned by initializeApp({...}) from firebase/auth.');
    }
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
            var firestoreConfig = {
                FirebaseDependency: FirebaseDependency,
                enablePersistence: enablePersistence,
                synchronizeTabs: synchronizeTabs,
            };
            store.registerModule(moduleName, iniModule(config, firestoreConfig));
        });
    };
}

var easyAccess = createEasyAccess__default({ vuexEasyFirestore: true });
var easyFirestores = vuexEasyFirestore([
    pokemonBox,
    mainCharacter,
    pokemonBoxVEA,
    mainCharacterVEA,
    testPathVar,
    testPathVar2,
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
    docModeWithPathVar,
], { logging: false, FirebaseDependency: firebaseApp });
var storeObj = {
    plugins: [easyFirestores, easyAccess],
};

var app = vue.createApp({});
var store = vuex.createStore(storeObj);
app.use(store);

exports.firebaseApp = firebaseApp;
exports.store = store;

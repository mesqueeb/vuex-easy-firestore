'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Firebase = _interopDefault(require('firebase/app'));
require('firebase/firestore');
var vuexEasyAccess = require('vuex-easy-access');
var isWhat = require('is-what');
var nanomerge = _interopDefault(require('nanomerge'));
var Firebase$1 = _interopDefault(require('firebase'));
require('firebase/auth');
var Vue = _interopDefault(require('vue'));
var Vuex = _interopDefault(require('vuex'));

process.env.apiKey = "AIzaSyDivMlXIuHqDFsTCCqBDTVL0h29xbltcL8";
process.env.authDomain = "tests-firestore.firebaseapp.com";
process.env.databaseURL = "https://tests-firestore.firebaseio.com";
process.env.projectId = "tests-firestore";

var config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId
};
Firebase.initializeApp(config);
var firestore$1 = Firebase.firestore();
var settings = { timestampsInSnapshots: true };
firestore$1.settings(settings);

function initialState() {
  return {
    playerName: 'Satoshi',
    pokemon: {},
    stats: {
      pokemonCount: 0,
      freedCount: 0
    }
  };
}

var pokemonBox = {
  // easy firestore config
  firestorePath: 'pokemonBoxes/Satoshi/pokemon',
  firestoreRefType: 'collection',
  moduleName: 'pokemonBox',
  statePropName: 'pokemon',
  // module
  state: initialState(),
  mutations: vuexEasyAccess.defaultMutations(initialState()),
  actions: {},
  getters: {}
};

function initialState$1() {
  return {
    name: 'Satoshi',
    pokemonBelt: [],
    items: []
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
  mutations: vuexEasyAccess.defaultMutations(initialState$1()),
  actions: {},
  getters: {}
};

// import deepmerge from 'deepmerge'
// import deepAssign from 'deep-object-assign-with-reduce'
// const mergeOptions = require('merge-options')

function merge() {
  // check if all are objects
  var l = arguments.length;
  for (l; l > 0; l--) {
    var item = arguments.length <= l - 1 ? undefined : arguments[l - 1];
    if (!isWhat.isObject(item)) {
      console.error('trying to merge a non-object: ', item);
      return item;
    }
  }
  return nanomerge.apply(undefined, arguments);
  // settings for 'deepmerge'
  // const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray
  // const options = {arrayMerge: overwriteMerge}
  // if (params.length > 2) {
  //   return deepmerge.all([...params], options)
  // }
  // return deepmerge(...params, options)
  // return deepAssign(...params)
  // return mergeOptions(...params)
}

var defaultConfig = {
  firestorePath: '',
  // The path to a collection or doc in firestore. You can use `{userId}` which will be replaced with the user Id.
  firestoreRefType: '',
  // `'collection'` or `'doc'`. Depending on your `firestorePath`.
  moduleName: '',
  // The module name. Can be nested, eg. `'user/items'`
  statePropName: '',
  // The name of the property where the docs or doc will be synced to. If left blank it will be synced on the state of the module. (Please see [Sync directly to module state](#sync-directly-to-module-state) for more info)

  // Related to the 2-way sync:
  sync: {
    where: [],
    orderBy: [],
    fillables: [],
    guard: [],
    // HOOKS for local changes:
    insertHook: function insertHook(updateStore, doc, store) {
      return updateStore(doc);
    },
    patchHook: function patchHook(updateStore, doc, store) {
      return updateStore(doc);
    },
    deleteHook: function deleteHook(updateStore, id, store) {
      return updateStore(id);
    }
  },

  // When items on the server side are changed:
  serverChange: {
    defaultValues: {},
    // HOOKS for changes on SERVER:
    addedHook: function addedHook(updateStore, doc, id, store, source, change) {
      return updateStore(doc);
    },
    modifiedHook: function modifiedHook(updateStore, doc, id, store, source, change) {
      return updateStore(doc);
    },
    removedHook: function removedHook(updateStore, doc, id, store, source, change) {
      return updateStore(doc);
    }
  },

  // When items are fetched through `dispatch('module/fetch', filters)`.
  fetch: {
    // The max amount of documents to be fetched. Defaults to 50.
    docLimit: 50
  },

  // You can also add custom state/getters/mutations/actions. These will be added to your module.
  state: {},
  getters: {},
  mutations: {},
  actions: {}
};

var initialState$2 = {
  _sync: {
    signedIn: false,
    patching: false,
    syncStack: {
      inserts: [],
      updates: {},
      deletions: [],
      propDeletions: [],
      debounceTimer: null
    },
    fetched: [],
    stopPatchingTimeout: null
  }
};

var mutations = {
  resetSyncStack: function resetSyncStack(state) {
    state._sync.syncStack = {
      updates: {},
      deletions: [],
      inserts: [],
      debounceTimer: null
    };
  },
  INSERT_DOC: function INSERT_DOC(state, doc) {
    if (state._conf.firestoreRefType.toLowerCase() !== 'collection') return;
    if (state._conf.statePropName) {
      this._vm.$set(state[state._conf.statePropName], doc.id, doc);
    } else {
      this._vm.$set(state, doc.id, doc);
    }
  },
  PATCH_DOC: function PATCH_DOC(state, doc) {
    var _this = this;

    // Get the state prop ref
    var ref = state._conf.statePropName ? state[state._conf.statePropName] : state;
    if (state._conf.firestoreRefType.toLowerCase() === 'collection') {
      ref = ref[doc.id];
    }
    var newDoc = !isWhat.isObject(ref) || !isWhat.isObject(doc) ? doc : merge(ref, doc);
    return Object.keys(newDoc).forEach(function (key) {
      var newVal = newDoc[key];
      // Merge if exists
      _this._vm.$set(ref, key, newVal);
    });
  },
  DELETE_DOC: function DELETE_DOC(state, id) {
    if (state._conf.firestoreRefType.toLowerCase() !== 'collection') return;
    if (state._conf.statePropName) {
      this._vm.$delete(state[state._conf.statePropName], id);
    } else {
      this._vm.$delete(state, id);
    }
  },
  DELETE_PROP: function DELETE_PROP(state, path) {
    var searchTarget = state._conf.statePropName ? state[state._conf.statePropName] : state;
    var propArr = path.split('.');
    var target = propArr.pop();
    if (!propArr.length) {
      return this._vm.$delete(searchTarget, target);
    }
    var ref = vuexEasyAccess.getDeepRef(searchTarget, propArr.join('.'));
    return this._vm.$delete(ref, target);
  }
};

function iniMutations () {
  var userMutations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return Object.assign({}, mutations, userMutations);
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/**
 * copyObj helper
 *
 * @author     Adam Dorling
 * @contact    https://codepen.io/naito
 */
function copyObj(obj) {
  var newObj = void 0;
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) != 'object') {
    return obj;
  }
  if (!obj) {
    return obj;
  }
  if ('[object Object]' !== Object.prototype.toString.call(obj) || '[object Array]' !== Object.prototype.toString.call(obj)) {
    return JSON.parse(JSON.stringify(obj));
  }
  // Object is an Array
  if ('[object Array]' === Object.prototype.toString.call(obj)) {
    newObj = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      newObj[i] = copyObj(obj[i]);
    }
    return newObj;
  }
  // Object is an Object
  newObj = {};
  for (var _i in obj) {
    if (obj.hasOwnProperty(_i)) {
      newObj[_i] = copyObj(obj[_i]);
    }
  }
  return newObj;
}

/**
 * Sets default values on an object
 *
 * @param {object} obj on which to set the default values
 * @param {object} defaultValues the default values
 */
function setDefaultValues (obj, defaultValues) {
  return merge(defaultValues, obj);
}

/**
 * debounce helper
 *
 * @author     Adam Dorling
 * @contact    https://codepen.io/naito
 */

// USAGE:
// let d = startDebounce(1000)
// d.done.then(_ => handle())
// d.refresh() // to refresh

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
  var refresh = function refresh() {
    return startTime = Date.now();
  };
  return { done: done, refresh: refresh };
}

function retrievePaths(object, path, result) {
  if (!isWhat.isObject(object) || !Object.keys(object).length) {
    if (!path) return object;
    result[path] = object;
    return result;
  }
  return Object.keys(object).reduce(function (carry, key) {
    var pathUntilNow = path ? path + '.' : '';
    var newPath = pathUntilNow + key;
    var extra = retrievePaths(object[key], newPath, result);
    return Object.assign(carry, extra);
  }, {});
}

function flattenToPaths (object) {
  var result = {};
  return retrievePaths(object, null, result);
}

/**
 * Grab until the api limit (500), put the rest back in the syncStack.
 *
 * @export
 * @param {string} syncStackProp the prop of _sync.syncStack[syncStackProp]
 * @param {number} count the current count
 * @param {object} state the store's state, will be edited!
 */
function grabUntilApiLimit(syncStackProp, count, state) {
  var targets = copyObj(state._sync.syncStack[syncStackProp]);
  // Check if there are more than 500 batch items already
  if (count >= 500) {
    // already at 500 or more, leave items in syncstack, and don't add anything to batch
    targets = [];
  } else {
    // Batch supports only until 500 items
    var targetsAmount = 500 - count;
    var targetsOK = targets.slice(0, targetsAmount);
    var targetsLeft = targets.slice(targetsAmount);
    // Put back the remaining items over 500
    state._sync.syncStack[syncStackProp] = targetsLeft;
    // Define the items we'll add below
    targets = targetsOK;
  }
  return targets;
}

var errorMessages = {
  actionsDeleteMissingId: '\n    Missing Id of the Doc you want to delete!\n    Correct usage:\n      dispatch(\'delete\', id)\n  ',
  actionsDeleteMissingPath: '\n    Missing path to the prop you want to delete!\n    Correct usage:\n      dispatch(\'delete\', \'path.to.prop\')\n\n    Use `.` for sub props!\n  ',
  missingId: '\n    Missing an id! Correct usage:\n\n    // `id` as prop of item:\n    dispatch(\'module/set\', {id: \'123\', name: \'best item name\'})\n\n    // or object with only 1 prop, which is the `id` as key, and item as its value:\n    dispatch(\'module/set\', {\'123\': {name: \'best item name\'}})\n  '
};

function error (error) {
  console.error('[vuex-easy-firestore] Error!', errorMessages[error]);
  return error;
}

/**
 * gets an ID from a single piece of payload.
 *
 * @param {object, string} payload
 * @param {object} conf (optional - for error handling) the vuex-easy-access config
 * @param {string} path (optional - for error handling) the path called
 * @param {array|object|string} fullPayload (optional - for error handling) the full payload on which each was `getId()` called
 * @returns {string} the id
 */
function getId(payloadPiece, conf, path, fullPayload) {
  if (isWhat.isObject(payloadPiece)) {
    if (payloadPiece.id) return payloadPiece.id;
    if (Object.keys(payloadPiece).length === 1) return Object.keys(payloadPiece)[0];
  }
  if (isWhat.isString(payloadPiece)) return payloadPiece;
  error('missingId');
  return false;
}

/**
 * Returns a value of a payload piece. Eg. {[id]: 'val'} will return 'val'
 *
 * @param {*} payloadPiece
 * @returns {*} the value
 */
function getValueFromPayloadPiece(payloadPiece) {
  if (isWhat.isObject(payloadPiece) && !payloadPiece.id && Object.keys(payloadPiece).length === 1) {
    return Object.values(payloadPiece)[0];
  }
  return payloadPiece;
}

var actions = {
  patchDoc: function patchDoc(_ref) {
    var state = _ref.state,
        getters = _ref.getters,
        commit = _ref.commit,
        dispatch = _ref.dispatch;

    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { ids: [], doc: {} },
        _ref2$id = _ref2.id,
        id = _ref2$id === undefined ? '' : _ref2$id,
        _ref2$ids = _ref2.ids,
        ids = _ref2$ids === undefined ? [] : _ref2$ids,
        doc = _ref2.doc;

    // 0. payload correction (only arrays)
    if (!isWhat.isArray(ids)) return console.error('ids needs to be an array');
    if (id) ids.push(id);
    if (doc.id) delete doc.id;

    // 1. Prepare for patching
    var syncStackItems = getters.prepareForPatch(ids, doc);

    // 2. Push to syncStack
    Object.keys(syncStackItems).forEach(function (id) {
      var newVal = !state._sync.syncStack.updates[id] ? syncStackItems[id] : merge(state._sync.syncStack.updates[id], syncStackItems[id]);
      state._sync.syncStack.updates[id] = newVal;
    });

    // 3. Create or refresh debounce
    return dispatch('handleSyncStackDebounce');
  },
  deleteDoc: function deleteDoc(_ref3) {
    var state = _ref3.state,
        getters = _ref3.getters,
        commit = _ref3.commit,
        dispatch = _ref3.dispatch;
    var ids = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    // 0. payload correction (only arrays)
    if (!isWhat.isArray(ids)) ids = [ids];

    // 1. Prepare for patching
    // 2. Push to syncStack
    var deletions = state._sync.syncStack.deletions.concat(ids);
    state._sync.syncStack.deletions = deletions;

    if (!state._sync.syncStack.deletions.length) return;
    // 3. Create or refresh debounce
    return dispatch('handleSyncStackDebounce');
  },
  deleteProp: function deleteProp(_ref4, path) {
    var state = _ref4.state,
        getters = _ref4.getters,
        commit = _ref4.commit,
        dispatch = _ref4.dispatch;

    // 1. Prepare for patching
    // 2. Push to syncStack
    state._sync.syncStack.propDeletions.push(path);

    if (!state._sync.syncStack.propDeletions.length) return;
    // 3. Create or refresh debounce
    return dispatch('handleSyncStackDebounce');
  },
  insertDoc: function insertDoc(_ref5) {
    var state = _ref5.state,
        getters = _ref5.getters,
        commit = _ref5.commit,
        dispatch = _ref5.dispatch;
    var docs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    // 0. payload correction (only arrays)
    if (!isWhat.isArray(docs)) docs = [docs];

    // 1. Prepare for patching
    var syncStack = getters.prepareForInsert(docs);

    // 2. Push to syncStack
    var inserts = state._sync.syncStack.inserts.concat(syncStack);
    state._sync.syncStack.inserts = inserts;

    // 3. Create or refresh debounce
    return dispatch('handleSyncStackDebounce');
  },
  insertInitialDoc: function insertInitialDoc(_ref6) {
    var state = _ref6.state,
        getters = _ref6.getters,
        commit = _ref6.commit,
        dispatch = _ref6.dispatch;

    // 0. only docMode
    if (getters.collectionMode) return;

    // 1. Prepare for insert
    var initialDoc = getters.storeRef ? getters.storeRef : {};
    var doc = getters.prepareInitialDocForInsert(initialDoc);

    // 2. insert
    return getters.dbRef.set(doc);
  },
  handleSyncStackDebounce: function handleSyncStackDebounce(_ref7) {
    var state = _ref7.state,
        commit = _ref7.commit,
        dispatch = _ref7.dispatch,
        getters = _ref7.getters;

    if (!getters.signedIn) return false;
    if (!state._sync.syncStack.debounceTimer) {
      var debounceTimer = startDebounce(1000);
      debounceTimer.done.then(function (_) {
        return dispatch('batchSync');
      });
      state._sync.syncStack.debounceTimer = debounceTimer;
    }
    state._sync.syncStack.debounceTimer.refresh();
  },
  batchSync: function batchSync(_ref8) {
    var getters = _ref8.getters,
        commit = _ref8.commit,
        dispatch = _ref8.dispatch,
        state = _ref8.state,
        rootGetters = _ref8.rootGetters;

    var collectionMode = getters.collectionMode;
    var dbRef = getters.dbRef;
    var batch = Firebase$1.firestore().batch();
    var count = 0;
    // Add 'updates' to batch
    var updatesOriginal = copyObj(state._sync.syncStack.updates);
    var updates = Object.keys(updatesOriginal).map(function (k) {
      var fields = updatesOriginal[k];
      return { id: k, fields: fields };
    });
    // Check if there are more than 500 batch items already
    if (updates.length >= 500) {
      // Batch supports only until 500 items
      count = 500;
      var updatesOK = updates.slice(0, 500);
      var updatesLeft = updates.slice(500);
      // Put back the remaining items over 500
      state._sync.syncStack.updates = updatesLeft.reduce(function (carry, item) {
        carry[item.id] = item;
        delete item.id;
        return carry;
      }, {});
      updates = updatesOK;
    } else {
      state._sync.syncStack.updates = {};
      count = updates.length;
    }
    // Add to batch
    updates.forEach(function (item) {
      var id = item.id;
      var docRef = collectionMode ? dbRef.doc(id) : dbRef;
      var fields = flattenToPaths(item.fields);
      fields.updated_at = Firebase$1.firestore.FieldValue.serverTimestamp();
      // console.log('fields → ', fields)
      batch.update(docRef, fields);
    });
    // Add 'propDeletions' to batch
    var propDeletions = grabUntilApiLimit('propDeletions', count, state);
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
      updateObj[path] = Firebase$1.firestore.FieldValue.delete();
      updateObj.updated_at = Firebase$1.firestore.FieldValue.serverTimestamp();
      batch.update(docRef, updateObj);
    });
    // Add 'deletions' to batch
    var deletions = grabUntilApiLimit('deletions', count, state);
    count = count + deletions.length;
    // Add to batch
    deletions.forEach(function (id) {
      var docRef = dbRef.doc(id);
      batch.delete(docRef);
    });
    // Add 'inserts' to batch
    var inserts = grabUntilApiLimit('inserts', count, state);
    count = count + inserts.length;
    // Add to batch
    inserts.forEach(function (item) {
      item.created_at = Firebase$1.firestore.FieldValue.serverTimestamp();
      item.created_by = rootGetters['user/id'];
      var newRef = getters.dbRef.doc(item.id);
      batch.set(newRef, item);
    });
    // Commit the batch:
    // console.log(`[batchSync] START:
    //   ${Object.keys(updates).length} updates,
    //   ${deletions.length} deletions,
    //   ${inserts.length} inserts`
    // )
    dispatch('_startPatching');
    state._sync.syncStack.debounceTimer = null;
    return new Promise(function (resolve, reject) {
      batch.commit().then(function (res) {
        if (Object.keys(updates).length) console.log('updates: ', updates);
        if (deletions.length) console.log('deletions: ', deletions);
        if (inserts.length) console.log('inserts: ', inserts);
        if (propDeletions.length) console.log('propDeletions: ', propDeletions);
        var remainingSyncStack = Object.keys(state._sync.syncStack.updates).length + state._sync.syncStack.deletions.length + state._sync.syncStack.inserts.length + state._sync.syncStack.propDeletions.length;
        if (remainingSyncStack) {
          dispatch('batchSync');
        }
        dispatch('_stopPatching');
        return resolve();
        // // Fetch the item if it was added as an Archived item:
        // if (item.archived) {
        //   get_ters.dbRef.doc(res.id).get()
        //   .then(doc => {
        //     let tempId = doc.data().id
        //     let id = doc.id
        //     let item = doc.data()
        //     item.id = id
        //     console.log('retrieved Archived new item: ', id, item)
        //     dispatch('newItemFromServer', {item, tempId})
        //   })
        // }
      }).catch(function (error$$1) {
        state._sync.patching = 'error';
        state._sync.syncStack.debounceTimer = null;
        return reject();
      });
    });
  },
  fetch: function fetch(_ref9) {
    var state = _ref9.state,
        getters = _ref9.getters,
        commit = _ref9.commit,
        dispatch = _ref9.dispatch;

    var _ref10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { whereFilters: [], orderBy: []
      // whereFilters: [['archived', '==', true]]
      // orderBy: ['done_date', 'desc']
    },
        _ref10$whereFilters = _ref10.whereFilters,
        whereFilters = _ref10$whereFilters === undefined ? [] : _ref10$whereFilters,
        _ref10$orderBy = _ref10.orderBy,
        orderBy = _ref10$orderBy === undefined ? [] : _ref10$orderBy;

    return new Promise(function (resolve, reject) {
      console.log('[fetch] starting');
      if (!getters.signedIn) return resolve();
      var identifier = JSON.stringify({ whereFilters: whereFilters, orderBy: orderBy });
      var fetched = state._sync.fetched[identifier];
      // We've never fetched this before:
      if (!fetched) {
        var ref = getters.dbRef;
        // apply where filters and orderBy
        whereFilters.forEach(function (paramsArr) {
          var _ref11;

          ref = (_ref11 = ref).where.apply(_ref11, toConsumableArray(paramsArr));
        });
        if (orderBy.length) {
          var _ref12;

          ref = (_ref12 = ref).orderBy.apply(_ref12, toConsumableArray(orderBy));
        }
        state._sync.fetched[identifier] = {
          ref: ref,
          done: false,
          retrievedFetchRefs: [],
          nextFetchRef: null
        };
      }
      var fRequest = state._sync.fetched[identifier];
      // We're already done fetching everything:
      if (fRequest.done) {
        console.log('done fetching');
        return resolve('fetchedAll');
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
        console.log('Already retrieved this part.');
        return resolve();
      }
      // make fetch request
      fRef.get().then(function (querySnapshot) {
        var docs = querySnapshot.docs;
        if (docs.length === 0) {
          state._sync.fetched[identifier].done = true;
          resolve('fetchedAll');

          return;
        }
        if (docs.length < state._conf.fetch.docLimit) {
          state._sync.fetched[identifier].done = true;
        }
        state._sync.fetched[identifier].retrievedFetchRefs.push(fetchRef);
        // Get the last visible document
        resolve(querySnapshot);
        var lastVisible = docs[docs.length - 1];
        // get the next records.
        var next = fRef.startAfter(lastVisible);
        state._sync.fetched[identifier].nextFetchRef = next;
      }).catch(function (error$$1) {
        console.error(error$$1);
        return reject(error$$1);
      });
    });
  },
  serverUpdate: function serverUpdate(_ref13, _ref14) {
    var commit = _ref13.commit;
    var change = _ref14.change,
        id = _ref14.id,
        _ref14$doc = _ref14.doc,
        doc = _ref14$doc === undefined ? {} : _ref14$doc;

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
  openDBChannel: function openDBChannel(_ref15) {
    var getters = _ref15.getters,
        state = _ref15.state,
        commit = _ref15.commit,
        dispatch = _ref15.dispatch;

    var store = this;
    if (Firebase$1.auth().currentUser) state._sync.signedIn = true;
    var dbRef = getters.dbRef;
    // apply where filters and orderBy
    if (getters.collectionMode) {
      state._conf.sync.where.forEach(function (paramsArr) {
        var _dbRef;

        dbRef = (_dbRef = dbRef).where.apply(_dbRef, toConsumableArray(paramsArr));
      });
      if (state._conf.sync.orderBy.length) {
        var _dbRef2;

        dbRef = (_dbRef2 = dbRef).orderBy.apply(_dbRef2, toConsumableArray(state._conf.sync.orderBy));
      }
    }
    // define handleDoc()
    function handleDoc(change, id, doc, source) {
      change = !change ? 'modified' : change.type;
      // define storeUpdateFn()
      function storeUpdateFn(_doc) {
        return dispatch('serverUpdate', { change: change, id: id, doc: _doc });
      }
      // get user set sync hook function
      var syncHookFn = state._conf.serverChange[change + 'Hook'];
      if (syncHookFn) {
        syncHookFn(storeUpdateFn, doc, id, store, source, change);
      } else {
        storeUpdateFn(doc);
      }
    }
    // make a promise
    return new Promise(function (resolve, reject) {
      dbRef.onSnapshot(function (querySnapshot) {
        var source = querySnapshot.metadata.hasPendingWrites ? 'local' : 'server';
        if (!getters.collectionMode) {
          if (!querySnapshot.data()) {
            // No initial doc found in docMode
            console.log('insert initial doc');
            return dispatch('insertInitialDoc');
          }
          var doc = setDefaultValues(querySnapshot.data(), state._conf.serverChange.defaultValues);
          if (source === 'local') return resolve();
          handleDoc(null, null, doc, source);
          return resolve();
        }
        querySnapshot.docChanges().forEach(function (change) {
          // Don't do anything for local modifications & removals
          if (source === 'local' && (change.type === 'modified' || change.type === 'removed')) {
            return resolve();
          }
          var id = change.doc.id;
          var doc = change.type === 'added' ? setDefaultValues(change.doc.data(), state._conf.serverChange.defaultValues) : change.doc.data();
          handleDoc(change, id, doc, source);
          return resolve();
        });
      }, function (error$$1) {
        state._sync.patching = 'error';
        return reject(error$$1);
      });
    });
  },
  set: function set$$1(_ref16, doc) {
    var commit = _ref16.commit,
        dispatch = _ref16.dispatch,
        getters = _ref16.getters,
        state = _ref16.state;

    if (!doc) return;
    if (!getters.collectionMode) {
      return dispatch('patch', doc);
    }
    var id = getId(doc);
    if (!id || !state._conf.statePropName && !state[id] || state._conf.statePropName && !state[state._conf.statePropName][id]) {
      return dispatch('insert', doc);
    }
    return dispatch('patch', doc);
  },
  insert: function insert(_ref17, doc) {
    var state = _ref17.state,
        getters = _ref17.getters,
        commit = _ref17.commit,
        dispatch = _ref17.dispatch;

    var store = this;
    if (!getters.signedIn) return 'auth/invalid-user-token';
    if (!doc) return;
    var newDoc = getValueFromPayloadPiece(doc);
    if (!newDoc.id) newDoc.id = getters.dbRef.doc().id;
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
  patch: function patch(_ref18, doc) {
    var state = _ref18.state,
        getters = _ref18.getters,
        commit = _ref18.commit,
        dispatch = _ref18.dispatch;

    var store = this;
    if (!doc) return;
    var id = getters.collectionMode ? getId(doc) : undefined;
    var value = getters.collectionMode ? getValueFromPayloadPiece(doc) : doc;
    if (!id && getters.collectionMode) return;
    // add id to value
    if (!value.id) value.id = id;
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
  patchBatch: function patchBatch(_ref19, _ref20) {
    var state = _ref19.state,
        getters = _ref19.getters,
        commit = _ref19.commit,
        dispatch = _ref19.dispatch;
    var doc = _ref20.doc,
        _ref20$ids = _ref20.ids,
        ids = _ref20$ids === undefined ? [] : _ref20$ids;

    var store = this;
    if (!doc) return;
    // define the store update
    function storeUpdateFn(_doc) {
      commit('PATCH_DOC', _doc);
      return dispatch('patchDoc', { ids: ids, doc: _doc });
    }
    // check for hooks
    if (state._conf.sync.patchHook) {
      return state._conf.sync.patchHook(storeUpdateFn, doc, store);
    }
    return storeUpdateFn(doc);
  },
  delete: function _delete(_ref21, id) {
    var state = _ref21.state,
        getters = _ref21.getters,
        commit = _ref21.commit,
        dispatch = _ref21.dispatch;

    var store = this;
    // define the store update
    function storeUpdateFn(_id) {
      // id is a path
      var pathDelete = _id.includes('.') || !getters.collectionMode;
      if (pathDelete) {
        var path = _id;
        if (!path) return error('actionsDeleteMissingPath');
        commit('DELETE_PROP', path);
        return dispatch('deleteProp', path);
      }
      if (!_id) return error('actionsDeleteMissingId');
      commit('DELETE_DOC', _id);
      return dispatch('deleteDoc', _id);
    }
    // check for hooks
    if (state._conf.sync.deleteHook) {
      return state._conf.sync.deleteHook(storeUpdateFn, id, store);
    }
    return storeUpdateFn(id);
  },
  _stopPatching: function _stopPatching(_ref22) {
    var state = _ref22.state,
        commit = _ref22.commit;

    if (state._sync.stopPatchingTimeout) {
      clearTimeout(state._sync.stopPatchingTimeout);
    }
    state._sync.stopPatchingTimeout = setTimeout(function (_) {
      state._sync.patching = false;
    }, 300);
  },
  _startPatching: function _startPatching(_ref23) {
    var state = _ref23.state,
        commit = _ref23.commit;

    if (state._sync.stopPatchingTimeout) {
      clearTimeout(state._sync.stopPatchingTimeout);
    }
    state._sync.patching = true;
  }
};

function iniActions () {
  var userActions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return Object.assign({}, actions, userActions);
}

/**
 * Checks all props of an object and deletes guarded and non-fillables.
 *
 * @param {object}  obj       the target object to check
 * @param {array}   fillables an array of strings, with the props which should be allowed on returned object
 * @param {array}   guard     an array of strings, with the props which should NOT be allowed on returned object
 *
 * @returns {object} the cleaned object after deleting guard and non-fillables
 */
function checkFillables (obj) {
  var fillables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var guard = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (!isWhat.isObject(obj)) return obj;
  if (fillables.length) {
    Object.keys(obj).forEach(function (key) {
      if (!fillables.includes(key)) {
        delete obj[key];
      }
    });
  }
  guard.forEach(function (key) {
    delete obj[key];
  });
  return obj;
}

var getters = {
  signedIn: function signedIn(state, getters, rootState, rootGetters) {
    var requireUser = state._conf.firestorePath.includes('{userId}');
    if (!requireUser) return true;
    return state._sync.signedIn;
  },
  dbRef: function dbRef(state, getters, rootState, rootGetters) {
    var path = void 0;
    var requireUser = state._conf.firestorePath.includes('{userId}');
    if (requireUser) {
      if (!getters.signedIn) return false;
      if (!Firebase.auth().currentUser) return false;
      var userId = Firebase.auth().currentUser.uid;
      path = state._conf.firestorePath.replace('{userId}', userId);
    } else {
      path = state._conf.firestorePath;
    }
    return getters.collectionMode ? Firebase.firestore().collection(path) : Firebase.firestore().doc(path);
  },
  storeRef: function storeRef(state, getters, rootState) {
    var path = state._conf.statePropName ? state._conf.moduleName + '/' + state._conf.statePropName : state._conf.moduleName;
    return vuexEasyAccess.getDeepRef(rootState, path);
  },
  collectionMode: function collectionMode(state, getters, rootState) {
    return state._conf.firestoreRefType.toLowerCase() === 'collection';
  },
  prepareForPatch: function prepareForPatch(state, getters, rootState, rootGetters) {
    return function () {
      var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      // get relevant data from the storeRef
      var collectionMode = getters.collectionMode;
      if (!collectionMode) ids.push('singleDoc');
      // returns {object} -> {id: data}
      return ids.reduce(function (carry, id) {
        var patchData = {};
        // retrieve full object
        if (!Object.keys(doc).length) {
          patchData = collectionMode ? getters.storeRef[id] : getters.storeRef;
        } else {
          patchData = doc;
        }
        patchData = copyObj(patchData);
        patchData = checkFillables(patchData, state._conf.sync.fillables, state._conf.sync.guard);
        carry[id] = patchData;
        return carry;
      }, {});
    };
  },
  prepareForInsert: function prepareForInsert(state, getters, rootState, rootGetters) {
    return function () {
      var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      items = copyObj(items);
      return items.reduce(function (carry, item) {
        item = checkFillables(item, state._conf.sync.fillables, state._conf.sync.guard);
        carry.push(item);
        return carry;
      }, []);
    };
  },
  prepareInitialDocForInsert: function prepareInitialDocForInsert(state, getters, rootState, rootGetters) {
    return function (doc) {
      doc = copyObj(doc);
      doc = checkFillables(doc, state._conf.sync.fillables, state._conf.sync.guard);
      return doc;
    };
  }
};

function iniGetters () {
  var userGetters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return Object.assign({}, getters, userGetters);
}

function errorCheck(config) {
  var reqProps = ['firestorePath', 'moduleName'];
  reqProps.forEach(function (prop) {
    if (!config[prop]) {
      console.error('Missing ' + prop + ' from your config!');
      return false;
    }
  });
  if (/(\.|\/)/.test(config.statePropName)) {
    console.error('statePropName must only include letters from [a-z]');
    return false;
  }
  if (/\./.test(config.moduleName)) {
    console.error('moduleName must only include letters from [a-z] and forward slashes \'/\'');
    return false;
  }
  return true;
}

/**
 * A function that returns a vuex module object with seamless 2-way sync for firestore.
 *
 * @param {object} userConfig Takes a config object as per ...
 * @returns {object} the module ready to be included in your vuex store
 */
function iniModule (userConfig) {
  var conf = merge(defaultConfig, userConfig);
  if (!errorCheck(conf)) return;
  var userState = conf.state;
  var userMutations = conf.mutations;
  var userActions = conf.actions;
  var userGetters = conf.getters;
  delete conf.state;
  delete conf.mutations;
  delete conf.actions;
  delete conf.getters;

  var docContainer = {};
  if (conf.statePropName) docContainer[conf.statePropName] = {};
  var state = merge(initialState$2, userState, docContainer, { _conf: conf });
  return {
    namespaced: true,
    state: state,
    mutations: iniMutations(userMutations, merge(initialState$2, userState)),
    actions: iniActions(userActions),
    getters: iniGetters(userGetters)
  };
}

function createFirestores (userConfig) {
  return function (store) {
    // Get an array of config files
    if (!isWhat.isArray(userConfig)) userConfig = [userConfig];
    // Create a module for each config file
    userConfig.forEach(function (config) {
      var moduleName = vuexEasyAccess.getKeysFromPath(config.moduleName);
      store.registerModule(moduleName, iniModule(config));
    });
  };
}

var easyFirestores = createFirestores([pokemonBox, mainCharacter]);

var storeObj = {
  plugins: [easyFirestores]
};

Vue.use(Vuex);
var store = new Vuex.Store(storeObj);

store.dispatch('pokemonBox/openDBChannel');
store.dispatch('mainCharacter/openDBChannel');

exports.default = store;

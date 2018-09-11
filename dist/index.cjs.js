'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isWhat = require('is-what');
var nanomerge = _interopDefault(require('nanomerge'));
var vuexEasyAccess = require('vuex-easy-access');
var merge = _interopDefault(require('merge-anything'));
var findAndReplace = _interopDefault(require('find-and-replace-anything'));
var Firebase = _interopDefault(require('firebase/app'));
require('firebase/firestore');
require('firebase/auth');

// import deepAssign from 'deep-object-assign-with-reduce'
// const mergeOptions = require('merge-options')

function merge$1() {
  // check if all are objects
  var l = arguments.length;

  for (l; l > 0; l--) {
    var item = l - 1 < 0 || arguments.length <= l - 1 ? undefined : arguments[l - 1];

    if (!isWhat.isObject(item)) {
      console.error('trying to merge a non-object: ', item);
      return item;
    }
  }

  return nanomerge.apply(void 0, arguments); // settings for 'deepmerge'
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
    },
    // HOOKS for local batch changes:
    insertBatchHook: function insertBatchHook(updateStore, docs, store) {
      return updateStore(docs);
    },
    patchBatchHook: function patchBatchHook(updateStore, doc, ids, store) {
      return updateStore(doc, ids);
    },
    deleteBatchHook: function deleteBatchHook(updateStore, ids, store) {
      return updateStore(ids);
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

var initialState = {
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
      debounceTimer: null
    },
    fetched: {},
    stopPatchingTimeout: null
  }
};

function error (error) {
  return error;
}

var mutations = {
  SET_PATHVARS: function SET_PATHVARS(state, pathVars) {
    var self = this;
    Object.keys(pathVars).forEach(function (key) {
      self._vm.$set(state._sync.pathVariables, key, pathVars[key]);
    });
  },
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

    if (!ref) return error('patchNoRef');
    return Object.keys(doc).forEach(function (key) {
      // Merge if exists
      var newVal = isWhat.isObject(ref[key]) && isWhat.isObject(doc[key]) ? merge(ref[key], doc[key]) : doc[key];

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function mergeRecursively(defaultValues, obj) {
  if (!isWhat.isObject(obj)) return obj; // define newObject to merge all values upon

  var newObject = isWhat.isObject(defaultValues) ? Object.keys(defaultValues).reduce(function (carry, key) {
    var targetVal = findAndReplace(defaultValues[key], '%convertTimestamp%', null);
    if (!Object.keys(obj).includes(key)) carry[key] = targetVal;
    return carry;
  }, {}) : {};
  return Object.keys(obj).reduce(function (carry, key) {
    var newVal = obj[key];
    var targetVal = defaultValues[key]; // early return when targetVal === undefined

    if (targetVal === undefined) {
      carry[key] = newVal;
      return carry;
    } // convert to new Date() if defaultValue == '%convertTimestamp%'


    if (targetVal === '%convertTimestamp%') {
      // firestore timestamps
      if (isWhat.isObject(newVal) && isWhat.isFunction(newVal.toDate)) {
        carry[key] = newVal.toDate();
        return carry;
      } // strings


      if (isWhat.isString(newVal) && isWhat.isDate(new Date(newVal))) {
        carry[key] = new Date(newVal);
        return carry;
      }
    } // When newVal is an object do the merge recursively


    if (isWhat.isObject(newVal)) {
      carry[key] = mergeRecursively(targetVal, newVal);
      return carry;
    } // all the rest


    carry[key] = newVal;
    return carry;
  }, newObject);
}
/**
 * Sets default values on an object
 *
 * @param {object} obj on which to set the default values
 * @param {object} defaultValues the default values
 */


function setDefaultValues (obj, defaultValues) {
  if (!isWhat.isObject(defaultValues)) console.error('Trying to merge target:', obj, 'onto a non-object:', defaultValues);
  if (!isWhat.isObject(obj)) console.error('Trying to merge a non-object:', obj, 'onto:', defaultValues);
  return mergeRecursively(defaultValues, obj); // return merge(defaultValues, obj)
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

  return {
    done: done,
    refresh: refresh
  };
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
 * @param {string} syncStackProp the prop of _sync.syncStack[syncStackProp]
 * @param {number} count the current count
 * @param {number} maxCount the max count of the batch
 * @param {object} state the store's state, will be edited!
 * @returns {array} the targets for the batch. Add this array length to the count
 */

function grabUntilApiLimit(syncStackProp, count, maxCount, state) {
  var targets = state._sync.syncStack[syncStackProp]; // Check if there are more than maxCount batch items already

  if (count >= maxCount) {
    // already at maxCount or more, leave items in syncstack, and don't add anything to batch
    targets = [];
  } else {
    // Convert to array if targets is an object (eg. updates)
    var targetIsObject = isWhat.isObject(targets);

    if (targetIsObject) {
      targets = Object.values(targets);
    } // Batch supports only until maxCount items


    var grabCount = maxCount - count;
    var targetsOK = targets.slice(0, grabCount);
    var targetsLeft = targets.slice(grabCount); // Put back the remaining items over maxCount

    if (targetIsObject) {
      targetsLeft = Object.values(targetsLeft).reduce(function (carry, update) {
        var id = update.id;
        carry[id] = update;
        return carry;
      }, {});
    }

    state._sync.syncStack[syncStackProp] = targetsLeft; // Define the items we'll add below

    targets = targetsOK;
  }

  return targets;
}
/**
 * Create a Firebase batch from a syncStack to be passed inside the state param.
 *
 * @export
 * @param {object} state The state which should have this prop: `_sync.syncStack[syncStackProp]`. syncStackProp can be 'updates', 'propDeletions', 'deletions', 'inserts'.
 * @param {object} dbRef The Firestore dbRef of the 'doc' or 'collection'
 * @param {Bool} collectionMode Very important: is the firebase dbRef a 'collection' or 'doc'?
 * @param {string} userId for `created_by` / `updated_by`
 * @param {number} batchMaxCount The max count of the batch. Defaults to 500 as per Firestore documentation.
 * @returns {object} A Firebase firestore batch object.
 */

function makeBatchFromSyncstack(state, dbRef, collectionMode, userId) {
  var batchMaxCount = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 500;
  var batch = Firebase.firestore().batch();
  var log = {};
  var count = 0; // Add 'updates' to batch

  var updates = grabUntilApiLimit('updates', count, batchMaxCount, state);
  log['updates: '] = updates;
  count = count + updates.length; // Add to batch

  updates.forEach(function (item) {
    var id = item.id;
    var docRef = collectionMode ? dbRef.doc(id) : dbRef;
    var itemToUpdate = flattenToPaths(item);
    itemToUpdate.updated_at = Firebase.firestore.FieldValue.serverTimestamp();
    itemToUpdate.updated_by = userId;
    batch.update(docRef, itemToUpdate);
  }); // Add 'propDeletions' to batch

  var propDeletions = grabUntilApiLimit('propDeletions', count, batchMaxCount, state);
  log['prop deletions: '] = propDeletions;
  count = count + propDeletions.length; // Add to batch

  propDeletions.forEach(function (path) {
    var docRef = dbRef;

    if (collectionMode) {
      var id = path.substring(0, path.indexOf('.'));
      path = path.substring(path.indexOf('.') + 1);
      docRef = dbRef.doc(id);
    }

    var updateObj = {};
    updateObj[path] = Firebase.firestore.FieldValue.delete();
    updateObj.updated_at = Firebase.firestore.FieldValue.serverTimestamp();
    updateObj.updated_by = userId;
    batch.update(docRef, updateObj);
  }); // Add 'deletions' to batch

  var deletions = grabUntilApiLimit('deletions', count, batchMaxCount, state);
  log['deletions: '] = deletions;
  count = count + deletions.length; // Add to batch

  deletions.forEach(function (id) {
    var docRef = dbRef.doc(id);
    batch.delete(docRef);
  }); // Add 'inserts' to batch

  var inserts = grabUntilApiLimit('inserts', count, batchMaxCount, state);
  log['inserts: '] = inserts;
  count = count + inserts.length; // Add to batch

  inserts.forEach(function (item) {
    item.created_at = Firebase.firestore.FieldValue.serverTimestamp();
    item.created_by = userId;
    var newRef = dbRef.doc(item.id);
    batch.set(newRef, item);
  }); // log the batch contents

  console.group('Created a firestore batch with:');
  Object.keys(log).forEach(function (key) {
    console.log(key, log[key]);
  });
  console.groupEnd(); //

  return batch;
}
/**
 * Check if the string starts and ends with '{' and '}' to swap out for variable value saved in state.
 *
 * @export
 * @param {string} pathPiece eg. 'groups' or '{groupId}'
 * @returns {Bool}
 */

function isPathVar(pathPiece) {
  return pathPiece[0] === '{' && pathPiece[pathPiece.length - 1] === '}';
}
/**
 * Get the variable name of a piece of path: eg. return 'groupId' if pathPiece is '{groupId}'
 *
 * @export
 * @param {string} pathPiece eg. 'groups' or '{groupId}'
 * @returns {string} returns 'groupId' in case of '{groupId}'
 */

function pathVarKey(pathPiece) {
  return isPathVar(pathPiece) ? pathPiece.slice(1, -1) : pathPiece;
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

    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      ids: [],
      doc: {}
    },
        _ref2$id = _ref2.id,
        id = _ref2$id === void 0 ? '' : _ref2$id,
        _ref2$ids = _ref2.ids,
        ids = _ref2$ids === void 0 ? [] : _ref2$ids,
        doc = _ref2.doc;

    // 0. payload correction (only arrays)
    if (!isWhat.isArray(ids)) return console.error('ids needs to be an array');
    if (id) ids.push(id);
    if (doc.id) delete doc.id; // 1. Prepare for patching

    var syncStackItems = getters.prepareForPatch(ids, doc); // 2. Push to syncStack

    Object.keys(syncStackItems).forEach(function (id) {
      var newVal = !state._sync.syncStack.updates[id] ? syncStackItems[id] : merge(state._sync.syncStack.updates[id], syncStackItems[id]);
      state._sync.syncStack.updates[id] = newVal;
    }); // 3. Create or refresh debounce

    return dispatch('handleSyncStackDebounce');
  },
  deleteDoc: function deleteDoc(_ref3) {
    var state = _ref3.state,
        getters = _ref3.getters,
        commit = _ref3.commit,
        dispatch = _ref3.dispatch;
    var ids = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    // 0. payload correction (only arrays)
    if (!isWhat.isArray(ids)) ids = [ids]; // 1. Prepare for patching
    // 2. Push to syncStack

    var deletions = state._sync.syncStack.deletions.concat(ids);

    state._sync.syncStack.deletions = deletions;
    if (!state._sync.syncStack.deletions.length) return; // 3. Create or refresh debounce

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

    if (!state._sync.syncStack.propDeletions.length) return; // 3. Create or refresh debounce

    return dispatch('handleSyncStackDebounce');
  },
  insertDoc: function insertDoc(_ref5) {
    var state = _ref5.state,
        getters = _ref5.getters,
        commit = _ref5.commit,
        dispatch = _ref5.dispatch;
    var docs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    // 0. payload correction (only arrays)
    if (!isWhat.isArray(docs)) docs = [docs]; // 1. Prepare for patching

    var syncStack = getters.prepareForInsert(docs); // 2. Push to syncStack

    var inserts = state._sync.syncStack.inserts.concat(syncStack);

    state._sync.syncStack.inserts = inserts; // 3. Create or refresh debounce

    return dispatch('handleSyncStackDebounce');
  },
  insertInitialDoc: function insertInitialDoc(_ref6) {
    var state = _ref6.state,
        getters = _ref6.getters,
        commit = _ref6.commit,
        dispatch = _ref6.dispatch;
    // 0. only docMode
    if (getters.collectionMode) return; // 1. Prepare for insert

    var initialDoc = getters.storeRef ? getters.storeRef : {};
    var doc = getters.prepareInitialDocForInsert(initialDoc); // 2. insert

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
        state = _ref8.state;
    var collectionMode = getters.collectionMode;
    var dbRef = getters.dbRef;
    var userId = state._sync.userId;
    var batch = makeBatchFromSyncstack(state, dbRef, collectionMode, userId);
    dispatch('_startPatching');
    state._sync.syncStack.debounceTimer = null;
    return new Promise(function (resolve, reject) {
      batch.commit().then(function (res) {
        var remainingSyncStack = Object.keys(state._sync.syncStack.updates).length + state._sync.syncStack.deletions.length + state._sync.syncStack.inserts.length + state._sync.syncStack.propDeletions.length;

        if (remainingSyncStack) {
          dispatch('batchSync');
        }

        dispatch('_stopPatching');
        return resolve(); // // Fetch the item if it was added as an Archived item:
        // if (item.archived) {
        //   get_ters.dbRef.doc(res.id).get().then(doc => {
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
        return reject(error$$1);
      });
    });
  },
  fetch: function fetch(_ref9) {
    var state = _ref9.state,
        getters = _ref9.getters,
        commit = _ref9.commit,
        dispatch = _ref9.dispatch;

    var _ref10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      whereFilters: [],
      orderBy: [] // whereFilters: [['archived', '==', true]]
      // orderBy: ['done_date', 'desc']

    },
        _ref10$whereFilters = _ref10.whereFilters,
        whereFilters = _ref10$whereFilters === void 0 ? [] : _ref10$whereFilters,
        _ref10$orderBy = _ref10.orderBy,
        orderBy = _ref10$orderBy === void 0 ? [] : _ref10$orderBy;

    return new Promise(function (resolve, reject) {
      console.log('[fetch] starting');
      if (!getters.signedIn) return resolve();
      var identifier = JSON.stringify({
        whereFilters: whereFilters,
        orderBy: orderBy
      });
      var fetched = state._sync.fetched[identifier]; // We've never fetched this before:

      if (!fetched) {
        var ref = getters.dbRef; // apply where filters and orderBy

        whereFilters.forEach(function (paramsArr) {
          var _ref11;

          ref = (_ref11 = ref).where.apply(_ref11, _toConsumableArray(paramsArr));
        });

        if (orderBy.length) {
          var _ref12;

          ref = (_ref12 = ref).orderBy.apply(_ref12, _toConsumableArray(orderBy));
        }

        state._sync.fetched[identifier] = {
          ref: ref,
          done: false,
          retrievedFetchRefs: [],
          nextFetchRef: null
        };
      }

      var fRequest = state._sync.fetched[identifier]; // We're already done fetching everything:

      if (fRequest.done) {
        console.log('done fetching');
        return resolve({
          done: true
        });
      } // attach fetch filters


      var fRef = state._sync.fetched[identifier].ref;

      if (fRequest.nextFetchRef) {
        // get next ref if saved in state
        fRef = state._sync.fetched[identifier].nextFetchRef;
      }

      fRef = fRef.limit(state._conf.fetch.docLimit); // Stop if all records already fetched

      if (fRequest.retrievedFetchRefs.includes(fRef)) {
        console.error('Already retrieved this part.');
        return resolve();
      } // make fetch request


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

        state._sync.fetched[identifier].retrievedFetchRefs.push(fRef); // Get the last visible document


        resolve(querySnapshot);
        var lastVisible = docs[docs.length - 1]; // get the next records.

        var next = fRef.startAfter(lastVisible);
        state._sync.fetched[identifier].nextFetchRef = next;
      }).catch(function (error$$1) {
        console.error(error$$1);
        return reject(error$$1);
      });
    });
  },
  fetchAndAdd: function fetchAndAdd(_ref13) {
    var state = _ref13.state,
        getters = _ref13.getters,
        commit = _ref13.commit,
        dispatch = _ref13.dispatch;

    var _ref14 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      whereFilters: [],
      orderBy: [] // whereFilters: [['archived', '==', true]]
      // orderBy: ['done_date', 'desc']

    },
        _ref14$whereFilters = _ref14.whereFilters,
        whereFilters = _ref14$whereFilters === void 0 ? [] : _ref14$whereFilters,
        _ref14$orderBy = _ref14.orderBy,
        orderBy = _ref14$orderBy === void 0 ? [] : _ref14$orderBy;

    return dispatch('fetch', {
      whereFilters: whereFilters,
      orderBy: orderBy
    }).then(function (querySnapshot) {
      if (querySnapshot.done === true) return querySnapshot;

      if (isWhat.isFunction(querySnapshot.forEach)) {
        querySnapshot.forEach(function (_doc) {
          var id = _doc.id;
          var doc = setDefaultValues(_doc.data(), state._conf.serverChange.defaultValues);
          doc.id = id;
          commit('INSERT_DOC', doc);
        });
      }
    });
  },
  serverUpdate: function serverUpdate(_ref15, _ref16) {
    var commit = _ref15.commit;
    var change = _ref16.change,
        id = _ref16.id,
        _ref16$doc = _ref16.doc,
        doc = _ref16$doc === void 0 ? {} : _ref16$doc;
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
  openDBChannel: function openDBChannel(_ref17, pathVariables) {
    var getters = _ref17.getters,
        state = _ref17.state,
        commit = _ref17.commit,
        dispatch = _ref17.dispatch;
    var store = this; // set state for pathVariables

    if (pathVariables && isWhat.isObject(pathVariables)) commit('SET_PATHVARS', pathVariables); // get userId

    var userId = null;

    if (Firebase.auth().currentUser) {
      state._sync.signedIn = true;
      userId = Firebase.auth().currentUser.uid;
      state._sync.userId = userId;
    } // getters.dbRef should already have pathVariables swapped out


    var dbRef = getters.dbRef; // apply where filters and orderBy

    if (getters.collectionMode) {
      state._conf.sync.where.forEach(function (paramsArr) {
        var _dbRef;

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
        dbRef = (_dbRef = dbRef).where.apply(_dbRef, _toConsumableArray(paramsArr));
      });

      if (state._conf.sync.orderBy.length) {
        var _dbRef2;

        dbRef = (_dbRef2 = dbRef).orderBy.apply(_dbRef2, _toConsumableArray(state._conf.sync.orderBy));
      }
    } // define handleDoc()


    function handleDoc() {
      var _changeType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'modified';

      var id = arguments.length > 1 ? arguments[1] : undefined;
      var doc = arguments.length > 2 ? arguments[2] : undefined;
      var source = arguments.length > 3 ? arguments[3] : undefined;

      // define storeUpdateFn()
      function storeUpdateFn(_doc) {
        return dispatch('serverUpdate', {
          change: _changeType,
          id: id,
          doc: _doc
        });
      } // get user set sync hook function


      var syncHookFn = state._conf.serverChange[_changeType + 'Hook'];

      if (syncHookFn) {
        syncHookFn(storeUpdateFn, doc, id, store, source, _changeType);
      } else {
        storeUpdateFn(doc);
      }
    } // make a promise


    return new Promise(function (resolve, reject) {
      dbRef.onSnapshot(function (querySnapshot) {
        var source = querySnapshot.metadata.hasPendingWrites ? 'local' : 'server';

        if (!getters.collectionMode) {
          if (!querySnapshot.data()) {
            // No initial doc found in docMode
            console.log('inserting initial doc');
            dispatch('insertInitialDoc');
            return resolve();
          }

          var doc = setDefaultValues(querySnapshot.data(), state._conf.serverChange.defaultValues);
          if (source === 'local') return resolve();
          handleDoc(null, null, doc, source);
          return resolve();
        }

        querySnapshot.docChanges().forEach(function (change) {
          var changeType = change.type; // Don't do anything for local modifications & removals

          if (source === 'local' && (changeType === 'modified' || changeType === 'removed')) {
            return resolve();
          }

          var id = change.doc.id;
          var doc = changeType === 'added' ? setDefaultValues(change.doc.data(), state._conf.serverChange.defaultValues) : change.doc.data();
          handleDoc(changeType, id, doc, source);
        });
        return resolve();
      }, function (error$$1) {
        state._sync.patching = 'error';
        return reject(error$$1);
      });
    });
  },
  set: function set(_ref18, doc) {
    var commit = _ref18.commit,
        dispatch = _ref18.dispatch,
        getters = _ref18.getters,
        state = _ref18.state;
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
  insert: function insert(_ref19, doc) {
    var state = _ref19.state,
        getters = _ref19.getters,
        commit = _ref19.commit,
        dispatch = _ref19.dispatch;
    var store = this;
    if (!getters.signedIn) return 'auth/invalid-user-token';
    if (!doc) return;
    var newDoc = getValueFromPayloadPiece(doc);
    if (!newDoc.id) newDoc.id = getters.dbRef.doc().id; // define the store update

    function storeUpdateFn(_doc) {
      commit('INSERT_DOC', _doc);
      return dispatch('insertDoc', _doc);
    } // check for hooks


    if (state._conf.sync.insertHook) {
      return state._conf.sync.insertHook(storeUpdateFn, newDoc, store);
    }

    return storeUpdateFn(newDoc);
  },
  insertBatch: function insertBatch(_ref20, docs) {
    var state = _ref20.state,
        getters = _ref20.getters,
        commit = _ref20.commit,
        dispatch = _ref20.dispatch;
    var store = this;
    if (!getters.signedIn) return 'auth/invalid-user-token';
    if (!isWhat.isArray(docs) || !docs.length) return;
    var newDocs = docs.reduce(function (carry, _doc) {
      var newDoc = getValueFromPayloadPiece(_doc);
      if (!newDoc.id) newDoc.id = getters.dbRef.doc().id;
      carry.push(newDoc);
      return carry;
    }, []); // define the store update

    function storeUpdateFn(_docs) {
      _docs.forEach(function (_doc) {
        commit('INSERT_DOC', _doc);
      });

      return dispatch('insertDoc', _docs);
    } // check for hooks


    if (state._conf.sync.insertBatchHook) {
      return state._conf.sync.insertBatchHook(storeUpdateFn, newDocs, store);
    }

    return storeUpdateFn(newDocs);
  },
  patch: function patch(_ref21, doc) {
    var state = _ref21.state,
        getters = _ref21.getters,
        commit = _ref21.commit,
        dispatch = _ref21.dispatch;
    var store = this;
    if (!doc) return;
    var id = getters.collectionMode ? getId(doc) : undefined;
    var value = getters.collectionMode ? getValueFromPayloadPiece(doc) : doc;
    if (!id && getters.collectionMode) return; // add id to value

    if (!value.id) value.id = id; // define the store update

    function storeUpdateFn(_val) {
      commit('PATCH_DOC', _val);
      return dispatch('patchDoc', {
        id: id,
        doc: _val
      });
    } // check for hooks


    if (state._conf.sync.patchHook) {
      return state._conf.sync.patchHook(storeUpdateFn, value, store);
    }

    return storeUpdateFn(value);
  },
  patchBatch: function patchBatch(_ref22, _ref23) {
    var state = _ref22.state,
        getters = _ref22.getters,
        commit = _ref22.commit,
        dispatch = _ref22.dispatch;
    var doc = _ref23.doc,
        _ref23$ids = _ref23.ids,
        ids = _ref23$ids === void 0 ? [] : _ref23$ids;
    var store = this;
    if (!doc) return; // define the store update

    function storeUpdateFn(_doc, _ids) {
      _ids.forEach(function (_id) {
        commit('PATCH_DOC', _objectSpread({
          id: _id
        }, _doc));
      });

      return dispatch('patchDoc', {
        ids: _ids,
        doc: _doc
      });
    } // check for hooks


    if (state._conf.sync.patchBatchHook) {
      return state._conf.sync.patchBatchHook(storeUpdateFn, doc, ids, store);
    }

    return storeUpdateFn(doc, ids);
  },
  delete: function _delete(_ref24, id) {
    var state = _ref24.state,
        getters = _ref24.getters,
        commit = _ref24.commit,
        dispatch = _ref24.dispatch;
    if (!id) return;
    var store = this;

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
    } // check for hooks


    if (state._conf.sync.deleteHook) {
      return state._conf.sync.deleteHook(storeUpdateFn, id, store);
    }

    return storeUpdateFn(id);
  },
  deleteBatch: function deleteBatch(_ref25, ids) {
    var state = _ref25.state,
        getters = _ref25.getters,
        commit = _ref25.commit,
        dispatch = _ref25.dispatch;
    if (!isWhat.isArray(ids)) return;
    if (!ids.length) return;
    var store = this; // define the store update

    function storeUpdateFn(_ids) {
      _ids.forEach(function (_id) {
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
      });
    } // check for hooks


    if (state._conf.sync.deleteBatchHook) {
      return state._conf.sync.deleteBatchHook(storeUpdateFn, ids, store);
    }

    return storeUpdateFn(ids);
  },
  _stopPatching: function _stopPatching(_ref26) {
    var state = _ref26.state,
        commit = _ref26.commit;

    if (state._sync.stopPatchingTimeout) {
      clearTimeout(state._sync.stopPatchingTimeout);
    }

    state._sync.stopPatchingTimeout = setTimeout(function (_) {
      state._sync.patching = false;
    }, 300);
  },
  _startPatching: function _startPatching(_ref27) {
    var state = _ref27.state,
        commit = _ref27.commit;

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
  return Object.keys(obj).reduce(function (carry, key) {
    // check fillables
    if (fillables.length && !fillables.includes(key)) {
      return carry;
    } // check guard


    guard.push('_conf');
    guard.push('_sync');

    if (guard.includes(key)) {
      return carry;
    }

    carry[key] = obj[key];
    return carry;
  }, {});
}

var getters = {
  signedIn: function signedIn(state, getters, rootState, rootGetters) {
    var requireUser = state._conf.firestorePath.includes('{userId}');

    if (!requireUser) return true;
    return state._sync.signedIn;
  },
  dbRef: function dbRef(state, getters, rootState, rootGetters) {
    var path; // check for userId replacement

    var requireUser = state._conf.firestorePath.includes('{userId}');

    if (requireUser) {
      if (!getters.signedIn) return false;
      if (!Firebase.auth().currentUser) return false;
      var userId = Firebase.auth().currentUser.uid;
      path = state._conf.firestorePath.replace('{userId}', userId);
    } else {
      path = state._conf.firestorePath;
    } // replace pathVariables


    if (Object.keys(state._sync.pathVariables).length) {
      Object.keys(state._sync.pathVariables).forEach(function (_pathVarKey) {
        var pathVarVal = state._sync.pathVariables[_pathVarKey];
        path = path.replace("/{".concat(_pathVarKey, "}/"), "/".concat(pathVarVal, "/"));
      });
    }

    return getters.collectionMode ? Firebase.firestore().collection(path) : Firebase.firestore().doc(path);
  },
  storeRef: function storeRef(state, getters, rootState) {
    var path = state._conf.statePropName ? "".concat(state._conf.moduleName, "/").concat(state._conf.statePropName) : state._conf.moduleName;
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
      if (!collectionMode) ids.push('singleDoc'); // returns {object} -> {id: data}

      return ids.reduce(function (carry, id) {
        var patchData = {}; // retrieve full object

        if (!Object.keys(doc).length) {
          patchData = collectionMode ? getters.storeRef[id] : getters.storeRef;
        } else {
          patchData = doc;
        }

        patchData = checkFillables(patchData, state._conf.sync.fillables, state._conf.sync.guard);
        patchData.id = id;
        carry[id] = patchData;
        return carry;
      }, {});
    };
  },
  prepareForInsert: function prepareForInsert(state, getters, rootState, rootGetters) {
    return function () {
      var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return items.reduce(function (carry, item) {
        item = checkFillables(item, state._conf.sync.fillables, state._conf.sync.guard);
        carry.push(item);
        return carry;
      }, []);
    };
  },
  prepareInitialDocForInsert: function prepareInitialDocForInsert(state, getters, rootState, rootGetters) {
    return function (doc) {
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
  var errors = [];
  var reqProps = ['firestorePath', 'moduleName'];
  reqProps.forEach(function (prop) {
    if (!config[prop]) {
      errors.push("Missing `".concat(prop, "` in your module!"));
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
      errors.push("We found `".concat(prop, "` on your module, are you sure this shouldn't be inside a prop called `sync`?"));
    }
  });
  var serverChangeProps = ['modifiedHook', 'defaultValues', 'addedHook', 'removedHook'];
  serverChangeProps.forEach(function (prop) {
    if (config[prop]) {
      errors.push("We found `".concat(prop, "` on your module, are you sure this shouldn't be inside a prop called `serverChange`?"));
    }
  });
  var fetchProps = ['docLimit'];
  fetchProps.forEach(function (prop) {
    if (config[prop]) {
      errors.push("We found `".concat(prop, "` on your module, are you sure this shouldn't be inside a prop called `fetch`?"));
    }
  });
  var numberProps = ['docLimit'];
  numberProps.forEach(function (prop) {
    var _prop = config.fetch[prop];
    if (!isWhat.isNumber(_prop)) errors.push("`".concat(prop, "` should be a Number, but is not."));
  });
  var functionProps = ['insertHook', 'patchHook', 'deleteHook', 'insertBatchHook', 'patchBatchHook', 'deleteBatchHook', 'addedHook', 'modifiedHook', 'removedHook'];
  functionProps.forEach(function (prop) {
    var _prop = syncProps.includes(prop) ? config.sync[prop] : config.serverChange[prop];

    if (!isWhat.isFunction(_prop)) errors.push("`".concat(prop, "` should be a Function, but is not."));
  });
  var objectProps = ['sync', 'serverChange', 'defaultValues', 'fetch'];
  objectProps.forEach(function (prop) {
    var _prop = prop === 'defaultValues' ? config.serverChange[prop] : config[prop];

    if (!isWhat.isObject(_prop)) errors.push("`".concat(prop, "` should be an Object, but is not."));
  });
  var stringProps = ['firestorePath', 'firestoreRefType', 'moduleName', 'statePropName'];
  stringProps.forEach(function (prop) {
    var _prop = config[prop];
    if (!isWhat.isString(_prop)) errors.push("`".concat(prop, "` should be a String, but is not."));
  });
  var arrayProps = ['where', 'orderBy', 'fillables', 'guard'];
  arrayProps.forEach(function (prop) {
    var _prop = config.sync[prop];
    if (!isWhat.isArray(_prop)) errors.push("`".concat(prop, "` should be an Array, but is not."));
  });

  if (errors.length) {
    console.group('[vuex-easy-firestore] ERRORS:');
    console.error("Module: ".concat(config.moduleName));
    errors.forEach(function (e) {
      return console.error(' - ', e);
    });
    console.groupEnd('Please check your vuex-easy-firebase Module.');
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
  var conf = merge$1(defaultConfig, userConfig);
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
  var state = merge$1(initialState, userState, docContainer, {
    _conf: conf
  });
  return {
    namespaced: true,
    state: state,
    mutations: iniMutations(userMutations, merge$1(initialState, userState)),
    actions: iniActions(userActions),
    getters: iniGetters(userGetters)
  };
}

function index (userConfig) {
  return function (store) {
    // Get an array of config files
    if (!isWhat.isArray(userConfig)) userConfig = [userConfig]; // Create a module for each config file

    userConfig.forEach(function (config) {
      var moduleName = vuexEasyAccess.getKeysFromPath(config.moduleName);
      store.registerModule(moduleName, iniModule(config));
    });
  };
}

exports.default = index;

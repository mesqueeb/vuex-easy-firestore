(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('is-what'), require('vuex-easy-access'), require('firebase/app'), require('firebase/firestore'), require('firebase/auth')) :
  typeof define === 'function' && define.amd ? define(['is-what', 'vuex-easy-access', 'firebase/app', 'firebase/firestore', 'firebase/auth'], factory) :
  (global.VuexEasyFirestore = factory(global.isWhat,global.vuexEasyAccess,global.Firebase));
}(this, (function (isWhat,vuexEasyAccess,Firebase) { 'use strict';

  Firebase = Firebase && Firebase.hasOwnProperty('default') ? Firebase['default'] : Firebase;

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

  var nanoclone = require('nanoclone').default;

  function toArray$1(object) {
    var result = [];

    for (var i = 0; i < object.length; ++i) {
      result.push(object[i]);
    }

    return result;
  }

  var types = [{
    name: 'primitive',

    is: function is(el) {
      var type = typeof el === 'undefined' ? 'undefined' : _typeof(el);

      return type === 'number' || type === 'string' || type === 'boolean';
    },

    default: 'default',

    merge: {
      default: function _default(merger, a, b) {
        return b;
      }
    }
  }, {
    name: 'object',

    is: function is(el) {
      return el !== null && (typeof el === 'undefined' ? 'undefined' : _typeof(el)) === 'object';
    },

    default: 'deep',

    merge: {
      deep: function deep(merger, a, b) {
        var result = {};

        var keys = {
          a: Object.keys(a),
          b: Object.keys(b)
        };

        keys.a.concat(keys.b).forEach(function (key) {
          result[key] = merger(a[key], b[key]);
        });

        return result;
      }
    }
  }, {
    name: 'array',

    is: function is(el) {
      return Array.isArray(el);
    },

    default: 'replace',

    merge: {
      merge: function merge(merger, a, b) {
        var result = [];

        for (var i = 0; i < Math.max(a.length, b.length); ++i) {
          result.push(merger(a[i], b[i]));
        }

        return result;
      },

      replace: function replace(merger, a, b) {
        return nanoclone(b);
      },

      concat: function concat(merger, a, b) {
        return [].concat(a).concat(b);
      }
    }
  }];

  function merge(config) {
    if (!config) {
      config = {};
    }

    config = {
      strategy: config.strategy || {}
    };

    function determineType(a, b) {
      for (var i = types.length - 1; i >= 0; --i) {
        var type = types[i];

        if (type.is(a) && type.is(b)) {
          return type;
        } else if (type.is(a) || type.is(b)) {
          break;
        }
      }

      return null;
    }

    function merger(a, b) {
      if (b === void 0) {
        return nanoclone(a);
      }

      var type = determineType(a, b);

      if (!type) {
        return nanoclone(b);
      }

      var strategy = config.strategy[type.name] || type.default;

      return type.merge[strategy](merger, a, b);
    }

    return function () {
      var elements = toArray$1(arguments);

      return elements.reduceRight(function (result, element) {
        return merger(element, result);
      });
    };
  }

  function wrapper() {
    var args = toArray$1(arguments);

    // custom config
    if (args.length === 1) {
      return merge(args[0]);
    }

    return merge().apply(null, args);
  }

  function merge$1() {
    var l = arguments.length;
    for (l; l > 0; l--) {
      var item = arguments.length <= l - 1 ? undefined : arguments[l - 1];
      if (!isWhat.isObject(item)) {
        console.error('trying to merge a non-object: ', item);
        return item;
      }
    }
    return wrapper.apply(undefined, arguments);
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

  var initialState = {
    _sync: {
      signedIn: false,
      patching: false,
      syncStack: {
        updates: {},
        deletions: [],
        inserts: [],
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
      if (state._conf.firestoreRefType.toLowerCase() === 'doc') return;
      if (state._conf.statePropName) {
        this._vm.$set(state[state._conf.statePropName], doc.id, doc);
      } else {
        this._vm.$set(state, doc.id, doc);
      }
    },
    PATCH_DOC: function PATCH_DOC(state, doc) {
      var _this = this;

      // When patching in single 'doc' mode
      if (state._conf.firestoreRefType.toLowerCase() === 'doc') {
        // if no target prop is the state
        if (!state._conf.statePropName) {
          return Object.keys(doc).forEach(function (key) {
            // Merge if exists
            var newVal = state[key] === undefined || !isWhat.isObject(state[key]) || !isWhat.isObject(doc[key]) ? doc[key] : merge$1(state[key], doc[key]);
            _this._vm.$set(state, key, newVal);
          });
        }
        // state[state._conf.statePropName] will always be an empty object by default
        state[state._conf.statePropName] = merge$1(state[state._conf.statePropName], doc);
        return;
      }
      // Patching in 'collection' mode
      // get the doc ref
      var docRef = state._conf.statePropName ? state[state._conf.statePropName][doc.id] : state[doc.id];
      // Merge if exists
      var newVal = docRef === undefined || !isWhat.isObject(docRef) || !isWhat.isObject(doc) ? doc : merge$1(docRef, doc);
      if (state._conf.statePropName) {
        this._vm.$set(state[state._conf.statePropName], doc.id, newVal);
      } else {
        this._vm.$set(state, doc.id, newVal);
      }
    },
    DELETE_DOC: function DELETE_DOC(state, id) {
      if (state._conf.firestoreRefType.toLowerCase() === 'doc') return;
      if (state._conf.statePropName) {
        this._vm.$delete(state[state._conf.statePropName], id);
      } else {
        this._vm.$delete(state, id);
      }
    }
  };

  function iniMutations () {
    var userMutations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var state = arguments[1];

    var vuexEasyMutations = vuexEasyAccess.defaultMutations(state);
    return Object.assign({}, vuexEasyMutations, mutations, userMutations);
  }

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
    return merge$1(defaultValues, obj);
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
      if (!isWhat.isArray(ids)) return console.log('ids needs to be an array');
      if (id) ids.push(id);
      if (doc.id) delete doc.id;

      // 1. Prepare for patching
      var syncStackItems = getters.prepareForPatch(ids, doc);

      // 2. Push to syncStack
      Object.keys(syncStackItems).forEach(function (id) {
        var newVal = !state._sync.syncStack.updates[id] ? syncStackItems[id] : merge$1(state._sync.syncStack.updates[id], syncStackItems[id]);
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
      var syncStackIds = getters.prepareForDeletion(ids);

      // 2. Push to syncStack
      var deletions = state._sync.syncStack.deletions.concat(syncStackIds);
      state._sync.syncStack.deletions = deletions;

      if (!state._sync.syncStack.deletions.length) return;
      // 3. Create or refresh debounce
      return dispatch('handleSyncStackDebounce');
    },
    insertDoc: function insertDoc(_ref4) {
      var state = _ref4.state,
          getters = _ref4.getters,
          commit = _ref4.commit,
          dispatch = _ref4.dispatch;
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
    handleSyncStackDebounce: function handleSyncStackDebounce(_ref5) {
      var state = _ref5.state,
          commit = _ref5.commit,
          dispatch = _ref5.dispatch,
          getters = _ref5.getters;

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
    batchSync: function batchSync(_ref6) {
      var getters = _ref6.getters,
          commit = _ref6.commit,
          dispatch = _ref6.dispatch,
          state = _ref6.state;

      var collectionMode = getters.collectionMode;
      var dbRef = getters.dbRef;
      var batch = Firebase.firestore().batch();
      var count = 0;
      // Add 'updateds' to batch
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
        var updatesLeft = updates.slice(500, -1);
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
        console.log('fields → ', fields);
        batch.update(docRef, fields);
      });
      // Add 'deletions' to batch
      var deletions = copyObj(state._sync.syncStack.deletions);
      // Check if there are more than 500 batch items already
      if (count >= 500) {
        // already at 500 or more, leave items in syncstack, and don't add anything to batch
        deletions = [];
      } else {
        // Batch supports only until 500 items
        var deletionsAmount = 500 - count;
        var deletionsOK = deletions.slice(0, deletionsAmount);
        var deletionsLeft = deletions.slice(deletionsAmount, -1);
        // Put back the remaining items over 500
        state._sync.syncStack.deletions = deletionsLeft;
        count = count + deletionsOK.length;
        // Define the items we'll add below
        deletions = deletionsOK;
      }
      // Add to batch
      deletions.forEach(function (id) {
        var docRef = dbRef.doc(id);
        batch.delete(docRef);
      });
      // Add 'inserts' to batch
      var inserts = copyObj(state._sync.syncStack.inserts);
      // Check if there are more than 500 batch items already
      if (count >= 500) {
        // already at 500 or more, leave items in syncstack, and don't add anything to batch
        inserts = [];
      } else {
        // Batch supports only until 500 items
        var insertsAmount = 500 - count;
        var insertsOK = inserts.slice(0, insertsAmount);
        var insertsLeft = inserts.slice(insertsAmount, -1);
        // Put back the remaining items over 500
        state._sync.syncStack.inserts = insertsLeft;
        count = count + insertsOK.length;
        // Define the items we'll add below
        inserts = insertsOK;
      }
      // Add to batch
      inserts.forEach(function (item) {
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
          console.log('[batchSync] RESOLVED:', res, '\n          updates: ', Object.keys(updates).length ? updates : {}, '\n          deletions: ', deletions.length ? deletions : [], '\n          inserts: ', inserts.length ? inserts : []);
          var remainingSyncStack = Object.keys(state._sync.syncStack.updates).length + state._sync.syncStack.deletions.length + state._sync.syncStack.inserts.length;
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
        }).catch(function (error) {
          state._sync.patching = 'error';
          state._sync.syncStack.debounceTimer = null;
          return reject();
        });
      });
    },
    fetch: function fetch(_ref7) {
      var state = _ref7.state,
          getters = _ref7.getters,
          commit = _ref7.commit,
          dispatch = _ref7.dispatch;

      var _ref8 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { whereFilters: [], orderBy: []
        // whereFilters: [['archived', '==', true]]
        // orderBy: ['done_date', 'desc']
      },
          _ref8$whereFilters = _ref8.whereFilters,
          whereFilters = _ref8$whereFilters === undefined ? [] : _ref8$whereFilters,
          _ref8$orderBy = _ref8.orderBy,
          orderBy = _ref8$orderBy === undefined ? [] : _ref8$orderBy;

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
            var _ref9;

            ref = (_ref9 = ref).where.apply(_ref9, toConsumableArray(paramsArr));
          });
          if (orderBy.length) {
            var _ref10;

            ref = (_ref10 = ref).orderBy.apply(_ref10, toConsumableArray(orderBy));
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
        }).catch(function (error) {
          console.log(error);
          return reject(error);
        });
      });
    },
    serverUpdate: function serverUpdate(_ref11, _ref12) {
      var commit = _ref11.commit;
      var change = _ref12.change,
          id = _ref12.id,
          _ref12$doc = _ref12.doc,
          doc = _ref12$doc === undefined ? {} : _ref12$doc;

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
    openDBChannel: function openDBChannel(_ref13) {
      var getters = _ref13.getters,
          state = _ref13.state,
          commit = _ref13.commit,
          dispatch = _ref13.dispatch;

      var store = this;
      if (Firebase.auth().currentUser) state._sync.signedIn = true;
      var collectionMode = getters.collectionMode;
      var dbRef = getters.dbRef;
      // apply where filters and orderBy
      if (state._conf.firestoreRefType.toLowerCase() !== 'doc') {
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
          if (!collectionMode) {
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
        }, function (error) {
          state._sync.patching = 'error';
          return reject(error);
        });
      });
    },
    set: function set$$1(_ref14, doc) {
      var commit = _ref14.commit,
          dispatch = _ref14.dispatch,
          getters = _ref14.getters,
          state = _ref14.state;

      if (!doc) return;
      if (!getters.collectionMode) {
        return dispatch('patch', doc);
      }
      if (!doc.id || !state._conf.statePropName && !state[doc.id] || state._conf.statePropName && !state[state._conf.statePropName][doc.id]) {
        return dispatch('insert', doc);
      }
      return dispatch('patch', doc);
    },
    insert: function insert(_ref15, doc) {
      var state = _ref15.state,
          getters = _ref15.getters,
          commit = _ref15.commit,
          dispatch = _ref15.dispatch;

      var store = this;
      if (!doc) return;
      if (!doc.id) doc.id = getters.dbRef.doc().id;
      // define the store update
      function storeUpdateFn(_doc) {
        commit('INSERT_DOC', _doc);
        return dispatch('insertDoc', _doc);
      }
      // check for hooks
      if (state._conf.sync.insertHook) {
        return state._conf.sync.insertHook(storeUpdateFn, doc, store);
      }
      return storeUpdateFn(doc);
    },
    patch: function patch(_ref16, doc) {
      var state = _ref16.state,
          getters = _ref16.getters,
          commit = _ref16.commit,
          dispatch = _ref16.dispatch;

      var store = this;
      if (!doc) return;
      if (!doc.id && getters.collectionMode) return;
      // define the store update
      function storeUpdateFn(_doc) {
        commit('PATCH_DOC', _doc);
        return dispatch('patchDoc', { id: _doc.id, doc: _doc });
      }
      // check for hooks
      if (state._conf.sync.patchHook) {
        return state._conf.sync.patchHook(storeUpdateFn, doc, store);
      }
      return storeUpdateFn(doc);
    },
    patchBatch: function patchBatch(_ref17, _ref18) {
      var state = _ref17.state,
          getters = _ref17.getters,
          commit = _ref17.commit,
          dispatch = _ref17.dispatch;
      var doc = _ref18.doc,
          _ref18$ids = _ref18.ids,
          ids = _ref18$ids === undefined ? [] : _ref18$ids;

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
    delete: function _delete(_ref19, id) {
      var state = _ref19.state,
          getters = _ref19.getters,
          commit = _ref19.commit,
          dispatch = _ref19.dispatch;

      var store = this;
      // define the store update
      function storeUpdateFn(_id) {
        commit('DELETE_DOC', _id);
        return dispatch('deleteDoc', _id);
      }
      // check for hooks
      if (state._conf.sync.deleteHook) {
        return state._conf.sync.deleteHook(storeUpdateFn, id, store);
      }
      return storeUpdateFn(id);
    },
    _stopPatching: function _stopPatching(_ref20) {
      var state = _ref20.state,
          commit = _ref20.commit;

      if (state._sync.stopPatchingTimeout) {
        clearTimeout(state._sync.stopPatchingTimeout);
      }
      state._sync.stopPatchingTimeout = setTimeout(function (_) {
        state._sync.patching = false;
      }, 300);
    },
    _startPatching: function _startPatching(_ref21) {
      var state = _ref21.state,
          commit = _ref21.commit;

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
      return state._sync.signedIn;
    },
    dbRef: function dbRef(state, getters, rootState, rootGetters) {
      if (!getters.signedIn) return false;
      if (!Firebase.auth().currentUser) return false;
      var userId = Firebase.auth().currentUser.uid;
      var path = state._conf.firestorePath.replace('{userId}', userId);
      return state._conf.firestoreRefType.toLowerCase() === 'collection' ? Firebase.firestore().collection(path) : Firebase.firestore().doc(path);
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
          patchData.updated_at = Firebase.firestore.FieldValue.serverTimestamp();
          carry[id] = patchData;
          return carry;
        }, {});
      };
    },
    prepareForDeletion: function prepareForDeletion(state, getters, rootState, rootGetters) {
      return function () {
        var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        return ids.reduce(function (carry, id) {
          carry.push(id);
          return carry;
        }, []);
      };
    },
    prepareForInsert: function prepareForInsert(state, getters, rootState, rootGetters) {
      return function () {
        var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        items = copyObj(items);
        return items.reduce(function (carry, item) {
          item = checkFillables(item, state._conf.sync.fillables, state._conf.sync.guard);
          item.created_at = Firebase.firestore.FieldValue.serverTimestamp();
          item.created_by = rootGetters['user/id'];
          carry.push(item);
          return carry;
        }, []);
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
    var state = merge$1(initialState, userState, docContainer, { _conf: conf });
    return {
      namespaced: true,
      state: state,
      mutations: iniMutations(userMutations, merge$1(initialState, userState)),
      actions: iniActions(userActions),
      getters: iniGetters(userGetters)
    };
  }

  function createEasyFirestore(userConfig) {
    return function (store) {
      // Get an array of config files
      if (!isWhat.isArray(userConfig)) userConfig = [userConfig];
      // Create a module for each config file
      userConfig.forEach(function (config) {
        var moduleName = vuexEasyAccess.getKeysFromPath(config.moduleName);
        store.registerModule(moduleName, iniModule(config));
      });
      store.setDoc = function (path, payload) {
        return store.dispatch(path + '/setDoc', payload);
      };
      store.insert = function (path, payload) {
        return store.dispatch(path + '/insert', payload);
      };
      store.patch = function (path, payload) {
        return store.dispatch(path + '/patch', payload);
      };
      store.patchBatch = function (path, payload) {
        return store.dispatch(path + '/patchBatch', payload);
      };
      store.delete = function (path, payload) {
        return store.dispatch(path + '/delete', payload);
      };
    };
  }

  return createEasyFirestore;

})));
//# sourceMappingURL=index.umd.js.map

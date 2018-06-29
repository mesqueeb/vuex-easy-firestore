var VuexEasyFirestore = (function (vuexEasyAccess,isWhat,Firebase) {
	'use strict';

	Firebase = Firebase && Firebase.hasOwnProperty('default') ? Firebase['default'] : Firebase;

	var isMergeableObject = function isMergeableObject(value) {
		return isNonNullObject(value)
			&& !isSpecial(value)
	};

	function isNonNullObject(value) {
		return !!value && typeof value === 'object'
	}

	function isSpecial(value) {
		var stringValue = Object.prototype.toString.call(value);

		return stringValue === '[object RegExp]'
			|| stringValue === '[object Date]'
			|| isReactElement(value)
	}

	// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
	var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
	var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

	function isReactElement(value) {
		return value.$$typeof === REACT_ELEMENT_TYPE
	}

	function emptyTarget(val) {
		return Array.isArray(val) ? [] : {}
	}

	function cloneUnlessOtherwiseSpecified(value, options) {
		return (options.clone !== false && options.isMergeableObject(value))
			? deepmerge(emptyTarget(value), value, options)
			: value
	}

	function defaultArrayMerge(target, source, options) {
		return target.concat(source).map(function(element) {
			return cloneUnlessOtherwiseSpecified(element, options)
		})
	}

	function mergeObject(target, source, options) {
		var destination = {};
		if (options.isMergeableObject(target)) {
			Object.keys(target).forEach(function(key) {
				destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
			});
		}
		Object.keys(source).forEach(function(key) {
			if (!options.isMergeableObject(source[key]) || !target[key]) {
				destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
			} else {
				destination[key] = deepmerge(target[key], source[key], options);
			}
		});
		return destination
	}

	function deepmerge(target, source, options) {
		options = options || {};
		options.arrayMerge = options.arrayMerge || defaultArrayMerge;
		options.isMergeableObject = options.isMergeableObject || isMergeableObject;

		var sourceIsArray = Array.isArray(source);
		var targetIsArray = Array.isArray(target);
		var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

		if (!sourceAndTargetTypesMatch) {
			return cloneUnlessOtherwiseSpecified(source, options)
		} else if (sourceIsArray) {
			return options.arrayMerge(target, source, options)
		} else {
			return mergeObject(target, source, options)
		}
	}

	deepmerge.all = function deepmergeAll(array, options) {
		if (!Array.isArray(array)) {
			throw new Error('first argument should be an array')
		}

		return array.reduce(function(prev, next) {
			return deepmerge(prev, next, options)
		}, {})
	};

	var deepmerge_1 = deepmerge;

	// import deepmerge from '../../node_modules/deepmerge/dist/es.js'

	/**
	 * Makes sure to overwrite arrays completely instead of concatenating with a merge(). Usage: merge(arr1, arr2, {arrayOverwrite: true})
	 *
	 * @returns the latter array passed
	 */
	function overwriteMerge(destinationArray, sourceArray, options) {
	  return sourceArray;
	}

	function merge(a, b, options) {
	  if (options && options.arrayOverwrite) {
	    return deepmerge_1(a, b, { arrayMerge: overwriteMerge });
	  }
	  return deepmerge_1(a, b);
	}

	merge.all = function (array, options) {
	  if (options && options.arrayOverwrite) {
	    return deepmerge_1.all(array, { arrayMerge: overwriteMerge });
	  }
	  return deepmerge_1.all(array);
	};

	/**
	 * A function executed during the 2 way sync when docs are added/modified/deleted. NEEDS TO EXECUTE FIRST PARAM! You can use this function to do a conditional check on the documents to decide if/when to execute the store update.
	 *
	 * @param {function} storeUpdateFn this is the function that will make changes to your vuex store. Takes no params.
	 * @param {object} store the store for usage with `store.dispatch`, `store.commit`, `store.getters` etc.
	 * @param {string} id the doc id returned in `change.doc.id` (see firestore documentation for more info)
	 * @param {object} doc the doc returned in `change.doc.data()` (see firestore documentation for more info)
	 * @param {string} source of the change. Can be 'local' or 'server'
	 */
	function syncHook(storeUpdateFn, store, id, doc, source, change) {
	  // throw error if you want to stop the document in your store from being modified
	  // do some stuff
	  storeUpdateFn();
	  // do some stuff
	}

	var defaultConfig = {
	  moduleNameSpace: 'firestore',
	  // this is the vuex module path that will be created
	  docsStateProp: '',
	  // this is the state property where your docs will end up inside the module
	  // when not set your doc's props will be set directly to your vuex module's state
	  firestorePath: '',
	  // this is the firestore collection path to your documents. You can use `{userId}` which will be replaced with `Firebase.auth().uid`
	  firestoreRefType: 'collection', // or 'doc'
	  // depending if what you want to sync is a whole collection or a single doc
	  vuexUserPath: '',
	  // the path where your firebase user gets saved in vuex. Required to be able to have reactivity after login.
	  sync: {
	    type: '2way',
	    // '2way' only ('read only' not yet integrated)
	    where: [], // only applicable on 'collection'
	    orderBy: [], // only applicable on 'collection'
	    defaultValues: {},
	    // About defaultValues:
	    // These are the default properties that will be set on each doc that's synced to the store or comes out of the store.
	    // You HAVE to set all props you want to be reactive on beforehand!
	    // These values are only set when you have items who don't have the props defined in defaultValues upon retrieval
	    // The retrieved document will be deep merged on top of these default values
	    added: syncHook,
	    modified: syncHook,
	    removed: syncHook
	    // see the syncHook function above to see what you can do
	    // for firestoreRefType: 'doc' only use 'modified' syncHook
	  },
	  fetch: {
	    docLimit: 50 // defaults to 50
	  },
	  insert: {
	    checkCondition: null,
	    // A function where you can check something and force stopping the operation if you return `false`
	    // Eg. checkCondition (doc, docs) { return (doc.something != 'something') },
	    fillables: [],
	    guard: []
	  },
	  patch: {
	    checkCondition: null,
	    // A function where you can check something and force stopping the operation if you return `false`
	    // Eg. checkCondition (id, fields, docs) { return (doc.something != 'something') },
	    fillables: [],
	    guard: []
	  },
	  delete: {
	    checkCondition: null
	    // A function where you can check something and force stopping the operation if you return `false`
	    // Eg. checkCondition (id, docs) { return (doc.something != 'something') },
	  }
	};

	var initialState = {
	  // user: null,
	  syncStack: {
	    updates: {},
	    deletions: [],
	    inserts: [],
	    debounceTimer: null
	  },
	  retrievedFetchRefs: [],
	  nextFetchRef: null,
	  patching: false,
	  doneFetching: false,
	  stopPatchingTimeout: null
	};

	var mutations = {
	  resetSyncStack: function resetSyncStack(state) {
	    state.syncStack = {
	      updates: {},
	      deletions: [],
	      inserts: [],
	      debounceTimer: null
	    };
	  },
	  INSERT_DOC: function INSERT_DOC(state, doc) {
	    if (state.firestoreRefType.toLowerCase() === 'doc') return;
	    this._vm.$set(state[state.docsStateProp], doc.id, doc);
	  },
	  PATCH_DOC: function PATCH_DOC(state, doc) {
	    var _this = this;

	    if (state.firestoreRefType.toLowerCase() === 'doc') {
	      if (!state.docsStateProp) {
	        return Object.keys(doc).forEach(function (key) {
	          // Merge if exists
	          var newVal = state[key] === undefined ? doc[key] : !isWhat.isObject(state[key]) || !isWhat.isObject(doc[key]) ? doc[key] : merge(state[key], doc[key], { arrayOverwrite: true });
	          _this._vm.$set(state, key, newVal);
	        });
	      }
	      // state[state.docsStateProp] will always be an empty object by default
	      state[state.docsStateProp] = merge(state[state.docsStateProp], doc, { arrayOverwrite: true });
	      return;
	    }
	    // Merge if exists
	    var newVal = state[state.docsStateProp][doc.id] === undefined ? doc : !isWhat.isObject(state[state.docsStateProp][doc.id]) || !isWhat.isObject(doc) ? doc : merge(state[state.docsStateProp][doc.id], doc, { arrayOverwrite: true });
	    this._vm.$set(state[state.docsStateProp], doc.id, newVal);
	  },
	  DELETE_DOC: function DELETE_DOC(state, id) {
	    if (state.firestoreRefType.toLowerCase() === 'doc') return;
	    this._vm.$delete(state[state.docsStateProp], id);
	  }
	};

	function iniMutations () {
	  var userMutations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var state = arguments[1];

	  var vuexEasyMutations = vuexEasyAccess.defaultMutations(state);
	  return Object.assign({}, vuexEasyMutations, mutations, userMutations);
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
	  return merge(defaultValues, obj, { arrayOverwrite: true });
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

	var actions = {
	  patchDoc: function patchDoc(_ref) {
	    var state = _ref.state,
	        getters = _ref.getters,
	        commit = _ref.commit,
	        dispatch = _ref.dispatch;

	    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { ids: [], fields: [] },
	        _ref2$id = _ref2.id,
	        id = _ref2$id === undefined ? '' : _ref2$id,
	        _ref2$ids = _ref2.ids,
	        ids = _ref2$ids === undefined ? [] : _ref2$ids,
	        _ref2$field = _ref2.field,
	        field = _ref2$field === undefined ? '' : _ref2$field,
	        _ref2$fields = _ref2.fields,
	        fields = _ref2$fields === undefined ? [] : _ref2$fields;

	    // 0. payload correction (only arrays)
	    if (!isWhat.isArray(ids) || !isWhat.isArray(fields)) return console.log('ids, fields need to be arrays');
	    if (!isWhat.isString(field)) return console.log('field needs to be a string');
	    if (id) ids.push(id);
	    if (field) fields.push(field);

	    // 1. Prepare for patching
	    var syncStackItems = getters.prepareForPatch(ids, fields);

	    // 2. Push to syncStack
	    Object.keys(syncStackItems).forEach(function (id) {
	      var newVal = !state.syncStack.updates[id] ? syncStackItems[id] : merge(state.syncStack.updates[id], syncStackItems[id], { arrayOverwrite: true });
	      state.syncStack.updates[id] = newVal;
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
	    var deletions = state.syncStack.deletions.concat(syncStackIds);
	    commit('SET_SYNCSTACK.DELETIONS', deletions);

	    if (!state.syncStack.deletions.length) return;
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
	    var inserts = state.syncStack.inserts.concat(syncStack);
	    commit('SET_SYNCSTACK.INSERTS', inserts);

	    // 3. Create or refresh debounce
	    return dispatch('handleSyncStackDebounce');
	  },
	  handleSyncStackDebounce: function handleSyncStackDebounce(_ref5) {
	    var state = _ref5.state,
	        commit = _ref5.commit,
	        dispatch = _ref5.dispatch,
	        getters = _ref5.getters;

	    if (!getters.signedIn) return false;
	    if (!state.syncStack.debounceTimer) {
	      var debounceTimer = startDebounce(1000);
	      debounceTimer.done.then(function (_) {
	        return dispatch('batchSync');
	      });
	      commit('SET_SYNCSTACK.DEBOUNCETIMER', debounceTimer);
	    }
	    state.syncStack.debounceTimer.refresh();
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
	    var updatesOriginal = copyObj(state.syncStack.updates);
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
	      state.syncStack.updates = updatesLeft.reduce(function (carry, item) {
	        carry[item.id] = item;
	        delete item.id;
	        return carry;
	      }, {});
	      updates = updatesOK;
	    } else {
	      state.syncStack.updates = {};
	      count = updates.length;
	    }
	    // Add to batch
	    updates.forEach(function (item) {
	      var id = item.id;
	      var docRef = collectionMode ? dbRef.doc(id) : dbRef;
	      var fields = item.fields;
	      batch.update(docRef, fields);
	    });
	    // Add 'deletions' to batch
	    var deletions = copyObj(state.syncStack.deletions);
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
	      commit('SET_SYNCSTACK.DELETIONS', deletionsLeft);
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
	    var inserts = copyObj(state.syncStack.inserts);
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
	      commit('SET_SYNCSTACK.INSERTS', insertsLeft);
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
	    commit('SET_SYNCSTACK.DEBOUNCETIMER', null);
	    return new Promise(function (resolve, reject) {
	      batch.commit().then(function (res) {
	        console.log('[batchSync] RESOLVED:', res, '\n          updates: ', Object.keys(updates).length ? updates : {}, '\n          deletions: ', deletions.length ? deletions : [], '\n          inserts: ', inserts.length ? inserts : []);
	        var remainingSyncStack = Object.keys(state.syncStack.updates).length + state.syncStack.deletions.length + state.syncStack.inserts.length;
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
	        commit('SET_PATCHING', 'error');
	        commit('SET_SYNCSTACK.DEBOUNCETIMER', null);
	        return reject();
	      });
	    });
	  },
	  fetch: function fetch(_ref7) {
	    var state = _ref7.state,
	        getters = _ref7.getters,
	        commit = _ref7.commit;

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
	      if (state.doneFetching) {
	        console.log('done fetching');
	        return resolve('fetchedAll');
	      }
	      // attach fetch filters
	      var fetchRef = void 0;
	      if (state.nextFetchRef) {
	        // get next ref if saved in state
	        fetchRef = state.nextFetchRef;
	      } else {
	        // apply where filters and orderBy
	        fetchRef = getters.dbRef;
	        whereFilters.forEach(function (paramsArr) {
	          var _fetchRef;

	          fetchRef = (_fetchRef = fetchRef).where.apply(_fetchRef, toConsumableArray(paramsArr));
	        });
	        if (orderBy.length) {
	          var _fetchRef2;

	          fetchRef = (_fetchRef2 = fetchRef).orderBy.apply(_fetchRef2, toConsumableArray(orderBy));
	        }
	      }
	      fetchRef = fetchRef.limit(state.fetch.docLimit);
	      // Stop if all records already fetched
	      if (state.retrievedFetchRefs.includes(fetchRef)) {
	        console.log('Already retrieved this part.');
	        return resolve();
	      }
	      // make fetch request
	      fetchRef.get().then(function (querySnapshot) {
	        var docs = querySnapshot.docs;
	        if (docs.length === 0) {
	          commit('SET_DONEFETCHING', true);
	          return resolve('fetchedAll');
	        }
	        if (docs.length < state.fetch.docLimit) {
	          commit('SET_DONEFETCHING', true);
	        }
	        commit('PUSH_RETRIEVEDFETCHREFS', fetchRef);
	        // Get the last visible document
	        resolve(querySnapshot);
	        var lastVisible = docs[docs.length - 1];
	        // get the next records.
	        var next = fetchRef.startAfter(lastVisible);
	        commit('SET_NEXTFETCHREF', next);
	      }).catch(function (error) {
	        console.log(error);
	        return reject(error);
	      });
	    });
	  },
	  serverUpdate: function serverUpdate(_ref9, _ref10) {
	    var commit = _ref9.commit;
	    var change = _ref10.change,
	        id = _ref10.id,
	        _ref10$doc = _ref10.doc,
	        doc = _ref10$doc === undefined ? {} : _ref10$doc;

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
	  openDBChannel: function openDBChannel(_ref11) {
	    var getters = _ref11.getters,
	        state = _ref11.state,
	        commit = _ref11.commit,
	        dispatch = _ref11.dispatch;

	    var collectionMode = getters.collectionMode;
	    var dbRef = getters.dbRef;
	    // apply where filters and orderBy
	    if (state.firestoreRefType.toLowerCase() !== 'doc') {
	      state.sync.where.forEach(function (paramsArr) {
	        var _dbRef;

	        dbRef = (_dbRef = dbRef).where.apply(_dbRef, toConsumableArray(paramsArr));
	      });
	      if (state.sync.orderBy.length) {
	        var _dbRef2;

	        dbRef = (_dbRef2 = dbRef).orderBy.apply(_dbRef2, toConsumableArray(state.sync.orderBy));
	      }
	    }
	    // define handleDoc()
	    function handleDoc(change, id, doc, source) {
	      change = !change ? 'modified' : change.type;
	      // define storeUpdateFn()
	      function storeUpdateFn() {
	        return dispatch('serverUpdate', { change: change, id: id, doc: doc });
	      }
	      // get user set sync hook function
	      var syncHookFn = state.sync[change];
	      if (syncHookFn) {
	        syncHookFn(storeUpdateFn, this, id, doc, source);
	      } else {
	        storeUpdateFn();
	      }
	    }
	    // make a promise
	    return new Promise(function (resolve, reject) {
	      dbRef.onSnapshot(function (querySnapshot) {
	        var source = querySnapshot.metadata.hasPendingWrites ? 'local' : 'server';
	        if (!collectionMode) {
	          var doc = setDefaultValues(querySnapshot.data(), state.sync.defaultValues);
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
	          var doc = change.type === 'added' ? setDefaultValues(change.doc.data(), state.sync.defaultValues) : change.doc.data();
	          handleDoc(change, id, doc, source);
	          return resolve();
	        });
	      }, function (error) {
	        commit('SET_PATCHING', 'error');
	        return reject(error);
	      });
	    });
	  },
	  set: function set$$1(_ref12, doc) {
	    var commit = _ref12.commit,
	        dispatch = _ref12.dispatch,
	        getters = _ref12.getters,
	        state = _ref12.state;

	    if (!doc) return;
	    if (!getters.collectionMode) {
	      return dispatch('patch', doc);
	    }
	    if (!doc.id || !state[state.docsStateProp][doc.id]) {
	      return dispatch('insert', doc);
	    }
	    return dispatch('patch', doc);
	  },
	  insert: function insert(_ref13, doc) {
	    var commit = _ref13.commit,
	        dispatch = _ref13.dispatch,
	        getters = _ref13.getters;

	    if (!doc) return;
	    if (!doc.id) doc.id = getters.dbRef.doc().id;
	    commit('INSERT_DOC', doc);
	    return dispatch('insertDoc', doc);
	  },
	  patch: function patch(_ref14, doc) {
	    var commit = _ref14.commit,
	        state = _ref14.state,
	        dispatch = _ref14.dispatch,
	        getters = _ref14.getters;

	    if (!doc) return;
	    if (!doc.id && getters.collectionMode) return;
	    commit('PATCH_DOC', doc);
	    return dispatch('patchDoc', { id: doc.id, fields: Object.keys(doc) });
	  },
	  delete: function _delete(_ref15, id) {
	    var commit = _ref15.commit,
	        dispatch = _ref15.dispatch,
	        getters = _ref15.getters;

	    commit('DELETE_DOC', id);
	    return dispatch('deleteDoc', id);
	  },
	  _stopPatching: function _stopPatching(_ref16) {
	    var state = _ref16.state,
	        commit = _ref16.commit;

	    if (state.stopPatchingTimeout) {
	      clearTimeout(state.stopPatchingTimeout);
	    }
	    state.stopPatchingTimeout = setTimeout(function (_) {
	      commit('SET_PATCHING', false);
	    }, 300);
	  },
	  _startPatching: function _startPatching(_ref17) {
	    var state = _ref17.state,
	        commit = _ref17.commit;

	    if (state.stopPatchingTimeout) {
	      clearTimeout(state.stopPatchingTimeout);
	    }
	    commit('SET_PATCHING', true);
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
	    var user = vuexEasyAccess.getDeepRef(rootState, state.vuexUserPath);
	    return user !== null;
	  },
	  dbRef: function dbRef(state, getters, rootState, rootGetters) {
	    if (!getters.signedIn) return false;
	    var userId = Firebase.auth().currentUser.uid;
	    var path = state.firestorePath.replace('{userId}', userId);
	    return state.firestoreRefType.toLowerCase() === 'collection' ? Firebase.firestore().collection(path) : Firebase.firestore().doc(path);
	  },
	  storeRef: function storeRef(state, getters, rootState) {
	    var path = state.docsStateProp ? state.moduleNameSpace + '/' + state.docsStateProp : state.moduleNameSpace;
	    return vuexEasyAccess.getDeepRef(rootState, path);
	  },
	  collectionMode: function collectionMode(state, getters, rootState) {
	    return state.firestoreRefType.toLowerCase() === 'collection';
	  },
	  prepareForPatch: function prepareForPatch(state, getters, rootState, rootGetters) {
	    return function () {
	      var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	      var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

	      // get relevant data from the storeRef
	      var collectionMode = getters.collectionMode;
	      if (!collectionMode) ids.push('singleDoc');
	      // returns {object} -> {id: data}
	      return ids.reduce(function (carry, id) {
	        // Accept an extra condition to check
	        var check = state.patch.checkCondition;
	        if (check && !check(id, fields, getters.storeRef)) return carry;

	        var patchData = {};
	        // Patch specific fields only
	        if (fields.length) {
	          fields.forEach(function (field) {
	            patchData[field] = collectionMode ? getters.storeRef[id][field] : getters.storeRef[field];
	          });
	          // Patch the whole item
	        } else {
	          patchData = collectionMode ? copyObj(getters.storeRef[id]) : copyObj(getters.storeRef);
	          patchData = checkFillables(patchData, state.patch.fillables, state.patch.guard);
	        }
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
	        // Accept an extra condition to check
	        var check = state.delete.checkCondition;
	        if (check && !check(id, getters.storeRef)) return carry;
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
	        // Accept an extra condition to check
	        var check = state.insert.checkCondition;
	        if (check && !check(item, getters.storeRef)) return carry;

	        item = checkFillables(item, state.insert.fillables, state.insert.guard);
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
	  var reqProps = ['firestorePath', 'vuexUserPath'];
	  reqProps.forEach(function (prop) {
	    console.error('Missing ' + prop + ' from your config!');
	    return false;
	  });
	  if (/(\.|\/)/.test(config.docsStateProp)) {
	    console.error('docsStateProp must only include letters from [a-z]');
	    return false;
	  }
	  if (/\./.test(config.moduleNameSpace)) {
	    console.error('moduleNameSpace must only include letters from [a-z] and forward slashes \'/\'');
	    return false;
	  }
	  return true;
	}

	var vuexBase = { state: null, mutations: null, actions: null, getters: null

	  /**
	   * A function that returns a vuex module object with seamless 2-way sync for firestore.
	   *
	   * @param {object} userConfig Takes a config object as per ...
	   * @returns {object} the module ready to be included in your vuex store
	   */
	};function iniModule (userConfig) {
	  var conf = merge(vuexBase, userConfig, { arrayOverwrite: true });
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
	  if (conf.docsStateProp) docContainer[conf.docsStateProp] = {};
	  var state = merge.all([initialState, defaultConfig, userState, conf, docContainer], { arrayOverwrite: true });

	  return {
	    namespaced: true,
	    state: state,
	    mutations: iniMutations(userMutations, merge(initialState, userState)),
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
	      var moduleNameSpace = vuexEasyAccess.getKeysFromPath(config.moduleNameSpace);
	      store.registerModule(moduleNameSpace, iniModule(config));
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
	    store.delete = function (path, payload) {
	      return store.dispatch(path + '/delete', payload);
	    };
	  };
	}

	return createEasyFirestore;

}(vuexEasyAccess,isWhat,Firebase));
//# sourceMappingURL=index.iife.js.map

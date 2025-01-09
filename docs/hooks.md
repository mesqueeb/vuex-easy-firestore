# Hooks

A hook is a function that is triggered on `insert`, `patch` or `delete`. In this hook function you will receive the doc object _before_ the store mutation occurs. You can do all kind of things:

- modify the docs before they get commited to Vuex
- modify the docs before they get synced to Firestore
- add or delete props (fields) based on conditional checks
- prevent a doc to be added to your Vuex module & Firestore
- allow a doc to be added to Vuex but prevent sync to Firestore
- etc...

## Hooks on local changes

Hooks must be defined inside your vuex module under `sync`. Below are the examples of all possible hooks that will trigger _before_ 'local' changes. Please also check the overview of [execution timings of hooks](#execution-timings-of-hooks) to understand the difference between 'local' and 'server' changes.

```js
{
  // your other vuex-easy-fire config...
  sync: {
    insertHook: function (updateStore, doc, store) { return updateStore(doc) },
    patchHook: function (updateStore, doc, store) { return updateStore(doc) },
    deleteHook: function (updateStore, id, store) { return updateStore(id) },
    // Batches have separate hooks!
    insertBatchHook: function (updateStore, docs, store) { return updateStore(doc) },
    patchBatchHook: function (updateStore, doc, ids, store) { return updateStore(doc, ids) },
    deleteBatchHook: function (updateStore, ids, store) { return updateStore(ids) },
  }
}
```

The `doc` passed in the `insert` and `patch` hooks will also have an `id` field which is either the new id or the id of the doc to be patched.

::: warning You must call `updateStore(doc)` to make the store mutation.
But you may choose not to call this to abort the mutation. If you do not call `updateStore(doc)` nothing will happen.
:::

## Hooks after local changes before sync

Below are the examples of all possible hooks that will trigger _after_ 'local' changes.

Basically when you make a local change you can intercept the change just _before_ it gets synced to Firestore, but still make the change to Vuex.

```js
{
  // place also in the `sync` prop
  sync: {
    insertHookBeforeSync: function (updateFirestore, doc, store) { return updateFirestore(doc) },
    patchHookBeforeSync: function (updateFirestore, doc, store) { return updateFirestore(doc) },
    deleteHookBeforeSync: function (updateFirestore, id, store) { return updateFirestore(id) },
  }
}
```

An example of what happens on a patch call:

1. eg. `dispatch('myModule/patch', data)`
2. `patchHook` is fired
3. if `updateStore` was **not** executed in the hook: abort!
4. the patch is commited to the Vuex module
5. `patchHookBeforeSync` is fired
6. if `updateFirestore` was **not** executed in the hook: abort!
7. the patch is synced to Firestore

## Hooks after server changes

_Hooks after server changes_ work just like _hooks on local changes_ but for changes that have occured on the server. Just as with the hooks for local changes, you can use these hooks to make changes to incoming documents or prevent them from being added to your vuex module.

These hooks will fire not only on modifications and inserts **but also when dispatching `openDBChannel` or `fetchAndAdd` or `fetchById`**. Be sure to check the **execution timings of hooks** below to know when which are executed.

You also have some extra parameters to work with:

- _id:_ the doc id returned in `change.doc.id` (see firestore documentation for more info)
- _doc:_ the doc returned in `change.doc.data()` (see firestore documentation for more info)

```js
{
  // your other vuex-easy-fire config...
  serverChange: {
    addedHook: function (updateStore, doc, id, store) { return updateStore(doc) },
    modifiedHook: function (updateStore, doc, id, store) { return updateStore(doc) },
    removedHook: function (updateStore, doc, id, store) { return updateStore(doc) },
  }
}
```

Please make sure to check the overview of execution timings of hooks, in the next chapter:

## Hooks on openDBChannel / fetch

The "Hooks after server changes" explained above also trigger once on `openDBChannel` and `fetchAndAdd` and `fetchById`. Check the **execution timings of hooks** below to know precisely when which hooks are executed.

## Execution timings of hooks

**Hooks on 'collection' mode**

<table>
  <tr>
    <th>change type</th>
    <th>local</th>
    <th>server</th>
  </tr>
  <tr>
    <td>insertion</td>
    <td>
      <ol>
        <li><code>sync.insertHook</code></li>
        <li><code>sync.insertHookBeforeSync</code></li>
      </ol>
    </td>
    <td><code>serverChange.addedHook</code></td>
  </tr>
  <tr>
    <td>modification</td>
    <td>
      <ol>
        <li><code>sync.patchHook</code></li>
        <li><code>sync.patchHookBeforeSync</code></li>
      </ol>
    </td>
    <td><code>serverChange.modifiedHook</code></td>
  </tr>
  <tr>
    <td>deletion</td>
    <td>
      <ol>
        <li><code>sync.deleteHook</code></li>
        <li><code>serverChange.removedHook</code></li>
      </ol>
    </td>
    <td><code>serverChange.removedHook</code></td>
  </tr>
  <tr>
    <td>
      <ul>on
        <li><code>openDBChannel</code></li>
        <li><code>fetchAndAdd</code></li>
        <li><code>fetchById</code></li>
      </ul>
    </td>
    <td colspan="2"><code>serverChange.addedHook</code> is executed once for each doc</td>
  </tr>
</table>

**Hooks on 'doc' mode**

<table>
  <tr>
    <th>change type</th>
    <th>local</th>
    <th>server</th>
  </tr>
  <tr>
    <td>modification</td>
    <td>
      <ol>
        <li><code>sync.patchHook</code></li>
        <li><code>sync.patchHookBeforeSync</code></li>
      </ol>
    </td>
    <td><code>serverChange.modifiedHook</code></td>
  </tr>
  <tr>
    <td>
      <ul>on
        <li><code>openDBChannel</code></li>
        <li><code>fetchAndAdd</code></li>
      </ul>
    </td>
    <td colspan="2"><code>serverChange.modifiedHook</code> is executed once</td>
  </tr>
</table>

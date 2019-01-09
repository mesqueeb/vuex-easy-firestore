# Hooks

A hook is a function do anything the doc (the doc object) before the store mutation occurs. You can also modify the docs, or add fields based on conditional checks etc. You can even prevent a doc to be added to your vuex module.

## Hooks on local changes

Hooks must be defined inside your vuex module under `sync`. Below are the examples of all possible hooks that will trigger on 'local' changes. Please also check the overview of [execution timings of hooks](#execution-timings-of-hooks) to understand the difference between 'local' and 'server' changes.

```js
{
  // your other vuex-easy-fire config...
  sync: {
    insertHook: function (updateStore, doc, store) { updateStore(doc) },
    patchHook: function (updateStore, doc, store) { updateStore(doc) },
    deleteHook: function (updateStore, id, store) { updateStore(id) },
    // Batches have separate hooks!
    insertBatchHook: function (updateStore, docs, store) { updateStore(doc) },
    patchBatchHook: function (updateStore, doc, ids, store) { updateStore(doc, ids) },
    deleteBatchHook: function (updateStore, ids, store) { updateStore(ids) },
  }
}
```

The `doc` passed in the `insert` and `patch` hooks will also have an `id` field which is either the new id or the id of the doc to be patched.

::: warning You must call `updateStore(doc)` to make the store mutation.
But you may choose not to call this to abort the mutation. If you do not call `updateStore(doc)` nothing will happen.
:::

## Hooks after server changes

_Hooks after server changes_ work just like _hooks on local changes_ but for changes that have occured on the server. Just as with the hooks for local changes, you can use these hooks to make changes to incoming documents or prevent them from being added to your vuex module.

These hooks will fire not only on modifications and inserts **but also when dispatching `openDBChannel` or `fetchAndAdd`**. Be sure to check the **execution timings of hooks** below to know when which are executed.

You also have some extra parameters to work with:

- *id:* the doc id returned in `change.doc.id` (see firestore documentation for more info)
- *doc:* the doc returned in `change.doc.data()` (see firestore documentation for more info)

```js
{
  // your other vuex-easy-fire config...
  serverChange: {
    addedHook: function (updateStore, doc, id, store) { updateStore(doc) },
    modifiedHook: function (updateStore, doc, id, store) { updateStore(doc) },
    removedHook: function (updateStore, doc, id, store) { updateStore(doc) },
  }
}
```

Please make sure to check the overview of execution timings of hooks, in the next chapter:

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
    <td><code>sync.insertHook</code></td>
    <td><code>serverChange.addedHook</code></td>
  </tr>
  <tr>
    <td>modification</td>
    <td><code>sync.patchHook</code></td>
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
    <td>on <code>openDBChannel</code><br>and<br><code>fetchAndAdd</code></td>
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
    <td><code>sync.patchHook</code></td>
    <td><code>serverChange.modifiedHook</code></td>
  </tr>
  <tr>
    <td>on <code>openDBChannel</code><br>and<br><code>fetchAndAdd</code></td>
    <td colspan="2"><code>serverChange.modifiedHook</code> is executed once</td>
  </tr>
</table>

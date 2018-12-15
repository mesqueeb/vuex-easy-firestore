import test from 'ava'
import wait from './helpers/wait'
import {storeSyncConfig as store} from './helpers/index.cjs.js'

const box = store.state.pokemonBox
const boxRef = store.getters['pokemonBox/dbRef']
// const char = store.state.mainCharacter
// const charRef = store.getters['mainCharacter/dbRef']

test('[COLLECTION] sync: insertHook & patchHook', async t => {
  let doc, docR
  const id = boxRef.doc().id
  await store.dispatch('pokemonBox/set', {name: 'Horsea', id, type: ['water']})
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Horsea')
  t.is(box.pokemon[id].addedBeforeInsert, true)
  t.is(box.pokemon[id].addedBeforePatch, undefined)
  await wait(2)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.truthy(doc)
  t.is(doc.name, 'Horsea')
  t.is(doc.addedBeforeInsert, true)
  t.is(doc.addedBeforePatch, undefined)

  await store.dispatch('pokemonBox/set', {id, name: 'James'})
  t.is(box.pokemon[id].addedBeforeInsert, true)
  t.is(box.pokemon[id].addedBeforePatch, true)
  await wait(2)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.is(doc.addedBeforeInsert, true)
  t.is(doc.addedBeforePatch, true)

  await store.dispatch('pokemonBox/delete', id)
  t.falsy(box.pokemon[id])
  await wait(2)
  docR = await boxRef.doc(id).get()
  t.falsy(docR.exists)
})

test('[COLLECTION] sync: deleteHook', async t => {
  const id = 'stopBeforeDelete'
  store.dispatch('pokemonBox/set', {name: 'Ditto', id, type: ['normal']})
  t.truthy(box.pokemon[id])
  store.dispatch('pokemonBox/delete', id)
  t.truthy(box.pokemon[id])
})

test('[DOC] sync: patchHook', async t => {
  t.pass()
})

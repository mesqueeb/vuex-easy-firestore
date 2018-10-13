import store from './helpers/index.cjs.js'
import test from 'ava'

const box = store.state.pokemonBox
const boxRef = store.getters['pokemonBox/dbRef']

test('sync: fillables & guard', async t => {
  const id = boxRef.doc().id
  store.dispatch('pokemonBox/set', {name: 'Squirtle', id, type: ['water'], fillable: true, guarded: true})
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Squirtle')
  t.is(box.pokemon[id].fillable, true)
  // fetch from server to check if guarded is undefined or not
  // t.is(box.pokemon[id].guarded, undefined)
})

test('sync: insertHook & patchHook', async t => {
  const id = boxRef.doc().id
  store.dispatch('pokemonBox/set', {name: 'Horsea', id, type: ['water']})
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Horsea')
  t.is(box.pokemon[id].addedBeforeInsert, true)
  t.is(box.pokemon[id].addedBeforePatch, undefined)
  store.dispatch('pokemonBox/set', {id, name: 'James'})
  t.is(box.pokemon[id].addedBeforeInsert, true)
  t.is(box.pokemon[id].addedBeforePatch, true)
  store.dispatch('pokemonBox/delete', id)
  t.falsy(box.pokemon[id])
})
test('sync: deleteHook', async t => {
  const id = 'stopBeforeDelete'
  store.dispatch('pokemonBox/set', {name: 'Ditto', id, type: ['normal']})
  t.truthy(box.pokemon[id])
  store.dispatch('pokemonBox/delete', id)
  t.truthy(box.pokemon[id])
})

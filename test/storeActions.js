import { isObject, isArray } from 'is-what'
import store from './helpers/index.cjs.js'
import wait from './helpers/wait.js'
import test from 'ava'

const box = store.state.pokemonBox
const char = store.state.mainCharacter
// actions
test('store set up', async t => {
  t.true(isObject(box.pokemon))
  t.true(isArray(char.items))
})
test('set & delete: collection', async t => {
  const id = store.getters['pokemonBox/dbRef'].doc().id
  const id2 = store.getters['pokemonBox/dbRef'].doc().id
  // ini set
  store.dispatch('pokemonBox/set', {name: 'Squirtle', id, type: ['water']})
  t.truthy(box.pokemon[id])
  t.true(box.pokemon[id].name === 'Squirtle')
  // update
  store.dispatch('pokemonBox/set', {name: 'COOL Squirtle!', id: id})
  t.truthy(box.pokemon[id])
  t.true(box.pokemon[id].name === 'COOL Squirtle!')
  t.deepEqual(box.pokemon[id], {name: 'COOL Squirtle!', id, type: ['water']})
  // deep update
  store.dispatch('pokemonBox/set', {type: ['water', 'normal'], id: id})
  t.deepEqual(box.pokemon[id], {name: 'COOL Squirtle!', id, type: ['water', 'normal']})
  // ini set
  store.dispatch('pokemonBox/set', {name: 'Charmender', id: id2})
  t.truthy(box.pokemon[id2])
  t.true(box.pokemon[id2].name === 'Charmender')
  // delete
  store.dispatch('pokemonBox/delete', id)
  t.falsy(box.pokemon[id])
  // DELETE
  t.truthy(box.pokemon[id2])
  store.commit('pokemonBox/DELETE_DOC', id2)
  t.falsy(box.pokemon[id2])
})
test('set & delete: doc', async t => {
  // existing prop set
  store.dispatch('mainCharacter/set', {items: ['Pokeball']})
  t.true(char.items.includes('Pokeball'))
  t.deepEqual(char.items, ['Pokeball'])
  // new prop set
  store.dispatch('mainCharacter/set', {newProp: 'Klappie'})
  t.truthy(char.newProp)
  t.is(char.newProp, 'Klappie')
  store.dispatch('mainCharacter/set', {a: {met: {de: 'aba'}}})
  t.truthy(char.a.met.de)
  t.is(char.a.met.de, 'aba')
  // delete
  store.dispatch('mainCharacter/delete', 'newProp')
  t.falsy(char.newProp)
  // DELETE
  store.commit('mainCharacter/DELETE_PROP', 'a.met.de')
  t.truthy(char.a.met)
  t.falsy(char.a.met.de)
})
test('insert & INSERT', async t => {
  t.pass()
  // await wait()
})
test('patch', async t => {
  t.pass()
  // await wait()
})
test('patchBatch', async t => {
  t.pass()
  // await wait()
})

test('Local: where', async t => {
  t.pass()
  // await wait()
})
test('Local: orderBy', async t => {
  t.pass()
  // await wait()
})
test('Local: fillables', async t => {
  t.pass()
  // await wait()
})
test('Local: guard', async t => {
  t.pass()
  // await wait()
})

test('Local: insertHook', async t => {
  t.pass()
  // await wait()
})
test('Local: patchHook', async t => {
  t.pass()
  // await wait()
})
test('Local: deleteHook', async t => {
  t.pass()
  // await wait()
})

// store.dispatch('pokemonBox/set', {name: 'bulbasaur'})

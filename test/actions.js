import { isObject, isArray } from 'is-what'
import store from './helpers/index.cjs.js'
import wait from './helpers/wait.js'
import test from 'ava'
import copyObj from 'nanoclone'

const pokemonBox = store.state.pokemonBox
const mainCharacter = store.state.mainCharacter
const testId = store.getters['pokemonBox/dbRef'].doc().id
const testId2 = store.getters['pokemonBox/dbRef'].doc().id
console.log('testId → ', testId)
console.log('testId2 → ', testId2)
// actions
test('store set up', async t => {
  await wait(1)
  t.true(isObject(store.state.pokemonBox.pokemon))
  t.true(isArray(store.state.mainCharacter.items))
})
test('set', async t => {
  await wait(2)
  store.dispatch('pokemonBox/set', {name: 'Squirtle', id: testId})
  store.dispatch('pokemonBox/set', {name: 'Charmender', id: testId2})
  store.dispatch('mainCharacter/set', {items: ['Pokeball']})
  await wait(6)
  t.truthy(pokemonBox.pokemon[testId])
  t.true(pokemonBox.pokemon[testId].name === 'Squirtle')
  t.truthy(pokemonBox.pokemon[testId2])
  t.true(pokemonBox.pokemon[testId2].name === 'Charmender')
  t.true(mainCharacter.items.includes('Pokeball'))
  t.true(mainCharacter.items.length === 1)
  console.log('after SET pokemonBox.pokemon → ', copyObj(pokemonBox))
  console.log('after SET mainCharacter → ', copyObj(mainCharacter))
})
test('delete', async t => {
  await wait(10)
  console.log('before DELETE pokemonBox.pokemon → ', copyObj(pokemonBox))
  store.dispatch('pokemonBox/delete', testId)
  await wait(14)
  console.log('after DELETE pokemonBox.pokemon → ', copyObj(pokemonBox.pokemon))
  t.truthy(!pokemonBox.pokemon[testId])
})
test('insert', async t => {
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

test('fetch', async t => {
  t.pass()
  // await wait()
})
test('fetch: docLimit', async t => {
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

test('Server: defaultValues', async t => {
  t.pass()
  // await wait()
})
test('Server: addedHook', async t => {
  t.pass()
  // await wait()
})
test('Server: modifiedHook', async t => {
  t.pass()
  // await wait()
})
test('Server: removedHook', async t => {
  t.pass()
  // await wait()
})


// store.dispatch('pokemonBox/set', {name: 'bulbasaur'})

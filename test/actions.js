import test from 'ava'
import { isPlainObject, isArray, isDate } from 'is-what'
import wait from './helpers/wait'
import {storeActions as store} from './helpers/index.cjs.js'
import { arrayUnion, arrayRemove } from '../src/index'

import * as Firebase from 'firebase/app'
import 'firebase/firestore'

const box = store.state.pokemonBox
const char = store.state.mainCharacter
const boxRef = store.getters['pokemonBox/dbRef']
const charRef = store.getters['mainCharacter/dbRef']

// actions
test('store set up', async t => {
  t.true(isPlainObject(box.pokemon))
  t.true(isArray(char.items))
})

test('[COLLECTION] set with no id', async t => {
  let id, docR, doc
  await wait(2)
  // insert set
  id = await store.dispatch('pokemonBox/insert', {name: 'Unown'})
  console.log('id  set with no id → ', id)
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Unown')
  await wait(2)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.is(doc.name, 'Unown')
  // set set
  id = await store.dispatch('pokemonBox/set', {name: 'Unown1'})
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Unown1')
  await wait(2)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.is(doc.name, 'Unown1')
  // insert set
  id = await store.dispatch('pokemonBox/insert', {name: {is: 'nested'}})
  t.truthy(box.pokemon[id])
  t.deepEqual(box.pokemon[id].name, {is: 'nested'})
  await wait(2)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.name, {is: 'nested'})
  // set set
  id = await store.dispatch('pokemonBox/set', {name: {is: 'nested1'}})
  t.truthy(box.pokemon[id])
  t.deepEqual(box.pokemon[id].name, {is: 'nested1'})
  await wait(2)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.name, {is: 'nested1'})
})

test('[COLLECTION] set & delete: top lvl', async t => {
  const id = boxRef.doc().id
  const id2 = boxRef.doc().id
  const date = new Date()
  // ini set
  const pokemonValues = {
    id,
    name: 'Squirtle',
    type: ['water'],
    meta: {date}
  }
  store.dispatch('pokemonBox/insert', pokemonValues)
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Squirtle')
  t.is(box.pokemon[id].meta.date, date)
  await wait(2)
  let docR, doc
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.is(doc.name, 'Squirtle')
  t.falsy(doc.meta) // not a fillable

  // update
  const date2 = new Date('1990-06-22')
  const pokemonValuesNew = {
    id,
    name: 'COOL Squirtle!',
    meta: {date: date2}
  }
  store.dispatch('pokemonBox/set', pokemonValuesNew)
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'COOL Squirtle!')
  t.deepEqual(box.pokemon[id].type, ['water'])
  t.is(box.pokemon[id].meta.date, date2)
  await wait(2)
  docR = await boxRef.doc(id).get()
  t.is(docR.exists, true)
  doc = docR.data()
  t.is(doc.name, 'COOL Squirtle!')
  t.deepEqual(doc.type, ['water'])

  // update with {id: val}
  store.dispatch('pokemonBox/set', {[id]: {name: 'very berry COOL Squirtle!'}})
  t.is(box.pokemon[id].name, 'very berry COOL Squirtle!')
  await wait(2)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.is(doc.name, 'very berry COOL Squirtle!')

  // add a new prop (deep)
  store.dispatch('pokemonBox/set', {id, nested: {new: {deep: {prop: true}}}})
  t.deepEqual(box.pokemon[id].nested, {new: {deep: {prop: true}}})
  await wait(2)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.nested, {new: {deep: {prop: true}}})

  // update arrays
  store.dispatch('pokemonBox/set', {type: ['water', 'normal'], id})
  t.deepEqual(box.pokemon[id].type, ['water', 'normal'])
  await wait(2)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.type, ['water', 'normal'])

  // SECOND SET + set chooses insert appropriately
  store.dispatch('pokemonBox/set', {name: 'Charmander', id: id2})
  t.truthy(box.pokemon[id2])
  t.is(box.pokemon[id2].name, 'Charmander')
  await wait(2)
  docR = await boxRef.doc(id2).get()
  t.is(docR.exists, true)
  doc = docR.data()
  t.is(doc.name, 'Charmander')

  // delete
  store.dispatch('pokemonBox/delete', id)
  t.falsy(box.pokemon[id])
  await wait(2)
  docR = await boxRef.doc(id).get()
  t.is(docR.exists, false)

  // DELETE
  t.truthy(box.pokemon[id2])
  store.commit('pokemonBox/DELETE_DOC', id2)
  t.falsy(box.pokemon[id2])
})

test('[COLLECTION] set & delete: deep', async t => {
  let docR, doc

  const id = boxRef.doc().id
  await store.dispatch('pokemonBox/insert', {id, nested: {a: {met: {de: 'aba'}}}})
  t.truthy(box.pokemon[id])
  t.deepEqual(box.pokemon[id].nested, {a: {met: {de: 'aba'}}})
  await wait(2)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.nested, {a: {met: {de: 'aba'}}})

  // update {id, val}
  await store.dispatch('pokemonBox/set', {id, nested: {a: {met: {de: 'ebe'}}}})
  t.deepEqual(box.pokemon[id].nested, {a: {met: {de: 'ebe'}}})
  await wait(2)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.nested.a.met, {de: 'ebe'})
  t.deepEqual(doc.nested, {a: {met: {de: 'ebe'}}})

  // update {id: val}
  await store.dispatch('pokemonBox/patch', {[id]: {nested: {a: {met: {de: 'ibi'}}}}})
  t.deepEqual(box.pokemon[id].nested, {a: {met: {de: 'ibi'}}})
  await wait(2)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.nested.a.met, {de: 'ibi'})
  t.deepEqual(doc.nested, {a: {met: {de: 'ibi'}}})

  // delete via prop Delete
  await store.dispatch('pokemonBox/delete', `${id}.nested.a.met.de`)
  t.deepEqual(box.pokemon[id].nested, {a: {met: {}}})
  await wait(2)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.nested, {a: {met: {}}})
})

test('[COLLECTION] set & delete: batches', async t => {
  // ini set
  const id1 = boxRef.doc().id
  const a = {id: id1, name: 'Bulbasaur', type: {grass: true}}
  const id2 = boxRef.doc().id
  const b = {id: id2, name: 'Charmander', type: {fire: true}}
  const id3 = boxRef.doc().id
  const c = {id: id3, name: 'Squirtle', type: {water: true}}
  const pokemonValues = [a, b, c]
  await store.dispatch('pokemonBox/insertBatch', pokemonValues)
    .catch(console.error)
  t.deepEqual(box.pokemon[id1], a)
  t.deepEqual(box.pokemon[id2], b)
  t.deepEqual(box.pokemon[id3], c)
  await wait(2)
  const docR1 = await boxRef.doc(id1).get()
  const doc1 = docR1.data()
  const docR2 = await boxRef.doc(id2).get()
  const doc2 = docR2.data()
  const docR3 = await boxRef.doc(id3).get()
  const doc3 = docR3.data()
  t.is(doc1.name, a.name)
  t.deepEqual(doc1.type, a.type)
  t.is(doc2.name, b.name)
  t.deepEqual(doc2.type, b.type)
  t.is(doc3.name, c.name)
  t.deepEqual(doc3.type, c.type)
})

test('[DOC] set & delete: top lvl', async t => {
  let docR, doc
  // EXISTING prop set
  await store.dispatch('mainCharacter/set', {items: ['Pokeball']})
  t.deepEqual(char.items, ['Pokeball'])
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.deepEqual(doc.items, ['Pokeball'])

  // NEW prop set string
  await store.dispatch('mainCharacter/set', {newProp: 'Klappie'})
  t.is(char.newProp, 'Klappie')
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.is(doc.newProp, 'Klappie')

  // delete prop with string
  await store.dispatch('mainCharacter/delete', 'newProp')
  t.falsy(char.newProp)
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.falsy(doc.newProp)

  // NEW prop set to an object
  await store.dispatch('mainCharacter/set', {newObjectProp: {deep: {object: true}}})
  t.deepEqual(char.newObjectProp, {deep: {object: true}})
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.deepEqual(doc.newObjectProp, {deep: {object: true}})

  // delete object prop
  await store.dispatch('mainCharacter/delete', 'newObjectProp')
  t.falsy(char.newObjectProp)
  await wait(3)
  docR = await charRef.get()
  doc = docR.data()
  t.falsy(doc.newObjectProp)
})

test('[DOC] set & delete: deep', async t => {
  await wait(20)
  let docR, doc
  // set
  store.dispatch('mainCharacter/set', {nestedInDoc: {a: {met: {de: 'aba'}}}})
  t.deepEqual(char.nestedInDoc, {a: {met: {de: 'aba'}}})
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.deepEqual(doc.nestedInDoc, {a: {met: {de: 'aba'}}})

  // update
  await store.dispatch('mainCharacter/set', {nestedInDoc: {a: {met: {de: 'ebe'}}}})
  t.deepEqual(char.nestedInDoc, {a: {met: {de: 'ebe'}}})
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.deepEqual(doc.nestedInDoc, {a: {met: {de: 'ebe'}}})

  // delete 4 levels deep
  await store.dispatch('mainCharacter/delete', 'nestedInDoc.a.met.de')
  t.deepEqual(char.nestedInDoc, {a: {met: {}}})
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.deepEqual(doc.nestedInDoc, {a: {met: {}}})

  // delete entire object prop
  store.dispatch('mainCharacter/delete', 'nestedInDoc')
  t.falsy(char.nestedInDoc)
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.falsy(doc.nestedInDoc)
})

test('[COLLECTION] duplicate', async t => {
  let res
  const id = boxRef.doc().id
  await store.dispatch('pokemonBox/insert', {id, name: 'Jamie Lannister'})
  t.is(box.pokemon[id].name, 'Jamie Lannister')
  // dupe 1
  res = await store.dispatch('pokemonBox/duplicate', id)
  t.deepEqual(Object.keys(res), [id])
  const dId = res[id]
  t.is(box.pokemon[dId].name, 'Jamie Lannister')
  // dupe many
  res = await store.dispatch('pokemonBox/duplicateBatch', [id, dId])
  t.deepEqual(Object.keys(res), [id, dId])
  t.is(box.pokemon[res[id]].name, 'Jamie Lannister')
  t.is(box.pokemon[res[dId]].name, 'Jamie Lannister')
  // check Firestore
  await wait(2)
  let docR, doc
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.is(doc.name, 'Jamie Lannister')
  docR = await boxRef.doc(dId).get()
  doc = docR.data()
  t.is(doc.name, 'Jamie Lannister')
  docR = await boxRef.doc(res[id]).get()
  doc = docR.data()
  t.is(doc.name, 'Jamie Lannister')
  docR = await boxRef.doc(res[dId]).get()
  doc = docR.data()
  t.is(doc.name, 'Jamie Lannister')
})

import test from 'ava'
import { isArray } from 'is-what'
import wait from './helpers/wait'
import {store} from './helpers/index.cjs.js'

const char = store.state.mainCharacter
const charRef = store.getters['mainCharacter/dbRef']

// actions
test('store set up', async t => {
  t.true(isArray(char.items))
})

test('[DOC] edit twice right after each other', async t => {
  await wait(2)
  // insert
  await store.dispatch('mainCharacter/set', {multipleFastEdits: true})
  t.is(char.multipleFastEdits, true)
  // patch once
  await wait(0.8)
  store.dispatch('mainCharacter/set', {multipleFastEdits: false})
  t.is(char.multipleFastEdits, false)
  await wait(0.1)
  t.is(char.multipleFastEdits, false)
  await wait(0.1)
  t.is(char.multipleFastEdits, false)
  await wait(0.1)
  t.is(char.multipleFastEdits, false)
  await wait(0.1)
  t.is(char.multipleFastEdits, false)
  await wait(0.1)
  t.is(char.multipleFastEdits, false)
  await wait(0.1)
  t.is(char.multipleFastEdits, false)
  await wait(0.1)
  t.is(char.multipleFastEdits, false)
  await wait(0.1)
  t.is(char.multipleFastEdits, false)
  await wait(0.1)
  t.is(char.multipleFastEdits, false)
  await wait(0.1)
  t.is(char.multipleFastEdits, false)
  await wait(0.1)
  t.is(char.multipleFastEdits, false)
  await wait(0.1)
  t.is(char.multipleFastEdits, false)
  await wait(0.1)
  t.is(char.multipleFastEdits, false)
  await wait(0.1)
  t.is(char.multipleFastEdits, false)
  await wait(0.1)
  t.is(char.multipleFastEdits, false)
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

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
  await store.dispatch('mainCharacter/patch', {multipleFastEdits: true})
  t.is(char.multipleFastEdits, true)
  // patch once
  await wait(0.8)
  store.dispatch('mainCharacter/patch', {multipleFastEdits: false})
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

test('[DOC] patch & delete: top lvl', async t => {
  let docR, doc
  // EXISTING prop patch
  await store.dispatch('mainCharacter/patch', {items: ['Pokeball']})
  t.deepEqual(char.items, ['Pokeball'])
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.deepEqual(doc.items, ['Pokeball'])

  // NEW prop patch string
  await store.dispatch('mainCharacter/patch', {newProp: 'Klappie'})
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

  // NEW prop patch to an object
  await store.dispatch('mainCharacter/patch', {newObjectProp: {deep: {object: true}}})
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

test('[DOC] set, patch & delete: deep', async t => {
  await wait(3)
  let docR, doc
  // patch new stuff
  store.dispatch('mainCharacter/patch', {nestedInDoc: {a: {bb: {ccc: 'red', ddd: 'blue'}}}})
  t.deepEqual(char.nestedInDoc, {a: {bb: {ccc: 'red', ddd: 'blue'}}})
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.deepEqual(doc.nestedInDoc, {a: {bb: {ccc: 'red', ddd: 'blue'}}})

  // patch existing object
  await store.dispatch('mainCharacter/patch', {nestedInDoc: {a: {bb: {ccc: 'pink'}}}})
  t.deepEqual(char.nestedInDoc, {a: {bb: {ccc: 'pink', ddd: 'blue'}}})
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.deepEqual(doc.nestedInDoc, {a: {bb: {ccc: 'pink', ddd: 'blue'}}})
  
  // patch an object, string path
  await store.dispatch('mainCharacter/patch', {'nestedInDoc.a.bb.ccc': 'fuchsia'})
  t.deepEqual(char.nestedInDoc, {a: {bb: {ccc: 'fuchsia', ddd: 'blue'}}})
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.deepEqual(doc.nestedInDoc, {a: {bb: {ccc: 'fuchsia', ddd: 'blue'}}})
  
  // set a nested string (equivalent to a patch)
  await store.dispatch('mainCharacter/set', {'nestedInDoc.a.bb.ccc': 'carmine'})
  t.deepEqual(char.nestedInDoc, {a: {bb: {ccc: 'carmine', ddd: 'blue'}}})
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.deepEqual(doc.nestedInDoc, {a: {bb: {ccc: 'carmine', ddd: 'blue'}}})
  
  // set a nested object (replaces the object)
  await store.dispatch('mainCharacter/set', {'nestedInDoc.a.bb': {ccc: 'crimson'}})
  t.deepEqual(char.nestedInDoc, {a: {bb: {ccc: 'crimson'}}})
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.deepEqual(doc.nestedInDoc, {a: {bb: {ccc: 'crimson'}}})
  
  // delete 4 levels deep
  await store.dispatch('mainCharacter/delete', 'nestedInDoc.a.bb.ccc')
  t.deepEqual(char.nestedInDoc, {a: {bb: {ddd: 'blue'}}})
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.deepEqual(doc.nestedInDoc, {a: {bb: {ddd: 'blue'}}})

  // delete entire object prop
  store.dispatch('mainCharacter/delete', 'nestedInDoc')
  t.falsy(char.nestedInDoc)
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.falsy(doc.nestedInDoc)
})

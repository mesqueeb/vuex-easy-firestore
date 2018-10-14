import test from 'ava'
import { isObject, isArray, isDate } from 'is-what'
import wait from './helpers/wait'
import Firebase from './helpers/firestoreMock'
import store from './helpers/index.cjs.js'

const box = store.state.pokemonBox
const char = store.state.mainCharacter
const boxRef = store.getters['pokemonBox/dbRef']
const charRef = store.getters['mainCharacter/dbRef']

// actions
test('store set up', async t => {
  t.true(isObject(box.pokemon))
  t.true(isArray(char.items))
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
    meta: {date, firebaseServerTS: Firebase.firestore.FieldValue.serverTimestamp()}
  }
  store.dispatch('pokemonBox/insert', pokemonValues)
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Squirtle')
  t.is(box.pokemon[id].meta.date, date)
  // t.true(isDate(box.pokemon[id].meta.firebaseServerTS.toDate())) // this is probably a feature of the firestore mock, but in reality will be different
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

  // update arrays
  store.dispatch('pokemonBox/set', {type: ['water', 'normal'], id})
  t.deepEqual(box.pokemon[id].type, ['water', 'normal'])
  await wait(2)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.type, ['water', 'normal'])

  // SECOND SET + set chooses insert appropriately
  store.dispatch('pokemonBox/set', {name: 'Charmender', id: id2})
  t.truthy(box.pokemon[id2])
  t.is(box.pokemon[id2].name, 'Charmender')
  await wait(2)
  docR = await boxRef.doc(id2).get()
  t.is(docR.exists, true)
  doc = docR.data()
  t.is(doc.name, 'Charmender')

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

// test('[COLLECTION] set & delete: deep', async t => {
//   let docR, doc

//   const id = boxRef.doc().id
//   store.dispatch('pokemonBox/insert', {id})
//   t.truthy(box.pokemon[id])
//   await wait(2)
//   docR = await boxRef.doc(id).get()
//   doc = docR.data()
//   t.truthy(doc)
//   // update
//   store.dispatch('pokemonBox/set', {[id]: {nested: {a: {met: {de: 'aba'}}}}})
//   t.deepEqual(box.pokemon[id].nested, {a: {met: {de: 'aba'}}})
//   await wait(2)
//   docR = await boxRef.doc(id).get()
//   doc = docR.data()
//   t.deepEqual(doc.nested, {a: {met: {de: 'aba'}}})

//   // delete
//   store.dispatch('pokemonBox/set', {[id]: {nested: {a: {met: {de: Firebase.firestore.FieldValue.delete()}}}}})
//   t.deepEqual(box.pokemon[id].nested, {a: {met: {}}})
//   await wait(2)
//   docR = await boxRef.doc(id).get()
//   doc = docR.data()
//   t.deepEqual(doc.nested, {a: {met: {}}})
// })

// test('set & delete: batches', async t => {
//   // ini set
//   await wait(3)
//   console.log('start batch')
//   const pokemonValues = [
//     {name: 'Bulbasaur', type: {grass: true}},
//     {name: 'Charmander', type: {fire: true}},
//     {name: 'Squirtle', type: {water: true}},
//   ]
//   store.dispatch('pokemonBox/insertBatch', pokemonValues)
//     .then(console.log).catch(console.error)
//   await wait(5)
//   console.log('finish batch')
//   t.pass()
// })

test('[DOC] set & delete: top lvl', async t => {
  // EXISTING prop set
  store.dispatch('mainCharacter/set', {items: ['Pokeball']})
  t.true(char.items.includes('Pokeball'))
  t.deepEqual(char.items, ['Pokeball'])
  // NEW prop set
  store.dispatch('mainCharacter/set', {newProp: 'Klappie'})
  t.truthy(char.newProp)
  t.is(char.newProp, 'Klappie')
  await wait(2)
  let docR, doc
  docR = await charRef.get()
  doc = docR.data()
  t.truthy(doc.newProp)
  t.is(doc.newProp, 'Klappie')

  // delete
  store.dispatch('mainCharacter/delete', 'newProp')
  t.falsy(char.newProp)
  await wait(2)
  docR = await charRef.get()
  doc = docR.data()
  t.truthy(doc)
  t.falsy(doc.newProp)
})

// test('[DOC] set & delete: deep', async t => {
//   store.dispatch('mainCharacter/set', {a: {met: {de: 'aba'}}})
//   t.truthy(char.a.met.de)
//   t.is(char.a.met.de, 'aba')
//   await wait(2)
//   let docR, doc
//   docR = await charRef.get()
//   console.log('docR → ', docR)
//   doc = docR.data()
//   console.log('doc → ', doc)
//   t.truthy(doc.a.met.de)
//   t.is(doc.a.met.de, 'aba')

//   // delete
//   store.dispatch('mainCharacter/delete', 'a.met.de')
//   t.truthy(char.a.met)
//   t.falsy(char.a.met.de)
// })

test('[COLLECTION] duplicate', async t => {
  let res
  const id = boxRef.doc().id
  store.dispatch('pokemonBox/insert', {id, name: 'Jamie Lannister'})
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

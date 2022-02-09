import test from 'ava'
import wait from './helpers/wait'
import firebase from './helpers/firestoreMock'
import { store } from './helpers/index.cjs.js'
import * as firestore from 'firebase/firestore'

const box = store.state.pokemonBoxVEA
const char = store.state.mainCharacterVEA
const boxRef = store.getters['pokemonBoxVEA/dbRef']
const charRef = store.getters['mainCharacterVEA/dbRef']

test('[COLLECTION] set & delete: top lvl', async t => {
  const id = firestore.doc(boxRef).id
  const id2 = firestore.doc(boxRef).id
  const date = new Date()
  // ini set
  const pokemonValues = {
    id,
    name: 'Squirtle',
    type: ['water'],
    meta: { date, firebaseServerTS: firebase.firestore.FieldValue.serverTimestamp() },
  }
  await store.set('pokemonBoxVEA/pokemon.*', pokemonValues)
  await wait(2)
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Squirtle')
  t.is(box.pokemon[id].meta.date, date)
  // t.true(isDate(box.pokemon[id].meta.firebaseServerTS.toDate())) // this is probably a feature of the firestore mock, but in reality will be different
  await wait(2)
  let docR, doc
  docR = await firestore.getDoc(firestore.doc(boxRef, id))
  doc = docR.data()
  t.is(doc.name, 'Squirtle')
  t.falsy(doc.meta) // not a fillable
  // update
  const date2 = new Date('1990-06-22')
  const pokemonValuesNew = {
    id,
    name: 'COOL Squirtle!',
    meta: { date: date2 },
  }
  store.set('pokemonBoxVEA/pokemon.*', pokemonValuesNew)
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'COOL Squirtle!')
  t.deepEqual(box.pokemon[id].type, ['water'])
  t.is(box.pokemon[id].meta.date, date2)
  await wait(2)
  docR = await firestore.getDoc(firestore.doc(boxRef, id))
  t.is(docR.exists(), true)
  doc = docR.data()
  t.is(doc.name, 'COOL Squirtle!')
  t.deepEqual(doc.type, ['water'])

  // update arrays
  store.set('pokemonBoxVEA/pokemon.*', { type: ['water', 'normal'], id })
  t.deepEqual(box.pokemon[id].type, ['water', 'normal'])
  await wait(2)
  docR = await firestore.getDoc(firestore.doc(boxRef, id))
  doc = docR.data()
  t.deepEqual(doc.type, ['water', 'normal'])

  // SECOND SET + set chooses insert appropriately
  store.set('pokemonBoxVEA/pokemon.*', { name: 'Charmander', id: id2 })
  t.truthy(box.pokemon[id2])
  t.is(box.pokemon[id2].name, 'Charmander')
  await wait(2)
  docR = await firestore.getDoc(firestore.doc(boxRef, id2))
  t.is(docR.exists(), true)
  doc = docR.data()
  t.is(doc.name, 'Charmander')

  // delete
  store.delete('pokemonBoxVEA/pokemon.*', id)
  t.falsy(box.pokemon[id])
  await wait(2)
  docR = await firestore.getDoc(firestore.doc(boxRef, id))
  t.is(docR.exists(), false)

  // DELETE
  t.truthy(box.pokemon[id2])
  store.dispatch('pokemonBoxVEA/delete', id2)
  t.falsy(box.pokemon[id2])
})

test('[COLLECTION] set & delete: deep', async t => {
  let docR, doc

  const id = firestore.doc(boxRef).id
  await store.set('pokemonBoxVEA/pokemon.*', { id, nested: { a: { met: { de: 'aba' } } } })
  t.truthy(box.pokemon[id])
  t.deepEqual(box.pokemon[id].nested, { a: { met: { de: 'aba' } } })
  await wait(2)
  docR = await firestore.getDoc(firestore.doc(boxRef, id))
  doc = docR.data()
  t.deepEqual(doc.nested, { a: { met: { de: 'aba' } } })

  // update
  await store.set('pokemonBoxVEA/pokemon.*.nested.a.met.de', [id, 'ebe'])
  // await store.set('pokemonBoxVEA/pokemon.*.nested.a.met.*', [id, {de: 'ebe'}])
  t.deepEqual(box.pokemon[id].nested, { a: { met: { de: 'ebe' } } })
  await wait(2)
  docR = await firestore.getDoc(firestore.doc(boxRef, id))
  doc = docR.data()
  t.deepEqual(doc.nested.a.met, { de: 'ebe' })
  t.deepEqual(doc.nested, { a: { met: { de: 'ebe' } } })

  // delete
  await store.delete('pokemonBoxVEA/pokemon.*.nested.a.met.de', [id])
  t.deepEqual(box.pokemon[id].nested, { a: { met: {} } })
  await wait(2)
  docR = await firestore.getDoc(firestore.doc(boxRef, id))
  doc = docR.data()
  t.deepEqual(doc.nested, { a: { met: {} } })
})

// test('[COLLECTION] set & delete: batches', async t => {
//   await wait(2)
//   let docR1, doc1, docR2, doc2, docR3, doc3
//   // ini set
//   const id1 = firestore.doc(boxRef).id
//   const a = {id: id1, name: 'Bulbasaur', type: {grass: true}}
//   const id2 = firestore.doc(boxRef).id
//   const b = {id: id2, name: 'Charmander', type: {fire: true}}
//   const id3 = firestore.doc(boxRef).id
//   const c = {id: id3, name: 'Squirtle', type: {water: true}}
//   const pokemonValues = [a, b, c]
//   await store.dispatch('pokemonBoxVEA/insertBatch', pokemonValues)
//     .catch(console.error)
//   t.deepEqual(box.pokemon[id1], a)
//   t.deepEqual(box.pokemon[id2], b)
//   t.deepEqual(box.pokemon[id3], c)
//   await wait(2)
//   docR1 = await boxRef.doc(id1).get()
//   doc1 = docR1.data()
//   docR2 = await boxRef.doc(id2).get()
//   doc2 = docR2.data()
//   docR3 = await boxRef.doc(id3).get()
//   doc3 = docR3.data()
//   t.is(doc1.name, a.name)
//   t.deepEqual(doc1.type, a.type)
//   t.is(doc2.name, b.name)
//   t.deepEqual(doc2.type, b.type)
//   t.is(doc3.name, c.name)
//   t.deepEqual(doc3.type, c.type)
// })

test('[DOC] set & delete: top lvl', async t => {
  await store.dispatch('mainCharacterVEA/openDBChannel').catch(console.error)
  await wait(3)
  // EXISTING prop set
  await store.set('mainCharacterVEA/items', ['Pokeball'])
  t.true(char.items.includes('Pokeball'))
  t.deepEqual(char.items, ['Pokeball'])
  // NEW prop set
  await store.set('mainCharacterVEA/newProp', 'Klappie')
  await wait(1)
  t.truthy(char.newProp)
  t.is(char.newProp, 'Klappie')
  await wait(1)
  let docR, doc
  docR = await firestore.getDoc(charRef)
  doc = docR.data()
  t.truthy(doc.newProp)
  t.is(doc.newProp, 'Klappie')

  // delete
  await store.delete('mainCharacterVEA/newProp')
  t.falsy(char.newProp)
  await wait(2)
  docR = await firestore.getDoc(charRef)
  doc = docR.data()
  t.truthy(doc)
  t.falsy(doc.newProp)
})

test('[DOC] set & delete: deep', async t => {
  await wait(3)
  await store.set('mainCharacterVEA', { a: { met: { de: 'aba' } } })
  t.truthy(char.a.met.de)
  t.is(char.a.met.de, 'aba')
  await wait(2)
  let docR, doc
  docR = await firestore.getDoc(charRef)
  doc = docR.data()
  t.truthy(doc.a)
  t.truthy(doc.a.met)
  t.is(doc.a.met.de, 'aba')

  // delete
  await store.delete('mainCharacterVEA/a.met.de')
  t.truthy(char.a.met)
  t.falsy(char.a.met.de)
})

// test('[COLLECTION] duplicate', async t => {
//   await wait(2)
//   let res
//   const id = firestore.doc(boxRef).id
//   await store.set('pokemonBoxVEA/pokemon.*', {id, name: 'Jamie Lannister'})
//   t.is(box.pokemon[id].name, 'Jamie Lannister')
//   // dupe 1
//   res = await store.dispatch('pokemonBoxVEA/duplicate', id)
//   t.deepEqual(Object.keys(res), [id])
//   const dId = res[id]
//   t.is(box.pokemon[dId].name, 'Jamie Lannister')
//   // dupe many
//   res = await store.dispatch('pokemonBoxVEA/duplicateBatch', [id, dId])
//   t.deepEqual(Object.keys(res), [id, dId])
//   t.is(box.pokemon[res[id]].name, 'Jamie Lannister')
//   t.is(box.pokemon[res[dId]].name, 'Jamie Lannister')
//   // check Firestore
//   await wait(2)
//   let docR, doc
//   docR = await firestore.getDoc(firestore.doc(boxRef, id))
//   doc = docR.data()
//   t.is(doc.name, 'Jamie Lannister')
//   docR = await boxRef.doc(dId).get()
//   doc = docR.data()
//   t.is(doc.name, 'Jamie Lannister')
//   docR = await boxRef.doc(res[id]).get()
//   doc = docR.data()
//   t.is(doc.name, 'Jamie Lannister')
//   docR = await boxRef.doc(res[dId]).get()
//   doc = docR.data()
//   t.is(doc.name, 'Jamie Lannister')
// })

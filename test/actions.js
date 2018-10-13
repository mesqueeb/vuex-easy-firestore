import { isObject, isArray, isDate } from 'is-what'
import store from './helpers/index.cjs.js'
import wait from './helpers/wait'
import test from 'ava'
import Firebase from './helpers/firestoreMock'

// Mock for Firebase.firestore.FieldValue.serverTimestamp()
// const Firebase = {
//   firestore: {
//     FieldValue: {
//       serverTimestamp: function () {
//         return {methodName: 'FieldValue.serverTimestamp'}
//       }
//     }
//   }
// }
const db = Firebase.firestore()
const box = store.state.pokemonBox
const char = store.state.mainCharacter
const boxRef = store.getters['pokemonBox/dbRef']
const charRef = store.getters['mainCharacter/dbRef']
// actions
test('store set up', async t => {
  t.true(isObject(box.pokemon))
  t.true(isArray(char.items))
})
test('set & delete: collection', async t => {
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
  console.log('id → ', id)
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Squirtle')
  t.is(box.pokemon[id].meta.date, date)
  t.true(isDate(box.pokemon[id].meta.firebaseServerTS)) // this is probably a feature of the firestore mock, but in reality will be different
  console.log('0')
  await wait(2)
  console.log('1')
  let docR
  try {
    console.log('2')
    // docR = await boxRef.doc(id).get()
    console.log('store.state.pokemonBox._conf.firestorePath → ', store.state.pokemonBox._conf.firestorePath)
    await wait(2)
    docR = await db.doc(`pokemonBoxes/Satoshi/pokemon/${id}`).get()
  } catch (error) {
    return console.error(error)
  }
  console.log('3')
  await wait(2)
  console.log('doc R → ', docR)
  const doc = docR.data()
  await wait(2)
  console.log('doc.data() → ', doc)
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
  // deep update
  store.dispatch('pokemonBox/set', {type: ['water', 'normal'], id})
  t.deepEqual(box.pokemon[id].type, ['water', 'normal'])
  // ini set
  store.dispatch('pokemonBox/set', {name: 'Charmender', id: id2})
  t.truthy(box.pokemon[id2])
  t.is(box.pokemon[id2].name, 'Charmender')
  // delete
  store.dispatch('pokemonBox/delete', id)
  t.falsy(box.pokemon[id])
  // DELETE
  t.truthy(box.pokemon[id2])
  store.commit('pokemonBox/DELETE_DOC', id2)
  t.falsy(box.pokemon[id2])
})
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

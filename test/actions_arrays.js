import test from 'ava'
import { isPlainObject, isArray, isDate } from 'is-what'
import wait from './helpers/wait'
import {store} from './helpers/index.cjs.js'
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

test('[COLLECTION] set arrayUnion & arrayRemove', async t => {
  let docR, doc
  const id = boxRef.doc().id
  // ini set
  const pokemonValues = {
    id,
    arr1: [1, 2, 3],
    arr2: [1, 2, 3],
    nested: {
      arr1: [1, 2, 3],
      arr2: [1, 2, 3],
    }
  }
  store.dispatch('pokemonBox/insert', pokemonValues)
  t.truthy(box.pokemon[id])
  await wait(2)
  const pokemonValuesNew = {
    id,
    arr1: arrayUnion(0),
    arr2: arrayRemove(2),
    nested: {
      arr1: arrayUnion(0),
      arr2: arrayRemove(2),
    }
  }
  store.dispatch('pokemonBox/set', pokemonValuesNew)
  t.truthy(box.pokemon[id])
  t.deepEqual(box.pokemon[id].arr1, [1, 2, 3, 0])
  t.deepEqual(box.pokemon[id].arr2, [1, 3])
  t.deepEqual(box.pokemon[id].nested.arr1, [1, 2, 3, 0])
  t.deepEqual(box.pokemon[id].nested.arr2, [1, 3])
  await wait(2)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.arr1, [1, 2, 3, 0])
  t.deepEqual(doc.arr2, [1, 3])
  t.deepEqual(doc.nested.arr1, [1, 2, 3, 0])
  t.deepEqual(doc.nested.arr2, [1, 3])
})

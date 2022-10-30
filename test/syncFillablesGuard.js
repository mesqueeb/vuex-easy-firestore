import test from 'ava'
import wait from './helpers/wait'
import { store } from './helpers/index.cjs.js'
import * as firestore from 'firebase/firestore'

const box = store.state.pokemonBox
const boxRef = store.getters['pokemonBox/dbRef']
// const char = store.state.mainCharacter
// const charRef = store.getters['mainCharacter/dbRef']

test('[COLLECTION] sync: fillables & guard', async t => {
  const id = firestore.doc(boxRef).id
  store
    .dispatch('pokemonBox/insert', {
      name: 'Squirtle',
      id,
      type: ['water'],
      fillable: true,
      guarded: true,
      unmentionedProp: true,
    })
    .catch(console.error)
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Squirtle')
  t.is(box.pokemon[id].fillable, true)
  t.is(box.pokemon[id].guarded, true) // no prop filtering on local changes
  t.is(box.pokemon[id].unmentionedProp, true) // no prop filtering on local changes
  // fetch from server to check if guarded is undefined or not
  await wait(2)
  const docR = await firestore.getDoc(firestore.doc(boxRef, id))
  const doc = docR.data()
  t.truthy(doc)
  t.is(doc.name, 'Squirtle')
  t.is(doc.fillable, true)
  t.falsy(doc.guarded)
  t.falsy(doc.unmentionedProp)
  t.is(doc.guarded, undefined)
  t.is(doc.unmentionedProp, undefined)
})

test('[DOC] sync: fillables & guard', async t => {
  t.pass()
})

const fil = store.state.nestedFillables
const filRef = store.getters['nestedFillables/dbRef']

test('[DOC] sync: nested fillables', async t => {
  store
    .dispatch('nestedFillables/set', {
      nested: { fillables: { yes: 1, no: 2 } },
      newProp: 3,
    })
    .catch(console.error)
  t.is(fil.nested.fillables.yes, 1)
  t.is(fil.nested.fillables.no, 2)
  t.is(fil.newProp, 3)
  // fetch from server to check if guarded is undefined or not
  await wait(2)
  const docR = await firestore.getDoc(filRef)
  const doc = docR.data()
  t.truthy(doc)
  t.is(doc.nested.fillables.yes, 1)
  t.is(doc.nested.fillables.no, undefined)
  t.is(doc.newProp, undefined)
})

const gar = store.state.nestedGuard
const garRef = store.getters['nestedGuard/dbRef']

test('[DOC] sync: nested guard', async t => {
  store
    .dispatch('nestedGuard/set', {
      nested: { guard: 1, unguarded: 2 },
      unguarded: 3,
    })
    .catch(console.error)
  t.is(gar.nested.guard, 1)
  t.is(gar.nested.unguarded, 2)
  t.is(gar.unguarded, 3)
  // fetch from server to check if guarded is undefined or not
  await wait(2)
  const docR = await firestore.getDoc(garRef)
  const doc = docR.data()
  t.truthy(doc)
  t.is(doc.nested.guard, undefined)
  t.is(doc.nested.unguarded, 2)
  t.is(doc.unguarded, 3)
})

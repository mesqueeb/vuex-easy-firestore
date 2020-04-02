import test from 'ava'
import { isPlainObject } from 'is-what'
import wait from './helpers/wait'
import { store } from './helpers/index.cjs.js'

const box = store.state.pokemonBox
const boxRef = store.getters['pokemonBox/dbRef']

// actions
test('store set up', async t => {
  t.true(isPlainObject(box.pokemon))
})

test('[COLLECTION] set with no id', async t => {
  let id, docR, doc
  await wait(3)
  // insert set
  id = await store.dispatch('pokemonBox/insert', { name: 'Unown' })
  console.log('id → ', id)
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Unown')
  await wait(3)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.is(doc.name, 'Unown')
  // set set
  id = await store.dispatch('pokemonBox/set', { name: 'Unown1' })
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Unown1')
  await wait(3)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.is(doc.name, 'Unown1')
  // insert set
  id = await store.dispatch('pokemonBox/insert', { name: { is: 'nested' } })
  t.truthy(box.pokemon[id])
  t.deepEqual(box.pokemon[id].name, { is: 'nested' })
  await wait(3)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.name, { is: 'nested' })
  // set set
  id = await store.dispatch('pokemonBox/set', { name: { is: 'nested1' } })
  t.truthy(box.pokemon[id])
  t.deepEqual(box.pokemon[id].name, { is: 'nested1' })
  await wait(3)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.name, { is: 'nested1' })
})

test('[COLLECTION] insert and patch right after each other', async t => {
  await wait(3)
  // insert
  const id = boxRef.doc().id
  store.dispatch('pokemonBox/insert', {
    id,
    name: 'Mew',
    type: { normal: true },
  })
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Mew')
  t.deepEqual(box.pokemon[id].type, { normal: true })
  // patch
  store.dispatch('pokemonBox/patch', { id, type: { psychic: true } })
  t.is(box.pokemon[id].name, 'Mew')
  t.deepEqual(box.pokemon[id].type, { normal: true, psychic: true })
  // await server
  await wait(3)
  const docR = await boxRef.doc(id).get()
  const doc = docR.data()
  t.is(doc.name, 'Mew')
  t.deepEqual(doc.type, { normal: true, psychic: true })
})

test('[COLLECTION] edit twice right after each other', async t => {
  await wait(3)
  // insert
  const id = boxRef.doc().id
  store.dispatch('pokemonBox/insert', {
    id,
    name: 'Mew',
    type: { normal: true },
  })
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Mew')
  await wait(3)
  // patch once
  store.dispatch('pokemonBox/patch', { id, name: 'Mew!' })
  t.is(box.pokemon[id].name, 'Mew!')
  await wait(0.5)
  t.is(box.pokemon[id].name, 'Mew!')
  store.dispatch('pokemonBox/patch', { id, name: 'Mew!!' })
  t.is(box.pokemon[id].name, 'Mew!!')
  await wait(0.1)
  t.is(box.pokemon[id].name, 'Mew!!')
  await wait(0.1)
  t.is(box.pokemon[id].name, 'Mew!!')
  await wait(0.1)
  t.is(box.pokemon[id].name, 'Mew!!')
  await wait(0.1)
  t.is(box.pokemon[id].name, 'Mew!!')
  await wait(0.1)
  t.is(box.pokemon[id].name, 'Mew!!')
  await wait(0.1)
  t.is(box.pokemon[id].name, 'Mew!!')
  await wait(0.1)
  t.is(box.pokemon[id].name, 'Mew!!')
  await wait(0.1)
  t.is(box.pokemon[id].name, 'Mew!!')
  await wait(0.1)
  t.is(box.pokemon[id].name, 'Mew!!')
  await wait(0.1)
  t.is(box.pokemon[id].name, 'Mew!!')
  await wait(0.1)
  t.is(box.pokemon[id].name, 'Mew!!')
  await wait(0.1)
  t.is(box.pokemon[id].name, 'Mew!!')
  await wait(0.1)
  t.is(box.pokemon[id].name, 'Mew!!')
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
    meta: { date },
  }
  store.dispatch('pokemonBox/insert', pokemonValues)
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Squirtle')
  t.is(box.pokemon[id].meta.date, date)
  await wait(3)
  let docR, doc
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  console.log('doc → ', doc)
  t.is(doc.name, 'Squirtle')
  t.falsy(doc.meta) // not a fillable

  // update
  const date2 = new Date('1990-06-22')
  const pokemonValuesNew = {
    id,
    name: 'COOL Squirtle!',
    meta: { date: date2 },
  }
  store.dispatch('pokemonBox/set', pokemonValuesNew)
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'COOL Squirtle!')
  t.deepEqual(box.pokemon[id].type, ['water'])
  t.is(box.pokemon[id].meta.date, date2)
  await wait(3)
  docR = await boxRef.doc(id).get()
  t.is(docR.exists, true)
  doc = docR.data()
  t.is(doc.name, 'COOL Squirtle!')
  t.deepEqual(doc.type, ['water'])

  // update with {id: val}
  store.dispatch('pokemonBox/set', {
    [id]: { name: 'very berry COOL Squirtle!' },
  })
  t.is(box.pokemon[id].name, 'very berry COOL Squirtle!')
  await wait(3)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.is(doc.name, 'very berry COOL Squirtle!')

  // add a new prop (deep)
  store.dispatch('pokemonBox/set', {
    id,
    nested: { new: { deep: { prop: true } } },
  })
  t.deepEqual(box.pokemon[id].nested, { new: { deep: { prop: true } } })
  await wait(3)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.nested, { new: { deep: { prop: true } } })

  // update arrays
  store.dispatch('pokemonBox/set', { type: ['water', 'normal'], id })
  t.deepEqual(box.pokemon[id].type, ['water', 'normal'])
  await wait(3)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.type, ['water', 'normal'])

  // SECOND SET + set chooses insert appropriately
  store.dispatch('pokemonBox/set', { name: 'Charmander', id: id2 })
  t.truthy(box.pokemon[id2])
  t.is(box.pokemon[id2].name, 'Charmander')
  await wait(3)
  docR = await boxRef.doc(id2).get()
  t.is(docR.exists, true)
  doc = docR.data()
  t.is(doc.name, 'Charmander')

  // delete
  store.dispatch('pokemonBox/delete', id)
  t.falsy(box.pokemon[id])
  await wait(3)
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
  await store.dispatch('pokemonBox/insert', {
    id,
    nested: { a: { met: { de: 'aba' } } },
  })
  t.truthy(box.pokemon[id])
  t.deepEqual(box.pokemon[id].nested, { a: { met: { de: 'aba' } } })
  await wait(3)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.nested, { a: { met: { de: 'aba' } } })

  // update {id, val}
  await store.dispatch('pokemonBox/set', {
    id,
    nested: { a: { met: { de: 'ebe' } } },
  })
  t.deepEqual(box.pokemon[id].nested, { a: { met: { de: 'ebe' } } })
  await wait(3)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.nested.a.met, { de: 'ebe' })
  t.deepEqual(doc.nested, { a: { met: { de: 'ebe' } } })

  // update {id: val}
  await store.dispatch('pokemonBox/patch', {
    [id]: { nested: { a: { met: { de: 'ibi' } } } },
  })
  t.deepEqual(box.pokemon[id].nested, { a: { met: { de: 'ibi' } } })
  await wait(3)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.nested.a.met, { de: 'ibi' })
  t.deepEqual(doc.nested, { a: { met: { de: 'ibi' } } })

  // delete via prop Delete
  await store.dispatch('pokemonBox/delete', `${id}.nested.a.met.de`)
  t.deepEqual(box.pokemon[id].nested, { a: { met: {} } })
  await wait(3)
  docR = await boxRef.doc(id).get()
  doc = docR.data()
  t.deepEqual(doc.nested, { a: { met: {} } })
})

test('[COLLECTION] set & delete: batches', async t => {
  // ini set
  const id1 = boxRef.doc().id
  const a = { id: id1, name: 'Bulbasaur', type: { grass: true } }
  const id2 = boxRef.doc().id
  const b = { id: id2, name: 'Charmander', type: { fire: true } }
  const id3 = boxRef.doc().id
  const c = { id: id3, name: 'Squirtle', type: { water: true } }
  const pokemonValues = [a, b, c]
  await store.dispatch('pokemonBox/insertBatch', pokemonValues).catch(console.error)
  t.deepEqual(box.pokemon[id1], a)
  t.deepEqual(box.pokemon[id2], b)
  t.deepEqual(box.pokemon[id3], c)
  await wait(3)
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

test('[COLLECTION] duplicate', async t => {
  let res
  const id = boxRef.doc().id
  await store.dispatch('pokemonBox/insert', { id, name: 'Jamie Lannister' })
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
  await wait(3)
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

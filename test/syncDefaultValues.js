import test from 'ava'
import wait from './helpers/wait'
import {storeSyncConfig as store} from './helpers/index.cjs.js'

const box = store.state.pokemonBox
const boxRef = store.getters['pokemonBox/dbRef']
// const char = store.state.mainCharacter
// const charRef = store.getters['mainCharacter/dbRef']

test('[COLLECTION] sync: defaultValues', async t => {
  const id = boxRef.doc().id
  store.dispatch('pokemonBox/insert', {id, name: 'Squirtle'})
    .catch(console.error)
  t.truthy(box.pokemon[id])
  t.is(box.pokemon[id].name, 'Squirtle')
  t.is(box.pokemon[id].defaultVal, true)
  t.deepEqual(box.pokemon[id].nestedDefaultVal, {types: 'moon'})
  // fetch from server to check
  await wait(2)
  const docR = await boxRef.doc(id).get()
  const doc = docR.data()
  t.truthy(doc)
  t.is(doc.name, 'Squirtle')
  t.is(doc.defaultVal, true)
  t.deepEqual(doc.nestedDefaultVal, {types: 'moon'})
  // change default val and add new pokemon
  box.pokemon[id].nestedDefaultVal.types = 'sun'
  t.deepEqual(box.pokemon[id].nestedDefaultVal, {types: 'sun'})
  t.deepEqual(box._conf.sync.defaultValues, {
    defaultVal: true,
    nestedDefaultVal: {types: 'moon'}
  })
})

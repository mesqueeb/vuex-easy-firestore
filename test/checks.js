import test from 'ava'

test('null', async t => {
  t.pass()
  // await wait()
})
// collection / doc prop should always be an object!
// warn the dev he cannot overwrite the actions used in vuex-easy-firestore

// dispatch('userData/set', {id: '001', name: 'Bulbasaur', tags: {grass: true, dark: false}})
// dispatch('userData/insert', {id: '001', name: 'Bulbasaur', tags: {grass: true, dark: false}})

// dispatch('userData/patch', {id: '001', name: 'Bulbasaur!'})

// dispatch('userData/delete', '001')
// dispatch('userData/delete', '001.tags.grass')

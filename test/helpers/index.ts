export * from './firestore'
export *  from './store'

// store.dispatch('mainCharacter/openDBChannel')
//   .then(_ => {
//     const userName = store.state.mainCharacter.name
//     console.log('userName → ', userName)
//     console.log('store.getters[\'mainCharacter/storeRef\'] → ', store.getters['mainCharacter/storeRef'])
//     store.dispatch('pokemonBox/openDBChannel', {playerName: userName, pokeId: '1'})
//       .then(_ => {
        // store.dispatch('pokemonBox/set', {name: 'a', id: '1', freed: true})
        // store.dispatch('pokemonBox/set', {name: 'x', id: '2', freed: true})
        // const a = store.state.pokemonBox.pokemon
        // console.log('storestate → ', a)
//     })
// })

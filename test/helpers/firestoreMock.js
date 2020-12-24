const fixtureData = {
  __collection__: {
    pokemonBoxes: {
      __doc__: {
        Satoshi: {
          name: 'Satoshi',
          pokemonBelt: [],
          items: [],

          __collection__: {
            pokemon: {
              __doc__: {
                '152': {
                  name: 'Chikorita',
                },
              },
            },
          },
        },
        '{playerName}': {
          name: 'Satoshi',
          pokemonBelt: [],
          items: [],

          __collection__: {
            pokemon: {
              __doc__: {
                '152___': {
                  name: 'Chikorita___',
                },
              },
            },
          },
        },
      },
    },
    playerCharacters: {
      __doc__: {
        Satoshi: {
          name: 'Satoshi',
          pokemonBelt: [],
          items: [],
        },
      },
    },
  },
}

const MockFirestore = require('mock-cloud-firestore')

const firebase = new MockFirestore(fixtureData)

firebase.auth = function () {
  return { currentUser: { uid: 'Satoshi' } }
}

// const a = firebase.firestore().collection('pokemonBoxes/Satoshi/pokemon')

// a.get().then(querySnapshot => {
//   querySnapshot.forEach(doc => {
//     console.log('doc → ', doc)
//   })
// })
export default firebase

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

const Firebase = new MockFirestore(fixtureData)

Firebase.auth = function () {
  return { currentUser: { uid: 'Satoshi' } }
}

// const a = Firebase.firestore().collection('pokemonBoxes/Satoshi/pokemon')

// a.get().then(querySnapshot => {
//   querySnapshot.forEach(doc => {
//     console.log('doc → ', doc)
//   })
// })
export default Firebase

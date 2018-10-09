import pokemonBox from './pokemonBox'
import mainCharacter from './mainCharacter'
import createFirestores from '../../../src/index.js'
import Firestore from '../firestoreMock'

const easyFirestores = createFirestores([pokemonBox, mainCharacter], {logging: true, FirebaseDependency: Firestore})

export default {
  plugins: [easyFirestores]
}

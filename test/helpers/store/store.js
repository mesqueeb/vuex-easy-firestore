import pokemonBox from './pokemonBox'
import testPathVar from './testPathVar'
import mainCharacter from './mainCharacter'
import createFirestores from '../../../dist/index.esm'
import Firestore from '../firestoreMock'

const easyFirestores = createFirestores([pokemonBox, mainCharacter, testPathVar], {logging: true, FirebaseDependency: Firestore})

export default {
  plugins: [easyFirestores]
}

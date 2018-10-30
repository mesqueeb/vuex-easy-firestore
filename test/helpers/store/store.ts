import pokemonBox from './pokemonBox'
import testPathVar from './testPathVar'
import mainCharacter from './mainCharacter'
import createFirestores from '../../../src/index'
import createEasyAccess from 'vuex-easy-access'
// import Firestore from '../firestoreMock'
import Firestore from '../firestore'

const easyAccess = createEasyAccess({vuexEasyFirestore: true})
const easyFirestores = createFirestores(
  [pokemonBox, mainCharacter, testPathVar],
  {logging: false, FirebaseDependency: Firestore}
)

export default {
  plugins: [easyFirestores, easyAccess]
}

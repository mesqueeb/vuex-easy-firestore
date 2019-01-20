import pokemonBox from './pokemonBox'
import testPathVar from './testPathVar'
import testMutations1 from './testMutationsNoStateProp'
import testMutations2 from './testMutationsWithStateProp'
import mainCharacter from './mainCharacter'
import testNestedFillables from './testNestedFillables'
import testNestedGuard from './testNestedGuard'
import initialDoc from './initialDoc'
import serverHooks from './serverHooks'
import user from './user'
import createFirestores from '../../../src/index'
import createEasyAccess from 'vuex-easy-access'
// import Firebase from '../firestoreMock'
import Firebase from '../firestore'

const easyAccess = createEasyAccess({vuexEasyFirestore: true})
const easyFirestores = createFirestores(
  [
    pokemonBox,
    mainCharacter,
    testPathVar,
    testMutations1,
    testMutations2,
    testNestedFillables,
    testNestedGuard,
    initialDoc,
    serverHooks,
    user
  ],
  {logging: false, FirebaseDependency: Firebase}
)

export default {
  plugins: [easyFirestores, easyAccess]
}

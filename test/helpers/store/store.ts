import pokemonBox from './pokemonBox'
import mainCharacter from './mainCharacter'
import pokemonBoxVEA from './pokemonBoxVEA'
import mainCharacterVEA from './mainCharacterVEA'
import testPathVar from './testPathVar'
import testPathVar2 from './testPathVar2'
import testMutations1 from './testMutationsNoStateProp'
import testMutations2 from './testMutationsWithStateProp'
import testNestedFillables from './testNestedFillables'
import testNestedGuard from './testNestedGuard'
import initialDoc from './initialDoc'
import preventInitialDoc from './preventInitialDoc'
import serverHooks from './serverHooks'
import user from './user'
import defaultValuesSetupColNOProp from './defaultValuesSetupColNOProp'
import defaultValuesSetupColProp from './defaultValuesSetupColProp'
import defaultValuesSetupDocNOProp from './defaultValuesSetupDocNOProp'
import defaultValuesSetupDocProp from './defaultValuesSetupDocProp'
import multipleOpenDBChannels from './multipleOpenDBChannels'
import docModeWithPathVar from './docModeWithPathVar'
import createFirestores from '../../../src/index'
import createEasyAccess from 'vuex-easy-access'
// import firebase from '../firestoreMock'
import firebaseApp from '../firestore'

const easyAccess = createEasyAccess({ vuexEasyFirestore: true })
const easyFirestores = createFirestores(
  [
    pokemonBox,
    mainCharacter,
    pokemonBoxVEA,
    mainCharacterVEA,
    testPathVar,
    testPathVar2,
    testMutations1,
    testMutations2,
    testNestedFillables,
    testNestedGuard,
    initialDoc,
    preventInitialDoc,
    serverHooks,
    user,
    defaultValuesSetupColNOProp,
    defaultValuesSetupColProp,
    defaultValuesSetupDocNOProp,
    defaultValuesSetupDocProp,
    multipleOpenDBChannels,
    docModeWithPathVar,
  ],
  { logging: false, FirebaseDependency: firebaseApp }
)

export default {
  plugins: [easyFirestores, easyAccess],
}

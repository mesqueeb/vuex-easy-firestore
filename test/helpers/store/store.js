import pokemonBox from './pokemonBox'
import mainCharacter from './mainCharacter'
import createFirestores from '../../../src/index.js'
const easyFirestores = createFirestores([pokemonBox, mainCharacter])

export default {
  plugins: [easyFirestores]
}

import './firestore'
import store from './store'

store.dispatch('pokemonBox/openDBChannel')
store.dispatch('mainCharacter/openDBChannel')

export default store

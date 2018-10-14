import Vue from 'vue'
import Vuex from 'vuex'
import storeObj from './store'

Vue.use(Vuex)
const store = new Vuex.Store(storeObj)

export default store

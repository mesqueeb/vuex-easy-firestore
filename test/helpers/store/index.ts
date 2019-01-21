import Vue from 'vue'
import Vuex from 'vuex'
import storeObj from './store'

Vue.use(Vuex)
export const store = new Vuex.Store(storeObj)

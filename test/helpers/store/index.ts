import Vue from 'vue'
import Vuex from 'vuex'
import storeObj from './store'

Vue.use(Vuex)
export const storeActions = new Vuex.Store(storeObj)
export const storeDBChannel = new Vuex.Store(storeObj)
export const storeGetters = new Vuex.Store(storeObj)
export const storeMutations = new Vuex.Store(storeObj)
export const storeSyncConfig = new Vuex.Store(storeObj)
export const storeVuexEasyAccess = new Vuex.Store(storeObj)

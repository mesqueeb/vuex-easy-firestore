import { createApp } from 'vue'
import { createStore } from 'vuex'
import storeObj from './store'

const app = createApp({})
export const store = createStore(storeObj)
app.use(store)

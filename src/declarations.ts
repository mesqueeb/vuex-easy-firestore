import { IState } from './module/state'
import { IConfig } from './module/defaultConfig'

export type AnyObject = {[key: string]: any}
// standard store
export type IStore = {
  state: AnyObject
  mutations: AnyObject
  actions: AnyObject
  getters: AnyObject
  [key: string]: any
}

// plugin CONFIG
export type IEasyFirestoreModule = IConfig
// plugin STATE
export type IPluginState = IState & {_conf: IConfig}

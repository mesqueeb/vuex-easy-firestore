import { IState } from './module/state';
import { IConfig } from './module/defaultConfig';
export type AnyObject = {
    [key: string]: any;
};
export type IStore = {
    state: AnyObject;
    mutations: AnyObject;
    actions: AnyObject;
    getters: AnyObject;
    [key: string]: any;
};
export type IEasyFirestoreModule = IConfig;
export type IPluginState = IState & {
    _conf: IConfig;
};

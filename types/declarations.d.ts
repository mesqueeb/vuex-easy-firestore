import { IState } from './module/state';
import { IConfig } from './module/defaultConfig';
export declare type AnyObject = {
    [key: string]: any;
};
export declare type IStore = {
    state: AnyObject;
    mutations: AnyObject;
    actions: AnyObject;
    getters: AnyObject;
    [key: string]: any;
};
export declare type IUserConfig = IConfig;
export declare type IPluginState = IState & {
    _conf: IConfig;
};

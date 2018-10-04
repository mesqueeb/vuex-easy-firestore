import { AnyObject } from '../declarations';
export declare type IState = {
    _sync: {
        signedIn: boolean;
        userId: any;
        pathVariables: AnyObject;
        patching: boolean;
        syncStack: {
            inserts: any[];
            updates: AnyObject;
            deletions: any[];
            propDeletions: any[];
            debounceTimer: any;
        };
        fetched: AnyObject;
        stopPatchingTimeout: any;
    };
    [key: string]: any;
};
declare const _default: {
    _sync: {
        signedIn: boolean;
        userId: any;
        pathVariables: {};
        patching: boolean;
        syncStack: {
            inserts: any[];
            updates: {};
            deletions: any[];
            propDeletions: any[];
            debounceTimer: any;
        };
        fetched: {};
        stopPatchingTimeout: any;
    };
};
export default _default;

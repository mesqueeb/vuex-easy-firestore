import { AnyObject } from '../declarations';
export declare type IState = {
    _sync: {
        signedIn: boolean;
        userId: any;
        unsubscribe: AnyObject;
        pathVariables: AnyObject;
        patching: boolean;
        syncStack: {
            inserts: any[];
            updates: AnyObject;
            propDeletions: AnyObject;
            deletions: any[];
            debounceTimer: any;
        };
        fetched: AnyObject;
        stopPatchingTimeout: any;
    };
    [key: string]: any;
};
/**
 * a function returning the state object
 *
 * @export
 * @returns {IState} the state object
 */
export default function (): IState;

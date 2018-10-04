import 'firebase/firestore';
import 'firebase/auth';
import { AnyObject, IPluginState } from '../declarations';
declare const _default: {
    patchDoc({ state, getters, commit, dispatch }: {
        state: any;
        getters: any;
        commit: any;
        dispatch: any;
    }, { id, ids, doc }?: {
        id?: string;
        ids?: string[];
        doc?: AnyObject;
    }): any;
    deleteDoc({ state, getters, commit, dispatch }: {
        state: any;
        getters: any;
        commit: any;
        dispatch: any;
    }, ids?: any[]): any;
    deleteProp({ state, getters, commit, dispatch }: {
        state: any;
        getters: any;
        commit: any;
        dispatch: any;
    }, path: any): any;
    insertDoc({ state, getters, commit, dispatch }: {
        state: any;
        getters: any;
        commit: any;
        dispatch: any;
    }, docs?: any[]): any;
    insertInitialDoc({ state, getters, commit, dispatch }: {
        state: any;
        getters: any;
        commit: any;
        dispatch: any;
    }): any;
    handleSyncStackDebounce({ state, commit, dispatch, getters }: {
        state: any;
        commit: any;
        dispatch: any;
        getters: any;
    }): boolean;
    batchSync({ getters, commit, dispatch, state }: {
        getters: any;
        commit: any;
        dispatch: any;
        state: any;
    }): Promise<{}>;
    fetch({ state, getters, commit, dispatch }: {
        state: any;
        getters: any;
        commit: any;
        dispatch: any;
    }, { whereFilters, orderBy }?: {
        whereFilters?: any[];
        orderBy?: any[];
    }): Promise<{}>;
    fetchAndAdd({ state, getters, commit, dispatch }: {
        state: any;
        getters: any;
        commit: any;
        dispatch: any;
    }, { whereFilters, orderBy }?: {
        whereFilters?: any[];
        orderBy?: any[];
    }): any;
    serverUpdate({ commit }: {
        commit: any;
    }, { change, id, doc }: {
        change: string;
        id: string;
        doc: AnyObject;
    }): void;
    openDBChannel({ getters, state, commit, dispatch }: {
        getters: any;
        state: any;
        commit: any;
        dispatch: any;
    }, pathVariables: any): Promise<{}>;
    set({ commit, dispatch, getters, state }: {
        commit: any;
        dispatch: any;
        getters: any;
        state: any;
    }, doc: any): any;
    insert({ state, getters, commit, dispatch }: {
        state: any;
        getters: any;
        commit: any;
        dispatch: any;
    }, doc: any): any;
    insertBatch({ state, getters, commit, dispatch }: {
        state: any;
        getters: any;
        commit: any;
        dispatch: any;
    }, docs: any): any;
    patch({ state, getters, commit, dispatch }: {
        state: any;
        getters: any;
        commit: any;
        dispatch: any;
    }, doc: any): any;
    patchBatch({ state, getters, commit, dispatch }: {
        state: any;
        getters: any;
        commit: any;
        dispatch: any;
    }, { doc, ids }: {
        doc: any;
        ids?: any[];
    }): any;
    delete({ state, getters, commit, dispatch }: {
        state: any;
        getters: any;
        commit: any;
        dispatch: any;
    }, id: any): any;
    deleteBatch({ state, getters, commit, dispatch }: {
        state: IPluginState;
        getters: any;
        commit: any;
        dispatch: any;
    }, ids: any): void | import("./defaultConfig").HandleIds;
    _stopPatching({ state, commit }: {
        state: any;
        commit: any;
    }): void;
    _startPatching({ state, commit }: {
        state: any;
        commit: any;
    }): void;
};
export default _default;

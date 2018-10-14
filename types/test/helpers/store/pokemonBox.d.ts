declare const _default: {
    firestorePath: string;
    firestoreRefType: string;
    moduleName: string;
    statePropName: string;
    sync: {
        where: string[][];
        orderBy: any[];
        fillables: string[];
        guard: string[];
        insertHook: (updateStore: any, doc: any, store: any) => any;
        patchHook: (updateStore: any, doc: any, store: any) => any;
        deleteHook: (updateStore: any, id: any, store: any) => any;
    };
    state: {
        playerName: string;
        pokemon: {};
        stats: {
            pokemonCount: number;
            freedCount: number;
        };
    };
    mutations: import("vuex-easy-access/types/declarations").AnyObject;
    actions: {};
    getters: {};
};
export default _default;

import 'firebase/auth';
declare const _default: {
    firestorePath: string;
    firestoreRefType: string;
    moduleName: string;
    statePropName: string;
    actions: {
        loginWithEmail({ dispatch }: {
            dispatch: any;
        }, userNr: any): Promise<void>;
        logout({ dispatch, state }: {
            dispatch: any;
            state: any;
        }): Promise<void>;
    };
    state: {};
    mutations: {};
    getters: {};
};
export default _default;

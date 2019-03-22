import * as Firebase from 'firebase/app';
import 'firebase/firestore';
export declare function setBaseFirebase(firebaseDependency: any): void;
export declare class ArrayUnion {
    isArrayHelper: boolean;
    payload: any;
    constructor(...payload: any);
    executeOn(array: any[]): any[];
    getFirestoreFieldValue(): Firebase.firestore.FieldValue;
}
export declare class ArrayRemove {
    isArrayHelper: boolean;
    payload: any;
    constructor(...payload: any);
    executeOn(array: any[]): any[];
    getFirestoreFieldValue(): Firebase.firestore.FieldValue;
}
export declare function arrayUnion(...payload: any[]): ArrayUnion;
export declare function arrayRemove(...payload: any[]): ArrayRemove;
export declare function isArrayHelper(value: any): boolean;

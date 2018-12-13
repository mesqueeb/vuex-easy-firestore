import * as Firebase from 'firebase/app';
import 'firebase/firestore';
export declare class ArrayUnion {
    name: string;
    payload: any;
    constructor(payload: any);
    executeOn(array: any[]): any[];
    getFirestoreFieldValue(): Firebase.firestore.FieldValue;
}
export declare class ArrayRemove {
    name: string;
    payload: any;
    constructor(payload: any);
    executeOn(array: any[]): any[];
    getFirestoreFieldValue(): Firebase.firestore.FieldValue;
}
export declare function arrayUnion(payload: any): ArrayUnion;
export declare function arrayRemove(payload: any): ArrayRemove;
export declare function isArrayHelper(value: any): boolean;

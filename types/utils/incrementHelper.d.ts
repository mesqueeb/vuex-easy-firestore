import fb from 'firebase/compat/app';
import 'firebase/compat/firestore';
export declare function setFirebaseDependency(firebaseDependency: any): void;
export declare class Increment {
    isIncrementHelper: boolean;
    payload: number;
    constructor(payload: number);
    executeOn(counter: number): number;
    getFirestoreFieldValue(): fb.firestore.FieldValue;
}
export declare function increment(payload: number): Increment;
export declare function isIncrementHelper(payload: any): boolean;

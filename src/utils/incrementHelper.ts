import { isAnyObject, isPlainObject } from 'is-what'
import { increment as firestoreIncrement } from 'firebase/firestore'

export class Increment {
  isIncrementHelper: boolean
  payload: number
  constructor(payload: number) {
    this.isIncrementHelper = true
    this.payload = payload
  }
  executeOn(counter: number) {
    return counter + this.payload
  }
  getFirestoreFieldValue() {
    return firestoreIncrement(this.payload)
  }
}

export function increment(payload: number) {
  return new Increment(payload)
}

export function isIncrementHelper(payload: any) {
  // return payload instanceof Increment
  return (
    isAnyObject(payload) &&
    !isPlainObject(payload) &&
    // @ts-ignore
    payload.isIncrementHelper === true
  )
}

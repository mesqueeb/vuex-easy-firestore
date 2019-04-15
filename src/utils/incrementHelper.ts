import { isAnyObject, isPlainObject } from 'is-what'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

let Firebase = firebase

export function setFirebaseDependency (firebaseDependency) {
  Firebase = firebaseDependency
}

export class Increment {
  isIncrementHelper: boolean
  payload: number
  constructor (payload: number) {
    this.isIncrementHelper = true
    this.payload = payload
  }
  executeOn (counter: number) {
    return counter + this.payload
  }
  getFirestoreFieldValue () {
    return Firebase.firestore.FieldValue.increment(this.payload)
  }
}

export function increment (payload: number) {
  return new Increment(payload)
}

export function isIncrementHelper (payload: any) {
  // return payload instanceof Increment
  return (
    isAnyObject(payload) &&
    !isPlainObject(payload) &&
    // @ts-ignore
    payload.isIncrementHelper === true
  )
}

import { isAnyObject, isPlainObject } from 'is-what'
import fb from 'firebase/compat/app'
import 'firebase/compat/firestore'

let firebase = fb

export function setFirebaseDependency (firebaseDependency) {
  firebase = firebaseDependency
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
    return firebase.firestore.FieldValue.increment(this.payload)
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

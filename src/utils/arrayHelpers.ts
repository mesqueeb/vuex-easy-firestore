import { isAnyObject, isPlainObject, isArray } from 'is-what'
import fb from 'firebase/compat/app'
import 'firebase/compat/firestore'
import isEqual from 'lodash-es/isEqual'

let firebase = fb

export function setFirebaseDependency (firebaseDependency) {
  firebase = firebaseDependency
}

export class ArrayUnion {
  isArrayHelper: boolean
  payload: any
  constructor (...payload: any) {
    this.isArrayHelper = true
    this.payload = payload
  }
  executeOn (array: any[]) {
    this.payload.forEach(item => {
      const index =
        isAnyObject(item)
          ? array.findIndex(_item => isEqual(_item, item))
          : array.indexOf(item)
      if (index === -1) {
        array.push(item)
      }
    })
    return array
  }
  getFirestoreFieldValue () {
    return firebase.firestore.FieldValue.arrayUnion(...this.payload)
  }
}

export class ArrayRemove {
  isArrayHelper: boolean
  payload: any
  constructor (...payload: any) {
    this.isArrayHelper = true
    this.payload = payload
  }
  executeOn (array: any[]) {
    this.payload.forEach(item => {
      const index =
        isAnyObject(item)
          ? array.findIndex(_item => isEqual(_item, item))
          : array.indexOf(item)
      if (index > -1) {
        array.splice(index, 1)
      }
    })
    return array
  }
  getFirestoreFieldValue () {
    return firebase.firestore.FieldValue.arrayRemove(...this.payload)
  }
}

export function arrayUnion (...payload) {
  return new ArrayUnion(...payload)
}

export function arrayRemove (...payload) {
  return new ArrayRemove(...payload)
}

export function isArrayHelper (value) {
  // this is bugged in vuex actions, I DONT KNOW WHY
  // return (
  //   value instanceof ArrayUnion ||
  //   value instanceof ArrayRemove
  // )
  return (
    isAnyObject(value) &&
    !isPlainObject(value) &&
    // @ts-ignore
    value.isArrayHelper === true
  )
}

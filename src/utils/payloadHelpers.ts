import error from '../module/errors'
import { isPlainObject, isString } from 'is-what'

/**
 * gets an ID from a single piece of payload.
 *
 * @export
 * @param {(object | string)} payloadPiece
 * @param {object} [conf] (optional - for error handling) the vuex-easy-access config
 * @param {string} [path] (optional - for error handling) the path called
 * @param {(object | any[] | string)} [fullPayload] (optional - for error handling) the full payload on which each was `getId()` called
 * @returns {string} the id
 */
export function getId(
  payloadPiece: object | string,
  conf?: object,
  path?: string,
  fullPayload?: object | any[] | string
): string {
  if (isString(payloadPiece)) return payloadPiece
  if (isPlainObject(payloadPiece)) {
    if ('id' in payloadPiece) return payloadPiece.id
    const keys = Object.keys(payloadPiece)
    if (keys.length === 1) return keys[0]
  }
  return ''
}

/**
 * Returns a value of a payload piece. Eg. {[id]: 'val'} will return 'val'
 *
 * @param {*} payloadPiece
 * @returns {*} the value
 */
export function getValueFromPayloadPiece(payloadPiece: any): any {
  if (
    isPlainObject(payloadPiece) &&
    !payloadPiece.id &&
    Object.keys(payloadPiece).length === 1 &&
    isPlainObject(payloadPiece[Object.keys(payloadPiece)[0]])
  ) {
    return Object.values(payloadPiece)[0]
  }
  return payloadPiece
}

import { isNumber, isFunction, isPlainObject, isArray, isString } from 'is-what'
import { IEasyFirestoreModule } from '../declarations'

/**
 * Check the config for type errors for non-TypeScript users
 *
 * @export
 * @param {IEasyFirestoreModule} config
 * @returns {boolean} true if no errors, false if errors
 */
export default function (config: IEasyFirestoreModule): boolean {
  const errors = []
  const reqProps = ['firestorePath', 'moduleName']
  reqProps.forEach(prop => {
    if (!config[prop]) {
      errors.push(`Missing \`${prop}\` in your module!`)
    }
  })
  if (/(\.|\/)/.test(config.statePropName)) {
    errors.push(`statePropName must only include letters from [a-z]`)
  }
  if (/\./.test(config.moduleName)) {
    errors.push(`moduleName must only include letters from [a-z] and forward slashes '/'`)
  }
  const syncProps = ['where', 'orderBy', 'fillables', 'guard', 'defaultValues', 'insertHook', 'patchHook', 'deleteHook', 'insertBatchHook', 'patchBatchHook', 'deleteBatchHook']
  syncProps.forEach(prop => {
    if (config[prop]) {
      errors.push(`We found \`${prop}\` on your module, are you sure this shouldn't be inside a prop called \`sync\`?`)
    }
  })
  const serverChangeProps = ['modifiedHook', 'defaultValues', 'addedHook', 'removedHook']
  serverChangeProps.forEach(prop => {
    if (config[prop]) {
      errors.push(`We found \`${prop}\` on your module, are you sure this shouldn't be inside a prop called \`serverChange\`?`)
    }
  })
  const fetchProps = ['docLimit']
  fetchProps.forEach(prop => {
    if (config[prop]) {
      errors.push(`We found \`${prop}\` on your module, are you sure this shouldn't be inside a prop called \`fetch\`?`)
    }
  })
  const numberProps = ['docLimit']
  numberProps.forEach(prop => {
    const _prop = config.fetch[prop]
    if (!isNumber(_prop)) errors.push(`\`${prop}\` should be a Number, but is not.`)
  })
  const functionProps = ['insertHook', 'patchHook', 'deleteHook', 'insertBatchHook', 'patchBatchHook', 'deleteBatchHook', 'addedHook', 'modifiedHook', 'removedHook']
  functionProps.forEach(prop => {
    const _prop = (syncProps.includes(prop))
      ? config.sync[prop]
      : config.serverChange[prop]
    if (!isFunction(_prop)) errors.push(`\`${prop}\` should be a Function, but is not.`)
  })
  const objectProps = ['sync', 'serverChange', 'defaultValues', 'fetch']
  objectProps.forEach(prop => {
    const _prop = (prop === 'defaultValues')
      ? config.sync[prop]
      : config[prop]
    if (!isPlainObject(_prop)) errors.push(`\`${prop}\` should be an Object, but is not.`)
  })
  const stringProps = ['firestorePath', 'firestoreRefType', 'moduleName', 'statePropName']
  stringProps.forEach(prop => {
    const _prop = config[prop]
    if (!isString(_prop)) errors.push(`\`${prop}\` should be a String, but is not.`)
  })
  const arrayProps = ['where', 'orderBy', 'fillables', 'guard']
  arrayProps.forEach(prop => {
    const _prop = config.sync[prop]
    if (!isArray(_prop)) errors.push(`\`${prop}\` should be an Array, but is not.`)
  })
  if (errors.length) {
    console.group('[vuex-easy-firestore] ERRORS:')
    console.error(`Module: ${config.moduleName}`)
    errors.forEach(e => console.error(' - ', e))
    console.groupEnd()
    Error()
    return false
  }
  return true
}

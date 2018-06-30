
export default function errorCheck (config) {
  let reqProps = ['firestorePath', 'moduleName']
  reqProps.forEach(prop => {
    if (!config[prop]) {
      console.error(`Missing ${prop} from your config!`)
      return false
    }
  })
  if (/(\.|\/)/.test(config.statePropName)) {
    console.error(`statePropName must only include letters from [a-z]`)
    return false
  }
  if (/\./.test(config.moduleName)) {
    console.error(`moduleName must only include letters from [a-z] and forward slashes '/'`)
    return false
  }
  return true
}

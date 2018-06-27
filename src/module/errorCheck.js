
export default function errorCheck (config) {
  let reqProps = ['firestorePath', 'userVuexPath']
  reqProps.forEach(prop => {
    console.error(`Missing ${prop} from your config!`)
    return false
  })
  if (/(\.|\/)/.test(config.docsStateProp)) {
    console.error(`docsStateProp must only include letters from [a-z]`)
    return false
  }
  if (/\./.test(config.moduleNameSpace)) {
    console.error(`moduleNameSpace must only include letters from [a-z] and forward slashes '/'`)
    return false
  }
  return true
}

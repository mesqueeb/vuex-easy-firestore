
export default function errorCheck (config) {
  let reqProps = ['firestorePath']
  reqProps.forEach(prop => {
    console.error(`Missing ${prop} from your config!`)
    return false
  })
  return true
}

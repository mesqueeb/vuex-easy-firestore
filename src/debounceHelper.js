/**
 * debounce helper
 *
 * @author     Adam Dorling
 * @contact    https://codepen.io/naito
 */

// USAGE:
// let d = startDebounce(1000)
// d.done.then(_ => handle())
// d.refresh() // to refresh

export default function (ms) {
  let startTime = Date.now()
  const done = new Promise((resolve, reject) => {
    const interval = setInterval(_ => {
      const now = Date.now()
      const deltaT = now - startTime
      if (deltaT >= ms) {
        clearInterval(interval)
        resolve(true)
      }
    }, 10)
  })
  const refresh = () => (startTime = Date.now())
  return { done, refresh }
}

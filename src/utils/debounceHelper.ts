/**
 * Debounce helper
 *
 * let wait = startDebounce(1000)
 * wait.done.then(_ => handle())
 * wait.refresh() // to refresh
 *
 * @export
 * @param {number} ms
 * @returns {{done: any, refresh: () => {}}}
 * @author Adam Dorling
 * @contact https://codepen.io/naito
 */
export default function (ms: number): { done: any; refresh: () => {} } {
  let startTime = Date.now()
  const done = new Promise((resolve, reject) => {
    const interval = setInterval((_) => {
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

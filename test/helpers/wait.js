
/**
 * use await wait(x) to wait x seconds
 *
 * @export
 * @param {number} sec the amount of seconds
 * @returns a promise that resolves after the amount of seconds
 */
export default function (sec) {
  const ms = (sec) ? sec * 1000 : 1000
  return new Promise((resolve, reject) => {
    if (!ms) return reject
    return setTimeout(resolve, ms)
  })
}

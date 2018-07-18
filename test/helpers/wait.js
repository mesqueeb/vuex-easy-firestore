
export default function (sec) {
  const ms = (sec) ? sec * 1000 : 1000
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

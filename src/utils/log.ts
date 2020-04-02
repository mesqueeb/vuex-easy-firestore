export default function () {
  let inGroup = false

  const methodToColorMap = {
    debug: `#7f8c8d`, // Gray
    log: `#2ecc71`, // Green
    warn: `#f39c12`, // Yellow
    error: `#c0392b`, // Red
    groupCollapsed: `#3498db`, // Blue
    groupEnd: null, // No colored prefix on groupEnd
  }

  const print = function (method, args) {
    if (method === 'groupCollapsed') {
      // Safari doesn't print all console.groupCollapsed() arguments:
      // https://bugs.webkit.org/show_bug.cgi?id=182754
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        console[method](...args)
        return
      }
    }

    const styles = [
      `background: ${methodToColorMap[method]}`,
      `border-radius: 0.5em`,
      `color: white`,
      `font-weight: bold`,
      `padding: 2px 0.5em`,
    ]

    // When in a group, the workbox prefix is not displayed.
    const logPrefix = inGroup ? [] : ['%cworkbox', styles.join('')]

    console[method](...logPrefix, ...args)

    if (method === 'groupCollapsed') {
      inGroup = true
    }
    if (method === 'groupEnd') {
      inGroup = false
    }
  }

  const api = {}
  for (const method of Object.keys(methodToColorMap)) {
    api[method] = (...args) => {
      print(method, args)
    }
  }

  return api
}

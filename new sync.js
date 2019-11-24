
const syncToFirestore = () => {
  return new Promise((resolve, reject) => {
    setTimeout(reject, 300)
  })
}

const defaultSyncTimer = () => ({
  timer: null,
  resolves: [],
  rejects: [],
})

let syncTimer = defaultSyncTimer()

const resetSyncTimer = () => { syncTimer = defaultSyncTimer() }

const syncDebounceFn = () => {
  return new Promise((resolve, reject) => {
    if (syncTimer.timer !== null) {
      clearTimeout(syncTimer.timer)
      syncTimer.timer = null
    }
    syncTimer.timer = setTimeout(async () => {
      try {
        const result = await syncToFirestore() // this executes firebase SDK batch
        syncTimer.resolves.forEach(r => r())
        resetSyncTimer()
      } catch (error) {
        syncTimer.rejects.forEach(r => r())
        resetSyncTimer()
      }
    }, 1000)
    syncTimer.resolves.push(resolve)
    syncTimer.rejects.push(reject)
  })
}

const printRes = i => console.log(i, 'resolved', performance.now())

setTimeout(() => { syncDebounceFn().then(() => printRes(1)) }, 30)
setTimeout(() => { syncDebounceFn().then(() => printRes(2)) }, 60)
setTimeout(() => { syncDebounceFn().then(() => printRes(3)) }, 90)

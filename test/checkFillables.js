import checkFillables from '../src/utils/checkFillables'
import test from 'ava'

test('checkFillables', t => {
  let res, doc, fillables, guard
  doc = {name: 'n1', id: '1', filled: true, notfilled: false}
  fillables = ['name', 'filled', 'id']
  res = checkFillables(doc, fillables, guard)
  t.deepEqual(res, {name: 'n1', id: '1', filled: true})

  doc = {name: 'n1', id: '1', filled: true, guarded: true}
  fillables = []
  guard = ['guarded']
  res = checkFillables(doc, fillables, guard)
  t.deepEqual(res, {name: 'n1', id: '1', filled: true})
})

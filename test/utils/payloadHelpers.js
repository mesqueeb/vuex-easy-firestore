import test from 'ava'
import { getId, getValueFromPayloadPiece } from '../../src/utils/payloadHelpers'

test('getId', t => {
  let res, payload
  const id = '123'
  // {id: val}
  payload = { [id]: { name: 'very berry COOL Squirtle!' } }
  res = getId(payload)
  t.deepEqual(res, '123')
  // {id, val}
  payload = { id, name: 'very berry COOL Squirtle!' }
  res = getId(payload)
  t.deepEqual(res, '123')
})

test('getValueFromPayloadPiece', t => {
  let res, payload
  const id = '123'
  // {id: val}
  payload = { [id]: { name: 'very berry COOL Squirtle!' } }
  res = getValueFromPayloadPiece(payload)
  t.deepEqual(res, { name: 'very berry COOL Squirtle!' })
  // {id, val}
  payload = { id, name: 'very berry COOL Squirtle!' }
  res = getValueFromPayloadPiece(payload)
  t.deepEqual(res, { id, name: 'very berry COOL Squirtle!' })
})

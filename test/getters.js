import test from 'ava'
import { isDate } from 'is-what'
// import wait from './helpers/wait'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { store } from './helpers/index.cjs.js'

const box = store.state.pokemonBox
const char = store.state.mainCharacter
// const boxRef = store.getters['pokemonBox/dbRef']
// const charRef = store.getters['mainCharacter/dbRef']

test('[prepareForPatch] collection', async t => {
  let res
  box._sync.userId = 'charlie'
  box._conf.sync.fillables = ['body', 'del', 'pathdel']
  box._conf.sync.guard = []
  // prepareForPatch
  res = store.getters['pokemonBox/prepareForPatch'](['1', '2'], {
    body: 'new',
    del: firebase.firestore.FieldValue.delete(),
  })
  t.deepEqual(Object.keys(res), ['1', '2'])
  t.is(res['1'].body, 'new')
  t.is(res['2'].body, 'new')
  t.is(res['1'].del._delegate._methodName, 'FieldValue.delete')
  t.is(res['2'].del._delegate._methodName, 'FieldValue.delete')
  t.is(res['1'].id, '1')
  t.is(res['2'].id, '2')
  t.is(res['1'].updated_by, 'charlie')
  t.is(res['2'].updated_by, 'charlie')
  t.is(isDate(res['1'].updated_at), true)
  t.is(isDate(res['2'].updated_at), true)
  // prepareForPropDeletion
  res = store.getters['pokemonBox/prepareForPropDeletion']('1.pathdel.a')
  t.is(res['1'].id, '1')
  t.is(res['1']['pathdel.a']._delegate._methodName, 'FieldValue.delete')
  t.is(res['1'].updated_by, 'charlie')
  t.is(isDate(res['1'].updated_at), true)
  // deeper delete
  res = store.getters['pokemonBox/prepareForPropDeletion']('1.a.met.de.aba')
  t.is(res['1']['a.met.de.aba']._delegate._methodName, 'FieldValue.delete')
  // different fillables & guard
  box._conf.sync.guard = ['updated_at', 'updated_by', 'id']
  res = store.getters['pokemonBox/prepareForPropDeletion']('1.pathdel.a')
  t.is(res['1'].id, '1') // id stays even if it's added to guard
  t.is(res['1']['pathdel.a']._delegate._methodName, 'FieldValue.delete')
  t.is(res['1'].updated_by, undefined)
  t.is(res['1'].updated_at, undefined)
})

test('[prepareForPatch] doc', async t => {
  let res
  char._sync.userId = 'charlie'
  char._conf.sync.fillables = ['body', 'del', 'pathdel']
  char._conf.sync.guard = []
  // prepareForPatch
  const docModeId = store.getters['mainCharacter/docModeId']
  res = store.getters['mainCharacter/prepareForPatch']([], {
    body: 'new',
    del: firebase.firestore.FieldValue.delete(),
  })
  t.deepEqual(Object.keys(res), [docModeId])
  t.is(res[docModeId].body, 'new')
  t.is(res[docModeId].del._delegate._methodName, 'FieldValue.delete')
  t.is(res[docModeId].id, docModeId)
  t.is(res[docModeId].updated_by, 'charlie')
  t.is(isDate(res[docModeId].updated_at), true)
  // prepareForPropDeletion
  res = store.getters['mainCharacter/prepareForPropDeletion']('1.pathdel.a')
  t.is(res[docModeId].id, docModeId)
  t.is(res[docModeId]['1.pathdel.a']._delegate._methodName, 'FieldValue.delete')
  t.is(res[docModeId].updated_by, 'charlie')
  t.is(isDate(res[docModeId].updated_at), true)
  // different fillables & guard
  char._conf.sync.guard = ['updated_at', 'updated_by', 'id']
  res = store.getters['mainCharacter/prepareForPropDeletion']('1.pathdel.a')
  t.is(res[docModeId].id, docModeId) // id stays even if it's added to guard
  t.is(res[docModeId]['1.pathdel.a']._delegate._methodName, 'FieldValue.delete')
  t.is(res[docModeId].updated_by, undefined)
  t.is(res[docModeId].updated_at, undefined)
})

test('[where]', async t => {
  let res
  char._conf.sync.where = [
    ['hi.{userId}.docs.{nr}', '==', '{big}'],
    ['{userId}', '==', '{userId}'],
  ]
  char._sync.userId = 'charlie'
  char._sync.pathVariables = { nr: '1', big: 'shot' }
  res = store.getters['mainCharacter/getWhereArrays']()
  t.deepEqual(res, [
    ['hi.charlie.docs.1', '==', 'shot'],
    ['charlie', '==', 'charlie'],
  ])
  t.deepEqual(char._conf.sync.where, [
    ['hi.{userId}.docs.{nr}', '==', '{big}'],
    ['{userId}', '==', '{userId}'],
  ])
  // accept other values than strings
  char._conf.sync.where = [
    [1, '==', true],
    ['{userId}', '==', '{date}', '{nulll}', '{undef}'],
  ]
  char._sync.userId = ''
  const date = new Date()
  char._sync.pathVariables = { date, nulll: null, undef: undefined }
  res = store.getters['mainCharacter/getWhereArrays']()
  t.deepEqual(res, [
    [1, '==', true],
    ['', '==', date, null, undefined],
  ])
  t.deepEqual(char._conf.sync.where, [
    [1, '==', true],
    ['{userId}', '==', '{date}', '{nulll}', '{undef}'],
  ])
  char._conf.sync.where = [[1, true, undefined, '{a}', NaN]]
  char._sync.pathVariables = { a: {} }
  res = store.getters['mainCharacter/getWhereArrays']()
  t.deepEqual(res, [[1, true, undefined, {}, NaN]])
  t.deepEqual(char._conf.sync.where, [[1, true, undefined, '{a}', NaN]])
})

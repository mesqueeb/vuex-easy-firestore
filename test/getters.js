import test from 'ava'
import { isObject, isArray, isDate } from 'is-what'
import wait from './helpers/wait'
import * as Firebase from 'firebase/app'
import 'firebase/firestore'
import {storeGetters as store} from './helpers/index.cjs.js'

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
  res = store.getters['pokemonBox/prepareForPatch'](['1', '2'], {body: 'new', del: Firebase.firestore.FieldValue.delete()})
  t.deepEqual(Object.keys(res), ['1', '2'])
  t.is(res['1'].body, 'new')
  t.is(res['2'].body, 'new')
  t.is(res['1'].del._methodName, 'FieldValue.delete')
  t.is(res['2'].del._methodName, 'FieldValue.delete')
  t.is(res['1'].id, '1')
  t.is(res['2'].id, '2')
  t.is(res['1'].updated_by, 'charlie')
  t.is(res['2'].updated_by, 'charlie')
  t.is(res['1'].updated_at._methodName, 'FieldValue.serverTimestamp')
  t.is(res['2'].updated_at._methodName, 'FieldValue.serverTimestamp')
  // prepareForPropDeletion
  res = store.getters['pokemonBox/prepareForPropDeletion']('1.pathdel.a')
  t.is(res['1'].id, '1')
  t.is(res['1']['pathdel.a']._methodName, 'FieldValue.delete')
  t.is(res['1'].updated_by, 'charlie')
  t.is(res['1'].updated_at._methodName, 'FieldValue.serverTimestamp')
  // deeper delete
  res = store.getters['pokemonBox/prepareForPropDeletion']('1.a.met.de.aba')
  t.is(res['1']['a.met.de.aba']._methodName, 'FieldValue.delete')
  // different fillables & guard
  box._conf.sync.guard = ['updated_at', 'updated_by', 'id']
  res = store.getters['pokemonBox/prepareForPropDeletion']('1.pathdel.a')
  t.is(res['1'].id, '1') // id stays even if it's added to guard
  t.is(res['1']['pathdel.a']._methodName, 'FieldValue.delete')
  t.is(res['1'].updated_by, undefined)
  t.is(res['1'].updated_at, undefined)
})

test('[prepareForPatch] doc', async t => {
  let res
  char._sync.userId = 'charlie'
  char._conf.sync.fillables = ['body', 'del', 'pathdel']
  char._conf.sync.guard = []
  // prepareForPatch
  res = store.getters['mainCharacter/prepareForPatch']([], {body: 'new', del: Firebase.firestore.FieldValue.delete()})
  t.deepEqual(Object.keys(res), ['singleDoc'])
  t.is(res['singleDoc'].body, 'new')
  t.is(res['singleDoc'].del._methodName, 'FieldValue.delete')
  t.is(res['singleDoc'].id, 'singleDoc')
  t.is(res['singleDoc'].updated_by, 'charlie')
  t.is(res['singleDoc'].updated_at._methodName, 'FieldValue.serverTimestamp')
  // prepareForPropDeletion
  res = store.getters['mainCharacter/prepareForPropDeletion']('1.pathdel.a')
  t.is(res['singleDoc'].id, 'singleDoc')
  t.is(res['singleDoc']['1.pathdel.a']._methodName, 'FieldValue.delete')
  t.is(res['singleDoc'].updated_by, 'charlie')
  t.is(res['singleDoc'].updated_at._methodName, 'FieldValue.serverTimestamp')
  // different fillables & guard
  char._conf.sync.guard = ['updated_at', 'updated_by', 'id']
  res = store.getters['mainCharacter/prepareForPropDeletion']('1.pathdel.a')
  t.is(res['singleDoc'].id, 'singleDoc') // id stays even if it's added to guard
  t.is(res['singleDoc']['1.pathdel.a']._methodName, 'FieldValue.delete')
  t.is(res['singleDoc'].updated_by, undefined)
  t.is(res['singleDoc'].updated_at, undefined)
})

test('[whereFilters]', async t => {
  let res
  char._conf.sync.where = [['hi.{userId}.docs.{nr}', '==', '{big}'], ['{userId}', '==', '{userId}']]
  char._sync.userId = 'charlie'
  char._sync.pathVariables = {nr: '1', big: 'shot'}
  res = store.getters['mainCharacter/whereFilters']
  t.deepEqual(res, [['hi.charlie.docs.1', '==', 'shot'], ['charlie', '==', 'charlie']])
  // accept other values than strings
  char._conf.sync.where = [[1, '==', true], ['{userId}', '==', '{date}', '{nulll}', '{undef}']]
  char._sync.userId = ''
  const date = new Date()
  char._sync.pathVariables = {date, nulll: null, undef: undefined}
  res = store.getters['mainCharacter/whereFilters']
  t.deepEqual(res, [[1, '==', true], ['', '==', date, null, undefined]])
  char._conf.sync.where = [[1, true, undefined, '{a}', NaN]]
  char._sync.pathVariables = {a: {}}
  res = store.getters['mainCharacter/whereFilters']
  t.deepEqual(res, [[1, true, undefined, {}, NaN]])
})

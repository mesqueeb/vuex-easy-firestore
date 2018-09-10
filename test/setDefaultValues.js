import test from 'ava'
import setDefaultValues from './helpers/setDefaultValues.cjs'
import { isDate, isFunction } from 'is-what'

test('my recursive object assign', async t => {
  let res, defaultValues, target
  const nd = new Date()
  defaultValues = {body: 'a'}
  target = {dueDate: nd}
  res = setDefaultValues(target, defaultValues)
  t.true(isDate(res.dueDate))
  t.is(res.body, 'a')
  t.deepEqual(defaultValues, {body: 'a'})
  t.deepEqual(target, {dueDate: nd})

  defaultValues = {body: 'a'}
  target = {body: 'b'}
  res = setDefaultValues(target, defaultValues)
  t.is(res.body, 'b')
  t.deepEqual(defaultValues, {body: 'a'})
  t.deepEqual(target, {body: 'b'})

  const newDate = new Date()
  defaultValues = {
    info: {
      time: 'now',
      newDate,
      very: {
        deep: {
          prop: false
        }
      }
    }
  }
  target = {
    info: {
      date: 'tomorrow',
      very: {
        deep: {
          prop: true
        }
      }
    }
  }
  res = setDefaultValues(target, defaultValues)
  t.deepEqual(res, {
    info: {
      time: 'now',
      newDate,
      date: 'tomorrow',
      very: {
        deep: {
          prop: true
        }
      }
    }
  })
  t.deepEqual(defaultValues, {
    info: {
      time: 'now',
      newDate,
      very: {
        deep: {
          prop: false
        }
      }
    }
  })
  t.deepEqual(target, {
    info: {
      date: 'tomorrow',
      very: {
        deep: {
          prop: true
        }
      }
    }
  })
  t.true(isDate(res.info.newDate))

  defaultValues = {
    body: 'a',
    body2: {head: false},
    tail: {}
  }
  target = {
    body: {head: true},
    body2: {head: {eyes: true}},
  }
  res = setDefaultValues(target, defaultValues)
  t.deepEqual(res, {
    body: {head: true},
    body2: {head: {eyes: true}},
    tail: {}
  })
  t.deepEqual(defaultValues, {
    body: 'a',
    body2: {head: false},
    tail: {}
  })
  t.deepEqual(target, {
    body: {head: true},
    body2: {head: {eyes: true}},
  })

  defaultValues = {
    body: 'a',
    body2: {head: false},
    tail: {}
  }
  target = 'a'
  res = setDefaultValues(target, defaultValues)
  t.is(res, 'a')
  t.deepEqual(defaultValues, {
    body: 'a',
    body2: {head: false},
    tail: {}
  })

})

test('custom %convertTimestamp% defaultValue', async t => {
  let res, defaultValues, target
  const dateStr = '1990-06-22T17:35:00'
  const nd = new Date(dateStr)
  defaultValues = {
    body: '%convertTimestamp%',
    body2: {nd: '%convertTimestamp%'},
    firebase: {specialTS: { _ts: '%convertTimestamp%' }}
  }
  target = {
    body: dateStr,
    body2: {nd},
    firebase: {specialTS: { _ts: {toDate: _ => { return nd }} }}
  }
  res = setDefaultValues(target, defaultValues)
  t.deepEqual(res, {
    body: nd,
    body2: {nd},
    firebase: {specialTS: { _ts: nd }}
  })
  t.deepEqual(defaultValues, {
    body: '%convertTimestamp%',
    body2: {nd: '%convertTimestamp%'},
    firebase: {specialTS: { _ts: '%convertTimestamp%' }}
  })
  t.is(target.body, dateStr)
  t.deepEqual(target.body2, {nd})
  t.true(isFunction(target.firebase.specialTS._ts.toDate))
})

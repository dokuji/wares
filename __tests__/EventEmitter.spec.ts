import { EventEmitter } from './../lib/EventEmitter'

const emitter = new EventEmitter()

test('emitter signature', () => {
  expect(emitter.emitter).not.toBe(null)
  expect(typeof emitter.on).toBe('function')
  expect(typeof emitter.once).toBe('function')
  expect(typeof emitter.emit).toBe('function')
  expect(typeof emitter.removeListener).toBe('function')
  expect(typeof emitter.removeAllListeners).toBe('function')
  expect(typeof emitter.hasListeners).toBe('function')
  expect(typeof emitter.pipeEventsFrom).toBe('function')
  expect(typeof emitter.pipeEventsFrom).toBe('function')
  expect(typeof emitter.unifyEmitter).toBe('function')
})

test('once triggers', (done) => {
  const evt = 'once'
  emitter.once(evt, done)
  emitter.emit(evt)
})

test('once trigger only once', (done) => {
  const evt = 'once'
  let count = 0
  emitter.once(evt, () => {
    count += 1
  })
  emitter.emit(evt)
  emitter.emit(evt)
  emitter.emit(evt)
  process.nextTick(() => {
    expect(count).toBe(1)
    done()
  })
})

test('on triggers every time', (done) => {
  const evt = 'on'
  const exec = 3
  let count = 0
  emitter.on(evt, () => {
    count += 1
  })
  for (let i = 0; i < exec; i++) {
    emitter.emit(evt)
  }
  process.nextTick(() => {
    expect(count).toBe(exec)
    done()
  })
})

test('multi on triggers every time', (done) => {
  const evt = 'on'
  const exec = 3
  const count = [0, 0]
  emitter.on(evt, () => {
    count[0] += 1
  })
  emitter.on(evt, () => {
    count[1] += 1
  })
  for (let i = 0; i < exec; i++) {
    emitter.emit(evt)
  }
  process.nextTick(() => {
    expect(count[0]).toBe(exec)
    expect(count[1]).toBe(exec)
    done()
  })
})

test('once trigger only once', (done) => {
  const evt = 'once'
  let count = 0
  emitter.once(evt, () => {
    count += 1
  })
  emitter.emit(evt)
  emitter.emit(evt)
  emitter.emit(evt)
  process.nextTick(() => {
    expect(count).toBe(1)
    done()
  })
})

test('once doesnt trigger if canceled (removeListener)', (done) => {
  const evt = 'once1'
  let count = 0
  const cb = () => {
    count += 1
  }
  emitter.once(evt, cb)
  emitter.removeListener(evt, cb)
  emitter.emit(evt)
  process.nextTick(() => {
    expect(count).toBe(0)
    done()
  })
})

test('on doesnt trigger if another event', (done) => {
  const evt1 = 'on1'
  const evt2 = 'on2'
  let count = 0
  emitter.on(evt1, () => {
    count += 1
  })
  emitter.emit(evt2)
  process.nextTick(() => {
    expect(count).toBe(0)
    done()
  })
})

test('on doesnt trigger if canceled (removeListener)', (done) => {
  const evt = 'on1'
  let count = 0
  const cb = () => {
    count += 1
  }
  emitter.on(evt, cb)
  emitter.removeListener(evt, cb)
  emitter.emit(evt)
  process.nextTick(() => {
    expect(count).toBe(0)
    done()
  })
})

test('on doesnt trigger if canceled (subscription)', (done) => {
  const evt = 'on1'
  let count = 0
  const sub = emitter.on(evt, () => {
    count += 1
  }, true)
  sub.remove()
  emitter.emit(evt)
  process.nextTick(() => {
    expect(count).toBe(0)
    done()
  })
})

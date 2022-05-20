import { Draft } from 'immer'
import MemoryStorage from '../lib/persist/MemoryStorage'
import { AsyncStore, Store } from '../lib/Store'
import { Persisted } from '../lib/Persisted'

type MyState = {
  c: number,
  a: boolean,
  b: string,
  o: { x: boolean }
}

const state: MyState = {
  c: 0,
  a: true,
  b: 'b',
  o: { x: false }
}

type MyActions =
  { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'set', payload: number }
  | { type: 'mutate-o' }

const reducer = (state: Draft<MyState>, action: MyActions): MyState => {
  switch (action.type) {
    case 'set':
      state.c = action.payload
      state.a = false
      break
    case 'increment':
      state.c = state.c + 1
      state.b = 'changed'
      break
    case 'decrement':
      state.c = state.c - 1
      break
    case 'mutate-o':
      state.o.x = true
      break
  }
  return state
}
const store = new Store(state, reducer)

test('store is constructed', () => {
  expect(store.state).toBe(state)
})

test('store dispatch', () => {
  const prev = store.state
  const next = store.dispatch({ type: 'set', payload: 10 })
  expect(next.c).toBe(10)
  expect(next).toBe(store.state)
  expect(next).not.toBe(prev)
  expect(next.o).toBe(prev.o)
})

test('store dispatch mutate object', () => {
  const prev = store.state
  const next = store.dispatch({ type: 'mutate-o' })
  expect(next.o.x).toBe(true)
  expect(next.o).not.toBe(prev.o)
})

test('store update event emitted', (done) => {
  const next = 50
  const subs = store.observe('c', (value) => {
    expect(value).toBe(next)
    subs.forEach(s => s.remove())
    done()
  })
  store.dispatch({ type: 'set', payload: next })
})

// -----------------------
// ASYNC STORE
// -----------------------

const asyncReducer = (state: Draft<MyState>, action: MyActions): Promise<MyState> => {
  return Promise.resolve(reducer(state, action))
}
const asyncStore = new AsyncStore(state, asyncReducer)

test('asyncStore is constructed', () => {
  expect(asyncStore.state).toBe(state)
})

test('asyncStore dispatch', async () => {
  const prev = asyncStore.state
  const next = await asyncStore.dispatch({ type: 'set', payload: 10 })
  expect(next.c).toBe(10)
  expect(next).toBe(asyncStore.state)
  expect(next).not.toBe(prev)
  expect(next.o).toBe(prev.o)
})

test('asyncStore dispatch mutate object', async () => {
  const prev = asyncStore.state
  const next = await asyncStore.dispatch({ type: 'mutate-o' })
  expect(next.o.x).toBe(true)
  expect(next.o).not.toBe(prev.o)
})

test('asyncStore update event emitted', (done) => {
  const next = 50
  const subs = asyncStore.observe('c', (value) => {
    expect(value).toBe(next)
    subs.forEach(s => s.remove())
    done()
  })
  asyncStore.dispatch({ type: 'set', payload: next })
})

// -----------------------
// PERSISTED STORE
// -----------------------

function sleep (ms: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms)
  })
}
const persitedStorage = Persisted(store, {
  name: 'persisted',
  storage: MemoryStorage
})

test('persisted changes', async () => {
  store.dispatch({ type: 'set', payload: 100 })
  expect(store.state.c).toBe(100)
  await sleep(100)
  const expected = {
    a: false,
    b: 'b',
    c: 100,
    o: {
      x: true
    }
  }
  const rawStoraged = await persitedStorage.storage.getItem(persitedStorage.key) || ''
  expect(rawStoraged[0]).toBe('{')
  expect(JSON.parse(rawStoraged)).toEqual(expected)
  const storaged = await persitedStorage.get()
  expect(storaged).toEqual(expected)
})

const encryptedStorage = Persisted(store, {
  name: 'encryptedPersisted',
  password: 'storage-password',
  storage: MemoryStorage
})

test('encrypted persisted storage', async () => {
  store.dispatch({ type: 'set', payload: 200 })
  expect(store.state.c).toBe(200)
  await sleep(100)
  const expected = {
    a: false,
    b: 'b',
    c: 200,
    o: {
      x: true
    }
  }
  const rawStoraged = await encryptedStorage.storage
    .getItem(encryptedStorage.key) || ''
  expect(rawStoraged[0]).not.toBe('{')
  expect(() => JSON.parse(rawStoraged)).toThrow()
  const storaged = await encryptedStorage.get()
  expect(storaged).toEqual(expected)
})

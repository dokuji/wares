import MemoryStorage from '../lib/persist/MemoryStorage'

test('memory storage', async () => {
  MemoryStorage.setItem('test', 1)
  const mem = await MemoryStorage.getItem('test')
  expect(mem).toBe('1')
})

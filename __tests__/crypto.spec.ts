import { aesGcmEncrypt, aesGcmDecrypt } from '../lib/crypto'

test('crypto', async () => {
  const secretData = 'my-secret-data'
  const password = 'my-password'

  const encrypted = await aesGcmEncrypt(secretData, password)
  expect(encrypted).not.toEqual(secretData)
  const decrypted = await aesGcmDecrypt(encrypted, password)
  expect(decrypted).toBe(secretData)
})

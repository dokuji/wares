const crypto = require('crypto')

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (buffer) => crypto.randomFillSync(buffer),
    subtle: crypto.webcrypto.subtle
  }
})

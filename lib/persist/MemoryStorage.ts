import { IStandardStorageApi } from './types'

class MemoryStorage implements IStandardStorageApi {
  private storageCache: { [T: string]: string } = {}

  key (index: number | string): Promise<string> {
    const i = typeof index === 'number' ? index : parseInt(index, 10)
    return new Promise((resolve, reject) => {
      return (isNaN(i))
        ? reject(new Error('key must be a number'))
        : resolve(Object.keys(this.storageCache)[i])
    })
  }

  getAllKeys (): Promise<string[]> {
    return Promise.resolve(Object.keys(this.storageCache))
  }

  setItem (key: string, value: any): Promise<void> {
    this.storageCache[key] = typeof value === 'string' ? value : JSON.stringify(value)
    return Promise.resolve(undefined)
  }

  getItem (key: string): Promise<string | null> {
    const value: string | null = this.storageCache[key] || null
    return Promise.resolve(value)
  }

  removeItem (key: string): Promise<void> {
    if (key in this.storageCache) {
      delete this.storageCache[key]
    }
    return Promise.resolve(undefined)
  }

  clear (): Promise<void> {
    this.storageCache = {}
    return Promise.resolve(undefined)
  }
}

export default new MemoryStorage()

import { IAsyncStorage, IStandardStorageApi } from './types'

function assertAsyncStorageApi (storage: IAsyncStorage): boolean {
  return typeof storage.clear === 'function' &&
    typeof storage.getAllKeys === 'function' &&
    typeof storage.getItem === 'function' &&
    typeof storage.removeItem === 'function' &&
    typeof storage.setItem === 'function'
}

export function wrapAsyncStorage (storage: IAsyncStorage): AsyncStorageWrapper {
  if (storage instanceof Storage) {
    throw new Error('wrapAsyncStorage cannot be called with Storage')
  } else if (!assertAsyncStorageApi(storage)) {
    throw new Error('wrapAsyncStorage must be called on an AsyncStorage object')
  } else {
    return new AsyncStorageWrapper(storage)
  }
}

class AsyncStorageWrapper implements IStandardStorageApi {
  private _storage: IAsyncStorage

  __isWaresAsyncStorage: boolean = true

  constructor (asyncStorage: IAsyncStorage) {
    this._storage = asyncStorage
  }

  async key (index: number): Promise<string | null> {
    const keys = await this._storage.getAllKeys()
    if (Array.isArray(keys)) {
      return keys[index] || null
    } else {
      return null
    }
  }

  getAllKeys (): Promise<string[]> {
    return this._storage.getAllKeys().then(k => k || [])
  }

  getItem (key: string): Promise<string | null> {
    return this._storage.getItem(key)
  }

  async setItem (key: string, value: any): Promise<void> {
    await this._storage.setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value)
    )
    return Promise.resolve(undefined)
  }

  async removeItem (key: string): Promise<void> {
    await this._storage.removeItem(key)
    return Promise.resolve(undefined)
  }

  async clear (): Promise<void> {
    await this._storage.clear()
    return Promise.resolve(undefined)
  }
}

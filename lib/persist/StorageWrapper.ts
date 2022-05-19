import { IStandardStorageApi } from './types'

export function wrapStorage (storage: Storage): StorageWrapper {
  if (storage instanceof Storage) {
    return new StorageWrapper(storage)
  } else {
    throw new Error('wrapStorage must be invoked on Storage object')
  }
}

class StorageWrapper implements IStandardStorageApi {
  private _storage: Storage

  constructor (storage: Storage) {
    this._storage = storage
  }

  key (index: number): Promise<string | null> {
    return Promise.resolve(this._storage.key(index))
  }

  getAllKeys (): Promise<string[]> {
    let i = 0
    let key = null
    const keys: string[] = []
    do {
      key = this._storage.key(i)
      if (key != null) {
        keys.push(key)
      }
      i++
    } while (key != null)
    return Promise.resolve(keys)
  }

  getItem (key: string): Promise<string | null> {
    return Promise.resolve(this._storage.getItem(key))
  }

  setItem (key: string, value: any): Promise<void> {
    this._storage.setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value)
    )
    return Promise.resolve(undefined)
  }

  removeItem (key: string): Promise<void> {
    this._storage.removeItem(key)
    return Promise.resolve(undefined)
  }

  clear (): Promise<void> {
    this._storage.clear()
    return Promise.resolve(undefined)
  }
}

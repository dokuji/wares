import { getStorageType, StorageType } from './persist/getStorageType'
import MemoryStorage from './persist/MemoryStorage'
import { AnyStorage, IStandardStorageApi } from './persist/types'
import { WaresStorage } from './persist/WaresStorage'
import { StandardAction, Store, AsyncStore } from './Store'
import { OnHydrate, ParseStorage } from './types'
import { wrapStorage } from './persist/StorageWrapper'
import { wrapAsyncStorage } from './persist/AsyncStorageWrapper'

export interface IPersistConfig<State> {
  name: string,
  /**
   * AES-GCM encryption of the persisted data with password
   */
  password?: string,
  storage?: AnyStorage,
  parseStorage?: ParseStorage<State>
  onHydrate?: OnHydrate<State>
}

export function Persisted<State, A extends StandardAction> (
  store: Store<State, A> | AsyncStore<State, A>,
  conf: IPersistConfig<State>
) {
  let storage: WaresStorage

  const storageType = getStorageType(conf.storage)
  if (storageType === StorageType.WaresStorage) {
    // @ts-ignore
    storage = conf.storage
  } else {
    let storageApi: IStandardStorageApi | null = null
    switch (storageType) {
      case StorageType.None:
        storageApi = MemoryStorage
        break
      case StorageType.StandardStorageApi:
        // @ts-ignore
        storageApi = conf.storage
        break
      case StorageType.AsyncStorage:
        // @ts-ignore
        storageApi = wrapAsyncStorage(conf.storage)
        break
      case StorageType.Storage:
        // @ts-ignore
        storageApi = wrapStorage(conf.storage)
        break
    }
    if (storageApi == null) {
      throw new Error('Could not initialize storage for PersistedStore')
    }
    storage = new WaresStorage(conf.name, storageApi, conf.password ?? null)
  }

  storage.subscribe(
    store,
    conf.onHydrate,
    conf.parseStorage
  )

  return storage
}

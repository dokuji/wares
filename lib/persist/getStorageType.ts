import { AnyStorage } from './types'

export enum StorageType {
  /**
   * base Storage type, synchronous
   */
  Storage,
  /**
   * Asynchronous storage from @react-native-async-storage/async-storage
   */
  AsyncStorage,
  /**
   * Standardized AsyncStorageApi from ./types/IStandardStorageApi
   */
  StandardStorageApi,
  /**
   * WaresStorage from ./WaresStorage
   */
  WaresStorage,
  /**
   * Not a supported storage type
   */
  None
}

function isStorageLike (storage: AnyStorage): boolean {
  return 'key' in storage && typeof storage.key === 'function' &&
    'getItem' in storage && typeof storage.getItem === 'function' &&
    'setItem' in storage && typeof storage.setItem === 'function' &&
    'removeItem' in storage && typeof storage.removeItem === 'function' &&
    'clear' in storage && typeof storage.clear === 'function'
}

function isAsyncStorageLike (storage: AnyStorage): boolean {
  return 'getAllKeys' in storage && typeof storage.getAllKeys === 'function' &&
    'getItem' in storage && typeof storage.getItem === 'function' &&
    'setItem' in storage && typeof storage.setItem === 'function' &&
    'removeItem' in storage && typeof storage.removeItem === 'function' &&
    'clear' in storage && typeof storage.clear === 'function'
}

function isAsyncStorageApiLike (storage: AnyStorage): boolean {
  return 'key' in storage && typeof storage.key === 'function' &&
    'getAllKeys' in storage && typeof storage.getAllKeys === 'function' &&
    'getItem' in storage && typeof storage.getItem === 'function' &&
    'setItem' in storage && typeof storage.setItem === 'function' &&
    'removeItem' in storage && typeof storage.removeItem === 'function' &&
    'clear' in storage && typeof storage.clear === 'function'
}

function isWaresStorageLike (storage: AnyStorage): boolean {
  return '__isWaresAsyncStorage' in storage &&
    typeof storage.key === 'string' &&
    'get' in storage && typeof storage.get === 'function' &&
    'persist' in storage && typeof storage.persist === 'function' &&
    'clear' in storage && typeof storage.clear === 'function'
}

export function getStorageType (storage?: AnyStorage | null): StorageType {
  if (storage == null) return StorageType.None
  if (isWaresStorageLike(storage)) {
    return StorageType.WaresStorage
  } else if (isAsyncStorageApiLike(storage)) {
    return StorageType.StandardStorageApi
  } else if (isAsyncStorageLike(storage)) {
    return StorageType.AsyncStorage
  } else if (isStorageLike(storage)) {
    return StorageType.Storage
  } else {
    return StorageType.None
  }
}

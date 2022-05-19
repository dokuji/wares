
export interface IStorage {
  key (index: number): string | null,
  getItem (key: string, value: string): string | null,
  setItem (key: string, value: string): undefined,
  removeItem (key: string): undefined,
  clear (): undefined
}

export type AsyncCallback<T = undefined> = (error?: Error, result?: T) => void

export interface IAsyncStorage {
  getItem (key: string, callback?: AsyncCallback<string | null>): Promise<string | null>,
  setItem (key: string, value: string, callback?: AsyncCallback): Promise<void>,
  removeItem (key: string, callback?: AsyncCallback): Promise<any>,
  getAllKeys (callback?: AsyncCallback<string[] | null>): Promise<string[] | null>
  clear (callback?: AsyncCallback): Promise<Object>
}

export interface IStandardStorageApi {
  /**
   * The key() method of the Storage interface, when passed a number n,
   * returns the name of the nth key in a given Storage object.
   * The order of keys is user-agent defined, so you should not rely on it.
   */
  key (index: number): Promise<string | null>,
  /**
   * Returns an array of all the keys in Storage object
   */
  getAllKeys (): Promise<string[]>,
  /**
   * The getItem() method of the Storage interface, when passed a key name,
   * will return that key's value, or null if the key does not exist,
   * in the given Storage object.
   */
  getItem (key: string): Promise<string | null>,
  /**
   * The setItem() method of the Storage interface,
   * when passed a key name and value,
   * will add that key to the given Storage object,
   * or update that key's value if it already exists.
   */
  setItem (key: string, value: any): Promise<void>,
  /**
   * The removeItem() method of the Storage interface,
   * when passed a key name,
   * will remove that key from the given Storage object if it exists.
   * The Storage interface of the Web Storage API provides
   * access to a particular domain's session or local storage.
   * If there is no item associated with the given key, this method will do nothing.
   */
  removeItem (key: string): Promise<void>
  /**
   * The clear() method of the Storage interface
   * clears all keys stored in a given Storage object.
   */
  clear (): Promise<void>
}

export interface IWaresAsyncStorage {
  readonly __isWaresStorage: boolean,
  readonly key: string,
  get (): Promise<any>
  persist (value: any): Promise<void>
  clear (): Promise<void>
}

export type AnyStorage = IStandardStorageApi | IAsyncStorage | IStorage | Storage

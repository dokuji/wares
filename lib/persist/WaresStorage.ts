import { EventSubscription } from '../EventEmitter'
import { AsyncStore, Store } from '../Store'
import { OnHydrate, ParseStorage, StoreEvent } from '../types'
import { isPromise } from '../utils/isPromise'
import { IStandardStorageApi, IWaresAsyncStorage } from './types'

export class WaresStorage implements IWaresAsyncStorage {
  readonly key: string
  readonly storage: IStandardStorageApi
  readonly __isWaresStorage: boolean = true
  subscription: EventSubscription | null = null

  constructor (key: string, storage: IStandardStorageApi) {
    this.key = key
    this.storage = storage
  }

  async get (): Promise<any> {
    try {
      const stored = await this.storage.getItem(this.key)
      if (stored == null) return null
      return JSON.parse(stored)
    } catch (e) {
      return null
    }
  }

  subscribe<State> (
    store: Store<State, any> | AsyncStore<State, any>,
    onHydrate?: OnHydrate<State>,
    parseStorage?: ParseStorage<State>
  ): EventSubscription {
    this.subscription = store.on(StoreEvent.UPDATE, null, () => {
      this.persist(store.state)
    }, true)

    this.get().then(async (state?: any) => {
      if (state != null) {
        if (typeof onHydrate === 'function') {
          store.on(StoreEvent.HYDRATED, null, onHydrate)
        }
        if (typeof parseStorage === 'function') {
          const res = parseStorage(state)
          if (isPromise(res)) {
            state = await res
          } else {
            state = res
          }
        }
        store.hydrate(state)
      }
    })

    return this.subscription
  }

  async persist (value: any): Promise<void> {
    try {
      await this.storage.setItem(this.key, value)
    } catch (_) {
    }
    return undefined
  }

  async clear (clearSubscription: boolean = false): Promise<void> {
    try {
      await this.storage.removeItem(this.key)
      if (clearSubscription) this.clearSubscription()
    } catch (_) {}
    return undefined
  }

  clearSubscription (): void {
    this.subscription?.remove()
  }
}

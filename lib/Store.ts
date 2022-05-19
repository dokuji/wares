import { Patch, enablePatches, Draft, createDraft, finishDraft } from 'immer'
import cloneDeep from 'lodash.clonedeep'
import { EventSubscription, TypedEventEmitter } from './EventEmitter'
import { StoreError, StoreEvent } from './types'

enablePatches()

function getPatchedKeys (patches: Patch[]): string[] {
  const patched: string[] = []
  patches.forEach(p => {
    if (p && Array.isArray(p.path)) {
      if (p.path[0] == null && p.value != null) {
        patched.push(...Object.keys(p.value))
      } else {
        patched.push(p.path[0].toString())
      }
    }
  })
  return patched
}

export type StandardAction = {
  type: string,
  payload?: any,
  error?: boolean,
  meta?: any
}

type Reducer<State, A extends StandardAction> =
  (state: Draft<State>, action: A) => State

type AsyncReducer<State, A extends StandardAction> =
  (state: Draft<State>, action: A) => Promise<State>

export class BaseStore<State, A extends StandardAction> extends TypedEventEmitter<StoreEvent> {
  protected readonly initialState: State
  protected _state: State
  protected reducer: Reducer<State, A> | AsyncReducer<State, A>
  protected _hydrated: boolean = false

  constructor (state: State, reducer: Reducer<State, A> | AsyncReducer<State, A>) {
    super()
    this.initialState = Object.freeze(cloneDeep(state))
    this._state = state
    this.reducer = reducer
  }

  get state (): State {
    return this._state
  }

  get<K extends keyof State> (key: K): State[K] {
    return this._state[key]
  }

  observe<K extends keyof State> (
    key: K,
    onUpdate: (value: State[K]) => void
  ): EventSubscription[] {
    return [
      this.on(StoreEvent.UPDATE, key as string, onUpdate, true)
    ]
  }

  private emitUpdate (keys?: string | string[]) {
    if (typeof keys === 'string') {
      // @ts-ignore
      this.emit(StoreEvent.UPDATE, keys, this._state[keys])
    } else if (Array.isArray(keys)) {
      // @ts-ignore
      for (const k of keys) {
        // @ts-expect-error
        this.emit(StoreEvent.UPDATE, k, this._state[k])
      }
    }
    this.emit(StoreEvent.UPDATE, null, this._state)
  }

  protected finishDraft (draft: Draft<State>) {
    let updatedKeys: string[] = []
    // @ts-ignore
    this._state = finishDraft(draft, (patches: Patch[]) => {
      updatedKeys = getPatchedKeys(patches)
    })
    // cannot be done in callback, cause needs access to updated state
    this.emitUpdate(updatedKeys)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatch (_action: A): State | Promise<State> {
    throw new Error(StoreError.ABSTRACT)
  }

  /**
   * Hydrate store state, meant for recovering a persisted state
   * @param state
   */
  hydrate (state: Partial<State> | null) {
    if (!this._hydrated) {
      if (state != null) {
        this._state = Object.assign({}, this._state, state)
      }
      this._hydrated = true
      this.emit(StoreEvent.HYDRATED, null, state)
    } else {
      throw new Error(StoreError.HYDRATED)
    }
  }
}

export class Store<State, A extends StandardAction> extends BaseStore<State, A> {
  declare protected reducer: Reducer<State, A>
  // eslint-disable-next-line no-useless-constructor
  constructor (state: State, reducer: Reducer<State, A>) {
    super(state, reducer)
  }

  dispatch (action: A): State {
    const draft = createDraft(this._state)
    this.reducer(draft, action)
    this.finishDraft(draft)
    return this._state
  }
}

export class AsyncStore<State, A extends StandardAction> extends BaseStore<State, A> {
  declare protected reducer: AsyncReducer<State, A>

  // eslint-disable-next-line no-useless-constructor
  constructor (state: State, reducer: AsyncReducer<State, A>) {
    super(state, reducer)
  }

  async dispatch (action: A): Promise<State> {
    const draft = createDraft(this._state)
    await Promise.resolve(this.reducer(draft, action))
    this.finishDraft(draft)
    return this._state
  }
}

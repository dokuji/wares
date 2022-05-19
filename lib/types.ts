
export interface JsonObject {
  // eslint-disable-next-line no-use-before-define
  [x: string]: string | number | boolean | Date | JsonObject | JsonArray
}

export interface JsonArray
  extends Array<string | number | boolean | Date | JsonObject | JsonArray>
  {}

export type Serializable = JsonObject
  | string
  | number
  | boolean
  | Date
  | null
  | JsonArray
  | Serializable[]

export type BaseState = object

/* eslint-disable no-unused-vars */
export enum StoreEvent {
  /**
   * Event triggered when the store is ready
   */
  READY = 'ready',
  /**
   * Event triggered when store state is updated,
   * at least 2 events should be triggered:
   *  - general state update
   *  - key update event for every changed
   */
  UPDATE = 'update',
  /**
   * Triggered when an error happens on a state update
   */
  UPDATE_ERROR = 'update_error',
  /**
   * Triggered after the store is hydrated with a new state
   */
  HYDRATED = 'hydrated'
}

export enum StoreError {
  ABSTRACT = 'store.abstract',
  DESTROYED = 'store.destroyed',
  HYDRATED = 'store.already_hydrated'
}
/* eslint-enable no-unused-vars */

export type Result<T, Err extends Error = Error> =
  { type: 'success', value: T }
  | { type: 'error', value: Err }

export type ParseStorage<State> = (storagedState?: Partial<State>) => Partial<State> | Promise<Partial<State>>

export type OnHydrate<State> = (state?: Partial<State>) => void

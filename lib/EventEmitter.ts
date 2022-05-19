import EvEmitter, { Emitter, EventListener } from 'event-emitter'
import allOf from 'event-emitter/all-off'
import hasListeners from 'event-emitter/has-listeners'
import pipe from 'event-emitter/pipe'
import unify from 'event-emitter/unify'

export type {
  Emitter,
  EventListener
}

export class EventSubscription {
  private type: string
  private listener: EventListener
  private emitter: Emitter

  constructor (type: string, listener: EventListener, emitter: Emitter) {
    this.type = type
    this.listener = listener
    this.emitter = emitter
  }

  remove () {
    this.emitter.off(this.type, this.listener)
  }
}

export class EventEmitter {
  private _emitter: Emitter = EvEmitter()

  get emitter (): Emitter {
    return this._emitter
  }

  on (type: string, listener: EventListener): void
  on (type: string, listener: EventListener, subscribe: true): EventSubscription
  on (type: string, listener: EventListener, subscribe: boolean = false): EventSubscription | void {
    this._emitter.on(type, listener)
    if (subscribe) return new EventSubscription(type, listener, this._emitter)
  }

  once (type: string, listener: EventListener): void
  once (type: string, listener: EventListener, subscribe: true): EventSubscription
  once (type: string, listener: EventListener, subscribe: boolean = false): EventSubscription | void {
    this._emitter.once(type, listener)
    if (subscribe) return new EventSubscription(type, listener, this._emitter)
  }

  emit (type: string, ...args: any[]) {
    this._emitter.emit(type, ...args)
  }

  removeListener (type: string, listener: EventListener) {
    this._emitter.off(type, listener)
  }

  removeAllListeners () {
    allOf(this._emitter)
  }

  hasListeners (type?: string): boolean {
    return hasListeners(this._emitter, type)
  }

  pipeEventsTo (emitter: Emitter, name?: string | symbol): pipe.EmitterPipe {
    return pipe(this._emitter, emitter, name)
  }

  pipeEventsFrom (emitter: Emitter, name?: string | symbol): pipe.EmitterPipe {
    return pipe(emitter, this._emitter, name)
  }

  unifyEmitter (emitter: Emitter): Emitter {
    return unify(this._emitter, emitter)
  }
}

export class TypedEventEmitter<Types> {
  private _emitter: Emitter = EvEmitter()

  get emitter (): Emitter {
    return this._emitter
  }

  getEventName (type?: Types | null, name?: string | null): string {
    if (type == null && name == null) return ''
    else if (type == null) return name || ''
    else if (name == null) return `${type}`
    else return `${type}:${name}`
  }

  on (type: Types | null, name: string | null, listener: EventListener): void
  on (type: Types | null, name: string | null, listener: EventListener, subscribe: true): EventSubscription
  on (type: Types | null, name: string | null, listener: EventListener, subscribe: boolean = false): EventSubscription | void {
    const evt = this.getEventName(type, name)
    this._emitter.on(evt, listener)
    if (subscribe) return new EventSubscription(evt, listener, this._emitter)
  }

  once (type: Types | null, name: string | null, listener: EventListener): void
  once (type: Types | null, name: string | null, listener: EventListener, subscribe: true): EventSubscription
  once (type: Types | null, name: string | null, listener: EventListener, subscribe: boolean = false): EventSubscription | void {
    const evt = this.getEventName(type, name)
    this._emitter.once(evt, listener)
    if (subscribe) return new EventSubscription(evt, listener, this._emitter)
  }

  emit (type: Types | null, name: string | null, ...args: any[]) {
    this._emitter.emit(this.getEventName(type, name), ...args)
  }

  removeListener (type: Types | null, name: string | null, listener: EventListener) {
    this._emitter.off(this.getEventName(type, name), listener)
  }

  removeAllListeners () {
    allOf(this._emitter)
  }

  hasListeners (type?: Types | null, name?: string | null): boolean {
    return hasListeners(this._emitter, this.getEventName(type, name))
  }

  pipeEventsTo (emitter: Emitter, type?: Types | null, name?: string | null): pipe.EmitterPipe {
    return pipe(this._emitter, emitter, this.getEventName(type, name))
  }

  pipeEventsFrom (emitter: Emitter, type?: Types | null, name?: string | null): pipe.EmitterPipe {
    return pipe(emitter, this._emitter, this.getEventName(type, name))
  }

  unifyEmitter (emitter: Emitter): Emitter {
    return unify(this._emitter, emitter)
  }
}

export class EventEmitter extends EventTarget {
    dispatch<T>(event: string, detail: T) {
        this.dispatchEvent(new CustomEvent(event, { detail }))
    }
}
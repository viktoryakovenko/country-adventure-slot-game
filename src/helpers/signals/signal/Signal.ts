import PromiseList from "../../promise/PromiseList";
import {SignalSlot} from "app/helpers/signals/signal/signal.typing";

export default class Signal<T = void> {
    private slots: Array<SignalSlotContainer<T>>;
    private _onListenerAdded: Signal | undefined;

    get onListenerAdded(): Signal {
        this._onListenerAdded = this._onListenerAdded ?? new Signal<void>();
        return this._onListenerAdded;
    }

    constructor() {
        this.slots = [];
    }

    addOnce(slot: SignalSlot<T>, $this: unknown = null, priory = 0): Signal<T> {
        this.add(value => {
            this.remove(slot);
            slot(value);
        }, $this, priory);
        return this;
    }

    reAdd(slot: SignalSlot<T>, $this: unknown = null): Signal<T> {
        this.remove(slot);
        this.add(slot, $this);
        return this;
    }

    add(slot: SignalSlot<T>, $this: unknown = null, priory = 0): Signal<T> {
        this.slots.push(new SignalSlotContainer<T>(
            slot,
            $this,
            priory,
        ));
        return this;
    }

    emit(payload: T): PromiseList<T> {
        return this.notify(this.slots, payload);
    }

    private notify(slots: Array<SignalSlotContainer<T>>, payload: T): PromiseList<T> {
        const promises: Promise<T>[] = [];
        slots
            .sort((a, b) => a.priority - b.priority)
            .forEach(slot => {
                if (slot.length == 1) {
                    slot.call(payload);
                } else {
                    promises.push(new Promise<T>(resolve => {
                        slot.call(payload, resolve);
                    }));
                }
            });
        return new PromiseList(promises);
    }

    remove(slot: (value: T) => void): Signal<T> {
        this.slots = this.slots.filter(function(item) {
            const result = item.slot !== slot;
            if (!result) {
                item.dispose();
            }
            return result;
        });
        return this;
    }


    unload($this: unknown) {
        this.slots = this.slots.filter(function(item) {
            const result = item.ctx !== $this;
            if (!result) {
                item.dispose();
            }
            return result;
        });
    }

    async promise(): Promise<T> {
        return new Promise<T>(resolve => {
            this.addOnce(value => {
                resolve(value);
            });
        });
    }

    filter(cb: (payload: T) => boolean, $this: unknown = null) {
        const signal = new Signal<T>();
        const slot = (value: T) => {
            if (cb(value)) {
                signal.emit(value);
            }
        };
        this.add(slot, $this);
        return signal;
    }
}

class SignalSlotContainer<T> {
    readonly length: number;
    private isDisposed = false;

    constructor(readonly slot: SignalSlot<T>, readonly ctx: unknown, readonly priority: number) {
        this.length = slot.length;
    }

    call(payload: T, resolve?: (p: T) => void) {
        if (this.isDisposed) {
            return;
        }
        if (this.ctx) {
            this.slot.call(this.ctx, payload, <() => void>resolve);
        } else {
            this.slot.call(this.slot, payload, <() => void>resolve);
        }
    }

    dispose() {
        this.isDisposed = true;
    }
}

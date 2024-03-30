import {SignalSlot} from "app/helpers/signals/signal/signal.typing";

export default class SignalSlotCounter {
    public counter = 0;
    public readonly signalSlot: SignalSlot<unknown> = ((value, resolve) => {
        this.counter++;
        resolve?.();
    });
}

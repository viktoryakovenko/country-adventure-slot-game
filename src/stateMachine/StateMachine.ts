import {State} from "app/stateMachine/State";
import {Disposer} from "app/scenes/model/Scene";

export default class StateMachine<T> implements Disposer<void> {
    private readonly states: Map<T, State<T>> = new Map();
    private activeState: State<T> | undefined;

    constructor(private devLogs = false) {
    }

    async goto(key: T): Promise<State<T>> {
        const state = this.states.get(key);
        if (!state) {
            throw new Error(`state ${key} not existent`);
        }
        if (state == this.activeState) {
            return Promise.resolve(state);
        }
        if (!state.isActive()) {
            await state.activate();
        }
        if (!state.enable()) {
            await state.deactivate();
            return Promise.resolve(this.activeState ?? state);
        }
        if (this.activeState?.isActive()) {
            await this.activeState.deactivate();
        }
        this.activeState = state;
        this.devLogs && console.log(`%cSM: %c${key}`, "color: red", "color: green");
        return await state.run();
    }

    async add(key: T, state: State<T>) {
        if (!state.isComposed()) {
            await state.compose();
        }
        this.states.set(key, state);
        state.init(this);
    }

    async remove(key: T) {
        const oldState = this.states.get(key);
        if (oldState) {
            await oldState.dispose();
        }
        this.states.delete(key);
    }

    async replace(key: T, state: State<T>) {
        await this.remove(key);
        await this.add(key, state);
    }

    dispose(): void {
        this.states.forEach(async value => {
            if (value.isActive()) {
                await value.deactivate();
            }
            await value.dispose();
        });
        this.states.clear();
    }
}

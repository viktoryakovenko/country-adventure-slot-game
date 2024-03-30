import {Activator, Composer, DeActivator, Disposer} from "app/scenes/model/Scene";
import StateMachine from "app/stateMachine/StateMachine";

export abstract class State<T> implements Disposer<Promise<void>>, Activator<Promise<void>>,
    Composer<Promise<void>>, DeActivator<Promise<void>> {
    private active = false;
    private composed = false;
    private stateMachine!: StateMachine<T>;

    init(stateMachine: StateMachine<T>) {
        this.stateMachine = stateMachine;
    }

    enable(): boolean {
        return true;
    }

    isActive(): boolean {
        return this.active;
    }

    isComposed(): boolean {
        return this.composed;
    }

    async activate() {
        this.active = true;
    }

    async compose() {
        this.composed = true;
    }

    async deactivate() {
        this.active = false;
    }

    async dispose() {
        this.composed = false;
    }

    abstract run(): Promise<State<T>>;

    protected goto(state: T): Promise<State<T>> {
        return this.stateMachine.goto(state);
    }

    protected replaceState(key: T, state: State<T>) {
        return this.stateMachine.replace(key, state);
    }

    protected addState(key: T, state: State<T>) {
        return this.stateMachine.add(key, state);
    }
}

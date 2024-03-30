export default interface Scene extends Composer, Disposer, Activator, DeActivator {

}

export interface Composer<T = void> {
    compose(): T;
}

export interface Activator<T = void> {
    activate(): T;
}

export interface DeActivator<T = void> {
    deactivate(): T;
}

export interface Disposer<T = void> {
    dispose(): T;
}

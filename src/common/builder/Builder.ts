export interface Builder<T, R> {
    build(payload: T): R
}

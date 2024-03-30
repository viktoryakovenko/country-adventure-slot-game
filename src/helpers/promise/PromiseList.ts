export default class PromiseList<T> {
    constructor(protected promises:Array<Promise<T>>) {
    }

    all():Promise<T[]> {
        return Promise.all(this.promises);
    }

    race():Promise<T> {
        return Promise.race(this.promises);
    }
}

import PromiseList from "app/helpers/promise/PromiseList";

interface Array<T> {
    remove(o: T): Array<T>;

    contains(o: T): boolean;

    isLastElement(o: T): boolean;

    getRandomValue(defaultValue?: T): T;

    getRandomIndexOf(value?: T): number;

    amount(value?: T): number;

    promise(): PromiseList<T>;
}

declare global {
    interface Array<T> {
        remove(o: T): Array<T>;

        contains(o: T): boolean;

        isLastElement(o: T): boolean;

        getRandomValue(defaultValue?: T): T;

        getRandomIndexOf(value?: T): number;

        amount(value?: T): number;

        promise(): PromiseList<T>;
    }
}

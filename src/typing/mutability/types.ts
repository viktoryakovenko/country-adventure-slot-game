/* eslint-disable */
import PromiseList from "app/helpers/promise/PromiseList";

interface Array<T> {
    remove(o: T): Array<T>;

    contains(o: T): boolean;

    getRandomValue(defaultValue?: T): T;

    getRandomIndexOf(value?: T): number;

    isLastElement(o: T): boolean;

    amount(value?: T): number;

    promise(): PromiseList<T>;
}

Object.defineProperty(Array.prototype, "promise", {
    value: function() {
        const promises = this.map((o: any) => {
            if (o instanceof Promise) {
                return o;
            }
            return Promise.resolve(o);
        });
        return new PromiseList(promises);
    },
});
Object.defineProperty(Array.prototype, "remove", {
    value: function(o: any) {
        while (this.contains(o)) {
            const indexOf = this.indexOf(o);
            this.splice(indexOf, 1);
        }
        return this;
    },
});
Object.defineProperty(Array.prototype, "amount", {
    value: function(value: any) {
        return this.filter((o: any) => o == value).length;
    },
});
Object.defineProperty(Array.prototype, "getRandomIndexOf", {
    value: function(value: any) {
        const indexes: number[] = [];
        for (let i = 0; i < this.length; i++) {
            if (this[i] === value) {
                indexes.push(i);
            }
        }
        return indexes.getRandomValue();
    },
});
Object.defineProperty(Array.prototype, "getRandomValue", {
    value: function(defaultValue: any) {
        if (this.length == 0) {
            if (defaultValue) {
                return defaultValue;
            }
            throw new Error("Can't get random value from empty list");
        }
        const index = Math.floor(Math.random() * Math.floor(this.length));
        return this[index];
    },
});
Object.defineProperty(Array.prototype, "isLastElement", {
    value: function(o: any) {
        return this.indexOf(o) == this.length - 1;
    },
});
Object.defineProperty(Array.prototype, "contains", {
    value: function(o: any) {
        return this.indexOf(o) >= 0;
    },
});

export function initTypes() {
    console.info("types initialized");
}

export {};

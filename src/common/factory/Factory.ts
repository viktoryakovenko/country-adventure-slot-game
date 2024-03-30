import {Builder} from "app/common/builder/Builder";

export class Factory<T, R> implements Builder<T, R> {
    protected builders: Map<T, Builder<void, R>> = new Map();

    build(payload: T): R {
        const builder = this.builders.get(payload);
        if (!builder) {
            throw new Error(`Not builders for: ${payload}`);
        }
        return builder.build();
    }

    add(type: T, builder: Builder<void, R>): this {
        this.builders.set(type, builder);
        return this;
    }
}

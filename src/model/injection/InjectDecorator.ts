/* eslint-disable */
// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import constructor from "app/model/ContructortTypes";
import {Composer, Disposer} from "app/scenes/model/Scene";
export function $<T>(instanceToken: constructor<T>) {
    return dependencyManager.resolve(instanceToken);
}
export function inject<T>(instanceToken: constructor<T>, init?: () => T, ctx?: any): any {
    const log = false;
    log && console.log("inject init to: ", instanceToken);
    return function(
        target: Composer & Disposer & {[key: string]: any},
        propertyKey: string,
        descriptor: PropertyDescriptor
    ): any {
        log && console.log("inject called for ");
        log && console.log(" * target", target);
        log && console.log(" * propertyKey", propertyKey);
        log && console.log(" * descriptor", descriptor);
        const compose = target.compose;
        const initF = target.init;
        target.compose = async function() {
            this[propertyKey] = dependencyManager.resolve(instanceToken, init);
            await compose.apply(this);
        };
        target.init = async function(...args:never) {
            this[propertyKey] = dependencyManager.resolve(instanceToken, init);
            await initF.apply(this, args);
        };
        const dispose = target.dispose;
        target.dispose = async function() {
            await dispose.apply(this);
            delete this[propertyKey];
        };
    };
}

export class DependencyManager {
    // todo: should be not a map - instance;
    public readonly controls: Map<constructor<any>, any> = new Map();

    unload(): this {
        this.controls.clear();
        return this;
    }

    registerMe<K>(key: constructor<K>, instance: K): K {
        this.register(key, instance);
        return this.resolve(key);
    }

    register<K>(key: constructor<K>, instance: K): this {
        this.controls.set(key, instance);
        return this;
    }

    has<T>(key: constructor<T>): boolean {
        return this.controls.has(<any>key);
    }

    resolve<T>(key: constructor<T>, init?: () => T, ctx?: any): T {
        let instance = this.controls.get(<any>key);
        if (!instance) {
            if (init) {
                instance = ctx ? init.apply(ctx) : init();
                this.register(key, instance);
            } else {
                throw new Error(`key: ${key} is not defined.`);
            }
        }
        return <T>instance;
    }
}

const dependencyManager = new DependencyManager();
export default dependencyManager;

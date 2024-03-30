import {Application} from "pixi.js";

export function devPixiInit(app: Application) {
    if (__DEV__) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (<any>globalThis).__PIXI_APP__ = app;
    }
    return app;
}

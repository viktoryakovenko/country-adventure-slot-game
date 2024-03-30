import {ControlExtension} from "app/controls/MainControl";
import Signal from "app/helpers/signals/signal/Signal";
import {Container} from "@pixi/display";
import pgsap from "app/helpers/promise/gsap/PromisableGsap";
import SpineControl from "app/controls/SpineControl";

export interface VisibilityControl {
    onHide: Signal<void>;
    onShow: Signal<void>;

    show(): Promise<this>;

    hide(): Promise<this>;
}

export default class VisibilityExtension implements ControlExtension<VisibilityControl & {container: Container}> {
    init(instance: VisibilityControl & {container: Container}): void {
        instance.onHide.add((value, resolve) => {
            instance.container.visible = false;
            resolve?.();
        }, this);
        instance.onShow.add((value, resolve) => {
            instance.container.visible = true;
            resolve?.();
        }, this);
    }

    dispose(instance: VisibilityControl): void {
        instance.onHide.unload(this);
        instance.onShow.unload(this);
    }
}

export class SpineVisibilityExtension implements ControlExtension<SpineControl> {
    constructor(private readonly data: {show: string, hide: string, timeScale?: number}) {
    }

    init(instance: SpineControl): void {
        const data = {timeScale: this.data.timeScale ?? 1};
        instance.onHide.add(async (value, resolve) => {
            await instance.play(this.data.hide, data);
            instance.container.visible = false;
            resolve?.();
        }, this);
        instance.onShow.add(async (value, resolve) => {
            instance.container.visible = true;
            await instance.play(this.data.show, data);
            resolve?.();
        }, this);
    }

    dispose(instance: VisibilityControl): void {
        instance.onHide.unload(this);
        instance.onShow.unload(this);
    }
}

export class FadeInOutVisibilityExtension implements ControlExtension<VisibilityControl & {container: Container}> {
    constructor(private readonly duration: number, private readonly visibleAlpha: number = 1) {
    }

    init(instance: VisibilityControl & {container: Container}): void {
        let isInHide = false;
        instance.onHide.add(async (value, resolve) => {
            if (!isInHide) {
                isInHide = true;
                await pgsap.to(instance.container, {
                    duration: this.duration,
                    alpha: 0,
                });
                instance.container.visible = false;
            }
            resolve?.();
        }, this);
        instance.onShow.add(async (value, resolve) => {
            if (isInHide) {
                isInHide = false;
                instance.container.visible = true;
                await pgsap.to(instance.container, {
                    duration: this.duration,
                    alpha: this.visibleAlpha,
                });
            }
            resolve?.();
        }, this);
    }

    dispose(instance: VisibilityControl): void {
        instance.onHide.unload(this);
        instance.onShow.unload(this);
    }
}

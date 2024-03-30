import promiseHelper, {ResolvablePromise} from "app/helpers/promise/ResolvablePromise";
import pgsap from "app/helpers/promise/gsap/PromisableGsap";
import {Color} from "pixi.js";

/*
    This control is used for smoothly changing of tint for sprites and as example symbols dimming;
    For dimming just use one of grey tinting; Like 0x00000-0xffffff with the same RGB values:
    * 0x111111,
    * 0xcecece,
    * 0x030303
 */
export type TintableContainer = {
    tint: number;
};
// todo: rename on TintControl;
export default class TintableControl {
    protected tint = 0xcecece;
    protected duration = 1;
    private breakPromise: ResolvablePromise<void> | undefined;

    constructor(protected tintableContainer: TintableContainer) {
    }

    useTint(tint: number): this {
        this.tint = tint;
        return this;
    }

    useDuration(duration: number): this {
        this.duration = duration;
        return this;
    }

    tintIn(value: number = this.tint, duration: number = this.duration) {
        return this.tintTo(value, duration);
    }

    tintOut(duration = 0.3): Promise<this> {
        return this.tintTo(0xffffff, duration);
    }

    updateTarget(tintableContainer: TintableContainer) {
        tintableContainer.tint = this.tintableContainer.tint;
        this.tintableContainer = tintableContainer;
    }

    async tintTo(tint: number, duration: number = this.duration): Promise<this> {
        const rgbToArr = new Color(tint).toRgbArray();
        const rgbTo = {
            r: rgbToArr[0],
            g: rgbToArr[1],
            b: rgbToArr[2],
        };
        const rgbFromArr = new Color(this.tintableContainer.tint).toRgbArray();
        const rgbFrom = {
            r: rgbFromArr[0],
            g: rgbFromArr[1],
            b: rgbFromArr[2],
        };
        if (this.breakPromise) {
            this.breakPromise.resolve();
        }
        this.breakPromise = promiseHelper.getResolvablePromise();
        await pgsap.to(rgbFrom, {
            r: rgbTo.r,
            g: rgbTo.g,
            b: rgbTo.b,
            duration,
            breakPromise: this.breakPromise,
            onUpdate: () => {
                this.tintableContainer.tint = new Color([rgbFrom.r, rgbFrom.g, rgbFrom.b]).toNumber();
            },
        });
        return this;
    }

    setTint(tint: number, strength: number) {
        if (this.breakPromise) {
            this.breakPromise.resolve();
        }
        strength = 1 - strength;
        const rgbToArr = new Color(tint).toRgbArray();

        const rgbTo = {
            r: rgbToArr[0] + (1 - rgbToArr[0]) * strength,
            g: rgbToArr[1] + (1 - rgbToArr[1]) * strength,
            b: rgbToArr[2] + (1 - rgbToArr[2]) * strength,
        };
        this.tintableContainer.tint = new Color([rgbTo.r, rgbTo.g, rgbTo.b]).toNumber();
    }
}

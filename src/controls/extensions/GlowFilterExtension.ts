import MainControl, {ControlExtension} from "app/controls/MainControl";
import {GlowFilter, GlowFilterOptions} from "@pixi/filter-glow";

export default class GlowFilterExtension implements ControlExtension<MainControl> {
    constructor(protected options?:Partial<GlowFilterOptions>) {
        this.options = {color: 0x5f3422, outerStrength: 5, distance: 5, quality: 0.5, ...this.options};
    }
    init(instance: MainControl): void {
        instance.container.filters = [new GlowFilter(this.options)];
    }

    dispose(instance: MainControl): void {
        instance.container.filters = [];
    }
}

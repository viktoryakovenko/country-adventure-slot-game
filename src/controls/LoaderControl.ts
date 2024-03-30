import MainControl, {PivotType} from "./MainControl";
import {getRect, RoundRect} from "../helpers/GuiPrimitive";
import pgsap from "app/helpers/promise/gsap/PromisableGsap";
import gsap from "gsap";

export default class LoaderControl extends MainControl {
    private readonly fill: RoundRect;
    private readonly layers: RoundRect[] = [];
    private readonly colors = {
        yellow: 0xffc600,
        black: 0x000000,
        white: 0xffffff,
    };
    private loaderWidth = 1000;
    private loaderHeight = 40;
    private loaderRadius = 50;
    private loaderWidthPadding = 5;
    private progress = 0;

    constructor() {
        super();
        const firstLayer: RoundRect = getRect(this.loaderWidth, this.loaderHeight, this.colors.white);
        const secondLayer: RoundRect = getRect(this.loaderWidth - 8, this.loaderHeight - 8, this.colors.black);
        const thirdLayer: RoundRect = getRect(this.loaderWidth - 15, this.loaderHeight - 15, this.colors.yellow);
        const forthLayer: RoundRect = getRect(this.loaderWidth - 22, this.loaderHeight - 22, this.colors.black);

        this.fill = getRect(this.loaderWidth, this.loaderHeight, this.colors.yellow);
        this.fill.updateWidth(this.loaderWidth - 15).update();
        this.fill.updateHeight(this.loaderHeight - 22).update();

        this.layers.push(firstLayer, secondLayer, thirdLayer, forthLayer, this.fill);
        this.layers.forEach((layer: RoundRect) => {
            layer.updateRadius(this.loaderRadius).update();
            this.setPivotTo(layer, PivotType.C);
            this.container.addChild(layer);
        });
    }

    update(progress: number) {
        if (progress < this.progress) {
            return;
        }
        this.updateView(Math.min(1, this.progress));
        this.animateFakeLoad(progress);
    }

    private animateFakeLoad(progress: number) {
        gsap.killTweensOf(this);
        this.progress = progress;
        pgsap.to(this, {
            duration: 10,
            progress: progress + (1 - progress) * 0.05,
            onUpdate: () => {
                this.updateView(Math.min(1, this.progress));
            },
        }).then();
    }

    private updateView(progress: number) {
        const width = (this.loaderWidth - 10 - this.loaderWidthPadding) * progress;
        this.fill.updateWidth(width).update();
    }
}

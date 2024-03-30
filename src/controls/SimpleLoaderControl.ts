import MainControl, {PivotType} from "./MainControl";
import {getRect, RoundRect} from "../helpers/GuiPrimitive";

export default class SimpleLoaderControl extends MainControl {
    private readonly fill: RoundRect;

    private loaderWidth = 800;
    private loaderHeight = 40;
    private loaderWidthPadding = 5;
    private loaderHeightPadding = 5;

    private fillColor = 0x00ff00;

    constructor() {
        super();
        const bg = getRect(this.loaderWidth, this.loaderHeight);
        this.fill = getRect(
            this.loaderWidth - this.loaderWidthPadding,
            this.loaderHeight - this.loaderHeightPadding,
            this.fillColor);
        this.container.addChild(bg);
        this.container.addChild(this.fill);
        this.setPivotTo(bg, PivotType.C);
        this.setPivotTo(this.fill, PivotType.C);
    }

    update(progress:number) {
        const width = (this.loaderWidth - this.loaderWidthPadding) * progress;
        this.fill.updateWidth(width).update();
    }
}

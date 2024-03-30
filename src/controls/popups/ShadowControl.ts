import MainControl from "app/controls/MainControl";
import {Graphics} from "@pixi/graphics";
import {PartialLayout} from "app/layoutManager/LayoutManager";

export const shadowLayout: PartialLayout = {
    name: "shadow",
    height: "100%",
    width: "100%",
};

export default class ShadowControl extends MainControl {
    constructor() {
        super();
        const shadow: Graphics = new Graphics();
        shadow.beginFill(0x000000, 0.5);
        shadow.beginFill(0x000000, 0.75);
        shadow.drawRect(0, 0, 100, 100);
        shadow.endFill();
        this.container.addChild(shadow);
        this.container.name = "shadow";
    }

    init() {
        super.init();
        this.hide();
    }
}


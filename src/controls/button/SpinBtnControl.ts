import {Text} from "@pixi/text";
import SpriteSheetButtonControl from "app/controls/button/SpriteSheetButtonControl";
import TextStyles from "app/model/TextStyles";

export default class SpinBtnControl extends SpriteSheetButtonControl {
    private readonly spinsNumber: Text = new Text("", TextStyles.SPIN_BTN_TEXT_STYLE);

    constructor() {
        super("spin_btn.png");
        this.spinsNumber.anchor.set(0.5, 0.5);
    }

    init() {
        super.init();
        this.container.addChild(this.spinsNumber);
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }

    setSpinsNumber(value: number): void {
        value = Math.max(0, value);
        this.spinsNumber.text = value === 0 ? "" : `${value}`;
    }
}

import {Container} from "@pixi/display";
import {Text} from "@pixi/text";
import ButtonControl from "app/controls/button/ButtonControl";
import TextStyles from "app/model/TextStyles";
import SpriteSheetButtonControl from "app/controls/button/SpriteSheetButtonControl";

export default class AutoplayBtnControl extends ButtonControl {
    private readonly labelValue: Text;
    private autoplayButton: SpriteSheetButtonControl = new SpriteSheetButtonControl("auto_spin_nm_bg.png");

    constructor(value: number) {
        super(new Container());
        this.labelValue = new Text(`${value}`, TextStyles.AUTOPLAY_BUTTON);
        this.labelValue.anchor.set(0.5, 0.5);
        this.labelValue.eventMode = "passive";
    }

    init(): void {
        super.init();
        this.add(this.autoplayButton);
        this.container.addChild(this.labelValue);
        this.container.filters = [];
    }

    dispose(): void {
        this.container.removeChildren();
        super.dispose();
    }
}

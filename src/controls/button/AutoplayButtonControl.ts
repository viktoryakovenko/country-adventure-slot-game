import SpriteSheetButtonControl from "app/controls/button/SpriteSheetButtonControl";
import {Text} from "@pixi/text";
import TextStyles from "app/model/TextStyles";
import MainControl from "app/controls/MainControl";
import {Container} from "@pixi/display";

export class AutoplayButtonControl extends MainControl {
    readonly start = new SpriteSheetButtonControl("autoplay_btn.png");
    readonly stop = new SpriteSheetButtonControl("autoplay_btn_numbers.png");
    private readonly spinsNumber: Text = new Text("", TextStyles.AUTOPLAY_BUTTON_CONTROL);

    constructor() {
        super(new Container());
        this.spinsNumber.anchor.set(0.4, 0.5);
    }

    init() {
        super.init();
        this.add(this.stop);
        this.add(this.start);
        this.stop.container.visible = false;
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

    async showPlay() {
        await [this.stop.hide(), this.start.show()].promise().all();
    }

    async showStop() {
        await [this.stop.show(), this.start.hide()].promise().all();
    }

    disable() {
        this.start.disable();
        this.stop.disable();
    }

    enable() {
        this.start.enable();
        this.stop.enable();
    }
}

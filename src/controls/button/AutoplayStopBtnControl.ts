import {Container} from "@pixi/display";
import {SpriteControl} from "app/controls/SpriteControl";
import MainControl from "app/controls/MainControl";

export default class AutoplayStopBtnControl extends MainControl {
    constructor() {
        super(new Container());
    }

    init() {
        super.init();
        this.hide();
        this.add(new SpriteControl("spin_button_stop.png", {x: 0.5, y: 0.5}));
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }
}

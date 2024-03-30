import SpriteSheetButtonControl from "app/controls/button/SpriteSheetButtonControl";
import ButtonControl from "app/controls/button/ButtonControl";
import {Container} from "@pixi/display";

export class ForceBtnControl extends ButtonControl {
    private readonly forceOn: SpriteSheetButtonControl = new SpriteSheetButtonControl("force_btn.png");
    private readonly forceOff: SpriteSheetButtonControl = new SpriteSheetButtonControl("force_btn_off.png");

    constructor(private isForce: boolean) {
        super(new Container());
        this.container.filters = [];
    }

    init() {
        super.init();
        this.add(this.forceOn);
        this.add(this.forceOff);
        if (this.isForce) {
            this.forceOn.moveTop();
        }
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }

    switchToggleState() {
        const forceBtn = this.isForce ? this.forceOff : this.forceOn;
        forceBtn.moveTop();
        this.isForce = !this.isForce;
    }
}

import SpriteSheetButtonControl from "app/controls/button/SpriteSheetButtonControl";

export default class OptionsBtnControl extends SpriteSheetButtonControl {
    constructor() {
        super("info.png");
    }

    init(): void {
        super.init();
    }

    dispose(): void {
        this.container.removeChildren();
        super.dispose();
    }
}

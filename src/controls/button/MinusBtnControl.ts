import SpriteSheetButtonControl from "app/controls/button/SpriteSheetButtonControl";

export default class MinusBtnControl extends SpriteSheetButtonControl {
    constructor() {
        super("minus.png");
    }

    init() {
        super.init();
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }
}

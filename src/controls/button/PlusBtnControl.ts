import SpriteSheetButtonControl from "app/controls/button/SpriteSheetButtonControl";

export default class PlusBtnControl extends SpriteSheetButtonControl {
    constructor() {
        super("plus.png");
    }

    init() {
        super.init();
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }
}

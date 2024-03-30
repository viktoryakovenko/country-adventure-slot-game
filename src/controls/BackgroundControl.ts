import MainControl from "./MainControl";
import {GameSize} from "../model/GameModel";
import IntroShadow from "app/view/IntroShadow";
import {ResizableControl} from "app/controls/extensions/OnResizeExtension";
import SpineControl from "app/controls/SpineControl";

type TBgType = "main" | "freespin";

export default class BackgroundControl extends SpineControl {
    constructor() {
        super("background");
        this.setBounds(1922, 1080);
    }

    init() {
        super.init();
        this.setSkin("main");
        this.play("idle", {loop: true});
    }

    dispose() {
        super.dispose();
    }

    async setBackground(type: TBgType) {
        this.setSkin(type);
    }
}

export class BackgroundShadowControl extends MainControl implements ResizableControl {
    private shadow: IntroShadow = new IntroShadow();

    constructor() {
        super();
    }

    init() {
        super.init();
        this.container.addChild(this.shadow);
    }

    resize(gameSize: GameSize) {
        this.shadow.resize(gameSize);
    }
}

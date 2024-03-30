import MainControl from "./MainControl";
import {SpriteControl} from "app/controls/SpriteControl";
import gameModel from "app/model/GameModel";
import SpriteSheetButtonControl from "app/controls/button/SpriteSheetButtonControl";
import SoundBtnControl from "app/controls/button/SoundBtnControl";
import pgsap from "app/helpers/promise/gsap/PromisableGsap";
import FullScreenBtnControl from "app/controls/button/FullScreenBtnControl";
import {ForceBtnControl} from "app/controls/button/ForceBtnControl";

export default class OptionsControl extends MainControl {
    private readonly box: SpriteControl = new SpriteControl("info_options.png");
    private readonly info: SpriteSheetButtonControl = new SpriteSheetButtonControl("options_info.png");
    private readonly fullScreenBtn: FullScreenBtnControl = new FullScreenBtnControl();
    readonly sound: SoundBtnControl = new SoundBtnControl(gameModel.isSoundMuted);
    readonly force: ForceBtnControl = new ForceBtnControl(gameModel.isForce);

    constructor() {
        super();
        this.info.setPosition({
            x: this.box.container.width / 2,
            y: this.box.container.height - 175,
        });
        this.sound.setPosition({
            x: this.box.container.width / 2,
            y: this.box.container.height - 425,
        });
        this.fullScreenBtn.setPosition({
            x: this.box.container.width / 2,
            y: this.box.container.height - 675,
        });
        this.force.setPosition({
            x: this.box.container.width / 2,
            y: this.box.container.height - 925,
        });
    }

    init() {
        super.init();
        this.info.onClick.add(() => {
            gameModel.game.signals.ui.options.info.show.emit();
            this.container.alpha = 0.9;
            this.hide();
        });
        this.add(this.box);
        this.add(this.sound);
        this.add(this.info);
        this.add(this.fullScreenBtn);
        this.add(this.force);
        this.container.visible = false;
        this.container.alpha = 0;
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }

    enable() {
        this.info.enable();
    }

    disable() {
        this.info.disable();
    }

    async show(): Promise<this> {
        if (!this.container.visible) {
            await super.show();
            await pgsap.to(this.container, {alpha: 1, duration: 0.25});
        }
        return this;
    }

    async hide(): Promise<this> {
        await pgsap.to(this.container, {alpha: 0, duration: 0.25});
        await super.hide();
        return this;
    }
}


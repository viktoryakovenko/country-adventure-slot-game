import SpriteSheetButtonControl from "app/controls/button/SpriteSheetButtonControl";
import {Container} from "@pixi/display";
import ButtonControl from "app/controls/button/ButtonControl";

export default class SoundBtnControl extends ButtonControl {
    public readonly soundOn: SpriteSheetButtonControl = new SpriteSheetButtonControl("options_sound_on.png");
    public readonly soundOff: SpriteSheetButtonControl = new SpriteSheetButtonControl("options_sound_off.png");

    constructor(private isSoundMuted: boolean) {
        super(new Container());
        this.container.filters = [];
    }

    init(): void {
        super.init();
        this.add(this.soundOff);
        this.add(this.soundOn);
        if (this.isSoundMuted) {
            this.soundOff.moveTop();
        }
        this.onClick.add(this.switchSoundState, this);
    }

    dispose(): void {
        this.onClick.unload(this);
        this.container.removeChildren();
        super.dispose();
    }

    private switchSoundState() {
        const soundBtn = this.isSoundMuted ? this.soundOn : this.soundOff;
        soundBtn.moveTop();
        this.isSoundMuted = !this.isSoundMuted;
    }
}

import MainControl from "./MainControl";
import {SpriteControl} from "app/controls/SpriteControl";
import AutoplayBtnControl from "app/controls/button/AutoplayBtnControl";
import Signal from "app/helpers/signals/signal/Signal";
import {FadeInOutVisibilityExtension} from "app/controls/extensions/VisibilityExtension";
import TextStyles from "app/model/TextStyles";
import {Text} from "@pixi/text";
import {inject} from "app/model/injection/InjectDecorator";
import Localization from "app/localization/Localization";

export default class AutoplayControl extends MainControl {
    @inject(Localization)
    private readonly localization!: Localization;
    private readonly label: Text = new Text("", TextStyles.POPUP_LABEL_STYLE);
    private readonly sprite: SpriteControl = new SpriteControl("auto_spin_bg.png", {x: 0.5, y: 0.6});
    public readonly changeAutoplay: Signal<number> = new Signal();
    private readonly buttons: AutoplayBtnControl[] = [];
    private readonly autoPlays: number[];

    constructor(autoPlays: number[]) {
        super();
        this.autoPlays = autoPlays;
    }

    init() {
        super.init();
        this.add(this.sprite);
        this.label.text = this.localization.text("autoplay_ctrl_title");
        this.label.anchor.set(0.5, 2.3);
        this.container.addChild(this.label);
        this.createButtons();
        this.addExtension(new FadeInOutVisibilityExtension(0.25, 1));
        super.hide();
        this.container.alpha = 0;
    }

    dispose() {
        this.buttons.forEach(value => value.onClick.unload(this));
        this.container.removeChildren();
        super.dispose();
    }

    createButtons(): void {
        this.autoPlays.forEach((item: number, index: number) => {
            const button: AutoplayBtnControl = new AutoplayBtnControl(item);
            const offset = 370;
            button.container.position.x = ((this.autoPlays.length - 1) * offset) / 2 - index * offset;
            button.onClick.add(() => {
                this.changeAutoplay.emit(index);
            }, this);
            this.add(button);
            this.buttons.push(button);
        });
    }
}


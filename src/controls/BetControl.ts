import MainControl from "./MainControl";
import {SpriteControl} from "app/controls/SpriteControl";
import Signal from "app/helpers/signals/signal/Signal";
import {FadeInOutVisibilityExtension} from "app/controls/extensions/VisibilityExtension";
import {TBet} from "app/server/service/typing";
import {BetBtnControl} from "app/controls/button/BetBtnControl";
import gameModel from "app/model/GameModel";
import {Text} from "@pixi/text";
import TextStyles from "app/model/TextStyles";
import Localization from "app/localization/Localization";
import {inject} from "app/model/injection/InjectDecorator";

export default class BetControl extends MainControl {
    @inject(Localization)
    private readonly localization!: Localization;
    private readonly label: Text = new Text("", TextStyles.POPUP_LABEL_STYLE);
    public readonly betChanged: Signal<number> = new Signal();
    private readonly sprite: SpriteControl = new SpriteControl("bet_bg.png", {x: 0.5, y: 0.55});
    private readonly buttons: BetBtnControl[] = [];
    private readonly bets: TBet[];

    constructor(bets: TBet[]) {
        super();
        this.bets = bets;
    }

    init() {
        super.init();
        this.add(this.sprite);
        this.label.text = this.localization.text("bet_ctrl_title");
        this.label.anchor.set(0.5, 4);
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

    private createButtons(): void {
        this.bets.forEach((item: TBet, index: number) => {
            const button: BetBtnControl = new BetBtnControl(item.value);
            button.container.position.set((((index) % 5 - 2) * 350), ((Math.floor(index / 5) - 0.5) * 350));
            button.onClick.add(() => {
                this.betChanged.emit(item.id);
                gameModel.getHowler().play("custom-button");
            }, this);
            this.add(button);
            this.buttons.push(button);
        });
    }

    enable() {
        this.buttons.forEach(btn => btn.enable());
    }

    disable() {
        this.buttons.forEach(btn => btn.disable());
    }
}


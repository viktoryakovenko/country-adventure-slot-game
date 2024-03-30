import MainControl from "app/controls/MainControl";
import {SpriteControl} from "app/controls/SpriteControl";
import BetSelectorBtnsControl from "app/controls/button/BetSelectorBtnsControl";
import pgsap from "app/helpers/promise/gsap/PromisableGsap";
import {TBet} from "app/server/service/typing";

export class BetOptionsControl extends MainControl {
    private readonly box: SpriteControl = new SpriteControl("bet_options_bg.png");
    public betSelector: BetSelectorBtnsControl;

    constructor(bets: TBet[]) {
        super();
        this.betSelector = new BetSelectorBtnsControl(bets);
    }

    init() {
        super.init();
        this.add(this.box);
        this.add(this.betSelector);
        this.box.container.height = this.box.container.height / 2;
        this.betSelector.setPosition({
            x: this.box.container.width / 2,
            y: this.box.container.height / 2,
        });
        this.container.visible = false;
        this.container.alpha = 0;
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }

    enable() {
        this.betSelector.enable();
    }

    disable() {
        this.betSelector.disable();
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

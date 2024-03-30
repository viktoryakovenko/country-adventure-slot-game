import {Text} from "@pixi/text";
import {TBet} from "app/server/service/typing";
import Signal from "app/helpers/signals/signal/Signal";
import TextStyles from "app/model/TextStyles";
import SpriteSheetButtonControl from "./button/SpriteSheetButtonControl";

export default class BetSelectorControl extends SpriteSheetButtonControl {
    public readonly betChanged = new Signal<number>();
    public readonly currentBetLabel: Text;
    private index = 0;

    constructor(protected bets: TBet[]) {
        super("bet_chooser.png");
        this.currentBetLabel = new Text(`${bets[this.index].value}`, TextStyles.BET_SELECTOR_BUTTON_CONTROL);
    }

    init() {
        super.init();
        this.currentBetLabel.anchor.set(0.5, 0.3);
        this.container.addChild(this.currentBetLabel);
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }

    increment() {
        if (this.index != this.bets.length - 1) {
            this.index += 1;
        } else {
            this.index = 0;
        }
        const betId = this.bets[this.index].id;
        this.betChanged.emit(betId);
        this.updateText();
    }

    decrement() {
        if (this.index != 0) {
            this.index -= 1;
        } else {
            this.index = this.bets.length - 1;
        }
        const betId = this.bets[this.index].id;
        this.betChanged.emit(betId);
        this.updateText();
    }

    updateText() {
        const bet = this.bets[this.index];
        this.currentBetLabel.text = `${bet.value}`;
    }

    updateBetIndex(betId: number) {
        this.index = this.bets.findIndex(value => value.id == betId);
        this.updateText();
    }
}

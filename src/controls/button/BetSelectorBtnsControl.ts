import {Container} from "@pixi/display";
import PlusBtnControl from "app/controls/button/PlusBtnControl";
import BetSelectorControl from "app/controls/BetSelectorControl";
import MinusBtnControl from "app/controls/button/MinusBtnControl";
import MainControl from "app/controls/MainControl";
import gameModel from "app/model/GameModel";
import Signal from "app/helpers/signals/signal/Signal";
import {TBet} from "app/server/service/typing";
import ControlShowerExtension from "../extensions/ControlShowerExtension";
import BetControl from "../BetControl";

export default class BetSelectorBtnsControl extends MainControl {
    readonly betChanged = new Signal<number>();
    private readonly betSelectorControl: BetSelectorControl;
    private readonly plusBtnControl: PlusBtnControl = new PlusBtnControl();
    private readonly minusBtnControl: MinusBtnControl = new MinusBtnControl();
    private isEnable = true;

    constructor(bets:TBet[], betControl?: BetControl) {
        super(new Container());
        this.betSelectorControl = new BetSelectorControl(bets);
        if (betControl) {
            this.betSelectorControl.addExtension(new ControlShowerExtension(betControl));
        }
    }

    init() {
        super.init();
        const plusBtnControl = this.plusBtnControl;
        const minusBtnControl = this.minusBtnControl;
        const betSelectorControl = this.betSelectorControl;
        this.add(betSelectorControl);
        this.add(plusBtnControl);
        this.add(minusBtnControl);
        minusBtnControl.container.position.x = -betSelectorControl.container.width;
        plusBtnControl.container.position.x = betSelectorControl.container.width;
        betSelectorControl.betChanged.add(betId => this.betChanged.emit(betId), this);
        plusBtnControl.onClick.add(() => {
            gameModel.getHowler().play("custom-button");
            betSelectorControl.increment();
        }, this);
        minusBtnControl.onClick.add(() => {
            gameModel.getHowler().play("custom-button");
            betSelectorControl.decrement();
        }, this);
        document.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    disable() {
        this.isEnable = false;
        this.betSelectorControl.disable();
        this.plusBtnControl.disable();
        this.minusBtnControl.disable();
    }

    enable() {
        this.isEnable = true;
        this.betSelectorControl.enable();
        this.plusBtnControl.enable();
        this.minusBtnControl.enable();
    }

    updateBetIndex(betId: number) {
        this.betSelectorControl.updateBetIndex(betId);
    }

    dispose() {
        this.container.removeChildren();
        this.plusBtnControl.onClick.unload(this);
        this.minusBtnControl.onClick.unload(this);
        this.betChanged.unload(this);
        document.removeEventListener("keyup", this.onKeyUp);
        super.dispose();
    }

    private onKeyUp(e:KeyboardEvent):void { 
        if(this.isEnable){
            if(e.keyCode == 37){
                this.betSelectorControl.decrement();
            }
            else if(e.keyCode == 39){
                this.betSelectorControl.increment();
            }
        }
    }
}

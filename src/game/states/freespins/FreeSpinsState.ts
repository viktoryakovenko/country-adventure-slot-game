import {GameState} from "app/game/states/GameState";
import {inject} from "app/model/injection/InjectDecorator";
import FreeSpinModel from "app/model/FreeSpinModel";
import gameModel from "app/model/GameModel";
import BetModel from "app/model/BetModel";
import UserModel from "app/model/UserModel";

export default class FreeSpinsState extends GameState {
    @inject(FreeSpinModel)
    protected freeSpinModel!: FreeSpinModel;
    @inject(BetModel)
    readonly betModel!: BetModel;
    @inject(UserModel)
    private userModel!: UserModel;

    enable(): boolean {
        return super.enable() && this.freeSpinModel.hasNextSpin();
    }

    async run(): Promise<GameState> {
        const reelSignals = gameModel.game.signals.reels;
        this.gameSignals.ui.spinButton.disable.emit();
        this.spinResponse = this.freeSpinModel.nextSpin();
        __DEV__ && console.log("fs spin: ", this.spinResponse);
        this.gameSignals.ui.spinButton.updateCounter.emit(this.freeSpinModel.spinRemains);
        reelSignals.spin.emit();
        await this.goto("fsSpinStopState");
        await this.goto("fsWildBonus1State");
        await this.goto("fsWildBonus2State");
        await this.goto("fsLinesWinState");
        await this.goto("fsScatterWinState");
        await this.goto("reSpinsState");
        await this.goto("fsWinState");
        this.gameSignals.ui.showWin.emit({win: this.freeSpinModel.totalWin, isTotalWin: true});
        await this.goto("freeSpinsState");
        return this;
    }
}

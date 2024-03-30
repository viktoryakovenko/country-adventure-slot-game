import {GameState} from "app/game/states/GameState";
import usablePromises from "app/helpers/promise/UsablePromises";
import {promiseDelay} from "app/helpers/TimeHelper";
import {inject} from "app/model/injection/InjectDecorator";
import BetModel from "app/model/BetModel";
import UserModel from "app/model/UserModel";
import gameModel from "app/model/GameModel";

export default class WinState extends GameState {
    @inject(BetModel)
    protected betModel!: BetModel;
    @inject(UserModel)
    protected userModel!: UserModel;

    constructor(protected isNeedToShowBigWin: boolean = true) {
        super();
    }

    async compose(): Promise<void> {
        return super.compose();
    }

    enable(): boolean {
        const hasWins = this.spinResponse.totalWin > 0;
        return super.enable() && hasWins;
    }

    async run(): Promise<GameState> {
        const reel = this.gameSignals.reels;
        const winCounterSignals = this.gameSignals.popup.winCounter;
        const totalWin = this.spinResponse.totalWin;
        reel.dimAllSymbols.emit({dim: false});
        await winCounterSignals.show.emit(totalWin).all();
        this.gameSignals.ui.showWin.emit({win: totalWin, isTotalWin: true});
        const isBigWin = this.betModel.bigWinCalculator.isBigWin(totalWin);
        const isNeedToShowBigWin = this.isNeedToShowBigWin && !gameModel.isForce;
        if (isNeedToShowBigWin && isBigWin) {
            await usablePromises.getClickOnStagePromise();
        } else if (isNeedToShowBigWin && !isBigWin) {
            await promiseDelay(0.5);
        } else {
            await promiseDelay(0.25);
        }
        await winCounterSignals.hide.emit().all();
        this.userModel.updateUserStats(this.spinResponse.userStats);
        return this;
    }
}

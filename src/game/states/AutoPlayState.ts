import {GameState} from "app/game/states/GameState";
import gameModel from "app/model/GameModel";
import BetModel from "app/model/BetModel";
import {inject} from "app/model/injection/InjectDecorator";
import UserModel from "app/model/UserModel";

export default class AutoPlayState extends GameState {
    @inject(UserModel)
    private userModel!: UserModel;
    @inject(BetModel)
    readonly betModel!: BetModel;

    async run(): Promise<GameState> {
        const mainGameInfo = gameModel.mainGameInfo;
        const serverCommunicator = gameModel.game.fruit.serverCommunicator;
        const reelSignals = gameModel.game.signals.reels;
        this.gameSignals.ui.showWin.emit({win: 0});
        reelSignals.spin.emit();
        gameModel.game.signals.ui.disableControls.emit();
        gameModel.game.signals.ui.autoplayButton.enable.emit();
        this.userModel.takeBet(this.betModel.getTotalBet());
        if (mainGameInfo.hook.length) {
            await serverCommunicator.forceReelStop(mainGameInfo.hook);
        }
        const betId = this.betModel.getChosenBet().id;
        const linesAmount = gameModel.game.linesId;
        this.spinResponse = await serverCommunicator.spin({
            bet_id: `${betId}`,
            lines_amount: `${linesAmount}`,
            gameKey: "internship",
        });
        gameModel.autoplay.spins -= 1;
        gameModel.game.signals.autoplay.decrease.emit();
        gameModel.game.signals.infobar.stop.emit();
        await this.goto("spinStopState");
        await this.goto("wildBonus1State");
        await this.goto("wildBonus2State");
        await this.goto("winLineState");
        await this.goto("scatterWinState");
        await this.goto("freeSpinsIntroState");
        await this.goto("freeSpinsState");
        await this.goto("freeSpinsOutroState");
        await this.goto("winPresentationState");
        const finalState = gameModel.autoplay.spins > 0 ? "autoPlayState" : "mainGameState";
        if (gameModel.autoplay.spins === 0) {
            gameModel.game.signals.ui.autoplayButton.enable.emit();
        }
        await this.goto(finalState);
        return this;
    }
}

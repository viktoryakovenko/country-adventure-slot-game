import {GameState} from "app/game/states/GameState";
import gameModel from "app/model/GameModel";
import BetModel from "app/model/BetModel";
import {inject} from "app/model/injection/InjectDecorator";
import UserModel from "app/model/UserModel";

export default class SpinState extends GameState {
    @inject(BetModel)
    readonly betModel!:BetModel;
    @inject(UserModel)
    private userModel!: UserModel;

    async run(): Promise<GameState> {
        const mainGameInfo = gameModel.mainGameInfo;
        const serverCommunicator = gameModel.game.fruit.serverCommunicator;
        const reelSignals = gameModel.game.signals.reels;
        this.gameSignals.ui.disableControls.emit();
        reelSignals.spin.emit();
        gameModel.game.signals.infobar.stop.emit();
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
        return this;
    }
}

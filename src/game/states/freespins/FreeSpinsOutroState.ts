import {GameState} from "app/game/states/GameState";
import usablePromises from "app/helpers/promise/UsablePromises";
import FreeSpinModel from "app/model/FreeSpinModel";
import {inject} from "app/model/injection/InjectDecorator";
import MainGameModel from "app/model/MainGameModel";
import gameModel from "app/model/GameModel";

export default class FreeSpinsOutroState extends GameState {
    @inject(FreeSpinModel)
    protected freeSpinModel!: FreeSpinModel;
    @inject(MainGameModel)
    protected mainGameModel!: MainGameModel;

    enable(): boolean {
        return super.enable() && this.freeSpinModel.hasSpin();
    }

    async run(): Promise<GameState> {
        await this.gameSignals.popup.fsOutro.show.emit(this.spinResponse.totalWin).all();
        await usablePromises.getClickOnStagePromise();
        const spinResponse = this.mainGameModel.spinResponse;
        this.gameSignals.reels.clearSymbols.emit();
        this.gameSignals.reels.forceMoveOn.emit(spinResponse.userStats.reelStops);
        await this.gameSignals.popup.fsOutro.hide.emit().all();
        this.gameSignals.background.show.emit("main");
        this.freeSpinModel.reset();
        gameModel.game.signals.infobar.show.emit();
        return this;
    }
}

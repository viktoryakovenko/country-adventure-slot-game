import {GameState} from "app/game/states/GameState";
import {inject} from "app/model/injection/InjectDecorator";
import FreeSpinModel from "app/model/FreeSpinModel";
import usablePromises from "app/helpers/promise/UsablePromises";
import gameModel from "app/model/GameModel";

export default class FreeSpinsIntroState extends GameState {
    @inject(FreeSpinModel)
    protected freeSpinModel!: FreeSpinModel;

    enable(): boolean {
        return super.enable() && this.spinResponse.freeSpins.spins.length > 0;
    }

    async run(): Promise<GameState> {
        this.gameSignals.autoplay.stop.emit();
        this.gameSignals.reels.dimAllSymbols.emit({dim: false});
        gameModel.game.signals.infobar.hide.emit();
        const firstWheelWin = this.mainGameModel.getInitialWinForFreeSpinsGame();
        this.gameSignals.background.show.emit("fs");
        await this.gameSignals.popup.fsIntro.show.emit(this.spinResponse.freeSpins.spins.length).all();
        if (this.freeSpinModel.spinRemains > 0) {
            this.freeSpinModel.addSpins(this.spinResponse, true);
        } else {
            this.freeSpinModel.setup(this.spinResponse.freeSpins.spins, firstWheelWin);
        }
        await usablePromises.getClickOnStagePromise();
        await this.gameSignals.popup.fsIntro.hide.emit().all();
        return this;
    }
}

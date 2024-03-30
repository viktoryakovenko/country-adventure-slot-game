import {GameState} from "app/game/states/GameState";
import {inject} from "app/model/injection/InjectDecorator";
import FreeSpinModel from "app/model/FreeSpinModel";
import {promiseDelay, TimeUnit} from "app/helpers/TimeHelper";
import usablePromises from "app/helpers/promise/UsablePromises";
import gameConfig from "res/configs/gameConfig.json";

export default class ReSpinsState extends GameState {
    @inject(FreeSpinModel)
    protected freeSpinModel!: FreeSpinModel;

    enable(): boolean {
        return super.enable() && this.freeSpinModel.getCurrentSpinResult().freeSpins.spins.length > 0;
    }

    async run(): Promise<GameState> {
        const currentSpinResult = this.freeSpinModel.getCurrentSpinResult();
        const reSpinsAmount = currentSpinResult.freeSpins.spins.length;
        const fsIntroSignals = this.gameSignals.popup.fsIntro;
        await fsIntroSignals.show.emit(reSpinsAmount).all();
        this.freeSpinModel.addReSpins();
        await Promise.race([
            promiseDelay(gameConfig.popup.generalTimeout, TimeUnit.sec),
            usablePromises.getClickOnStagePromise(),
        ]);
        await fsIntroSignals.hide.emit().all();
        this.gameSignals.ui.spinButton.updateCounter.emit(reSpinsAmount);
        return this;
    }
}

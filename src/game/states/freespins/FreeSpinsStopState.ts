import {inject} from "app/model/injection/InjectDecorator";
import FreeSpinModel from "app/model/FreeSpinModel";
import SpinStopState from "app/game/states/SpinStopState";

export default class FreeSpinsStopState extends SpinStopState {
    @inject(FreeSpinModel)
    protected freeSpinModel!: FreeSpinModel;

    async activate(): Promise<void> {
        await super.activate();
        this.spinResponse = this.freeSpinModel.getCurrentSpinResult();
    }
}

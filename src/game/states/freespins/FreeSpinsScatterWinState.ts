import {inject} from "app/model/injection/InjectDecorator";
import FreeSpinModel from "app/model/FreeSpinModel";
import ScatterWinState from "app/game/states/ScatterWinState";

export default class FreeSpinsScatterWinState extends ScatterWinState {
    @inject(FreeSpinModel)
    protected freeSpinModel!: FreeSpinModel;

    constructor() {
        super();
    }

    async activate(): Promise<void> {
        await super.activate();
        this.spinResponse = this.freeSpinModel.getCurrentSpinResult();
    }
}

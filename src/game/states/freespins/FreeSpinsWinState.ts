import WinState from "app/game/states/WinState";
import {inject} from "app/model/injection/InjectDecorator";
import FreeSpinModel from "app/model/FreeSpinModel";

export default class FreeSpinsWinState extends WinState {
    @inject(FreeSpinModel)
    protected freeSpinModel!: FreeSpinModel;

    constructor() {
        super(false);
    }

    async activate(): Promise<void> {
        await super.activate();
        this.spinResponse = this.freeSpinModel.getCurrentSpinResult();
    }
}

import {inject} from "app/model/injection/InjectDecorator";
import FreeSpinModel from "app/model/FreeSpinModel";
import WinLineState from "app/game/states/WinLineState";

export default class FreeSpinsLinesWinState extends WinLineState {
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

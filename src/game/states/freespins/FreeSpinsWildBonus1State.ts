import {inject} from "app/model/injection/InjectDecorator";
import FreeSpinModel from "app/model/FreeSpinModel";
import WildBonus1State from "app/game/states/WildBonus1State";

export default class FreeSpinsWildBonus1State extends WildBonus1State {
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

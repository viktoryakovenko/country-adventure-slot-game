import WildBonus2State from "app/game/states/WildBonus2State";
import FreeSpinModel from "app/model/FreeSpinModel";
import {inject} from "app/model/injection/InjectDecorator";

export default class FreeSpinsWildBonus2State extends WildBonus2State {
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

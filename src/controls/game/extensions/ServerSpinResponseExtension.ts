import MainControl, {ControlExtension} from "app/controls/MainControl";
import gameModel from "app/model/GameModel";
import {TSpinResponse} from "app/server/service/typing";

export interface SpinResponseControl {
    onSpinResponse(data: TSpinResponse): void;
}

export default class ServerSpinResponseExtension implements ControlExtension<MainControl & SpinResponseControl> {
    dispose(instance: MainControl & SpinResponseControl): void {
        gameModel.game.signals.data.spin.unload(instance);
    }

    init(instance: MainControl & SpinResponseControl): void {
        gameModel.game.signals.data.spin.add(instance.onSpinResponse, instance);
    }
}

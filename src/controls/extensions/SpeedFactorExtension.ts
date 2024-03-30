import {ControlExtension} from "app/controls/MainControl";
import gameModel from "app/model/GameModel";
import gameConfig from "res/configs/gameConfig.json";

export interface SpeedFactorControl {
    speedFactor: number;

    updateSpeedFactor(speedFactor: number): void;

}

export default class SpeedFactorExtension implements ControlExtension<SpeedFactorControl> {
    init(instance: SpeedFactorControl): void {
        const slot = (speedFactor: number) => {
            instance.speedFactor = speedFactor;
            instance.updateSpeedFactor(speedFactor);
        };
        slot(gameModel.isForce ? gameConfig.forceSpeedFactor : gameConfig.defaultSpeedFactor);
        gameModel.game.signals.speedFactorUpdate.add(slot, instance);
    }

    dispose(instance: SpeedFactorControl): void {
        gameModel.game.signals.speedFactorUpdate.unload(instance);
    }
}

import MainControl, {ControlExtension} from "app/controls/MainControl";
import gameModel from "app/model/GameModel";

export default class CentralizingExtension implements ControlExtension<MainControl> {
    init(instance: MainControl): void {
        instance.setPosition(gameModel.gameSize.centerPosition);
        gameModel.updateLayout.add(value => {
            instance.setPosition(value.centerPosition);
        }, instance);
    }

    dispose(instance: MainControl): void {
        gameModel.updateLayout.unload(instance);
    }
}

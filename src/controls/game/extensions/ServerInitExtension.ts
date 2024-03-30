import MainControl, {ControlExtension} from "app/controls/MainControl";
import gameModel from "app/model/GameModel";
import {TInitResponse} from "app/server/service/typing";

export interface InitResponseControl {
    onInitResponse(data: TInitResponse): void;
}

export default class ServerInitExtension implements ControlExtension<MainControl & InitResponseControl> {
    dispose(instance: MainControl & InitResponseControl): void {
        gameModel.game.signals.data.login.unload(instance);
    }

    init(instance: MainControl & InitResponseControl): void {
        if (gameModel.mainGameInfo) {
            instance.onInitResponse(gameModel.mainGameInfo);
        }
        gameModel.game.signals.data.login.add(instance.onInitResponse, instance);
    }
}

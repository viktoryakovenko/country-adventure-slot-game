import {ControlExtension} from "app/controls/MainControl";
import SpineControl from "app/controls/SpineControl";
import gameModel from "app/model/GameModel";

export default class SpineAspectExtension implements ControlExtension<SpineControl> {
    constructor(protected readonly aspect: {aspectTo: number, aspectAt: number}) {
    }

    init(instance: SpineControl): void {
        gameModel.updateLayout.add((gameSize, resolve) => {
            const aspect = gameSize.width / gameSize.height;
            const aspectTo = this.aspect.aspectTo;// 1920 / 1080;
            const aspectAt = this.aspect.aspectAt;// 1080 / 1920;
            const frameAt = (Math.max(Math.min(aspectTo, aspect), aspectAt) - aspectAt) / (aspectTo - aspectAt);
            instance.play("aspect", {frameAt: 1 - frameAt, trackIndex: 1});
            resolve?.();
        }, instance);
    }

    dispose(instance: SpineControl): void {
        gameModel.updateLayout.unload(instance);
    }
}

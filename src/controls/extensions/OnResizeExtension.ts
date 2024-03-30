import MainControl, {ControlExtension} from "app/controls/MainControl";
import gameModel, {GameSize} from "app/model/GameModel";

export interface ResizableControl {
    resize(data: GameSize): void;
}

export default class OnResizeExtension implements ControlExtension<MainControl & ResizableControl> {
    constructor(protected readonly hasPriority = false) {
    }

    dispose(instance: MainControl & ResizableControl): void {
        gameModel.updateLayout.unload(instance);
    }

    init(instance: MainControl & ResizableControl): void {
        instance.container.parent && instance.resize(gameModel.gameSize);
        gameModel.updateLayout.add(instance.resize, instance, this.hasPriority ? 1 : 0);
    }
}

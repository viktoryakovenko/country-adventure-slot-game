import {ControlExtension} from "app/controls/MainControl";
import gameModel from "app/model/GameModel";
import {TBackgroundType} from "app/model/GameSignals";
import GameControl from "app/controls/GameControl";

class ReelsBackgroundDirector {
    private readonly signals = gameModel.game.signals;

    constructor(private gameControl: GameControl) {
    }

    compose() {
        this.signals.background.show.add(this.onShow, this);
    }

    dispose() {
        this.signals.background.show.unload(this);
    }

    private onShow(type: TBackgroundType) {
        switch (type) {
            case "fs":
            case "main":
                this.gameControl.setSkin(type);
        }
    }
}

export class ReelsBackgroundExtension implements ControlExtension<GameControl> {
    private director!: ReelsBackgroundDirector;

    init(instance: GameControl): void {
        this.director = new ReelsBackgroundDirector(instance);
        this.director.compose();
    }

    dispose(): void {
        this.director.dispose();
    }
}

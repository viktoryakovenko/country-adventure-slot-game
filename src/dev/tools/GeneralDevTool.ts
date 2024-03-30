import {GUI} from "dat.gui";
import gameModel from "app/model/GameModel";

// noinspection JSUnusedGlobalSymbols
export class GeneralDevTool {
    constructor(gui: GUI) {
        const generalGui = gui.addFolder("general");
        generalGui.add({version: VERSION}, "version");
        generalGui.add({
            play: () => {
                gameModel.pauseGame.emit({pause: false});
            },
        }, "play");
        generalGui.add({
            pause: () => {
                gameModel.pauseGame.emit({pause: true});
            },
        }, "pause");
    }
}

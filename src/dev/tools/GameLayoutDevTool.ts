import gameModel from "app/model/GameModel";
import {GUI} from "dat.gui";

// noinspection JSUnusedGlobalSymbols
export default class GameLayoutDevTool {
    constructor(gui:GUI) {
        gui.add({
            gameLayoutUpdate: () => {
                window.dispatchEvent(new Event("resize"));
            },
            gameLayoutTest: () => {
                gameModel.updateLayout.emit({
                    height: 800,
                    width: 600,
                    scale: 2,
                    isPortrait: false,
                    centerPosition: {x: 400, y: 300},
                });
            },
        }, "gameLayoutUpdate");
    }
}

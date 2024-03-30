import {GUI} from "dat.gui";
import {Main} from "app/Main";
import Stats from "stats.js";
import {GeneralDevTool} from "app/dev/tools/GeneralDevTool";
import {SoundDevTool} from "app/dev/tools/SoundDevTool";
import GameLayoutDevTool from "app/dev/tools/GameLayoutDevTool";
import HotKeyDevTool from "app/dev/tools/HotKeyDevTool";
import {SceneDevTool} from "app/dev/tools/SceneDevTool";

export default class DevController {
    private stats: Stats = new Stats();

    constructor() {
        this.setupStats();
        const gui = new GUI();
        if (BUILD_TYPE !== "PROD") {
            new GeneralDevTool(gui);
            new SoundDevTool(gui);
            new GameLayoutDevTool(gui);
        }
        new SceneDevTool(gui);
        new HotKeyDevTool(this.stats);
    }

    private setupStats() {
        const stats = this.stats;
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom);
        Main.APP.ticker.add(() => {
            stats.update();
        });
    }
}

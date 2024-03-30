import HotKeyTool from "app/dev/HotKeyTool";
import DevPixiDrawLayoutPlugin from "app/layoutManager/DevPixiDrawLayoutPlugin";
import {Main} from "app/Main";
import dependencyManager from "app/model/injection/InjectDecorator";
import LayoutManager from "app/layoutManager/LayoutManager";

// noinspection JSUnusedGlobalSymbols
export default class HotKeyDevTool {
    constructor(protected stats: Stats) {
        const hotKeyTool = HotKeyTool.instance;
        const devPixiDrawLayoutPlugin = new DevPixiDrawLayoutPlugin(Main.APP.stage);
        hotKeyTool.registerOnKey("D", () => {
            hotKeyTool.registerOnKey("1", () => {
                this.stats.dom.style.opacity = this.stats.dom.style.opacity == "0.9" ? "0.2" : "0.9";
            }, "stats visibility");
            hotKeyTool.registerOnKey("2", () => {
                const layoutManager = dependencyManager.resolve(LayoutManager);
                if (layoutManager.hasPlugin(devPixiDrawLayoutPlugin)) {
                    layoutManager.removePlugin(devPixiDrawLayoutPlugin);
                } else {
                    layoutManager.addPlugin(devPixiDrawLayoutPlugin);
                }
            }, "show layouts");
        }, "dev tools");
    }
}

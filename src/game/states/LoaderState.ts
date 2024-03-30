import {State} from "app/stateMachine/State";
import {TGameStates} from "app/game/states/TGameStates";
import {Main} from "app/Main";
import LoaderScene from "app/scenes/LoaderScene";
import gameModel from "app/model/GameModel";
import promiseHelper, {ResolvablePromise} from "app/helpers/promise/ResolvablePromise";
import {Assets} from "@pixi/assets";
import Signal from "app/helpers/signals/signal/Signal";
import SpineLoader from "app/loader/SpineLoader";

export default class LoaderState extends State<TGameStates> {
    private readonly loaderSignals = gameModel.game.signals.loader;
    private readonly legacyLoaderSignals = {
        onProgress: new Signal<{ progress: number }>(),
        onComplete: new Signal<{ progress: number }>(),
    };
    private readonly loadPromise: ResolvablePromise = promiseHelper.getPromiseCounter(1);
    private readonly soundLoadPromise: ResolvablePromise = promiseHelper.getResolvablePromise();
    private loaderPromise: Promise<unknown> = new Promise<void>(() => {});

    async compose(): Promise<void> {
        await super.compose();
        this.loaderPromise = Assets.init({
            manifest: {
                bundles: [
                    {
                        name: "game-assets",
                        assets: [
                            {alias: "UI", src: "assets/atlases/ui.json"},
                            {alias: "splash", src: "assets/atlases/splash.json"},
                            {alias: "symbols", src: "assets/atlases/symbols.json"},
                            {alias: "reels", src: "assets/atlases/reels.json"},
                            {alias: "pop_up", src: "assets/atlases/pop_up.json"},
                            {alias: "common", src: "assets/atlases/common.json"},
                            {alias: "background", src: "assets/atlases/background.json"},
                            {alias: "vfx", src: "assets/atlases/vfx.json"},
                            {alias: "paytable", src: "assets/atlases/paytable.json"},
                            {alias: "winline", src: "assets/atlases/winline.json"},
                            {alias: "character", src: "assets/atlases/character.json"},
                            {alias: "wildbonus", src: "assets/atlases/wildbonus.json"},
                            {alias: "grass", src: "assets/atlases/grass.json"},
                            // bitmap fonts
                            {alias: "win_counter", src: "./assets/fonts/bitmap/win_counter.xml"},
                            {alias: "intro", src: "./assets/fonts/bitmap/intro.xml"},
                            {alias: "outro", src: "./assets/fonts/bitmap/outro.xml"},
                            {alias: "RobotoB", src: "./assets/fonts/RobotoB.ttf"},
                            {alias: "SuperMarioGalaxy", src: "./assets/fonts/SuperMarioGalaxy.ttf"},
                        ],
                    },
                ],
            },
        });
    }

    async activate(): Promise<void> {
        await super.activate();
        const sceneManager = Main.MAIN.mainSceneManager;
        await sceneManager.navigate(LoaderScene);
        let progress = 0;
        const progressFactorStep = 0.1;
        let progressFactor = progressFactorStep * 8;
        this.legacyLoaderSignals.onComplete.add(async loader => {
            progress = loader.progress * progressFactor;
            this.loaderSignals.progressUpdate.emit(progress);
            this.loadPromise.resolve();
        }, this);
        this.legacyLoaderSignals.onProgress.add(loader => {
            progress = loader.progress * progressFactor;
            this.loaderSignals.progressUpdate.emit(progress);
        }, this);
        gameModel.ready.then(() => {
            progressFactor += progressFactorStep;
            this.loaderSignals.progressUpdate.emit(progress * progressFactor);
        });
        this.soundLoadPromise.then(() => {
            progressFactor += progressFactorStep;
            this.loaderSignals.progressUpdate.emit(progress * progressFactor);
        });
        [this.loadPromise, gameModel.ready, this.soundLoadPromise].promise().all().then(() => {
            // todo: analyze why it works [#4]
            /* for (const resourcesKey in this.loader.resources) {
                if (Object.prototype.hasOwnProperty.call(this.loader.resources, resourcesKey)) {
                    Loader.shared.resources[resourcesKey] = this.loader.resources[resourcesKey];
                }
            } */
            this.loaderSignals.complete.emit();
        });
    }

    async run() {
        document.body.appendChild(<HTMLCanvasElement>Main.APP.view);
        gameModel.initHowler().then(() => {
            this.soundLoadPromise.resolve();
        });
        await [Assets.loadBundle("game-assets", progress => {
            this.legacyLoaderSignals.onProgress.emit({progress});
        }), SpineLoader.load()].promise().all();
        this.legacyLoaderSignals.onComplete.emit({progress: 1});
        await this.loaderPromise;
        this.loadPromise.resolve();
        await this.soundLoadPromise;
        await this.loadPromise;
        await gameModel.ready;
        return this;
    }

    async deactivate(): Promise<void> {
        this.legacyLoaderSignals.onComplete.unload(this);
        this.legacyLoaderSignals.onProgress.unload(this);
        await super.deactivate();
    }
}

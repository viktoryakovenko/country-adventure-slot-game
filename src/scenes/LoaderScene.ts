import BaseScene from "./BaseScene";
import gameModel from "../model/GameModel";
import SceneManager from "./SceneManager";
import AlphaFadeInEffect from "../pixi/effects/AlphaFadeInEffect";
import LoaderControl from "../controls/LoaderControl";
import {Container} from "@pixi/display";
import {inject} from "app/model/injection/InjectDecorator";
import LayoutManager from "app/layoutManager/LayoutManager";
import loaderLayout from "app/scenes/LoaderScene.layout";
import BackgroundScene from "app/scenes/subscenes/BackgroundScene";
import {introBackground} from "app/scenes/IntroGameScene.layout";
import {SpriteControl} from "app/controls/SpriteControl";
import {Application} from "pixi.js";

export default class LoaderScene extends BaseScene {
    @inject(LayoutManager)
    private readonly layoutManager!: LayoutManager;
    private readonly logo = new SpriteControl("logo.png");
    private readonly loaderContainer: Container;
    private readonly loaderControl = new LoaderControl();
    private readonly loaderSignals = gameModel.game.signals.loader;
    private readonly backgroundSceneManager = new SceneManager(this.app, false);

    constructor(sceneManager: SceneManager, app: Application & {root: Container}) {
        super(sceneManager, app);
        this.loaderContainer = this.loaderControl.container;
    }

    compose(): void {
        void this.backgroundSceneManager.navigate(BackgroundScene);
        this.loaderSignals.progressUpdate.add(this.onLoaderUpdate, this);
        this.loaderSignals.complete.add(this.onLoadComplete, this);
        this.addControl(this.logo.name("logo"));
        this.addControl(this.loaderControl.name("bar"));
        new AlphaFadeInEffect(this.loaderContainer, this.app.ticker);
        this.loaderControl.update(0.01);
    }

    activate() {
        super.activate();
        gameModel.game.signals.background.show.emit("intro");
        this.layoutManager.addLayout(loaderLayout, introBackground);
    }

    deactivate() {
        this.layoutManager.removeLayout(loaderLayout, introBackground);
        super.deactivate();
    }

    dispose() {
        this.loaderSignals.progressUpdate.remove(this.onLoaderUpdate);
        this.loaderSignals.complete.remove(this.onLoadComplete);
        super.dispose();
    }

    private onLoadComplete() {
        this.loaderControl.update(1);
    }

    private onLoaderUpdate(progress: number) {
        this.loaderControl.update(progress);
    }
}

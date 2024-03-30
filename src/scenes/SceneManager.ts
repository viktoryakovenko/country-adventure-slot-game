import BaseScene from "./BaseScene";
import gameModel from "../model/GameModel";
import {Container} from "@pixi/display";
import Signal from "app/helpers/signals/signal/Signal";
import {Application} from "pixi.js";

export default class SceneManager {
    public static readonly SIGNALS = {
        SCENE: {
            ACTIVATED: new Signal<BaseScene>(),
            DIACTIVATED: new Signal<BaseScene>(),
        },
    };
    private readonly sceneCache: Map<typeof BaseScene, BaseScene>;
    private readonly stage: Container;
    // todo: TBD
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private activeScene: BaseScene;
    private activeSceneKey: typeof BaseScene | undefined;

    public constructor(protected app: Application, private useSceneCache: boolean = true) {
        this.sceneCache = new Map<typeof BaseScene, BaseScene>();
        this.stage = app.stage;
    }

    public async navigate(targetScreen: typeof BaseScene) {
        if (this.activeSceneKey == targetScreen) {
            return;
        }
        if (this.activeScene != null) {
            await this.activeScene.deactivate();
            SceneManager.SIGNALS.SCENE.DIACTIVATED.emit(this.activeScene);
            this.stage.removeChild(this.activeScene.scene);
            if (!this.useSceneCache) {
                await this.activeScene.dispose();
            }
        }

        if (!this.sceneCache.has(targetScreen)) {
            // todo: TBD
            const TargetScreenClazz = targetScreen;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.activeScene = new TargetScreenClazz(this, this.app);
            await this.activeScene.compose();
            if (this.useSceneCache) {
                this.sceneCache.set(targetScreen, this.activeScene);
            }
        } else {
            const activeScene = this.sceneCache.get(targetScreen);
            if (activeScene) {
                this.activeScene = activeScene;
            }
        }
        this.stage.addChild(this.activeScene.scene);
        this.activeScene.scene.name = targetScreen.name;
        await this.activeScene.activate();
        SceneManager.SIGNALS.SCENE.ACTIVATED.emit(this.activeScene);
        gameModel.updateLayout.emit(gameModel.gameSize);
        this.activeSceneKey = targetScreen;
    }

    public dispose() {
        if (this.activeScene != null) {
            this.activeScene.deactivate();
            this.stage.removeChild(this.activeScene.scene);
            if (!this.useSceneCache) {
                this.activeScene.dispose();
            }
        }
    }
}

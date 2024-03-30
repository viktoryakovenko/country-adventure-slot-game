import SceneManager from "./scenes/SceneManager";
import gameModel, {GameSize} from "app/model/GameModel";
import {Ticker} from "@pixi/ticker";
import {BaseRenderTexture, RenderTexture, Texture} from "@pixi/core";
import {Container} from "@pixi/display";
import {Graphics} from "@pixi/graphics";
import SpineLoader from "app/loader/SpineLoader";
import {devPixiInit} from "app/dev/DevPixiInit";
import "res/styles/main.css";
import LayoutManager from "app/layoutManager/LayoutManager";
import dependencyManager from "app/model/injection/InjectDecorator";
import PixiLayoutPlugin from "app/layoutManager/PixiLayoutPlugin";
import StateMachine from "app/stateMachine/StateMachine";
import LoaderState from "app/game/states/LoaderState";
import {TGameStates} from "app/game/states/TGameStates";
import IntroState from "app/game/states/IntroState";
import {initTypes} from "app/typing/mutability/types";
import NextState from "app/game/states/NextState";
import SoundController from "app/game/SoundController";
import PreLoaderState from "app/game/states/PreLoaderState";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import Localization from "app/localization/Localization";
import * as enLang from "res/configs/localization/en.json";
import {Application} from "pixi.js";

document.body.style.margin = "0";
document.body.style.overflow = "hidden";

const globalScale = 1;
export const gameSize: GameSize = {
    width: 1920 * globalScale,
    height: 1080 * globalScale,
    scale: globalScale,
    centerPosition: {x: 1920 * globalScale * .5, y: 1080 * globalScale * .5},
    isPortrait: false,
};

export class Main {
    public static APP: Application;
    public static MAIN: Main;
    public readonly mainSceneManager: SceneManager;
    public readonly stateMachine: StateMachine<TGameStates>;
    private readonly app: Application;
    private dt = -1;
    private updateLayoutTimeoutId = 0;

    constructor() {
        this.app = new Application({
            width: gameSize.width,
            height: gameSize.height,
            backgroundColor: 0x000000,
            antialias: true,
            eventMode: "auto",
            eventFeatures: {
                globalMove: true,
                move: true,
                click: true,
            },
        });
        this.stateMachine = new StateMachine(__DEV__);
        this.mainSceneManager = new SceneManager(this.app, false);
    }

    init() {
        console.log("new Main");
        Main.MAIN = this;
        gsap.registerPlugin(CustomEase);
        this.app.stage.name = "Root";
        this.app.stage.hitArea = this.app.screen;
        if (__DEV__) {
            devPixiInit(this.app);
        }
        Main.APP = this.app;
        this.initSpineLoader();
        const layoutManager = new LayoutManager(() => {
            window.dispatchEvent(new Event("resize"));
        });
        const localization = new Localization("en");
        localization.addTranslation("en", enLang);
        dependencyManager.register(Localization, localization);
        dependencyManager.register(LayoutManager, layoutManager);
        dependencyManager.register(Ticker, this.app.ticker);
        this.setupStateMachine().then(async () => {
            await this.stateMachine.goto("preLoaderState");
            await this.stateMachine.goto("loaderState");
            await this.stateMachine.goto("introState");
            await this.stateMachine.goto("mainGameState");
        });
        gameModel.howlerReadyPromise.then(howler => {
            new SoundController(howler).compose();
        });
        gameModel.updateLayout.add(layoutManager.update, layoutManager, 1);
        layoutManager.addPlugin(new PixiLayoutPlugin(this.app.stage));
        window.addEventListener("resize", this.resize.bind(this), {capture: true});
        this.resize();
        gameModel.updateLayout.onListenerAdded.add(() => {
            this.updateLayout();
        });
        gameModel.pauseGame.add(opt => {
            if (opt.pause) {
                this.app.ticker.stop();
            } else {
                this.app.ticker.start();
            }
        });
    }

    private async setupStateMachine() {
        await this.stateMachine.add("preLoaderState", new PreLoaderState());
        await this.stateMachine.add("loaderState", new LoaderState());
        await this.stateMachine.add("introState", new IntroState());
        await this.stateMachine.add("nextState", new NextState());
    }

    private resize() {
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;
        const width = 1920;
        const height = 1080;
        const scale = Math.min(innerWidth / width, innerHeight / height);
        const newWidth = Math.max(innerWidth / scale, width);
        const newHeight = Math.max(innerHeight / scale, height);
        this.app.renderer.resize(
            newWidth,
            newHeight,
        );
        __DEV__ && console.log("resize: ", {
            width,
            innerWidth,
            newWidth,
            height,
            innerHeight,
            newHeight,
            scale,
        });
        const canvas = <HTMLCanvasElement> this.app.view;
        canvas.style.width = newWidth * scale + "px";
        canvas.style.height = newHeight * scale + "px";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.marginTop = `${(innerHeight - newHeight * scale) / 2}px`;
        canvas.style.marginLeft = `${(innerWidth - newWidth * scale) / 2}px`;
        gameSize.scale = this.app.renderer.width / 1920;
        gameSize.width = this.app.renderer.width;
        gameSize.height = this.app.renderer.height;
        gameSize.centerPosition = {
            x: gameSize.width * .5,
            y: gameSize.height * .5,
        };
        gameSize.isPortrait = this.getIsPortrait();
        this.updateLayout();
    }

    getIsPortrait() {
        const aspect = gameSize.width / gameSize.height;
        const portraitAspect = 1920 / 2561;
        const landscapeAspect = 1920 / 1440;
        const middleAspect = portraitAspect + (landscapeAspect - portraitAspect) / 2;
        return aspect < middleAspect;
    }

    private updateLayout() {
        if (this.dt == -1) {
            this.dt = Date.now();
        } else {
            clearTimeout(this.updateLayoutTimeoutId);
        }
        gameModel.pauseGame.emit({pause: true});
        this.updateLayoutTimeoutId = setTimeout(async () => {
            await gameModel.updateLayout.emit(gameSize).all();
            gameModel.pauseGame.emit({pause: false});
            this.dt = -1;
        }, 10);
    }

    public getTexture(containerToRender: Container): Texture {
        const bounds = containerToRender.getBounds();
        const baseRenderTexture = new BaseRenderTexture({width: bounds.width, height: bounds.height});
        const renderTexture = new RenderTexture(baseRenderTexture);
        this.app.renderer.render(containerToRender, {renderTexture});
        return renderTexture;
    }

    private initSpineLoader() {
        const size = 500;
        const graphics = new Graphics()
            .beginFill(0xffffff, 1)
            .drawRect(0, 0, size, size);
        const step = size / 10;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                graphics
                    .beginFill(0xff0000, 1)
                    .drawRect((i - j % 2) * step, (j - i % 2) * step, step, step);
            }
        }
        graphics.drawRect(9 * step, 9 * step, step, step);
        if (BUILD_TYPE != "DEV") {
            graphics.visible = false;
        }
        const texture = this.getTexture(graphics);
        SpineLoader.init(texture);
        this.app.stage.name = "Stage";
        /*
        //todo: uncomment to look on texture
        let sprite = new Sprite(texture);
        sprite.anchor.set(0.5);
        gameModel.updateLayout.add(value => {
            sprite.parent.addChild(sprite);
            sprite.position.set(value.width * 0.5, value.height * 0.5);
        });
        this.app.stage.addChild(sprite);*/
    }

    devInit() {
        if (__DEV__ || BUILD_TYPE == "DEV" || BUILD_TYPE == "STAGE") {
            import("app/dev/DevController").then(value => {
                const DevController = value.default;
                new DevController();
            });
        }
    }
}

initTypes();


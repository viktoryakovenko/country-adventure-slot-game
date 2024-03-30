import Signal from "../helpers/signals/signal/Signal";
import MainControl from "src/controls/MainControl";
import constructor from "app/model/ContructortTypes";
import sounds from "res/sounds/SOUND_FILE.soundmap.json";
import {Howl} from "howler";
import dependencyManager from "app/model/injection/InjectDecorator";
import {TInitResponse} from "app/server/service/typing";
import ServerCommunicator from "app/server/fruit/ServerCommunicator";
import GameSignals from "app/model/GameSignals";
import promiseHelper, {ResolvablePromise} from "app/helpers/promise/ResolvablePromise";
import BetModel from "app/model/BetModel";
import UserModel from "app/model/UserModel";
import FreeSpinModel from "app/model/FreeSpinModel";
import MainGameModel from "app/model/MainGameModel";
import gameLocalStorage from "app/helpers/GameLocalStorage";

import gameConfig from "res/configs/gameConfig.json";
import {HrefParamReader} from "app/helpers/HrefParamReader";

type TInitGameData = TInitResponse;

type TTimings = {
    timings: {
        minSpinDuration: number
    }
};
type THook = {
    hook: number[]
};
export type TReelInfo = {
    reels: { amount: number, height: number, reelFrameGap: number, reelGap: number },
    symbol: { width: number, height: number, gap: number, scale: number }
};
type TAutoplayInfo = {
    spins: number
};

export type TMainGameInfo = TInitGameData & TReelInfo & TTimings & THook;

export class GameModel {
    public readonly isMobile: boolean;
    public isForce = gameLocalStorage.getItem("isForce") === "true";
    public isSoundMuted = gameLocalStorage.getItem("isSoundMuted") === "true";
    public readonly startSpinning = new Signal<void>();
    public readonly updateLayout: Signal<GameSize> = new Signal<GameSize>();
    public readonly pauseGame: Signal<{ pause: boolean }> = new Signal<{ pause: boolean }>();
    private howler!: Howl;
    private readonly hrefParamReader = new GameParamReader();
    public readonly game = {
        fruit: {
            serverCommunicator: ServerCommunicator.builder.build(SERVER_TYPE),
        },
        signals: new GameSignals(),
        linesId: 21,
    };
    public autoplay: TAutoplayInfo = {
        spins: 0,
    };
    // todo: it should be done by a server response [#17];
    mainGameInfo!: TMainGameInfo;

    public readonly ready: Promise<void>;
    public readonly gameSize: GameSize = {
        width: 0, height: 0, scale: 1, centerPosition: {x: 0, y: 0}, isPortrait: false,
    };
    firstUserInteractionPromise: ResolvablePromise<void> = promiseHelper.getResolvablePromise();
    howlerReadyPromise: ResolvablePromise<Howl> = promiseHelper.getResolvablePromise();

    constructor() {
        this.updateLayout.add((gameSize: GameSize, resolve?: () => void) => {
            Object.assign(this.gameSize, gameSize);
            resolve && resolve();
        }, this, 1);
        this.isMobile = this.getHrefParamReader().get("channel", "desktop") == "mobile";
        // eslint-disable-next-line no-async-promise-executor
        this.ready = new Promise<void>(async resolve => {
            const userName = this.proceedUserName();
            const response = await this.game.fruit.serverCommunicator.login(userName);
            this.mainGameInfo = Object.assign(response,
                <TReelInfo>{
                    reels: {amount: 5, height: 3, reelGap: 33, reelFrameGap: 18},
                    symbol: {width: 200, height: 209, gap: 162.5, scale: 1.000},
                },
                <TTimings>{
                    timings: {
                        minSpinDuration: gameConfig.reels.minSpinDuration,
                    },
                },
                <THook>{hook: []},
            );
            resolve();
        });
        this.ready.then(this.setup.bind(this));
    }

    private proceedUserName() {
        const uniqTag = Math.round(Date.now()/1000-1702618185);
        const userName = this.getHrefParamReader().getUserName(`lo${uniqTag}`);
        if (__DEV__) {
            if (userName == "Lo" && !this.getHrefParamReader().hasUserName() && SERVER_TYPE == "legacy") {
                const promptUserName = prompt("Please enter your prefer name");
                const href = window.location.href;
                window.location.href = href + `${href.includes("?") ? "&" : "?"}login=${promptUserName}`;
            }
        }
        return userName;
    }

    updateSpeedFactor(speedFactor: number) {
        this.game.signals.speedFactorUpdate.emit(speedFactor);
    }

    updateMinSpinDuration(speedFactor: number) {
        this.mainGameInfo.timings.minSpinDuration = gameConfig.reels.minSpinDuration / speedFactor;
    }

    private setup() {
        const betModel = new BetModel(this.mainGameInfo.bets, this.game);
        const userModel = new UserModel(this.mainGameInfo.user, this.mainGameInfo.userStats);
        dependencyManager.register(BetModel, betModel);
        dependencyManager.register(UserModel, userModel);
        dependencyManager.register(FreeSpinModel, new FreeSpinModel());
        dependencyManager.register(MainGameModel, new MainGameModel().compose());
        if (__DEV__) {
            console.warn("hook present", this.getHrefParamReader().has("hook"));
            if (this.getHrefParamReader().has("hook")) {
                const hook = this.getHrefParamReader().get("hook");
                const updateHook = () => {
                    try {
                        console.warn("hook updated", hook);
                        gameModel.mainGameInfo.hook = JSON.parse(hook);
                    } catch (e) {
                        console.warn(e);
                    }
                };
                gameModel.game.signals.spinComplete.remove(updateHook);
                gameModel.game.signals.spinComplete.add(updateHook, this);
                updateHook();
            }
        }
    }

    getHowler(): Howl {
        return this.howler;
    }

    register<K extends MainControl>(key: constructor<MainControl>, instance: K): this {
        dependencyManager.register(key, instance);
        return this;
    }

    has<T extends MainControl>(key: constructor<T>): boolean {
        return dependencyManager.has(key);
    }

    resolve<T extends MainControl>(key: constructor<T>, init?: () => T, ctx?: unknown): T {
        return dependencyManager.resolve(key, init, ctx);
    }

    initHowler(): Promise<Howl> {
        const soundConfig = <TSoundConfig><unknown>sounds;
        this.howler = new Howl({
            src: soundConfig.src,
            sprite: soundConfig.sprite,
            autoplay: false,
            mute: this.isSoundMuted,
            onend: () => {

            },
            onloaderror: soundId => {
                console.error("onloaderror: " + soundId, sounds);
            },
            onload: () => {
                this.howlerReadyPromise.resolve(this.howler);
            },
        });
        return this.howlerReadyPromise;
    }

    getHrefParamReader(): GameParamReader {
        return this.hrefParamReader;
    }

    unload($this: unknown) {
        this.updateLayout.unload($this);
    }

    setForceMode(isForce: boolean) {
        if (isForce) {
            this.updateSpeedFactor(gameConfig.forceSpeedFactor);
            this.updateMinSpinDuration(gameConfig.forceSpeedFactor);
        } else {
            this.updateSpeedFactor(gameConfig.defaultSpeedFactor);
            this.updateMinSpinDuration(gameConfig.defaultSpeedFactor);
        }
        gameLocalStorage.setItem("isForce", JSON.stringify(isForce));
        this.isForce = isForce;
    }
}

class GameParamReader extends HrefParamReader {
    constructor() {
        super(window.location.href);
    }

    getTitle(defaultValue = "GAME%20TEMPLATE"): string {
        const search = window.location.href;
        const regexp = /([?&])title=([^&#]*)/;
        const match = search.match(regexp);
        let title;
        if (match && match.length > 2) {
            title = match[2];
        } else {
            title = defaultValue;
            console.warn(`title cannot be read, by default was set: [${title}]`);
        }
        return decodeURI(title);
    }

    getHueDegree(): number {
        const search = window.location.href;
        const regexp = /(([?&])hue=(\d+))/;
        const match = search.match(regexp);
        let hue;
        if (match && match.length > 0) {
            hue = match[3];
        } else {
            hue = "0";
            console.warn(`hue cannot be read, by default was set: [${hue}]`);
        }
        return parseInt(hue);
    }


    hasUserName() {
        return this.has("login");
    }

    getUserName(defaultValue = "Lo"): string {
        const search = window.location.href;
        const regexp = new RegExp(/([?&])login=((\w|\d|[:.\\/-])+)/);
        const match = search.match(regexp);
        let login;
        if (match && match.length > 0) {
            login = match[2];
        } else {
            login = defaultValue;
            console.warn(`login cannot be read, by default was set: [${login}]`);
        }
        return login;
    }
}

export type GameSize = {
    width: number;
    height: number;
    centerPosition: { x: number, y: number };
    scale: number;
    isPortrait: boolean;
};

type TSoundConfig = {
    src: string[];
    sprite: { [name: string]: [number, number] | [number, number, boolean] };
};

const gameModel = new GameModel();
export default gameModel;

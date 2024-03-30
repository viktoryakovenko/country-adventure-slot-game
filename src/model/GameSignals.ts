import Signal from "app/helpers/signals/signal/Signal";
import {
    TFullUserData,
    TInitResponse,
    TJumpingWild,
    TResponse,
    TScatterWin,
    TSpinResponse,
    TWin,
} from "app/server/service/typing";
import {TAnimations, TSkins} from "app/controls/reels/SpineReelSymbol";
import {PlaySymbolAnimationParams} from "app/controls/reels/ReelsControl";
import {IPointData} from "pixi.js";

export class VisibilitySignals<T> {
    readonly show = new Signal<T>();
    readonly hide = new Signal<void>();
    readonly shown = new Signal<void>();
    readonly hidden = new Signal<void>();
}

export type TBackgroundType = "intro" | "main" | "fs" | "dark";

export default class GameSignals {
    public readonly reels = {
        updateSkin: new Signal<TSkins>(),
        updateAnimation: new Signal<TAnimations>(),
        spin: new Signal<void>(),
        stop: new Signal<number[]>(),
        forceMoveOn: new Signal<number[]>(),
        shake: new Signal<void>(),
        updateReelOffset: new Signal<number>(),
        dimAllSymbols: new Signal<{dim:boolean, except?:{x:number, y:number}[]}>(),
        dimSpecificSymbols: new Signal<{x:number, y:number}[]>(),
        undimSpecificSymbols: new Signal<{x:number, y:number}[]>(),
        stopAllAnimations: new Signal(),
        showScatterWins: new Signal<TScatterWin[]>(),
        showLineWins: new Signal<TWin[]>(),
        showLine: new Signal<number>(),
        stopped: new Signal<number>(),
        play: new Signal<PlaySymbolAnimationParams>(),
        anticipateReels: new Signal<number[]>(),
        scatterReels: new Signal<number[]>(),
        anticipationShown: new Signal<number>(),
        hideLines: new Signal<void>(),
        clearSymbols: new Signal<void>(),
        stopStarted: new Signal<number>(),
        showWildBonus2Presentation: new Signal<TJumpingWild[][]>(),
        showWildBonus1Presentation: new Signal<TJumpingWild[][]>(),
        addWinLable: new Signal<{symbol:{x:number, y:number}, win:number}>(),
        removeWinLable: new Signal<{x:number, y:number}>(),
    };
    public readonly autoplay = {
        show: new Signal<void>(),
        hide: new Signal<void>(),
        changed: new Signal<number>(),
        decrease: new Signal<void>(),
        stop: new Signal<void>(),
    };
    public readonly spinComplete = new Signal<void>();
    public readonly spinStarted = new Signal<void>();
    public readonly data = {
        login: new Signal<TInitResponse>(),
        spin: new Signal<TSpinResponse>(),
        users: new Signal<TFullUserData[]>(),
        stopReel: new Signal<TResponse>(),
        buyAmount: new Signal<TResponse>(),
    };
    public readonly loader = {
        progressUpdate: new Signal<number>(),
        complete: new Signal<void>(),
    };
    readonly ui = {
        options: {
            info: {
                show: new Signal<void>(),
                hide: new Signal<void>(),
            },
            toggleSound: new Signal<void>(),
        },
        spinButton: {
            clicked: new Signal<void>(),
            enable: new Signal<void>(),
            disable: new Signal<void>(),
            updateCounter: new Signal<number>(),
        },
        autoplayButton: {
            enable: new Signal<void>(),
        },
        balance: {
            showCashReplenishment: new Signal<{position: IPointData, winnings: number}[]>(),
            startBalanceAnimation: new Signal<void>(),
            balanceChangesDisplayed: new Signal<void>(),
        },

        showWin: new Signal<{win:number, isTotalWin?:boolean}>(),
        disableControls: new Signal<void>(),
        enableControls: new Signal<void>(),

    };
    readonly background = new VisibilitySignals<TBackgroundType>();
    readonly popup = {
        fsIntro: new VisibilitySignals<number>(),
        fsOutro: new VisibilitySignals<number>(),
        winCounter: new VisibilitySignals<number>(),
    };
    public readonly infobar = {
        start: new Signal<void>(),
        stop: new Signal<void>(),
        hide: new Signal<void>(),
        show: new Signal<void>(),
    };
    public readonly speedFactorUpdate = new Signal<number>();
    paytableShow = new Signal();
    paytableHide = new Signal();
}

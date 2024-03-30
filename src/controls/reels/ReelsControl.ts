import MainControl from "app/controls/MainControl";
import {Container} from "@pixi/display";
import ReelControl, {TReelStopStatement} from "app/controls/reels/ReelControl";
import gameModel, {TMainGameInfo} from "app/model/GameModel";
import {promiseDelay, TimeUnit} from "app/helpers/TimeHelper";
import {TScatterWin, TSymbolId, TSymbolPosition, TWin} from "app/server/service/typing";
import SpineReelSymbol, {TAnimations, TSkins} from "app/controls/reels/SpineReelSymbol";
import Signal from "app/helpers/signals/signal/Signal";
import AnticipationFrameControl from "app/controls/reels/AnticipationFrameControl";
import SpeedFactorExtension, {SpeedFactorControl} from "app/controls/extensions/SpeedFactorExtension";
import gameConfig from "res/configs/gameConfig.json";
import MotionLayerControl from "app/controls/motion/view/MotionLayerControl";
import {inject} from "app/model/injection/InjectDecorator";
import {randomPointOnUnitCircle} from "app/helpers/math";
import BetPanelScene from "app/scenes/subscenes/BetPanelScene";
import CoinControl from "app/controls/CoinControl";
import gsap from "gsap";
import pgsap from "app/helpers/promise/gsap/PromisableGsap";
import {randomInt} from "app/helpers/math";
import WildBonus2Extension from "app/controls/extensions/WildBonus2Extension";
import WildBonus1Extension from "app/controls/extensions/WildBonus1Extension";
import {BitmapText, Text} from "pixi.js";
import TextStyles from "app/model/TextStyles";
import {IPointData} from "pixi.js";

export type PlaySymbolAnimationParams = {x: number; y: number; animation: TAnimations; track?: number};

type ReelSymbolData = {
    symbol: SpineReelSymbol,
    position: {x: number, y: number},
    symbolId: TSymbolId,
};

export default class ReelsControl extends MainControl implements SpeedFactorControl {
    private readonly reelsContainer = new Container();
    private readonly anticipationFrame: AnticipationFrameControl;
    private readonly anticipationReels: number[] = [];
    readonly reels: ReelControl[] = [];
    readonly anticipationShown = new Signal<number>();
    readonly signals = {
        reelStopped: new Signal<number>(),
        reelSpinStarted: new Signal<number>(),
        reelStopStarted: new Signal<number>(),
    };
    @inject(MotionLayerControl)
    private readonly motionLayer!: MotionLayerControl;
    public speedFactor = 1;

    constructor(protected readonly mainGameInfo:TMainGameInfo) {
        super();
        this.anticipationFrame = new AnticipationFrameControl(mainGameInfo);
        this.addExtension(new SpeedFactorExtension());
        this.addExtension(new WildBonus1Extension());
        this.addExtension(new WildBonus2Extension());
    }

    updateSpeedFactor(speedFactor: number): void {
        this.speedFactor = speedFactor;
    }

    init() {
        super.init();
        const mainGameInfo = this.mainGameInfo;
        const reels = mainGameInfo.reels;
        for (let i = 0; i < reels.amount; i++) {
            const reelControl = new ReelControl(i, mainGameInfo);
            reelControl.addExtension(new SpeedFactorExtension());
            reelControl.name(`reel_${i}`);
            this.reels.push(reelControl);
        }
        this.container.addChild(this.reelsContainer);
        this.add(this.anticipationFrame);
        this.anticipationFrame.moveOnReel(0);
        this.anticipationFrame.hide().then();
    }

    updateSkins(skin: TSkins) {
        this.reels.forEach(value => {
            value.updateSkins(skin);
        });
    }

    stopAllSymbols() {
        this.reels.map(async value => {
            value.getVisibleSymbols().forEach(value1 => {
                value1.stop().name("idle");
            });
        });
    }

    async updateAnimation(animation: TAnimations, loop = true, trackIndex = 1) {
        await Promise.all(this.reels.map(async value => {
            await value.updateAnimations(animation, loop, trackIndex);
        }));
    }

    async spin(speed?: number) {
        this.clearSymbols();
        await Promise.all(this.reels.map(async (reel, index) => {
            await promiseDelay((gameConfig.reels.spinDelay * index) / this.speedFactor, TimeUnit.sec);
            this.signals.reelSpinStarted.emit(index);
            await reel.spin(speed);
            this.signals.reelStopped.emit(index);
        }));
    }

    async forceStop(reelStops: number[]) {
        this.reels.forEach((reel, index) => {
            reel.forceStop(reelStops[index]);
        });
    }

    async stop(reelStops: number[]) {
        await Promise.all(this.reels.map(async (reel, index) => {
            const delay = this.anticipationReels.filter((value, i) => i <= index)
                .map(value => value == 0 ? gameConfig.reels.stopDelay : gameConfig.reels.anticipationDelay)
                .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
            await promiseDelay(delay, TimeUnit.sec);
            reel.reelStopped.promise().then(this.showAnticipationReel.bind(this));
            this.signals.reelStopStarted.emit(index);
            await reel.stop(reelStops[index]);
        }));
    }

    async showScatterWins(scatterWins: TScatterWin[]) {
        await Promise.all(scatterWins.map(async win => {
            if (win.symbolId == TSymbolId.BONUS) {
                await this.showBonusScattersWin(win);
            }

            await Promise.all(win.symbols.map(async symbol => {
                await this.reels[symbol.x].getSymbol(symbol.y).moveTop().play("undim", {timeScale: 4});
                await this.reels[symbol.x].getSymbol(symbol.y).moveTop().play("win", {timeScale: 2});
            }));
        }));
    }

    async showBonusScattersWin(bonusWin : TScatterWin) {
        const wins = bonusWin.symbols.map(symbol => {
            const symbolContainer = this.getSymbol({x: symbol.x, y: symbol.y}).container;
            const globalPosition = symbolContainer.getGlobalPosition();
            return {position: globalPosition as IPointData, winnings: bonusWin.win};
        });
        await gameModel.game.signals.ui.balance.showCashReplenishment.emit(wins).all();
    }

    async showLineWins(wins: TWin[]) {
        if (wins.length == 0) {
            return;
        }
        const winSymbols = this.getWinSymbols(wins);
        await Promise.all(winSymbols.map(async symbol => symbol.symbol.moveTop().play("undim", {timeScale: 4})));
        await Promise.all(winSymbols.map(async symbol => symbol.symbol.moveTop().play("win", {timeScale: 2})));
    }

    updateSymbol(symbolPosition: TSymbolPosition, symbolId : TSymbolId) {
        this.reels[symbolPosition.x].updateSymbol(symbolPosition.y, symbolId);
    }

    clearSymbols() {
        this.reels.forEach(reel => {
            reel.getVisibleSymbols().forEach(symbol => symbol.removeAdditionalInfo());
        });
    }

    public getWinSymbols(wins: TWin[]) {
        const cache: SpineReelSymbol[] = [];
        const result: ReelSymbolData[] = [];
        wins.forEach(win => {
            this.mainGameInfo.lines[win.lineId].forEach((lineOffset, index) => {
                if (index < win.symbolsAmount) {
                    const symbol = this.reels[index].getSymbol(lineOffset);
                    if (!cache.includes(symbol)) {
                        cache.push(symbol);
                        result.push({
                            symbol,
                            position: {x: index, y: lineOffset},
                            symbolId: win.symbolId,
                        });
                    }
                }
            });
        });
        return result;
    }

    async undimAllSymbols() {
        await this.reels.map(async reel => {
            await reel.getSymbolsSymbols()
                .map(async symbol => {
                    const isSpecial = symbol.getSkin() == "wild" || symbol.getSkin() == "scatter";
                    const ignore = symbol.getCurrentAnimation(1) == "dim_for_spin" && isSpecial;
                    const timeScale = ignore ? 100 : this.speedFactor;
                    await symbol.play("undim", {overrideAnimation: false, timeScale: timeScale, trackIndex: 1});
                }).promise().all();
        }).promise().all();
    }

    async dimAllSymbols(except?: {x: number; y: number}[]) {
        await this.reels.map(async (reel, x) => {
            await reel.getSymbolsSymbols()
                .filter((symbol, y) => {
                    if (except == null) {
                        return true;
                    }
                    return except.find(pos => pos.x == x && pos.y == y - reel.nearSymbolsAmount) == null;
                })
                .map(async symbol => {
                    const isSpecial = symbol.getSkin() == "wild" || symbol.getSkin() == "scatter";
                    const ignore = symbol.getCurrentAnimation(1) == "dim_for_spin" && !isSpecial;
                    const timeScale = ignore ? 100 : this.speedFactor;
                    await symbol.play("dim", {overrideAnimation: false, timeScale: timeScale, trackIndex: 1});
                }).promise().all();
        }).promise().all();
    }

    async dimSpecificSymbols(symbols: {x: number, y: number}[]) {
        await this.updateSymbols(symbols, "dim");
    }

    async undimSpecificSymbols(symbols: {x: number, y: number}[]) {
        await this.updateSymbols(symbols, "undim");
    }

    async updateSymbols(symbols: {x: number, y: number}[], animation: TAnimations) {
        await this.reels.map(async (reel, x) => {
            await reel.getVisibleSymbols()
                .filter((symbol, y) => {
                    return symbols.find(pos => pos.x == x && pos.y == y) !== undefined;
                })
                .map(async symbol => {
                    const isSpecial = symbol.getSkin() == "wild" || symbol.getSkin() == "scatter";
                    const ignore = symbol.getCurrentAnimation(1) == "dim_for_spin" && isSpecial;
                    const timeScale = ignore ? 100 : this.speedFactor;
                    await symbol.play(animation, {overrideAnimation: false, timeScale: timeScale, trackIndex: 1});
                }).promise().all();
        }).promise().all();
    }

    async showWinValue(winElem:{symbol: {x: number, y: number}, win:number}) {
        await this.reels.map(async (reel, x) => {
            await reel.getVisibleSymbols()
                .filter((elem, y) => {
                    return winElem.symbol.x == x && winElem.symbol.y == y;
                })
                .map(async elem => {
                    const winValue = new SpineReelSymbol("symbols");
                    winValue.setSkin("winlabel");
                    const winText1 = new BitmapText("$"+winElem.win, {fontName: "win_counter", fontSize: 24});
                    const winText = new Text("$"+winElem.win, TextStyles.TITLE);
                    winText1.anchor.set(0.5, 6);
                    winText.anchor.set(0.5, 1.9);
                    winValue.addAdditionalInfo(winText1);
                    const container = winValue.getContainer();
                    container.position.y += container.height/2;
                    elem.addAdditionalInfo(container);
                }).promise().all();
        }).promise().all();
    }

    async hideWinValue(symbol: {x: number, y: number}) {
        await this.reels.map(async (reel, x) => {
            await reel.getVisibleSymbols()
                .filter((elem, y) => {
                    return symbol.x == x && symbol.y == y;
                })
                .map(async elem => {
                    elem.removeAdditionalInfo();
                }).promise().all();
        }).promise().all();
    }

    async setWinValue(winElem:{symbol: {x: number, y: number}, win:number}) {
        await this.showWinValue(winElem);
    }

    async removeWinValue(symbol: {x: number, y: number}) {
        await this.hideWinValue(symbol);
    }

    showDebugInfo() {
        this.reels.forEach(value => value.showDebugInfo());
    }

    hideDebugInfo() {
        this.reels.forEach(value => value.hideDebugInfo());
    }

    async playSymbolAnimation(payload: PlaySymbolAnimationParams, resolve?: () => void) {
        await this.reels[payload.x].getSymbol(payload.y).play(payload.animation, {trackIndex: payload.track ?? 2});
        resolve?.();
    }

    setAnticipationReels(reels: number[]) {
        this.anticipationReels.length = 0;
        this.anticipationReels.push(...reels);
    }

    private async showAnticipationReel(payload: TReelStopStatement) {
        const reelIndex = payload.reelIndex;
        if (payload.state == "early_stop") {
            await this.anticipationFrame.hide();
            if (this.anticipationReels[reelIndex + 1] == 1) {
                this.anticipationFrame.moveOnReel(reelIndex + 1);
                this.anticipationShown.emit(reelIndex + 1);
                await this.anticipationFrame.show();
            }
        }
    }

    getSymbol(pos: {x: number; y: number}) {
        return this.reels[pos.x].getSymbol(pos.y);
    }
}

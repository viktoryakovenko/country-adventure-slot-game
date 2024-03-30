import MainControl from "app/controls/MainControl";
import {Container} from "@pixi/display";
import {TMainGameInfo} from "app/model/GameModel";
import {inject} from "app/model/injection/InjectDecorator";
import {Ticker} from "@pixi/ticker";
import pgsap from "app/helpers/promise/gsap/PromisableGsap";
import {promiseDelay, TimeUnit} from "app/helpers/TimeHelper";
import SpineReelSymbol, {TAnimations, TSkins} from "app/controls/reels/SpineReelSymbol";
import {TSymbolId} from "app/server/service/typing";
import promiseHelper, {ResolvablePromise} from "app/helpers/promise/ResolvablePromise";
import Signal from "app/helpers/signals/signal/Signal";
import {SpeedFactorControl} from "app/controls/extensions/SpeedFactorExtension";
import gameConfig from "res/configs/gameConfig.json";
import CustomEase from "gsap/CustomEase";
import {ensure} from "app/helpers/ObjectHelper";


export type TReelStopStatement = {
    reelIndex: number,
    state: "early_stop" | "fully_stop" | "bounce_stop"
};

export default class ReelControl extends MainControl implements SpeedFactorControl {
    @inject(Ticker)
    public ticker!: Ticker;
    public readonly reelStopped: Signal<TReelStopStatement> = new Signal();
    public speedFactor = 1;
    private readonly symbols: SpineReelSymbol[] = [];
    private readonly originReelStrip: number[];
    private speed = 0;
    private reelOffset = 0;
    public readonly nearSymbolsAmount = 1;
    private reelStoppedPromise: ResolvablePromise<void> = promiseHelper.getResolvablePromise();
    private isInSpin = false;
    private stopIndex = -1;
    private readonly reelHeight: number;
    private readonly ease = CustomEase.create(
        "custom",
        // eslint-disable-next-line max-len
        "M0,0 C0.116,0.278 0.494,1.15 0.64,1.094 0.712,1.062 0.818,0.96 0.872,0.96 0.914,0.96 0.963,1.003 0.994,1 0.994,1 0.998,1 1,1 "
    );
    protected readonly strips: number[];

    constructor(
        protected readonly reelIndex: number,
        protected readonly mainGameInfo: TMainGameInfo,
    ) {
        super(new Container());
        this.strips = mainGameInfo.strips[reelIndex];
        this.originReelStrip = this.strips.slice();
        const symbolInfo = mainGameInfo.symbol;
        this.reelHeight = symbolInfo.height * this.strips.length;
    }

    updateSpeedFactor(speedFactor: number): void {
        this.speedFactor = speedFactor;
    }

    async init() {
        super.init();
        const mainGameInfo = this.mainGameInfo;
        const reels = mainGameInfo.reels;
        for (let i = 0; i < reels.height + this.nearSymbolsAmount * 2; i++) {
            const symbol = this.getSpineSymbol(0, 0);
            symbol.setScale({x: mainGameInfo.symbol.scale});
            this.add(symbol);
            this.symbols.push(symbol);
        }
        void this.updateAnimations("idle", true);
        const stopIndex = mainGameInfo.userStats.reelStops[this.reelIndex];
        this.reelOffset = this.getReelStopOffset(stopIndex);
        this.onUpdate(1);
    }

    protected getSpineSymbol(x = 0, y = 0): SpineReelSymbol {
        const spineControl = new SpineReelSymbol("symbols");
        spineControl.resetSpineOnReSkin = false;
        spineControl.container.position.set(x, y);
        return spineControl;
    }

    updateSkins(skin: TSkins) {
        this.symbols.forEach(value => value.setSkin(skin));
    }

    async updateAnimations(animation: TAnimations, loop = true, trackIndex = 1) {
        const options = {trackIndex, loop, overrideAnimation: false, timeScale: 1};
        await Promise.all(this.getVisibleSymbols().map(async value => await value.play(animation, options)));
    }

    async spin(reelSpeed?: number) {
        this.reelStoppedPromise = promiseHelper.getResolvablePromise();
        reelSpeed = reelSpeed ?? gameConfig.reels.speed;
        this.ticker.add(this.onUpdate, this);
        this.speed = 0;
        const promise = pgsap.to(this, {
            duration: gameConfig.reel.spinDuration / this.speedFactor,
            speed: reelSpeed,
            ease: "back.in(1)",
        });
        await Promise.all(this.symbols.map(async symbol => {
            await symbol.play("dim_for_spin", {trackIndex: 1});
        }).concat(promise));
        this.isInSpin = true;
        this.symbols.forEach(value => value.moveTop());
        this.strips.length = 0;
        this.strips.push(...this.originReelStrip);
        await this.reelStoppedPromise;
    }

    async moveTo(stopIndex: number) {
        stopIndex = stopIndex % this.strips.length;
        this.ticker.add(this.onUpdate, this);
        const reelOffset = this.getReelStopOffset(stopIndex);
        await pgsap.to(this, {duration: 1 / this.speedFactor, reelOffset: reelOffset, ease: "back.out(1)"});
        this.ticker.remove(this.onUpdate, this);
        this.onUpdate(1);
    }

    async forceStop(stopIndex: number) {
        stopIndex = stopIndex % this.strips.length;
        this.reelOffset = this.getReelStopOffset(stopIndex);
        this.onUpdate(1);
        this.speed = 0;
    }

    async stop(stopIndex: number, force = false) {
        stopIndex = stopIndex % this.strips.length;
        this.stopIndex = stopIndex;
        await promiseDelay(force ? 0 : gameConfig.reel.firstStopDelay / this.speedFactor, TimeUnit.sec);
        const mainGameInfo = this.mainGameInfo;
        const symbolInfo = mainGameInfo.symbol;
        const reelOffset = this.getReelStopOffset(stopIndex);
        const symbolIndex = this.getSymbolIndex(0);
        const reelHeight = symbolInfo.height * mainGameInfo.reels.height;
        const symbolOffset = this.reelOffset % symbolInfo.height;
        this.reelOffset = (reelOffset - symbolInfo.gap - reelHeight + symbolOffset) % this.reelHeight;
        for (let i = 0; i < mainGameInfo.reels.height + this.nearSymbolsAmount; i++) {
            const currentStripIndex = (stopIndex + 3 + i) % this.strips.length;
            const originStripIndex = (symbolIndex + i + this.nearSymbolsAmount) % this.originReelStrip.length;
            this.strips[currentStripIndex] = this.originReelStrip[originStripIndex];
        }
        const dtPerFrame = 1000 / 60;
        const stepsToEnd = (reelHeight * 2) / this.speed;
        this.speed = 0;
        const gapDelay = 0.75;
        const duration = ((stepsToEnd * dtPerFrame) / 1000);
        this.ticker.remove(this.onUpdate, this);
        const reelOffsetCorrection = (reelOffset % this.reelHeight) < this.reelOffset ? this.reelHeight : 0;
        const gsapPromise = pgsap.to(this, {
            duration: duration / gapDelay,
            reelOffset: reelOffset % this.reelHeight + reelOffsetCorrection,
            ease: this.ease,
            onUpdate: () => {
                this.onUpdate(1);
            },
        });
        await promiseDelay(duration, TimeUnit.sec);
        this.reelStoppedPromise.resolve();
        this.isInSpin = false;
        this.reelStopped.emit({reelIndex: this.reelIndex, state: "early_stop"});
        await gsapPromise;
        this.reelOffset = reelOffset;
        this.onUpdate(1);
        this.reelStopped.emit({reelIndex: this.reelIndex, state: "bounce_stop"});
        this.reelStopped.emit({reelIndex: this.reelIndex, state: "fully_stop"});
    }

    private getReelStopOffset(stopIndex: number) {
        const symbolInfo = this.mainGameInfo.symbol;
        const stripHeight = symbolInfo.height * this.strips.length;
        return stripHeight * 2 + symbolInfo.height * (stopIndex + this.nearSymbolsAmount) * -1 + symbolInfo.gap;
    }

    private getSymbolSkin(symbolId: number) {
        const symbolData = ensure(
            this.mainGameInfo.symbols.find(value => value.id == symbolId),
            `no symbol data for symbolId: ${symbolId}`
        );
        const skin = (this.isInSpin ? "blur/" : "") + symbolData.name.toLowerCase();
        return <TSkins>skin;
    }

    getVisibleSymbols() {
        const start = this.nearSymbolsAmount;
        const end = start + this.mainGameInfo.reels.height;
        return this.symbols.slice(start, end);
    }

    getSymbolsSymbols() {
        return this.symbols.slice();
    }

    getSymbol(y: number) {
        return this.symbols[y + this.nearSymbolsAmount];
    }

    private onUpdate(dtFactor: number) {
        const symbolInfo = this.mainGameInfo.symbol;
        this.reelOffset += this.speed * dtFactor;
        const reelSymbolOffset = this.reelOffset % symbolInfo.height;
        this.symbols.forEach((symbol, index) => {
            const yPosition = symbolInfo.height * (index - this.nearSymbolsAmount);
            const symbolIndex = this.getSymbolIndex(index);
            const symbolId = this.strips[symbolIndex];
            symbol.setSkin(this.getSymbolSkin(symbolId));
            symbol.updateSymbolData({id: symbolId, symbolIndex, symbolTileIndex: index});
            symbol.container.position.y = yPosition;
            symbol.container.position.y += reelSymbolOffset;
        });
    }

    private getSymbolIndex(index: number) {
        const symbolInfo = this.mainGameInfo.symbol;
        const stripLength = this.strips.length;
        const stripHeight = symbolInfo.height * stripLength;
        const reelStripOffset = (this.reelOffset % stripHeight) - symbolInfo.height / 2;
        const stripIndexOffset = stripLength - Math.round((reelStripOffset / stripHeight) * stripLength);
        return (stripIndexOffset + index + stripLength - this.nearSymbolsAmount * 2) % stripLength;
    }

    showDebugInfo() {
        this.symbols.forEach(value => value.showSymbolData());
    }

    hideDebugInfo() {
        this.symbols.forEach(value => value.hideSymbolData());
    }

    updateReelOffset(reelOffset: number) {
        const symbolInfo = this.mainGameInfo.symbol;
        const stripHeight = symbolInfo.height * this.strips.length;
        this.reelOffset = stripHeight * reelOffset;
        this.onUpdate(1);
    }

    updateSymbol(y: number, symbolId: TSymbolId) {
        this.strips[(this.stopIndex + y) % this.strips.length] = symbolId;
        this.onUpdate(0);
    }
}

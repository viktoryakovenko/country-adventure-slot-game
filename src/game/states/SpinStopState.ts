import {GameState} from "app/game/states/GameState";
import gameModel from "app/model/GameModel";
import {promiseDelay, TimeUnit} from "app/helpers/TimeHelper";
import {TSpinResult, TSymbolId} from "app/server/service/typing";
import {AnticipationReelsProvider} from "app/game/AnticipationReelsProvider";

export default class SpinStopState extends GameState {
    private scatterId = -1;
    private landAnimationPromises: Promise<unknown>[] = [];
    private symbolsForLand: TSymbolId[] = [
        TSymbolId.SCATTER,
        TSymbolId.WILD,
        TSymbolId.BONUS,
    ];
    protected readonly anticipationReelsProvider: AnticipationReelsProvider<TSpinResult>;

    constructor(anticipationReelsProvider: AnticipationReelsProvider<TSpinResult>) {
        super();
        this.anticipationReelsProvider = anticipationReelsProvider;
    }

    async compose(): Promise<void> {
        await super.compose();
        const mainGameInfo = gameModel.mainGameInfo;
        const scatter = mainGameInfo.symbols.find(value => value.isScatter);
        if (!scatter) {
            throw new Error("no scatter symbols in symbols list:" + JSON.stringify(mainGameInfo.symbols));
        }
        this.scatterId = scatter.id;
    }

    async activate(): Promise<void> {
        await super.activate();
        this.gameSignals.reels.stopped.add(this.onReelStopped, this);
        this.landAnimationPromises = [];
    }

    async run(): Promise<GameState> {
        const mainGameInfo = gameModel.mainGameInfo;
        const reelSignals = gameModel.game.signals.reels;
        this.updateAnticipationReels();
        this.updateScatterReels();
        await promiseDelay(mainGameInfo.timings.minSpinDuration, TimeUnit.sec);
        reelSignals.stop.emit(this.spinResponse.userStats.reelStops);
        await this.gameSignals.spinComplete.promise();
        await this.landAnimationPromises.promise().all();
        if (this.spinResponse.totalWin == 0) {
            await this.gameSignals.reels.dimAllSymbols.emit({dim: false}).all();
        }
        return this;
    }

    protected updateAnticipationReels() {
        const anticipationReels = this.anticipationReelsProvider.provide(this.spinResponse);
        this.gameSignals.reels.anticipateReels.emit(anticipationReels);
    }

    private updateScatterReels() {
        const scatterReels = [0, 0, 0, 0, 0];
        const scatterWins = this.spinResponse.scatters.wins;
        scatterWins.forEach(scatterWin => scatterWin.symbols.forEach(scatter => scatterReels[scatter.x] = 1));
        this.gameSignals.reels.scatterReels.emit(scatterReels);
    }

    async deactivate(): Promise<void> {
        this.gameSignals.reels.stopped.unload(this);
        await super.deactivate();
    }

    private onReelStopped(reelIndex: number) {
        const reelWindow = this.spinResponse.reelWindow[reelIndex];
        const hasScatters = reelWindow.includes(this.scatterId);
        reelWindow.forEach((symbolId, y) => {
            if (this.symbolsForLand.contains(symbolId)) {
                const promiseList = this.gameSignals.reels.play.emit({
                    x: reelIndex, y, animation: "land",
                });
                this.landAnimationPromises.push(promiseList.all());
            }
        });
        if (hasScatters) {
            const scatters = this.spinResponse.scatters.wins[0].symbols;
            scatters.filter(value => value.x == reelIndex).forEach(scatter => {
                const promiseList = this.gameSignals.reels.play.emit({
                    x: reelIndex, y: scatter.y, animation: "land",
                });
                this.landAnimationPromises.push(promiseList.all());
            });
            this.gameSignals.reels.shake.emit();
        }
    }
}

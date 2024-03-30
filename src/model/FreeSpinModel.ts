import {TFreeSpinsFeatureResult, TSpinResult} from "app/server/service/typing";
import {ensure} from "app/helpers/ObjectHelper";
import Signal from "app/helpers/signals/signal/Signal";

export default class FreeSpinModel {
    private spinIndex = -1;
    private freeSpins: TSpinResult[] = [];
    spinRemains = 0;
    totalWin = 0;
    readonly freeSpinsAmountChanged = new Signal<{spinRemains: number}>();

    setup(freeSpins: TSpinResult[], initialTotalWin: number) {
        this.freeSpins = freeSpins;
        this.spinRemains = freeSpins.length;
        this.totalWin += initialTotalWin;
        this.freeSpinsAmountChanged.emit({spinRemains: this.spinRemains});
    }

    reset() {
        this.freeSpins = [];
        this.spinIndex = -1;
        this.spinRemains = 0;
        this.totalWin = 0;
    }

    hasSpin(): boolean {
        return this.freeSpins[this.spinIndex] != null;
    }

    hasNextSpin(): boolean {
        return this.freeSpins[this.spinIndex + 1] != null;
    }

    nextSpin(): TSpinResult {
        this.spinIndex++;
        this.totalWin += this.getCurrentSpinResult().totalWin;
        this.spinRemains = this.freeSpins.length - this.spinIndex - 1;
        this.freeSpinsAmountChanged.emit({spinRemains: this.spinRemains});
        return this.freeSpins[this.spinIndex];
    }

    isLastSpin() {
        return this.freeSpins.length - 2 == this.spinIndex;
    }

    getCurrentSpinResult(): TSpinResult {
        return ensure(this.freeSpins[Math.max(0, this.spinIndex)]);
    }

    addReSpins() {
        const spinResult = this.getCurrentSpinResult();
        this.addSpins(spinResult);
    }

    addSpins(freeSpinFeature: TFreeSpinsFeatureResult, toTheEnd = false) {
        const spinResult = this.getCurrentSpinResult();
        const freeSpins = freeSpinFeature.freeSpins;
        if (toTheEnd) {
            this.freeSpins.push(...freeSpins.spins);
        } else {
            this.freeSpins.splice(this.spinIndex + 1, 0, ...freeSpins.spins);
            spinResult.totalWin -= freeSpins.totalWin;
            this.totalWin -= freeSpins.totalWin;
        }
        this.spinRemains = this.freeSpins.length - this.spinIndex - 1;
        this.freeSpinsAmountChanged.emit({spinRemains: this.spinRemains});
    }
}

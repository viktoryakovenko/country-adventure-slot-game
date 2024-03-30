import {TScatterWinResult, TSpinResponse} from "app/server/service/typing";
import {TReelInfo} from "app/model/GameModel";

export interface AnticipationReelsProvider<T> {
    provide(payload: T): number[];
}

export class AllScattersAnticipationReelsProvider implements AnticipationReelsProvider<TSpinResponse> {
    constructor(protected reelInfo: TReelInfo) {
    }

    provide(payload: TSpinResponse): number[] {
        const anticipationReels = [0, 0, 0, 0, 0];
        if (payload.scatters.wins.length > 0) {
            const scatterSymbols = payload.scatters.wins[0].symbols;
            let scatterAmount = 0;
            for (let i = 0; i < this.reelInfo.reels.amount; i++) {
                anticipationReels[i] = scatterAmount >= 2 ? 1 : 0;
                scatterAmount += scatterSymbols.filter(value => value.x == i).length;
            }
        }
        return anticipationReels;
    }
}

export class SmartAnticipationReelsProvider implements AnticipationReelsProvider<TScatterWinResult> {
    constructor(
        protected reelsAmount: number,
        private scatterId: number,
        private scattersAmountForFeatureTrigger: number,
        private reelsForScatterLand: number[],
    ) {
        this.reelsForScatterLand.sort((a, b) => a - b);
    }

    provide(payload: TScatterWinResult): number[] {
        const anticipationReels: number[] = new Array(this.reelsAmount).fill(0);
        let startAt = this.reelsAmount;
        let endOn: number | undefined = undefined;
        payload.scatters.wins
            .filter(value => value.symbolId == this.scatterId)
            .map(scatter => {
                return scatter.symbols.filter(value => this.reelsForScatterLand.includes(value.x));
            }).flat().sort((a, b) => a.x - b.x).reduce((previousValue, currentValue) => {
                if (previousValue == this.scattersAmountForFeatureTrigger - 1) {
                    startAt = this.reelsForScatterLand[this.reelsForScatterLand.indexOf(currentValue.x) + 1];
                }
                if (previousValue > this.scattersAmountForFeatureTrigger - 1) {
                    endOn = endOn || currentValue.x;
                }
                return previousValue + 1;
            }, 1);
        if (startAt) {
            anticipationReels.fill(1, startAt, endOn);
            if (startAt == endOn) {
                anticipationReels[startAt] = 1;
            }
        }
        return anticipationReels;
    }
}

export class CountryAdventureAnticipationReelsProvider implements AnticipationReelsProvider<TScatterWinResult> {
    constructor(
        protected reelsAmount: number,
        private scatterId: number,
        private scattersAmountForFeatureTrigger: number,
        private reelsForScatterLand: number[],
    ) {
        this.reelsForScatterLand.sort((a, b) => a - b);
    }

    provide(payload: TScatterWinResult): number[] {
        const anticipationReels: number[] = new Array(this.reelsAmount).fill(0);
        let startAt = this.reelsAmount;
        payload.scatters.wins
            .filter(value => value.symbolId == this.scatterId)
            .map(scatter => {
                return scatter.symbols.filter(value => this.reelsForScatterLand.includes(value.x));
            }).flat().sort((a, b) => a.x - b.x).reduce((previousValue, currentValue) => {
                if (previousValue == this.scattersAmountForFeatureTrigger - 1) {
                    startAt = this.reelsForScatterLand[this.reelsForScatterLand.indexOf(currentValue.x) + 1];
                }
                return previousValue + 1;
            }, 1);
        if (startAt) {
            anticipationReels.forEach((_, index, anticipationReels) =>{
                if (index >= startAt && this.reelsForScatterLand.contains(index)) {
                    anticipationReels[index] = 1;
                }
            });
        }
        return anticipationReels;
    }
}

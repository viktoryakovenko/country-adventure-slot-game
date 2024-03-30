import {TBet} from "app/server/service/typing";
import Signal from "app/helpers/signals/signal/Signal";
import BigWinCalculator from "app/game/BigWinCalculator";
import {ensure} from "app/helpers/ObjectHelper";

export default class BetModel {
    protected chosenBet = 1;
    readonly chosenBetUpdated: Signal<number> = new Signal<number>();

    constructor(protected bets: TBet[], protected gameData:{linesId:number}) {

    }

    getChosenBet(): TBet {
        return this.getBet(this.chosenBet);
    }

    getBet(chosenBet: number): TBet {
        return ensure(this.bets.find(value => value.id == chosenBet));
    }

    setBet(betId: number) {
        this.chosenBet = betId;
        this.chosenBetUpdated.emit(betId);
    }

    get bigWinCalculator(): BigWinCalculator {
        return new BigWinCalculator(this.getTotalBet());
    }

    getTotalBet() {
        return this.getBet(this.chosenBet).value;
    }
}

import {GameState} from "app/game/states/GameState";
import {ensure} from "app/helpers/ObjectHelper";
import {TScatterWin} from "app/server/service/typing";

export default class ScatterWinState extends GameState {
    enable(): boolean {
        return super.enable() && this.spinResponse.scatters.wins.length > 0;
    }

    async run(): Promise<GameState> {
        const scatterWins = this.spinResponse.scatters.wins;
        if (this.spinResponse.scatters.totalWin > 0) {
            const scatterWin = ensure(scatterWins.find(scatter => scatter.win > 0));
            await this.showScatterWins(scatterWin);
        }
        const fsScatterWin = scatterWins.find(scatter => scatter.win == 0);
        if (fsScatterWin && fsScatterWin.symbolsAmount == 3) {
            await this.showScatterWins(fsScatterWin);
        }
        return this;
    }

    private async showScatterWins(scatterWin: TScatterWin) {
        const reel = this.gameSignals.reels;
        reel.dimAllSymbols.emit({dim: true, except: scatterWin.symbols});
        this.gameSignals.ui.showWin.emit({win: scatterWin.win});
        await reel.showScatterWins.emit([scatterWin]).all();
    }
}

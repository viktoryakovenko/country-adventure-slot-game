import {GameState} from "app/game/states/GameState";
import {inject} from "app/model/injection/InjectDecorator";
import BetModel from "app/model/BetModel";
import {TWin} from "app/server/service/typing";
import usablePromises from "app/helpers/promise/UsablePromises";

export default class WinLineState extends GameState {
    @inject(BetModel)
    protected betModel!: BetModel;
    private readonly delayBetweenEachLineDisplay = 500;
    enable(): boolean {
        return super.enable() && this.spinResponse.winLines.wins.length > 0;
    }

    async run(): Promise<GameState> {
        this.gameSignals.reels.dimAllSymbols.emit({dim: true});
        await this.showWinsLineByLine(this.spinResponse.winLines.wins);
        await this.showAllWins(this.spinResponse.winLines.wins);
        const winsWin = this.spinResponse.winLines.totalWin;
        this.gameSignals.ui.showWin.emit({win: winsWin});
        return this;
    }

    private async showWin(winLines: TWin[]) {
        const reel = this.gameSignals.reels;
        const winSymbols = this.mainGameModel.getWinSymbolsPositions(winLines);
        reel.undimSpecificSymbols.emit(winSymbols);
        await reel.showLineWins.emit(winLines).all();
        await usablePromises.getTimeoutOrClickOnStagePromise(this.delayBetweenEachLineDisplay);
        reel.dimSpecificSymbols.emit(winSymbols);
    }
    private async showAllWins(winLines: TWin[]) {
        await this.showWin(winLines);
    }
    private async showWinsLineByLine(winLines: TWin[]) {
        for (const win of winLines) {
            const winSymbols = this.mainGameModel.getWinSymbolsPositions([win]);
            this.gameSignals.reels.addWinLable.emit(
                {symbol:winSymbols[Math.floor(winSymbols.length/2)], 
                win:win.win*this.betModel.getChosenBet().value});
            await this.showWin([win]);
            this.gameSignals.reels.removeWinLable.emit(winSymbols[Math.floor(winSymbols.length/2)]);
        }
    }
}

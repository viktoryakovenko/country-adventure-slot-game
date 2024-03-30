import {TSpinResponse, TWin} from "app/server/service/typing";
import {Composer} from "app/scenes/model/Scene";
import gameModel from "app/model/GameModel";

export default class MainGameModel implements Composer<MainGameModel> {
    protected tSpinResponse!: TSpinResponse;

    compose(): MainGameModel {
        gameModel.game.signals.data.spin.add(value => this.tSpinResponse = value);
        return this;
    }

    get spinResponse(): TSpinResponse {
        return this.tSpinResponse;
    }

    getMainGameWin() {
        const lineWin = this.spinResponse.winLines.totalWin;
        const scatterWin = this.spinResponse.scatters.totalWin;
        return lineWin + scatterWin;
    }

    getInitialWinForFreeSpinsGame() {
        return this.spinResponse.scatters.wins.reduce(
            (previousValue, currentValue) => previousValue + currentValue.win, 0
        );
    }

    getWinSymbolsPositions(wins: TWin[]): {x: number, y: number}[] {
        const result: {x: number, y: number}[] = [];
        const cache: Record<`${number}_${number}`, boolean> = {};
        const lines = gameModel.mainGameInfo.lines;
        wins.forEach(win => {
            lines[win.lineId].forEach((lineOffset, index) => {
                if (index < win.symbolsAmount) {
                    if (cache[`${index}_${lineOffset}`]) {
                        return;
                    }
                    cache[`${index}_${lineOffset}`] = true;
                    result.push({
                        x: index, y: lineOffset,
                    });
                }
            });
        });
        return result;
    }
}

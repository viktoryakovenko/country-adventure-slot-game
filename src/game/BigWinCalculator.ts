type WinType =
    "LOW" |
    "MEDIUM" |
    "BIG" |
    "SUPER" |
    "EPIC"
    ;

export default class BigWinCalculator {
    constructor(protected bet: number) {

    }

    readonly settings = {
        lowWinLimit: 1,
        mediumWinLimit: 5,
        bigWinLimit: 15,
        superWinLimit: 30,
        epicWinLimit: 60,
    };

    isBigWin(win: number) {
        return !this.isLowWin(win);
    }

    isLowWin(win: number) {
        return win < (this.settings.lowWinLimit * this.bet);
    }

    getWinType(win: number): WinType {
        if (win < (this.settings.lowWinLimit * this.bet)) {
            return "LOW";
        }
        if (win < (this.settings.mediumWinLimit * this.bet)) {
            return "MEDIUM";
        }
        if (win < (this.settings.bigWinLimit * this.bet)) {
            return "BIG";
        }
        if (win < (this.settings.superWinLimit * this.bet)) {
            return "SUPER";
        }
        return "EPIC";
    }
}

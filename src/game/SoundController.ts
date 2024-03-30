import {Howl} from "howler";
import gameModel from "app/model/GameModel";
import {Composer, Disposer} from "app/scenes/model/Scene";
import {TScatterWin} from "app/server/service/typing";
import gameLocalStorage from "app/helpers/GameLocalStorage";
import {$} from "app/model/injection/InjectDecorator";
import BetModel from "app/model/BetModel";

class ReelSoundsController implements Composer, Disposer {
    private spinSoundId = -1;
    private anticipationSoundId = -1;
    private scatterReels: number[] = [];
    private coinShower: SoundCoinShower;

    constructor(private howler: Howl) {
        this.coinShower = new SoundCoinShower(howler);
    }

    compose(): void {
        const gameSignals = gameModel.game.signals;
        gameSignals.spinStarted.add(this.onSpinStarted, this);
        gameSignals.spinComplete.add(this.onSpinComplete, this);
        gameSignals.reels.stopped.add(this.onReelStopped, this);
        gameSignals.reels.showScatterWins.add(this.showScatterWins, this);
        gameSignals.reels.showLineWins.add(this.showWins, this);
        gameSignals.reels.anticipationShown.add(this.onAnticipationShown, this);
        gameSignals.reels.anticipationShown.add(this.onAnticipationShown, this);
        gameSignals.reels.anticipationShown.add(this.onAnticipationShown, this);
        gameSignals.ui.balance.startBalanceAnimation.add(this.onDisplayBonusScatterWin, this);
        gameSignals.ui.balance.balanceChangesDisplayed.add(this.onBonusScatterWinDisplayed, this);
        gameSignals.reels.scatterReels.add(scatterReels => this.scatterReels = scatterReels, this);
    }

    dispose(): void {
        const gameSignals = gameModel.game.signals;
        gameSignals.spinStarted.unload(this);
        gameSignals.spinComplete.unload(this);
        gameSignals.reels.stopped.unload(this);
        gameSignals.reels.showScatterWins.unload(this);
        gameSignals.reels.showLineWins.unload(this);
        gameSignals.reels.anticipationShown.unload(this);
        gameSignals.reels.anticipateReels.unload(this);
        gameSignals.reels.scatterReels.unload(this);
        gameSignals.ui.balance.startBalanceAnimation.unload(this);
        gameSignals.ui.balance.balanceChangesDisplayed.unload(this);
    }

    private onSpinStarted() {
        this.howler.stop(this.spinSoundId);
        this.spinSoundId = this.howler.play("reel-spin");
        this.howler.fade(0, 1, 200, this.spinSoundId);
        this.howler.play("spin-button");
        this.howler.play("reel-spin-start");
    }

    private onReelStopped(reelId: number) {
        this.howler.play("reel-stop");
        if (reelId == 0) {
            const id = this.howler.play("reel-spin-stop");
            this.howler.volume(0.5, id);
        }
        if (this.scatterReels[reelId] == 1) {
            this.howler.play("scatter_land");
        }
        if (reelId == 4) {
            this.howler.stop(this.spinSoundId);
        }
    }

    private showScatterWins(scatterWins: TScatterWin[], resolve?: () => void) {
        if (scatterWins.find(value => value.win > 0)) {
            this.howler.play("coin");
        } else if (scatterWins[0]?.symbolsAmount == 3) {
            this.howler.play("scatter_preview");
            setTimeout(()=>{
                this.howler.play("scatter_preview");
            }, 500);
        }
        resolve?.();
    }

    private showWins(_: unknown, resolve?: () => void) {
        this.howler.play("win-line");
        this.howler.play("coin");
        resolve?.();
    }

    private onDisplayBonusScatterWin(_: unknown, resolve?: () => void) {
        this.coinShower.play();
        resolve?.();
    }

    private onBonusScatterWinDisplayed(_: unknown, resolve?: () => void) {
        this.coinShower.stop();
        resolve?.();
    }

    private onSpinComplete() {
        if (this.anticipationSoundId >= 0) {
            this.howler.fade(0.25, 0, 100, this.anticipationSoundId);
            this.anticipationSoundId = -1;
        }
    }

    private onAnticipationShown() {
        this.anticipationSoundId = this.howler.play("anticipation");
        this.howler.fade(0.125, 0, 1500, this.anticipationSoundId);
    }
}

class BackgroundSoundController implements Composer, Disposer {
    private themeSoundId = -1;
    private themeAmbientSoundId = -1;
    private state: "free_spins" | "free_game" | "base_game" | "auto_spins_game" = "base_game";

    constructor(readonly howler: Howl, readonly coinShower: SoundCoinShower) {
    }

    compose(): void {
        const gameSignals = gameModel.game.signals;
        gameSignals.popup.fsIntro.show.add(this.onFreeSpinsIntro, this);
        gameSignals.popup.fsOutro.show.add(this.onFreeSpinsOutro, this);
        gameSignals.popup.fsOutro.shown.add(this.onFreeSpinsOutroShown, this);
        gameSignals.popup.fsOutro.hide.add(this.onMainGame, this);
        gameSignals.popup.fsIntro.hide.add(this.onFreeSpinsGame, this);
        gameModel.firstUserInteractionPromise.then(this.onInit.bind(this));
    }

    dispose(): void {
        const gameSignals = gameModel.game.signals;
        gameSignals.popup.fsIntro.show.unload(this);
        gameSignals.popup.fsOutro.show.unload(this);
        gameSignals.popup.fsOutro.hide.unload(this);
        gameSignals.popup.fsIntro.hide.unload(this);
    }

    private onFreeSpinsIntro(_: number, resolve?: () => void) {
        this.howler.fade(0.25, 0, 500, this.themeSoundId);
        this.howler.fade(0.125, 0, 500, this.themeAmbientSoundId);
        this.themeSoundId = this.howler.play("fs-transition1");
        this.howler.fade(0, 0.25, 500, this.themeSoundId);
        resolve?.();
    }

    private onMainGame(_: void, resolve?: () => void) {
        this.howler.fade(0.25, 0, 500, this.themeSoundId);
        this.howler.fade(0.125, 0, 500, this.themeAmbientSoundId);
        this.themeSoundId = this.howler.play("main-game-loop");
        this.themeAmbientSoundId = this.howler.play("main-game-ambient.loop");
        this.howler.fade(0, 0.125, 500, this.themeSoundId);
        this.howler.fade(0, 0.125, 500, this.themeAmbientSoundId);
        resolve?.();
    }

    private onFreeSpinsOutro(_: number, resolve?: () => void) {
        this.state = "base_game";
        this.howler.fade(0.25, 0, 500, this.themeSoundId);
        this.howler.fade(0.125, 0, 500, this.themeAmbientSoundId);
        this.themeSoundId = this.howler.play("fs-transition2");
        this.howler.fade(0, 0.125, 500, this.themeSoundId);
        this.coinShower.play();
        resolve?.();
    }

    private onFreeSpinsOutroShown() {
        this.coinShower.stop();
    }

    private onFreeSpinsGame(_: void, resolve?: () => void) {
        this.state = "free_spins";
        this.howler.fade(0.25, 0, 500, this.themeSoundId);
        this.howler.fade(0.125, 0, 500, this.themeAmbientSoundId);
        this.themeSoundId = this.howler.play("fs-game-loop");
        this.howler.fade(0, 0.25, 500, this.themeSoundId);
        resolve?.();
    }

    private onInit() {
        this.themeSoundId = this.howler.play("main-game-loop");
        this.themeAmbientSoundId = this.howler.play("main-game-ambient.loop");
        this.howler.fade(0, 0.125, 500, this.themeSoundId);
        this.howler.fade(0, 0.125, 500, this.themeAmbientSoundId);
    }
}

class PopupSoundController implements Composer, Disposer {
    constructor(readonly howler: Howl) {
    }

    compose(): void {
        const gameSignals = gameModel.game.signals;
        gameSignals.popup.winCounter.show.add(this.onShowWin, this);
        gameSignals.popup.winCounter.shown.add(this.onWinShown, this);
        gameSignals.popup.winCounter.hide.add(this.onHideWin, this);
    }

    dispose(): void {
        const gameSignals = gameModel.game.signals;
        gameSignals.popup.winCounter.show.unload(this);
        gameSignals.popup.winCounter.shown.unload(this);
        gameSignals.popup.winCounter.hide.unload(this);
    }

    private onShowWin(win: number, resolve?: () => void) {
        const winType = $(BetModel).bigWinCalculator.getWinType(win);
        switch (winType) {
            case "LOW":
                this.howler.play("low_win_popup");
                break;
            case "MEDIUM":
                this.howler.play("mid_win_popup");
                break;
            case "BIG":
            case "SUPER":
            case "EPIC":
                this.howler.play("big_win_popup");
                break;
        }
        resolve?.();
    }

    protected onWinShown() {}

    private onHideWin(_: void, resolve?: () => void) {
        const id = this.howler.play("win-line");
        this.howler.volume(0.1, id);
        this.howler.rate(0.7, id);
        resolve?.();
    }
}

export default class SoundController implements Composer, Disposer {
    private readonly coinShower: SoundCoinShower;
    private readonly reelSoundsController: ReelSoundsController;
    private backgroundSoundController: BackgroundSoundController;
    private popupSoundController: PopupSoundController;

    constructor(private howler: Howl) {
        this.coinShower = new SoundCoinShower(howler);
        this.reelSoundsController = new ReelSoundsController(howler);
        this.backgroundSoundController = new BackgroundSoundController(howler, this.coinShower);
        this.popupSoundController = new PopupSoundController(howler);
    }

    compose(): void {
        const gameSignals = gameModel.game.signals;
        gameSignals.popup.winCounter.show.add(this.onWinCounter, this);
        gameSignals.popup.winCounter.shown.add(this.onWinCounterShown, this);
        gameSignals.ui.options.toggleSound.add(() => {
            gameModel.getHowler().mute(!gameModel.isSoundMuted);
            gameModel.isSoundMuted = !gameModel.isSoundMuted;
            gameLocalStorage.setItem("isSoundMuted", gameModel.isSoundMuted.toString());
        }, this);
        this.reelSoundsController.compose();
        this.backgroundSoundController.compose();
        this.popupSoundController.compose();
    }

    dispose(): void {
        const gameSignals = gameModel.game.signals;
        gameSignals.popup.winCounter.show.unload(this);
        gameSignals.popup.winCounter.shown.unload(this);
        gameSignals.ui.options.toggleSound.unload(this);
        this.reelSoundsController.dispose();
        this.backgroundSoundController.dispose();
        this.popupSoundController.dispose();
    }

    private onWinCounter(_: number, resolve?: () => void) {
        this.coinShower.play();
        resolve?.();
    }

    private onWinCounterShown(_: void, resolve?: () => void) {
        this.coinShower.stop();
        resolve?.();
    }
}

class SoundCoinShower {
    private intervalId = -1;

    constructor(private howl: Howl) {
    }

    play() {
        this.stop();
        this.intervalId = setInterval(() => {
            const id = this.howl.play("coin");
            this.howl.volume(0.2, id);
        }, 60);
    }

    stop() {
        clearInterval(this.intervalId);
    }
}
